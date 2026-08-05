/**
 * @file Sticky mobile buy bar — visible only on mobile screens.
 * Shows the current configuration summary + price and a full-width buy CTA.
 */
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';

const buyButtonStyle = {
  border: 'none', cursor: 'pointer', padding: '12px 24px', lineHeight: 1, minHeight: 44,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--accent-cta)', color: 'var(--paper)',
  borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-marcellus)',
  fontSize: 'var(--uniinx-cta-size)', letterSpacing: 'var(--uniinx-tracking-wide)',
};

export function MobileBuyBar({selectedVariant, language}) {
  const summary = [selectedVariant?.title, language?.label].filter(Boolean).join(' · ');
  return (
    <div className="uniinx-hide-desktop uniinx-sticky-buy">
      <div style={{minWidth: 0}}>
        <div style={{fontFamily: 'var(--font-marcellus)', fontSize: 18, color: 'var(--accent-cta)'}}>
          {selectedVariant?.price ? <Money data={selectedVariant.price} /> : null}
        </div>
        <div style={{fontFamily: 'var(--font-work-sans)', fontSize: 12, color: 'var(--stone)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{summary}</div>
      </div>
      <AddToCartButton
        style={buyButtonStyle}
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}] : []}
      >
        {selectedVariant?.availableForSale ? 'Add to Cart →' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
