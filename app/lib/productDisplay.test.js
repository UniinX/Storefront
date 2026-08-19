import {describe, it, expect} from 'vitest';
import {getMetafieldMap, isNewProduct, parseRichTextMetafield} from './productDisplay.js';

// Real design_story value pulled from the live store (essential-joggers-black)
// — a Shopify "Rich text" metafield, stored as a JSON AST.
const REAL_RICH_TEXT_VALUE =
  '{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","value":"Solids are meant to be the \\"Go-To\\" For any occasion, but pairing them with the right set of styling makes you look better ! Try our solids collection, and pair them with out suggestions to make your look amazing."}]}]}';

describe('isNewProduct', () => {
  it('is true when the product has a "new" tag, case-insensitively', () => {
    expect(isNewProduct(['New'])).toBe(true);
    expect(isNewProduct(['new'])).toBe(true);
  });

  it('is false when the product has no "new" tag', () => {
    expect(isNewProduct(['Summer'])).toBe(false);
  });

  it('is false when tags are missing', () => {
    expect(isNewProduct(undefined)).toBe(false);
    expect(isNewProduct([])).toBe(false);
  });
});

describe('getMetafieldMap', () => {
  it('flattens metafield entries into a key/value lookup, skipping nulls', () => {
    expect(
      getMetafieldMap([
        {key: 'fit', value: 'Regular'},
        null,
        {key: 'material', value: 'Cotton'},
      ]),
    ).toEqual({fit: 'Regular', material: 'Cotton'});
  });

  it('returns an empty object when metafields are missing', () => {
    expect(getMetafieldMap(undefined)).toEqual({});
  });

  it('flattens a rich_text_field metafield to plain text, not raw JSON', () => {
    expect(
      getMetafieldMap([{key: 'design_story', value: REAL_RICH_TEXT_VALUE}]),
    ).toEqual({
      design_story:
        'Solids are meant to be the "Go-To" For any occasion, but pairing them with the right set of styling makes you look better ! Try our solids collection, and pair them with out suggestions to make your look amazing.',
    });
  });
});

describe('parseRichTextMetafield', () => {
  it('flattens a real Shopify rich-text JSON AST to readable plain text', () => {
    expect(parseRichTextMetafield(REAL_RICH_TEXT_VALUE)).toBe(
      'Solids are meant to be the "Go-To" For any occasion, but pairing them with the right set of styling makes you look better ! Try our solids collection, and pair them with out suggestions to make your look amazing.',
    );
  });

  it('joins multiple paragraphs with a blank line between them', () => {
    const value = JSON.stringify({
      type: 'root',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'First paragraph.'}]},
        {type: 'paragraph', children: [{type: 'text', value: 'Second paragraph.'}]},
      ],
    });
    expect(parseRichTextMetafield(value)).toBe('First paragraph.\n\nSecond paragraph.');
  });

  it('renders list items with a bullet marker', () => {
    const value = JSON.stringify({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {type: 'list-item', children: [{type: 'text', value: 'Machine wash cold'}]},
            {type: 'list-item', children: [{type: 'text', value: 'Do not bleach'}]},
          ],
        },
      ],
    });
    expect(parseRichTextMetafield(value)).toBe('• Machine wash cold\n• Do not bleach');
  });

  it('leaves an ordinary plain-text value completely unchanged', () => {
    expect(parseRichTextMetafield('Regular Fit')).toBe('Regular Fit');
  });

  it('leaves a value that merely starts with "{" but is not valid JSON unchanged', () => {
    expect(parseRichTextMetafield('{not actually json')).toBe('{not actually json');
  });

  it('leaves valid JSON that is not the Shopify rich-text shape unchanged', () => {
    expect(parseRichTextMetafield('{"foo":"bar"}')).toBe('{"foo":"bar"}');
  });

  it('passes through non-string values (e.g. already-parsed data) unchanged', () => {
    expect(parseRichTextMetafield(null)).toBeNull();
    expect(parseRichTextMetafield(undefined)).toBeUndefined();
  });
});
