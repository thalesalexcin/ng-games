import { inject } from '@angular/core';
import { RandomService } from '../services/random-service';
import { Point } from '../models/point';
import { GridCoords } from '../models/grid-coords';
import { MathEx } from './utils/math-ex';

export class AntsPath {
  private offCanvas!: OffscreenCanvas;
  private offCtx!: OffscreenCanvasRenderingContext2D;
  private imageBuffer!: ImageData;

  private randomService: RandomService = inject(RandomService);

  private ants: GridCoords[] = [];

  //TODO temporary WILL BE WIPED OUT SOON I PROMISE
  private currentFrame: number = 0;

  constructor(private width: number, private height: number, private worldOffset: Point) {
    this.offCanvas = new OffscreenCanvas(this.width, this.height);
    this.offCtx = this.offCanvas.getContext('2d')!;
    this.offCtx.imageSmoothingEnabled = false;

    this.ants.push({
      column: -worldOffset.x,
      row: -worldOffset.y,
    });

    this.reset();
  }

  reset() {
    this.imageBuffer = this.offCtx.createImageData(this.width, this.height);
  }

  addAnt(worldPos: Point): void {
    let ant = this.worldToGridPos(worldPos);
    this.ants.push(ant);
  }

  private worldToGridPos(worldPos: Point): GridCoords {
    return {
      row: Math.floor(worldPos.y - this.worldOffset.y),
      column: Math.floor(worldPos.x - this.worldOffset.x),
    };
  }

  update(deltaTime: number) {
    this.currentFrame++;
    for (let i = 0; i < 10; i++) {
      for (let ant of this.ants) {
        let direction = Math.floor(this.randomService.rnd() * 4);
        switch (direction) {
          case 0:
            ant.row--;
            break;
          case 1:
            ant.column--;
            break;
          case 2:
            ant.row++;
            break;
          case 3:
            ant.column++;
            break;
        }

        ant.column = MathEx.mod(ant.column, this.width);
        ant.row = MathEx.mod(ant.row, this.height);

        //Modifying imageBuffer here so iterations will take effect on drawing
        let idx = MathEx.coordsToIndex(ant, this.width) * 4;
        //TODO add util to convert RGB to imageBuffer data
        this.imageBuffer.data[idx] = 255;
        this.imageBuffer.data[idx + 1] += 128;
        this.imageBuffer.data[idx + 2] = 255;
        this.imageBuffer.data[idx + 3] = 255;
      }
    }

    for (let i = 0; i < this.imageBuffer.data.length / 4; i++) {
      const idx = i * 4;
      this.imageBuffer.data[idx] -= 4;
      if (this.currentFrame % 2 == 0) {
        this.imageBuffer.data[idx + 1] -= 1;
      }

      this.imageBuffer.data[idx + 3]--;
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
