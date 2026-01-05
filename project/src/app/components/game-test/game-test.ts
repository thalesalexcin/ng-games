import {
  AfterViewInit,
  Component,
  inject,
  Injector,
  NgZone,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RandomService } from '../../services/random-service';
import { Camera, CameraConstraints } from '../../classes/camera';
import { GameOfLife } from '../../classes/game-of-life';
import { NgClass } from '@angular/common';
import { CanvasComponent } from '../canvas/canvas';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-game-test',
  imports: [FormsModule, NgClass, CanvasComponent],
  templateUrl: './game-test.html',
  styleUrl: './game-test.css',
})
export class GameTestComponent implements AfterViewInit {
  //TODO viewChildren with a base component. Or have here a list of "objects" with their own logic and components
  private gameOfLife!: GameOfLife; //TODO transform this in a entity with its components
  private camera!: Camera;
  private canvasComponent = viewChild.required(CanvasComponent);

  private gridWidth = 800;
  private gridHeight = 600;

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

  initGameComponents() {
    this.gameOfLife = new GameOfLife(this.gridWidth, this.gridHeight);
    //TODO where should camera limits be defined? based on world? (cells bounds)
    this.camera = new Camera(this.gridWidth, this.gridHeight);
    let cameraConstraints: CameraConstraints = {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
    };

    this.canvasComponent().setController(new CameraController(this.camera, cameraConstraints));
  }

  onRestartClick() {
    this.randomService.setSeed(this.currentSeed());
    this.gameOfLife.reset();
    this.gameOfLife.fillRandom();
    this.draw();
  }
  onGenerateNewClick() {
    this.generateNewSeed();
    this.gameOfLife.reset();
    this.gameOfLife.fillRandom();
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

  onClearClick() {
    this.isPaused.set(true);
    this.gameOfLife.reset();
    this.draw();
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvasComponent().ctx;
  }

  ngAfterViewInit(): void {
    this.generateNewSeed();
    runInInjectionContext(this.injector, () => {
      this.initGameComponents();
    });
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
}
