import {
  LANGUAGE_NAMES,
  LocalizedLogo,
} from '~/components/LocalizedLogo.jsx';
import {Reveal, StaggerContainer, StaggerItem} from '~/components/motion/Reveal.jsx';

const LANGUAGE_WORDMARKS = {
  telugu: 'యూనింక్స్',
  hindi: 'यूनिंक्स',
  english: 'UNIINX',
  tamil: 'யூனிங்க்ஸ்',
  malayalam: 'യൂനിങ്ക്സ്',
  kannada: 'ಯೂನಿಂಕ್ಸ್',
  bengali: 'ইউনিংক্স',
  odia: 'ଉନିଙ୍କ୍ସ',
};

const LANGUAGE_FONTS = {
  telugu: 'var(--font-telugu)',
  hindi: 'var(--font-devanagari)',
  english: 'var(--font-inter)',
  tamil: 'var(--font-tamil)',
  malayalam: 'var(--font-malayalam)',
  kannada: 'var(--font-kannada)',
  bengali: 'var(--font-bengali)',
  odia: 'var(--font-oriya)',
};

export const SHOWCASE_LANGUAGES = [
  'telugu',
  'hindi',
  'english',
  'tamil',
  'malayalam',
  'kannada',
  'bengali',
  'odia',
];

export function LanguageShowcase({
  language = 'English',
  onLanguageChange,
}) {
  return (
    <section className="uniinx-home-gutter relative z-10 -mt-7 rounded-t-[28px] bg-white pb-10 pt-8 sm:-mt-[30px] sm:rounded-t-[30px] sm:pb-12 sm:pt-10 lg:-mt-[50px] lg:pb-10">
      <div className="w-full text-left sm:text-center">
        <Reveal variant="scale">
          <LocalizedLogo
            language={language}
            className="h-8 w-auto sm:mx-auto sm:h-11"
          />
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/50 sm:mt-4 sm:text-[10px]">
            Clothes in your language
          </p>
          <h2 className="mt-1 text-lg font-medium tracking-[-0.035em] sm:mt-2 sm:text-base">
            Select design language
          </h2>
        </Reveal>

        <StaggerContainer
          data-testid="language-scroll"
          stagger={0.04}
          className="uniinx-horizontal-scroll -mx-5 mt-6 flex snap-x snap-mandatory gap-7 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-4 sm:gap-x-5 sm:gap-y-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-8 lg:gap-6"
        >
          {SHOWCASE_LANGUAGES.map((item) => {
            const selected = item === language;
            return (
              <StaggerItem
                key={item}
                id={`home-lang-${item}`}
                as="button"
                type="button"
                aria-pressed={selected}
                onClick={() => onLanguageChange?.(item)}
                className={`group relative flex min-h-[72px] w-max min-w-[92px] shrink-0 snap-start flex-col items-start justify-center py-2 text-left transition-colors sm:min-h-[76px] sm:w-auto sm:min-w-0 sm:items-center sm:text-center ${selected ? 'text-black' : 'text-black/45 hover:text-black/75'}`}
              >
                <span
                  className="text-[22px] leading-none tracking-[-0.03em]"
                  style={{fontFamily: LANGUAGE_FONTS[item]}}
                >
                  {LANGUAGE_WORDMARKS[item]}
                </span>
                <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.13em]">
                  {LANGUAGE_NAMES[item]}
                </span>
                <span
                  className={`mt-1.5 h-[1.5px] rounded-full transition-all duration-300 ${selected ? 'w-5 bg-black' : 'w-0 bg-transparent group-hover:w-3 group-hover:bg-black/30'}`}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default LanguageShowcase;
