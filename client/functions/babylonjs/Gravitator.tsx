import * as BABYLON from 'babylonjs';

class Gravitator {
  constructor(ground: BABYLON.Mesh) {
    this.ground = ground;
    this.gravity = -9.81;
    this.target = BABYLON.Vector3.Zero();
  }
  ground: BABYLON.Mesh;
  gravity: number;
  target: BABYLON.Vector3;

  applyDeterioration(physicalBody) {
    physicalBody.angularVelocity.scaleEqual(.99);
    physicalBody.linearVelocity.scaleEqual(.99);
  }

  applyGravity(mesh: BABYLON.Mesh, multiplier: number = 1) {
    mesh.applyImpulse(new BABYLON.Vector3(0, this.gravity * multiplier, 0), mesh.position);
  }

  private pullTowardsGround(physicalBody, mesh: BABYLON.Mesh, multiplier: number, height: number, sticky: boolean) {
    var pickInfo = this.ground.intersects(
      new BABYLON.Ray(
        new BABYLON.Vector3(mesh.position.x, mesh.position.y - height - 20, mesh.position.z),
        new BABYLON.Vector3(0, 1, 0)
      ));
    if (pickInfo.hit) {
      if (mesh.position.y - height < pickInfo.pickedPoint.y + 20) {
        if (mesh.position.y - height < pickInfo.pickedPoint.y - 1) {
          this.target.y = 0;
          //this.target.x = 0;
          //this.target.z = 0;
          if (sticky) {
            this.target.y = -physicalBody.linearVelocity.y;
          }
          this.target.y += (pickInfo.pickedPoint.y - (mesh.position.y - height)) *
            (pickInfo.pickedPoint.y - (mesh.position.y - height));
          mesh.applyImpulse(this.target, new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
          //this.target.x = xOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
          //this.target.z = zOffset / (pickInfo.pickedPoint.y - (mesh.position.y - height));
        }
        if (sticky && mesh.position.y - height > pickInfo.pickedPoint.y + 1) {
          this.target.y = 0;
          if (sticky) {
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
      this.applyGravity(mesh, multiplier);
    }
    return false;
  }

  applyGravityWithGroundConstraints(physicalBody, mesh: BABYLON.Mesh, multiplier: number = 1, height: number = 5, stickToGround: boolean = true): boolean {
    if (this.ground) {
      return this.pullTowardsGround(physicalBody, mesh, multiplier, height, stickToGround);
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
};

export default Gravitator;
