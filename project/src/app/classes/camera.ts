import { Point } from '../models/point';
import { MathEx } from './math-ex';

export class Camera {
  private position: Point = { x: 0, y: 0 };
  private zoom = 1;

  constructor(private viewportWidth: number, private viewportHeight: number) {}

  apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }

  screenToWorld(point: Point) {
    //TODO use a matrix here
    return {
      x: (point.x - this.viewportWidth / 2) / this.zoom + this.position.x,
      y: (point.y - this.viewportHeight / 2) / this.zoom + this.position.y,
    };
  }

  worldToScreen(point: Point) {
    //TODO use a matrix here
    return {
      x: (point.x - this.position.x) * this.zoom + this.viewportWidth / 2,
      y: (point.y - this.position.y) * this.zoom + this.viewportHeight / 2,
    };
  }

  move(worldDelta: Point) {
    this.position.x += worldDelta.x * -1;
    this.position.y += worldDelta.y * -1;
  }

  constraint(width: number, height: number) {
    let widthLimits = (this.viewportWidth - width / this.zoom) / 2;
    this.position.x = MathEx.clamp(this.position.x, -widthLimits, widthLimits);

    let heightLimits = (this.viewportHeight - height / this.zoom) / 2;
    this.position.y = MathEx.clamp(this.position.y, -heightLimits, heightLimits);
  }

  zoomAt(screnPoint: Point, zoomDelta: number) {
    let world = this.screenToWorld(screnPoint);

    this.zoom += zoomDelta;
    this.zoom = Math.max(this.zoom, 1);

    let newWorld = this.screenToWorld(screnPoint);

    let worldDiff = {
      x: newWorld.x - world.x,
      y: newWorld.y - world.y,
    };

    this.move(worldDiff);
  }
}
