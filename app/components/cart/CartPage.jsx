import {Suspense} from 'react';
import {Await, useNavigate} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {ProductGrid} from '~/components/home/ProductGrid.jsx';
import {ProductGridSkeleton} from '~/components/ds/index.js';
import {CartItem} from './CartItem.jsx';
import {CartSummary} from './CartSummary.jsx';

export function CartPage({
  cart: originalCart,
  mutationMessages = [],
  recommendedProducts,
  testMode = false,
}) {
  const cart = useOptimisticCart(originalCart);
  const navigate = useNavigate();
  const lines = cart?.lines?.nodes ?? [];

  if (lines.length === 0) {
    return (
      <div className="pb-16 pt-6 lg:pt-10">
        <section className="mx-auto max-w-[1320px] px-5 py-12 text-center sm:px-8 lg:px-[60px] lg:py-16">
          <CartMutationMessages messages={mutationMessages} />
          <Reveal className="flex flex-col items-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full border border-black/[0.06] bg-[#f4f2ee] text-black/70 shadow-sm">
              <svg
                className="size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
              Shopping Bag
            </span>
            <h1 className="text-[clamp(34px,4.5vw,56px)] font-normal leading-none tracking-[-0.05em]">
              Your cart is empty
            </h1>
            <p className="mt-3.5 max-w-md text-sm leading-6 text-black/60 sm:text-base">
              Every piece here can be printed in your language. Explore current
              themes, everyday silhouettes, and washed layers.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate('/collections/all')}
            >
              Shop New Arrivals →
            </button>
          </Reveal>
        </section>

        {recommendedProducts && (
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <Await resolve={recommendedProducts}>
              {(response) => {
                const products = response?.products?.nodes ?? [];
                if (!products.length) return null;
                return (
                  <ProductGrid
                    title="POPULAR ESSENTIALS"
                    eyebrow="Handpicked for your wardrobe"
                    products={products}
                    maxProducts={8}
                    ariaLabel="Popular essentials"
                    ctaHref="/collections/all"
                    ctaLabel="View catalog"
                  />
                );
              }}
            </Await>
          </Suspense>
        )}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-24 pt-10 sm:px-8 lg:px-[60px] lg:pt-14">
      <div className="mb-8 flex items-baseline justify-between border-b border-black/10 pb-6">
        <h1 className="text-[clamp(36px,4.5vw,60px)] font-normal leading-none tracking-[-0.055em]">
          Your Cart
        </h1>
        <span className="text-xs font-semibold uppercase tracking-wider text-black/40">
          {lines.length} {lines.length === 1 ? 'item' : 'items'}
        </span>
      </div>

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

      {recommendedProducts && (
        <div className="mt-20">
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <Await resolve={recommendedProducts}>
              {(response) => {
                const products = response?.products?.nodes ?? [];
                if (!products.length) return null;
                return (
                  <ProductGrid
                    title="YOU MIGHT ALSO LIKE"
                    eyebrow="Complete your look"
                    products={products}
                    maxProducts={8}
                    ariaLabel="You might also like"
                    ctaHref="/collections/all"
                    ctaLabel="View catalog"
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      )}
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
