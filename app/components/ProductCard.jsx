import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {
  getProductCollectionName,
  normalizeCollectionName,
  resolveProductCardColor,
} from '~/lib/productCardTheme';

/**
 * Image-first product card. Family/color navigation intentionally stays on PDP.
 * @param {{
 *   product: object;
 *   loading?: 'eager' | 'lazy';
 *   revealDelay?: number;
 * }}
 */
export function ProductCard({product, loading, revealDelay = 0}) {
  const productUrl = useVariantUrl(product.handle);
  const {title, featuredImage} = product;
  const price = product.priceRange?.minVariantPrice;
  const maxPrice = product.priceRange?.maxVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const onSale = Boolean(
    compareAtPrice &&
    price &&
    Number(compareAtPrice.amount) > Number(price.amount),
  );
  const hasPriceRange = Boolean(
    price && maxPrice && Number(maxPrice.amount) > Number(price.amount),
  );
  const soldOut = product.availableForSale === false;
  const status = soldOut ? 'Sold out' : onSale ? 'Sale' : null;
  const collectionName = getProductCollectionName(product);
  const collectionKey = normalizeCollectionName(collectionName);
  const cardColor = resolveProductCardColor(product);

  return (
    <article
      data-testid="product-card"
      data-product-collection={collectionKey || undefined}
      data-product-card-color-source={
        collectionKey ? 'collection-fallback' : 'default-fallback'
      }
      className="group h-full min-w-0 max-w-full bg-transparent text-black"
    >
      <Link
        to={productUrl}
        prefetch="intent"
        aria-label={`View ${title}${soldOut ? ', sold out' : onSale ? ', on sale' : ''}`}
        className="block h-full min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
      >
        <div
          data-testid="product-image-motion"
          className="relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-[14px] bg-[var(--product-card-color)]"
          style={{
            '--product-card-color': cardColor,
            '--product-card-delay': `${revealDelay}s`,
          }}
        >
          <div className="absolute inset-0 p-3 sm:p-4">
            {featuredImage ? (
              <Image
                data={featuredImage}
                alt={featuredImage.altText || title}
                loading={loading}
                sizes="(min-width: 1200px) 25vw, (min-width: 640px) 42vw, 78vw"
                className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:scale-100 motion-reduce:transition-none"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10">
                <span
                  className="font-work text-7xl font-medium text-black/15"
                  aria-hidden="true"
                >
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

          <span
            className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/90 text-black"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z" />
            </svg>
          </span>
        </div>

        <div className="min-w-0 pt-3">
          <div className="min-w-0 font-work">
            <h3 className="truncate text-[13px] font-medium leading-5 sm:text-[15px]">
              {title}
            </h3>
            {price && (
              <div className="mt-0.5 flex items-baseline gap-2 text-[12px] sm:text-[13px]">
                {hasPriceRange && (
                  <span className="text-[9px] uppercase text-black/45">
                    From
                  </span>
                )}
                <span
                  className={
                    onSale ? 'font-semibold text-[#b52d2d]' : 'font-medium'
                  }
                >
                  <Money data={price} />
                </span>
                {onSale && (
                  <span className="text-[10px] text-black/40 line-through">
                    <Money data={compareAtPrice} />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
