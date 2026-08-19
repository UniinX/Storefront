import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import heroBackground from '~/assets/home/HeroSectionBg01JPGWithText.jpg';
import { MOTION_EASE } from '~/components/motion/Reveal.jsx';
import { LANGUAGES, fontVariable } from '~/lib/languages.js';

const LANGUAGE_CYCLE_MS = 2400;

const HERO_COPY = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.18, staggerChildren: 0.1 },
  },
};

const HERO_ITEM = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.78, ease: MOTION_EASE },
  },
};

export function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.01, 1.055]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.18]);

  const [languageIndex, setLanguageIndex] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setLanguageIndex((index) => (index + 1) % LANGUAGES.length);
    }, LANGUAGE_CYCLE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);
  const currentLanguage = LANGUAGES[languageIndex];

  return (
    <section
      ref={heroRef}
      data-testid="home-hero"
      data-figma-grid="1440/1320/60"
      className="relative min-h-[max(680px,100svh)] overflow-hidden bg-background sm:min-h-[844px] lg:min-h-[992px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full overflow-hidden">
          <motion.img
            data-testid="hero-parallax-media"
            src={heroBackground}
            alt="Model wearing a black UniinX Telugu graphic T-shirt"
            loading="eager"
            style={{
              y: reduceMotion ? 0 : imageY,
              scale: reduceMotion ? 1 : imageScale,
            }}
            className="absolute -left-[5.555%] -top-[4%] h-[108%] w-[111.111%] max-w-none object-cover object-[58%_center] sm:-top-[6%] sm:h-[112%] sm:object-center"
          />
        </div>
      </div>

      <div
        data-testid="hero-mobile-gradient"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_44%,rgba(0,0,0,0.38)_68%,rgba(0,0,0,0.78)_100%)] sm:hidden"
      />

      <div className="uniinx-home-gutter relative w-full pt-[72px] sm:pt-[84px] lg:pt-[92px]">
        <div className="flex min-h-[calc(max(680px,100svh)-72px)] items-end pb-20 sm:min-h-[760px] sm:pb-32 lg:min-h-[900px] lg:items-start lg:pb-0 lg:pt-[276px]">
          <motion.div
            data-testid="hero-parallax-copy"
            variants={HERO_COPY}
            initial="hidden"
            animate="visible"
            style={{
              y: reduceMotion ? 0 : copyY,
              opacity: reduceMotion ? 1 : copyOpacity,
            }}
            className="max-w-[340px] text-white [text-shadow:none] sm:max-w-[420px] sm:text-black sm:[text-shadow:0_1px_18px_rgba(255,255,255,0.55)]"
          >
            <motion.p
              variants={HERO_ITEM}
              className="mb-3 max-w-[270px] text-[11px] font-semibold leading-4 tracking-[-0.01em] sm:mb-4 sm:max-w-none sm:text-sm lg:text-base"
            >
              For every language. For every state. For everyone.
            </motion.p>
            <motion.h1
              variants={HERO_ITEM}
              aria-label="Clothes in your Language"
              className="text-[clamp(38px,11vw,46px)] font-medium leading-[0.96] tracking-[-0.055em] sm:text-[clamp(44px,4.2vw,48px)]"
            >
              <span aria-hidden="true">
                Clothes in your
                <br />
                <span className="relative inline-block align-top">
                  <motion.span
                    key={currentLanguage.id}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 18, filter: 'blur(6px)' }
                    }
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, ease: MOTION_EASE }}
                    style={{ fontFamily: fontVariable(currentLanguage.font) }}
                    className="inline-block"
                  >
                    {currentLanguage.languageWord}
                  </motion.span>
                </span>
              </span>
            </motion.h1>
            <motion.button
              variants={HERO_ITEM}
              type="button"
              onClick={() => navigate('/collections/all')}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="mt-6 inline-flex min-h-12 min-w-[156px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-8 sm:min-h-[51px] sm:min-w-[193px] sm:rounded-[20px] sm:bg-black sm:px-7 sm:text-base sm:text-white sm:focus-visible:outline-black"
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
