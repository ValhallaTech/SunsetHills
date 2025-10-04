// ============================================
// Chart.js Setup with Drag-and-Drop
// ============================================

import { Chart, registerables } from 'chart.js';
import 'chartjs-plugin-dragdata';
import { solveSunsetHills } from './sunsetHills.js';
import { updateResults } from './resultsDisplay.js';
import { calculateStatistics, updateStatisticsDisplay } from './statistics.js';

// Register Chart.js components (dragData plugin auto-registers itself)
Chart.register(...registerables);

// Default building heights
const DEFAULT_HEIGHTS = [71, 55, 50, 65, 95, 68, 28, 34, 14];

// Store current heights
let currentHeights = [...DEFAULT_HEIGHTS];

// Chart instance
let chart = null;

/**
 * Gets theme-aware colors for the chart
 * @returns {object} Color configuration based on current theme
 */
function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  
  return {
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    textColor: isDark ? '#f8f9fa' : '#212529',
    labelColor: isDark ? '#f8f9fa' : '#000000',
    borderNoView: isDark ? 'rgba(139, 149, 161, 1)' : 'rgba(90, 98, 104, 1)',
  };
}

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
  
  // Get theme-aware colors
  const colors = getChartColors();

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
              ? 'rgba(255, 165, 0, 0.85)'
              : 'rgba(108, 117, 125, 0.75)'
          ),
          borderColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 140, 0, 1)'
              : colors.borderNoView
          ),
          borderWidth: 2,
          borderRadius: 4,
          hoverBackgroundColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 165, 0, 1)'
              : 'rgba(108, 117, 125, 0.9)'
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        dragData: {
          round: 0,
          showTooltip: true,
          onDragStart: function (e, datasetIndex, index, value) {
            // Allow dragging
            return true;
          },
          onDrag: function (e, datasetIndex, index, value) {
            // Constrain values between 10 and 100
            if (value < 10) return false;
            if (value > 100) return false;
            return true;
          },
          onDragEnd: function (e, datasetIndex, index, value) {
            // Update the height and refresh everything
            currentHeights[index] = Math.round(value);
            updateChart();
          },
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            generateLabels: function () {
              // Always get fresh colors based on current theme
              const currentColors = getChartColors();
              return [
                {
                  text: 'Can See Sunset',
                  fillStyle: 'rgba(255, 165, 0, 0.85)',
                  strokeStyle: 'rgba(255, 140, 0, 1)',
                  lineWidth: 2,
                },
                {
                  text: 'Cannot See Sunset',
                  fillStyle: 'rgba(108, 117, 125, 0.75)',
                  strokeStyle: currentColors.borderNoView,
                  lineWidth: 2,
                },
              ];
            },
            font: {
              size: 12,
              weight: 'bold',
            },
            padding: 15,
            color: colors.textColor,
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
          color: colors.textColor,
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
                canSeeSunset ? 'Can see sunset!' : 'Cannot see sunset',
              ];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          grid: {
            color: colors.gridColor,
            lineWidth: 1,
          },
          title: {
            display: true,
            text: 'Height (units)',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: colors.textColor,
          },
          ticks: {
            stepSize: 10,
            font: {
              size: 11,
            },
            color: colors.textColor,
          },
        },
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Buildings (Sunset to WEST/Left)',
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
            color: colors.textColor,
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
          const colors = getChartColors();
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index];
              ctx.fillStyle = colors.labelColor;
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

  // Listen for theme changes
  window.addEventListener('themeChanged', handleThemeChange);

  // Initial updates
  updateResults(currentHeights, solutionIndices);
  updateStatisticsDisplay(calculateStatistics(currentHeights, solutionIndices));
  
  console.log('Chart created successfully with drag functionality enabled');
}

/**
 * Handles theme change events
 * @param {CustomEvent} event - Theme change event
 */
function handleThemeChange(event) {
  if (!chart) return;
  
  console.log(`Theme changed to ${event.detail.theme} mode - updating chart`);
  updateChartTheme();
}

/**
 * Updates chart colors based on current theme
 */
function updateChartTheme() {
  if (!chart) return;
  
  const colors = getChartColors();
  const solutionIndices = solveSunsetHills(currentHeights);
  
  // Update border colors for non-sunset buildings
  chart.data.datasets[0].borderColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 140, 0, 1)'
      : colors.borderNoView
  );
  
  // Force legend to regenerate by replacing the generateLabels function
  // This ensures strokeStyle uses current theme colors
  if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
    chart.options.plugins.legend.labels.generateLabels = function () {
      // Get FRESH colors every time this is called
      const currentColors = getChartColors();
      return [
        {
          text: 'Can See Sunset',
          fillStyle: 'rgba(255, 165, 0, 0.85)',
          strokeStyle: 'rgba(255, 140, 0, 1)',
          lineWidth: 2,
        },
        {
          text: 'Cannot See Sunset',
          fillStyle: 'rgba(108, 117, 125, 0.75)',
          strokeStyle: currentColors.borderNoView,
          lineWidth: 2,
        },
      ];
    };
    
    // Update text color
    chart.options.plugins.legend.labels.color = colors.textColor;
  }
  
  // Title color
  if (chart.options.plugins.title) {
    chart.options.plugins.title.color = colors.textColor;
  }
  
  // Y-axis colors
  if (chart.options.scales.y) {
    chart.options.scales.y.grid.color = colors.gridColor;
    chart.options.scales.y.title.color = colors.textColor;
    chart.options.scales.y.ticks.color = colors.textColor;
  }
  
  // X-axis tick colors (keep title orange)
  if (chart.options.scales.x && chart.options.scales.x.ticks) {
    chart.options.scales.x.ticks.color = colors.textColor;
  }
  
  // Force chart to update with new colors
  // Use 'active' mode to force legend regeneration
  chart.update('active');
  
  console.log(`Chart colors updated to ${colors.textColor}`);
}

/**
 * Updates the chart colors and results based on current heights
 */
function updateChart() {
  if (!chart) return;

  const solutionIndices = solveSunsetHills(currentHeights);
  const colors = getChartColors();

  // Update colors with smooth transition
  chart.data.datasets[0].backgroundColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 0.85)'
      : 'rgba(108, 117, 125, 0.75)'
  );

  chart.data.datasets[0].borderColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 140, 0, 1)'
      : colors.borderNoView
  );

  chart.data.datasets[0].hoverBackgroundColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 1)'
      : 'rgba(108, 117, 125, 0.9)'
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
