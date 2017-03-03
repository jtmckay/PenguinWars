import * as BABYLON from 'babylonjs';
import Gravitator from './Gravitator';
import Settings from '../../classes/Settings';
import createScene from './Scene';
import createArcRotateCamera from './Camera';
import createParticleSystem from './Meshes/ParticleSystem';
import createWalls from './Meshes/Walls';
import { createLight, createHemisphericLight } from './Light';
import MouseControl from '../../classes/MouseControl';
import KeyboardControl from '../../classes/KeyboardControl';
import Character from './Meshes/Character';
import Snowman from './Meshes/Snowman';
import Snowball from './Meshes/Snowball';

export default function () {
  let canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

  let options: Settings = {
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
    ground.checkCollisions = true;
    ground.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {mass: 0});
    ground.receiveShadows = true;

    let walls = createWalls(scene);
    let gravitator = new Gravitator(ground);
    let keyboardControl = new KeyboardControl(canvas, scene);
    let mouseControl = new MouseControl(canvas, camera, options.invertCameraOnTouch);

    let particleSystem = createParticleSystem(scene, {
      capacity: 1000,
      texture: new BABYLON.Texture("textures/flare.png", scene),
      color1: new BABYLON.Color4(.1, .2, .8, 1),
      color2: new BABYLON.Color4(.2, .3, 1, 1) }
    );
    //runs every frame
    let task = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.name == "ground";
      });

      if (pickResult.hit) {
        particleSystem.emitter.position = pickResult.pickedPoint;
      }

    }));
    let character = new Character(scene, assetsManager, camera, gravitator, ground, shadowGenerator, keyboardControl);
    let mouseDownTime;
    let mouseUpTime;
    let timeDifference: number;
    mouseControl.leftMouseDownAction = (event) => {
      mouseDownTime = new Date();
    };
    mouseControl.leftMouseUpAction = (event) => {
      mouseUpTime = new Date();
      timeDifference = (mouseUpTime - mouseDownTime)/2;
      new Snowball(scene, gravitator, shadowGenerator,
        character.characterMesh.position,
        particleSystem.emitter.position,
        timeDifference > 500 ? 500  : timeDifference,
        character.physicsBody.linearVelocity
      );
    };
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

      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);
      new Snowman(scene, gravitator, ground, shadowGenerator, character.characterMesh.position);

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
    assetsManager.load();
  }
  return options;
}
