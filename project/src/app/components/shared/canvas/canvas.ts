import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { InputController } from '../../../classes/input-controller';
import { DefaultController } from '../../../classes/default-controller';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-canvas',
  imports: [NgClass],
  templateUrl: './canvas.html',
  styleUrl: './canvas.css',
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  public ctx!: CanvasRenderingContext2D;

  protected isFullscreen = signal<boolean>(false);
  public canvasWidth = input<number>(800);
  public canvasHeight = input<number>(600);
  public fullscreenEnabled = input<boolean>(false);
  public onResize = output<void>();

  private currentController: InputController;

  constructor() {
    this.currentController = new DefaultController();
    this.currentController.enter();
  }

  public ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if (!this.ctx) {
      return;
    }

    this.ctx.imageSmoothingEnabled = false;
  }

  public setController(controller: InputController) {
    this.currentController.exit();
    this.currentController = controller;
    this.currentController.enter();
  }

  public toggleFullscreenMode() {
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    if (!isFullscreen) {
      this.canvas.nativeElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  @HostListener('window:resize')
  protected resize() {
    if (!this.fullscreenEnabled()) {
      return;
    }
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

    const canvas = this.canvas.nativeElement;
    if (isFullscreen) {
      canvas.width = screen.width;
      canvas.height = screen.height;
      this.isFullscreen.set(true);
    } else {
      canvas.width = this.canvasWidth();
      canvas.height = this.canvasHeight();
      this.isFullscreen.set(false);
    }
    this.onResize.emit();
    this.ngAfterViewInit();
  }

  protected onCanvasMouseDown(event: MouseEvent) {
    this.currentController.onMouseDown(event);
  }
  protected onCanvasMouseUp(event: MouseEvent) {
    this.currentController.onMouseUp(event);
  }

  protected onCanvasMouseWheel(event: WheelEvent) {
    event.preventDefault();
    this.currentController.onMouseWheel(event);
  }

  protected onCanvasMouseMove(event: MouseEvent) {
    this.currentController.onMouseMove(event);
  }

  protected onCanvasMouseLeave(event: MouseEvent) {
    this.currentController.onMouseLeave(event);
  }
}
