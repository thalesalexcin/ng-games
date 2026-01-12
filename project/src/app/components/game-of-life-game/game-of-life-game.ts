import { Component, input } from '@angular/core';
import { GAME_MODE, GameMode } from '../../classes/game-mode';
import { GameOfLifeLogic } from '../../classes/game-of-life';
import { Point } from '../../models/point';
import { CameraController } from '../../classes/camera-controller';

@Component({
  selector: 'app-game-of-life-game',
  imports: [],
  templateUrl: './game-of-life-game.html',
  styleUrl: './game-of-life-game.css',
  providers: [{ provide: GAME_MODE, useExisting: GameOfLifeGameMode }],
})
export class GameOfLifeGameMode extends GameMode {
  public gridWidth = input<number>(800);
  public gridHeight = input<number>(600);

  private gameOfLife!: GameOfLifeLogic;

  public nextGeneration() {
    this.gameOfLife.forceNextGeneration();
  }

  public setSpeedFactor(speedFactor: number) {
    this.gameOfLife.speedFactor = speedFactor;
  }

  public fillRandom() {
    this.gameOfLife.fillRandom();
  }

  public reset() {
    this.gameOfLife.reset();
  }

  override init(canvasWidth: number, canvasHeight: number): void {
    let worldOffset: Point = {
      x: -this.gridWidth() * 0.5,
      y: -this.gridHeight() * 0.5,
    };

    let aspectRatio = canvasWidth / this.gridWidth();
    this.gameOfLife = new GameOfLifeLogic(
      this.gridWidth(),
      this.gridHeight(),
      worldOffset,
      aspectRatio
    );
  }

  override initController(controller: CameraController): void {
    controller.onWorldClick = (worldPos: Point) => {
      this.gameOfLife.toggleAlive(worldPos);
    };

    controller.onWorldClickMove = (worldPos: Point) => {
      this.gameOfLife.setAlive(worldPos);
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

  override resize(canvasWidth: number, canvasHeight: number): void {}
}
