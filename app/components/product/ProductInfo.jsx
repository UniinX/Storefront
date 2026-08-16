/**
 * @file Product configurator panel — numbered steps (Type → Language →
 * Color → Size) built from real Shopify variant options, plus price and
 * buy CTA. Desktop shows the full panel inline and sticky; mobile shows a
 * BottomSheet trigger for the option steps.
 */
import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {LanguageChipSelector} from '~/components/product/LanguageChipSelector.jsx';
import {BottomSheet} from '~/components/ui/bottom-sheet.jsx';
import {AddToCartButton} from '~/components/AddToCartButton';

const buyButtonStyle = {
  border: 'none',
  cursor: 'pointer',
  padding: '14px 24px',
  lineHeight: 1,
  width: '100%',
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.15s ease',
  background: 'var(--accent-cta)',
  color: 'var(--paper)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-marcellus)',
  fontSize: 'var(--uniinx-cta-size)',
  letterSpacing: 'var(--uniinx-tracking-wide)',
};

const stepEyebrow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontFamily: 'var(--font-work-sans)',
  fontSize: 'var(--uniinx-cta-size)',
  letterSpacing: 'var(--uniinx-tracking-tight)',
  color: 'var(--ink)',
  marginBottom: 14,
};

const stepNumberStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: '50%',
  border: '1px solid var(--mist)',
  fontSize: 11,
  color: 'var(--stone)',
  flexShrink: 0,
};

/**
 * Buckets a product's real Storefront-API options by name so the panel can
 * render Size as a size grid, Color as swatches, and anything else
 * (Style/Type/Material) as a generic "type" step — without hardcoding which
 * options a product has.
 * @param {Array<{name: string}>} productOptions
 */
export function categorizeOptions(productOptions) {
  const visible = productOptions.filter((o) => o.optionValues.length > 1);
  const isSize = (name) => /size/i.test(name);
  const isColor = (name) => /colou?r/i.test(name);
  return {
    typeOptions: visible.filter((o) => !isSize(o.name) && !isColor(o.name)),
    colorOption: visible.find((o) => isColor(o.name)) ?? null,
    sizeOption: visible.find((o) => isSize(o.name)) ?? null,
  };
}

function StepHeading({number, label}) {
  return (
    <div style={stepEyebrow}>
      <span style={stepNumberStyle}>{number}</span>
      {label.toUpperCase()}
    </div>
  );
}

function OptionChips({option}) {
  return (
    <div
      role="radiogroup"
      aria-label={option.name}
      style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}
    >
      {option.optionValues.map((value) => (
        <OptionChip key={option.name + value.name} value={value} />
      ))}
    </div>
  );
}

function OptionChip({value}) {
  const navigate = useNavigate();
  const {
    name,
    handle,
    variantUriQuery,
    selected,
    available,
    isDifferentProduct,
  } = value;
  const style = {
    minHeight: 44,
    minWidth: 44,
    padding: '10px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    border: `1px solid ${selected ? 'var(--ink)' : 'var(--mist)'}`,
    borderRadius: 'var(--radius-md)',
    cursor: available ? 'pointer' : 'not-allowed',
    fontFamily: 'var(--font-work-sans)',
    fontSize: 14,
    background: selected ? 'var(--ink)' : 'var(--paper)',
    color: selected ? 'var(--paper)' : 'var(--ink)',
    opacity: available ? 1 : 0.35,
    transition: 'background 0.15s ease, border-color 0.15s ease',
  };

  if (isDifferentProduct) {
    return (
      <Link
        style={style}
        to={`/products/${handle}?${variantUriQuery}`}
        prefetch="intent"
        replace
      >
        {name}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      style={style}
      disabled={!value.exists}
      onClick={() => {
        if (!selected)
          navigate(`?${variantUriQuery}`, {
            replace: true,
            preventScrollReset: true,
          });
      }}
    >
      {name}
    </button>
  );
}

function ColorSwatches({option}) {
  return (
    <div
      role="radiogroup"
      aria-label={option.name}
      style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}
    >
      {option.optionValues.map((value) => (
        <ColorSwatch key={option.name + value.name} value={value} />
      ))}
    </div>
  );
}

// Real stores populate `swatch.color`/`swatch.image` on each option value,
// but that data is optional in the Storefront API and mock.shop leaves it
// null for every product — without a fallback, every color option renders
// as the same flat gray circle. This best-effort name→color map only kicks
// in when the real swatch data is absent.
export const NAMED_COLOR_FALLBACKS = {
  green: '#3f6b4a',
  olive: '#6b6b47',
  ocean: '#3f6b82',
  purple: '#6b4f8a',
  red: '#a8433a',
  blue: '#3f5a8a',
  black: '#1a1a1a',
  white: '#ffffff',
  gray: '#8a8a86',
  grey: '#8a8a86',
  navy: '#1f2d4a',
  pink: '#c98a9e',
  yellow: '#c9a63f',
  orange: '#c97a3f',
  brown: '#6b4a35',
  beige: '#c9b896',
  maroon: '#6b2e3a',
  teal: '#3f8a82',
  cream: '#efe6d3',
};

function fallbackColorFor(name) {
  const key = Object.keys(NAMED_COLOR_FALLBACKS).find((k) =>
    name.toLowerCase().includes(k),
  );
  return key ? NAMED_COLOR_FALLBACKS[key] : 'var(--mist)';
}

