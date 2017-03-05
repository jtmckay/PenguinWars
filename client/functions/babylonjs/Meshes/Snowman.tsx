import * as BABYLON from 'babylonjs';
import Gravitator from '../Gravitator';
import KeyboardControl from '../../../classes/KeyboardControl';
import degreesToRadians from '../../degreesToRadians';

export default class {
  constructor(dispose: (Snowman: any) => void,
    scene: BABYLON.Scene,
    gravitator: Gravitator,
    ground: BABYLON.Mesh,
    shadowGenerator: BABYLON.ShadowGenerator,
    target: BABYLON.Vector3,
    keyboardControl: KeyboardControl
  ) {
    this.hits = [];
    let baseMovementSpeed = 15;
    let movementSpeed = baseMovementSpeed;
    let multiplier = 1;
    let yVector = new BABYLON.Vector2(0, 1);
    let vector2 = new BABYLON.Vector2(0, 0);
    let angle: BABYLON.Angle;
    let applicableForce = BABYLON.Vector3.Zero();

    let snowmanAction: BABYLON.Action;
    BABYLON.SceneLoader.ImportMesh("snowman", "babylonjs/", "snowman.babylon", scene, function (newMeshes) {
      let snowmanMesh = newMeshes[0];
      this.snowmanMesh = snowmanMesh;
      snowmanMesh.scaling = new BABYLON.Vector3(15, 15, 15);
      let snowmanSphere = BABYLON.MeshBuilder.CreateSphere("Snowman", {segments: 2, diameter: 80 }, scene);
      this.snowmanSphere = snowmanSphere;
      snowmanSphere.isVisible = false;
      let physicsBody = snowmanSphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor,
        {mass: 1, friction: 100, restitution: .001});
      this.physicsBody = physicsBody;
      snowmanSphere.position = snowmanMesh.position;

      snowmanSphere.position.y = 400;
      snowmanSphere.position.x = target.x + (Math.random() * 1000 + 1000) * this.randomOperator();
      snowmanSphere.position.z = target.z + (Math.random() * 1000 + 1000) * this.randomOperator();
      snowmanSphere.position.x = snowmanSphere.position.x > 3000 ? 3000 : snowmanSphere.position.x < -3000 ? -3000 : snowmanSphere.position.x;
      snowmanSphere.position.z = snowmanSphere.position.z > 3000 ? 3000 : snowmanSphere.position.z < -3000 ? -3000 : snowmanSphere.position.z;

      snowmanAction = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
        multiplier = scene.getAnimationRatio();
        if (this.hits.length < 1) {
          gravitator.applyGravityWithGroundConstraints(physicsBody, snowmanSphere, multiplier, 35);
          physicsBody.angularVelocity.scaleEqual(.96);
          physicsBody.linearVelocity.scaleEqual(.96);

          if (keyboardControl.shift) {
            movementSpeed = baseMovementSpeed * 2;
          }
          else {
            movementSpeed = baseMovementSpeed;
          }

          vector2.x = target.x - snowmanMesh.position.x;
          vector2.y = target.z - snowmanMesh.position.z;
          angle = BABYLON.Angle.BetweenTwoPoints(yVector, vector2);
          applicableForce.x = Math.cos(angle.radians()) * multiplier * movementSpeed;
          applicableForce.z = Math.sin(angle.radians()) * multiplier * movementSpeed;
          snowmanSphere.applyImpulse(applicableForce, snowmanSphere.position);
          snowmanMesh.rotation.y = -angle.radians();
        }
        else {
          if (gravitator.removeBelowGround(snowmanSphere, snowmanAction, 30, snowmanMesh)) {
            gravitator.applyGravity(snowmanSphere, multiplier);
            physicsBody.linearVelocity.scaleEqual(.7);
          }
          else {
            dispose(this);
          }
        }
      }.bind(this)));
      shadowGenerator.getShadowMap().renderList.push(snowmanMesh);
    }.bind(this));
  }
  hits: Array<any>;
  snowmanMesh: BABYLON.Mesh;
  snowmanSphere: BABYLON.Mesh;
  physicsBody: any;

  randomOperator() {
    return Math.round(Math.random() * 1) % 2 ? 1 : -1;
  }
}
