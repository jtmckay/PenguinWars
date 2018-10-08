export default class {
  constructor (canvas: HTMLElement, camera: BABYLON.ArcRotateCamera, invert: boolean) {
    this.canvas = canvas;
    this.camera = camera;
    this.invert = invert;
    this.mouseX = camera.angularSensibilityX;
    this.mouseY = camera.angularSensibilityY;
    this.pointerLocked = false;

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);

    document.addEventListener('pointerlockchange', this.pointerLockCallback);
    document.addEventListener('mozpointerlockchange', this.pointerLockCallback);
    document.addEventListener('webkitpointerlockchange', this.pointerLockCallback);
    canvas.addEventListener('mousedown', this.mouseDown);
    canvas.addEventListener('mouseup', this.mouseUp);
  }
  canvas: HTMLElement;
  camera: BABYLON.ArcRotateCamera;
  invert: boolean;
  mouseX: number;
  mouseY: number;
  pointerLocked: boolean = false;

  stickyRightMouse: boolean;
  leftMouseDownAction: (event) => void;
  leftMouseUpAction: (event) => void;

  /*
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

  mouseX = mouseSensitivityStart/this.mouseSensitivityX;
  mouseY = mouseSensitivityStart/this.mouseSensitivityY;*/
  invertMouse() {
    this.mouseX = -this.mouseX;
    this.mouseY = -this.mouseY;
  }

  pointerLockCallback(event) {
    if (document.pointerLockElement == this.canvas) {
      this.pointerLocked = true;
      if (this.invert) {
        this.invertMouse();
      }
    }
    else {
      this.pointerLocked = false;
      if (this.invert) {
        this.invertMouse();
      }
    }
  }

  lockPointer() {
    this.canvas.requestPointerLock();
    this.camera.attachControl(this.canvas, true);
  }

  unlockPointer() {
    document.exitPointerLock();
    this.camera.detachControl(this.canvas);
  }

  mouseDown(event) {
    event.preventDefault();
    if (event.which == 1) {
      this.leftMouseDownAction(event);
    }
    if (!this.stickyRightMouse && event.which == 3) {
      this.lockPointer();
    }
    else if (this.stickyRightMouse && event.which == 3 && !this.pointerLocked) {
      this.lockPointer();
    }
    else if (this.stickyRightMouse && event.which == 3 && this.pointerLocked) {
      this.unlockPointer();
    }
  }

  mouseUp(event) {
    event.preventDefault();
    if (event.which == 1) {
      this.leftMouseUpAction(event);
    }
    if (!this.stickyRightMouse && event.which == 3) {
      this.unlockPointer();
    }
  }
}
