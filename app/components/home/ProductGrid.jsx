import {useRef, useState} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {Link} from 'react-router';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {ProductCard} from '~/components/ds/index.js';

function isTamilPriority(product) {
  const title = product?.title?.toLowerCase() ?? '';
  return ['kurta', 'shirt', 'hoodie', 'tee'].some((term) => title.includes(term));
}

/**
 * @param {{
 *   title?: string;
 *   eyebrow?: string;
 *   products: Array;
 *   language?: string;
 *   maxProducts?: number;
 *   ariaLabel?: string;
 *   ctaHref?: string;
 *   ctaLabel?: string;
 * }}
 */
export function ProductGrid({
  title = 'NEW ARRIVALS',
  eyebrow = 'Just landed',
  products,
  language = 'english',
  maxProducts = 6,
  ariaLabel = 'New arrivals',
  ctaHref = '/collections/all?sort=newest',
  ctaLabel = 'Shop all',
}) {
  const railRef = useRef(null);
  const dragRef = useRef({active: false, startX: 0, scrollLeft: 0, moved: false});
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (!products?.length) return null;

  const displayedProducts = (language === 'tamil'
    ? [...products].sort((a, b) => Number(isTamilPriority(b)) - Number(isTamilPriority(a)))
    : products
  ).slice(0, maxProducts);

  const updateProgress = (rail) => {
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const progress = maxScroll ? rail.scrollLeft / maxScroll : 0;
    setCurrentIndex(Math.min(displayedProducts.length - 1, Math.max(0, Math.round(progress * (displayedProducts.length - 1)))));
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    event.currentTarget.scrollLeft += event.deltaY;
    updateProgress(event.currentTarget);
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.moved = true;
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
    updateProgress(event.currentTarget);
  };

  const finishDrag = (event) => {
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const preventDraggedClick = (event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    dragRef.current.moved = false;
  };

  const count = displayedProducts.length;
  const countLabel = `${String(currentIndex + 1).padStart(2, '0')}/${String(count).padStart(2, '0')}`;

  return (
    <section className="overflow-hidden bg-brand-bg-light py-16">
      <div className="px-6 md:px-14">
        <div className="mb-10 h-px w-full bg-black/10" />
        <div className="mb-9 flex items-end justify-between gap-6">
          <Reveal>
            <span className="font-work text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
              {eyebrow}
            </span>
            <h2 className="mt-1 font-marcellus text-[clamp(28px,4vw,42px)] font-light uppercase leading-none tracking-tight text-black">
              {title}
            </h2>
          </Reveal>
          <Link
            to={ctaHref}
            prefetch="intent"
            className="hidden font-work text-[10px] uppercase tracking-[0.16em] text-black/55 transition-colors hover:text-brand-accent sm:inline-flex"
          >
            {ctaLabel} →
          </Link>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex cursor-grab touch-pan-x select-none gap-5 overflow-x-auto px-6 pb-5 [scrollbar-width:none] active:cursor-grabbing md:gap-7 md:px-14 [&::-webkit-scrollbar]:hidden snap-x snap-proximity"
        aria-label={ariaLabel}
        role="region"
        onScroll={(event) => updateProgress(event.currentTarget)}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={preventDraggedClick}
      >
        {displayedProducts.map((product, index) => (
          <div
            key={product.id}
            className="w-[82vw] max-w-[390px] shrink-0 snap-start sm:w-[44vw] lg:w-[29vw] xl:w-[24vw]"
          >
            <ProductCard
              product={product}
              loading={index < 3 ? 'eager' : 'lazy'}
              revealDelay={reduceMotion ? 0 : index * 0.06}
            />
          </div>
        ))}
        <div aria-hidden="true" className="w-px shrink-0 md:w-7" />
      </div>

      <div className="mt-3 flex items-center gap-4 px-6 md:px-14">
        <span className="w-12 shrink-0 font-work text-[10px] tabular-nums tracking-[0.18em] text-black/55" aria-live="polite">
          {countLabel}
        </span>
        <div className="h-px flex-1 overflow-hidden bg-black/15" aria-hidden="true">
          <motion.div
            className="h-full origin-left bg-black"
            animate={{scaleX: (currentIndex + 1) / count}}
            transition={reduceMotion ? {duration: 0} : {duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
          />
        </div>
        <span className="hidden font-work text-[9px] uppercase tracking-[0.14em] text-black/35 sm:inline">
          Drag / scroll
        </span>
      </div>

      <Link
        to={ctaHref}
        prefetch="intent"
        className="mx-6 mt-6 inline-flex font-work text-[10px] uppercase tracking-[0.16em] text-black/55 sm:hidden"
      >
        {ctaLabel} →
      </Link>
    </section>
  );
}

export default ProductGrid;
