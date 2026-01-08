import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { InputController } from '../../../classes/input-controller';
import { DefaultController } from '../../../classes/default-controller';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.css',
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  canvasWidth = input<number>(800);
  canvasHeight = input<number>(600);

  private currentController: InputController;

  setController(controller: InputController) {
    this.currentController.exit();
    this.currentController = controller;
    this.currentController.enter();
  }

  constructor() {
    this.currentController = new DefaultController();
    this.currentController.enter();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if (!this.ctx) {
      return;
    }

    this.ctx.imageSmoothingEnabled = false;
  }

  onCanvasMouseDown(event: MouseEvent) {
    this.currentController.onMouseDown(event);
  }
  onCanvasMouseUp(event: MouseEvent) {
    this.currentController.onMouseUp(event);
  }
  onCanvasMouseWheel(event: WheelEvent) {
    event.preventDefault();
    this.currentController.onMouseWheel(event);
  }

  onCanvasMouseMove(event: MouseEvent) {
    this.currentController.onMouseMove(event);
  }

  onCanvasMouseLeave(event: MouseEvent) {
    this.currentController.onMouseLeave(event);
  }
}
