import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { Grid, GridCoords } from '../../classes/grid';
import { RandomService } from '../../services/random-service';

@Component({
  selector: 'app-cells',
  imports: [],
  templateUrl: './cells.html',
  styleUrl: './cells.css',
})
export class CellsComponent implements AfterViewInit {
  currentState!: Grid<boolean>;
  nextState!: Grid<boolean>;
  offsets!: GridCoords[];

  offCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('offCanvas');
  offCtx!: CanvasRenderingContext2D;
  imageBuffer!: ImageData;

  width = input.required<number>();
  height = input.required<number>();
  rows: number = 0;
  columns: number = 0;

  boundsOffset = input.required<number>();

  randomService = inject(RandomService);

  ngAfterViewInit(): void {
    this.rows = this.height() + this.boundsOffset();
    this.columns = this.width() + this.boundsOffset();

    this.reset();

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

    this.offCtx = this.offCanvas().nativeElement.getContext('2d')!;
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
        if (!this.currentState.isValidCoords(offsetCoord)) continue;
        if (this.currentState.get(offsetCoord)) aliveCount++;
      }

      let isAlive = this.currentState.getByIndex(i);
      if (isAlive && aliveCount < 2) {
        this.nextState.setAtIndex(i, false);
      } else if (isAlive && (aliveCount == 2 || aliveCount == 3)) {
        this.nextState.setAtIndex(i, true);
      } else if (isAlive && aliveCount > 3) {
        this.nextState.setAtIndex(i, false);
      } else if (!isAlive && aliveCount == 3) {
        this.nextState.setAtIndex(i, true);
      }
    }

    this.currentState = this.nextState.copy();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(0, 0, this.columns, this.rows);

    for (let i = 0; i < this.currentState.length; i++) {
      const alive = this.currentState.getByIndex(i);
      const idx = i * 4;

      if (alive) {
        this.imageBuffer.data[idx + 3] = 255;
      } else {
        this.imageBuffer.data[idx + 3] = 0;
      }
    }

    this.offCtx.putImageData(this.imageBuffer, 0, 0);

    ctx.drawImage(
      this.offCanvas().nativeElement,
      this.boundsOffset() * 0.5,
      this.boundsOffset() * 0.5
    );
  }
}
