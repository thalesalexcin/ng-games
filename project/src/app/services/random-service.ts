import { Injectable } from '@angular/core';
import seedrandom from 'seedrandom';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  rnd: seedrandom.PRNG;
  currentSeed: string;

  constructor() {
    this.currentSeed = '';
    this.rnd = seedrandom(this.currentSeed);
  }
  reset() {
    this.rnd = seedrandom(this.currentSeed);
  }

  setSeed(newSeed: string) {
    this.currentSeed = newSeed;
    this.rnd = seedrandom(this.currentSeed);
  }
}
