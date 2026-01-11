import { Component, OnInit, viewChild } from '@angular/core';
import { GameComponent } from '../shared/game/game';
import { AntsPathGameMode } from '../ants-path-game/ants-path-game';

@Component({
  selector: 'app-ants-path-page',
  imports: [GameComponent, AntsPathGameMode],
  templateUrl: './ants-path-page.html',
  styleUrl: './ants-path-page.css',
})
export class AntsPathPage implements OnInit {
  protected canvasWidth: number = 800;
  protected canvasHeight: number = 600;

  private gameComponent = viewChild.required(GameComponent);

  public ngOnInit(): void {
    this.canvasWidth = screen.width / 2;
    this.canvasHeight = screen.height / 2;
  }

  protected onFullscreenButtonClick() {
    this.gameComponent().toggleFullscreen();
  }
}
