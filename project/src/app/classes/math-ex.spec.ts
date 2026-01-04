import { MathEx } from './math-ex';

describe('MathEx', () => {
  // -----------------------------
  // Modulo
  // -----------------------------
  it('should return positive modulo results', () => {
    expect(MathEx.mod(5, 5)).toBe(0);
    expect(MathEx.mod(6, 5)).toBe(1);
    expect(MathEx.mod(-1, 5)).toBe(4);
    expect(MathEx.mod(-6, 5)).toBe(4);
  });
});
