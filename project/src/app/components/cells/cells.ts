import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { Grid, GridCoords } from '../../classes/grid';
import { RandomService } from '../../services/random-service';
import { MathEx } from '../../classes/math-ex';

@Component({
  selector: 'app-cells',
  imports: [],
  templateUrl: './cells.html',
  styleUrl: './cells.css',
})
export class CellsComponent implements AfterViewInit {
  currentState!: Grid<boolean>;
  nextState!: Grid<boolean>;
  offsets: GridCoords[];

  offCanvas!: OffscreenCanvas;
  offCtx!: OffscreenCanvasRenderingContext2D;
  imageBuffer!: ImageData;

  width = input.required<number>();
  height = input.required<number>();
  rows: number = 0;
  columns: number = 0;

  screenOffset = input.required<number>();

  randomService = inject(RandomService);

  constructor() {
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
  }

  ngAfterViewInit(): void {
    this.rows = this.height() + this.screenOffset();
    this.columns = this.width() + this.screenOffset();

    this.reset();

    this.offCanvas = new OffscreenCanvas(this.columns, this.rows);
    this.offCtx = this.offCanvas.getContext('2d')!;
    this.offCtx.imageSmoothingEnabled = false;

    this.imageBuffer = this.offCtx.createImageData(this.columns, this.rows);
    for (let i = 0; i < this.currentState.length; i++) {
      const idx = i * 4;
      this.imageBuffer.data[idx] = 255;
      this.imageBuffer.data[idx + 1] = 255;
    }
  }

  reset() {
    this.currentState = new Grid<boolean>(this.rows, this.columns, false);
    this.nextState = new Grid<boolean>(this.rows, this.columns, false);

    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState.setAtIndex(i, this.randomService.rnd() * 100 > 96);
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

    this.offCtx.fillRect(0, 0, this.width(), this.height());
    this.offCtx.putImageData(
      this.imageBuffer,
      -this.screenOffset() * 0.5,
      -this.screenOffset() * 0.5
    );

    ctx.drawImage(this.offCanvas, 0, 0, this.imageBuffer.width, this.imageBuffer.height);
  }
}
