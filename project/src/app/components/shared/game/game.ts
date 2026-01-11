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

  private FRAME_DURATION = 1 / 60; //TODO make it 60 fps and on it's own component ms per frame
  private lastFrameTime = 0;

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

  private gameLoop(time: number) {
    const deltaTime = (time - this.lastFrameTime) / 1000;
    if (deltaTime > this.FRAME_DURATION) {
      this.lastFrameTime = time;
      if (!this._isPaused) {
        this.update(deltaTime);
      }
    }
    this.draw();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  private update(deltaTime: number) {
    for (let entity of this.gameModes()) {
      entity.update(deltaTime);
    }
  }

  private draw() {
    this.camera.apply(this.ctx);
    for (let gameMode of this.gameModes()) {
      gameMode.draw(this.ctx);
    }
  }
}
