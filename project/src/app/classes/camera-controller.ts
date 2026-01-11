import { Point } from '../models/point';
import { Camera, CameraConstraints } from './camera';
import { InputController } from './input-controller';

export class CameraController extends InputController {
  private isMouseButtonDown: boolean = false;
  private lastPos: Point = { x: 0, y: 0 };
  private currentScreenPos: Point = { x: 0, y: 0 };

  onWorldClick?: (worldPosition: Point) => void;
  onWorldHoverEnter?: (worldPosition: Point) => void;
  onWorldHoverLeave?: () => void;

  constructor(private camera: Camera, private constraints: CameraConstraints) {
    super();
  }

  override onControllerEnter(): void {}
  override onControllerExit(): void {}

  override onMouseDown(event: MouseEvent): void {
    if (event.button == 1) {
      this.isMouseButtonDown = true;
      this.lastPos = { x: event.offsetX, y: event.offsetY };
    }

    //TODO what about onMouseUp ?
    if (event.button == 0) {
      let screenPos = { x: event.offsetX, y: event.offsetY };
      let currentWorldPos = this.camera.screenToWorld(screenPos);
      if (this.onWorldClick) {
        this.onWorldClick(currentWorldPos);
      }
    }
  }

  setConstraints(newConstraints: CameraConstraints) {
    this.constraints = newConstraints;
  }

  override onMouseUp(event: MouseEvent): void {
    if (event.button == 1) {
      this.isMouseButtonDown = false;
    }
  }

  override onMouseWheel(event: WheelEvent): void {
    this.camera.zoomAt(this.currentScreenPos, event.deltaY > 0 ? -1 : 1);
    this.camera.constraint(this.constraints);
  }

  override onMouseMove(event: MouseEvent): void {
    this.currentScreenPos = { x: event.offsetX, y: event.offsetY };
    let currentWorldPos = this.camera.screenToWorld(this.currentScreenPos);
    if (this.onWorldHoverEnter) {
      this.onWorldHoverEnter(currentWorldPos);
    }
    if (this.isMouseButtonDown) {
      let lastWorldPos = this.camera.screenToWorld(this.lastPos);
      let worldDiff: Point = {
        x: currentWorldPos.x - lastWorldPos.x,
        y: currentWorldPos.y - lastWorldPos.y,
      };

      this.camera.move(worldDiff);
      this.camera.constraint(this.constraints);
    }
    this.lastPos = { ...this.currentScreenPos };
  }

  override onMouseLeave(event: MouseEvent): void {
    this.isMouseButtonDown = false;
    if (this.onWorldHoverLeave) {
      this.onWorldHoverLeave();
    }
  }
}
