import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  register: (ground: BABYLON.Mesh) => void;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
}

class Ground extends React.Component<Props, {}> {
  ground: BABYLON.Mesh;

  componentDidMount() {
    this.ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 2, this.props.scene);
    this.ground.position.y = -30;
    this.ground.material = this.props.material;
    this.ground.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, {mass: 0});

    this.props.register(this.ground);
  }

  componentWillUnmount() {
    this.ground.dispose();
    this.props.material.dispose();
  }

  render() {
    return null;
  }
}

export default Ground;
