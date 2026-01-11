import { InjectionToken } from '@angular/core';
import { CameraController } from './camera-controller';

export const GAME_MODE = new InjectionToken<GameMode>('GAME_MODE');
export abstract class GameMode {
  abstract init(canvasWidth: number, canvasHeight: number): void;
  abstract initController(controller: CameraController): void;
  abstract update(deltaTime: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract resize(canvasWidth: number, canvasHeight: number): void;
}
