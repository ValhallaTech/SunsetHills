// ============================================
// Sunset Hills Algorithm
// ============================================

/**
 * Determines which buildings can see the sunset.
 * A building can see the sunset (which is to the WEST/LEFT) if all buildings 
 * to its left are strictly shorter.
 * 
 * Algorithm: Left-to-right scan with running maximum
 * Time Complexity: O(n)
 * Space Complexity: O(1) excluding result array
 * 
 * @param {number[]} heights - Array of building heights
 * @returns {number[]} - Indices of buildings that can see the sunset
 */
export function solveSunsetHills(heights) {
  if (!heights || heights.length === 0) {
    return [];
  }

  const result = [];
  let maxHeight = 0;

  // Scan from left to right (buildings face west/left where sunset is)
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] > maxHeight) {
      result.push(i);
      maxHeight = heights[i];
    }
  }

  return result;
}

/**
 * Gets building labels (e.g., "Building 1", "Building 2")
 * @param {number[]} indices - Array of building indices
 * @returns {string[]} - Array of building labels
 */
export function getBuildingLabels(indices) {
  return indices.map(index => `Building ${index + 1}`);
}

/**
 * Formats the solution as a readable string
 * @param {number[]} heights - Array of building heights
 * @param {number[]} solutionIndices - Indices of buildings with sunset view
 * @returns {string} - Formatted result string
 */
export function formatSolution(heights, solutionIndices) {
  if (solutionIndices.length === 0) {
    return 'No buildings can see the sunset.';
  }

  const buildingInfo = solutionIndices.map(index => {
    return `Building ${index + 1} (height: ${heights[index]})`;
  });

  return `${solutionIndices.length} building(s) can see the sunset:\n${buildingInfo.join(', ')}`;
}
