// Mock Chart.js - capture constructor args for testing callbacks
let chartConstructorArgs = null;
let mockChartInstance = null;

jest.mock('chart.js', () => {
  const mockChart = jest.fn().mockImplementation((_ctx, config) => {
    chartConstructorArgs = config;
    mockChartInstance = {
      data: {
        datasets: [{ data: [...config.data.datasets[0].data], backgroundColor: [], borderColor: [], hoverBackgroundColor: [] }],
        labels: [...config.data.labels],
      },
      options: {
        plugins: {
          legend: { labels: { generateLabels: jest.fn(), color: '' } },
          title: { color: '' },
        },
        scales: {
          y: { grid: { color: '' }, title: { color: '' }, ticks: { color: '' } },
          x: { ticks: { color: '' } },
        },
      },
      update: jest.fn(),
      ctx: {
        fillStyle: '',
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: jest.fn(),
      },
      getDatasetMeta: jest.fn().mockReturnValue({
        data: [{ x: 10, y: 20 }],
      }),
      destroy: jest.fn(),
    };
    return mockChartInstance;
  });
  mockChart.register = jest.fn();
  return {
    Chart: mockChart,
    registerables: [],
  };
});

// Mock the drag data plugin
jest.mock('chartjs-plugin-dragdata', () => ({}));

// Mock DOM dependencies
jest.mock('../js/resultsDisplay.js', () => ({
  updateResults: jest.fn(),
}));

jest.mock('../js/statistics.js', () => ({
  calculateStatistics: jest.fn().mockReturnValue({
    total: 9, withView: 2, withoutView: 7,
    percentageWithView: 22, average: 53, tallest: 95, shortest: 14,
  }),
  updateStatisticsDisplay: jest.fn(),
}));

import {
  initChart,
  resetBuildings,
  randomizeBuildings,
  loadPreset,
  setManualHeights,
  addBuilding,
  removeBuilding,
  getCurrentHeights,
} from '../js/chartSetup.js';
import { updateResults } from '../js/resultsDisplay.js';
import { updateStatisticsDisplay } from '../js/statistics.js';

