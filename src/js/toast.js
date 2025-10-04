// ============================================
// Toast Notifications Module
// ============================================

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Set icon based on type
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
  };
  
  const icon = icons[type] || icons.info;
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  
  // Add to container
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      container.removeChild(toast);
      
      // Remove container if empty
      if (container.children.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, duration);
}

/**
 * Shows a success toast
 * @param {string} message - Message to display
 */
export function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * Shows an error toast
 * @param {string} message - Message to display
 */
export function showError(message) {
  showToast(message, 'error');
}

/**
 * Shows an info toast
 * @param {string} message - Message to display
 */
export function showInfo(message) {
  showToast(message, 'info');
}

/**
 * Shows a warning toast
 * @param {string} message - Message to display
 */
export function showWarning(message) {
  showToast(message, 'warning');
}
