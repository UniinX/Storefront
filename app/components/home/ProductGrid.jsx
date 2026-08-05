import {useState, useEffect} from 'react';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {ProductCard} from '~/components/ds/index.js';

const PHILOSOPHIES = [
  {text: 'We speak the language of modern craft.', font: 'var(--font-marcellus)', lang: 'English'},
  {text: 'हम आधुनिक शिल्प की भाषा बोलते हैं।', font: 'var(--font-devanagari)', lang: 'Hindi'},
  {text: 'நாங்கள் நவீன கைவினை மொழியைப் பேசுகிறோம்.', font: 'var(--font-tamil)', lang: 'Tamil'},
  {text: 'మేము ఆధునిక హస్తకళల భాషను మాట్లాడతాము.', font: 'var(--font-telugu)', lang: 'Telugu'},
  {text: 'আমরা আধুনিক কারুশিল্পের ভাষায় কথা বলি।', font: 'var(--font-bengali)', lang: 'Bengali'},
  {text: 'આપણે આધુનિક ક્રાફ્ટની ભાષા બોલીએ છીએ.', font: 'var(--font-gujarati)', lang: 'Gujarati'},
  {text: 'ਅਸੀਂ ਆਧੁਨਿਕ ਕਾਰੀਗਰੀ ਦੀ ਭਾਸ਼ਾ ਬੋਲਦੇ ਹਾਂ।', font: 'var(--font-gurmukhi)', lang: 'Punjabi'},
];

/**
 * @param {{title?: string, products: Array}}
 */
export function ProductGrid({title = 'NEWEST IN THE STORE', products}) {
  const [philosophy, setPhilosophy] = useState(PHILOSOPHIES[0]);

  useEffect(() => {
    // Select a random brand philosophy per visit/render
    const randomIdx = Math.floor(Math.random() * PHILOSOPHIES.length);
    setPhilosophy(PHILOSOPHIES[randomIdx]);
  }, []);

  if (!products?.length) return null;

  return (
    <section className="px-6 md:px-14 py-16 bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      {/* Editorial clean line divider */}
      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 mb-12" />

      {/* Grid title */}
      <Reveal as="h2" style={{
        fontFamily: 'var(--font-marcellus)',
        fontSize: 'clamp(28px, 4vw, 42px)',
        lineHeight: 1.1,
        letterSpacing: 'var(--uniinx-tracking-tight)',
        margin: '0 0 40px',
      }} className="text-black dark:text-white uppercase font-light">
        {title}
      </Reveal>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 80} className="min-w-0">
            <ProductCard product={product} loading={i < 4 ? 'eager' : undefined} />
          </Reveal>
        ))}
      </div>

      {/* Multilingual pull-quote strip between sections */}
      <div className="w-full py-20 my-8 flex items-center justify-center border-t border-b border-black/5 dark:border-white/5 bg-brand-surface-light/30 dark:bg-brand-surface-dark/30 transition-colors duration-200">
        <div className="max-w-3xl text-center px-6">
          <span className="font-work text-[9px] tracking-[0.2em] text-brand-accent/60 dark:text-brand-accent-light/60 uppercase block mb-3">
            Brand Philosophy
          </span>
          <p
            style={{fontFamily: philosophy.font}}
            className="text-black dark:text-white text-[clamp(20px,3.5vw,32px)] leading-snug tracking-tight font-light"
          >
            "{philosophy.text}"
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
