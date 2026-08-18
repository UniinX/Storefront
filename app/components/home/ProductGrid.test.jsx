/**
 * @file Tests for ProductGrid — reused as-is by RelatedProducts to render
 * Shopify's productRecommendations. The Suspense/Await streaming wrapper in
 * RelatedProducts.jsx is router plumbing verified manually (same approach
 * as the rest of this loader); what's tested here is the part that
 * actually decides what renders: a card per product, nothing when empty.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductGrid } from './ProductGrid.jsx';

const product = (id, title) => ({
  id,
  handle: title.toLowerCase(),
  title,
  featuredImage: null,
  priceRange: { minVariantPrice: { amount: '100', currencyCode: 'INR' } },
});

function renderGrid(products) {
  return render(
    <MemoryRouter>
      <ProductGrid title="You Might Also Like" products={products} />
    </MemoryRouter>,
  );
}

describe('ProductGrid', () => {
  it('renders a card per recommended product', () => {
    renderGrid([product('1', 'Shirt'), product('2', 'Hoodie')]);
    expect(screen.getByText('Shirt')).toBeInTheDocument();
    expect(screen.getByText('Hoodie')).toBeInTheDocument();
  });

  it('renders nothing when there are no recommendations', () => {
    const { container } = renderGrid([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when recommendations is undefined', () => {
    const { container } = renderGrid(undefined);
    expect(container).toBeEmptyDOMElement();
  });
});
