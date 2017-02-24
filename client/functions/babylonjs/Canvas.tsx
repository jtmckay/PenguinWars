import * as BABYLON from 'babylonjs';
import Settings from '../../classes/Settings';
import createScene from './Scene';
import createArcRotateCamera from './Camera';
import createParticleSystem from './Meshes/ParticleSystem';
import createWalls from './Meshes/Walls';
import { createLight, createHemisphericLight } from './Light';
import MouseControl from '../../classes/MouseControl';

export default function () {
  let canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

  let options: Settings = {
    movementSpeed: 100,
    jumpSpeed: 100,
    invertCameraOnTouch: false,
    showSettings: false,
    showKeyboard: false,
  };

  if (BABYLON.Engine.isSupported()) {
    let engine = new BABYLON.Engine(canvas, true);

    let scene = createScene(engine);
    let assetsManager = new BABYLON.AssetsManager(scene);
    let assetsLoaded: boolean = false;

    let hemisphericLight = createHemisphericLight(scene);
    let light = createLight(scene);
    let shadowGenerator = new BABYLON.ShadowGenerator(4096, light);

    let camera = createArcRotateCamera(scene, BABYLON.Vector3.Zero());
    let mouseControl = new MouseControl(canvas, camera, options.invertCameraOnTouch);
    mouseControl.leftMouseAction = (event) => alert('yay');
    canvas.addEventListener('touchstart', (event) => {
      camera.attachControl(canvas, true);
      shadowGenerator.getShadowMap().resize(1);
    });
    let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/A1.jpg", 8000, 8000, 50, -500, 500, scene);
    ground.material = (function() {
      let material = new BABYLON.StandardMaterial("texture1", scene);
      material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
      return material;
    })();
    ground.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {mass: 0});
    ground.receiveShadows = true;

    let walls = createWalls(scene);

    let particleSystem = createParticleSystem(scene, {
      capacity: 1000,
      texture: new BABYLON.Texture("textures/flare.png", scene),
      color1: new BABYLON.Color4(.1, .2, .8, 1),
      color2: new BABYLON.Color4(.2, .3, 1, 1) }
    );
    //runs every frame
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.name == "ground";
      });

      if (pickResult.hit) {
        particleSystem.emitter.position = pickResult.pickedPoint;
      }

    }));
  /*
    BABYLON.SceneLoader.ImportMesh("penguin", "babylonjs/", "penguin.babylon", scene, function(newMeshes) {
      this.random = newMeshes[0];
      this.random.scaling = new BABYLON.Vector3(10, 10, 10);
      this.random.position.z = 50;
      this.addShadows(this.random);
      let random = this.random.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {mass: 10});

      this.state.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
        this.gravitator.applyPhysics(random);
        this.gravitator.applyGravity(this.random);
        this.gravitator.applyGroundConstraints(random, this.random, 30);
        //car.linearVelocity.scaleEqual(.9);
      }.bind(this)));
    }.bind(this));
  */
    window.addEventListener("resize", function () {
      engine.resize();
    });

    assetsManager.onFinish = function (tasks) {
      assetsLoaded = true;
      console.log("Finish");
      assetsManager.reset();

      engine.hideLoadingUI();
      engine.runRenderLoop(function () {
        scene.render();
      });
    };
    assetsManager.onTaskError = function (task) {
      console.log("Error");
      console.log(task);
    };
    engine.displayLoadingUI();

    let addCharacterMeshTask = assetsManager.addMeshTask("add character", "penguin", "babylonjs/", "penguin.babylon");
    addCharacterMeshTask.onSuccess = function(task: any) {
      let characterMesh = task.loadedMeshes[0];
      characterMesh.scaling = new BABYLON.Vector3(10, 10, 10);
      //addShadows(this.characterMesh);
      shadowGenerator.getShadowMap().renderList.push(characterMesh);
      //this.load();
    };
    assetsManager.load();
  }
  return options;
}
