import { Component } from '@angular/core';
import { GameComponent } from '../game/game';
import { AntPathGameComponent } from '../ant-path-game/ant-path-game';

@Component({
  selector: 'app-ants-path-page',
  imports: [GameComponent, AntPathGameComponent],
  templateUrl: './ants-path-page.html',
  styleUrl: './ants-path-page.css',
})
export class AntsPathPage {}
