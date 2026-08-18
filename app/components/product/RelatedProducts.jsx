/**
 * @file "You Might Also Like" — streams in Shopify's real
 * productRecommendations for the current product, deferred so it never
 * blocks the PDP's first paint. Renders nothing while pending, on a failed
 * fetch (the loader resolves that to []), or when Shopify has no
 * recommendations for this product.
 */
import {Suspense} from 'react';
import {Await} from 'react-router';
import {ProductGrid} from '~/components/home/ProductGrid.jsx';

export function RelatedProducts({recommendations}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={recommendations} errorElement={null}>
        {(products) => <ProductGrid title="You Might Also Like" products={products} />}
      </Await>
    </Suspense>
  );
}
