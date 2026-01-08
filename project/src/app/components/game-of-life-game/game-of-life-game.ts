import { Component, input } from '@angular/core';
import { ENTITY, Entity } from '../../classes/entity';
import { GameOfLife } from '../../classes/game-of-life';
import { Point } from '../../models/point';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-game-of-life-game',
  imports: [],
  templateUrl: './game-of-life-game.html',
  styleUrl: './game-of-life-game.css',
  providers: [{ provide: ENTITY, useExisting: GameOfLifeGame }],
})
export class GameOfLifeGame extends Entity {
  private gameOfLife!: GameOfLife;

  gridWidth = input<number>(800);
  gridHeight = input<number>(600);

  setSpeedFactor(speedFactor: number) {
    this.gameOfLife.speedFactor = speedFactor;
  }

  fillRandom() {
    this.gameOfLife.fillRandom();
  }
  reset() {
    this.gameOfLife.reset();
  }

  override init(canvasWidth: number, canvasHeight: number): void {
    let worldOffset: Point = {
      x: -this.gridWidth() * 0.5,
      y: -this.gridHeight() * 0.5,
    };

    let aspectRatio = canvasWidth / this.gridWidth();
    this.gameOfLife = new GameOfLife(this.gridWidth(), this.gridHeight(), worldOffset, aspectRatio);
  }

  override initController(controller: CameraController): void {
    controller.onWorldClick = (worldPos: Point) => {
      this.gameOfLife.toggleAlive(worldPos);
    };

    controller.onWorldHoverEnter = (worldPos: Point) => {
      this.gameOfLife.setHoverWorldPosition(worldPos);
    };
    controller.onWorldHoverLeave = () => {
      this.gameOfLife.setHoverWorldPosition(undefined);
    };
  }

  override update(deltaTime: number): void {
    this.gameOfLife.update(deltaTime);
  }
  override draw(ctx: CanvasRenderingContext2D): void {
    this.gameOfLife.draw(ctx);
  }
}
