import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameTestComponent } from './components/game-test/game-test';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameTestComponent, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-games');
}
