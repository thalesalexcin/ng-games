import { InputController } from './input-controller';

export class DefaultController extends InputController {
  override onControllerEnter(): void {
    console.log('[Default Controller] : On Controller Enter');
  }
  override onControllerExit(): void {
    console.log('[Default Controller] : On Controller Exit');
  }

  override onMouseDown(event: MouseEvent): void {
    console.log('[Default Controller] : On Mouse Down');
  }

  override onMouseMove(event: MouseEvent): void {
    console.log('[Default Controller] : On Mouse Move');
  }

  override onMouseUp(event: MouseEvent): void {
    console.log('[Default Controller] : On Mouse Up');
  }

  override onMouseWheel(event: WheelEvent): void {
    console.log('[Default Controller] : On Mouse Wheel');
  }

  override onMouseLeave(event: MouseEvent): void {
    console.log('[Default Controller] : On Mouse Leave');
  }
}
