import {describe, expect, it} from 'vitest';
import {orderSizeGuideLines, sortSizes} from './sizing.js';

describe('sizing utilities', () => {
  it('uses standard apparel order without mutating the input', () => {
    const sizes = ['XL', 'S', 'XXL', 'M', 'L', 'XS'];
    expect(sortSizes(sizes)).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    expect(sizes).toEqual(['XL', 'S', 'XXL', 'M', 'L', 'XS']);
  });

  it('orders size rows while preserving the header and measurement columns', () => {
    const guide = 'Size | Chest | Length\nXL | 46 | 30\nS | 38 | 27\nM | 40 | 28\nL | 43 | 29';
    expect(orderSizeGuideLines(guide)).toEqual([
      'Size | Chest | Length',
      'S | 38 | 27',
      'M | 40 | 28',
      'L | 43 | 29',
      'XL | 46 | 30',
    ]);
  });

  it('does not reorder unstructured sizing instructions', () => {
    const guide = 'Measure your chest first.\nChoose the larger size when between sizes.';
    expect(orderSizeGuideLines(guide)).toEqual(guide.split('\n'));
  });
});
