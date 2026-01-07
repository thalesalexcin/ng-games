import {
  AfterViewInit,
  Component,
  contentChildren,
  inject,
  Injector,
  NgZone,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas';
import { Camera, CameraConstraints } from '../../../classes/camera';
import { CameraController } from '../../../classes/camera-controller';
import { ENTITY, Entity } from '../../../classes/entity';

@Component({
  selector: 'app-game',
  imports: [CanvasComponent],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent implements AfterViewInit {
  nextTick() {
    this.isPaused.set(true);
    this.update(0);
    this.draw();
  }
  private canvasComponent = viewChild.required(CanvasComponent);

  entities = contentChildren<Entity>(ENTITY);

  private zone = inject(NgZone);
  private injector = inject(Injector);
  isPaused = signal<boolean>(false);

  protected camera!: Camera;
  protected cameraController!: CameraController;

  protected gridWidth = 800;
  protected gridHeight = 600;

  get ctx(): CanvasRenderingContext2D {
    return this.canvasComponent().ctx;
  }

  private FRAME_DURATION = 1 / 60; //TODO make it 60 fps and on it's own component ms per frame
  private lastFrameTime = 0;

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.initGameComponents();
    });
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame((t) => this.gameLoop(t));
    });
  }

  private initGameComponents() {
    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;

    this.camera = new Camera(this.gridWidth, this.gridHeight);
    let cameraConstraints: CameraConstraints = {
      width: canvasWidth,
      height: canvasHeight,
    };

    this.cameraController = new CameraController(this.camera, cameraConstraints);

    this.canvasComponent().setController(this.cameraController);

    for (let entity of this.entities()) {
      entity.init();
      entity.initController(this.cameraController);
    }
  }

  private gameLoop(time: number) {
    const deltaTime = (time - this.lastFrameTime) / 1000;
    if (deltaTime > this.FRAME_DURATION) {
      this.lastFrameTime = time;
      if (!this.isPaused()) {
        this.update(deltaTime);
      }
    }
    this.draw();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  private update(deltaTime: number) {
    for (let entity of this.entities()) {
      entity.update(deltaTime);
    }
  }

  draw() {
    this.camera.apply(this.ctx);
    for (let entity of this.entities()) {
      entity.draw(this.ctx);
    }
  }
}
