import { Component, inject, signal, viewChild } from '@angular/core';
import { GameComponent } from '../game/game';
import { RandomService } from '../../services/random-service';
import { GameOfLifeGame } from '../game-of-life-game/game-of-life-game';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-of-life-page',
  imports: [GameComponent, FormsModule, NgClass, GameOfLifeGame],
  templateUrl: './game-of-life-page.html',
  styleUrl: './game-of-life-page.css',
})
export class GameOfLifePage {
  //TODO game state related, move to its own component / store
  currentSeed = signal<string>('');
  lastSeed = signal<string>('');
  speedFactor = signal<number>(1);
  isPaused = signal<boolean>(false);
  randomService = inject(RandomService);
  gameOfLifeGame = viewChild.required(GameOfLifeGame);
  game = viewChild.required(GameComponent);

  onRestartClick() {
    this.randomService.setSeed(this.currentSeed());
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
    this.game().draw();
  }
  onGenerateNewClick() {
    this.generateNewSeed();
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
    //TODO shouldn't call draw directly
    this.game().draw();
  }

  onStartPauseClick() {
    this.game().isPaused.set(!this.game().isPaused());
    this.isPaused.set(this.game().isPaused());
  }

  onNextGenerationClick() {
    this.isPaused.set(true);
    this.game().nextTick();
  }

  onClearClick() {
    this.gameOfLifeGame().reset();
    this.game().nextTick();
  }

  generateNewSeed() {
    this.lastSeed.set(this.currentSeed());
    this.currentSeed.set(Math.floor(Math.random() * 3541684621335).toString());
    //this.currentSeed.set('3086406898735');
    //let test = { row: 0, column: 0.1 };
    this.randomService.setSeed(this.currentSeed());
  }
}
