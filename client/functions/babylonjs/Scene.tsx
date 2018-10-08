import * as BABYLON from 'babylonjs';

function createScene(engine: BABYLON.Engine): BABYLON.Scene {
  let scene = new BABYLON.Scene(engine);
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.collisionsEnabled = true;
  scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.OimoJSPlugin() as any);
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogDensity = .0003;
  return scene;
}

export default createScene;
