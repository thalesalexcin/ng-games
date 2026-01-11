import { Point } from '../models/point';
import { MathEx } from './utils/math-ex';

export interface CameraConstraints {
  width: number;
  height: number;
}

export class Camera {
  private position: Point = { x: 0, y: 0 };
  private zoom = 1;

  constructor(private viewportWidth: number, private viewportHeight: number) {}

  public apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }

  public resizeViewport(newWidth: number, newHeight: number) {
    this.viewportWidth = newWidth;
    this.viewportHeight = newHeight;
  }

  public screenToWorld(point: Point) {
    //TODO use a matrix here
    return {
      x: (point.x - this.viewportWidth / 2) / this.zoom + this.position.x,
      y: (point.y - this.viewportHeight / 2) / this.zoom + this.position.y,
    };
  }

  public worldToScreen(point: Point) {
    //TODO use a matrix here
    return {
      x: (point.x - this.position.x) * this.zoom + this.viewportWidth / 2,
      y: (point.y - this.position.y) * this.zoom + this.viewportHeight / 2,
    };
  }

  public move(worldDelta: Point) {
    this.position.x += worldDelta.x * -1;
    this.position.y += worldDelta.y * -1;
  }

  public constraint(constraints: CameraConstraints) {
    let widthLimits = (this.viewportWidth - constraints.width / this.zoom) / 2;
    this.position.x = MathEx.clamp(this.position.x, -widthLimits, widthLimits);

    let heightLimits = (this.viewportHeight - constraints.height / this.zoom) / 2;
    this.position.y = MathEx.clamp(this.position.y, -heightLimits, heightLimits);
  }

  public zoomAt(screenPoint: Point, zoomDelta: number) {
    let world = this.screenToWorld(screenPoint);

    this.zoom += zoomDelta;
    this.zoom = Math.max(this.zoom, 1);

    let newWorld = this.screenToWorld(screenPoint);

    let worldDiff = {
      x: newWorld.x - world.x,
      y: newWorld.y - world.y,
    };

    this.move(worldDiff);
  }
}
