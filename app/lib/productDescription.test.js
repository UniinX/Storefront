import {describe, it, expect} from 'vitest';
import {guessFactLabel, parseProductDescription} from './productDescription.js';

// Real descriptionHtml pulled from the live store (men's classic tee).
const RICH_TEXT_DESCRIPTION =
  '<p><strong>Men’s Classic Crew T-Shirt</strong></p>\n' +
  '<p>Crafted from soft 180 GSM super-combed cotton, this everyday T-shirt offers a comfortable regular fit with a classic Lycra-ribbed crew neck. Bio-washed, pre-shrunk, and double-stitched for lasting comfort and durability.</p>\n' +
  '<p><strong>Product Details</strong></p>\n' +
  '<ul>\n<li>\n<p>100% Cotton</p>\n</li>\n<li>\n<p>180 GSM fabric</p>\n</li>\n<li>\n<p>Regular fit</p>\n</li>\n<li>\n<p>Crew neck</p>\n</li>\n<li>\n<p>Half sleeves</p>\n</li>\n<li>\n<p>Bio-washed &amp; pre-shrunk</p>\n</li>\n<li>\n<p>Double-stitched construction</p>\n</li>\n</ul>\n' +
  '<p><strong>Wash Care</strong><br>Machine wash cold. Wash inside out. Do not bleach or iron directly on the print.</p>';

// Real descriptionHtml pulled from the live store (terry shorts) — plain
// text, no HTML tags at all, "Label: value" paragraphs.
const PLAIN_TEXT_DESCRIPTION =
  'Fabric: Premium terry blend – midweight that feels soft, breathable, and built to last.\n\n' +
  'Fit: Relaxed fit – easygoing style made for everyone.\n\n' +
  'Features: Elastic waistband with drawstring for adjustable comfort. Versatile white colorway pairs effortlessly with any top. Perfect for lounging, casual outings, or active days.\n\n' +
  'Care: Wash inside-out in cold water, dry on low heat. Flip it inside out before ironing.';

describe('parseProductDescription — rich text template', () => {
  const result = parseProductDescription(RICH_TEXT_DESCRIPTION);

  it('extracts the intro paragraph without the redundant bold product name', () => {
    expect(result.intro).toBe(
      'Crafted from soft 180 GSM super-combed cotton, this everyday T-shirt offers a comfortable regular fit with a classic Lycra-ribbed crew neck. Bio-washed, pre-shrunk, and double-stitched for lasting comfort and durability.',
    );
  });

  it('extracts every bullet as an unlabeled fact', () => {
    expect(result.facts.map((f) => f.value)).toEqual([
      '100% Cotton',
      '180 GSM fabric',
      'Regular fit',
      'Crew neck',
      'Half sleeves',
      'Bio-washed & pre-shrunk',
      'Double-stitched construction',
    ]);
    expect(result.facts.every((f) => f.label === null)).toBe(true);
  });

  it('extracts the wash care line', () => {
    expect(result.careLines).toEqual([
      'Machine wash cold. Wash inside out. Do not bleach or iron directly on the print.',
    ]);
  });
});

describe('parseProductDescription — plain-text label template', () => {
  const result = parseProductDescription(PLAIN_TEXT_DESCRIPTION);

  it('keeps prose labels (Features) as intro copy, not a spec-sheet fact row', () => {
    expect(result.intro).not.toBeNull();
    expect(result.intro).toContain('Elastic waistband with drawstring');
  });

  it('extracts labeled facts with their real label', () => {
    expect(result.facts).toEqual([
      {label: 'Fabric', value: 'Premium terry blend – midweight that feels soft, breathable, and built to last.'},
      {label: 'Fit', value: 'Relaxed fit – easygoing style made for everyone.'},
    ]);
  });

  it('extracts the care line', () => {
    expect(result.careLines).toEqual([
      'Wash inside-out in cold water, dry on low heat. Flip it inside out before ironing.',
    ]);
  });
});

describe('parseProductDescription — unrecognized content', () => {
  it('returns null rather than guessing at a shape that is not there', () => {
    expect(parseProductDescription('<p>Just a normal one-line description.</p>')).toBeNull();
    expect(parseProductDescription('A single plain sentence with no structure.')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(parseProductDescription('')).toBeNull();
    expect(parseProductDescription(undefined)).toBeNull();
  });
});

describe('guessFactLabel', () => {
  it('recognizes fabric percentages, GSM, fit, neck, and sleeves', () => {
    expect(guessFactLabel('100% Cotton')).toBe('Fabric');
    expect(guessFactLabel('180 GSM fabric')).toBe('GSM');
    expect(guessFactLabel('Regular fit')).toBe('Fit');
    expect(guessFactLabel('Crew neck')).toBe('Neck');
    expect(guessFactLabel('Half sleeves')).toBe('Sleeves');
  });

  it('returns null when nothing is recognizable, rather than a wrong guess', () => {
    expect(guessFactLabel('Double-stitched construction')).toBeNull();
    expect(guessFactLabel('Bio-washed & pre-shrunk')).toBeNull();
  });
});
