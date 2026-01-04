import { Grid } from './grid';

describe('Grid', () => {
  let grid: Grid<number>;

  beforeEach(() => {
    grid = new Grid<number>(4, 5, 0); // 4 rows, 5 columns
  });

  // -----------------------------
  // Construction
  // -----------------------------
  it('should initialize with correct length', () => {
    expect(grid.length).toBe(20);
  });

  it('should initialize all values to default value', () => {
    for (let i = 0; i < grid.length; i++) {
      expect(grid.getByIndex(i)).toBe(0);
    }
  });

  // -----------------------------
  // Index access
  // -----------------------------
  it('should set and get value by index', () => {
    grid.setAtIndex(3, 42);
    expect(grid.getByIndex(3)).toBe(42);
  });

  // -----------------------------
  // Coordinate access
  // -----------------------------
  it('should set and get value by coordinates', () => {
    grid.set({ row: 2, column: 3 }, 99);
    expect(grid.get({ row: 2, column: 3 })).toBe(99);
  });

  // -----------------------------
  // coordsToIndex
  // -----------------------------
  it('should convert coords to index correctly', () => {
    expect(grid.coordsToIndex({ row: 0, column: 0 })).toBe(0);
    expect(grid.coordsToIndex({ row: 1, column: 0 })).toBe(5);
    expect(grid.coordsToIndex({ row: 3, column: 4 })).toBe(19);
  });

  // -----------------------------
  // indexToCoords
  // -----------------------------
  it('should convert index to coords correctly', () => {
    expect(grid.indexToCoords(0)).toEqual({ row: 0, column: 0 });
    expect(grid.indexToCoords(5)).toEqual({ row: 1, column: 0 });
    expect(grid.indexToCoords(19)).toEqual({ row: 3, column: 4 });
  });

  // -----------------------------
  // Validation
  // -----------------------------
  it('should validate indices correctly', () => {
    expect(grid.isValidIndex(0)).toBeTruthy();
    expect(grid.isValidIndex(19)).toBeTruthy();
    expect(grid.isValidIndex(-1)).toBeFalsy();
    expect(grid.isValidIndex(20)).toBeFalsy();
  });

  it('should validate coords correctly', () => {
    expect(grid.isValidCoords({ row: 0, column: 0 })).toBeTruthy();
    expect(grid.isValidCoords({ row: 3, column: 4 })).toBeTruthy();
    expect(grid.isValidCoords({ row: 4, column: 0 })).toBeFalsy();
    expect(grid.isValidCoords({ row: 0, column: 5 })).toBeFalsy();
  });
});
