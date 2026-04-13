import { showToast, showSuccess, showError, showInfo, showWarning } from '../js/toast.js';

describe('toast module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('showToast', () => {
    test('creates toast container if none exists', () => {
      showToast('Hello', 'info');
      const container = document.getElementById('toast-container');
      expect(container).not.toBeNull();
      expect(container.className).toBe('toast-container');
    });

    test('reuses existing toast container', () => {
      showToast('First', 'info');
      showToast('Second', 'info');
      const containers = document.querySelectorAll('#toast-container');
      expect(containers.length).toBe(1);
    });

    test('creates toast element with correct class', () => {
      showToast('Test', 'success');
      const toast = document.querySelector('.toast-success');
      expect(toast).not.toBeNull();
    });

    test('includes message text', () => {
      showToast('Test message', 'info');
      const toast = document.querySelector('.toast-info');
      expect(toast.innerHTML).toContain('Test message');
    });

    test('applies show class after short delay', () => {
      showToast('Test', 'info');
      const toast = document.querySelector('.toast-info');
      expect(toast.classList.contains('show')).toBe(false);

      jest.advanceTimersByTime(10);
      expect(toast.classList.contains('show')).toBe(true);
    });

    test('removes toast after duration', () => {
      showToast('Test', 'info', 3000);

      jest.advanceTimersByTime(10); // show animation
      expect(document.querySelector('.toast-info')).not.toBeNull();

      jest.advanceTimersByTime(3000); // removal starts
      jest.advanceTimersByTime(300); // fade out animation

      expect(document.querySelector('.toast-info')).toBeNull();
    });

    test('removes container when last toast is removed', () => {
      showToast('Test', 'info', 3000);

      jest.advanceTimersByTime(10);
      jest.advanceTimersByTime(3000);
      jest.advanceTimersByTime(300);

      expect(document.getElementById('toast-container')).toBeNull();
    });

    test('uses correct icon for each type', () => {
      showToast('Success', 'success');
      expect(document.querySelector('.fa-circle-check')).not.toBeNull();

      document.body.innerHTML = '';
      showToast('Error', 'error');
      expect(document.querySelector('.fa-circle-exclamation')).not.toBeNull();

      document.body.innerHTML = '';
      showToast('Info', 'info');
      expect(document.querySelector('.fa-circle-info')).not.toBeNull();

      document.body.innerHTML = '';
      showToast('Warning', 'warning');
      expect(document.querySelector('.fa-triangle-exclamation')).not.toBeNull();
    });

    test('falls back to info icon for unknown type', () => {
      showToast('Unknown', 'unknown');
      expect(document.querySelector('.fa-circle-info')).not.toBeNull();
    });

    test('defaults to info type and 3000ms duration', () => {
      showToast('Default');
      const toast = document.querySelector('.toast-info');
      expect(toast).not.toBeNull();
    });
  });

  describe('convenience functions', () => {
    test('showSuccess creates success toast', () => {
      showSuccess('Done!');
      expect(document.querySelector('.toast-success')).not.toBeNull();
    });

    test('showError creates error toast', () => {
      showError('Failed!');
      expect(document.querySelector('.toast-error')).not.toBeNull();
    });

    test('showInfo creates info toast', () => {
      showInfo('FYI');
      expect(document.querySelector('.toast-info')).not.toBeNull();
    });

    test('showWarning creates warning toast', () => {
      showWarning('Watch out!');
      expect(document.querySelector('.toast-warning')).not.toBeNull();
    });
  });
});
