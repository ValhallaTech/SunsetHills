// ============================================
// Chart.js Setup with Drag-and-Drop
// ============================================

import { Chart, registerables } from 'chart.js';
import { dragData } from 'chartjs-plugin-dragdata';
import { solveSunsetHills } from './sunsetHills.js';
import { updateResults } from './resultsDisplay.js';
import { calculateStatistics, updateStatisticsDisplay } from './statistics.js';

// Register Chart.js components and drag plugin
Chart.register(...registerables, dragData);

// Default building heights
const DEFAULT_HEIGHTS = [71, 55, 50, 65, 95, 68, 28, 34, 14];

// Store current heights
let currentHeights = [...DEFAULT_HEIGHTS];

// Chart instance
let chart = null;

/**
 * Initializes the Chart.js bar chart with drag-and-drop functionality
 */
export function initChart() {
  const canvas = document.getElementById('buildingsChart');
  
  if (!canvas) {
    console.error('Chart canvas not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Calculate initial solution
  const solutionIndices = solveSunsetHills(currentHeights);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentHeights.map((_, i) => `Building ${i + 1}`),
      datasets: [
        {
          label: 'Building Height',
          data: currentHeights,
          backgroundColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 165, 0, 0.85)' // Sunset orange
              : 'rgba(108, 117, 125, 0.75)' // Gray
          ),
          borderColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 140, 0, 1)' // Dark orange
              : 'rgba(90, 98, 104, 1)' // Dark gray
          ),
          borderWidth: 2,
          borderRadius: 4,
          hoverBackgroundColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 165, 0, 1)' // Brighter on hover
              : 'rgba(108, 117, 125, 0.9'
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            generateLabels: function () {
              return [
                {
                  text: '?? Can See Sunset',
                  fillStyle: 'rgba(255, 165, 0, 0.85)',
                  strokeStyle: 'rgba(255, 140, 0, 1)',
                  lineWidth: 2,
                },
                {
                  text: '? Cannot See Sunset',
                  fillStyle: 'rgba(108, 117, 125, 0.75)',
                  strokeStyle: 'rgba(90, 98, 104, 1)',
                  lineWidth: 2,
                },
              ];
            },
            font: {
              size: 12,
              weight: 'bold',
            },
            padding: 15,
          },
        },
        title: {
          display: true,
          text: 'Sunset Hills - Building Heights',
          font: {
            size: 18,
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          padding: 12,
          cornerRadius: 6,
          callbacks: {
            title: function (context) {
              return context[0].label;
            },
            label: function (context) {
              const canSeeSunset = solutionIndices.includes(context.dataIndex);
              return [
                `Height: ${context.parsed.y} units`,
                canSeeSunset ? '?? Can see sunset!' : '? Cannot see sunset',
              ];
            },
          },
        },
        dragData: {
          round: 0,
          showTooltip: true,
          onDragStart: function (e, datasetIndex, index, value) {
            return true;
          },
          onDrag: function (e, datasetIndex, index, value) {
            if (value < 10) return false;
            if (value > 100) return false;
            return true;
          },
          onDragEnd: function (e, datasetIndex, index, value) {
            currentHeights[index] = Math.round(value);
            updateChart();
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
          },
          title: {
            display: true,
            text: 'Height (units)',
            font: {
              size: 14,
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 10,
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Buildings (West ? Direction of Sunset)',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#ff6b35',
          },
          ticks: {
            font: {
              size: 11,
              weight: '500',
            },
          },
        },
      },
      animation: {
        duration: 400,
        easing: 'easeInOutQuart',
      },
    },
    plugins: [
      {
        id: 'heightLabels',
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index];
              ctx.fillStyle = '#000';
              ctx.font = 'bold 12px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(data, bar.x, bar.y - 5);
            });
          });
        },
      },
    ],
  });

  // Initial updates
  updateResults(currentHeights, solutionIndices);
  updateStatisticsDisplay(calculateStatistics(currentHeights, solutionIndices));
}

/**
 * Updates the chart colors and results based on current heights
 */
function updateChart() {
  if (!chart) return;

  const solutionIndices = solveSunsetHills(currentHeights);

  // Update colors with smooth transition
  chart.data.datasets[0].backgroundColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 0.85)'
      : 'rgba(108, 117, 125, 0.75)'
  );

  chart.data.datasets[0].borderColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 140, 0, 1)'
      : 'rgba(90, 98, 104, 1)'
  );

  chart.data.datasets[0].hoverBackgroundColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 1)'
      : 'rgba(108, 117, 125, 0.9'
  );

  chart.update();

  // Update displays
  updateResults(currentHeights, solutionIndices);
  updateStatisticsDisplay(calculateStatistics(currentHeights, solutionIndices));
}

/**
 * Resets buildings to default heights
 */
export function resetBuildings() {
  currentHeights = [...DEFAULT_HEIGHTS];
  
  if (chart) {
    chart.data.datasets[0].data = currentHeights;
    chart.data.labels = currentHeights.map((_, i) => `Building ${i + 1}`);
    updateChart();
  }
}

/**
 * Randomizes building heights
 */
export function randomizeBuildings() {
  currentHeights = currentHeights.map(() => Math.floor(Math.random() * 91) + 10); // 10-100
  
  if (chart) {
    chart.data.datasets[0].data = currentHeights;
    updateChart();
  }
}

/**
 * Loads a preset configuration
 * @param {number[]} heights - Preset building heights
 */
export function loadPreset(heights) {
  currentHeights = [...heights];
  
  if (chart) {
    // Update data
    chart.data.datasets[0].data = currentHeights;
    chart.data.labels = currentHeights.map((_, i) => `Building ${i + 1}`);
    updateChart();
  }
}

/**
 * Sets heights from manual input
 * @param {string} input - Comma-separated heights
 * @returns {boolean} - Success status
 */
export function setManualHeights(input) {
  try {
    const heights = input
      .split(',')
      .map((h) => parseInt(h.trim(), 10))
      .filter((h) => !isNaN(h) && h >= 10 && h <= 100);

    if (heights.length === 0) {
      throw new Error('No valid heights found');
    }

    currentHeights = heights;

    if (chart) {
      chart.data.datasets[0].data = currentHeights;
      chart.data.labels = currentHeights.map((_, i) => `Building ${i + 1}`);
      updateChart();
    }

    return true;
  } catch (error) {
    console.error('Error setting manual heights:', error);
    return false;
  }
}

/**
 * Adds a new building with random height
 */
export function addBuilding() {
  if (currentHeights.length >= 20) {
    return false; // Max 20 buildings
  }

  const newHeight = Math.floor(Math.random() * 91) + 10; // 10-100
  currentHeights.push(newHeight);

  if (chart) {
    chart.data.datasets[0].data = currentHeights;
    chart.data.labels = currentHeights.map((_, i) => `Building ${i + 1}`);
    updateChart();
  }

  return true;
}

/**
 * Removes the last building
 */
export function removeBuilding() {
  if (currentHeights.length <= 1) {
    return false; // Must have at least 1 building
  }

  currentHeights.pop();

  if (chart) {
    chart.data.datasets[0].data = currentHeights;
    chart.data.labels = currentHeights.map((_, i) => `Building ${i + 1}`);
    updateChart();
  }

  return true;
}

/**
 * Gets the current building heights
 * @returns {number[]} - Current building heights
 */
export function getCurrentHeights() {
  return [...currentHeights];
}
