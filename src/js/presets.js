// ============================================
// Preset Scenarios Module
// ============================================

/**
 * Predefined building height scenarios for testing
 */
export const PRESETS = {
  default: {
    name: 'Default',
    description: 'Original building configuration',
    heights: [71, 55, 50, 65, 95, 68, 28, 34, 14],
  },
  allSame: {
    name: 'All Same Height',
    description: 'All buildings same height - only the last one sees sunset',
    heights: [50, 50, 50, 50, 50, 50, 50, 50, 50],
  },
  ascending: {
    name: 'Ascending Order',
    description: 'Heights increase left to right - only last building sees sunset',
    heights: [10, 20, 30, 40, 50, 60, 70, 80, 90],
  },
  descending: {
    name: 'Descending Order',
    description: 'Heights decrease left to right - all buildings see sunset!',
    heights: [90, 80, 70, 60, 50, 40, 30, 20, 10],
  },
  pyramid: {
    name: 'Pyramid',
    description: 'Heights form a pyramid shape',
    heights: [30, 50, 70, 85, 95, 85, 70, 50, 30],
  },
  valley: {
    name: 'Valley',
    description: 'Heights form a valley shape',
    heights: [80, 60, 40, 25, 15, 25, 40, 60, 80],
  },
  zigzag: {
    name: 'Zigzag',
    description: 'Alternating high and low buildings',
    heights: [80, 20, 70, 30, 60, 40, 50, 45, 90],
  },
  stairs: {
    name: 'Staircase',
    description: 'Buildings form ascending stairs',
    heights: [10, 10, 25, 25, 40, 40, 60, 60, 85],
  },
  challenge: {
    name: 'Challenge',
    description: 'A challenging configuration to analyze',
    heights: [45, 88, 32, 67, 91, 54, 29, 76, 13],
  },
  minimal: {
    name: 'Minimal Case',
    description: 'Just 3 buildings for simplicity',
    heights: [50, 75, 25],
  },
  skyscraper: {
    name: 'Skyscraper City',
    description: 'All very tall buildings',
    heights: [85, 92, 78, 95, 88, 90, 82, 87, 91],
  },
  smallTown: {
    name: 'Small Town',
    description: 'All relatively short buildings',
    heights: [15, 22, 18, 25, 20, 16, 19, 23, 21],
  },
};

/**
 * Get a preset by key
 * @param {string} key - Preset key
 * @returns {Object|null} - Preset object or null if not found
 */
export function getPreset(key) {
  return PRESETS[key] || null;
}

/**
 * Get all preset keys
 * @returns {string[]} - Array of preset keys
 */
export function getPresetKeys() {
  return Object.keys(PRESETS);
}

/**
 * Get preset dropdown options HTML
 * @returns {string} - HTML string for select options
 */
export function getPresetOptionsHTML() {
  return Object.entries(PRESETS)
    .map(([key, preset]) => {
      return `<option value="${key}">${preset.name}</option>`;
    })
    .join('');
}
