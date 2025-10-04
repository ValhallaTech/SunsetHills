// ============================================
// Statistics Module
// ============================================

/**
 * Calculates statistics for the current building configuration
 * @param {number[]} heights - Array of building heights
 * @param {number[]} solutionIndices - Indices of buildings with sunset view
 * @returns {Object} - Statistics object
 */
export function calculateStatistics(heights, solutionIndices) {
  const total = heights.length;
  const withView = solutionIndices.length;
  const withoutView = total - withView;
  const percentageWithView = total > 0 ? Math.round((withView / total) * 100) : 0;

  const sum = heights.reduce((acc, h) => acc + h, 0);
  const average = total > 0 ? Math.round(sum / total) : 0;
  const tallest = Math.max(...heights);
  const shortest = Math.min(...heights);

  return {
    total,
    withView,
    withoutView,
    percentageWithView,
    average,
    tallest,
    shortest,
  };
}

/**
 * Updates the statistics display
 * @param {Object} stats - Statistics object
 */
export function updateStatisticsDisplay(stats) {
  const statsContainer = document.getElementById('statisticsDisplay');

  if (!statsContainer) {
    console.error('Statistics display element not found');
    return;
  }

  statsContainer.innerHTML = `
    <div class="row g-3">
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fa-solid fa-building-circle-check text-success"></i>
          </div>
          <div class="stat-value">${stats.withView}</div>
          <div class="stat-label">With Sunset View</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fa-solid fa-building-circle-xmark text-muted"></i>
          </div>
          <div class="stat-value">${stats.withoutView}</div>
          <div class="stat-label">Without View</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fa-solid fa-percent text-primary"></i>
          </div>
          <div class="stat-value">${stats.percentageWithView}%</div>
          <div class="stat-label">Success Rate</div>
        </div>
      </div>
    </div>
    <div class="row g-3 mt-2">
      <div class="col-md-3">
        <div class="stat-mini">
          <i class="fa-solid fa-chart-simple text-info"></i>
          <span class="ms-2"><strong>Avg:</strong> ${stats.average}</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-mini">
          <i class="fa-solid fa-arrow-up text-success"></i>
          <span class="ms-2"><strong>Max:</strong> ${stats.tallest}</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-mini">
          <i class="fa-solid fa-arrow-down text-danger"></i>
          <span class="ms-2"><strong>Min:</strong> ${stats.shortest}</span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-mini">
          <i class="fa-solid fa-hashtag text-secondary"></i>
          <span class="ms-2"><strong>Total:</strong> ${stats.total}</span>
        </div>
      </div>
    </div>
  `;
}
