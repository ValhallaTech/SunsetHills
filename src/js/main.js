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

// Initialize solver page
if (currentPage === 'solve.html') {
  // Dynamically import chart modules only on solve page
  import('./chartSetup.js').then(({ initChart, resetBuildings, randomizeBuildings }) => {
    // Initialize the chart
    initChart();

    // Set up button event listeners
    const resetBtn = document.getElementById('resetBtn');
    const randomizeBtn = document.getElementById('randomizeBtn');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetBuildings();
        console.log('Buildings reset to default heights');
      });
    }

    if (randomizeBtn) {
      randomizeBtn.addEventListener('click', () => {
        randomizeBuildings();
        console.log('Buildings randomized');
      });
    }

    console.log('Chart and controls initialized successfully');
  }).catch(error => {
    console.error('Error initializing chart:', error);
  });
}

// Initialize code display page
if (currentPage === 'code.html') {
  console.log('Code page - Prism.js will be added in Phase 4');
  // TODO Phase 4: Import and initialize Prism
  // import('./codeDisplay.js').then(({ initCodeDisplay }) => {
  //   initCodeDisplay();
  // });
}
