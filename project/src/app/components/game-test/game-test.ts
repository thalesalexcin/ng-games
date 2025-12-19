import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  signal,
  ViewChild,
} from '@angular/core';

import seedrandom from 'seedrandom';

import { Grid, GridCoords } from '../../classes/grid';
import { FormsModule } from '@angular/forms';

class FrameCounter {
  currentFps = signal<number>(0);

  constructor(private fpsFrames: number = 0, private fpsTime: number = 0) {}

  tick(deltaTime: number) {
    this.fpsFrames++;
    this.fpsTime += deltaTime;
    if (this.fpsTime >= 1) {
      this.currentFps.set(this.fpsFrames);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
  }
}

@Component({
  selector: 'app-game-test',
  imports: [FormsModule],
  templateUrl: './game-test.html',
  styleUrl: './game-test.css',
})
export class GameTestComponent implements AfterViewInit {
  onRestartClick() {
    this.rnd = seedrandom(this.currentSeed());
    this.init();
  }
  onGenerateNewClick() {
    this.lastSeed.set(this.currentSeed());
    this.currentSeed.set(Math.floor(Math.random() * 3541684621335).toString());
    this.rnd = seedrandom(this.currentSeed());
    this.init();
  }

  onStartPauseClick() {
    this.isPaused.set(!this.isPaused());
  }

  onNextGenerationClick() {
    this.isPaused.set(true);
    this.update(0);
  }

  onSpeedChange() {}
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  currentSeed = signal<string>('');
  lastSeed = signal<string>('');
  speedFactor = signal<number>(1);
  isPaused = signal<boolean>(true);
  rnd = seedrandom('');

  FRAME_DURATION = 1 / 15; // ms per frame
  lastFrameTime = 0;
  lastDeltaTime = signal<number>(0);

  frameCounter = new FrameCounter();
  currentFps = signal<number>(0);
  fpsFrames = 0;
  fpsTime = 0;

  boundsOffset = 20;
  canvasWidth = 800; //TODO use these info to create a canvas element instead of having it in the .html
  canvasHeight = 600;
  initialDeadProbability = 96;
  wantedZoom = 1;
  gridWidth = 0;
  gridHeight = 0;
  currentState = new Grid<boolean>(this.gridHeight, this.gridWidth, false);
  nextState = new Grid<boolean>(this.gridHeight, this.gridWidth, false);
  zone = inject(NgZone);

  init() {
    this.gridWidth = this.canvasWidth + this.boundsOffset;
    this.gridHeight = this.canvasHeight + this.boundsOffset;
    this.currentState = new Grid<boolean>(this.gridHeight, this.gridWidth, false);
    this.nextState = new Grid<boolean>(this.gridHeight, this.gridWidth, false);
    for (let i = 0; i < this.currentState.length; i++) {
      this.currentState.setAtIndex(i, this.rnd() * 100 > this.initialDeadProbability);
    }
  }

  initCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if (!this.ctx) {
      return;
    }
    this.ctx.scale(this.wantedZoom, this.wantedZoom);
    this.ctx.translate(-this.boundsOffset * 0.5, -this.boundsOffset * 0.5);
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.init();
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame((t) => this.gameLoop(t));
    });
  }

  gameLoop(time: number) {
    const deltaTime = (time - this.lastFrameTime) / 1000;

    this.lastDeltaTime.set(deltaTime);
    this.frameCounter.tick(deltaTime);

    if (deltaTime * this.speedFactor() > this.FRAME_DURATION) {
      this.lastFrameTime = time;
      if (!this.isPaused()) this.update(deltaTime);
      this.draw();
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime: number) {
    let offsets: GridCoords[] = [
      { row: -1, column: -1 },
      { row: -1, column: 0 },
      { row: -1, column: 1 },
      { row: 0, column: -1 },
      { row: 0, column: 1 },
      { row: 1, column: -1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ];

    for (let i = 0; i < this.currentState.length; i++) {
      let aliveCount = 0;
      let currentCoord = this.currentState.indexToCoords(i);
      for (let offset of offsets) {
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

  draw() {
    this.ctx.clearRect(0, 0, this.gridWidth, this.gridHeight);

    for (let i = 0; i < this.currentState.length; i++) {
      let isAlive = this.currentState.getByIndex(i);
      this.ctx.fillStyle = isAlive ? 'yellow' : 'black';

      let coords = this.currentState.indexToCoords(i);
      this.ctx.fillRect(coords.column, coords.row, 1, 1);
    }
  }
}
