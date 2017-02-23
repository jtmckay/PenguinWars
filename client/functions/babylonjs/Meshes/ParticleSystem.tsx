import * as BABYLON from 'babylonjs';

function createParticleSystem(scene: BABYLON.Scene, options: {
  capacity: number,
  texture: BABYLON.Texture,
  color1: BABYLON.Color4,
  color2: BABYLON.Color4
}): BABYLON.ParticleSystem {
  let emitter = BABYLON.Mesh.CreateBox("emitter", .1, scene);
  emitter.position = new BABYLON.Vector3(0, -1000, 0);
  emitter.isVisible = false;

  let particleSystem = new BABYLON.ParticleSystem("particles", options.capacity, scene);
  particleSystem.emitter = emitter;
  //texture
  particleSystem.particleTexture = options.texture;

  //color range
  particleSystem.color1 = options.color1;
  particleSystem.color2 = options.color2;

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
  particleSystem.emitRate = 200;

  //gravity
  particleSystem.gravity = new BABYLON.Vector3(0, -98.1, 0);

  //start
  particleSystem.start();

  return particleSystem;
}


export default createParticleSystem;
