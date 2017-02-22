import * as React from 'react';
import * as BABYLON from 'babylonjs';
import ajax from '../../../functions/ajax';
import Gravitator from '../Gravitator';

interface Props {
  scene: BABYLON.Scene;
  gravitator: Gravitator;
  addShadows: (mesh) => void;
  assetsManager: BABYLON.AssetsManager;
  startPosition: BABYLON.Vector3;
  target: BABYLON.Vector3;
}

class Snowman extends React.Component<Props, {}> {
  model: BABYLON.Mesh;
  shell: BABYLON.Mesh;
  action: BABYLON.Action;

  componentDidMount() {
    console.log('mount');
    BABYLON.SceneLoader.ImportMesh("penguin", "babylonjs/", "penguin.babylon", this.props.scene, function (newMeshes) {
      this.shell = BABYLON.Mesh.CreateSphere("Character", 2, 50, this.props.scene, true);
      this.shell.isVisible = false;
      this.shell.position = new BABYLON.Vector3(this.props.startPosition.x, this.props.startPosition.y, this.props.startPosition.z);
      let body = this.shell.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {mass: 50});

      this.model = newMeshes[0];
      this.model.position = this.shell.position;
      this.model.scaling = new BABYLON.Vector3(10, 10, 10);
      this.props.addShadows(this.model);

      this.action = this.props.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
        this.props.gravitator.applyPhysics(body);
        //this.props.gravitator.applyGravity(this.shell);
        this.props.gravitator.applyGravityWithGroundConstraints(body, this.shell, 10);
        /*if (this.props.target.x != 0 || this.props.target.y != 0 || this.props.target.z != 0) {
          this.model.applyImpulse(this.props.target);
        }*/
        //car.linearVelocity.scaleEqual(.9);
      }.bind(this)));
    }.bind(this));
  }

  componentWillUnmount() {
    console.log('unmount');
    this.props.scene.actionManager.actions.slice(this.props.scene.actionManager.actions.findIndex(i => i == this.action), 1);
    this.model.dispose();
  }

  render() {
    return null;
  }
}

export default Snowman;
