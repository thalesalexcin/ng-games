import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cells } from './cells';

describe('Cells', () => {
  let component: Cells;
  let fixture: ComponentFixture<Cells>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cells]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cells);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
