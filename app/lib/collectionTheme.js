import {normalizeCollectionName} from './productCardTheme.js';

export const FALLBACK_COLLECTION_THEMES = Object.freeze([
  'Solids',
  'Antariksham',
  'Language Editions',
  'Essentials',
]);

const PALETTES = Object.freeze([
  {
    id: 'solids',
    keywords: ['solid', 'essential', 'basic'],
    hero: '#d9d1c5',
    page: '#f5f1ea',
    ink: '#181716',
    muted: '#6e665e',
    accent: '#f15353',
    pattern: '#181716',
    glyphs: ['అ', 'अ', 'அ'],
    description: 'Quiet essentials where proportion, weight, and color lead.',
  },
  {
    id: 'antariksham',
    keywords: ['antariksham', 'space', 'orbit', 'cosmos'],
    hero: '#17213b',
    page: '#edf0f5',
    ink: '#f7f4ed',
    muted: '#b8c3dd',
    accent: '#f06b4f',
    pattern: '#91a6d4',
    glyphs: ['అం', 'अं', 'அம்'],
    description: 'A night-sky study of scripts, orbit, and the space between forms.',
  },
  {
    id: 'language-editions',
    keywords: ['language', 'script', 'edition', 'bhasha'],
    hero: '#bd4638',
    page: '#f7ede5',
    ink: '#fff8ef',
    muted: '#f2c8bd',
    accent: '#f4c95d',
    pattern: '#fff1e5',
    glyphs: ['భ', 'भ', 'ழ'],
    description: 'Indian scripts become structure, rhythm, and unmistakable identity.',
  },
  {
    id: 'studio',
    keywords: ['studio', 'limited', 'artist', 'collab'],
    hero: '#463d63',
    page: '#f0edf5',
    ink: '#fffdf7',
    muted: '#cec5df',
    accent: '#ee8f65',
    pattern: '#d8d0e8',
    glyphs: ['ক', 'ಕ', 'മ'],
    description: 'Limited studies, collaborations, and experiments from the UniinX studio.',
  },
  {
    id: 'field',
    keywords: ['earth', 'field', 'state', 'land'],
    hero: '#46503d',
    page: '#f0f1e9',
    ink: '#fbf8ef',
    muted: '#cbd0bd',
    accent: '#e98955',
    pattern: '#dce2cf',
    glyphs: ['ଓ', 'മ', 'ಕ'],
    description: 'Earth-led color and everyday forms rooted in place.',
  },
]);

export function resolveCollectionTheme(name = '') {
  const label = String(name || 'UniinX').trim() || 'UniinX';
  const key = normalizeCollectionName(label) || 'uniinx';
  const matched = PALETTES.find((palette) =>
    palette.keywords.some((keyword) => key.includes(keyword)),
  );
  const palette = matched ?? PALETTES[hashThemeKey(key) % PALETTES.length];

  return {
    ...palette,
    key,
    label,
    description: matched?.description ?? `A visual world shaped around ${label}.`,
  };
}

export function getCollectionThemeStyle(name) {
  const theme = resolveCollectionTheme(name);
  return {
    '--collection-hero': theme.hero,
    '--collection-page': theme.page,
    '--collection-ink': theme.ink,
    '--collection-muted': theme.muted,
    '--collection-accent': theme.accent,
    '--collection-pattern': theme.pattern,
  };
}

export function uniqueThemeNames(themes = []) {
  const names = new Map();
  for (const theme of themes) {
    const label = String(theme || '').trim();
    const key = normalizeCollectionName(label);
    if (key && !names.has(key)) names.set(key, label);
  }
  return [...names.values()];
}

function hashThemeKey(value) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
}
