
<Plane scene={this.state.scene}
register={plane => this.plane = plane}
material={(function() {
  let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
  material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
  return material;
}.bind(this))()}
size={1000}
position={new BABYLON.Vector3(0, 0, -500)}
rotation={new BABYLON.Vector3(Math.PI, 0, 0)} />
<Plane scene={this.state.scene}
register={plane => this.plane = plane}
material={(function() {
  let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  return material;
}.bind(this))()}
size={1000}
position={new BABYLON.Vector3(0, 0, 500)}
rotation={new BABYLON.Vector3(0, 0, 0)} />
<Plane scene={this.state.scene}
register={plane => this.plane = plane}
material={(function() {
  let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
  material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
  return material;
}.bind(this))()}
size={1000}
position={new BABYLON.Vector3(-500, 0, 0)}
rotation={new BABYLON.Vector3(0, -Math.PI/2, 0)} />
<Plane scene={this.state.scene}
register={plane => this.plane = plane}
material={(function() {
  let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  return material;
}.bind(this))()}
size={1000}
position={new BABYLON.Vector3(500, 0, 0)}
rotation={new BABYLON.Vector3(0, Math.PI/2, 0)} />
