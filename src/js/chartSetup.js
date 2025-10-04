// ============================================
// Chart.js Setup with Drag-and-Drop
// ============================================

import { Chart, registerables } from 'chart.js';
import { dragData } from 'chartjs-plugin-dragdata';
import { solveSunsetHills } from './sunsetHills.js';
import { updateResults } from './resultsDisplay.js';

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
              ? 'rgba(255, 165, 0, 0.8)' // Sunset orange for buildings with view
              : 'rgba(108, 117, 125, 0.8)' // Gray for buildings without view
          ),
          borderColor: currentHeights.map((_, index) =>
            solutionIndices.includes(index)
              ? 'rgba(255, 165, 0, 1)'
              : 'rgba(108, 117, 125, 1)'
          ),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const canSeeSunset = solutionIndices.includes(context.dataIndex);
              return [
                `Height: ${context.parsed.y}`,
                canSeeSunset ? '?? Can see sunset!' : '? Cannot see sunset',
              ];
            },
          },
        },
        dragData: {
          round: 0, // Round to whole numbers
          showTooltip: true,
          onDragStart: function (e, datasetIndex, index, value) {
            // Optional: Add visual feedback on drag start
            return true;
          },
          onDrag: function (e, datasetIndex, index, value) {
            // Constrain height between 10 and 100
            if (value < 10) return false;
            if (value > 100) return false;
            return true;
          },
          onDragEnd: function (e, datasetIndex, index, value) {
            // Update the height
            currentHeights[index] = Math.round(value);
            
            // Recalculate and update chart
            updateChart();
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Height',
            font: {
              size: 14,
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 10,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Buildings (West ? Direction)',
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
      },
      animation: {
        duration: 300,
      },
    },
  });

  // Initial results update
  updateResults(currentHeights, solutionIndices);
}

/**
 * Updates the chart colors and results based on current heights
 */
function updateChart() {
  if (!chart) return;

  const solutionIndices = solveSunsetHills(currentHeights);

  // Update background colors
  chart.data.datasets[0].backgroundColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 0.8)'
      : 'rgba(108, 117, 125, 0.8)'
  );

  // Update border colors
  chart.data.datasets[0].borderColor = currentHeights.map((_, index) =>
    solutionIndices.includes(index)
      ? 'rgba(255, 165, 0, 1)'
      : 'rgba(108, 117, 125, 1)'
  );

  // Update the chart
  chart.update();

  // Update results display
  updateResults(currentHeights, solutionIndices);
}

/**
 * Resets buildings to default heights
 */
export function resetBuildings() {
  currentHeights = [...DEFAULT_HEIGHTS];
  
  if (chart) {
    chart.data.datasets[0].data = currentHeights;
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
 * Gets the current building heights
 * @returns {number[]} - Current building heights
 */
export function getCurrentHeights() {
  return [...currentHeights];
}
