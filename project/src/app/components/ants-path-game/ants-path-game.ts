import { Point } from '../../models/point';
import { AntsPath } from '../../classes/ants-path';
import { Component, input } from '@angular/core';
import { ENTITY, Entity } from '../../classes/entity';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-ants-path-game',
  templateUrl: './ants-path-game.html',
  styleUrl: './ants-path-game.css',
  imports: [],
  providers: [{ provide: ENTITY, useExisting: AntsPathGameComponent }],
})
export class AntsPathGameComponent extends Entity {
  private antPathLogic!: AntsPath;

  gridWidth = input<number>(800);
  gridHeight = input<number>(600);

  override init(canvasWidth: number, canvasHeight: number): void {
    let worldOffset: Point = {
      x: -this.gridWidth() * 0.5,
      y: -this.gridHeight() * 0.5,
    };
    let aspectRatio = canvasWidth / this.gridWidth();
    this.antPathLogic = new AntsPath(this.gridWidth(), this.gridHeight(), worldOffset, aspectRatio);
  }

  override initController(controller: CameraController): void {
    controller.onWorldClick = (worldPos) => this.antPathLogic.addAnt(worldPos);
  }

  override update(deltaTime: number): void {
    this.antPathLogic.update(deltaTime);
  }
  override draw(ctx: CanvasRenderingContext2D): void {
    this.antPathLogic.draw(ctx);
  }
}
