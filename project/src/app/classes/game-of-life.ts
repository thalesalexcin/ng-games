import { inject } from '@angular/core';
import { RandomService } from '../services/random-service';
import { Point } from '../models/point';
import { GridCoords } from '../models/grid-coords';
import { Grid } from './utils/grid';

export class GameOfLife {
  private currentState!: Grid<boolean>;
  private nextState!: Grid<boolean>;

  private offCanvas!: OffscreenCanvas;
  private offCtx!: OffscreenCanvasRenderingContext2D;
  private imageBuffer!: ImageData;

  private rows: number;
  private columns: number;

  private randomService: RandomService;
  private hoverPosition?: GridCoords;

  setHoverWorldPosition(worldPosition?: Point) {
    this.hoverPosition = worldPosition ? this.worldToGridPos(worldPosition) : undefined;
  }

  constructor(private width: number, private height: number, private worldOffset: Point) {
    this.randomService = inject(RandomService);
    this.rows = this.height;
    this.columns = this.width;

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

  toggleAlive(worldPos: Point): void {
    let gridCoords = this.worldToGridPos(worldPos);

    if (this.currentState.isValidCoords(gridCoords)) {
      let isAlive = this.currentState.get(gridCoords);
      this.currentState.set(gridCoords, !isAlive);
    }
  }

  worldToGridPos(worldPos: Point): GridCoords {
    return {
      row: Math.floor(worldPos.y - this.worldOffset.y),
      column: Math.floor(worldPos.x - this.worldOffset.x),
    };
    // code below will triger FPS drop with something related with GridCoords receiving floating numbers
    // return {
    //   row: Math.floor(worldPos.y) - this.worldOffset.y,
    //   column: Math.floor(worldPos.x) - this.worldOffset.x,
    // };
  }

  fillRandom() {
    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState.setAtIndex(i, this.randomService.rnd() * 100 > 93);
    }
  }

  nextGenerationScore: number = 0;
  nextGenerationSpeed: number = 15;
  speedFactor: number = 1;

  update(deltaTime: number) {
    this.nextGenerationScore += this.nextGenerationSpeed * this.speedFactor * deltaTime;

    if (this.nextGenerationScore >= 1) {
      const columns = this.columns;
      const columnsInv = 1 / columns;
      let aliveCount = 0;
      for (let i = 0; i < this.currentState.length; i++) {
        const currentRow = Math.floor(i * columnsInv);
        const currentColumn = i - columns * Math.floor(i * columnsInv);

        const rowLeft = (currentRow - 1) * columns;
        const rowRight = (currentRow + 1) * columns;
        const columnUp = currentColumn - 1;
        const columnDown = currentColumn + 1;
        var dataRef = this.currentState.data;
        aliveCount =
          (dataRef[rowLeft + columnUp] ? 1 : 0) +
          (dataRef[rowLeft + currentColumn] ? 1 : 0) +
          (dataRef[rowLeft + columnDown] ? 1 : 0) +
          (dataRef[currentRow * columns + columnUp] ? 1 : 0) +
          (dataRef[currentRow * columns + columnDown] ? 1 : 0) +
          (dataRef[rowRight + columnUp] ? 1 : 0) +
          (dataRef[rowRight + currentColumn] ? 1 : 0) +
          (dataRef[rowRight + columnDown] ? 1 : 0);

        this.nextState.data[i] = aliveCount == 3 || (dataRef[i] && aliveCount == 2);
      }

      for (let i = 0; i < this.currentState.length; i++) {
        this.currentState.data[i] = this.nextState.data[i];
      }
      this.nextGenerationScore--;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.currentState.length; i++) {
      const alive = this.currentState.data[i];
      const idx = i * 4;

      let isHovered = false;
      if (this.hoverPosition) {
        let hoveredIndex = this.currentState.coordsToIndex(this.hoverPosition);
        isHovered = hoveredIndex == i;
      }

      //TODO add util to convert RGB to imageBuffer data
      if (isHovered) {
        this.imageBuffer.data[idx] = 255;
        this.imageBuffer.data[idx + 1] = 255;
        this.imageBuffer.data[idx + 2] = 255;
        this.imageBuffer.data[idx + 3] = 255;
      } else if (alive) {
        this.imageBuffer.data[idx] = 255;
        this.imageBuffer.data[idx + 1] = 255;
        this.imageBuffer.data[idx + 2] = 0;
        this.imageBuffer.data[idx + 3] = 255;
      } else {
        this.imageBuffer.data[idx] = 0;
        this.imageBuffer.data[idx + 1] = 0;
        this.imageBuffer.data[idx + 2] = 0;
        this.imageBuffer.data[idx + 3] = 0;
      }
    }

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
