import { inject } from '@angular/core';
import { Grid, GridCoords } from './grid';
import { RandomService } from '../services/random-service';
import { MathEx } from './math-ex';

export class GameOfLife {
  private currentState!: Grid<boolean>;
  private nextState!: Grid<boolean>;
  private offsets: GridCoords[];

  private offCanvas!: OffscreenCanvas;
  private offCtx!: OffscreenCanvasRenderingContext2D;
  private imageBuffer!: ImageData;

  private rows: number;
  private columns: number;

  private randomService: RandomService;

  constructor(private width: number, private height: number) {
    this.randomService = inject(RandomService);
    this.rows = this.height;
    this.columns = this.width;
    this.offsets = [
      { row: -1, column: -1 },
      { row: -1, column: 0 },
      { row: -1, column: 1 },
      { row: 0, column: -1 },
      { row: 0, column: 1 },
      { row: 1, column: -1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ];

    this.offCanvas = new OffscreenCanvas(this.width, this.height);
    this.offCtx = this.offCanvas.getContext('2d')!;
    this.offCtx.imageSmoothingEnabled = false;

    this.reset();
    this.fillRandom();
  }

  reset() {
    this.currentState = new Grid<boolean>(this.rows, this.columns, false);
    this.nextState = new Grid<boolean>(this.rows, this.columns, false);

    this.imageBuffer = this.offCtx.createImageData(this.width, this.height);
    for (let i = 0; i < this.currentState.length; i++) {
      const idx = i * 4;
      this.imageBuffer.data[idx] = 255;
      this.imageBuffer.data[idx + 1] = 255;
    }
  }

  fillRandom() {
    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState.setAtIndex(i, this.randomService.rnd() * 100 > 93);
    }
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.currentState.length; i++) {
      let aliveCount = 0;
      let currentCoord = this.currentState.indexToCoords(i);
      for (let offset of this.offsets) {
        let offsetCoord: GridCoords = {
          column: currentCoord.column + offset.column,
          row: currentCoord.row + offset.row,
        };

        offsetCoord.column = MathEx.mod(offsetCoord.column, this.columns);
        offsetCoord.row = MathEx.mod(offsetCoord.row, this.rows);

        if (this.currentState.get(offsetCoord)) aliveCount++;
      }

      let isAlive = this.currentState.getByIndex(i);
      if (isAlive) {
        this.nextState.setAtIndex(i, aliveCount == 2 || aliveCount == 3);
      } else {
        this.nextState.setAtIndex(i, aliveCount == 3);
      }
    }

    this.currentState = this.nextState.copy();
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.currentState.length; i++) {
      const alive = this.currentState.getByIndex(i);
      const idx = i * 4;

      if (alive) {
        this.imageBuffer.data[idx + 3] = 255;
      } else {
        this.imageBuffer.data[idx + 3] = 0;
      }
    }

    this.offCtx.fillRect(0, 0, this.width, this.height);
    this.offCtx.putImageData(this.imageBuffer, 0, 0);

    ctx.drawImage(
      this.offCanvas,
      -this.width * 0.5,
      -this.height * 0.5,
      this.imageBuffer.width,
      this.imageBuffer.height
    );
  }
}
