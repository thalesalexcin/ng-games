export interface GridCoords {
  row: number;
  column: number;
}

export class Grid<T> {
  private data: T[];
  private _length: number;

  constructor(private rows: number, private columns: number, defaultValue?: T) {
    this._length = rows * columns;

    this.data = [];

    if (defaultValue != undefined) {
      for (let i = 0; i < this.length; i++) {
        this.data[i] = defaultValue;
      }
    }
  }

  copy(): Grid<T> {
    let copy = new Grid<T>(this.rows, this.columns);
    copy.data = [...this.data];
    return copy;
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
    return coords.row * this.columns + coords.column;
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

  indexToCoords(index: number): GridCoords {
    let coords: GridCoords = {
      row: Math.floor(index / this.columns),
      column: this.mod(index, this.columns),
    };

    return coords;
  }

  /**
   * @param n Current number to apply the modulo
   * @param m The modulo
   * @returns A positive number between 0 and m
   */
  mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

  get length(): number {
    return this._length;
  }
}
