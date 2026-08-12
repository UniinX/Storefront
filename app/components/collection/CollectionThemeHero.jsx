import {motion, useReducedMotion} from 'framer-motion';
import {ThemeSwipeBar} from './ThemeSwipeBar.jsx';
import {
  getCollectionThemeStyle,
  resolveCollectionTheme,
} from '~/lib/collectionTheme.js';

export function CollectionThemeHero({
  title,
  activeTheme = '',
  themes = [],
  description,
  eyebrow = 'UniinX collection',
}) {
  const reduceMotion = useReducedMotion();
  const visualTheme = activeTheme || title || 'UniinX';
  const theme = resolveCollectionTheme(visualTheme);
  const style = getCollectionThemeStyle(visualTheme);

  return (
    <section style={style} className="relative bg-[var(--collection-page)] pt-[92px]">
      <div className="relative min-h-[440px] overflow-hidden bg-[var(--collection-hero)] px-5 pb-28 pt-16 text-[var(--collection-ink)] sm:px-8 sm:pt-20 lg:min-h-[520px] lg:px-[clamp(60px,6vw,112px)] lg:pt-24">
        <div aria-hidden="true" className="absolute inset-0 opacity-30">
          <div className="absolute inset-5 border border-[var(--collection-pattern)]/30 sm:inset-8 lg:inset-[60px]" />
          <div className="absolute -right-[5vw] -top-[8vw] size-[clamp(260px,38vw,620px)] rotate-12 border border-[var(--collection-pattern)]/35" />
          <div className="absolute bottom-8 left-[48%] size-28 rotate-45 border border-[var(--collection-pattern)]/25 sm:size-44" />
          {theme.glyphs.map((glyph, index) => (
            <span
              key={`${theme.key}-${glyph}`}
              className="absolute select-none font-medium leading-none text-[var(--collection-pattern)]"
              style={{
                fontSize: `clamp(${90 + index * 18}px, ${14 + index * 3}vw, ${260 + index * 45}px)`,
                left: `${8 + index * 34}%`,
                top: `${12 + (index % 2) * 43}%`,
                opacity: 0.16,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>

        <motion.div
          key={visualTheme}
          initial={reduceMotion ? {opacity: 0} : {opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: reduceMotion ? 0.15 : 0.55, ease: [0.16, 0.84, 0.32, 1]}}
          className="relative z-10 flex min-h-[300px] max-w-[1320px] flex-col justify-between lg:min-h-[340px]"
        >
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--collection-muted)]">
            <span className="h-px w-10 bg-[var(--collection-accent)]" />
            {eyebrow}
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <h1 className="max-w-5xl text-[clamp(58px,9vw,142px)] font-normal leading-[0.78] tracking-[-0.07em]">
              {activeTheme || title}
            </h1>
            <div className="max-w-md border-l border-[var(--collection-pattern)]/35 pl-5">
              <p className="text-sm leading-6 text-[var(--collection-muted)] sm:text-base sm:leading-7">
                {description || theme.description}
              </p>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--collection-ink)]">
                Theme {theme.label}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto -mt-7 max-w-[1440px] px-5 sm:px-8 lg:px-[60px]">
        <div className="rounded-[22px] border border-black/10 bg-white/80 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <ThemeSwipeBar themes={themes} activeTheme={activeTheme} />
        </div>
      </div>
    </section>
  );
}

export default CollectionThemeHero;
