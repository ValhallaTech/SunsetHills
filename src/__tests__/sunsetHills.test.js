import { solveSunsetHills, getBuildingLabels, formatSolution } from '../js/sunsetHills.js';

describe('solveSunsetHills', () => {
  test('returns empty array for null input', () => {
    expect(solveSunsetHills(null)).toEqual([]);
  });

  test('returns empty array for empty array', () => {
    expect(solveSunsetHills([])).toEqual([]);
  });

  test('returns index 0 for a single building', () => {
    expect(solveSunsetHills([50])).toEqual([0]);
  });

  test('returns all indices for descending heights', () => {
    expect(solveSunsetHills([90, 80, 70, 60, 50])).toEqual([0]);
  });

  test('returns all indices for strictly ascending heights', () => {
    expect(solveSunsetHills([10, 20, 30, 40, 50])).toEqual([0, 1, 2, 3, 4]);
  });

  test('returns only first index for equal heights', () => {
    expect(solveSunsetHills([50, 50, 50])).toEqual([0]);
  });

  test('handles the default preset correctly', () => {
    const heights = [71, 55, 50, 65, 95, 68, 28, 34, 14];
    const result = solveSunsetHills(heights);
    expect(result).toEqual([0, 4]);
  });

  test('handles zigzag pattern', () => {
    const heights = [80, 20, 70, 30, 60, 40, 50, 45, 90];
    const result = solveSunsetHills(heights);
    expect(result).toEqual([0, 8]);
  });

  test('handles pyramid pattern', () => {
    const heights = [30, 50, 70, 85, 95, 85, 70, 50, 30];
    const result = solveSunsetHills(heights);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });

  test('returns undefined input as empty', () => {
    expect(solveSunsetHills(undefined)).toEqual([]);
  });
});

describe('getBuildingLabels', () => {
  test('converts indices to building labels', () => {
    expect(getBuildingLabels([0, 2, 4])).toEqual([
      'Building 1',
      'Building 3',
      'Building 5',
    ]);
  });

  test('returns empty array for empty input', () => {
    expect(getBuildingLabels([])).toEqual([]);
  });

  test('handles single index', () => {
    expect(getBuildingLabels([0])).toEqual(['Building 1']);
  });
});

describe('formatSolution', () => {
  test('returns no-sunset message for empty solution', () => {
    expect(formatSolution([50, 60], [])).toBe('No buildings can see the sunset.');
  });

  test('formats single building solution', () => {
    const result = formatSolution([50], [0]);
    expect(result).toContain('1 building(s) can see the sunset');
    expect(result).toContain('Building 1 (height: 50)');
  });

  test('formats multiple building solution', () => {
    const result = formatSolution([50, 70, 60], [0, 1]);
    expect(result).toContain('2 building(s) can see the sunset');
    expect(result).toContain('Building 1 (height: 50)');
    expect(result).toContain('Building 2 (height: 70)');
  });
});
