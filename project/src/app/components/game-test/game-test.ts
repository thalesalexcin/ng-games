import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CellsComponent } from '../cells/cells';
import { RandomService } from '../../services/random-service';

@Component({
  selector: 'app-game-test',
  imports: [FormsModule, CellsComponent],
  templateUrl: './game-test.html',
  styleUrl: './game-test.css',
})
export class GameTestComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private cells = viewChild.required(CellsComponent);

  canvasWidth = 800;
  canvasHeight = 600;
  boundsOffset = 100;

  currentSeed = signal<string>('');
  lastSeed = signal<string>('');
  speedFactor = signal<number>(1);
  isPaused = signal<boolean>(false);
  wantedZoom = signal<number>(1);

  FRAME_DURATION = 1 / 15; // ms per frame
  lastFrameTime = 0;

  zone = inject(NgZone);

  randomService = inject(RandomService);

  init() {
    this.cells().reset();
  }

  onZoomChange() {
    this.initCanvasTransform();
    this.draw();
  }

  onRestartClick() {
    this.randomService.reset();
    this.init();
    this.draw();
  }
  onGenerateNewClick() {
    this.generateNewSeed();
    this.init();
    this.draw();
  }

  generateNewSeed() {
    this.lastSeed.set(this.currentSeed());
    this.currentSeed.set(Math.floor(Math.random() * 3541684621335).toString());
    this.randomService.setSeed(this.currentSeed());
  }

  onStartPauseClick() {
    this.isPaused.set(!this.isPaused());
  }

  onNextGenerationClick() {
    this.isPaused.set(true);
    this.update(0);
    this.draw();
  }

  initCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if (!this.ctx) {
      return;
    }

    this.ctx.imageSmoothingEnabled = false;
    this.initCanvasTransform();
  }

  initCanvasTransform() {
    this.ctx.resetTransform();
    this.ctx.scale(this.wantedZoom(), this.wantedZoom());
    this.ctx.translate(-this.boundsOffset * 0.5, -this.boundsOffset * 0.5);
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.generateNewSeed();
    this.init();
    this.draw();
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame((t) => this.gameLoop(t));
    });
  }

  gameLoop(time: number) {
    const deltaTime = (time - this.lastFrameTime) / 1000;
    if (deltaTime * this.speedFactor() > this.FRAME_DURATION) {
      this.lastFrameTime = time;
      if (!this.isPaused()) {
        this.update(deltaTime);
        this.draw();
      }
    }
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime: number) {
    this.cells().update(deltaTime);
  }

  draw() {
    this.cells().draw(this.ctx);
  }
}
