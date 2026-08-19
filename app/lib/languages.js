export const LANGUAGES = [
  {
    id: 'english',
    label: 'English',
    native: 'English',
    wordmark: 'UNIINX',
    font: 'inter',
    languageWord: 'Language',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    native: 'हिन्दी',
    wordmark: 'यूनिंक्स',
    font: 'devanagari',
    languageWord: 'भाषा',
  },
  {
    id: 'telugu',
    label: 'Telugu',
    native: 'తెలుగు',
    wordmark: 'యూనింక్స్',
    font: 'telugu',
    languageWord: 'భాష',
  },
  {
    id: 'tamil',
    label: 'Tamil',
    native: 'தமிழ்',
    wordmark: 'யூனிங்க்ஸ்',
    font: 'tamil',
    languageWord: 'மொழி',
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    native: 'മലയാളം',
    wordmark: 'യൂനിങ്ക്സ്',
    font: 'malayalam',
    languageWord: 'ഭാഷ',
  },
  {
    id: 'kannada',
    label: 'Kannada',
    native: 'ಕನ್ನಡ',
    wordmark: 'ಯೂನಿಂಕ್ಸ್',
    font: 'kannada',
    languageWord: 'ಭಾಷೆ',
  },
  {
    id: 'bengali',
    label: 'Bengali',
    native: 'বাংলা',
    wordmark: 'ইউনিংক্স',
    font: 'bengali',
    languageWord: 'ভাষা',
  },
  {
    id: 'odia',
    label: 'Odia',
    native: 'ଓଡ଼ିଆ',
    wordmark: 'ଉନିଙ୍କ୍ସ',
    font: 'oriya',
    languageWord: 'ଭାଷା',
  },
];

export function fontVariable(fontKey) {
  return `var(--font-${fontKey})`;
}
