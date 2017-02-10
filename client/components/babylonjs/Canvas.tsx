import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Light from './Light';
import UniversalCamera from './UniversalCamera';
import ArcRotateCamera from './ArcRotateCamera';
import Ground from './Mesh/Ground';
import Character from './Mesh/Character';
import ParticleSystem from './Mesh/ParticleSystem';
import Sphere from './Mesh/Sphere';
import Model from './Mesh/Model';
import Plane from './Mesh/Plane';
import applyGravity from '../../functions/applyGravity';

interface Props {
  animationRatio: number;
  settings: {
    movementSpeed: number;
    jumpSpeed: number;
    mouseSensitivity: number;
    stickyRightMouseClick: boolean;
  };
  setFramerate: (fps: number) => void;
  setAnimationRatio: (ratio: number) => void;
}

interface State {
  scene?: BABYLON.Scene;
  position?: BABYLON.Vector3;
}

class Canvas extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      position: new BABYLON.Vector3(-30, 0, 0)
    };

    this.WebGLSupported = BABYLON.Engine.isSupported();

    this.pointerLockCallback = this.pointerLockCallback.bind(this);
    this.lockPointer = this.lockPointer.bind(this);
    this.unlockPointer = this.unlockPointer.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseWheel = this.mouseWheel.bind(this);
  }
  WebGLSupported: boolean;
  assetsLoaded: boolean;
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  assetsManager: BABYLON.AssetsManager;
  camera: BABYLON.ArcRotateCamera;
  ground: BABYLON.Mesh;
  particleSystem: BABYLON.ParticleSystem;
  particleSystem2: BABYLON.ParticleSystem;
  plane: BABYLON.Mesh;
  car: BABYLON.Mesh;
  pointerLocked: boolean;
  hook: {
    Sphere?: BABYLON.Mesh
  } = {};
  character: BABYLON.Mesh;
  skullMesh: BABYLON.Mesh;

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

    document.addEventListener('pointerlockchange', this.pointerLockCallback);
    document.addEventListener('mozpointerlockchange', this.pointerLockCallback);
    document.addEventListener('webkitpointerlockchange', this.pointerLockCallback);

    if (this.WebGLSupported) {
      this.engine = new BABYLON.Engine(this.canvas, true);

      let scene = this.createScene();
/*
      let carTask = this.assetsManager.addMeshTask("car task", "test", "babylonjs/", "skull.babylon");
      carTask.onSuccess = function(task: any) {
        this.car = task.loadedMeshes[0];
        this.car.position = new BABYLON.Vector3(5, 0, 0);
        let car = this.car.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {mass: 5, friction: 1});

        scene.registerBeforeRender(function () {
          car.angularVelocity.scaleEqual(.95);
          //car.linearVelocity.scaleEqual(.9);
        });
      }.bind(this);
*/
      let addSkullTask = this.assetsManager.addMeshTask("add character", "test", "babylonjs/", "skull.babylon");
      addSkullTask.onSuccess = function(task: any) {
        this.skullMesh = task.loadedMeshes[0];

        this.car = Object.assign({}, task.loadedMeshes[0]);
        this.car.position = new BABYLON.Vector3(5, 0, 0);
        this.car.ellipsoid = new BABYLON.Vector3(4, 4, 4);
        let car = this.car.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {mass: 10, friction: 1});

        this.state.scene.registerBeforeRender(function () {
          applyGravity(this.car, this.state.scene.getAnimationRatio());
          car.angularVelocity.scaleEqual(.95);
          //car.linearVelocity.scaleEqual(.9);
        }.bind(this));
      }.bind(this);
      /*
      BABYLON.SceneLoader.Load("babylonjs/", "originalcar.babylon", this.engine, function(newScene) {
        this.engine.runRenderLoop(function () {
          newScene.render();
        });
      }.bind(this));
      */

      /*
      scene.onPointerDown = function (event, pickResult) {
        // if the click hits the ground object, we change the impact position
        if (pickResult.hit) {
          impact.position.x = pickResult.pickedPoint.x;
          impact.position.y = pickResult.pickedPoint.y;
        }
      };
      */

      this.setState({scene: scene});

      window.addEventListener("resize", function () {
        this.engine.resize();
      }.bind(this));

      this.assetsManager.onFinish = function (tasks) {
        this.assetsLoaded = true;
        console.log("Finish");
        this.engine.hideLoadingUI();
        this.engine.runRenderLoop(function () {
          scene.render();
        }.bind(this));
      }.bind(this);
      this.assetsManager.onTaskError = function (task) {
        console.log("Error");
        console.log(task);
      };
      this.engine.displayLoadingUI();
      this.assetsManager.load();
    }
  }

  //Attaches control of the camera only when the pointer is locked to the screen
  //aka only rotates the camera when the mouse is anchored
  pointerLockCallback(event) {
    if (document.pointerLockElement == this.canvas) {
      this.pointerLocked = true;
      this.camera.attachControl(this.canvas, true);
    }
    else {
      this.pointerLocked = false;
      this.camera.detachControl(this.canvas);
    }
  }

  mouseDown(event) {
    if (!this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.lockPointer();
    }
    else if (this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3 && !this.pointerLocked) {
      this.lockPointer();
    }
    else if (this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3 && this.pointerLocked) {
      this.unlockPointer();
    }
  }

  mouseUp(event) {
    if (!this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.unlockPointer();
    }
  }

  keyDown(event) {
    event.preventDefault();
    if (event.key == 'Escape') {
      this.unlockPointer();
    }
  }

  lockPointer() {
    this.canvas.requestPointerLock();
  }

  unlockPointer() {
    document.exitPointerLock();
  }

  mouseMoved(event) {
    //event.target.innerHTML = "Position: " + event.clientX + ", " + event.clientY;
  }

  mouseWheel(event) {
    let newRadius = this.camera.radius + event.deltaY/10;
    if (this.camera.lowerRadiusLimit <= newRadius && this.camera.upperRadiusLimit >= newRadius) {
      this.camera.radius = newRadius;
    }
  }

  createScene() {
    let scene = new BABYLON.Scene(this.engine);
    this.assetsManager = new BABYLON.AssetsManager(scene);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.OimoJSPlugin() as any);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = .0003;

    //runs every frame
    scene.registerBeforeRender(function () {
      this.props.setFramerate(this.engine.getFps(), this.engine.getDeltaTime());
      this.props.setAnimationRatio(scene.getAnimationRatio());
      var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.name == "ground";
      });

      if (pickResult.hit) {
        this.particleSystem.emitter.position = pickResult.pickedPoint;
        //this.car.position.x = pickResult.pickedPoint.x;
        //this.car.position.z = pickResult.pickedPoint.z;
      }

    }.bind(this));
    return scene;
  }

  render() {
    if (this.state.scene && this.assetsLoaded) {
      return (
        <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}
          onKeyDown={this.keyDown}
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          onWheel={this.mouseWheel}>
          <Light scene={this.state.scene} />
          <ArcRotateCamera
            scene={this.state.scene}
            register={(camera: BABYLON.ArcRotateCamera) => this.camera = camera}
            canvas={this.canvas}
            target={BABYLON.Vector3.Zero()}
            mouseSensitivity={this.props.settings.mouseSensitivity} />
          <Ground scene={this.state.scene}
            register={ground => this.ground = ground}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              return material;
            }.bind(this))()} />
          <Character scene={this.state.scene}
            register={character => this.character = character}
            mesh={this.skullMesh}
            camera={this.camera}
            ground={this.ground}
            animationRatio={this.props.animationRatio}
            movementSpeed={this.props.settings.movementSpeed}
            jumpSpeed={this.props.settings.jumpSpeed} />
          <ParticleSystem scene={this.state.scene}
            register={particleSystem => this.particleSystem = particleSystem}
            position={new BABYLON.Vector3(0, -10, 0)}
            color1={new BABYLON.Color4(.1, .2, .8, 1)}
            color2={new BABYLON.Color4(.2, .3, 1, 1)}
            texture={new BABYLON.Texture("textures/flare.png", this.state.scene)} />
          <ParticleSystem scene={this.state.scene}
            register={particleSystem => this.particleSystem2 = particleSystem}
            position={new BABYLON.Vector3(0, -10, 0)}
            color1={new BABYLON.Color4(.8, .2, .1, 1)}
            color2={new BABYLON.Color4(1, .3, .2, 1)}
            texture={new BABYLON.Texture("textures/flare.png", this.state.scene)} />
          <Sphere scene={this.state.scene}
            animationRatio={this.props.animationRatio}
            segments={20}
            diameter={60}
            mass={60}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.emissiveTexture = new BABYLON.Texture("textures/penguin.png", this.state.scene);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(0, 0, 0)} />
          <Sphere scene={this.state.scene}
            animationRatio={this.props.animationRatio}
            hook={object => this.hook.Sphere = object}
            segments={20}
            diameter={70}
            mass={70}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.5, 1, .5);
              material.specularColor = new BABYLON.Color3(0, 1, 0);
              material.specularPower = 32;
              return material;
            }.bind(this))()}
            position={this.state.position} />
          <Sphere scene={this.state.scene}
            animationRatio={this.props.animationRatio}
            segments={20}
            diameter={80}
            mass={80}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(-50, 0, 0)} />
        </canvas>
      );
    }
    else {
      if (this.WebGLSupported) {
        return (
          <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}>
          </canvas>
        );
      }
      else {
        return <h1 style={{textAlign: "center", width: "100%", position: "absolute"}}>WebGL is not supported</h1>
      }
    }
  }
}

export default Canvas;
