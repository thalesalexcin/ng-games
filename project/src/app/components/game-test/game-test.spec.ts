import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTestComponent } from './game-test';

describe('GameTestComponent', () => {
  let component: GameTestComponent;
  let fixture: ComponentFixture<GameTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameTestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
