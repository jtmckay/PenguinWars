import * as BABYLON from 'babylonjs';

function createArcRotateCamera(scene: BABYLON.Scene, target: BABYLON.Vector3) {
  let camera = new BABYLON.ArcRotateCamera("Camera", 1, 1, 90, target, scene);
  camera.checkCollisions = true;
  camera.inertia = 0;
  camera.lowerRadiusLimit = 200;
  camera.upperRadiusLimit = 1000;
  camera.radius = 700;
  camera.lowerBetaLimit = .1;
  camera.upperBetaLimit = Math.PI/2;

  document.addEventListener('mousewheel', function (event) {
    let newRadius = camera.radius + event.deltaY/5;
    if (camera.lowerRadiusLimit <= newRadius && camera.upperRadiusLimit >= newRadius) {
      camera.radius = newRadius;
    }
  });

  return camera;
}

export default createArcRotateCamera;