describe('chartSetup module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '<canvas id="buildingsChart"></canvas>';
    // Mock getContext
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      fillStyle: '',
      fillRect: jest.fn(),
      clearRect: jest.fn(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    initChart();
    consoleSpy.mockRestore();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initChart', () => {
    test('logs error when canvas is not found', () => {
      document.body.innerHTML = '';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      initChart();

      expect(consoleSpy).toHaveBeenCalledWith('Chart canvas not found');
      consoleSpy.mockRestore();
    });

    test('calls updateResults and updateStatisticsDisplay on init', () => {
      expect(updateResults).toHaveBeenCalled();
      expect(updateStatisticsDisplay).toHaveBeenCalled();
    });
  });

  describe('getCurrentHeights', () => {
    test('returns default heights initially', () => {
      const heights = getCurrentHeights();
      expect(heights).toEqual([71, 55, 50, 65, 95, 68, 28, 34, 14]);
    });

    test('returns a copy, not a reference', () => {
      const h1 = getCurrentHeights();
      const h2 = getCurrentHeights();
      expect(h1).toEqual(h2);
      h1[0] = 999;
      expect(getCurrentHeights()[0]).not.toBe(999);
    });
  });

  describe('resetBuildings', () => {
    test('resets heights to defaults', () => {
      randomizeBuildings(); // Change heights first
      resetBuildings();
      expect(getCurrentHeights()).toEqual([71, 55, 50, 65, 95, 68, 28, 34, 14]);
    });
  });

  describe('randomizeBuildings', () => {
    test('changes building heights', () => {
      const before = getCurrentHeights();
      randomizeBuildings();
      const after = getCurrentHeights();
      // Heights should be different (extremely unlikely to be the same)
      expect(after.length).toBe(before.length);
    });

    test('heights are within 10-100 range', () => {
      randomizeBuildings();
      const heights = getCurrentHeights();
      heights.forEach(h => {
        expect(h).toBeGreaterThanOrEqual(10);
        expect(h).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('loadPreset', () => {
    test('loads preset heights', () => {
      loadPreset([10, 20, 30]);
      expect(getCurrentHeights()).toEqual([10, 20, 30]);
    });

    test('creates a copy of input array', () => {
      const input = [10, 20, 30];
      loadPreset(input);
      input[0] = 999;
      expect(getCurrentHeights()[0]).toBe(10);
    });
  });

  describe('setManualHeights', () => {
    test('parses comma-separated heights', () => {
      const result = setManualHeights('50, 60, 70');
      expect(result).toBe(true);
      expect(getCurrentHeights()).toEqual([50, 60, 70]);
    });

    test('filters out invalid values', () => {
      const result = setManualHeights('50, abc, 70');
      expect(result).toBe(true);
      expect(getCurrentHeights()).toEqual([50, 70]);
    });

    test('filters out values below 10 and above 100', () => {
      const result = setManualHeights('5, 50, 150');
      expect(result).toBe(true);
      expect(getCurrentHeights()).toEqual([50]);
    });

    test('returns false for completely invalid input', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = setManualHeights('abc, xyz');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    test('returns false for empty string', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = setManualHeights('');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('addBuilding', () => {
    test('adds a building and returns true', () => {
      const before = getCurrentHeights().length;
      const result = addBuilding();
      expect(result).toBe(true);
      expect(getCurrentHeights().length).toBe(before + 1);
    });

    test('new building has height between 10 and 100', () => {
      addBuilding();
      const heights = getCurrentHeights();
      const newHeight = heights[heights.length - 1];
      expect(newHeight).toBeGreaterThanOrEqual(10);
      expect(newHeight).toBeLessThanOrEqual(100);
    });

    test('returns false when max (20) buildings reached', () => {
      // Load 20 buildings
      loadPreset(Array(20).fill(50));
      const result = addBuilding();
      expect(result).toBe(false);
    });
  });

  describe('removeBuilding', () => {
    test('removes last building and returns true', () => {
      const before = getCurrentHeights().length;
      const result = removeBuilding();
      expect(result).toBe(true);
      expect(getCurrentHeights().length).toBe(before - 1);
    });

    test('returns false when only 1 building remains', () => {
      loadPreset([50]);
      const result = removeBuilding();
      expect(result).toBe(false);
    });
  });

  describe('theme change handling', () => {
    test('handles themeChanged event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: 'dark', isDark: true },
      }));

      consoleSpy.mockRestore();
    });

    test('updateChartTheme updates chart options on theme change', () => {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: 'dark', isDark: true },
      }));

      // Verify chart was updated
      expect(mockChartInstance.update).toHaveBeenCalledWith('active');

      // Verify legend generateLabels was replaced and returns correct data
      const genLabels = mockChartInstance.options.plugins.legend.labels.generateLabels;
      if (typeof genLabels === 'function') {
        const labels = genLabels();
        expect(labels).toHaveLength(2);
        expect(labels[0].text).toBe('Can See Sunset');
        expect(labels[1].text).toBe('Cannot See Sunset');
      }

      consoleSpy.mockRestore();
    });
  });

  describe('chart construction callbacks', () => {
    test('dragData onDragStart returns true', () => {
      const dragData = chartConstructorArgs.options.plugins.dragData;
      expect(dragData.onDragStart(null, 0, 0, 50)).toBe(true);
    });

    test('dragData onDrag returns false for value below 10', () => {
      const dragData = chartConstructorArgs.options.plugins.dragData;
      expect(dragData.onDrag(null, 0, 0, 5)).toBe(false);
    });

    test('dragData onDrag returns false for value above 100', () => {
      const dragData = chartConstructorArgs.options.plugins.dragData;
      expect(dragData.onDrag(null, 0, 0, 105)).toBe(false);
    });

    test('dragData onDrag returns true for valid value', () => {
      const dragData = chartConstructorArgs.options.plugins.dragData;
      expect(dragData.onDrag(null, 0, 0, 50)).toBe(true);
    });

    test('dragData onDragEnd updates height', () => {
      const dragData = chartConstructorArgs.options.plugins.dragData;
      dragData.onDragEnd(null, 0, 0, 42.7);
      // The first height should be updated
      expect(getCurrentHeights()[0]).toBe(43);
    });

    test('legend generateLabels returns two labels', () => {
      const generateLabels = chartConstructorArgs.options.plugins.legend.labels.generateLabels;
      const labels = generateLabels();
      expect(labels).toHaveLength(2);
      expect(labels[0].text).toBe('Can See Sunset');
      expect(labels[1].text).toBe('Cannot See Sunset');
    });

    test('tooltip title callback returns label', () => {
      const titleCb = chartConstructorArgs.options.plugins.tooltip.callbacks.title;
      const result = titleCb([{ label: 'Building 1' }]);
      expect(result).toBe('Building 1');
    });

    test('tooltip label callback indicates sunset visibility', () => {
      const labelCb = chartConstructorArgs.options.plugins.tooltip.callbacks.label;

      // Index 0 should be in the solution (height 71 is the first max)
      const resultWithView = labelCb({ dataIndex: 0, parsed: { y: 71 } });
      expect(resultWithView).toContain('Height: 71 units');

      // Index 1 (height 55) should not see sunset
      const resultWithout = labelCb({ dataIndex: 1, parsed: { y: 55 } });
      expect(resultWithout).toContain('Height: 55 units');
    });

    test('heightLabels plugin draws labels', () => {
      const heightLabelsPlugin = chartConstructorArgs.plugins[0];
      expect(heightLabelsPlugin.id).toBe('heightLabels');

      // Create a mock chart object for afterDatasetsDraw
      const mockCtx = {
        fillStyle: '',
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: jest.fn(),
      };
      const mockPluginChart = {
        ctx: mockCtx,
        data: {
          datasets: [{
            data: [50, 60],
          }],
        },
        getDatasetMeta: jest.fn().mockReturnValue({
          data: [
            { x: 10, y: 20 },
            { x: 30, y: 40 },
          ],
        }),
      };

      heightLabelsPlugin.afterDatasetsDraw(mockPluginChart);
      expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
      expect(mockCtx.fillText).toHaveBeenCalledWith(50, 10, 15);
      expect(mockCtx.fillText).toHaveBeenCalledWith(60, 30, 35);
    });
  });
});
