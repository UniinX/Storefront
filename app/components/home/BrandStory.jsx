import {useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {MOTION_EASE, Reveal} from '~/components/motion/Reveal.jsx';

const WHEEL_LANGUAGES = [
  {
    id: 'telugu',
    label: 'Telugu',
    native: 'తెలుగు',
    wordmark: 'యూనింక్స్',
    font: 'var(--font-telugu)',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    native: 'हिन्दी',
    wordmark: 'यूनिंक्स',
    font: 'var(--font-devanagari)',
  },
  {
    id: 'english',
    label: 'English',
    native: 'English',
    wordmark: 'UNIINX',
    font: 'var(--font-inter)',
  },
  {
    id: 'tamil',
    label: 'Tamil',
    native: 'தமிழ்',
    wordmark: 'யூனிங்க்ஸ்',
    font: 'var(--font-tamil)',
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    native: 'മലയാളം',
    wordmark: 'യൂനിങ്ക്സ്',
    font: 'var(--font-malayalam)',
  },
  {
    id: 'kannada',
    label: 'Kannada',
    native: 'ಕನ್ನಡ',
    wordmark: 'ಯೂನಿಂಕ್ಸ್',
    font: 'var(--font-kannada)',
  },
  {
    id: 'bengali',
    label: 'Bengali',
    native: 'বাংলা',
    wordmark: 'ইউনিংক্স',
    font: 'var(--font-bengali)',
  },
  {
    id: 'odia',
    label: 'Odia',
    native: 'ଓଡ଼ିଆ',
    wordmark: 'ଉନିଙ୍କ୍ସ',
    font: 'var(--font-oriya)',
  },
];

const SQUARE_POSITIONS = [
  {x: 22, y: 22},
  {x: 50, y: 14},
  {x: 78, y: 22},
  {x: 86, y: 50},
  {x: 78, y: 78},
  {x: 50, y: 86},
  {x: 22, y: 78},
  {x: 14, y: 50},
];

const BENEFITS = [
  {
    title: 'Take care with love',
    body: 'Thoughtful packaging and careful handling from our studio to your door.',
    icon: '♥',
  },
  {
    title: 'Friendly customer service',
    body: 'Clear help when you need support with products, sizing, or an order.',
    icon: '⌕',
  },
  {
    title: 'Straightforward returns',
    body: 'A simple, human return process with clear expectations at every step.',
    icon: '↻',
  },
];

export function BrandStory({
  language = 'english',
  onLanguageChange,
  showBenefits = true,
}) {
  const reduceMotion = useReducedMotion();
  const fallback =
    WHEEL_LANGUAGES.find((item) => item.id === language) ?? WHEEL_LANGUAGES[0];
  const [previewLanguage, setPreviewLanguage] = useState(fallback.id);
  const active =
    WHEEL_LANGUAGES.find((item) => item.id === previewLanguage) ?? fallback;

  const selectLanguage = (id) => {
    setPreviewLanguage(id);
    onLanguageChange?.(id);
  };

  return (
    <>
      <section className="uniinx-home-gutter bg-white py-12 sm:py-16 lg:pb-24 lg:pt-12">
        <div className="grid w-full items-center gap-10 sm:gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <Reveal>
            <h2 className="max-w-4xl text-[clamp(34px,10vw,44px)] font-normal leading-[0.98] tracking-[-0.055em] sm:text-[clamp(40px,4.5vw,65px)]">
              India&apos;s Script As Design Material
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-6 text-black/70 sm:mt-8 sm:space-y-5 sm:text-base sm:leading-7">
              <p>
                We believe that India&apos;s linguistic diversity is not a
                costume, but a structural identity. Script, sound, and rhythm
                become raw material for modern clothing.
              </p>
              <p>
                UniinX pairs a quiet global silhouette with the unmistakable
                character of Indian languages. Final campaign context will be
                added here.
              </p>
            </div>
            <blockquote className="mt-6 border-l-2 border-black pl-4 sm:mt-8 sm:pl-5">
              <p className="text-sm font-semibold">
                “For Every Language, For Every State, For India.”
              </p>
              <footer className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-black/45">
                UniinX philosophy
              </footer>
            </blockquote>
          </Reveal>

          <div className="flex justify-center lg:justify-end">
            <Reveal variant="scale">
              <div
                className="relative aspect-square w-[min(90vw,340px)] sm:w-[min(82vw,361px)]"
                role="group"
                aria-label="Select design language"
                data-pattern="square"
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full"
                  viewBox="0 0 361 361"
                >
                  <rect
                    x="53"
                    y="53"
                    width="255"
                    height="255"
                    fill="none"
                    stroke="#121212"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                    opacity=".28"
                  />
                  <rect
                    x="116"
                    y="116"
                    width="129"
                    height="129"
                    fill="none"
                    stroke="#121212"
                    strokeWidth="1"
                    opacity=".18"
                  />
                  <line
                    x1="53"
                    y1="180.5"
                    x2="308"
                    y2="180.5"
                    stroke="#121212"
                    strokeWidth="1"
                    opacity=".2"
                  />
                  <line
                    x1="180.5"
                    y1="53"
                    x2="180.5"
                    y2="308"
                    stroke="#121212"
                    strokeWidth="1"
                    opacity=".2"
                  />
                </svg>

                <div className="absolute left-1/2 top-1/2 flex size-[129px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden border border-black bg-[#d9d9d9] p-3 text-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active.id}
                      initial={{opacity: 0, y: reduceMotion ? 0 : 10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: reduceMotion ? 0 : -8}}
                      transition={{duration: 0.28, ease: MOTION_EASE}}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/50">
                        {active.label}
                      </span>
                      <span
                        className="mt-2 text-lg leading-tight"
                        style={{fontFamily: active.font}}
                      >
                        {active.wordmark}
                      </span>
                      <span
                        className="mt-1 text-xs text-black/55"
                        style={{fontFamily: active.font}}
                      >
                        {active.native}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {WHEEL_LANGUAGES.map((item, index) => {
                  const {x, y} = SQUARE_POSITIONS[index];
                  const selected = active.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{left: `${x}%`, top: `${y}%`}}
                    >
                      <motion.button
                        type="button"
                        aria-pressed={selected}
                        aria-label={`Select ${item.label}`}
                        onClick={() => selectLanguage(item.id)}
                        onMouseEnter={() => setPreviewLanguage(item.id)}
                        whileHover={
                          reduceMotion ? undefined : {scale: 1.08, y: -2}
                        }
                        whileTap={reduceMotion ? undefined : {scale: 0.94}}
                        className={`grid size-12 place-items-center overflow-hidden border px-1 text-center text-[8px] font-semibold leading-tight transition-colors sm:size-14 sm:text-[10px] ${selected ? 'border-black bg-black text-white' : 'border-black/25 bg-[#d9d9d9] text-black hover:border-black'}`}
                        style={{fontFamily: item.font}}
                      >
                        {item.native}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {showBenefits ? (
      <section className="uniinx-home-gutter bg-white pb-16 sm:pb-20 lg:pb-24">
        <div className="w-full">
          <Reveal className="mb-7 flex items-end justify-between gap-4 sm:mb-10">
            <h2 className="max-w-lg text-[clamp(32px,9vw,42px)] font-normal leading-[0.98] tracking-[-0.05em] sm:text-[clamp(34px,4vw,56px)]">
              Why you&apos;ll love to shop with us
            </h2>
            <a
              href="/pages/about"
              className="hidden min-h-11 items-center border-b border-black text-sm sm:inline-flex"
            >
              Know more about us →
            </a>
          </Reveal>
          <div className="uniinx-horizontal-scroll -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto border-t border-black/15 px-5 pt-6 sm:mx-0 sm:grid sm:gap-8 sm:px-0 sm:pt-8 md:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <Reveal
                as="article"
                variant="card"
                delay={index * 90}
                key={benefit.title}
                className="w-[78vw] max-w-[300px] shrink-0 snap-center rounded-2xl bg-[#f4f2ee] p-5 sm:w-auto sm:max-w-none sm:rounded-none sm:bg-transparent sm:p-0"
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-full bg-black text-xl text-white"
                >
                  {benefit.icon}
                </span>
                <h3 className="mt-5 text-lg font-medium">{benefit.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-black/60">
                  {benefit.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      ) : null}
    </>
  );
}

export default BrandStory;
