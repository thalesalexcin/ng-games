import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { GameComponent } from '../shared/game/game';
import { RandomService } from '../../services/random-service';
import { GameOfLifeGameMode } from '../game-of-life-game/game-of-life-game';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-of-life-page',
  imports: [GameComponent, FormsModule, NgClass, GameOfLifeGameMode],
  templateUrl: './game-of-life-page.html',
  styleUrl: './game-of-life-page.css',
})
export class GameOfLifePage implements OnInit {
  //TODO game state related, move to its own component / store
  protected currentSeed = signal<string>('');
  protected lastSeed = signal<string>('');
  protected speedFactor = signal<number>(1);

  private randomService = inject(RandomService);
  private gameOfLifeGame = viewChild.required(GameOfLifeGameMode);
  private game = viewChild.required(GameComponent);

  public ngOnInit(): void {
    this.generateNewSeed();
  }

  public get isPaused(): boolean {
    return this.game().isPaused();
  }

  protected onRestartClick() {
    this.randomService.setSeed(this.currentSeed());
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
  }
  protected onGenerateNewClick() {
    this.generateNewSeed();
    this.gameOfLifeGame().reset();
    this.gameOfLifeGame().fillRandom();
  }

  protected onStartPauseClick() {
    this.setPause(!this.isPaused);
  }

  protected onNextGenerationClick() {
    this.setPause(true);
    this.gameOfLifeGame().nextGeneration();
  }

  protected onClearClick() {
    this.gameOfLifeGame().reset();
  }

  protected onSpeedFactorInput() {
    this.gameOfLifeGame().setSpeedFactor(this.speedFactor());
  }

  private setPause(value: boolean) {
    this.game().setPaused(value);
  }

  private generateNewSeed() {
    this.lastSeed.set(this.currentSeed());
    this.currentSeed.set(Math.floor(Math.random() * 3541684621335).toString());
    this.randomService.setSeed(this.currentSeed());
  }
}
