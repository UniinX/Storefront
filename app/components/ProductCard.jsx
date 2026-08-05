import {useState, useEffect, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

const TRANSLATIONS = {
  shirt: [
    {text: 'টি-শার্ট', font: 'var(--font-bengali)'},
    {text: 'टी-शर्ट', font: 'var(--font-devanagari)'},
    {text: 'டி-சர்ட்', font: 'var(--font-tamil)'},
    {text: 'టీ-షర్ట్', font: 'var(--font-telugu)'},
    {text: 'ટી-શર્ટ', font: 'var(--font-gujarati)'},
    {text: 'ਟੀ-ਸ਼ਰਟ', font: 'var(--font-gurmukhi)'},
    {text: 'ٹی شرٹ', font: 'var(--font-urdu)', rtl: true},
  ],
  kurta: [
    {text: 'कूर्ता', font: 'var(--font-devanagari)'},
    {text: 'குர்தா', font: 'var(--font-tamil)'},
    {text: 'కుర్తా', font: 'var(--font-telugu)'},
    {text: 'কুর্তা', font: 'var(--font-bengali)'},
    {text: 'કુર્તા', font: 'var(--font-gujarati)'},
    {text: 'ਕੁੜਤਾ', font: 'var(--font-gurmukhi)'},
    {text: 'کرتا', font: 'var(--font-urdu)', rtl: true},
  ],
  hoodie: [
    {text: 'हुडी', font: 'var(--font-devanagari)'},
    {text: 'ஹூடி', font: 'var(--font-tamil)'},
    {text: 'హూడీ', font: 'var(--font-telugu)'},
    {text: 'হুডি', font: 'var(--font-bengali)'},
    {text: 'હૂડી', font: 'var(--font-gujarati)'},
    {text: 'ਹੂਡੀ', font: 'var(--font-gurmukhi)'},
    {text: 'ہوڈی', font: 'var(--font-urdu)', rtl: true},
  ],
};

const DEFAULT_TRANSLATIONS = [
  {text: 'वस्त्र', font: 'var(--font-devanagari)'},
  {text: 'ஆடை', font: 'var(--font-tamil)'},
  {text: 'వస్త్రం', font: 'var(--font-telugu)'},
  {text: 'পোশাক', font: 'var(--font-bengali)'},
  {text: 'પહેરવેશ', font: 'var(--font-gujarati)'},
  {text: 'ਪਹਿਰਾਵਾ', font: 'var(--font-gurmukhi)'},
];

function translationsFor(title) {
  const lower = title.toLowerCase();
  const key = Object.keys(TRANSLATIONS).find((k) => lower.includes(k));
  return key ? TRANSLATIONS[key] : DEFAULT_TRANSLATIONS;
}

// Deterministic placeholder tone for products without an image yet.
function placeholderTone(label) {
  const tones = ['bg-[#ECE8E1]', 'bg-[#E3DFD7]', 'bg-[#DAD5CC]'];
  const idx = [...label].reduce((s, c) => s + c.charCodeAt(0), 0) % tones.length;
  return tones[idx];
}

/**
 * @param {{
 *   product: {id: string, handle: string, title: string, featuredImage?: object|null, priceRange: {minVariantPrice: object}},
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductCard({product, loading}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [langIdx, setLangIdx] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);
  const variantUrl = useVariantUrl(product.handle);
  const {title, featuredImage} = product;
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAtPrice && price && Number(compareAtPrice.amount) > Number(price.amount);

  const list = translationsFor(title);

  useEffect(() => {
    if (!hovered) {
      setLangIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setLangIdx((prev) => (prev + 1) % list.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [hovered, list]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({x: e.clientX - rect.left, y: e.clientY - rect.top});
  };

  const activeTranslation = list[langIdx];

  return (
    <Link
      to={variantUrl}
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col w-full select-none cursor-pointer group transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      {onSale && (
        <span className="absolute top-3 left-3 z-30 bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark px-2.5 py-1 rounded-full text-[10px] font-work tracking-wider uppercase font-medium shadow-sm">
          Sale
        </span>
      )}
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-brand-surface-light dark:bg-brand-surface-dark transition-[background-color,box-shadow] duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover:shadow-[0_24px_48px_-12px_rgba(20,16,14,0.22)]">
        {featuredImage ? (
          <Image
            data={featuredImage}
            alt={featuredImage.altText || title}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-[transform,opacity] duration-500 group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div
            className={`w-full h-full ${placeholderTone(title)} dark:bg-zinc-800 flex items-center justify-center transition-colors duration-200`}
          >
            <span className="font-marcellus text-black/10 dark:text-white/5 text-7xl select-none">
              {title[0]}
            </span>
          </div>
        )}

        {/* subtle bottom gradient for legibility if content is ever overlaid */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
              className="absolute inset-0 bg-brand-accent/5 pointer-events-none z-10"
            >
              <motion.div
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                style={{position: 'absolute', left: mousePos.x, top: mousePos.y, x: 12, y: 12}}
                className="bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark px-3 py-1.5 rounded-full text-xs font-medium tracking-tight shadow-lg flex items-center gap-1.5 whitespace-nowrap z-25"
              >
                <span className="opacity-60 text-[9px] font-work tracking-wider uppercase">
                  {title}:
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTranslation.text}
                    initial={{opacity: 0, y: 3}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -3}}
                    transition={{duration: 0.15}}
                    style={{fontFamily: activeTranslation.font}}
                    dir={activeTranslation.rtl ? 'rtl' : 'ltr'}
                  >
                    {activeTranslation.text}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-start pt-4 pb-1 z-20">
        <div className="flex flex-col min-w-0">
          <span className="font-marcellus text-lg text-black dark:text-white tracking-tight truncate">
            {title}
          </span>
          <span className="font-work text-[10px] text-black/50 dark:text-white/40 uppercase tracking-widest mt-0.5">
            UniinX Modern Wear
          </span>
          <span className="text-xs font-marcellus tracking-widest text-brand-accent dark:text-brand-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
            Buy it →
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0 pl-3">
          {onSale && (
            <span className="font-work text-[11px] text-black/35 dark:text-white/30 line-through">
              <Money data={compareAtPrice} />
            </span>
          )}
          <span className={`font-marcellus text-[13px] tracking-widest font-semibold ${onSale ? 'text-red-500 dark:text-red-400' : 'text-brand-accent dark:text-brand-accent-light'}`}>
            <Money data={price} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
