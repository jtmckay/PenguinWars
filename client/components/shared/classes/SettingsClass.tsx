import KeyboardClass from './KeyboardClass';
import MouseClass from './MouseClass';

export default class {
  constructor() {
    this.movementSpeed = 200;
    this.jumpSpeed = 300;
    this.keyboard = new KeyboardClass();
    this.mouse = new MouseClass();
  }
  movementSpeed: number;
  jumpSpeed: number;
  keyboard: KeyboardClass;
  mouse: MouseClass;
}
