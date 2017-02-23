import * as BABYLON from 'babylonjs';
import createPlane from './Plane';

function createWalls(scene: BABYLON.Scene): Array<BABYLON.Mesh> {
  let red = (function() {
            let material = new BABYLON.StandardMaterial("texture1", scene);
            material.diffuseColor = new BABYLON.Color3(.7, .3, .3);
            return material;
          })();
  let blue = (function() {
            let material = new BABYLON.StandardMaterial("texture1", scene);
            material.diffuseColor = new BABYLON.Color3(.3, .3, .7);
            return material;
          })();
  let purple = (function() {
            let material = new BABYLON.StandardMaterial("texture1", scene);
            material.diffuseColor = new BABYLON.Color3(.7, .3, .7);
            return material;
          })();
  let green = (function() {
            let material = new BABYLON.StandardMaterial("texture1", scene);
            material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
            return material;
          })();

  let plane1 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(4000, 0, 0),
    rotation: new BABYLON.Vector3(0, Math.PI/2, 0),
    material: red
  });
  let plane2 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(-4000, 0, 0),
    rotation: new BABYLON.Vector3(0, -Math.PI/2, 0),
    material: blue
  });
  let plane3 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(0, 0, -4000),
    rotation: new BABYLON.Vector3(Math.PI, 0, 0),
    material: green
  });
  let plane4 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(0, 0, 4000),
    rotation: new BABYLON.Vector3(0, 0, 0),
    material: purple
  });
  let plane5 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(3000, 0, 3000),
    rotation: new BABYLON.Vector3(0, Math.PI/4, 0),
    material: red
  });
  let plane6 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(3000, 0, -3000),
    rotation: new BABYLON.Vector3(0, Math.PI-Math.PI/4, 0),
    material: blue
  });
  let plane7 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(-3000, 0, -3000),
    rotation: new BABYLON.Vector3(0, Math.PI/4+Math.PI, 0),
    material: green
  });
  let plane8 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(-3000, 0, 3000),
    rotation: new BABYLON.Vector3(0, -Math.PI/4, 0),
    material: purple
  });
  let plane9 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(4000, 0, 0),
    rotation: new BABYLON.Vector3(0, Math.PI/2+Math.PI, 0),
    material: red
  });
  let plane10 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(-4000, 0, 0),
    rotation: new BABYLON.Vector3(0, Math.PI-Math.PI/2, 0),
    material: blue
  });
  let plane11 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(0, 0, -4000),
    rotation: new BABYLON.Vector3(Math.PI, Math.PI, 0),
    material: green
  });
  let plane12 = createPlane(scene, {
    size: 4000,
    position: new BABYLON.Vector3(0, 0, 4000),
    rotation: new BABYLON.Vector3(0, Math.PI, 0),
    material: purple
  });
  let plane13 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(3000, 0, 3000),
    rotation: new BABYLON.Vector3(0, Math.PI+Math.PI/4, 0),
    material: red
  });
  let plane14 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(3000, 0, -3000),
    rotation: new BABYLON.Vector3(0, -Math.PI/4, 0),
    material: blue
  });
  let plane15 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(-3000, 0, -3000),
    rotation: new BABYLON.Vector3(0, Math.PI/4, 0),
    material: green
  });
  let plane16 = createPlane(scene, {
    size: 2828.427125,
    position: new BABYLON.Vector3(-3000, 0, 3000),
    rotation: new BABYLON.Vector3(0, Math.PI-Math.PI/4, 0),
    material: purple
  });
  let ceiling = createPlane(scene, {
    size: 8000,
    position: new BABYLON.Vector3(0, 1400, 0),
    rotation: new BABYLON.Vector3(Math.PI/2, 0, 0),
    material: (function() {
              let material = new BABYLON.StandardMaterial("texture1", scene);
              material.diffuseColor = new BABYLON.Color3(.3, .3, .3);
              material.alpha = .3;
              return material;
            })()
  });

  return [
    plane1,
    plane2,
    plane3,
    plane4,
    plane5,
    plane6,
    plane7,
    plane8,
    plane9,
    plane10,
    plane11,
    plane12,
    plane13,
    plane14,
    plane15,
    plane16,
    ceiling
  ];
}

export default createWalls;
