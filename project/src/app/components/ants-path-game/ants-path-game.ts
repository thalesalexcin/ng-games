import { Point } from '../../models/point';
import { AntsPath } from '../../classes/ants-path';
import { Component } from '@angular/core';
import { GAME_MODE, GameMode } from '../../classes/game-mode';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-ants-path-game',
  templateUrl: './ants-path-game.html',
  styleUrl: './ants-path-game.css',
  imports: [],
  providers: [{ provide: GAME_MODE, useExisting: AntsPathGameMode }],
})
export class AntsPathGameMode extends GameMode {
  private antPathLogic!: AntsPath;

  override init(canvasWidth: number, canvasHeight: number): void {
    let gridWidth = screen.width;
    let gridHeight = screen.height;
    let worldOffset: Point = {
      x: -gridWidth * 0.5,
      y: -gridHeight * 0.5,
    };
    let aspectRatio = canvasWidth / gridWidth;
    this.antPathLogic = new AntsPath(gridWidth, gridHeight, worldOffset, aspectRatio);
  }

  override resize(width: number, height: number): void {
    let aspectRatio = width / screen.width;
    this.antPathLogic.setAspectRatio(aspectRatio);
  }

  override initController(controller: CameraController): void {
    controller.onWorldClick = (worldPos) => this.antPathLogic.addAnt(worldPos, 1);
    controller.onWorldClickMove = (worldPos) => this.antPathLogic.addAnt(worldPos, 1);
  }

  override update(deltaTime: number): void {
    this.antPathLogic.update(deltaTime);
  }
  override draw(ctx: CanvasRenderingContext2D): void {
    this.antPathLogic.draw(ctx);
  }
}
