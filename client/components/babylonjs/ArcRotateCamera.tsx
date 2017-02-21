import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  scene: BABYLON.Scene;
  register: (camera: BABYLON.Camera) => void;
  canvas: HTMLCanvasElement;
  target: BABYLON.Vector3;
  mouseSensitivityX: number;
  mouseSensitivityY: number;
  invertX: boolean,
  invertY: boolean,
  invertTouch: boolean,
}

class ArcRotateCamera extends React.Component<Props, {}> {
  camera: BABYLON.ArcRotateCamera;
  mouseSensitivityX: number;
  mouseSensitivityY: number;

  componentDidMount() {
    let mouseSensitivityStart = 1500;
    if (this.props.invertTouch) {
      mouseSensitivityStart = mouseSensitivityStart * -1;
    }
    if (isNaN(parseFloat(this.props.mouseSensitivityX.toString()))) {
      this.mouseSensitivityX = this.mouseSensitivityX ? this.mouseSensitivityX : 5;
    }
    else {
      this.mouseSensitivityX = parseFloat(this.props.mouseSensitivityX.toString());
    }
    if (isNaN(parseFloat(this.props.mouseSensitivityY.toString()))) {
      this.mouseSensitivityY = this.mouseSensitivityY ? this.mouseSensitivityY : 5;
    }
    else {
      this.mouseSensitivityY = parseFloat(this.props.mouseSensitivityY.toString());
    }
    if (this.props.invertX) {
      this.mouseSensitivityX = this.mouseSensitivityX * -1;
    }
    if (this.props.invertY) {
      this.mouseSensitivityX = this.mouseSensitivityY * -1;
    }
    this.camera = new BABYLON.ArcRotateCamera("Camera", 1, 1, 90, this.props.target, this.props.scene);
    this.camera.checkCollisions = true;
    this.camera.inertia = 0;
    this.camera.angularSensibilityX = mouseSensitivityStart/this.mouseSensitivityX;
    this.camera.angularSensibilityY = mouseSensitivityStart/this.mouseSensitivityY;
    this.camera.lowerRadiusLimit = 200;
    this.camera.upperRadiusLimit = 1000;
    this.camera.radius = 500;
    this.camera.lowerBetaLimit = .1;
    this.camera.upperBetaLimit = Math.PI/2;

    this.props.register(this.camera);
  }

  componentWillUnmount() {
    this.camera.dispose();
  }

  componentWillReceiveProps(props) {
    let mouseSensitivityStart = 1500;
    if (this.props.invertTouch) {
      mouseSensitivityStart = mouseSensitivityStart * -1;
    }
    if (isNaN(parseFloat(props.mouseSensitivityX))) {
      this.mouseSensitivityX = this.mouseSensitivityX ? this.mouseSensitivityX : 5;
    }
    else {
      this.mouseSensitivityX = parseFloat(props.mouseSensitivityX.toString());
    }
    if (isNaN(parseFloat(props.mouseSensitivityY))) {
      this.mouseSensitivityY = this.mouseSensitivityY ? this.mouseSensitivityY : 5;
    }
    else {
      this.mouseSensitivityY = parseFloat(props.mouseSensitivityY.toString());
    }
    this.camera.angularSensibilityX = (props.invertX ? mouseSensitivityStart * -1 : mouseSensitivityStart)/this.mouseSensitivityX;
    this.camera.angularSensibilityY = (props.invertY ? mouseSensitivityStart * -1 : mouseSensitivityStart)/this.mouseSensitivityY;
  }

  render() {
    return null;
  }
}

export default ArcRotateCamera;
