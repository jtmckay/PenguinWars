import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Gravitator from './Gravitator';
import Light from './Light';
import UniversalCamera from './UniversalCamera';
import ArcRotateCamera from './ArcRotateCamera';
import Ground from './Mesh/Ground';
import Character from './Mesh/Character';
import ParticleSystem from './Mesh/ParticleSystem';
import Sphere from './Mesh/Sphere';
import Plane from './Mesh/Plane';
import Snowman from './Mesh/Snowman';
import SettingsClass from '../shared/classes/SettingsClass';
import degreesToRadians from '../../functions/degreesToRadians';
interface Props {
  settings: SettingsClass;
  changeSetting: (groupName: string, settingName: string, settingValue: any) => void;
  invertMouse: () => void;
  setFramerate: (fps: number, animationRatio: number) => void;
}

interface State {
  scene?: BABYLON.Scene;
}

class Canvas extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.WebGLSupported = BABYLON.Engine.isSupported();
    this.gravitator = new Gravitator();

    this.addShadows = this.addShadows.bind(this);
    this.pointerLockCallback = this.pointerLockCallback.bind(this);
    this.lockPointer = this.lockPointer.bind(this);
    this.unlockPointer = this.unlockPointer.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseWheel = this.mouseWheel.bind(this);
    this.fire = this.fire.bind(this);
  }
  WebGLSupported: boolean;
  gravitator: Gravitator;

  assetsLoaded: boolean;
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  shadowGenerator: BABYLON.ShadowGenerator;
  assetsManager: BABYLON.AssetsManager;
  light: BABYLON.PointLight;
  camera: BABYLON.ArcRotateCamera;
  ground: BABYLON.Mesh;
  particleSystem: BABYLON.ParticleSystem;
  particleSystem2: BABYLON.ParticleSystem;
  particleSystem3: BABYLON.ParticleSystem;
  plane: BABYLON.Mesh;
  pointerLocked: boolean;
  hook: {
    Sphere?: BABYLON.Mesh
  } = {};
  character: BABYLON.Mesh;
  penguinMesh: BABYLON.Mesh;
  random: BABYLON.Mesh;

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

    document.addEventListener('pointerlockchange', this.pointerLockCallback);
    document.addEventListener('mozpointerlockchange', this.pointerLockCallback);
    document.addEventListener('webkitpointerlockchange', this.pointerLockCallback);

    if (this.WebGLSupported) {
      this.engine = new BABYLON.Engine(this.canvas, true);

      let scene = this.createScene();
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
      this.setState({scene: scene});

      window.addEventListener("resize", function () {
        this.engine.resize();
      }.bind(this));

      this.assetsManager.onFinish = function (tasks) {
        this.assetsLoaded = true;
        console.log("Finish");
        this.assetsManager.tasks.length = 0;

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

  addShadows(mesh: BABYLON.Mesh) {
    if (this.shadowGenerator) {
      this.shadowGenerator.getShadowMap().renderList.push(mesh);
    }
    else {
      setTimeout(function() {
        this.addShadows(mesh);
      }.bind(this), 50);
    }
  }

  //Attaches control of the camera only when the pointer is locked to the screen
  //aka only rotates the camera when the mouse is anchored
  pointerLockCallback(event) {
    if (document.pointerLockElement == this.canvas) {
      this.pointerLocked = true;
      if (this.props.settings.mouse.invertTouch) {
        this.props.invertMouse();
      }
    }
    else {
      this.pointerLocked = false;
      if (this.props.settings.mouse.invertTouch) {
        this.props.invertMouse();
      }
    }
  }

  mouseDown(event) {
    if (event.nativeEvent.which == 1) {
      this.charge();
    }
    if (!this.props.settings.mouse.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.lockPointer();
    }
    else if (this.props.settings.mouse.stickyRightMouseClick && event.nativeEvent.which == 3 && !this.pointerLocked) {
      this.lockPointer();
    }
    else if (this.props.settings.mouse.stickyRightMouseClick && event.nativeEvent.which == 3 && this.pointerLocked) {
      this.unlockPointer();
    }
  }

  mouseUp(event) {
    if (event.nativeEvent.which == 1) {
      this.fire();
    }
    if (!this.props.settings.mouse.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.unlockPointer();
    }
  }

  charge() {

  }

  fire() {
    let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    let snowBall = BABYLON.Mesh.CreateSphere("Snowball", 6, 10, this.state.scene, true);
    this.addShadows(snowBall);

    //snowBall.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    //snowBall.checkCollisions = true;
    snowBall.material = material;
    snowBall.position = new BABYLON.Vector3(this.character.position.x, this.character.position.y + 40, this.character.position.z);
    this.particleSystem2.emitter.position = snowBall.position;
    let physicalSnowBall = snowBall.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 1000 } as any);
    let x = this.particleSystem.emitter.position.x - snowBall.position.x;
    let y = this.particleSystem.emitter.position.y - snowBall.position.y;
    let z = this.particleSystem.emitter.position.z - snowBall.position.z;
    let vector1 = new BABYLON.Vector2(0, 1);
    //Target position relative to the character
    let vector2 = new BABYLON.Vector2(x, z);
    let angle = BABYLON.Angle.BetweenTwoPoints(vector1, vector2);
    let distance = Math.sqrt(x*x+z*z);
    let vector3 = new BABYLON.Vector2(distance, y);
    let verticalAngle = BABYLON.Angle.BetweenTwoPoints(vector1, vector3);
    let power = 400 * this.gravitator.appliedAnimationRatio;

    snowBall.applyImpulse(
      new BABYLON.Vector3(
        power * Math.cos(angle.radians()),
        distance / 10 + (Math.sin(verticalAngle.radians())) * power,
        power * Math.sin(angle.radians())
      ),
      snowBall.position);
    let action = this.state.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      if (this.gravitator.removeBelowGround(snowBall, this.state.scene, action)) {
        this.gravitator.applyPhysicsZeroDeterioration(physicalSnowBall);
        this.gravitator.applyGravity(snowBall);
      }
    }.bind(this)));
  }

  keyDown(event) {
    event.preventDefault();
    if (event.key == 'Escape') {
      this.unlockPointer();
    }
  }

  lockPointer() {
    this.canvas.requestPointerLock();
    this.camera.attachControl(this.canvas, true);
  }

  unlockPointer() {
    document.exitPointerLock();
    this.camera.detachControl(this.canvas);
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
    scene.actionManager = new BABYLON.ActionManager(scene);
    this.assetsManager = new BABYLON.AssetsManager(scene);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.OimoJSPlugin() as any);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = .0003;

    //runs every frame
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      this.props.setFramerate(this.engine.getFps(), this.gravitator.appliedAnimationRatio);
      var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.name == "ground";
      });

      if (pickResult.hit) {
        this.particleSystem.emitter.position = pickResult.pickedPoint;
      }

    }.bind(this)));
    this.gravitator.registerGravitator(scene);
    return scene;
  }

  render() {
    if (this.state.scene && this.assetsLoaded) {
      return (
        <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}
          onKeyDown={this.keyDown}
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          onTouchStart={event => {
            this.camera.attachControl(this.canvas, true);
            this.fire();
            this.props.changeSetting("keyboard", "displayOnScreenKeyboard", true);
            this.shadowGenerator.getShadowMap().resize(1);
          }}
          onWheel={this.mouseWheel}>
          <Light scene={this.state.scene}
            register={(light: BABYLON.PointLight) => this.light = light}
            registerShadowGenerator={(shadowGenerator: BABYLON.ShadowGenerator) =>
              {
                shadowGenerator.usePoissonSampling = true;
                this.shadowGenerator = shadowGenerator;
              }} />
          <ArcRotateCamera
            scene={this.state.scene}
            register={(camera: BABYLON.ArcRotateCamera) => this.camera = camera}
            canvas={this.canvas}
            target={BABYLON.Vector3.Zero()}
            invertX={this.props.settings.mouse.invertX}
            invertY={this.props.settings.mouse.invertY}
            invertTouch={this.props.settings.mouse.invertTouch}
            mouseSensitivityX={this.props.settings.mouse.mouseSensitivityX}
            mouseSensitivityY={this.props.settings.mouse.mouseSensitivityY} />
          <Ground scene={this.state.scene}
            register={ground => this.gravitator.ground = ground}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              return material;
            }.bind(this))()} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .3);
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(4000, 0, 0)}
            rotation={new BABYLON.Vector3(0, Math.PI/2, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(-4000, 0, 0)}
            rotation={new BABYLON.Vector3(0, -Math.PI/2, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .7);
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(0, 0, -4000)}
            rotation={new BABYLON.Vector3(Math.PI, 0, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .7);
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(0, 0, 4000)}
            rotation={new BABYLON.Vector3(0, 0, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .3);
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(3000, 0, 3000)}
            rotation={new BABYLON.Vector3(0, Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(3000, 0, -3000)}
            rotation={new BABYLON.Vector3(0, Math.PI-Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .7);
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(-3000, 0, -3000)}
            rotation={new BABYLON.Vector3(0, Math.PI/4+Math.PI, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .7);
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(-3000, 0, 3000)}
            rotation={new BABYLON.Vector3(0, -Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .3);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(4000, 0, 0)}
            rotation={new BABYLON.Vector3(0, Math.PI/2+Math.PI, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(-4000, 0, 0)}
            rotation={new BABYLON.Vector3(0, Math.PI-Math.PI/2, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .7);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(0, 0, -4000)}
            rotation={new BABYLON.Vector3(Math.PI, Math.PI, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .7);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={4000}
            position={new BABYLON.Vector3(0, 0, 4000)}
            rotation={new BABYLON.Vector3(0, Math.PI, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .3);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(3000, 0, 3000)}
            rotation={new BABYLON.Vector3(0, Math.PI+Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(3000, 0, -3000)}
            rotation={new BABYLON.Vector3(0, -Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .7);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(-3000, 0, -3000)}
            rotation={new BABYLON.Vector3(0, Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.7, .3, .7);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={2828.427125}
            position={new BABYLON.Vector3(-3000, 0, 3000)}
            rotation={new BABYLON.Vector3(0, Math.PI-Math.PI/4, 0)} />
          <Plane scene={this.state.scene}
            register={plane => this.plane = plane}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .3);
              material.alpha = .3;
              return material;
            }.bind(this))()}
            size={8000}
            position={new BABYLON.Vector3(0, 1400, 0)}
            rotation={new BABYLON.Vector3(Math.PI/2, 0, 0)} />
          <Character gravitator={this.gravitator}
            scene={this.state.scene}
            assetsManager={this.assetsManager}
            addShadows={this.addShadows}
            register={character => this.character = character}
            camera={this.camera}
            keyboard={this.props.settings.keyboard}
            movementSpeed={this.props.settings.movementSpeed}
            jumpSpeed={this.props.settings.jumpSpeed} />
          <ParticleSystem scene={this.state.scene}
            register={particleSystem => this.particleSystem = particleSystem}
            capacity={100}
            color1={new BABYLON.Color4(.1, .2, .8, 1)}
            color2={new BABYLON.Color4(.2, .3, 1, 1)}
            texture={new BABYLON.Texture("textures/flare.png", this.state.scene)} />
          <ParticleSystem scene={this.state.scene}
            register={particleSystem => this.particleSystem2 = particleSystem}
            capacity={100}
            color1={new BABYLON.Color4(1, 1, 1, 1)}
            color2={new BABYLON.Color4(1, 1, 1, 1)}
            texture={new BABYLON.Texture("textures/flare.png", this.state.scene)} />
          <Sphere scene={this.state.scene}
            gravitator={this.gravitator}
            addShadows={this.addShadows}
            segments={20}
            diameter={60}
            mass={30}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.emissiveTexture = new BABYLON.Texture("textures/penguin.png", this.state.scene);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(0, 10, 0)} />
          <Sphere scene={this.state.scene}
            gravitator={this.gravitator}
            addShadows={this.addShadows}
            hook={object => this.hook.Sphere = object}
            segments={20}
            diameter={70}
            mass={35}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.5, 1, .5);
              material.specularColor = new BABYLON.Color3(0, 1, 0);
              material.specularPower = 32;
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(0, 10, 0)} />
          <Sphere scene={this.state.scene}
            gravitator={this.gravitator}
            addShadows={this.addShadows}
            segments={20}
            diameter={80}
            mass={4}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(-50, 5, 0)} />
          <Snowman scene={this.state.scene}
            addShadows={this.addShadows}
            assetsManager={this.assetsManager}
            gravitator={this.gravitator}
            startPosition={new BABYLON.Vector3(-100, 0, 0)}
            target={new BABYLON.Vector3(0,0,0)} />
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
        return <div>
          <h1 style={{textAlign: "center", width: "100%", position: "absolute"}}>WebGL is not supported</h1>
          <div style={{top: 90, textAlign: "center", width: "100%", position: "absolute"}}>
            <div>
              If you think it should actually work and you are using Chrome,
            </div>
            <div>
              try enabling the "Override software rendering list" by going to chrome://flags
            </div>
          </div>
        </div>
      }
    }
  }
}

export default Canvas;
