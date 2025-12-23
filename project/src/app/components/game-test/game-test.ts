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
import { CellsComponent } from '../cells/cells';
import { RandomService } from '../../services/random-service';
import { Point } from '../../models/point';
import { CameraComponent } from '../../classes/camera';

@Component({
  selector: 'app-game-test',
  imports: [FormsModule],
  templateUrl: './game-test.html',
  styleUrl: './game-test.css',
})
export class GameTestComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  //TODO viewChildren with a base component. Or have here a list of "objects" with their own logic and components
  private cells!: CellsComponent;
  private camera!: CameraComponent;

  canvasWidth = 800;
  canvasHeight = 600;
  //TODO cells related, move it to CellsComponent
  boundsOffset = 0;

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
    //TODO this is being called every restart. it shouldn't recreate a new component. instead we should reset it
    runInInjectionContext(this.injector, () => {
      this.cells = new CellsComponent(this.canvasWidth, this.canvasHeight);
      this.camera = new CameraComponent();
    });
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
      this.draw();
    }
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime: number) {
    this.cells.update(deltaTime);
  }

  draw() {
    this.camera.apply(this.ctx);
    this.cells.draw(this.ctx);
  }

  isMouseButtonDown: boolean = false;
  lastPos: Point = { x: 0, y: 0 };
  currentScreenPos: Point = { x: 0, y: 0 };
  onCanvasMouseDown(event: MouseEvent) {
    this.isMouseButtonDown = true;
    this.lastPos = { x: event.offsetX, y: event.offsetY };
  }
  onCanvasMouseUp(event: MouseEvent) {
    this.isMouseButtonDown = false;
  }
  onCanvasMouseWheel(event: WheelEvent) {
    this.camera.zoomAt(this.currentScreenPos, event.deltaY > 0 ? -1 : 1, this.ctx);
  }

  onCanvasMouseMove(event: MouseEvent) {
    this.currentScreenPos = { x: event.offsetX, y: event.offsetY };
    if (this.isMouseButtonDown) {
      let lastWorldPos = this.camera.screenToWorld(this.lastPos, this.ctx);
      let currentWorldPos = this.camera.screenToWorld(this.currentScreenPos, this.ctx);
      let worldDiff: Point = {
        x: currentWorldPos.x - lastWorldPos.x,
        y: currentWorldPos.y - lastWorldPos.y,
      };

      this.camera.move(worldDiff, this.ctx);
    }
    this.lastPos = { ...this.currentScreenPos };
  }

  onMouseLeave(event: MouseEvent) {
    this.isMouseButtonDown = false;
  }
}
