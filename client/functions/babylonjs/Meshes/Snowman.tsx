import * as BABYLON from 'babylonjs';
import Gravitator from '../Gravitator';
import KeyboardControl from '../../../classes/KeyboardControl';
import degreesToRadians from '../../../functions/degreesToRadians';

export default class {
  constructor(scene: BABYLON.Scene,
    gravitator: Gravitator,
    ground: BABYLON.Mesh,
    shadowGenerator: BABYLON.ShadowGenerator,
    target: BABYLON.Vector3) {

    let baseMovementSpeed = 1;
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
      snowmanSphere.isVisible = false;
      let physicsBody = snowmanSphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor,
        {mass: 1, friction: 100, restitution: .001});
      this.physicsBody = physicsBody;
      snowmanSphere.position = snowmanMesh.position;
      /*
      snowmanSphere.position.x = target.x + (Math.random() * 200 + 500) * this.randomOperator();
      snowmanSphere.position.z = target.z + (Math.random() * 200 + 500) * this.randomOperator();
      snowmanSphere.position.x = snowmanSphere.position.x > 3000 ? 3000 : snowmanSphere.position.x < -3000 ? -3000 : snowmanSphere.position.x;
      snowmanSphere.position.z = snowmanSphere.position.z > 3000 ? 3000 : snowmanSphere.position.z < -3000 ? -3000 : snowmanSphere.position.z;
      console.log(snowmanSphere.position);
      */
      snowmanAction = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
        multiplier = scene.getAnimationRatio();
        gravitator.applyGravityWithGroundConstraints(physicsBody, snowmanSphere, multiplier, 30);
        gravitator.applyDeterioration(physicsBody);

        vector2.x = target.x - snowmanMesh.position.x;
        vector2.y = target.z - snowmanMesh.position.z;
        angle = BABYLON.Angle.BetweenTwoPoints(yVector, vector2);
        applicableForce.x = Math.cos(angle.radians()) * multiplier * baseMovementSpeed;
        applicableForce.z = Math.sin(angle.radians()) * multiplier * baseMovementSpeed;
        snowmanSphere.applyImpulse(applicableForce, snowmanSphere.position);
        snowmanMesh.rotation.y = -angle.radians();
      }.bind(this)));
      shadowGenerator.getShadowMap().renderList.push(snowmanMesh);
    }.bind(this));
  }
  snowmanMesh: BABYLON.Mesh;
  physicsBody: any;

  randomOperator() {
    return Math.round(Math.random() * 1) % 2;
  }
}
