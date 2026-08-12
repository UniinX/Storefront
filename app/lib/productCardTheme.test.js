import {describe, expect, it} from 'vitest';
import {
  getProductCollectionName,
  normalizeCollectionName,
  resolveProductCardColor,
} from './productCardTheme.js';

describe('product card theme resolution', () => {
  it('defaults to the approved red', () => {
    expect(resolveProductCardColor({title: 'A product'})).toBe('#f15353');
  });

  it('normalizes custom.collection_name and supports a future palette', () => {
    const product = {collectionName: {value: '  Language Editions  '}};
    expect(getProductCollectionName(product)).toBe('  Language Editions  ');
    expect(normalizeCollectionName(getProductCollectionName(product))).toBe(
      'language-editions',
    );
    expect(
      resolveProductCardColor(product, {'language-editions': '#233c6b'}),
    ).toBe('#233c6b');
  });

  it('falls back to the first Shopify collection title', () => {
    expect(
      getProductCollectionName({collections: {nodes: [{title: 'Essentials'}]}}),
    ).toBe('Essentials');
  });
});
