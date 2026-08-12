import {describe, expect, it} from 'vitest';
import {
  getCollectionThemeStyle,
  resolveCollectionTheme,
  uniqueThemeNames,
} from './collectionTheme.js';

describe('collection themes', () => {
  it('gives approved themes distinct visual atmospheres', () => {
    expect(resolveCollectionTheme('Solids').hero).not.toBe(
      resolveCollectionTheme('Antariksham').hero,
    );
    expect(resolveCollectionTheme('Language Editions').id).toBe(
      'language-editions',
    );
  });

  it('generates stable theme variables for unconfigured Shopify values', () => {
    expect(getCollectionThemeStyle('Future State')).toEqual(
      getCollectionThemeStyle('Future State'),
    );
    expect(
      getCollectionThemeStyle('Future State')['--collection-page'],
    ).toMatch(/^#/);
  });

  it('deduplicates theme names without losing their display casing', () => {
    expect(
      uniqueThemeNames(['Antariksham', ' antariksham ', '', 'Solids']),
    ).toEqual(['Antariksham', 'Solids']);
  });
});
