import * as BABYLON from 'babylonjs';
import Gravitator from '../Gravitator';
import KeyboardControl from '../../../classes/KeyboardControl';
import degreesToRadians from '../../../functions/degreesToRadians';

export default class {
  constructor(scene: BABYLON.Scene,
    assetsManager: BABYLON.AssetsManager,
    camera: BABYLON.ArcRotateCamera,
    gravitator: Gravitator,
    ground: BABYLON.Mesh,
    shadowGenerator: BABYLON.ShadowGenerator,
    keyboardControl: KeyboardControl) {

    let baseMovementSpeed = 10;
    let movementSpeed;
    let multiplier = 1;
    let yVector = new BABYLON.Vector2(0, 1);
    let vector2 = new BABYLON.Vector2(0, 0);
    let angle: BABYLON.Angle;
    let applicableForce = BABYLON.Vector3.Zero();
    let angleAdjustment = 0;
    let canJump = true;
    let pullDown = true;
    let onGround = false;
    let dodging = false;
    let disabled = false;

    let characterAction: BABYLON.Action;
    let addCharacterMeshTask = assetsManager.addMeshTask("add character", "penguin", "babylonjs/", "penguin.babylon");
    addCharacterMeshTask.onSuccess = function(task: any) {
      let characterMesh = task.loadedMeshes[0];
      this.characterMesh = characterMesh;
      characterMesh.scaling = new BABYLON.Vector3(10, 10, 10);
      let characterSphere = BABYLON.Mesh.CreateSphere("Character", 2, 60, scene, true);
      characterSphere.isVisible = false;
      let physicsBody = characterSphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor,
        {mass: 100, friction: 100, restitution: .001});
      this.physicsBody = physicsBody;
      characterSphere.position = characterMesh.position;
      characterSphere.position.x += 10;
      camera.target = characterSphere.position;
      let animationVerticalShrink = new BABYLON.Animation("shrink", "scaling.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      var keys = [];
      keys.push({
        frame: 0,
        value: 10
      });
      keys.push({
        frame: 10,
        value: 6
      });
      keys.push({
        frame: 20,
        value: 4
      });
      keys.push({
        frame: 35,
        value: 6
      });
      keys.push({
        frame: 100,
        value: 10
      });
      animationVerticalShrink.setKeys(keys);
      let animationFrontFlip = this.createFlipAnimation("frontflip", "rotation.z", true);
      let animationBackFlip = this.createFlipAnimation("backflip", "rotation.z", false);
      let animationLeftFlip = this.createFlipAnimation("leftflip", "rotation.x", false);
      let animationRightFlip = this.createFlipAnimation("rightflip", "rotation.x", true);

      characterAction = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
        multiplier = scene.getAnimationRatio();
        movementSpeed = baseMovementSpeed * multiplier;
        //Only pull down again once the character mesh has gone below the ground and the character can jump again
        if (!pullDown && canJump) {
          var pickInfo = ground.intersects(
            new BABYLON.Ray(
              new BABYLON.Vector3(characterSphere.position.x, characterSphere.position.y - 10, characterSphere.position.z),
              new BABYLON.Vector3(0, 1, 0)
            ));
          if (pickInfo.hit) {
            pullDown = true;
          }
        }
        if (dodging || disabled) {
          keyboardControl.resetDoubles();
          onGround = gravitator.applyGravityWithGroundConstraints(physicsBody, characterSphere, multiplier, 10, true);
          if (!dodging && disabled) {
            applicableForce.x = -physicsBody.linearVelocity.x;
            applicableForce.z = -physicsBody.linearVelocity.z;
            characterSphere.applyImpulse(applicableForce, characterSphere.position);
          }
        }
        else {
          if (keyboardControl.space && onGround && canJump && pullDown) {
            applicableForce.y = 100;
            canJump = false;
            pullDown = false;
            setTimeout(function() {
              canJump = true;
            }, 500);
          }
          onGround = gravitator.applyGravityWithGroundConstraints(physicsBody, characterSphere, multiplier, 10, pullDown);
          gravitator.applyDeterioration(physicsBody);
          vector2.x = characterSphere.position.x - camera.position.x;
          vector2.y = characterSphere.position.z - camera.position.z;
          angle = BABYLON.Angle.BetweenTwoPoints(yVector, vector2);

          if (keyboardControl.w || keyboardControl.a || keyboardControl.s || keyboardControl.d ||
          keyboardControl.doubleW || keyboardControl.doubleA || keyboardControl.doubleS || keyboardControl.doubleD) {
            angleAdjustment = (keyboardControl.a || keyboardControl.doubleA ? 90 : 0) - (keyboardControl.d || keyboardControl.doubleD ? 90 : 0);
            if (((keyboardControl.w || keyboardControl.doubleW) &&
            !keyboardControl.s && !keyboardControl.s ||
            (keyboardControl.s || keyboardControl.doubleS) &&
            !keyboardControl.w && !keyboardControl.doubleW)) {
              angleAdjustment = angleAdjustment/2;
            }
            if (!keyboardControl.w && (keyboardControl.s || keyboardControl.doubleS)) {
              angleAdjustment = -angleAdjustment;
            }
            applicableForce.x = (!keyboardControl.w && (keyboardControl.s || keyboardControl.doubleS) ? -movementSpeed : movementSpeed) * Math.cos(angle.radians() + degreesToRadians(angleAdjustment));
            applicableForce.z = (!keyboardControl.w && (keyboardControl.s || keyboardControl.doubleS) ? -movementSpeed : movementSpeed) * Math.sin(angle.radians() + degreesToRadians(angleAdjustment));
          }
          else {
            keyboardControl.resetDoubles();
          }
          if (keyboardControl.shift) {
            keyboardControl.resetDoubles();
            //Glide movement
            characterSphere.applyImpulse(applicableForce, characterSphere.position);
          }
          else {
            if (keyboardControl.doubleW || keyboardControl.doubleA || keyboardControl.doubleS || keyboardControl.doubleD) {
              //Dodge movement
              if (keyboardControl.w || keyboardControl.doubleW) {
                characterMesh.animations.push(animationVerticalShrink);
                characterMesh.animations.push(animationFrontFlip);
                scene.beginAnimation(characterMesh, 0, 100, false, 1, function() {
                  characterMesh.animations.length = 0;
                }.bind(this));
              }
              else if (keyboardControl.s || keyboardControl.doubleS) {
                characterMesh.animations.push(animationVerticalShrink);
                characterMesh.animations.push(animationBackFlip);
                scene.beginAnimation(characterMesh, 0, 100, false, 1, function() {
                  characterMesh.animations.length = 0;
                }.bind(this));
              }
              else if ((keyboardControl.a || keyboardControl.doubleA) && !keyboardControl.d && !keyboardControl.doubleD) {
                characterMesh.animations.push(animationVerticalShrink);
                characterMesh.animations.push(animationLeftFlip);
                scene.beginAnimation(characterMesh, 0, 100, false, 1, function() {
                  characterMesh.animations.length = 0;
                }.bind(this));
              }
              else if ((keyboardControl.d || keyboardControl.doubleD) && !keyboardControl.a && !keyboardControl.doubleA) {
                characterMesh.animations.push(animationRightFlip);
                characterMesh.animations.push(animationVerticalShrink);
                scene.beginAnimation(characterMesh, 0, 100, false, 1, function() {
                  characterMesh.animations.length = 0;
                }.bind(this));
              }
              applicableForce.x = applicableForce.x * 100 - physicsBody.linearVelocity.x;
              applicableForce.z = applicableForce.z * 100 - physicsBody.linearVelocity.z;
              dodging = true;
              disabled = true;
              setTimeout(function() {
                dodging = false;
              }, 200);
              //Delay before allowing movement again
              //See KeyboardControl keyup
              setTimeout(function() {
                disabled = false;
              }, 1500);
            }
            else {
              //Strict movement
              applicableForce.x = applicableForce.x * 20 - physicsBody.linearVelocity.x;
              applicableForce.z = applicableForce.z * 20 - physicsBody.linearVelocity.z;
            }
            characterSphere.applyImpulse(applicableForce, characterSphere.position);
          }
          applicableForce.x = 0;
          applicableForce.y = 0;
          applicableForce.z = 0;
          characterMesh.rotation.y = -camera.alpha -
          ((keyboardControl.w || keyboardControl.doubleW) && (keyboardControl.a || keyboardControl.doubleA) ? degreesToRadians(45) : 0) +
          ((keyboardControl.w || keyboardControl.doubleW) && (keyboardControl.d || keyboardControl.doubleD) ? degreesToRadians(45) : 0) +
          ((keyboardControl.s || keyboardControl.doubleS) && (keyboardControl.a || keyboardControl.doubleA) ? degreesToRadians(45) : 0) -
          ((keyboardControl.s || keyboardControl.doubleS) && (keyboardControl.d || keyboardControl.doubleD) ? degreesToRadians(45) : 0);
        }
      }.bind(this)));
      shadowGenerator.getShadowMap().renderList.push(characterMesh);
    }.bind(this);
  }
  characterMesh: BABYLON.Mesh;
  physicsBody: any;

  createFlipAnimation(name: string, targetProperty: string, positive: boolean = true) {
    var animationFlip = new BABYLON.Animation(name, targetProperty, 90, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var keys = [];
    keys.push({
      frame: 0,
      value: 0
    });
    keys.push({
      frame: 10,
      value: degreesToRadians(positive ? 90 : -90)
    });
    keys.push({
      frame: 20,
      value: degreesToRadians(positive ? 180 : -180)
    });
    keys.push({
      frame: 35,
      value: degreesToRadians(positive ? 270 : -270)
    });
    keys.push({
      frame: 100,
      value: degreesToRadians(positive ? 360 : -360)
    });
    animationFlip.setKeys(keys);
    return animationFlip;
  }
}
