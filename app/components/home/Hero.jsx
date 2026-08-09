import {useState, useEffect} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import {useNavigate} from 'react-router';
import {Button} from '~/components/ds/index.js';

const CYCLES = [
  {text: 'Language', font: 'var(--font-marcellus)', script: 'English'},
  {text: 'भाषा', font: 'var(--font-devanagari)', script: 'Hindi'},
  {text: 'மொழி', font: 'var(--font-tamil)', script: 'Tamil'},
  {text: 'భాష', font: 'var(--font-telugu)', script: 'Telugu'},
  {text: 'ভাষা', font: 'var(--font-bengali)', script: 'Bengali'},
  {text: 'ભાષા', font: 'var(--font-gujarati)', script: 'Gujarati'},
  {text: 'ਭਾਸ਼ਾ', font: 'var(--font-gurmukhi)', script: 'Punjabi'},
  {text: 'ಭಾಷೆ', font: 'var(--font-kannada)', script: 'Kannada'},
  {text: 'زبان', font: 'var(--font-urdu)', script: 'Urdu', rtl: true},
];

const BACKGROUND_GLYPHS = [
  {char: 'अ', font: 'var(--font-devanagari)', top: '-5%', left: '-10%', size: 'clamp(300px, 45vw, 600px)', dx: '22px', dy: '-14px', ds: 1.05, duration: '26s', delay: '-4s'},
  {char: 'க', font: 'var(--font-tamil)', bottom: '-10%', right: '-5%', size: 'clamp(250px, 40vw, 500px)', dx: '-18px', dy: '16px', ds: 1.04, duration: '30s', delay: '-12s'},
  {char: 'క', font: 'var(--font-telugu)', top: '10%', right: '-8%', size: 'clamp(300px, 45vw, 550px)', dx: '-20px', dy: '18px', ds: 1.06, duration: '22s', delay: '-7s'},
  {char: 'অ', font: 'var(--font-bengali)', bottom: '-5%', left: '-8%', size: 'clamp(280px, 42vw, 520px)', dx: '16px', dy: '-20px', ds: 1.04, duration: '28s', delay: '-18s'},
  {char: 'ಅ', font: 'var(--font-kannada)', top: '-6%', right: '18%', size: 'clamp(200px, 30vw, 380px)', dx: '-12px', dy: '14px', ds: 1.05, duration: '20s', delay: '-3s'},
  {char: 'અ', font: 'var(--font-gujarati)', bottom: '-6%', left: '20%', size: 'clamp(200px, 30vw, 380px)', dx: '14px', dy: '-12px', ds: 1.03, duration: '25s', delay: '-9s'},
  {char: 'ਅ', font: 'var(--font-gurmukhi)', top: '38%', left: '-10%', size: 'clamp(200px, 30vw, 380px)', dx: '18px', dy: '10px', ds: 1.05, duration: '32s', delay: '-21s'},
  {char: 'ଓ', font: 'var(--font-oriya)', top: '42%', right: '-10%', size: 'clamp(200px, 30vw, 380px)', dx: '-16px', dy: '-12px', ds: 1.04, duration: '27s', delay: '-14s'},
  {char: 'ا', font: 'var(--font-urdu)', bottom: '15%', right: '32%', size: 'clamp(200px, 30vw, 380px)', dx: '12px', dy: '16px', ds: 1.06, duration: '23s', delay: '-6s'},
];

export function Hero({language = 'english'}) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const activeCycle = CYCLES[index];

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] flex flex-col items-center justify-center overflow-hidden bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">

      {/* Background script glyph textures (editorial watermarks) */}
      <div className="absolute inset-0 select-none pointer-events-none overflow-hidden z-0">
        {BACKGROUND_GLYPHS.map((glyph) => (
          <span
            key={`${glyph.char}-${glyph.top ?? glyph.bottom}-${glyph.left ?? glyph.right}`}
            style={{
              position: 'absolute',
              top: glyph.top,
              bottom: glyph.bottom,
              left: glyph.left,
              right: glyph.right,
              fontFamily: glyph.font,
              fontSize: glyph.size,
              lineHeight: 1,
              '--dx': glyph.dx,
              '--dy': glyph.dy,
              '--ds': glyph.ds,
              animationDuration: glyph.duration,
              animationDelay: glyph.delay,
            }}
            className="uniinx-hero-glyph text-[#121212]/[0.02] dark:text-[#F5F2ED]/[0.015] font-light leading-none transition-colors duration-200"
          >
            {glyph.char}
          </span>
        ))}
      </div>

      {/* Confident, editorial alignment content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{opacity: 0, y: 15}}
          animate={{opacity: 0.7, y: 0}}
          transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
          style={{
            fontFamily: language === 'tamil' ? 'var(--font-tamil)' : 'var(--font-work-sans)',
            fontSize: language === 'tamil' ? '14px' : '12px',
          }}
          className="font-work tracking-[0.2em] text-black dark:text-white uppercase mb-8"
        >
          {language === 'tamil'
            ? 'ஒவ்வொரு மொழிக்கும் · ஒவ்வொரு மாநிலத்திற்கும் · ஒவ்வொருவருக்கும்'
            : 'For every language · For every state · For every one'}
        </motion.p>

        <h1 className="font-marcellus text-[clamp(44px,8vw,96px)] leading-[1.05] tracking-tight text-black dark:text-white m-0 min-h-[2.5em] flex flex-col items-center justify-center">
          <span>Clothes in your</span>
          <div className="h-[1.25em] flex items-center justify-center relative w-full overflow-hidden mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeCycle.text}
                initial={{y: 30, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: -30, opacity: 0}}
                transition={{duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1]}}
                style={{fontFamily: activeCycle.font}}
                dir={activeCycle.rtl ? 'rtl' : 'ltr'}
                className="absolute text-brand-accent dark:text-brand-accent-light block font-medium"
              >
                {activeCycle.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>

        <motion.div
          initial={{opacity: 0, y: 15}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
          className="mt-8"
        >
          <Button
            tone="accent"
            shape="pill"
            onClick={() => navigate('/collections/all')}
            id="hero-shop-cta"
            className="hover:opacity-95 transition-opacity"
            style={{
              padding: '16px 36px',
              fontSize: '14px',
              letterSpacing: '0.1em',
              boxShadow: '0 4px 20px rgba(27,42,74,0.15)',
            }}
          >
            Shop New →
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-center select-none pointer-events-none">
        <span className="font-work text-[9px] tracking-wide text-black/50 dark:text-white/40 uppercase">
          Scroll Down
        </span>
        <div className="w-[1px] h-12 bg-black/25 dark:bg-white/20 mx-auto mt-2 relative overflow-hidden">
          <motion.div
            animate={reduceMotion ? undefined : {y: ['-100%', '100%']}}
            transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
            className="absolute top-0 left-0 w-full h-1/2 bg-brand-accent dark:bg-brand-accent-light"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