function ColorSwatch({value}) {
  const navigate = useNavigate();
  const {
    name,
    handle,
    variantUriQuery,
    selected,
    available,
    isDifferentProduct,
    swatch,
  } = value;
  const fill = swatch?.image?.previewImage?.url
    ? `url(${swatch.image.previewImage.url})`
    : swatch?.color || fallbackColorFor(name);

  const swatchCircle = (
    <span
      style={{
        display: 'block',
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: fill.startsWith('url') ? undefined : fill,
        backgroundImage: fill.startsWith('url') ? fill : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: selected
          ? '0 0 0 2px var(--paper), 0 0 0 3.5px var(--ink)'
          : 'inset 0 0 0 1px rgba(0,0,0,0.12)',
        opacity: available ? 1 : 0.3,
      }}
    />
  );

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: available ? 'pointer' : 'not-allowed',
    minWidth: 44,
  };
  const labelStyle = {
    fontFamily: 'var(--font-work-sans)',
    fontSize: 10,
    color: 'var(--stone)',
    textAlign: 'center',
  };

  if (isDifferentProduct) {
    return (
      <Link
        to={`/products/${handle}?${variantUriQuery}`}
        prefetch="intent"
        replace
        style={wrapperStyle}
        aria-label={name}
      >
        {swatchCircle}
        <span style={labelStyle}>{name}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      disabled={!value.exists}
      style={{...wrapperStyle, background: 'none', border: 'none'}}
      onClick={() => {
        if (!selected)
          navigate(`?${variantUriQuery}`, {
            replace: true,
            preventScrollReset: true,
          });
      }}
    >
      {swatchCircle}
      <span style={labelStyle}>{name}</span>
    </button>
  );
}

export function ProductInfo({
  product,
  selectedVariant,
  productOptions,
  languageId,
  setLanguageId,
  activeLanguage,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const {typeOptions, colorOption, sizeOption} =
    categorizeOptions(productOptions);
  const onSale =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount);
  let step = 0;

  const Steps = (
    <>
      {typeOptions.map((option) => (
        <div key={option.name} style={{marginTop: 28}}>
          <StepHeading
            number={String(++step).padStart(2, '0')}
            label={option.name}
          />
          <OptionChips option={option} />
        </div>
      ))}
      <div style={{marginTop: 28}}>
        <StepHeading
          number={String(++step).padStart(2, '0')}
          label="Language"
        />
        <LanguageChipSelector value={languageId} onChange={setLanguageId} />
        <p
          style={{
            marginTop: 10,
            fontFamily: 'var(--font-work-sans)',
            fontSize: 12,
            color: 'var(--stone)',
          }}
        >
          The print redraws itself in your chosen script — the design itself
          can't be edited.
        </p>
      </div>
      {colorOption && (
        <div style={{marginTop: 28}}>
          <StepHeading
            number={String(++step).padStart(2, '0')}
            label={colorOption.name}
          />
          <ColorSwatches option={colorOption} />
        </div>
      )}
      {sizeOption && (
        <div style={{marginTop: 28}}>
          <StepHeading
            number={String(++step).padStart(2, '0')}
            label={sizeOption.name}
          />
          <OptionChips option={sizeOption} />
        </div>
      )}
    </>
  );

  return (
    <div
      className="lg:sticky lg:top-[120px] lg:self-start"
      style={{maxWidth: 460}}
    >
      <div
        style={{
          fontFamily: 'var(--font-work-sans)',
          fontSize: 12,
          letterSpacing: 'var(--uniinx-tracking-wide)',
          color: 'var(--stone)',
          textTransform: 'uppercase',
        }}
      >
        Customize your own
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-marcellus)',
          fontSize: 40,
          lineHeight: 1.05,
          letterSpacing: 'var(--uniinx-tracking-tight)',
          color: 'var(--ink)',
          margin: '8px 0 0',
        }}
      >
        {product.title}
      </h1>
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          fontFamily: 'var(--font-marcellus)',
          fontSize: 20,
          letterSpacing: 'var(--uniinx-tracking-wide)',
        }}
      >
        {onSale && (
          <span
            style={{
              fontSize: 15,
              color: 'var(--stone)',
              textDecoration: 'line-through',
            }}
          >
            <Money data={selectedVariant.compareAtPrice} />
          </span>
        )}
        <span style={{color: onSale ? '#e0483e' : 'var(--accent-cta)'}}>
          {selectedVariant?.price ? (
            <Money data={selectedVariant.price} />
          ) : null}
        </span>
      </div>

      <div
        className="uniinx-hide-mobile"
        style={{
          marginTop: 8,
          borderTop: '1px solid var(--mist)',
          paddingTop: 8,
        }}
      >
        {Steps}
        <div style={{marginTop: 40}}>
          <AddToCartButton
            style={buyButtonStyle}
            disabled={!selectedVariant || !selectedVariant.availableForSale}
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
          >
            {selectedVariant?.availableForSale ? 'Add to Cart →' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>
      <button
        className="uniinx-hide-desktop"
        onClick={() => setSheetOpen(true)}
        style={{
          marginTop: 24,
          minHeight: 44,
          width: '100%',
          padding: '12px 20px',
          border: '1px solid var(--mist)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--paper)',
          fontFamily: 'var(--font-work-sans)',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        Customize · {activeLanguage?.label}, {selectedVariant?.title} →
      </button>
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Customize"
      >
        {Steps}
      </BottomSheet>
    </div>
  );
}
