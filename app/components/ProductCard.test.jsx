/** @file Tests for ProductCard. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductCard } from './ProductCard.jsx';

const product = {
  id: 'gid://shopify/Product/1',
  handle: 'test-tshirt',
  title: 'Tshirt',
  featuredImage: null,
  priceRange: { minVariantPrice: { amount: '200', currencyCode: 'INR' } },
};

function renderCard(overrides = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={{ ...product, ...overrides }} />
    </MemoryRouter>,
  );
}

describe('ProductCard', () => {
  it('renders the product title', () => {
    renderCard();
    expect(screen.getAllByText('Tshirt').length).toBeGreaterThan(0);
  });

  it('renders a placeholder glyph when there is no image', () => {
    renderCard();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('links to the product page', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/test-tshirt');
  });

  it('renders the formatted price', () => {
    renderCard();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('shows a sale badge and strikethrough price when compareAtPrice is higher', () => {
    renderCard({
      compareAtPriceRange: { minVariantPrice: { amount: '300', currencyCode: 'INR' } },
    });
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText(/300/)).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('does not show a sale badge when there is no compareAtPrice', () => {
    renderCard();
    expect(screen.queryByText('Sale')).not.toBeInTheDocument();
  });
});
