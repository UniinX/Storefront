/**
 * @file Cart page — list of real cart lines + order summary.
 * Empty state shows a CTA back to the shop.
 */
import {useNavigate} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {CartItem} from './CartItem.jsx';
import {CartSummary} from './CartSummary.jsx';

const shopButtonStyle = {
  border: 'none', cursor: 'pointer', padding: '12px 24px', lineHeight: 1, minHeight: 44,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--accent-cta)', color: 'var(--paper)', borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-marcellus)', fontSize: 'var(--uniinx-cta-size)', letterSpacing: 'var(--uniinx-tracking-wide)',
};

export function CartPage({cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const navigate = useNavigate();
  const lines = cart?.lines?.nodes ?? [];

  if (lines.length === 0) {
    return (
      <Reveal as="section" style={{padding: '96px var(--space-xl) 140px', textAlign: 'center'}}>
        <h1 style={{fontFamily: 'var(--font-marcellus)', fontSize: 32, color: 'var(--ink)'}}>Your cart is empty</h1>
        <p style={{fontFamily: 'var(--font-work-sans)', color: 'var(--stone)', marginBottom: 32}}>
          Every piece here can be printed in your language.
        </p>
        <button style={shopButtonStyle} onClick={() => navigate('/collections/men')}>Shop New Arrivals →</button>
      </Reveal>
    );
  }

  return (
    <section style={{padding: '40px var(--space-xl) 140px'}}>
      <h1 style={{fontFamily: 'var(--font-marcellus)', fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--ink)', margin: '0 0 32px'}}>
        Your Cart
      </h1>
      <div className="uniinx-cart-layout">
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {lines.map((line) => (
            <CartItem key={line.id} line={line} isLeaving={line.isOptimistic && line.quantity === 0} />
          ))}
        </div>
        <CartSummary cart={cart} />
      </div>
    </section>
  );
}
