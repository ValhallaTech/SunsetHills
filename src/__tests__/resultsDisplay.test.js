import { updateResults } from '../js/resultsDisplay.js';

describe('updateResults', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="resultsOutput"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('shows warning when no buildings can see sunset', () => {
    updateResults([50, 50, 50], []);

    const output = document.getElementById('resultsOutput');
    expect(output.innerHTML).toContain('No buildings can see the sunset');
    expect(output.innerHTML).toContain('alert-warning');
  });

  test('shows success when buildings can see sunset', () => {
    updateResults([50, 70, 60], [0, 1]);

    const output = document.getElementById('resultsOutput');
    expect(output.innerHTML).toContain('2 building(s) can see the sunset');
    expect(output.innerHTML).toContain('alert-success');
  });

  test('renders building cards for each solution', () => {
    updateResults([50, 70, 60], [0, 1]);

    const output = document.getElementById('resultsOutput');
    expect(output.innerHTML).toContain('Building 1');
    expect(output.innerHTML).toContain('Height: 50');
    expect(output.innerHTML).toContain('Building 2');
    expect(output.innerHTML).toContain('Height: 70');
  });

  test('renders single building card', () => {
    updateResults([80], [0]);

    const output = document.getElementById('resultsOutput');
    expect(output.innerHTML).toContain('1 building(s) can see the sunset');
    expect(output.innerHTML).toContain('Building 1');
    expect(output.innerHTML).toContain('Height: 80');
  });

  test('logs error when element not found', () => {
    document.body.innerHTML = '';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    updateResults([50], [0]);

    expect(consoleSpy).toHaveBeenCalledWith('Results output element not found');
    consoleSpy.mockRestore();
  });
});
