import * as BABYLON from 'babylonjs';

function createPlane(scene: BABYLON.Scene, options: {
  size: number,
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3
  material: BABYLON.Material,
}): BABYLON.Mesh {
  let plane = BABYLON.Mesh.CreatePlane("plane", options.size, scene);
  plane.position = options.position;
  plane.rotation = options.rotation;
  plane.material = options.material;
  plane.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, {mass: 0});
  return plane;
}

export default createPlane;
