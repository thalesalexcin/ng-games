import { Routes } from '@angular/router';
import { GameTestComponent } from './components/game-test/game-test';
import { AntPathGame as AntPathGameComponent } from './components/ant-path-game/ant-path-game';

const sharedRoutes: Routes = [
  { path: 'game-of-life', component: GameTestComponent },
  { path: 'ant-path', component: AntPathGameComponent },
];

export const routes: Routes = [...sharedRoutes];
