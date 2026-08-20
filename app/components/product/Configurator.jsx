import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {ProductFamilySelector} from '~/components/product/ProductFamilySelector';
import {LanguageFamilySelector} from '~/components/product/LanguageFamilySelector';
import {getMetafieldMap, isNewProduct} from '~/lib/productDisplay.js';
import {resolveColorHex} from '~/lib/colorSwatch.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '~/components/ui/sheet.jsx';
import {orderSizeGuideLines, sortSizes} from '~/lib/sizing.js';
import {useWishlist} from '~/context/WishlistContext.jsx';

function getColorSwatchStyle(optionValue) {
  const swatchImage = optionValue.swatch?.image?.previewImage?.url;
  if (swatchImage) {
    return {
      backgroundImage: `url("${swatchImage}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  if (optionValue.swatch?.color) {
    return {backgroundColor: optionValue.swatch.color};
  }

  return {backgroundColor: resolveColorHex(optionValue.name) || '#cccccc'};
}

/**
 * The purchase card that floats over the hero gallery. Keeps only what a
 * shopper needs to decide and buy (identity, price, variant pickers, CTA);
 * fuller content (design story, fabric, care, size chart) lives below the
 * hero in `ProductDetails` so the card stays compact over the photography.
 */
export function Configurator({product, selectedVariant, productOptions}) {
  const navigate = useNavigate();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const {isInWishlist, toggleWishlist} = useWishlist();
  const isSaved = isInWishlist(product?.id);

  const currentMetafields = getMetafieldMap(product.metafields);
  const currentType =
    currentMetafields['garment_type'] || product.productType || 'T-Shirt';
  const currentFit = currentMetafields['fit'] || 'Regular Fit';
  const sizeGuide =
    currentMetafields.size_guide ||
    'See the selected variant measurements before ordering.';
  const family =
    product.productFamily?.reference?.__typename === 'Metaobject'
      ? product.productFamily.reference
      : null;
  const languageFamily =
    product.languageFamily?.reference?.__typename === 'Metaobject'
      ? product.languageFamily.reference
      : null;

  // Color belongs to Product Family when the family reference is configured.
  // Legacy products can still use Shopify's native Color variant option.
  const colorOption = productOptions.find((o) => /colou?r/i.test(o.name));
  const sizeOption = productOptions.find((o) => /size/i.test(o.name));
  const otherOptions = productOptions.filter(
    (option) => !/colou?r/i.test(option.name) && !/size/i.test(option.name),
  );

  // Current selections are already reactive: `productOptions` re-derives from
  // `selectedVariant` (via Hydrogen's useOptimisticVariant) on every URL change,
  // so activeColor/activeSize track the URL without any local state needed.
  const activeColor =
    colorOption?.optionValues?.find((v) => v.selected)?.name || '';
  const activeSize =
    sizeOption?.optionValues?.find((v) => v.selected)?.name || '';
  const orderedSizeValues = sortSizes(
    sizeOption?.optionValues ?? [],
    (value) => value.name,
  );
  const orderedSizeGuide = orderSizeGuideLines(sizeGuide).join('\n');

  const onSale =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount);
  const isNew = isNewProduct(product.tags);

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-black/10 bg-white/85 p-5 text-black shadow-[var(--shadow-floating)] backdrop-blur-md sm:p-6 lg:rounded-3xl lg:p-7">
      {/* Product Title, Price, and Wishlist */}
      <div>
        <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          {currentFit} · {currentType}
          {isNew && (
            <span
              style={{
                padding: '2px 8px',
                border: '1px solid var(--accent-cta)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--accent-cta)',
                fontSize: 10,
                letterSpacing: 'var(--uniinx-tracking-wide)',
              }}
            >
              NEW
            </span>
          )}
        </span>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[clamp(26px,2.6vw,38px)] font-normal leading-[1.02] tracking-[-0.03em]">
            {product.title}
          </h1>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={
              isSaved
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all hover:scale-105 active:scale-95 ${
              isSaved
                ? 'border-black bg-black text-white'
                : 'border-black/15 bg-white text-black hover:border-black'
            }`}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z" />
            </svg>
          </button>
        </div>
        <div className="flex items-end justify-between gap-4 mt-4">
          <div className="flex items-baseline gap-3 text-lg font-medium">
            {onSale && (
              <span className="text-xs text-black/40 line-through">
                <Money data={selectedVariant.compareAtPrice} />
              </span>
            )}
            <span className={onSale ? 'text-destructive' : 'text-black'}>
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : null}
            </span>
          </div>
          <span
            className={`font-work text-[9px] tracking-[0.14em] uppercase ${
              selectedVariant?.availableForSale
                ? 'text-emerald-700'
                : 'text-red-600'
            }`}
            aria-live="polite"
          >
            {selectedVariant?.availableForSale ? 'In stock' : 'Sold out'}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-black/[0.07]" />

      {/* Product family and Shopify variant controls */}
      <div className="flex flex-col gap-5">
        {family && (
          <ProductFamilySelector currentProduct={product} family={family} />
        )}

        {!family && colorOption && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold flex items-center gap-1.5">
              Color:{' '}
              <span className="text-black/55 dark:text-white/40 normal-case font-normal ml-1">
                {activeColor}
              </span>
            </span>
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
              {colorOption.optionValues.map((val) => {
                const active = activeColor === val.name;
                const unavailable = !val.exists || !val.available;
                return (
                  <button
                    disabled={unavailable}
                    key={val.name}
                    type="button"
                    onClick={() => {
                      navigate(`?${val.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                    className={`relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                      active
                        ? 'ring-2 ring-black dark:ring-white border-transparent'
                        : 'border-black/10 dark:border-white/10'
                    }`}
                    style={getColorSwatchStyle(val)}
                    title={unavailable ? `${val.name} — Sold out` : val.name}
                    aria-pressed={active}
                  >
                    <span className="sr-only">
                      {val.name}
                      {unavailable ? ' — Sold out' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {languageFamily && (
          <LanguageFamilySelector
            currentProduct={product}
            languageFamily={languageFamily}
          />
        )}

        {otherOptions.map((option) => (
          <VariantOption
            key={option.name}
            option={option}
            navigate={navigate}
          />
        ))}

        {sizeOption && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold flex items-center gap-1.5">
                Size
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex min-h-11 cursor-pointer items-center text-[10px] font-medium tracking-wide text-brand-accent underline underline-offset-4"
              >
                Sizing Guide
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {orderedSizeValues.map((val) => {
                const active = activeSize === val.name;
                const unavailable = !val.exists || !val.available;
                return (
                  <button
                    disabled={unavailable}
                    key={val.name}
                    type="button"
                    onClick={() => {
                      navigate(`?${val.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                    className={`flex min-h-12 cursor-pointer items-center justify-center rounded-[8px] border text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                      active
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'border-black/10 bg-white hover:border-black/35 hover:bg-black/[0.02]'
                    }`}
                    title={unavailable ? `${val.name} — Sold out` : undefined}
                    aria-pressed={active}
                  >
                    {val.name}
                    {unavailable && <span className="sr-only"> — Sold out</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <SizeGuideSheet open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)}>
        <SizeGuide content={orderedSizeGuide} />
      </SizeGuideSheet>

      {/* Add To Cart */}
      <AddToCartButton
        disabled={
          !selectedVariant ||
          !selectedVariant.availableForSale ||
          (Boolean(sizeOption) && !activeSize) ||
          (Boolean(colorOption) && !family && !activeColor)
        }
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
        className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-full bg-black px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85"
      >
        {selectedVariant?.availableForSale ? 'Add to Cart →' : 'Out of Stock'}
      </AddToCartButton>
    </div>
  );
}

// A bottom sheet on mobile (matching the rest of the site's sheet pattern),
// but a centered dialog on larger screens — a bottom-anchored sheet reads as
// broken on a tall desktop viewport when its content is this short.
function SizeGuideSheet({open, onClose, children}) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose?.()}>
      <SheetContent
        className="inset-x-0 bottom-0 max-h-[82dvh] rounded-t-2xl border-x-0 border-b-0 p-5 pb-[max(2rem,env(safe-area-inset-bottom))] lg:inset-x-auto lg:inset-y-auto lg:left-1/2 lg:top-1/2 lg:max-h-[70vh] lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:border lg:p-6"
      >
        <div
          className="mx-auto mb-4 h-1 w-9 rounded-full bg-muted lg:hidden"
          aria-hidden="true"
        />
        <div className="mb-5 flex items-center justify-between gap-4">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Size Guide
          </SheetTitle>
          <SheetClose
            type="button"
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-xl leading-none transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            ×
          </SheetClose>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
}

function SizeGuide({content}) {
  const lines = orderSizeGuideLines(content);

  return (
    <div>
      <p className="font-work text-[9px] tracking-[0.14em] uppercase text-black/40 mb-3">
        Garment measurements · follow the listed unit
      </p>
      <pre className="font-mono text-[11px] leading-6 text-black/65 overflow-x-auto whitespace-pre min-w-max">
        {lines.join('\n')}
      </pre>
    </div>
  );
}

function VariantOption({option, navigate}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
        {option.name}
      </span>
      <div className="flex flex-wrap gap-2">
        {option.optionValues.map((value) => (
          <button
            key={value.name}
            type="button"
            disabled={!value.exists || !value.available}
            aria-pressed={Boolean(value.selected)}
            onClick={() =>
              navigate(`?${value.variantUriQuery}`, {
                replace: true,
                preventScrollReset: true,
              })
            }
            className={`min-h-11 px-4 border text-xs transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
              value.selected
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'border-black/10 dark:border-white/10 hover:border-black/25'
            }`}
          >
            {value.name}
          </button>
        ))}
      </div>
    </div>
  );
}
