// ============================================
// Theme Toggle - Dark/Light Mode Management
// ============================================

/**
 * Initializes the theme toggle functionality
 * - Respects system preference and localStorage
 * - Provides smooth theme transitions
 * - Emits events for chart updates
 */
export function initThemeToggle() {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  
  if (!toggle || !icon) {
    console.warn('Theme toggle elements not found on this page');
    return;
  }

  // Get saved theme or system preference
  const savedTheme = getSavedOrPreferredTheme();
  
  // Apply initial theme
  setTheme(savedTheme, false); // false = don't animate on load
  
  // Listen for toggle clicks
  toggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true); // true = animate transition
  });
  
  // Listen for system preference changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', true);
    }
  });
  
  console.log(`Theme initialized: ${savedTheme} mode`);
  
  /**
   * Gets the saved theme from localStorage or system preference
   * @returns {string} - 'light' or 'dark'
   */
  function getSavedOrPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light'; // Default
  }
  
  /**
   * Sets the theme and updates UI
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} animate - Whether to animate the transition
   */
  function setTheme(theme, animate = true) {
    // Add transition class for smooth color changes
    if (animate) {
      document.body.classList.add('theme-transitioning');
    }
    
    // Set Bootstrap theme attribute
    html.setAttribute('data-bs-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update toggle button UI
    updateToggleButton(theme);
    
    // Emit custom event for components that need to respond (e.g., Chart.js)
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme, isDark: theme === 'dark' } 
    }));
    
    // Remove transition class after animation completes
    if (animate) {
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }
  }
  
  /**
   * Updates the toggle button icon and accessibility attributes
   * @param {string} theme - 'light' or 'dark'
   */
  function updateToggleButton(theme) {
    const isDark = theme === 'dark';
    
    // Update icon (moon in light mode, sun in dark mode)
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    
    // Update ARIA attributes
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Update visually hidden text
    const srText = toggle.querySelector('.visually-hidden');
    if (srText) {
      srText.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
}

/**
 * Gets the current theme
 * @returns {string} - 'light' or 'dark'
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-bs-theme') || 'light';
}

/**
 * Checks if dark mode is active
 * @returns {boolean}
 */
export function isDarkMode() {
  return getCurrentTheme() === 'dark';
}
