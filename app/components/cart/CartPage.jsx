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

export function CartPage({cart: originalCart, mutationMessages = [], testMode = false}) {
  const cart = useOptimisticCart(originalCart);
  const navigate = useNavigate();
  const lines = cart?.lines?.nodes ?? [];

  if (lines.length === 0) {
    return (
      <Reveal as="section" style={{padding: '96px var(--space-xl) 140px', textAlign: 'center'}}>
        <CartMutationMessages messages={mutationMessages} />
        <h1 style={{fontFamily: 'var(--font-marcellus)', fontSize: 32, color: 'var(--ink)'}}>Your cart is empty</h1>
        <p style={{fontFamily: 'var(--font-work-sans)', color: 'var(--stone)', marginBottom: 32}}>
          Every piece here can be printed in your language.
        </p>
        <button style={shopButtonStyle} onClick={() => navigate('/collections/all')}>Shop New Arrivals →</button>
      </Reveal>
    );
  }

  return (
    <section style={{padding: '40px var(--space-xl) 140px'}}>
      <h1 style={{fontFamily: 'var(--font-marcellus)', fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--ink)', margin: '0 0 32px'}}>
        Your Cart
      </h1>
      <CartMutationMessages messages={mutationMessages} />
      <div className="uniinx-cart-layout">
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {lines.map((line) => (
            <CartItem key={line.id} line={line} isLeaving={line.isOptimistic && line.quantity === 0} />
          ))}
        </div>
        <CartSummary cart={cart} testMode={testMode} />
      </div>
    </section>
  );
}

function CartMutationMessages({messages}) {
  if (!messages.length) return null;
  return (
    <div role="alert" className="mb-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-400">
      {messages.map((message, index) => (
        <div key={message?.code || index}>{message?.message || String(message)}</div>
      ))}
    </div>
  );
}
