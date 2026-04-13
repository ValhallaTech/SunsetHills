import { calculateStatistics, updateStatisticsDisplay } from '../js/statistics.js';

describe('calculateStatistics', () => {
  test('calculates correct statistics for typical input', () => {
    const heights = [71, 55, 50, 65, 95, 68, 28, 34, 14];
    const solutionIndices = [0, 4];
    const stats = calculateStatistics(heights, solutionIndices);

    expect(stats.total).toBe(9);
    expect(stats.withView).toBe(2);
    expect(stats.withoutView).toBe(7);
    expect(stats.percentageWithView).toBe(22);
    expect(stats.tallest).toBe(95);
    expect(stats.shortest).toBe(14);
    expect(stats.average).toBe(53); // Math.round(480/9) = 53
  });

  test('handles single building', () => {
    const stats = calculateStatistics([50], [0]);

    expect(stats.total).toBe(1);
    expect(stats.withView).toBe(1);
    expect(stats.withoutView).toBe(0);
    expect(stats.percentageWithView).toBe(100);
    expect(stats.average).toBe(50);
    expect(stats.tallest).toBe(50);
    expect(stats.shortest).toBe(50);
  });

  test('handles all buildings with same height', () => {
    const heights = [50, 50, 50];
    const solutionIndices = [0];
    const stats = calculateStatistics(heights, solutionIndices);

    expect(stats.total).toBe(3);
    expect(stats.withView).toBe(1);
    expect(stats.withoutView).toBe(2);
    expect(stats.percentageWithView).toBe(33);
    expect(stats.average).toBe(50);
  });

  test('handles all buildings with view', () => {
    const heights = [10, 20, 30];
    const solutionIndices = [0, 1, 2];
    const stats = calculateStatistics(heights, solutionIndices);

    expect(stats.percentageWithView).toBe(100);
    expect(stats.withoutView).toBe(0);
  });

  test('handles empty arrays gracefully', () => {
    const stats = calculateStatistics([], []);

    expect(stats.total).toBe(0);
    expect(stats.withView).toBe(0);
    expect(stats.percentageWithView).toBe(0);
    expect(stats.average).toBe(0);
  });
});

describe('updateStatisticsDisplay', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="statisticsDisplay"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders statistics into the DOM', () => {
    const stats = {
      total: 9,
      withView: 2,
      withoutView: 7,
      percentageWithView: 22,
      average: 53,
      tallest: 95,
      shortest: 14,
    };

    updateStatisticsDisplay(stats);

    const container = document.getElementById('statisticsDisplay');
    expect(container.innerHTML).toContain('2');
    expect(container.innerHTML).toContain('7');
    expect(container.innerHTML).toContain('22%');
    expect(container.innerHTML).toContain('53');
    expect(container.innerHTML).toContain('95');
    expect(container.innerHTML).toContain('14');
    expect(container.innerHTML).toContain('9');
  });

  test('logs error when container not found', () => {
    document.body.innerHTML = '';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    updateStatisticsDisplay({ total: 0 });

    expect(consoleSpy).toHaveBeenCalledWith('Statistics display element not found');
    consoleSpy.mockRestore();
  });
});
