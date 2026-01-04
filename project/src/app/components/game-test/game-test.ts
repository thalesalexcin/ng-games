import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Injector,
  NgZone,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RandomService } from '../../services/random-service';
import { Point } from '../../models/point';
import { Camera } from '../../classes/camera';
import { GameOfLife } from '../../classes/game-of-life';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-test',
  imports: [FormsModule, NgClass],
  templateUrl: './game-test.html',
  styleUrl: './game-test.css',
})
export class GameTestComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  //TODO viewChildren with a base component. Or have here a list of "objects" with their own logic and components
  private gameOfLife!: GameOfLife;
  private camera!: Camera;

  canvasWidth = 800;
  canvasHeight = 600;

  //TODO game state related, move to its own component / store
  currentSeed = signal<string>('');
  lastSeed = signal<string>('');
  speedFactor = signal<number>(1);
  isPaused = signal<boolean>(false);
  randomService = inject(RandomService);

  FRAME_DURATION = 1 / 15; //TODO make it 60 fps and on it's own component ms per frame
  lastFrameTime = 0;

  zone = inject(NgZone);
  injector = inject(Injector);

  init() {
    runInInjectionContext(this.injector, () => {
      this.gameOfLife = new GameOfLife(this.canvasWidth, this.canvasHeight);
      //TODO where should camera limits be defined? based on world? (cells bounds)
      this.camera = new Camera(this.canvasWidth, this.canvasHeight);
    });
  }

  onRestartClick() {
    this.randomService.setSeed(this.currentSeed());
    this.gameOfLife.reset();
    this.draw();
  }
  onGenerateNewClick() {
    this.generateNewSeed();
    this.gameOfLife.reset();
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
      }
    }
    this.draw();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime: number) {
    this.gameOfLife.update(deltaTime);
  }

  draw() {
    this.camera.apply(this.ctx);
    this.gameOfLife.draw(this.ctx);
  }

  isMouseButtonDown: boolean = false;
  lastPos: Point = { x: 0, y: 0 };
  currentScreenPos: Point = { x: 0, y: 0 };
  onCanvasMouseDown(event: MouseEvent) {
    if (event.button == 0) {
      this.isMouseButtonDown = true;
      this.lastPos = { x: event.offsetX, y: event.offsetY };
    }
  }
  onCanvasMouseUp(event: MouseEvent) {
    if (event.button == 0) {
      this.isMouseButtonDown = false;
    }
  }
  onCanvasMouseWheel(event: WheelEvent) {
    event.preventDefault();
    this.camera.zoomAt(this.currentScreenPos, event.deltaY > 0 ? -1 : 1);
    this.camera.constraint(this.ctx.canvas.width, this.ctx.canvas.height);
  }

  onCanvasMouseMove(event: MouseEvent) {
    this.currentScreenPos = { x: event.offsetX, y: event.offsetY };
    if (this.isMouseButtonDown) {
      let lastWorldPos = this.camera.screenToWorld(this.lastPos);
      let currentWorldPos = this.camera.screenToWorld(this.currentScreenPos);
      let worldDiff: Point = {
        x: currentWorldPos.x - lastWorldPos.x,
        y: currentWorldPos.y - lastWorldPos.y,
      };

      this.camera.move(worldDiff);
      this.camera.constraint(this.ctx.canvas.width, this.ctx.canvas.height);
    }
    this.lastPos = { ...this.currentScreenPos };
  }

  onMouseLeave(event: MouseEvent) {
    this.isMouseButtonDown = false;
  }
}
