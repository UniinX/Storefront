import {motion, useReducedMotion} from 'framer-motion';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

function placeholderTone(label) {
  const tones = ['bg-[#ece9e2]', 'bg-[#e3e0da]', 'bg-[#d9d5ce]'];
  const index = [...label].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  ) % tones.length;
  return tones[index];
}

const IMAGE_FLY_IN = {
  x: [-96, 0],
  y: [10, 0],
  opacity: [0.45, 1],
  scale: [0.985, 1],
};

const IMAGE_FLY_EASE = [0.16, 1, 0.3, 1];

/**
 * Image-first product card. Family/color navigation intentionally stays on PDP.
 * @param {{
 *   product: object;
 *   loading?: 'eager' | 'lazy';
 *   revealDelay?: number;
 * }}
 */
export function ProductCard({product, loading, revealDelay = 0}) {
  const reduceMotion = useReducedMotion();
  const productUrl = useVariantUrl(product.handle);
  const {title, featuredImage} = product;
  const price = product.priceRange?.minVariantPrice;
  const maxPrice = product.priceRange?.maxVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const onSale = Boolean(
    compareAtPrice && price && Number(compareAtPrice.amount) > Number(price.amount),
  );
  const hasPriceRange = Boolean(
    price && maxPrice && Number(maxPrice.amount) > Number(price.amount),
  );
  const soldOut = product.availableForSale === false;
  const status = soldOut ? 'Sold out' : onSale ? 'Sale' : null;
  const collection = product.collections?.nodes?.[0]?.title || 'UniinX';
  const taxonomy = product.productType || 'Ready to wear';

  return (
    <article
      data-testid="product-card"
      className="group h-full min-w-0 max-w-full bg-transparent text-black"
    >
      <Link
        to={productUrl}
        prefetch="intent"
        aria-label={`View ${title}${soldOut ? ', sold out' : onSale ? ', on sale' : ''}`}
        className="block h-full min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
      >
        <motion.div
          data-testid="product-image-motion"
          className="relative aspect-[4/5] w-full min-w-0 overflow-hidden bg-[#e9e6df]"
          initial={false}
          whileInView={reduceMotion ? undefined : IMAGE_FLY_IN}
          viewport={{once: true, amount: 0.15}}
          transition={{
            duration: 0.72,
            delay: revealDelay,
            ease: IMAGE_FLY_EASE,
          }}
        >
          <div className="absolute -inset-[6px]">
            {featuredImage ? (
              <Image
                data={featuredImage}
                alt={featuredImage.altText || title}
                loading={loading}
                sizes="(min-width: 1200px) 25vw, (min-width: 640px) 42vw, 78vw"
                className="h-full w-full scale-[1.015] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:scale-100 motion-reduce:transition-none"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${placeholderTone(title)}`}>
                <span className="font-marcellus text-8xl text-black/10" aria-hidden="true">
                  {title[0]}
                </span>
              </div>
            )}
          </div>

          {status && (
            <span
              className={`absolute left-3 top-3 z-10 px-2.5 py-1 font-work text-[9px] font-semibold uppercase tracking-[0.16em] ${soldOut ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {status}
            </span>
          )}
        </motion.div>

        <div className="min-w-0 pt-3">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="h-[1.35rem] min-w-0 flex-1 overflow-hidden">
              <div>
                <h3 className="h-[1.35rem] truncate font-marcellus text-[15px] uppercase leading-[1.35rem] tracking-[0.04em]">
                  {title}
                </h3>
              </div>
            </div>

            {price && (
              <div className="flex shrink-0 flex-col items-end font-work">
                {onSale && (
                  <span className="text-[9px] leading-none text-black/40 line-through">
                    <Money data={compareAtPrice} />
                  </span>
                )}
                <span className="whitespace-nowrap text-[12px] font-semibold tracking-[0.04em]">
                  {hasPriceRange && <span className="mr-1 text-[8px] font-normal uppercase text-black/45">From</span>}
                  <Money data={price} />
                </span>
              </div>
            )}
          </div>

          <div className="mt-1.5 flex min-w-0 items-center gap-2 overflow-hidden font-work text-[9px] uppercase tracking-[0.15em] text-black/45">
            <span className="truncate">{collection}</span>
            <span aria-hidden="true" className="shrink-0 text-[10px] leading-none text-brand-accent">•</span>
            <span className="truncate">{taxonomy}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
