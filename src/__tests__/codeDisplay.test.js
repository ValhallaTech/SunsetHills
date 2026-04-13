// Mock Prism and its CSS/components
jest.mock('prismjs', () => ({
  highlightAll: jest.fn(),
}));
jest.mock('prismjs/themes/prism-okaidia.css', () => ({}));
jest.mock('prismjs/components/prism-javascript', () => ({}));
jest.mock('prismjs/components/prism-python', () => ({}));
jest.mock('prismjs/components/prism-java', () => ({}));
jest.mock('prismjs/components/prism-csharp', () => ({}));

import Prism from 'prismjs';
import { CODE_EXAMPLES, initCodeDisplay, copyCode } from '../js/codeDisplay.js';

describe('codeDisplay module', () => {
  describe('CODE_EXAMPLES', () => {
    test('has entries for all supported languages', () => {
      expect(CODE_EXAMPLES).toHaveProperty('javascript');
      expect(CODE_EXAMPLES).toHaveProperty('python');
      expect(CODE_EXAMPLES).toHaveProperty('java');
      expect(CODE_EXAMPLES).toHaveProperty('csharp');
    });

    test('each example has name, icon, and code', () => {
      for (const example of Object.values(CODE_EXAMPLES)) {
        expect(example).toHaveProperty('name');
        expect(example).toHaveProperty('icon');
        expect(example).toHaveProperty('code');
        expect(typeof example.name).toBe('string');
        expect(typeof example.icon).toBe('string');
      }
    });
  });

  describe('initCodeDisplay', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('logs error when codeDisplay element is missing', () => {
      document.body.innerHTML = '';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      initCodeDisplay();

      expect(consoleSpy).toHaveBeenCalledWith('Code display element not found');
      consoleSpy.mockRestore();
    });

    test('displays javascript code by default', () => {
      document.body.innerHTML = '<div id="codeDisplay"></div>';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      initCodeDisplay();

      const codeDisplay = document.getElementById('codeDisplay');
      expect(codeDisplay.querySelector('pre')).not.toBeNull();
      expect(codeDisplay.querySelector('code')).not.toBeNull();
      expect(Prism.highlightAll).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('switches language on tab click', () => {
      document.body.innerHTML = `
        <button class="lang-tab active" data-language="javascript">JS</button>
        <button class="lang-tab" data-language="python">Python</button>
        <div id="codeDisplay"></div>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initCodeDisplay();

      const pythonTab = document.querySelector('[data-language="python"]');
      pythonTab.click();

      expect(pythonTab.classList.contains('active')).toBe(true);
      const jsTab = document.querySelector('[data-language="javascript"]');
      expect(jsTab.classList.contains('active')).toBe(false);
      consoleSpy.mockRestore();
    });

    test('applies correct language class for csharp', () => {
      document.body.innerHTML = `
        <button class="lang-tab" data-language="csharp">C#</button>
        <div id="codeDisplay"></div>
      `;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      initCodeDisplay();

      const csharpTab = document.querySelector('[data-language="csharp"]');
      csharpTab.click();

      const codeEl = document.querySelector('#codeDisplay code');
      expect(codeEl.className).toBe('language-csharp');
      consoleSpy.mockRestore();
    });

    test('handles click on invalid language tab gracefully', () => {
      document.body.innerHTML = `
        <button class="lang-tab" data-language="invalid">Invalid</button>
        <div id="codeDisplay"></div>
      `;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      initCodeDisplay();

      const invalidTab = document.querySelector('[data-language="invalid"]');
      invalidTab.click();

      expect(consoleSpy).toHaveBeenCalledWith('Invalid language or code display element');
      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });
  });

  describe('copyCode', () => {
    let writeTextMock;

    beforeEach(() => {
      writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });
    });

    test('copies code to clipboard for valid language', async () => {
      copyCode('javascript');
      expect(writeTextMock).toHaveBeenCalledWith(CODE_EXAMPLES.javascript.code);
    });

    test('calls showSuccess when window.showSuccess exists', async () => {
      window.showSuccess = jest.fn();
      copyCode('javascript');
      await Promise.resolve(); // flush microtask
      expect(window.showSuccess).toHaveBeenCalledWith('Code copied to clipboard!');
      delete window.showSuccess;
    });

    test('falls back to alert when showSuccess not available', async () => {
      delete window.showSuccess;
      window.alert = jest.fn();
      copyCode('javascript');
      await Promise.resolve();
      expect(window.alert).toHaveBeenCalledWith('Code copied to clipboard!');
    });

    test('handles clipboard writeText rejection', async () => {
      writeTextMock.mockRejectedValue(new Error('fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      copyCode('javascript');
      await Promise.resolve();
      // Allow the catch handler to run
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy code:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    test('calls showError on clipboard failure when available', async () => {
      writeTextMock.mockRejectedValue(new Error('fail'));
      window.showError = jest.fn();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      copyCode('python');
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(window.showError).toHaveBeenCalledWith('Failed to copy code.');
      delete window.showError;
      consoleSpy.mockRestore();
    });

    test('logs error for invalid language', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      copyCode('invalid');

      expect(consoleSpy).toHaveBeenCalledWith('Invalid language');
      expect(writeTextMock).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
