import {useState, useEffect} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';

const REGIONS = [
  {
    name: 'North',
    label: 'Northern Region',
    scripts: [
      {lang: 'Hindi', text: 'यूनिंक्स', font: 'var(--font-devanagari)'},
      {lang: 'Punjabi', text: 'ਯੂਨਿੰਕਸ', font: 'var(--font-gurmukhi)'},
      {lang: 'Urdu', text: 'یونینکس', font: 'var(--font-urdu)', rtl: true},
    ],
    angle: 270, // Top
  },
  {
    name: 'East',
    label: 'Eastern Region',
    scripts: [
      {lang: 'Bengali', text: 'ইউনিংক্স', font: 'var(--font-bengali)'},
      {lang: 'Odia', text: 'ଉନିଙ୍କ୍ସ', font: 'var(--font-oriya)'},
    ],
    angle: 0, // Right
  },
  {
    name: 'South',
    label: 'Southern Region',
    scripts: [
      {lang: 'Tamil', text: 'யூனிங்க்ஸ்', font: 'var(--font-tamil)'},
      {lang: 'Telugu', text: 'యూనింక్స్', font: 'var(--font-telugu)'},
      {lang: 'Kannada', text: 'ಯೂನಿಂಕ್ಸ್', font: 'var(--font-kannada)'},
    ],
    angle: 90, // Bottom
  },
  {
    name: 'West',
    label: 'Western Region',
    scripts: [
      {lang: 'Gujarati', text: 'યુનિંક્સ', font: 'var(--font-gujarati)'},
      {lang: 'Marathi', text: 'युनिंक्स', font: 'var(--font-devanagari)'},
    ],
    angle: 180, // Left
  },
];

export function BrandStory({language = 'english'}) {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  // Restart the script cycle from the top whenever the region changes.
  useEffect(() => {
    setScriptIndex(0);
    if (reduceMotion) return undefined;
    const timer = setInterval(() => {
      setScriptIndex((prev) => (prev + 1) % activeRegion.scripts.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [activeRegion, reduceMotion]);

  const activeScript = activeRegion.scripts[scriptIndex % activeRegion.scripts.length];

  return (
    <section className="px-6 md:px-14 py-24 bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Interactive Language Wheel Centerpiece */}
        <div className="flex flex-col items-center justify-center relative min-h-[420px] min-w-0">
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">

            {/* Outer dotted track */}
            <div className="absolute inset-0 rounded-full border border-dashed border-black/10 dark:border-white/10" />

            {/* Connecting lines from center to active region */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full">
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${Math.round(50 + 40 * Math.cos((activeRegion.angle * Math.PI) / 180))}%`}
                  y2={`${Math.round(50 + 40 * Math.sin((activeRegion.angle * Math.PI) / 180))}%`}
                  className="stroke-brand-accent dark:stroke-brand-accent-light stroke-[1.5]"
                  style={{transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'}}
                />
              </svg>
            </div>

            {/* Center Brand Transliterations */}
            <div className="absolute w-28 h-28 rounded-full bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col items-center justify-center p-3 text-center z-10 transition-colors duration-200 border border-black/5 dark:border-white/5 shadow-sm">
              <span className="font-work text-[7px] tracking-widest text-black/40 dark:text-white/40 uppercase mb-1">
                {activeRegion.label}
              </span>
              <div className="min-h-[40px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeRegion.name}-${activeScript.lang}`}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: reduceMotion ? 0 : 0.3}}
                    style={{fontFamily: activeScript.font}}
                    dir={activeScript.rtl ? 'rtl' : 'ltr'}
                    className="text-black dark:text-white text-sm font-light"
                  >
                    {activeScript.text}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Region Interactive Nodes */}
            {REGIONS.map((region) => {
              const rad = (region.angle * Math.PI) / 180;
              const radius = 100; // radius of orbit — kept within the 200px wheel so nodes never push past the viewport at narrow widths
              const x = radius * Math.cos(rad);
              const y = radius * Math.sin(rad);
              const isActive = activeRegion.name === region.name;

              return (
                <button
                  key={region.name}
                  onClick={() => setActiveRegion(region)}
                  onMouseEnter={() => setActiveRegion(region)}
                  className="absolute w-11 h-11 rounded-full flex items-center justify-center z-20 focus:outline-none transition-all duration-300"
                  style={{
                    left: `calc(50% + ${x}px - 22px)`,
                    top: `calc(50% + ${y}px - 22px)`,
                    backgroundColor: isActive ? 'var(--accent-indigo)' : 'var(--paper-soft)',
                    boxShadow: isActive ? '0 0 15px rgba(27,42,74,0.3)' : 'none',
                  }}
                  id={`node-${region.name.toLowerCase()}`}
                >
                  <span
                    className={`font-work text-[10px] tracking-wider font-semibold transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-black/50 dark:text-white/50'
                    }`}
                  >
                    {region.name}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 font-work text-[10px] text-black/40 dark:text-white/40 tracking-widest uppercase text-center">
            Hover or tap regions to explore
          </p>
        </div>

        {/* Right: Modern Manifesto & Copy */}
        <div className="flex flex-col justify-center min-w-0">
          <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-4 block">
            About UniinX
          </span>
          <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-black dark:text-white uppercase font-light mb-8">
            India's Script As <br />
            <span className="italic font-normal">Design Material</span>
          </h2>
          <p className="font-work text-sm md:text-base leading-relaxed text-black/70 dark:text-white/75 font-light mb-6">
            We believe that India's linguistic diversity is not a costume, but a structural identity.
            By stripping away heavy, ornate borders and saturated festival colors, we allow the script,
            sound, and rhythm of Indian languages to live as raw, minimalist texture.
          </p>
          <p className="font-work text-sm md:text-base leading-relaxed text-black/70 dark:text-white/75 font-light mb-8">
            Styled with the clean lines of Scandinavian and Japanese minimalism, UniinX is unmistakably
            Indian in spirit, and confidently modern for the global stage.
          </p>

          {/* Clean minimal quotes */}
          <div className="border-l-[2px] border-brand-accent dark:border-brand-accent-light pl-6 py-1">
            <span
              style={{
                fontFamily: language === 'tamil' ? 'var(--font-tamil)' : 'var(--font-marcellus)',
                fontSize: language === 'tamil' ? '18px' : 'inherit',
              }}
              className="text-black dark:text-white italic block mb-1"
            >
              {language === 'tamil'
                ? '"ஒவ்வொரு மொழிக்கும், ஒவ்வொரு மாநிலத்திற்கும், இந்தியாவுக்கு."'
                : '"For Every Language, For Every State, For India."'}
            </span>
            <span className="font-work text-[10px] text-black/40 dark:text-white/40 tracking-wider uppercase">
              The UniinX Philosophy
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default BrandStory;
