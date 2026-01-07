import { Point } from '../../models/point';
import { AntsPath } from '../../classes/ants-path';
import { Component } from '@angular/core';
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

  override init(): void {
    let canvasWidth = 800;
    let canvasHeight = 600;
    let worldOffset: Point = {
      x: -canvasWidth * 0.5,
      y: -canvasHeight * 0.5,
    };
    this.antPathLogic = new AntsPath(canvasWidth, canvasHeight, worldOffset);
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
