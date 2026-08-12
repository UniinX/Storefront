/**
 * @file Cart page — list of real cart lines + order summary.
 * Empty state shows a CTA back to the shop.
 */
import {useNavigate} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {CartItem} from './CartItem.jsx';
import {CartSummary} from './CartSummary.jsx';

export function CartPage({
  cart: originalCart,
  mutationMessages = [],
  testMode = false,
}) {
  const cart = useOptimisticCart(originalCart);
  const navigate = useNavigate();
  const lines = cart?.lines?.nodes ?? [];

  if (lines.length === 0) {
    return (
      <Reveal
        as="section"
        className="mx-auto max-w-[1320px] px-5 pb-32 pt-24 text-center sm:px-8 lg:px-[60px]"
      >
        <CartMutationMessages messages={mutationMessages} />
        <h1 className="text-[clamp(38px,5vw,62px)] font-normal leading-none tracking-[-0.05em]">
          Your cart is empty
        </h1>
        <p className="mb-8 mt-4 text-sm text-black/55">
          Every piece here can be printed in your language.
        </p>
        <button
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-black px-7 text-sm font-semibold text-white"
          onClick={() => navigate('/collections/all')}
        >
          Shop New Arrivals →
        </button>
      </Reveal>
    );
  }

  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-32 pt-14 sm:px-8 lg:px-[60px] lg:pt-16">
      <h1 className="mb-10 text-[clamp(40px,5vw,68px)] font-normal leading-none tracking-[-0.055em]">
        Your Cart
      </h1>
      <CartMutationMessages messages={mutationMessages} />
      <div className="uniinx-cart-layout">
        <div className="flex min-w-0 flex-col gap-4">
          {lines.map((line) => (
            <CartItem
              key={line.id}
              line={line}
              isLeaving={line.isOptimistic && line.quantity === 0}
            />
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
    <div
      role="alert"
      className="mb-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-400"
    >
      {messages.map((message, index) => (
        <div key={message?.code || index}>
          {message?.message || String(message)}
        </div>
      ))}
    </div>
  );
}
