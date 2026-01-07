import { inject } from '@angular/core';
import { RandomService } from '../services/random-service';
import { Point } from '../models/point';
import { GridCoords } from '../models/grid-coords';
import { MathEx } from './utils/math-ex';

export class AntsPath {
  private offCanvas!: OffscreenCanvas;
  private offCtx!: OffscreenCanvasRenderingContext2D;
  private imageBuffer!: ImageData;

  private randomService: RandomService;

  private currentPosition: GridCoords;

  constructor(private width: number, private height: number, private worldOffset: Point) {
    this.randomService = inject(RandomService);

    this.offCanvas = new OffscreenCanvas(this.width, this.height);
    this.offCtx = this.offCanvas.getContext('2d')!;
    this.offCtx.imageSmoothingEnabled = false;

    this.currentPosition = {
      column: 400,
      row: 300,
    };

    this.reset();
  }

  reset() {
    this.imageBuffer = this.offCtx.createImageData(this.width, this.height);
  }

  worldToGridPos(worldPos: Point): GridCoords {
    return {
      row: Math.floor(worldPos.y - this.worldOffset.y),
      column: Math.floor(worldPos.x - this.worldOffset.x),
    };
  }

  update(deltaTime: number) {
    for (let i = 0; i < 100; i++) {
      let direction = Math.floor(this.randomService.rnd() * 4);
      switch (direction) {
        case 0:
          this.currentPosition.row--;
          break;
        case 1:
          this.currentPosition.column--;
          break;
        case 2:
          this.currentPosition.row++;
          break;
        case 3:
          this.currentPosition.column++;
          break;
      }

      this.currentPosition.column = MathEx.mod(this.currentPosition.column, this.width);
      this.currentPosition.row = MathEx.mod(this.currentPosition.row, this.height);

      //Modifying imageBuffer here so iterations will take effect on drawing
      let idx = MathEx.coordsToIndex(this.currentPosition, this.width) * 4;
      //TODO add util to convert RGB to imageBuffer data
      this.imageBuffer.data[idx] = 255;
      this.imageBuffer.data[idx + 1] = 255;
      this.imageBuffer.data[idx + 2] = 0;
      this.imageBuffer.data[idx + 3] = 255;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.offCtx.fillRect(0, 0, this.width, this.height);
    this.offCtx.putImageData(this.imageBuffer, 0, 0);

    ctx.drawImage(
      this.offCanvas,
      this.worldOffset.x,
      this.worldOffset.y,
      this.imageBuffer.width,
      this.imageBuffer.height
    );
  }
}
