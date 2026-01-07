import { Routes } from '@angular/router';
import { AntsPathPage } from './components/ants-path-page/ants-path-page';
import { GameOfLifePage } from './components/game-of-life-page/game-of-life-page';

const sharedRoutes: Routes = [
  { path: 'game-of-life', component: GameOfLifePage },
  { path: 'ants-path', component: AntsPathPage },
  { path: '', component: GameOfLifePage },
  { path: '**', redirectTo: '' },
];

export const routes: Routes = [...sharedRoutes];
