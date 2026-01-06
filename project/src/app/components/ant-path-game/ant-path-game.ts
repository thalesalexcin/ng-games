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
import { CanvasComponent } from '../canvas/canvas';
import { Camera, CameraConstraints } from '../../classes/camera';
import { RandomService } from '../../services/random-service';
import { Point } from '../../models/point';
import { CameraController } from '../../classes/camera-controller';
import { AntsPath } from '../../classes/ants-path';

@Component({
  selector: 'app-ant-path-game',
  imports: [CanvasComponent],
  templateUrl: './ant-path-game.html',
  styleUrl: './ant-path-game.css',
})
export class AntPathGame implements AfterViewInit {
  private camera!: Camera;
  private canvasComponent = viewChild.required(CanvasComponent);
  private antPathLogic!: AntsPath;

  private gridWidth = 800;
  private gridHeight = 600;

  get ctx(): CanvasRenderingContext2D {
    return this.canvasComponent().ctx;
  }

  isPaused = signal<boolean>(false);
  randomService = inject(RandomService);

  FRAME_DURATION = 1 / 60; //TODO make it 60 fps and on it's own component ms per frame
  lastFrameTime = 0;
  zone = inject(NgZone);
  injector = inject(Injector);

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.initGameComponents();
    });
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame((t) => this.gameLoop(t));
    });
  }

  initGameComponents() {
    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;
    let worldOffset: Point = {
      x: -canvasWidth * 0.5,
      y: -canvasHeight * 0.5,
    };
    this.antPathLogic = new AntsPath(canvasWidth, canvasHeight, worldOffset);
    this.camera = new Camera(this.gridWidth, this.gridHeight);
    let cameraConstraints: CameraConstraints = {
      width: canvasWidth,
      height: canvasHeight,
    };

    let controller = new CameraController(this.camera, cameraConstraints);
    controller.onWorldClick = (worldPos: Point) => {};

    controller.onWorldHoverEnter = (worldPos: Point) => {};
    controller.onWorldHoverLeave = () => {};
    this.canvasComponent().setController(controller);
  }

  gameLoop(time: number) {
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

  update(deltaTime: number) {
    this.antPathLogic.update(deltaTime);
  }

  draw() {
    this.camera.apply(this.ctx);
    this.antPathLogic.draw(this.ctx);
  }
}
