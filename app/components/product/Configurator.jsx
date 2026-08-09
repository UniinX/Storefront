import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {ProductFamilySelector} from '~/components/product/ProductFamilySelector';
import {orderSizeGuideLines, sortSizes} from '~/lib/sizing.js';

// Fallback color swatches helper
const COLOR_MAP = {
  black: '#1a1a1a',
  white: '#f7f4ed',
  gray: '#8a8a86',
  grey: '#8a8a86',
  navy: '#1f2d4a',
  blue: '#3f5a8a',
  red: '#a8433a',
};

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

  const colorName = optionValue.name;
  const normalized = colorName.toLowerCase();
  return {backgroundColor: COLOR_MAP[normalized] || '#cccccc'};
}

export function Configurator({product, selectedVariant, productOptions}) {
  const navigate = useNavigate();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // 1. Extract current product metafield values
  const currentMetafields = {};
  for (const mf of product.metafields ?? []) {
    if (mf) currentMetafields[mf.key] = mf.value;
  }

  const currentType =
    currentMetafields['garment_type'] || product.productType || 'T-Shirt';
  const currentFit = currentMetafields['fit'] || 'Regular Fit';
  const material =
    currentMetafields.material ||
    product.description ||
    'See product description for materials and care.';
  const sizeGuide =
    currentMetafields.size_guide ||
    'See the selected variant measurements before ordering.';

  const designStory =
    currentMetafields['design_story'] ||
    'A linguistic template exploring typographic forms.';
  const family =
    product.productFamily?.reference?.__typename === 'Metaobject'
      ? product.productFamily.reference
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

  return (
    <div className="flex flex-col gap-7 font-work text-black w-full rounded-[28px] border border-black/[0.07] bg-white/90 p-6 sm:p-8 shadow-[0_24px_70px_-46px_rgba(46,28,18,0.45)] backdrop-blur-sm">
      {/* Product Title and Price */}
      <div>
        <span className="font-work text-[10px] tracking-[0.25em] text-black/55 uppercase block mb-2">
          {currentFit} · {currentType}
        </span>
        <h1 className="font-marcellus text-3xl sm:text-4xl uppercase tracking-[0.06em] font-light leading-[1.05]">
          {product.title}
        </h1>
        {product.description ? (
          <p className="font-work text-xs leading-relaxed text-black/50 mt-4 line-clamp-3">
            {product.description}
          </p>
        ) : null}
        <div className="flex items-end justify-between gap-4 mt-5">
          <div className="flex items-baseline gap-3 font-marcellus text-xl tracking-wider">
            {onSale && (
              <span className="text-xs text-black/40 line-through">
                <Money data={selectedVariant.compareAtPrice} />
              </span>
            )}
            <span
              className={onSale ? 'text-red-500' : 'text-brand-accent'}
            >
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : null}
            </span>
          </div>
          <span
            className={`font-work text-[9px] tracking-[0.14em] uppercase ${
              selectedVariant?.availableForSale ? 'text-emerald-700' : 'text-red-600'
            }`}
            aria-live="polite"
          >
            {selectedVariant?.availableForSale ? 'In stock' : 'Sold out'}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-black/[0.07]" />

      {/* Product family and Shopify variant controls */}
      <div className="flex flex-col gap-6">
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
            <div className="flex gap-3">
              {colorOption.optionValues.map((val) => {
                const active = activeColor === val.name;
                return (
                  <button
                    disabled={!val.exists}
                    key={val.name}
                    type="button"
                    onClick={() => {
                      navigate(`?${val.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                    className={`w-8 h-8 rounded-full border relative flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                      active
                        ? 'ring-2 ring-black dark:ring-white border-transparent'
                        : 'border-black/10 dark:border-white/10'
                    }`}
                    style={getColorSwatchStyle(val)}
                    title={val.name}
                    aria-pressed={active}
                  >
                    <span className="sr-only">{val.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
                aria-expanded={sizeGuideOpen}
                aria-controls="product-size-guide"
                onClick={() => setSizeGuideOpen((open) => !open)}
                className="text-[10px] tracking-wide text-brand-accent underline underline-offset-4 font-medium cursor-pointer"
              >
                Sizing Guide
              </button>
            </div>
            {sizeGuideOpen && (
              <SizeGuide
                id="product-size-guide"
                content={orderedSizeGuide}
              />
            )}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {orderedSizeValues.map((val) => {
                const active = activeSize === val.name;
                return (
                  <button
                    disabled={!val.exists}
                    key={val.name}
                    type="button"
                    onClick={() => {
                      navigate(`?${val.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                    className={`min-h-12 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer font-medium disabled:cursor-not-allowed disabled:opacity-30 ${
                      active
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'border-black/10 bg-white hover:border-black/35 hover:bg-black/[0.02]'
                    }`}
                    aria-pressed={active}
                  >
                    {val.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add To Cart */}
      <div className="flex flex-col gap-2 mt-4">
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
          className="w-full py-4 bg-brand-accent text-brand-bg-light rounded-full font-work text-[10px] tracking-[0.16em] uppercase font-semibold hover:opacity-95 transition-all cursor-pointer flex items-center justify-center shadow-[0_12px_30px_-16px_rgba(100,38,32,0.8)]"
        >
          {selectedVariant?.availableForSale ? 'Add to Cart →' : 'Out of Stock'}
        </AddToCartButton>
      </div>

      {/* Accordions details */}
      <div className="flex flex-col border-t border-black/5 dark:border-white/5 pt-4 mt-6">
        <Accordion title="Design Story" content={designStory} />
        <Accordion title="Product Details" content={material} />
        <Accordion title="Size & Fit" content={orderedSizeGuide} preserveLines />
        <Accordion
          title="Delivery & Returns"
          content="Delivery estimates and return eligibility are shown at checkout and in the store policies."
        />
      </div>
    </div>
  );
}

function SizeGuide({content, id}) {
  const lines = orderSizeGuideLines(content);

  return (
    <div
      id={id}
      className="rounded-2xl border border-black/[0.07] bg-[#faf7f0] p-4"
      role="region"
      aria-label="Sizing guide"
    >
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
            disabled={!value.exists}
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

function Accordion({title, content, preserveLines = false}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/5 dark:border-white/5 py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-marcellus text-xs uppercase tracking-wider text-left text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white cursor-pointer"
      >
        <span>{title}</span>
        <span className="font-mono text-[10px]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className={`mt-2 text-xs text-black/50 dark:text-white/40 font-work font-light leading-relaxed animate-fade-in ${preserveLines ? 'whitespace-pre-line' : ''}`}>
          {content}
        </div>
      )}
    </div>
  );
}
