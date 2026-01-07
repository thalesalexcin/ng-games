import { GridCoords } from '../../models/grid-coords';

export class MathEx {
  /**
   * @param n Current number to apply the modulo
   * @param m The modulo
   * @returns A positive number between 0 and m
   */
  static mod(n: number, m: number): number {
    return n - m * Math.floor(n / m);
  }

  /**
   * @param v the value to be clamped
   * @param min the minimum value
   * @param max the maximum value
   * @returns Clamped value between min and max
   */
  static clamp(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max);
  }

  static indexToCoords(i: number, gridWidth: number): GridCoords {
    let coords: GridCoords = {
      row: Math.floor(i / gridWidth),
      column: MathEx.mod(i, gridWidth),
    };

    return coords;
  }

  static coordsToIndex(coords: GridCoords, gridWidth: number): number {
    return coords.row * gridWidth + coords.column;
  }
}
