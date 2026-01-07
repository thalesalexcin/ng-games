import { InjectionToken } from '@angular/core';
import { CameraController } from './camera-controller';

export const ENTITY = new InjectionToken<Entity>('ENTITY');
export abstract class Entity {
  abstract init(): void;
  abstract initController(controller: CameraController): void;
  abstract update(deltaTime: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
