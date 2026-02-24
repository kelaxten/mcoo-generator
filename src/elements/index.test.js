import { describe, it, expect } from 'vitest';
import { ELEMENT_REGISTRY, TOOLBAR_SECTIONS } from './index';

describe('ELEMENT_REGISTRY — structural integrity', () => {
  const entries = Object.entries(ELEMENT_REGISTRY);

  it('has at least one entry', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)('"%s" has required top-level fields', (key, entry) => {
    expect(typeof entry.label).toBe('string');
    expect(entry.label.length).toBeGreaterThan(0);
    expect(typeof entry.category).toBe('string');
    expect(entry.category.length).toBeGreaterThan(0);
    expect(typeof entry.iconColor).toBe('string');
    // must be a hex color
    expect(entry.iconColor).toMatch(/^#[0-9a-f]{3,8}$/i);
  });

  it.each(entries)('"%s" defaults.type matches the registry key', (key, entry) => {
    expect(entry.defaults).toBeDefined();
    expect(entry.defaults.type).toBe(key);
  });

  it.each(entries)('"%s" defaults has positive w and h', (key, entry) => {
    expect(entry.defaults.w).toBeGreaterThan(0);
    expect(entry.defaults.h).toBeGreaterThan(0);
  });

  it.each(entries)('"%s" defaults.opacity is between 0 and 1', (key, entry) => {
    const { opacity } = entry.defaults;
    expect(opacity).toBeGreaterThanOrEqual(0);
    expect(opacity).toBeLessThanOrEqual(1);
  });

  it.each(entries)('"%s" defaults.label is a non-empty string', (key, entry) => {
    expect(typeof entry.defaults.label).toBe('string');
    expect(entry.defaults.label.length).toBeGreaterThan(0);
  });
});

describe('TOOLBAR_SECTIONS — structural integrity', () => {
  it('has at least one section', () => {
    expect(TOOLBAR_SECTIONS.length).toBeGreaterThan(0);
  });

  it('every section has a non-empty title and types array', () => {
    for (const section of TOOLBAR_SECTIONS) {
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(0);
      expect(Array.isArray(section.types)).toBe(true);
      expect(section.types.length).toBeGreaterThan(0);
    }
  });

  it('every type in every section exists in ELEMENT_REGISTRY', () => {
    for (const section of TOOLBAR_SECTIONS) {
      for (const type of section.types) {
        expect(
          ELEMENT_REGISTRY,
          `"${type}" in section "${section.title}" is missing from ELEMENT_REGISTRY`,
        ).toHaveProperty(type);
      }
    }
  });

  it('no type is listed in more than one section (no duplicates)', () => {
    const seen = new Map();
    for (const section of TOOLBAR_SECTIONS) {
      for (const type of section.types) {
        expect(
          seen.has(type),
          `"${type}" appears in both "${seen.get(type)}" and "${section.title}"`,
        ).toBe(false);
        seen.set(type, section.title);
      }
    }
  });

  it('every ELEMENT_REGISTRY key appears in exactly one section', () => {
    const allSectionTypes = new Set(TOOLBAR_SECTIONS.flatMap(s => s.types));
    for (const key of Object.keys(ELEMENT_REGISTRY)) {
      expect(
        allSectionTypes.has(key),
        `Registry key "${key}" is not listed in any TOOLBAR_SECTION`,
      ).toBe(true);
    }
  });
});
