/** @file Tests for ProductCard. */
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {ProductCard} from './ProductCard.jsx';

const product = {
  id: 'gid://shopify/Product/1',
  handle: 'test-tshirt',
  title: 'Tshirt',
  availableForSale: true,
  featuredImage: null,
  priceRange: {minVariantPrice: {amount: '200', currencyCode: 'INR'}},
};

function renderCard(overrides = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={{...product, ...overrides}} />
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

  it('keeps eager first-row images visible before hydration load events', () => {
    render(
      <MemoryRouter>
        <ProductCard
          loading="eager"
          product={{
            ...product,
            featuredImage: {
              url: 'https://cdn.shopify.com/test-product.jpg',
              width: 800,
              height: 1000,
              altText: 'Test product',
            },
          }}
        />
      </MemoryRouter>,
    );

    const image = screen.getByRole('img', {name: 'Test product'});
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).not.toHaveClass('opacity-0');
    expect(image).toHaveClass(
      'motion-reduce:scale-100',
      'motion-reduce:transition-none',
    );
  });

  it('links to the product page', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/products/test-tshirt',
    );
  });

  it('has no visible outer card chrome', () => {
    renderCard();
    const card = screen.getByTestId('product-card');
    expect(card).toHaveClass('bg-transparent');
    expect(card).not.toHaveClass('border', 'shadow', 'rounded-xl');
  });

  it('uses the neutral fallback while exposing the collection theme hook', () => {
    renderCard({collectionName: {value: 'Antariksham'}});
    const card = screen.getByTestId('product-card');
    const image = screen.getByTestId('product-image-motion');

    expect(card).toHaveAttribute('data-product-collection', 'antariksham');
    expect(image).toHaveStyle({'--product-card-color': '#f0ede7'});
  });

  it('server-renders visible card content without an observer-dependent mask', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(html).toContain('Tshirt');
    expect(html).not.toContain('clip-path:inset(100%');
    expect(html).not.toMatch(/opacity:0(?:;|\")/);
  });

  it('renders the formatted price', () => {
    renderCard();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('shows a sale badge and strikethrough price when compareAtPrice is higher', () => {
    renderCard({
      compareAtPriceRange: {
        minVariantPrice: {amount: '300', currencyCode: 'INR'},
      },
    });
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText(/300/)).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it('does not show a sale badge when there is no compareAtPrice', () => {
    renderCard();
    expect(screen.queryByText('Sale')).not.toBeInTheDocument();
  });

  it('shows a price range and sold-out state', () => {
    renderCard({
      availableForSale: false,
      priceRange: {
        minVariantPrice: {amount: '200', currencyCode: 'INR'},
        maxVariantPrice: {amount: '400', currencyCode: 'INR'},
      },
    });
    expect(screen.getByText('Sold out')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'View Tshirt, sold out'}),
    ).toBeInTheDocument();
  });

  it('keeps product-family choices off the card and exposes one destination', () => {
    renderCard({
      productFamily: {
        reference: {
          __typename: 'Metaobject',
          id: 'family-1',
          products: {
            references: {
              nodes: [
                {
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  availableForSale: true,
                  familyValue: {value: 'Black'},
                },
                {
                  id: 'product-2',
                  handle: 'test-tshirt-blue',
                  title: 'Tshirt Blue',
                  availableForSale: true,
                  familyValue: {value: 'Blue'},
                },
              ],
            },
          },
        },
      },
    });
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', {name: 'View Tshirt'})).toHaveAttribute(
      'href',
      '/products/test-tshirt',
    );
    expect(screen.queryByRole('link', {name: 'Black'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'Blue'})).not.toBeInTheDocument();
  });
});
