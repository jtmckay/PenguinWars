export default class {
  constructor(canvas: HTMLElement, scene: BABYLON.Scene) {
    this.canvas = canvas;
    this.scene = scene;
    this.lastKeyTime = new Date();
    this.lastKeyup = false;
    this.keydownMatch = false;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    this.doubleW = false;
    this.doubleA = false;
    this.doubleS = false;
    this.doubleD = false;
    this.shift = false;
    this.space = false;
    this.control = false;

    this.displayOnScreenKeyboard = false;

    let currentTime;
    let timeBetween = 300;

    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 87) {
        this.check(87);
        this.w = true;
      }
      if (event.keyCode == 65) {
        this.check(65);
        this.a = true;
      }
      if (event.keyCode == 83) {
        this.check(83);
        this.s = true;
      }
      if (event.keyCode == 68) {
        this.check(68);
        this.d = true;
      }
      if (event.keyCode == 32) {
        this.space = true;
      }
      if (event.keyCode == 17) {
        this.control = true;
      }
      if (event.keyCode == 16) {
        this.shift = true;
      }
      this.lastKey = event.keyCode;
      this.lastKeyup = false;
    }.bind(this));

    document.addEventListener('keyup', function(event) {
      currentTime = new Date();
      if (event.keyCode == 87) {
        if (this.keydownMatch && this.lastKey == event.keyCode && currentTime - this.lastKeyTime < timeBetween) {
          this.doubleW = true;
        }
        this.w = false;
      }
      if (event.keyCode == 65) {
        if (this.keydownMatch && this.lastKey == event.keyCode && currentTime - this.lastKeyTime < timeBetween) {
          this.doubleA = true;
        }
        this.a = false;
      }
      if (event.keyCode == 83) {
        if (this.keydownMatch && this.lastKey == event.keyCode && currentTime - this.lastKeyTime < timeBetween) {
          this.doubleS = true;
        }
        this.s = false;
      }
      if (event.keyCode == 68) {
        if (this.keydownMatch && this.lastKey == event.keyCode && currentTime - this.lastKeyTime < timeBetween) {
          this.doubleD = true;
        }
        this.d = false;
      }
      if (event.keyCode == 32) {
        this.space = false;
      }
      if (event.keyCode == 17) {
        this.control = false;
      }
      if (event.keyCode == 16) {
        this.shift = false;
      }
      this.lastKeyup = true;
      this.lastKeyTime = currentTime;
    }.bind(this));

    this.check = this.check.bind(this);
    this.resetDoubles = this.resetDoubles.bind(this);
  }
  canvas: HTMLElement;
  scene: BABYLON.Scene;
  lastKey: number;
  lastKeyTime: Date;
  lastKeyup: boolean;
  keydownMatch: boolean;
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  doubleW: boolean;
  doubleA: boolean;
  doubleS: boolean;
  doubleD: boolean;
  shift: boolean;
  space: boolean;
  control: boolean;

  displayOnScreenKeyboard: boolean;

  private check(keycode: number) {
    if (this.lastKeyup && this.lastKey == keycode) {
      this.keydownMatch = true;
    }
    else {
      this.keydownMatch = false;
    }
  }

  resetDoubles() {
    this.doubleW = false;
    this.doubleA = false;
    this.doubleS = false;
    this.doubleD = false;
  }
}
