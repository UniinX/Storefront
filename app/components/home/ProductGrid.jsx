import {Link} from 'react-router';
import {ProductCard} from '~/components/ds/index.js';
import {Reveal, StaggerContainer, StaggerItem} from '~/components/motion/Reveal.jsx';

function isTamilPriority(product) {
  const title = product?.title?.toLowerCase() ?? '';
  return ['kurta', 'shirt', 'hoodie', 'tee'].some((term) =>
    title.includes(term),
  );
}

export function ProductGrid({
  title = 'New Arrivals',
  eyebrow,
  products,
  language = 'english',
  maxProducts = 8,
  ariaLabel = 'New arrivals',
  ctaHref = '/collections/all?sort=newest',
  ctaLabel = 'Browse all',
  homeLayout = false,
}) {
  if (!products?.length) return null;

  const displayedProducts = (
    language === 'tamil'
      ? [...products].sort(
          (a, b) => Number(isTamilPriority(b)) - Number(isTamilPriority(a)),
        )
      : products
  ).slice(0, maxProducts);

  return (
    <section
      className={`${homeLayout ? 'uniinx-home-gutter' : 'px-5 sm:px-8 lg:px-[60px]'} bg-white ${
        homeLayout
          ? 'py-12 sm:py-12 lg:pb-0 lg:pt-12'
          : 'py-14 sm:py-16 lg:py-20'
      }`}
      aria-label={ariaLabel}
    >
      <div className={homeLayout ? 'w-full' : 'mx-auto max-w-[1320px]'}>
        <Reveal className="mb-7 flex items-end justify-between gap-5">
          <div>
            {eyebrow ? (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#233c6b]">
                {eyebrow}
              </p>
            ) : null}
            <h2
              className={`font-medium leading-none tracking-[-0.04em] ${
                homeLayout
                  ? 'text-[clamp(28px,2.6vw,30px)]'
                  : 'text-[clamp(28px,3vw,40px)]'
              }`}
            >
              {title}
            </h2>
          </div>
          <Link
            to={ctaHref}
            prefetch="intent"
            className="hidden min-h-11 items-center border-b border-black text-sm font-medium sm:inline-flex"
          >
            {ctaLabel} →
          </Link>
        </Reveal>

        <StaggerContainer
          stagger={0.05}
          className={`uniinx-product-grid ${homeLayout ? 'uniinx-home-product-grid uniinx-horizontal-scroll' : ''}`}
          role="grid"
          aria-label={`${ariaLabel} products`}
        >
          {displayedProducts.map((product, index) => (
            <StaggerItem
              key={product.id}
              variant="card"
              className="h-full"
            >
              <ProductCard
                product={product}
                loading={index < 4 ? 'eager' : 'lazy'}
                revealDelay={0}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Link
          to={ctaHref}
          prefetch="intent"
          className="mt-7 inline-flex min-h-11 items-center border-b border-black text-sm font-medium sm:hidden"
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}

export default ProductGrid;
