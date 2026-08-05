/**
 * @file CartSummary — order total panel with checkout CTA.
 */
import {Money} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';

export function CartSummary({cart}) {
  const itemCount = cart?.totalQuantity ?? 0;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <Reveal delay={100} style={{
      borderRadius: 'var(--radius-lg)', background: 'var(--paper-warm)',
      padding: 32, alignSelf: 'flex-start', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{fontFamily: 'var(--font-marcellus)', fontSize: 22, color: 'var(--ink)', marginTop: 0}}>Summary</div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, fontFamily: 'var(--font-work-sans)', color: 'var(--stone)'}}>
        <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        <span>{cart?.cost?.subtotalAmount ? <Money data={cart.cost.subtotalAmount} /> : '-'}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24, fontFamily: 'var(--font-marcellus)', fontSize: 18, color: 'var(--ink)'}}>
        <span>Total</span>
        <span style={{transition: 'opacity 0.2s ease'}}>
          {cart?.cost?.totalAmount ? <Money data={cart.cost.totalAmount} /> : '-'}
        </span>
      </div>
      <div style={{marginTop: 24}}>
        {checkoutUrl ? (
          <a href={checkoutUrl} target="_self" style={{
            display: 'block', width: '100%', textAlign: 'center', border: 'none', cursor: 'pointer',
            padding: '12px 24px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cta)',
            color: 'var(--paper)', fontFamily: 'var(--font-marcellus)', fontSize: 'var(--uniinx-cta-size)',
            letterSpacing: 'var(--uniinx-tracking-wide)',
          }}>
            Checkout →
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}
