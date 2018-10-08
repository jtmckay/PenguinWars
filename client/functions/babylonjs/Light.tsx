import * as BABYLON from 'babylonjs';

function createHemisphericLight(scene: BABYLON.Scene) {
  let hemisphericLight = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
  hemisphericLight.diffuse = new BABYLON.Color3(.5, .5, .5);
  return hemisphericLight;
}

function createLight(scene: BABYLON.Scene) {
  let light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 1000, 0), scene);
  light.diffuse = new BABYLON.Color3(.5, .5, .5);
  light.specular = new BABYLON.Color3(1, 1, 1);
  return light;
}

export { createHemisphericLight, createLight };
