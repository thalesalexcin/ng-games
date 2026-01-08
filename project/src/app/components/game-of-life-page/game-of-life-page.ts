import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { GameComponent } from '../shared/game/game';
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
export class GameOfLifePage implements OnInit {
  //TODO game state related, move to its own component / store
  currentSeed = signal<string>('');
  lastSeed = signal<string>('');
  speedFactor = signal<number>(1);
  isPaused = signal<boolean>(false);
  randomService = inject(RandomService);
  gameOfLifeGame = viewChild.required(GameOfLifeGame);
  game = viewChild.required(GameComponent);

  ngOnInit(): void {
    this.generateNewSeed();
  }

  onRestartClick() {
    this.randomService.setSeed(this.currentSeed());
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
    this.game().forceDraw();
  }
  onGenerateNewClick() {
    this.generateNewSeed();
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
    //TODO shouldn't call draw directly
    this.game().forceDraw();
  }

  onStartPauseClick() {
    this.setPause(!this.isPaused());
  }

  onNextGenerationClick() {
    this.setPause(true);
    this.gameOfLifeGame().nextGeneration();
  }

  onClearClick() {
    this.gameOfLifeGame().reset();
  }

  onSpeedFactorInput() {
    this.gameOfLifeGame().setSpeedFactor(this.speedFactor());
  }

  setPause(value: boolean) {
    this.game().isPaused.set(value);
    this.isPaused.set(value);
  }

  generateNewSeed() {
    this.lastSeed.set(this.currentSeed());
    this.currentSeed.set(Math.floor(Math.random() * 3541684621335).toString());
    this.randomService.setSeed(this.currentSeed());
  }
}
