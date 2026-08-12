/**
 * @file CartSummary — order total panel with checkout CTA.
 */
import {Money} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';

export function CartSummary({cart, testMode = false}) {
  const itemCount = cart?.totalQuantity ?? 0;
  const checkoutUrl = cart?.checkoutUrl;
  const applicableDiscounts = (cart?.discountCodes ?? []).filter(
    ({applicable}) => applicable,
  );

  return (
    <Reveal
      delay={100}
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--paper-warm)',
        padding: 28,
        alignSelf: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--mist)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--ink)',
          marginTop: 0,
        }}
      >
        Summary
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
          fontFamily: 'var(--font-work-sans)',
          color: 'var(--stone)',
        }}
      >
        <span>
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
        <span>
          {cart?.cost?.subtotalAmount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      {applicableDiscounts.length > 0 && (
        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-work-sans)',
            fontSize: 12,
            color: 'var(--stone)',
          }}
        >
          Discount{applicableDiscounts.length > 1 ? 's' : ''}:{' '}
          {applicableDiscounts.map(({code}) => code).join(', ')}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
          fontFamily: 'var(--font-inter)',
          fontWeight: 600,
          fontSize: 18,
          color: 'var(--ink)',
        }}
      >
        <span>Total</span>
        <span style={{transition: 'opacity 0.2s ease'}}>
          {cart?.cost?.totalAmount ? (
            <Money data={cart.cost.totalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      <p
        style={{
          margin: '10px 0 0',
          fontFamily: 'var(--font-work-sans)',
          fontSize: 11,
          color: 'var(--stone)',
        }}
      >
        Shipping and final taxes are calculated at checkout.
      </p>
      {testMode && (
        <div
          role="status"
          style={{
            marginTop: 18,
            padding: '12px 14px',
            border:
              '1px solid color-mix(in srgb, var(--accent-festive) 45%, transparent)',
            borderRadius: 'var(--radius-sm)',
            background:
              'color-mix(in srgb, var(--accent-festive) 10%, transparent)',
            color: 'var(--ink)',
            fontFamily: 'var(--font-work-sans)',
            fontSize: 11,
            lineHeight: 1.55,
          }}
        >
          <strong
            style={{
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: 9,
            }}
          >
            Shopify test checkout
          </strong>
          This order uses Shopify’s configured test payment method. Do not enter
          a real card.
        </div>
      )}
      <div style={{marginTop: 24}}>
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_self"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              padding: '15px 24px',
              borderRadius: '999px',
              background: 'var(--accent-cta)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: 'var(--uniinx-cta-size)',
            }}
          >
            {testMode ? 'Test checkout →' : 'Checkout →'}
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}
