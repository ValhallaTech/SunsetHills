import { PRESETS, getPreset, getPresetKeys, getPresetOptionsHTML } from '../js/presets.js';

describe('PRESETS', () => {
  test('contains expected preset keys', () => {
    const keys = Object.keys(PRESETS);
    expect(keys).toContain('default');
    expect(keys).toContain('allSame');
    expect(keys).toContain('ascending');
    expect(keys).toContain('descending');
    expect(keys).toContain('pyramid');
    expect(keys).toContain('valley');
    expect(keys).toContain('zigzag');
    expect(keys).toContain('stairs');
    expect(keys).toContain('challenge');
    expect(keys).toContain('minimal');
    expect(keys).toContain('skyscraper');
    expect(keys).toContain('smallTown');
  });

  test('each preset has required properties', () => {
    for (const [key, preset] of Object.entries(PRESETS)) {
      expect(preset).toHaveProperty('name');
      expect(preset).toHaveProperty('description');
      expect(preset).toHaveProperty('heights');
      expect(Array.isArray(preset.heights)).toBe(true);
      expect(preset.heights.length).toBeGreaterThan(0);
      expect(typeof preset.name).toBe('string');
      expect(typeof preset.description).toBe('string');
    }
  });

  test('default preset has correct heights', () => {
    expect(PRESETS.default.heights).toEqual([71, 55, 50, 65, 95, 68, 28, 34, 14]);
  });

  test('allSame preset has uniform heights', () => {
    const unique = new Set(PRESETS.allSame.heights);
    expect(unique.size).toBe(1);
  });

  test('ascending preset has increasing heights', () => {
    const heights = PRESETS.ascending.heights;
    for (let i = 1; i < heights.length; i++) {
      expect(heights[i]).toBeGreaterThan(heights[i - 1]);
    }
  });

  test('descending preset has decreasing heights', () => {
    const heights = PRESETS.descending.heights;
    for (let i = 1; i < heights.length; i++) {
      expect(heights[i]).toBeLessThan(heights[i - 1]);
    }
  });
});

describe('getPreset', () => {
  test('returns preset for valid key', () => {
    const preset = getPreset('default');
    expect(preset).not.toBeNull();
    expect(preset.name).toBe('Default');
    expect(preset.heights).toEqual([71, 55, 50, 65, 95, 68, 28, 34, 14]);
  });

  test('returns null for invalid key', () => {
    expect(getPreset('nonexistent')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(getPreset('')).toBeNull();
  });
});

describe('getPresetKeys', () => {
  test('returns all preset keys', () => {
    const keys = getPresetKeys();
    expect(keys).toEqual(Object.keys(PRESETS));
    expect(keys.length).toBe(12);
  });
});

describe('getPresetOptionsHTML', () => {
  test('returns HTML string with options for each preset', () => {
    const html = getPresetOptionsHTML();

    for (const [key, preset] of Object.entries(PRESETS)) {
      expect(html).toContain(`value="${key}"`);
      expect(html).toContain(preset.name);
    }
  });

  test('returns option elements', () => {
    const html = getPresetOptionsHTML();
    const optionCount = (html.match(/<option/g) || []).length;
    expect(optionCount).toBe(Object.keys(PRESETS).length);
  });
});
