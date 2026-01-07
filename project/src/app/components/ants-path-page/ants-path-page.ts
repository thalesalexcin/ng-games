import { Component } from '@angular/core';
import { GameComponent } from '../shared/game/game';
import { AntsPathGameComponent } from '../ants-path-game/ants-path-game';

@Component({
  selector: 'app-ants-path-page',
  imports: [GameComponent, AntsPathGameComponent],
  templateUrl: './ants-path-page.html',
  styleUrl: './ants-path-page.css',
})
export class AntsPathPage {}
