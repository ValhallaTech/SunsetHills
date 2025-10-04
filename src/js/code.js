// ============================================
// Code Page Entry Point
// ============================================

// Import Bootstrap CSS AND JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';

// Import custom styles
import '../styles/custom.css';

// Import theme toggle
import { initThemeToggle } from './themeToggle.js';

// Import code display module
import { initCodeDisplay, copyCode } from './codeDisplay.js';

// Initialize theme toggle
initThemeToggle();

console.log('Code page initializing...');

// Initialize code display
try {
  initCodeDisplay();
  console.log('Code display initialized');
} catch (error) {
  console.error('Error initializing code display:', error);
}

// Wire up copy button
const copyBtn = document.getElementById('copyCodeBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    // Get current active language
    const activeTab = document.querySelector('.lang-tab.active');
    const language = activeTab ? activeTab.getAttribute('data-language') : 'javascript';
    copyCode(language);
  });
  console.log('Copy button wired up');
}

console.log('? Code page initialized successfully');
