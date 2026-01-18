import { Routes } from '@angular/router';
import { GameOfLifePage } from './components/pages/game-of-life-page/game-of-life-page';
import { AntsPathPage } from './components/pages/ants-path-page/ants-path-page';

const sharedRoutes: Routes = [
  { path: 'game-of-life', component: GameOfLifePage },
  { path: 'ants-path', component: AntsPathPage },
  { path: '', component: GameOfLifePage },
  { path: '**', redirectTo: '' },
];

export const routes: Routes = [...sharedRoutes];
