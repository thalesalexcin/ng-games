import { GridCoords } from '../../models/grid-coords';
import { MathEx } from './math-ex';

export class Grid<T> {
  private data: T[];

  private _length: number;
  get length(): number {
    return this._length;
  }

  constructor(private rows: number, private columns: number, defaultValue?: T) {
    this._length = rows * columns;

    this.data = [];

    if (defaultValue != undefined) {
      for (let i = 0; i < this.length; i++) {
        this.data[i] = defaultValue;
      }
    }
  }

  getByIndex(index: number): T {
    return this.data[index];
  }

  setAtIndex(index: number, value: T) {
    this.data[index] = value;
  }

  get(coords: GridCoords): T {
    let index = this.coordsToIndex(coords);
    return this.getByIndex(index);
  }

  set(coords: GridCoords, value: T) {
    let index = this.coordsToIndex(coords);
    this.setAtIndex(index, value);
  }

  coordsToIndex(coords: GridCoords): number {
    return MathEx.coordsToIndex(coords, this.columns);
  }

  indexToCoords(index: number): GridCoords {
    return MathEx.indexToCoords(index, this.columns);
  }

  isValidIndex(index: number): boolean {
    return index >= 0 && index < this.length;
  }

  isValidCoords(coords: GridCoords): boolean {
    return (
      coords.row >= 0 &&
      coords.row < this.rows &&
      coords.column >= 0 &&
      coords.column < this.columns
    );
  }
}
