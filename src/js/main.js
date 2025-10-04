// ============================================
// Home Page Entry Point (index.html)
// ============================================

// Import Bootstrap CSS AND JS (needed on all pages)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Import Font Awesome (needed on all pages)
import '@fortawesome/fontawesome-free/css/all.css';

// Import custom styles (needed on all pages)
import '../styles/custom.css';

// Import theme toggle (needed on all pages)
import { initThemeToggle } from './themeToggle.js';

// Initialize theme toggle
initThemeToggle();

console.log('? Home page initialized successfully');
