import { getCurrentTheme, isDarkMode, initThemeToggle } from '../js/themeToggle.js';

// Mock window.matchMedia
function createMatchMediaMock(matches = false) {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe('themeToggle module', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-bs-theme');
    localStorage.clear();
    document.body.innerHTML = '';
    window.matchMedia = createMatchMediaMock(false);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('getCurrentTheme', () => {
    test('returns light when no theme is set', () => {
      expect(getCurrentTheme()).toBe('light');
    });

    test('returns dark when dark theme is set', () => {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      expect(getCurrentTheme()).toBe('dark');
    });

    test('returns light when light theme is set', () => {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      expect(getCurrentTheme()).toBe('light');
    });
  });

  describe('isDarkMode', () => {
    test('returns false when no theme is set', () => {
      expect(isDarkMode()).toBe(false);
    });

    test('returns true when dark theme is active', () => {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      expect(isDarkMode()).toBe(true);
    });

    test('returns false when light theme is active', () => {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      expect(isDarkMode()).toBe(false);
    });
  });

  describe('initThemeToggle', () => {
    test('warns when toggle elements are missing', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      initThemeToggle();

      expect(consoleSpy).toHaveBeenCalledWith('Theme toggle elements not found on this page');
      consoleSpy.mockRestore();
    });

    test('initializes with light theme by default', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
      consoleSpy.mockRestore();
    });

    test('restores saved dark theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');

      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
      const icon = document.getElementById('theme-icon');
      expect(icon.className).toBe('fa-solid fa-sun');
      consoleSpy.mockRestore();
    });

    test('toggle button switches theme on click', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');

      document.getElementById('theme-toggle').click();

      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      consoleSpy.mockRestore();
    });

    test('emits themeChanged event on toggle', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      const handler = jest.fn();
      window.addEventListener('themeChanged', handler);

      document.getElementById('theme-toggle').click();

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail).toEqual({ theme: 'dark', isDark: true });

      window.removeEventListener('themeChanged', handler);
      consoleSpy.mockRestore();
    });

    test('updates aria attributes on toggle', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden">Switch to dark mode</span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      const toggle = document.getElementById('theme-toggle');

      toggle.click();

      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(toggle.getAttribute('title')).toBe('Switch to light mode');

      const srText = toggle.querySelector('.visually-hidden');
      expect(srText.textContent).toBe('Switch to light mode');
      consoleSpy.mockRestore();
    });

    test('detects system dark mode preference when no saved theme', () => {
      window.matchMedia = createMatchMediaMock(true); // prefers dark

      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
      consoleSpy.mockRestore();
    });

    test('adds and removes theme-transitioning class on toggle click', () => {
      jest.useFakeTimers();
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      document.getElementById('theme-toggle').click();

      expect(document.body.classList.contains('theme-transitioning')).toBe(true);

      jest.advanceTimersByTime(300);

      expect(document.body.classList.contains('theme-transitioning')).toBe(false);

      jest.useRealTimers();
      consoleSpy.mockRestore();
    });

    test('does not add transition class on initial load', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
          <span class="visually-hidden"></span>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      expect(document.body.classList.contains('theme-transitioning')).toBe(false);
      consoleSpy.mockRestore();
    });

    test('handles toggle without visually-hidden span', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-pressed="false" title="">
          <i id="theme-icon" class="fa-solid fa-moon"></i>
        </button>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initThemeToggle();

      // Should not throw when no .visually-hidden span
      expect(() => {
        document.getElementById('theme-toggle').click();
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
