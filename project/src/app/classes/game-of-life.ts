import { inject } from '@angular/core';
import { RandomService } from '../services/random-service';
import { Point } from '../models/point';
import { GridCoords } from '../models/grid-coords';

export class GameOfLifeLogic {
  private currentState!: Uint8Array;
  private nextState!: Uint8Array;

  private offCanvas!: OffscreenCanvas;
  private offCtx!: OffscreenCanvasRenderingContext2D;
  private imageBuffer!: ImageData;

  private rows: number;
  private columns: number;

  private randomService: RandomService;
  private hoverIndex?: number;

  setHoverWorldPosition(worldPosition?: Point) {
    if (worldPosition) {
      const hoverGridPos = this.worldToGridPos(worldPosition);
      this.hoverIndex = hoverGridPos.row * this.columns + hoverGridPos.column;
    } else {
      this.hoverIndex = undefined;
    }
  }

  constructor(
    private width: number,
    private height: number,
    private worldOffset: Point,
    private aspectRatio: number
  ) {
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
    this.currentState = new Uint8Array(this.rows * this.columns);
    this.nextState = new Uint8Array(this.rows * this.columns);

    this.imageBuffer = this.offCtx.createImageData(this.width, this.height);
    for (let i = 0; i < this.currentState.length; i++) {
      const idx = i * 4;
      this.imageBuffer.data[idx] = 255;
      this.imageBuffer.data[idx + 1] = 255;
    }
  }

  setAlive(worldPos: Point) {
    let coords = this.worldToGridPos(worldPos);

    let isValidCoords =
      coords.row >= 0 &&
      coords.row < this.rows &&
      coords.column >= 0 &&
      coords.column < this.columns;
    const index = coords.row * this.columns + coords.column;
    if (isValidCoords) {
      this.currentState[index] = 1;
    }
  }

  toggleAlive(worldPos: Point): void {
    let coords = this.worldToGridPos(worldPos);

    let isValidCoords =
      coords.row >= 0 &&
      coords.row < this.rows &&
      coords.column >= 0 &&
      coords.column < this.columns;
    const index = coords.row * this.columns + coords.column;
    if (isValidCoords) {
      this.currentState[index] = this.currentState[index] == 1 ? 0 : 1;
    }
  }

  worldToGridPos(worldPos: Point): GridCoords {
    return {
      row: Math.floor(worldPos.y / this.aspectRatio - this.worldOffset.y),
      column: Math.floor(worldPos.x / this.aspectRatio - this.worldOffset.x),
    };
  }

  fillRandom() {
    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState[i] = this.randomService.rnd() * 100 > 93 ? 1 : 0;
    }
  }

  nextGenerationScore: number = 0;
  nextGenerationSpeed: number = 15;
  speedFactor: number = 1;

  forceNextGeneration() {
    this.nextGeneration();
  }

  update(deltaTime: number) {
    this.nextGenerationScore += this.nextGenerationSpeed * this.speedFactor * deltaTime;
    if (this.nextGenerationScore >= 1) {
      this.nextGenerationScore = 0;
      this.nextGeneration();
    }
  }

  private nextGeneration() {
    const columns = this.columns;
    let aliveCount = 0;

    for (let currentRow = 0; currentRow < this.height; currentRow++) {
      for (let currentColumn = 0; currentColumn < this.width; currentColumn++) {
        //TODO optimised but if it goes out of the screen it wont teleport to the other side, not important for now
        const rowLeft = (currentRow - 1) * columns;
        const rowRight = (currentRow + 1) * columns;
        const rowCurrent = currentRow * columns;
        const columnUp = currentColumn - 1;
        const columnDown = currentColumn + 1;
        var dataRef = this.currentState;
        aliveCount =
          dataRef[rowLeft + columnUp] +
          dataRef[rowLeft + currentColumn] +
          dataRef[rowLeft + columnDown] +
          dataRef[rowCurrent + columnUp] +
          dataRef[rowCurrent + columnDown] +
          dataRef[rowRight + columnUp] +
          dataRef[rowRight + currentColumn] +
          dataRef[rowRight + columnDown];

        const index = currentRow * this.width + currentColumn;
        this.nextState[index] = aliveCount == 3 || (dataRef[index] && aliveCount == 2) ? 1 : 0;
      }
    }

    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState[i] = this.nextState[i];
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.currentState.length; i++) {
      const idx = i * 4;
      if (this.hoverIndex == i) {
        this.imageBuffer.data[idx + 2] = 255;
        this.imageBuffer.data[idx + 3] = 255;
      } else if (this.currentState[i]) {
        this.imageBuffer.data[idx + 2] = 0;
        this.imageBuffer.data[idx + 3] = 255;
      } else {
        this.imageBuffer.data[idx + 2] = 0;
        this.imageBuffer.data[idx + 3] = 0;
      }
    }

    this.offCtx.fillRect(0, 0, this.width, this.height);
    this.offCtx.putImageData(this.imageBuffer, 0, 0);

    ctx.drawImage(
      this.offCanvas,
      this.worldOffset.x * this.aspectRatio,
      this.worldOffset.y * this.aspectRatio,
      this.imageBuffer.width * this.aspectRatio,
      this.imageBuffer.height * this.aspectRatio
    );
  }
}
