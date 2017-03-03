import * as BABYLON from 'babylonjs';
import Gravitator from '../Gravitator';
import createParticleSystem from './ParticleSystem';

export default class {
  constructor(scene: BABYLON.Scene,
    gravitator: Gravitator,
    shadowGenerator: BABYLON.ShadowGenerator,
    characterPosition: BABYLON.Vector3,
    targetPosition: BABYLON.Vector3,
    vertical: number,
    additionalImpulse: BABYLON.Vector3 = BABYLON.Vector3.Zero()) {
    let snowBall = BABYLON.Mesh.CreateSphere("Snowball", 6, 10, scene, true);
    shadowGenerator.getShadowMap().renderList.push(snowBall);
    let material = new BABYLON.StandardMaterial("texture1", scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    snowBall.material = material;
    snowBall.position = new BABYLON.Vector3(characterPosition.x, characterPosition.y + 20, characterPosition.z);

    let particleSystem = createParticleSystem(scene, {
      capacity: 500,
      texture: new BABYLON.Texture("textures/flare.png", scene),
      color1: new BABYLON.Color4(1, 1, 1, 1),
      color2: new BABYLON.Color4(1, 1, 1, 1) }
    );
    particleSystem.disposeOnStop = true;
    particleSystem.emitter.position = snowBall.position;
    let physicalSnowBall = snowBall.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 1000 } as any);
    let x = targetPosition.x - snowBall.position.x;
    let y = targetPosition.y - snowBall.position.y;
    let z = targetPosition.z - snowBall.position.z;
    let vector1 = new BABYLON.Vector2(0, 1);
    //Target position relative to the character
    let vector2 = new BABYLON.Vector2(x, z);
    let angle = BABYLON.Angle.BetweenTwoPoints(vector1, vector2);
    let distance = Math.sqrt(x*x+z*z);
    let vector3 = new BABYLON.Vector2(distance, y);
    let verticalAngle = BABYLON.Angle.BetweenTwoPoints(vector1, vector3);
    let sceneAnimationRatio = scene.getAnimationRatio();
    let power = 1000 * sceneAnimationRatio;

    snowBall.applyImpulse(
      new BABYLON.Vector3(
        power * Math.cos(angle.radians()) + additionalImpulse.x,
        vertical + additionalImpulse.y,
        power * Math.sin(angle.radians()) + additionalImpulse.z
      ),
      snowBall.position);
    let action = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      if (gravitator.removeBelowGround(snowBall, scene, action)) {
        gravitator.applyGravity(snowBall, scene.getAnimationRatio());
      }
      //removed
      else {
        particleSystem.stop();
      }
    }.bind(this)));
  }
}
