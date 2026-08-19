/**
 * @file Maps a merchant-entered color name (e.g. "Brick Red", "Grey
 * Melange") to a representative hex value, for products/variants that have
 * no real Shopify swatch data attached. Used wherever a color needs to be
 * shown as a solid block rather than a photo.
 */

const COLOR_NAME_MAP = {
  black: '#1a1a1a',
  white: '#ffffff',
  'off white': '#f2ede1',
  offwhite: '#f2ede1',
  cream: '#f2ede1',
  ivory: '#f2ede1',
  gray: '#8a8a86',
  grey: '#8a8a86',
  'grey melange': '#9b9691',
  'gray melange': '#9b9691',
  'charcoal melange': '#4a4a48',
  charcoal: '#3a3a3a',
  navy: '#1f2d4a',
  'navy blue': '#1f2d4a',
  blue: '#3f5a8a',
  'baby blue': '#a9cbe8',
  'sky blue': '#87ceeb',
  teal: '#3f7a7a',
  red: '#a8433a',
  'brick red': '#9e4b3d',
  maroon: '#6b2737',
  wine: '#5c2436',
  green: '#3c5a3c',
  'bottle green': '#1f3d2b',
  olive: '#6b6b3a',
  jade: '#8fbf9f',
  mint: '#a9d9c2',
  yellow: '#d9b84a',
  mustard: '#c9a227',
  gold: '#c9a227',
  beige: '#d9c7a3',
  sand: '#d9c7a3',
  tan: '#c9a878',
  khaki: '#bfb488',
  brown: '#6b4a34',
  rust: '#a8543a',
  pink: '#e0a3b0',
  'light pink': '#f0c6cf',
  coral: '#e0785f',
  lavender: '#c9b8dd',
  purple: '#6a4a8a',
  peach: '#f0c4a0',
  orange: '#d97b3d',
};

/**
 * Resolves a color name to a hex value. Tries an exact (normalized) match
 * first, then falls back to matching a single recognizable color word
 * within a multi-word name (checked last-word-first, since modifiers
 * usually precede the base color, e.g. "Brick Red" -> "red"). Returns null
 * when nothing in the name is recognizable, so the caller can fall back to
 * something else (a real swatch, a photo, initials).
 */
export function resolveColorHex(colorName) {
  if (!colorName) return null;
  const normalized = colorName.trim().toLowerCase();
  if (!normalized) return null;
  if (COLOR_NAME_MAP[normalized]) return COLOR_NAME_MAP[normalized];

  const words = normalized.split(/\s+/);
  for (let i = words.length - 1; i >= 0; i--) {
    if (COLOR_NAME_MAP[words[i]]) return COLOR_NAME_MAP[words[i]];
  }
  return null;
}
