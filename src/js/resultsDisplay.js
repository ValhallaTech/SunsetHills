// ============================================
// Results Display Module
// ============================================

import { getBuildingLabels, formatSolution } from './sunsetHills.js';

/**
 * Updates the results display with current solution
 * @param {number[]} heights - Current building heights
 * @param {number[]} solutionIndices - Indices of buildings with sunset view
 */
export function updateResults(heights, solutionIndices) {
  const resultsOutput = document.getElementById('resultsOutput');
  
  if (!resultsOutput) {
    console.error('Results output element not found');
    return;
  }

  if (solutionIndices.length === 0) {
    resultsOutput.innerHTML = `
      <div class="alert alert-warning mb-0" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <strong>No buildings can see the sunset.</strong>
        <p class="mb-0 mt-2 small">Try adjusting the building heights!</p>
      </div>
    `;
    return;
  }

  // Create building info cards
  const buildingCards = solutionIndices
    .map((index) => {
      const buildingNum = index + 1;
      const height = heights[index];
      
      return `
        <div class="building-card d-inline-block m-2 p-3 border rounded" style="min-width: 150px;">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <i class="fa-solid fa-building text-warning fa-2x" aria-hidden="true"></i>
            </div>
            <div class="text-end">
              <div class="fw-bold">Building ${buildingNum}</div>
              <div class="text-muted small">Height: ${height}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  resultsOutput.innerHTML = `
    <div class="alert alert-success mb-3" role="alert">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <strong>${solutionIndices.length} building(s) can see the sunset!</strong>
    </div>
    <div class="buildings-grid">
      ${buildingCards}
    </div>
    <div class="mt-3 small text-muted">
      <i class="fa-solid fa-info-circle" aria-hidden="true"></i>
      These buildings are taller than all buildings to their left (west).
    </div>
  `;
}
