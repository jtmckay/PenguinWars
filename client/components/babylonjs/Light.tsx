import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  scene: BABYLON.Scene;
  register: (light: BABYLON.PointLight) => void;
  registerShadowGenerator: (shadowGenerator: BABYLON.ShadowGenerator) => void;
}

class Light extends React.Component<Props, {}> {
  light: BABYLON.PointLight;

  componentDidMount() {
    let hemisphericLight = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), this.props.scene);
    hemisphericLight.diffuse = new BABYLON.Color3(.5, .5, .5);
    this.light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 1000, 0), this.props.scene);
    this.light.diffuse = new BABYLON.Color3(.5, .5, .5);
    this.light.specular = new BABYLON.Color3(1, 1, 1);
    this.props.register(this.light);
    this.props.registerShadowGenerator(new BABYLON.ShadowGenerator(8192, this.light));
  }

  componentWillUnmount() {
    this.light.dispose();
  }

  render() {
    return null;
  }
}

export default Light;
