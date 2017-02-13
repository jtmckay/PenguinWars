import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Gravitator from '../Gravitator';
import degreesToRadians from '../../../functions/degreesToRadians';
import KeyboardClass from '../../shared/classes/KeyboardClass';

interface Props {
  register: (ground: BABYLON.Mesh) => void;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera;
  keyboard: KeyboardClass;
  movementSpeed: number;
  jumpSpeed: number;
  mesh: BABYLON.Mesh;
  gravitator: Gravitator;
}

class Character extends React.Component<Props, {}> {
  characterMesh: BABYLON.Mesh;
  characterShell: BABYLON.Mesh;

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.characterMesh.dispose();
    this.characterShell.dispose();
  }

  load() {
    if (this.props.camera && this.props.gravitator.ground) {
      this.characterMesh = this.props.mesh;
      this.props.register(this.characterMesh);

      this.characterShell = BABYLON.Mesh.CreateSphere("Character", 2, 60, this.props.scene, true);
      this.characterShell.isVisible = false;
      let shell = this.characterShell.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor,
        {mass: 100, friction: 100, restitution: .001});
      this.characterShell.position = this.characterMesh.position;

      let w = false;
      let a = false;
      let s = false;
      let d = false;
      let space = false;
      let control = false;
      let shift = false;
      let onGround = false;
      let canJump = true;

      this.props.scene.actionManager = new BABYLON.ActionManager(this.props.scene);

      this.props.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
        if (event.sourceEvent.keyCode == 87) {
          w = true;
        }
        if (event.sourceEvent.keyCode == 65) {
          a = true;
        }
        if (event.sourceEvent.keyCode == 83) {
          s = true;
        }
        if (event.sourceEvent.keyCode == 68) {
          d = true;
        }
        if (event.sourceEvent.keyCode == 32) {
          space = true;
        }
        if (event.sourceEvent.keyCode == 17) {
          control = true;
        }
        if (event.sourceEvent.keyCode == 16) {
          shift = true;
        }
      }));

      this.props.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (event) {
        if (event.sourceEvent.keyCode == 87) {
          w = false;
        }
        if (event.sourceEvent.keyCode == 65) {
          a = false;
        }
        if (event.sourceEvent.keyCode == 83) {
          s = false;
        }
        if (event.sourceEvent.keyCode == 68) {
          d = false;
        }
        if (event.sourceEvent.keyCode == 32) {
          space = false;
        }
        if (event.sourceEvent.keyCode == 17) {
          control = false;
        }
        if (event.sourceEvent.keyCode == 16) {
          shift = false;
        }
      }));

      this.props.scene.registerBeforeRender(function () {
        this.props.camera.target = this.characterMesh.position;
        this.props.gravitator.applyPhysicsZeroDeterioration(shell);
        this.props.gravitator.applyGravity(this.characterShell);
        onGround = this.props.gravitator.applyGroundConstraints(shell, this.characterShell, 30, canJump);
        //everything
        //Stop rotation of the character in order to apply friction to stop the character without impulse
        if (!w && !a && !s && !d
           && !this.props.keyboard.w
           && !this.props.keyboard.a
           && !this.props.keyboard.s
           && !this.props.keyboard.d) {
          shell.angularVelocity.scaleEqual(0);
          shell.linearVelocity.scaleEqual(.99);
        }
        else {
          shell.linearVelocity.scaleEqual(.99);
          shell.angularVelocity.scaleEqual(.99);
        }
        //Adjust speed for framerate
        let localSpeed = this.props.movementSpeed * this.props.gravitator.appliedAnimationRatio;
        //Y-axis point to calculate the angle of the camera
        let vector1 = new BABYLON.Vector2(0, 1);
        //Camera position relative to the object
        let vector2 = new BABYLON.Vector2(this.characterMesh.position.x - this.props.camera.position.x,
          this.characterMesh.position.z - this.props.camera.position.z);
        let angle = BABYLON.Angle.BetweenTwoPoints(vector1, vector2);

        let current = shell.linearVelocity;
        let target = new BABYLON.Vector3(0, 0, 0);

        //Jump before modifying the localSpeed to compensate for shift and multiple directions
        if ((space || this.props.keyboard.space) && canJump && onGround) {
          this.characterShell.applyImpulse(new BABYLON.Vector3(0, this.props.jumpSpeed * this.props.gravitator.appliedAnimationRatio, 0), this.characterMesh.position);
          canJump = false;
          setTimeout(function () {
            canJump = true;
          }, 150);
        }

        if (((w || this.props.keyboard.w) && (!s && !this.props.keyboard.s) ||
          (s || this.props.keyboard.s) && (!w && !this.props.keyboard.w)) &&
        ((d || this.props.keyboard.d) && (!a && !this.props.keyboard.a) ||
          (a || this.props.keyboard.a) && (!d || !this.props.keyboard.d))) {
          localSpeed = localSpeed * Math.cos(degreesToRadians(45));
        }

        if (shift) {
          localSpeed = localSpeed/20;
        }
        if (w || this.props.keyboard.w) {
          target.x += localSpeed * Math.sin(angle.radians() + degreesToRadians(90));
          target.z -= localSpeed * Math.cos(angle.radians() + degreesToRadians(90));
        }
        if (a || this.props.keyboard.a) {
          target.x -= localSpeed * Math.sin(angle.radians());
          target.z += localSpeed * Math.cos(angle.radians());
        }
        if (s || this.props.keyboard.s) {
          target.x += localSpeed * Math.sin(angle.radians() - degreesToRadians(90));
          target.z -= localSpeed * Math.cos(angle.radians() - degreesToRadians(90));
        }
        if (d || this.props.keyboard.d) {
          target.x += localSpeed * Math.sin(angle.radians());
          target.z -= localSpeed * Math.cos(angle.radians());
        }
        if (shift || this.props.keyboard.shift) {
          this.characterShell.applyImpulse(target, this.characterMesh.position);
        }
        else {
          this.characterShell.applyImpulse(
            new BABYLON.Vector3(target.x - current.x, target.y, target.z - current.z),
            this.characterMesh.position);
        }
        this.characterMesh.rotation = new BABYLON.Vector3(0, -this.props.camera.alpha + degreesToRadians(90), 0);
        //skull.rotation.x -= 1;
      }.bind(this));
    }
    else {
      setTimeout(function() {
        this.load();
      }.bind(this), 10);
    }
  }

  render() {
    return null;
  }
}

export default Character;
