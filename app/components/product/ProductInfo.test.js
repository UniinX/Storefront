/** @file Tests for the categorizeOptions and isNewProduct helpers that drive the PDP. */
import { describe, it, expect } from 'vitest';
import { categorizeOptions, isNewProduct, NAMED_COLOR_FALLBACKS } from './ProductInfo.jsx';

function option(name, valueCount = 2) {
  return {
    name,
    optionValues: Array.from({ length: valueCount }, (_, i) => ({ name: `${name}-${i}` })),
  };
}

describe('categorizeOptions', () => {
  it('buckets Size and Color options by name', () => {
    const { typeOptions, colorOption, sizeOption } = categorizeOptions([
      option('Size'),
      option('Color'),
    ]);
    expect(typeOptions).toEqual([]);
    expect(colorOption.name).toBe('Color');
    expect(sizeOption.name).toBe('Size');
  });

  it('matches "Colour" (UK spelling) as a color option', () => {
    const { colorOption } = categorizeOptions([option('Colour')]);
    expect(colorOption.name).toBe('Colour');
  });

  it('treats any other option as a "type" step', () => {
    const { typeOptions, colorOption, sizeOption } = categorizeOptions([option('Style')]);
    expect(typeOptions).toHaveLength(1);
    expect(typeOptions[0].name).toBe('Style');
    expect(colorOption).toBeNull();
    expect(sizeOption).toBeNull();
  });

  it('drops single-value options (nothing to choose)', () => {
    const { typeOptions, colorOption, sizeOption } = categorizeOptions([
      option('Size', 1),
      option('Color', 1),
      option('Style', 1),
    ]);
    expect(typeOptions).toEqual([]);
    expect(colorOption).toBeNull();
    expect(sizeOption).toBeNull();
  });
});

describe('isNewProduct', () => {
  it('is true when tags include "new" (case-insensitive)', () => {
    expect(isNewProduct(['Bestseller', 'New'])).toBe(true);
    expect(isNewProduct(['new'])).toBe(true);
  });

  it('is false when tags do not include "new"', () => {
    expect(isNewProduct(['Bestseller', 'Limited'])).toBe(false);
  });

  it('is false when tags is missing or empty', () => {
    expect(isNewProduct(undefined)).toBe(false);
    expect(isNewProduct([])).toBe(false);
  });
});

describe('NAMED_COLOR_FALLBACKS', () => {
  it('renders the "white" fallback swatch as true white, not off-white', () => {
    expect(NAMED_COLOR_FALLBACKS.white).toBe('#ffffff');
  });
});
