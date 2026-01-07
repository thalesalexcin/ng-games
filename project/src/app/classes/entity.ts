import { InjectionToken } from '@angular/core';

export const ENTITY = new InjectionToken<Entity>('ENTITY');
export abstract class Entity {
  abstract init(): void;
  abstract update(deltaTime: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
