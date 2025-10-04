// ============================================
// Sunset Hills - Main Entry Point
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

// Initialize theme toggle on all pages
initThemeToggle();

// Page-specific initialization
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

console.log(`Sunset Hills initialized on ${currentPage}`);

// ============================================
// SOLVE PAGE - Import Chart.js modules
// ============================================
if (currentPage === 'solve.html') {
  console.log('Initializing solver page...');
  
  // Import solver-specific modules (only on solve page)
  import('./chartSetup.js').then((chartModule) => {
    import('./presets.js').then((presetsModule) => {
      import('./toast.js').then((toastModule) => {
        
        const {
          initChart,
          resetBuildings,
          randomizeBuildings,
          loadPreset,
          setManualHeights,
          addBuilding,
          removeBuilding,
        } = chartModule;
        
        const { getPreset, getPresetOptionsHTML } = presetsModule;
        const { showSuccess, showError, showInfo } = toastModule;
        
        console.log('Solver modules loaded');
        console.log('Initializing chart...');
        
        // Initialize the chart
        try {
          initChart();
          console.log('Chart initialized successfully');
        } catch (error) {
          console.error('Error initializing chart:', error);
          return;
        }

        // Populate preset dropdown
        const presetSelect = document.getElementById('presetSelect');
        if (presetSelect) {
          console.log('Populating preset dropdown...');
          presetSelect.innerHTML = `
            <option value="">-- Choose a Preset --</option>
            ${getPresetOptionsHTML()}
          `;
          console.log('Preset dropdown populated');

          presetSelect.addEventListener('change', (e) => {
            const presetKey = e.target.value;
            if (presetKey) {
              const preset = getPreset(presetKey);
              if (preset) {
                loadPreset(preset.heights);
                showSuccess(`Loaded preset: ${preset.name}`);
                console.log(`Loaded preset: ${preset.name}`, preset.description);
              }
            }
          });
        } else {
          console.error('Preset select element not found!');
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            resetBuildings();
            showInfo('Buildings reset to default heights');
            console.log('Buildings reset to default heights');
            
            // Reset preset dropdown
            if (presetSelect) {
              presetSelect.value = '';
            }
          });
          console.log('Reset button wired up');
        } else {
          console.error('Reset button not found!');
        }

        // Randomize button
        const randomizeBtn = document.getElementById('randomizeBtn');
        if (randomizeBtn) {
          randomizeBtn.addEventListener('click', () => {
            randomizeBuildings();
            showSuccess('Buildings randomized!');
            console.log('Buildings randomized');
          });
          console.log('Randomize button wired up');
        } else {
          console.error('Randomize button not found!');
        }

        // Manual input
        const manualInput = document.getElementById('manualHeights');
        const applyManualBtn = document.getElementById('applyManualBtn');
        
        if (applyManualBtn && manualInput) {
          applyManualBtn.addEventListener('click', () => {
            const input = manualInput.value.trim();
            if (input) {
              const success = setManualHeights(input);
              if (success) {
                showSuccess('Custom heights applied!');
                manualInput.value = '';
              } else {
                showError('Invalid input. Use comma-separated numbers (10-100).');
              }
            } else {
              showError('Please enter building heights.');
            }
          });

          // Allow Enter key to apply
          manualInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              applyManualBtn.click();
            }
          });
          console.log('Manual input wired up');
        }

        // Add building button
        const addBuildingBtn = document.getElementById('addBuildingBtn');
        if (addBuildingBtn) {
          addBuildingBtn.addEventListener('click', () => {
            const success = addBuilding();
            if (success) {
              showSuccess('Building added!');
            } else {
              showError('Maximum 20 buildings reached.');
            }
          });
          console.log('Add building button wired up');
        }

        // Remove building button
        const removeBuildingBtn = document.getElementById('removeBuildingBtn');
        if (removeBuildingBtn) {
          removeBuildingBtn.addEventListener('click', () => {
            const success = removeBuilding();
            if (success) {
              showInfo('Building removed.');
            } else {
              showError('Must have at least 1 building.');
            }
          });
          console.log('Remove building button wired up');
        }

        console.log('? Chart and all controls initialized successfully');
        
      }).catch((error) => {
        console.error('? Error loading toast module:', error);
      });
    }).catch((error) => {
      console.error('? Error loading presets module:', error);
    });
  }).catch((error) => {
    console.error('? Error loading chart module:', error);
  });
}

// ============================================
// CODE PAGE - Import Prism.js modules
// ============================================
if (currentPage === 'code.html') {
  console.log('Initializing code display page...');
  
  // Import code-specific modules (only on code page)
  import('./codeDisplay.js').then((codeModule) => {
    const { initCodeDisplay, copyCode } = codeModule;
    
    console.log('Code display module loaded');
    
    try {
      initCodeDisplay();
      console.log('Code display initialized');
    } catch (error) {
      console.error('Error initializing code display:', error);
      return;
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

    console.log('? Code display initialized successfully');
    
  }).catch((error) => {
    console.error('? Error loading code display module:', error);
  });
}
