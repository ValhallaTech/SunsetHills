// ============================================
// Sunset Hills - Main Entry Point
// ============================================

// Import Bootstrap (CSS and JS)
import 'bootstrap';

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';

// Import custom styles
import '../styles/custom.css';

// Page-specific initialization
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

console.log(`Sunset Hills initialized on ${currentPage}`);

if (currentPage === 'solve.html') {
  console.log('Solver page - Chart initialization will be added in Phase 2');
  // TODO Phase 2: Import and initialize chart
  // import { initChart } from './chartSetup.js';
  // initChart();
}

if (currentPage === 'code.html') {
  console.log('Code page - Prism.js will be added in Phase 4');
  // TODO Phase 4: Import and initialize Prism
  // import { initCodeDisplay } from './codeDisplay.js';
  // initCodeDisplay();
}
