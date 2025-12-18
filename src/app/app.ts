import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameTestComponent } from './components/game-test/game-test';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameTestComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-games');
}
