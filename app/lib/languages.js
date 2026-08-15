export const LANGUAGES = [
  {
    id: 'english',
    label: 'English',
    native: 'English',
    wordmark: 'UNIINX',
    font: 'inter',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    native: 'हिन्दी',
    wordmark: 'यूनिंक्स',
    font: 'devanagari',
  },
  {
    id: 'telugu',
    label: 'Telugu',
    native: 'తెలుగు',
    wordmark: 'యూనింక్స్',
    font: 'telugu',
  },
  {
    id: 'tamil',
    label: 'Tamil',
    native: 'தமிழ்',
    wordmark: 'யூனிங்க்ஸ்',
    font: 'tamil',
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    native: 'മലയാളം',
    wordmark: 'യൂനിങ്ക്സ്',
    font: 'malayalam',
  },
  {
    id: 'kannada',
    label: 'Kannada',
    native: 'ಕನ್ನಡ',
    wordmark: 'ಯೂನಿಂಕ್ಸ್',
    font: 'kannada',
  },
  {
    id: 'bengali',
    label: 'Bengali',
    native: 'বাংলা',
    wordmark: 'ইউনিংক্স',
    font: 'bengali',
  },
  {
    id: 'odia',
    label: 'Odia',
    native: 'ଓଡ଼ିଆ',
    wordmark: 'ଉନିଙ୍କ୍ସ',
    font: 'oriya',
  },
];

export function fontVariable(fontKey) {
  return `var(--font-${fontKey})`;
}
