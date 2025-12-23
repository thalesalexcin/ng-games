import { Point } from '../models/point';

export class CameraComponent {
  private position: Point = { x: 0, y: 0 };
  private zoom = 1;

  apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }

  screenToWorld(point: Point, ctx: CanvasRenderingContext2D) {
    //TODO use a matrix here
    return {
      x: (point.x - ctx.canvas.width / 2) / this.zoom + this.position.x,
      y: (point.y - ctx.canvas.height / 2) / this.zoom + this.position.y,
    };
  }

  worldToScreen(point: Point, ctx: CanvasRenderingContext2D) {
    //TODO use a matrix here
    return {
      x: (point.x - this.position.x) * this.zoom + ctx.canvas.width / 2,
      y: (point.y - this.position.y) * this.zoom + ctx.canvas.height / 2,
    };
  }

  move(worldDelta: Point) {
    this.position.x -= worldDelta.x;
    this.position.y -= worldDelta.y;
  }

  zoomAt(screnPoint: Point, zoomDelta: number, ctx: CanvasRenderingContext2D) {
    let world = this.screenToWorld(screnPoint, ctx);

    this.zoom += zoomDelta;
    this.zoom = Math.max(this.zoom, 1);

    let newWorld = this.screenToWorld(screnPoint, ctx);
    this.position.x += world.x - newWorld.x;
    this.position.y += world.y - newWorld.y;
  }
}
