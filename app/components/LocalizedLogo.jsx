import englishLogo from '~/assets/language-logos/Logo_English.svg';
import hindiLogo from '~/assets/language-logos/Logo_Hindi.svg';
import tamilLogo from '~/assets/language-logos/Logo_Tamil.svg';
import teluguLogo from '~/assets/language-logos/Logo_Telugu.svg';
import kannadaLogo from '~/assets/language-logos/Logo_Kannada.svg';
import odiaLogo from '~/assets/language-logos/Logo_Odia.svg';
import malayalamLogo from '~/assets/language-logos/Logo_Malayalam.svg';

export const LANGUAGE_LOGOS = {
  english: englishLogo,
  hindi: hindiLogo,
  tamil: tamilLogo,
  telugu: teluguLogo,
  kannada: kannadaLogo,
  odia: odiaLogo,
  malayalam: malayalamLogo,
};

export const LANGUAGE_NAMES = {
  english: 'English',
  hindi: 'Hindi',
  tamil: 'Tamil',
  telugu: 'Telugu',
  kannada: 'Kannada',
  odia: 'Odia',
  malayalam: 'Malayalam',
};

export function getLogoForLanguage(language) {
  return LANGUAGE_LOGOS[normalizeLanguage(language)] ?? englishLogo;
}

export function LocalizedLogo({language = 'english', alt, ...props}) {
  const normalizedLanguage = normalizeLanguage(language);
  const name = LANGUAGE_NAMES[normalizedLanguage] ?? LANGUAGE_NAMES.english;

  return (
    <img
      src={getLogoForLanguage(language)}
      alt={alt ?? `UniinX logo in ${name}`}
      {...props}
    />
  );
}

export function hasLocalizedLogo(language) {
  return Boolean(LANGUAGE_LOGOS[normalizeLanguage(language)]);
}

function normalizeLanguage(language) {
  return typeof language === 'string' ? language.trim().toLowerCase() : 'english';
}
