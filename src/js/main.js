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
  // Dynamically import chart modules and other dependencies
  Promise.all([
    import('./chartSetup.js'),
    import('./presets.js'),
    import('./toast.js'),
  ]).then(([chartModule, presetsModule, toastModule]) => {
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

    // Initialize the chart
    initChart();

    // Populate preset dropdown
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
      presetSelect.innerHTML = `
        <option value="">-- Choose a Preset --</option>
        ${getPresetOptionsHTML()}
      `;

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
    }

    // Randomize button
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) {
      randomizeBtn.addEventListener('click', () => {
        randomizeBuildings();
        showSuccess('Buildings randomized!');
        console.log('Buildings randomized');
      });
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
    }

    console.log('Chart and all controls initialized successfully');
  }).catch((error) => {
    console.error('Error initializing chart:', error);
  });
}

// Initialize code display page
if (currentPage === 'code.html') {
  // Dynamically import code display module
  import('./codeDisplay.js').then(({ initCodeDisplay, copyCode }) => {
    initCodeDisplay();

    // Wire up copy button
    const copyBtn = document.getElementById('copyCodeBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        // Get current active language
        const activeTab = document.querySelector('.lang-tab.active');
        const language = activeTab ? activeTab.getAttribute('data-language') : 'javascript';
        copyCode(language);
      });
    }

    console.log('Code display initialized with Prism.js');
  }).catch((error) => {
    console.error('Error initializing code display:', error);
  });
}
