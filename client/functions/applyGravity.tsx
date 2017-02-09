import * as BABYLON from 'babylonjs';

export default function (physicsBody: BABYLON.Mesh, scale: number) {
  physicsBody.applyImpulse(new BABYLON.Vector3(0, -9.81 * scale * scale, 0), physicsBody.position);
}
