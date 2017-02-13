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
    this.ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/A1.jpg", 8000, 8000, 50, -500, 500, this.props.scene);
    this.ground.position.y = -100;
    this.ground.material = this.props.material;
    this.ground.setPhysicsState(BABYLON.PhysicsEngine.MeshImpostor, {mass: 0});

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
