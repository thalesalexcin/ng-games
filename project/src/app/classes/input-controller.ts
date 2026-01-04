export abstract class InputController {
  enter() {
    console.log('Entering', typeof this);
    this.onControllerEnter();
  }
  exit() {
    console.log('Exiting', typeof this);
    this.onControllerExit();
  }
  abstract onMouseDown(event: MouseEvent): void;
  abstract onMouseUp(event: MouseEvent): void;
  abstract onMouseWheel(event: WheelEvent): void;
  abstract onMouseMove(event: MouseEvent): void;
  abstract onMouseLeave(event: MouseEvent): void;

  abstract onControllerEnter(): void;
  abstract onControllerExit(): void;
}
