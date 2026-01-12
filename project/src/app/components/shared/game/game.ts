import {
  AfterViewInit,
  Component,
  contentChildren,
  inject,
  Injector,
  input,
  NgZone,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas';
import { Camera, CameraConstraints } from '../../../classes/camera';
import { CameraController } from '../../../classes/camera-controller';
import { GAME_MODE, GameMode } from '../../../classes/game-mode';

@Component({
  selector: 'app-game',
  imports: [CanvasComponent],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent implements AfterViewInit {
  public canvasWidth = input<number>(800);
  public canvasHeight = input<number>(600);
  public fullscreenEnabled = input<boolean>(false);

  private canvasComponent = viewChild.required(CanvasComponent);
  private gameModes = contentChildren<GameMode>(GAME_MODE);

  private zone = inject(NgZone);
  private injector = inject(Injector);
  private _isPaused = false;

  private camera!: Camera;
  private cameraController!: CameraController;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvasComponent().ctx;
  }

  public isPaused() {
    return this._isPaused;
  }

  public setPaused(value: boolean) {
    this._isPaused = value;
  }

  public ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.initGameComponents();
    });
    this.zone.runOutsideAngular(() => {
      this.lastFrameTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    });
  }

  public toggleFullscreen() {
    this.canvasComponent().toggleFullscreenMode();
  }

  protected onCanvasResize() {
    this.camera.resizeViewport(this.ctx.canvas.width, this.ctx.canvas.height);
    let cameraConstraints: CameraConstraints = {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
    };

    this.cameraController.setConstraints(cameraConstraints);

    for (let gameMode of this.gameModes()) {
      gameMode.resize(this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  private initGameComponents() {
    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;

    this.camera = new Camera(canvasWidth, canvasHeight);
    let cameraConstraints: CameraConstraints = {
      width: canvasWidth,
      height: canvasHeight,
    };

    this.cameraController = new CameraController(this.camera, cameraConstraints);

    this.canvasComponent().setController(this.cameraController);

    for (let gameMode of this.gameModes()) {
      gameMode.init(canvasWidth, canvasHeight);
      gameMode.initController(this.cameraController);
    }
  }

  private lastFrameTime = 0;
  private cumulatedDeltaTime: number = 0;
  private fixedDeltaTime: number = 1 / 60;
  private gameLoop(time: number) {
    if (!this._isPaused) {
      const deltaTime = (time - this.lastFrameTime) / 1000;
      this.cumulatedDeltaTime += deltaTime;
      while (this.cumulatedDeltaTime >= this.fixedDeltaTime) {
        this.fixedUpdate(this.fixedDeltaTime);
        this.cumulatedDeltaTime -= this.fixedDeltaTime;
      }

      this.update(deltaTime);
    }
    this.draw();
    requestAnimationFrame((t) => this.gameLoop(t));
    this.lastFrameTime = time;
  }

  private update(deltaTime: number) {
    for (let gameMode of this.gameModes()) {
      gameMode.update(deltaTime);
    }
  }

  private fixedUpdate(deltaTime: number) {
    for (let gameMode of this.gameModes()) {
      gameMode.fixedUpdate(deltaTime);
    }
  }

  private draw() {
    this.camera.apply(this.ctx);
    for (let gameMode of this.gameModes()) {
      gameMode.draw(this.ctx);
    }
  }
}
