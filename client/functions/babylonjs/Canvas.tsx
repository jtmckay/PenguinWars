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

export default class {
  constructor(reloadReact: () => void) {
    this.reloadReact = reloadReact;
    this.program = this.program.bind(this);
    this.checkSnowmanHit = this.checkSnowmanHit.bind(this);
    this.checkSnowballHit = this.checkSnowballHit.bind(this);
    this.checkCharacterCollision = this.checkCharacterCollision.bind(this);

    let canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

    let options: Settings = {
      invertCameraOnTouch: false,
      showSettings: false,
      showKeyboard: false,
    };

    if (BABYLON.Engine.isSupported()) {
      let engine = new BABYLON.Engine(canvas, true);

      let scene = createScene(engine);
      this.scene = scene;
      let assetsManager = new BABYLON.AssetsManager(scene);
      this.assetsManager = assetsManager;
      let assetsLoaded: boolean = false;

      let hemisphericLight = createHemisphericLight(scene);
      let light = createLight(scene);
      let shadowGenerator = new BABYLON.ShadowGenerator(4096, light);
      this.shadowGenerator = shadowGenerator;

      let camera = createArcRotateCamera(scene, BABYLON.Vector3.Zero());
      canvas.addEventListener('touchstart', (event) => {
        camera.attachControl(canvas, true);
        shadowGenerator.getShadowMap().resize(1);
      });

      let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/A1.jpg", 8000, 8000, 50, -300, 300, scene);
      this.ground = ground;
      ground.material = (function() {
        let material = new BABYLON.StandardMaterial("texture1", scene);
        material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
        return material;
      })();
      ground.checkCollisions = true;
      ground.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {mass: 0});
      ground.receiveShadows = true;

      let walls = createWalls(scene);
      let gravitator = new Gravitator(scene, ground);
      this.gravitator = gravitator;
      let keyboardControl = new KeyboardControl(canvas, scene);
      this.keyboardControl = keyboardControl;
      let mouseControl = new MouseControl(canvas, camera, options.invertCameraOnTouch);
      this.mouseControl = mouseControl;

      let particleSystem = createParticleSystem(scene, {
        capacity: 1000,
        texture: new BABYLON.Texture("textures/flare.png", scene),
        color1: new BABYLON.Color4(.1, .2, .8, 1),
        color2: new BABYLON.Color4(.2, .3, 1, 1) }
      );
      this.pointerParticleSystem = particleSystem;
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
      this.character = character;
      this.snowmen = [];
      this.snowballs = [];

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
        this.program();
        engine.hideLoadingUI();
        engine.runRenderLoop(function () {
          scene.render();
        });
      }.bind(this);
      assetsManager.onTaskError = function (task) {
        console.log("Error");
        console.log(task);
      };
      engine.displayLoadingUI();
      assetsManager.load();
    }

    this.killCount = 0;
    this.temporarySnowmanIgnoreList = [];
  }
  reloadReact: () => void;
  scene: BABYLON.Scene;
  assetsManager: BABYLON.AssetsManager;
  gravitator: Gravitator;
  shadowGenerator: BABYLON.ShadowGenerator;
  ground: BABYLON.GroundMesh;
  character: Character;
  keyboardControl: KeyboardControl;
  mouseControl: MouseControl;
  programTask: BABYLON.Action;
  pointerParticleSystem: BABYLON.ParticleSystem;
  snowballs: Array<Snowball>;
  snowmen: Array<Snowman>;
  killCount: number;
  timer: number;
  temporarySnowmanIgnoreList: Array<Snowman>;

  infiniteLoop(callback: () => void) {
    console.log(this.timer);
    callback();
    setTimeout(function() {
      this.infiniteLoop(callback);
    }.bind(this), this.timer);
  }

  program() {
    this.timer = 3000;
    let mouseDownTime;
    let mouseUpTime;
    let timeDifference: number;
    this.mouseControl.leftMouseDownAction = function(event) {
      mouseDownTime = new Date();
    }.bind(this);
    this.mouseControl.leftMouseUpAction = function(event) {
      mouseUpTime = new Date();
      timeDifference = (mouseUpTime - mouseDownTime)/2;
      this.snowballs.push(new Snowball((snowball: Snowball) => this.snowballs = this.snowballs.filter(i => i != snowball),
        this.scene, this.gravitator, this.shadowGenerator,
        this.character.characterMesh.position,
        this.pointerParticleSystem.emitter.position,
        timeDifference > 500 ? 500  : timeDifference,
        this.character.physicsBody.linearVelocity
      ));
    }.bind(this);

    this.infiniteLoop(function() {
      if (this.snowmen.length < 100) {
        this.snowmen.push(new Snowman(function(snowman: Snowman) {
        }.bind(this),
        this.scene,
        this.gravitator,
        this.ground,
        this.shadowGenerator,
        this.character.characterMesh.position,
        this.keyboardControl))
      }
    }.bind(this));

    //Check if snowballs are hitting snowmen
    this.programTask = this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      this.snowmen.map(this.checkSnowmanHit);
      this.snowmen.map(this.checkCharacterCollision);
    }.bind(this)));
  }

  checkSnowmanHit(snowman: Snowman) {
    this.snowballs.map(i => this.checkSnowballHit(snowman, i.snowballMesh, i));
  }

  checkSnowballHit(snowman: Snowman, snowballMesh: BABYLON.Mesh, snowball: Snowball) {
    if (snowman.snowmanMesh && snowballMesh) {
      if (snowman.snowmanMesh.intersectsMesh(snowballMesh)) {
        if (snowman.hits.findIndex(i => i == snowball) < 0) {
          snowman.hits.push(snowball);
          this.snowmen = this.snowmen.filter(i => i != snowman);
          if (this.killCount%25==0) {
            this.character.characterHealth++;
          }
          this.killCount++;
          this.timer = this.timer*.95;
          this.reloadReact();
        }
      }
    }
  }

  checkCharacterCollision(snowman: Snowman) {
    if (snowman.snowmanMesh && this.character.characterMesh) {
      if (snowman.snowmanMesh.intersectsMesh(this.character.characterMesh)) {
        if (this.temporarySnowmanIgnoreList.findIndex(i => i == snowman) < 0) {
          this.character.characterHealth--;
          if (this.character.characterHealth <= 0) {
            this.scene.actionManager.actions = this.scene.actionManager.actions.filter(i => i != this.programTask);
          }
          this.reloadReact();
          this.temporarySnowmanIgnoreList.push(snowman);
          //stop the snowman from hurting again within 1 second
          setTimeout(function() {
            this.temporarySnowmanIgnoreList = this.temporarySnowmanIgnoreList.filter(i => i != snowman);
          }.bind(this), 1000);
        }
      }
    }
  }
}
