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
    this.runProgram = this.runProgram.bind(this);
    this.stopProgram = this.stopProgram.bind(this);
    this.resetProgram = this.resetProgram.bind(this);
    this.checkSnowman = this.checkSnowman.bind(this);
    this.checkSnowballHitSnowman = this.checkSnowballHitSnowman.bind(this);
    this.checkSnowballHitCharacter = this.checkSnowballHitCharacter.bind(this);
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

      let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/A1.jpg", 8000, 8000, 50, -200, 200, scene);
      this.ground = ground;
      ground.material = (function() {
        let material = new BABYLON.StandardMaterial("texture1", scene);
        material.diffuseColor = new BABYLON.Color3(.2, .6, .2);
        material.wireframe = true;
        return material;
      })();
      ground.checkCollisions = true;
      ground.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {mass: 0});
      let groundCover = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/A1.jpg", 8000, 8000, 50, -200, 200, scene);
      groundCover.material = (function() {
        let material = new BABYLON.StandardMaterial("texture1", scene);
        material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
        return material;
      })();
      groundCover.receiveShadows = true;

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
      this.characterSnowballs = [];
      this.snowmenSnowballs = [];

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
  running: boolean;
  canRestart: boolean;
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
  characterSnowballs: Array<Snowball>;
  snowmenSnowballs: Array<Snowball>;
  snowmen: Array<Snowman>;
  killCount: number;
  timer: number;
  temporarySnowmanIgnoreList: Array<Snowman>;

  programLoop(callback: () => void) {
    if (this.running) {
      callback();
      setTimeout(function() {
        this.programLoop(callback);
      }.bind(this), this.timer);
    }
  }

  runProgram() {
    this.running = true;
    this.timer = 5000;
    let blue3 = new BABYLON.Color3(0, 0, 1);
    let blue4 = new BABYLON.Color4(0, 0, 1, 1);
    let red3 = new BABYLON.Color3(1, 0, 0);
    let red4 = new BABYLON.Color4(1, 0, 0, 1);
    let white3 = new BABYLON.Color3(1, 1, 1);
    let white4 = new BABYLON.Color4(1, 1, 1, 1);
    let mouseDownTime;
    let mouseUpTime;
    let timeDifference: number;
    this.mouseControl.leftMouseDownAction = function(event) {
      mouseDownTime = new Date();
    }.bind(this);
    this.mouseControl.leftMouseUpAction = function(event) {
      mouseUpTime = new Date();
      timeDifference = (mouseUpTime - mouseDownTime)/2;
      this.characterSnowballs.push(new Snowball((snowball: Snowball) => this.characterSnowballs = this.characterSnowballs.filter(i => i != snowball),
        this.scene, this.gravitator, this.shadowGenerator,
        this.character.characterMesh.position,
        this.pointerParticleSystem.emitter.position,
        timeDifference/2 > 300 ? 300  : timeDifference/2,
        this.character.physicsBody.linearVelocity,
        blue3, blue4, blue4
      ));
    }.bind(this);

    this.programLoop(function() {
      if (this.snowmen.length < 100) {
        let snowman = new Snowman(this.scene,
          this.gravitator,
          this.ground,
          this.shadowGenerator,
          this.character.characterMesh.position,
          this.keyboardControl,
          function() {
            if (snowman.snowmanMesh.position) {
              this.snowmenSnowballs.push(new Snowball((snowball: Snowball) => this.snowmenSnowballs = this.snowmenSnowballs.filter(i => i!= snowball),
                this.scene, this.gravitator, this.shadowGenerator,
                snowman.snowmanMesh.position,
                this.character.characterMesh.position,
                Math.random() * 200
                ));
            }
          }.bind(this));
        setTimeout(function() {
          this.snowmen.push(snowman);
        }.bind(this), 1000);
      }
    }.bind(this));

    //Check if snowballs are hitting snowmen
    this.programTask = this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      this.snowmen.map(this.checkSnowman);
      this.snowmenSnowballs.map(this.checkSnowballHitCharacter)
      this.snowmen.map(this.checkCharacterCollision);
    }.bind(this)));
  }

  stopProgram() {
    this.running = false;
    setTimeout(function() {
      this.canRestart = true;
      this.reloadReact();
    }.bind(this), this.timer);
    this.scene.actionManager.actions = this.scene.actionManager.actions.filter(i => i != this.programTask);
  }

  resetProgram() {
    let sudoSnowBall = {};
    this.snowmen.map(i => i.hits.push(sudoSnowBall));
    this.snowmen = [];
    this.killCount = 0;
    this.character.characterHealth = 3;
    this.runProgram();
    this.reloadReact();
  }

  checkSnowman(snowman: Snowman) {
    this.characterSnowballs.map(i => this.checkSnowballHitSnowman(snowman, i.snowballMesh, i));
  }

  checkSnowballHitSnowman(snowman: Snowman, snowballMesh: BABYLON.Mesh, snowball: Snowball) {
    if (snowman.snowmanMesh && snowballMesh) {
      if (snowman.snowmanMesh.intersectsMesh(snowballMesh)) {
        if (snowman.hits.findIndex(i => i == snowball) < 0) {
          snowman.hits.push(snowball);
          snowball.boom();
          this.snowmen = this.snowmen.filter(i => i != snowman);
          this.killCount++;
          if (this.killCount%25==0) {
            this.character.characterHealth++;
          }
          this.timer = this.timer*.98;
          this.reloadReact();
        }
      }
    }
  }

  checkSnowballHitCharacter(snowball: Snowball) {
    if (snowball.snowballMesh && this.character.characterMesh) {
      if (snowball.snowballMesh.intersectsMesh(this.character.characterMesh)) {
        snowball.boom();
        this.snowmenSnowballs = this.snowmenSnowballs.filter(i => i != snowball);
        this.character.characterHealth--;
        this.reloadReact();
      }
    }
  }

  checkCharacterCollision(snowman: Snowman) {
    if (snowman.snowmanMesh && this.character.characterMesh) {
      if (snowman.snowmanMesh.intersectsMesh(this.character.characterMesh)) {
        if (this.temporarySnowmanIgnoreList.findIndex(i => i == snowman) < 0) {
          this.character.characterHealth--;
          if (this.character.characterHealth <= 0) {
            this.stopProgram();
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
