import {Reveal} from '~/components/motion/Reveal.jsx';
import {LANGUAGES, FontVar} from '@ds/components/commerce/LanguageChipSelector.jsx';

export function Footer({language, onLanguageChange}) {
  return (
    <Reveal as="footer" className="px-6 md:px-14 py-16 bg-brand-bg-light dark:bg-brand-bg-dark border-t border-black/10 dark:border-white/10 transition-colors duration-200">

      {/* Brand logo closer */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <p className="font-marcellus text-2xl md:text-3xl tracking-[0.15em] text-black dark:text-white uppercase mb-2">
          UNIINX
        </p>
        <p className="font-work text-xs tracking-[0.2em] text-black/50 dark:text-white/40 uppercase">
          Clothes in your Language
        </p>
      </div>

      {/* Interactive Script Carousel Language Switcher */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <span className="font-work text-[9px] tracking-widest text-black/40 dark:text-white/40 uppercase block text-center mb-6">
          Select Design Language / भारतीय भाषाएं
        </span>

        {/* Horizontal Script Row */}
        <div className="flex items-center justify-start md:justify-center gap-6 overflow-x-auto pb-4 scrollbar-none mask-image-horizontal">
          {LANGUAGES.map((lang) => {
            const isActive = lang.id === language;
            return (
              <button
                key={lang.id}
                onClick={() => onLanguageChange?.(lang.id)}
                className={`flex flex-col items-center justify-center min-w-[90px] p-2 focus:outline-none transition-all duration-300 rounded-md border ${
                  isActive
                    ? 'border-brand-accent dark:border-brand-accent-light bg-brand-surface-light dark:bg-brand-surface-dark'
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                id={`footer-lang-${lang.id}`}
              >
                <span
                  style={{fontFamily: FontVar(lang.font)}}
                  dir={lang.rtl ? 'rtl' : 'ltr'}
                  className={`text-lg md:text-xl font-light transition-colors duration-300 ${
                    isActive ? 'text-brand-accent dark:text-brand-accent-light' : 'text-black/50 dark:text-white/50'
                  }`}
                >
                  {lang.wordmark}
                </span>
                <span className="font-work text-[9px] tracking-wide text-black/40 dark:text-white/30 mt-1 uppercase">
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer bottom metadata */}
      <div className="w-full border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-work text-[10px] tracking-wide text-black/45 dark:text-white/40 text-center md:text-left">
          © {new Date().getFullYear()} UniinX. Styled with Scandinavian minimalism. Made for India &amp; the world.
        </p>
        <p className="font-marcellus text-xs tracking-[0.1em] text-black dark:text-white">
          To this country &amp; its people
        </p>
      </div>
    </Reveal>
  );
}

export default Footer;
