import * as BABYLON from 'babylonjs';

class Gravitator {
  constructor() {
    this.gravity = -.981;
    this.previousAnimationRatio = 1;
    this.appliedAnimationRatio = 1;
    this.animationRatios = [];
    this.averageAnimationRatio = 1;
    this.target = BABYLON.Vector3.Zero();
  }
  gravity: number;
  previousAnimationRatio: number;
  appliedAnimationRatio: number;
  instantAnimationRatio: number;
  animationRatios: Array<number>;
  averageAnimationRatio: number;
  ground: BABYLON.Mesh;
  target: BABYLON.Vector3;

  applyPhysics(physicalBody) {
    physicalBody.linearVelocity.scaleEqual(this.previousAnimationRatio/this.appliedAnimationRatio);
    physicalBody.angularVelocity.scaleEqual(this.previousAnimationRatio/this.appliedAnimationRatio);
    physicalBody.mass = physicalBody.mass * this.appliedAnimationRatio;
    physicalBody.angularVelocity.scaleEqual(.98);
    physicalBody.linearVelocity.scaleEqual(.98);
  }

  applyPhysicsZeroDeterioration(physicalBody) {
      physicalBody.linearVelocity.scaleEqual(this.previousAnimationRatio/this.appliedAnimationRatio);
      physicalBody.angularVelocity.scaleEqual(this.previousAnimationRatio/this.appliedAnimationRatio);
      physicalBody.mass = physicalBody.mass * this.appliedAnimationRatio;
  }

  applyGravity(mesh: BABYLON.Mesh) {
    mesh.applyImpulse(new BABYLON.Vector3(0, this.gravity * this.appliedAnimationRatio * this.appliedAnimationRatio, 0), mesh.position);
  }

  pullWithOffset(physicalBody, mesh: BABYLON.Mesh, stickToGround: boolean, height: number, xOffset: number = 0, zOffset: number = 0) {
    var pickInfo = this.ground.intersects(
      new BABYLON.Ray(
        new BABYLON.Vector3(mesh.position.x + xOffset, mesh.position.y - height - 20, mesh.position.z + zOffset),
        new BABYLON.Vector3(0, 1, 0)
      ));
    if (pickInfo.hit) {
      if (mesh.position.y - height < pickInfo.pickedPoint.y + 20) {
        if (mesh.position.y - height < pickInfo.pickedPoint.y - 1) {
          this.target.y = 0;
          //this.target.x = 0;
          //this.target.z = 0;
          if (stickToGround) {
            this.target.y = -physicalBody.linearVelocity.y;
          }
          this.target.y += (pickInfo.pickedPoint.y - (mesh.position.y - height)) *
            (pickInfo.pickedPoint.y - (mesh.position.y - height));
          mesh.applyImpulse(this.target, new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
          //this.target.x = xOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
          //this.target.z = zOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
        }
        if (stickToGround && mesh.position.y - height > pickInfo.pickedPoint.y + 1) {
          this.target.y = 0;
          if (stickToGround) {
            this.target.y = -physicalBody.linearVelocity.y;
          }
          //this.target.x = 0;
          //this.target.z = 0;
          this.target.y -= (pickInfo.pickedPoint.y - (mesh.position.y - height)) *
            (pickInfo.pickedPoint.y - (mesh.position.y - height));
          mesh.applyImpulse(this.target, new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
          //this.target.x = -xOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
          //this.target.z = -zOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
        }
        return true;
      }
    }
    else {
      this.applyGravity(mesh);
    }
    return false;
  }

  applyGravityWithGroundConstraints(physicalBody, mesh: BABYLON.Mesh, height: number = 5, stickToGround: boolean = true): boolean {
    if (this.ground) {
      return this.pullWithOffset(physicalBody, mesh, stickToGround, height);
    }
    return false;
  }

  applyGroundConstraintsWithWidth(physicalBody, mesh: BABYLON.Mesh, height: number = 5, width: number = 5, stickToGround: boolean = true): boolean {
    if (this.ground) {
      return this.pullWithOffset(physicalBody, mesh, stickToGround, height, width/2, width/2) ||
      this.pullWithOffset(physicalBody, mesh, stickToGround, height, width/2, -width/2) ||
      this.pullWithOffset(physicalBody, mesh, stickToGround, height, -width/2, width/2) ||
      this.pullWithOffset(physicalBody, mesh, stickToGround, height, -width/2, -width/2);
    }
    return false;
  }

  removeBelowGround(mesh: BABYLON.Mesh, scene: BABYLON.Scene, action: BABYLON.Action): boolean {
    var pickInfo = this.ground.intersects(
      new BABYLON.Ray(
        new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
        new BABYLON.Vector3(0, 1, 0)
      ));
    if (pickInfo.hit) {
      //If the ground is within 1 of the bottom of the character (sphere diameter of 60)
      if (mesh.position.y < pickInfo.pickedPoint.y) {
        mesh.dispose();
        scene.actionManager.actions = scene.actionManager.actions.filter(i => i != action);
        return false;
      }
    }
    return true;
  }

  registerGravitator(scene: BABYLON.Scene) {
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function () {
      this.previousAnimationRatio = this.appliedAnimationRatio;
      this.instantAnimationRatio = scene.getAnimationRatio();
      if (!isNaN(this.instantAnimationRatio)) {
        this.animationRatios.push(this.instantAnimationRatio);
      }
      if (this.animationRatios.length >= 150) {
        this.averageAnimationRatio = this.animationRatios.reduce((a, b) => { return a+b; })/this.animationRatios.length;
        this.appliedAnimationRatio = this.averageAnimationRatio;
        this.animationRatios.length = 0;
      }
      else {
        if (this.instantAnimationRatio < this.appliedAnimationRatio && this.instantAnimationRatio > this.appliedAnimationRatio + 1) {
          this.appliedAnimationRatio = this.instantAnimationRatio;
        }
        else {
          this.appliedAnimationRatio = this.averageAnimationRatio;
        }
      }
    }.bind(this)));
  }
};

export default Gravitator;
