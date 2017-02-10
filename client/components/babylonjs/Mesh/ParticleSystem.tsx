import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  register: (particleSystem: BABYLON.ParticleSystem) => void;
  scene: BABYLON.Scene;
  texture: BABYLON.Texture;
  color1: BABYLON.Color4;
  color2: BABYLON.Color4;
  position: BABYLON.Vector3;
}

class ParticleSystem extends React.Component<Props, {}> {
  particleSystem: BABYLON.ParticleSystem;

  componentDidMount() {
    let emitter = BABYLON.Mesh.CreateBox("emitter", .1, this.props.scene);
    emitter.position = this.props.position;
    emitter.isVisible = false;

    let particleSystem = new BABYLON.ParticleSystem("particles", 50, this.props.scene);
    particleSystem.emitter = emitter;
    //texture
    particleSystem.particleTexture = this.props.texture;

    //color range
    particleSystem.color1 = this.props.color1;
    particleSystem.color2 = this.props.color2;

    //power
    particleSystem.minAngularSpeed = -.5;
    particleSystem.maxAngularSpeed = .5;

    particleSystem.minSize = 1;
    particleSystem.maxSize = 3;

    particleSystem.minLifeTime = .5;
    particleSystem.maxLifeTime = 1;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.minEmitBox = new BABYLON.Vector3(-5, 0, -5);
    particleSystem.maxEmitBox = new BABYLON.Vector3(5, 0, 5);

    particleSystem.direction1 = new BABYLON.Vector3(-.3, 1, -.3);
    particleSystem.direction2 = new BABYLON.Vector3(.3, 1, .3);

    //power
    particleSystem.minEmitPower = 30;
    particleSystem.maxEmitPower = 50;

    //quantity
    particleSystem.emitRate = 100000;

    //gravity
    particleSystem.gravity = new BABYLON.Vector3(0, -98.1, 0);

    //start
    particleSystem.start();

    this.props.register(particleSystem);
    this.particleSystem = particleSystem;
  }

  componentWillUnmount() {
    this.particleSystem.dispose();
  }

  render() {
    return null;
  }
}

export default ParticleSystem;
