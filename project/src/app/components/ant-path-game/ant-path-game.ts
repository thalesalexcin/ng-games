import { Point } from '../../models/point';
import { AntsPath } from '../../classes/ants-path';
import { Component } from '@angular/core';
import { ENTITY, Entity } from '../../classes/entity';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-ant-path-game',
  templateUrl: './ant-path-game.html',
  styleUrl: './ant-path-game.css',
  imports: [],
  providers: [{ provide: ENTITY, useExisting: AntPathGameComponent }],
})
export class AntPathGameComponent extends Entity {
  private antPathLogic!: AntsPath;

  override init(): void {
    let canvasWidth = 800;
    let canvasHeight = 600;
    let worldOffset: Point = {
      x: -canvasWidth * 0.5,
      y: -canvasHeight * 0.5,
    };
    this.antPathLogic = new AntsPath(canvasWidth, canvasHeight, worldOffset);
  }

  override initController(controller: CameraController): void {}

  override update(deltaTime: number): void {
    this.antPathLogic.update(deltaTime);
  }
  override draw(ctx: CanvasRenderingContext2D): void {
    this.antPathLogic.draw(ctx);
  }
}
