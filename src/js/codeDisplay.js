// ============================================
// Code Display Module - Prism.js Integration
// Dynamic Code Loading
// ============================================

import Prism from 'prismjs';

// Import Prism Okaidia theme (Monokai-style)
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

// Import code examples as raw text using bundle-text: prefix for Parcel
import javascriptCode from 'bundle-text:../code-examples/javascript.txt';
import pythonCode from 'bundle-text:../code-examples/python.txt';
import javaCode from 'bundle-text:../code-examples/java.txt';
import csharpCode from 'bundle-text:../code-examples/csharp.txt';

/**
 * Code examples for the Sunset Hills algorithm
 * Now dynamically loaded from actual source files!
 */
export const CODE_EXAMPLES = {
  javascript: {
    name: 'JavaScript',
    icon: 'fa-brands fa-js',
    code: javascriptCode,
  },
  python: {
    name: 'Python',
    icon: 'fa-brands fa-python',
    code: pythonCode,
  },
  java: {
    name: 'Java',
    icon: 'fa-brands fa-java',
    code: javaCode,
  },
  csharp: {
    name: 'C#',
    icon: 'fa-solid fa-code',
    code: csharpCode,
  },
};

/**
 * Initializes Prism.js syntax highlighting
 */
export function initCodeDisplay() {
  // Get all code language tabs
  const languageTabs = document.querySelectorAll('[data-language]');
  const codeDisplay = document.getElementById('codeDisplay');

  if (!codeDisplay) {
    console.error('Code display element not found');
    return;
  }

  // Set initial language (JavaScript)
  displayCode('javascript');

  // Add click handlers to language tabs
  languageTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const language = tab.getAttribute('data-language');

      // Update active tab
      languageTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Display code for selected language
      displayCode(language);
    });
  });

  console.log('Code display initialized with dynamic code loading');
}

/**
 * Displays code for a specific language
 * @param {string} language - Language key
 */
function displayCode(language) {
  const codeDisplay = document.getElementById('codeDisplay');
  const example = CODE_EXAMPLES[language];

  if (!example || !codeDisplay) {
    console.error('Invalid language or code display element');
    return;
  }

  // Set the code content
  const languageClass = language === 'csharp' ? 'language-csharp' : `language-${language}`;
  
  codeDisplay.innerHTML = `<pre><code class="${languageClass}">${escapeHtml(
    example.code
  )}</code></pre>`;

  // Re-highlight with Prism
  Prism.highlightAll();
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Copies code to clipboard
 * @param {string} language - Language key
 */
export function copyCode(language) {
  const example = CODE_EXAMPLES[language];

  if (!example) {
    console.error('Invalid language');
    return;
  }

  navigator.clipboard
    .writeText(example.code)
    .then(() => {
      // Show success message (if toast is available)
      if (window.showSuccess) {
        window.showSuccess('Code copied to clipboard!');
      } else {
        alert('Code copied to clipboard!');
      }
    })
    .catch((err) => {
      console.error('Failed to copy code:', err);
      if (window.showError) {
        window.showError('Failed to copy code.');
      }
    });
}
