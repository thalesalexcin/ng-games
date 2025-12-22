export class MathEx {
  /**
   * @param n Current number to apply the modulo
   * @param m The modulo
   * @returns A positive number between 0 and m
   */
  static mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }
}
