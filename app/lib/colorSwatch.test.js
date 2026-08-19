import {describe, it, expect} from 'vitest';
import {resolveColorHex} from './colorSwatch.js';

describe('resolveColorHex', () => {
  it('resolves single-word color names', () => {
    expect(resolveColorHex('Black')).toBe('#1a1a1a');
    expect(resolveColorHex('white')).toBe('#ffffff');
  });

  it('resolves compound names with an exact match first', () => {
    // "navy" and "blue" are both individually mapped, but "navy blue" as a
    // whole should win rather than falling through to the "blue" word match.
    expect(resolveColorHex('Navy Blue')).toBe('#1f2d4a');
  });

  it('falls back to the base color word in an unmapped compound name', () => {
    expect(resolveColorHex('Brick Red')).toBe('#9e4b3d');
    expect(resolveColorHex('Grey Melange')).toBe('#9b9691');
  });

  it('returns null for names with no recognizable color word', () => {
    expect(resolveColorHex('Just Grow Hoodie')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(resolveColorHex('')).toBeNull();
    expect(resolveColorHex(undefined)).toBeNull();
  });
});
