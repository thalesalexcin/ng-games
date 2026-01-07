import { Routes } from '@angular/router';
import { GameTestComponent } from './components/game-test/game-test';
import { AntsPathPage } from './components/ants-path-page/ants-path-page';

const sharedRoutes: Routes = [
  { path: 'game-of-life', component: GameTestComponent },
  { path: 'ants-path', component: AntsPathPage },
];

export const routes: Routes = [...sharedRoutes];
