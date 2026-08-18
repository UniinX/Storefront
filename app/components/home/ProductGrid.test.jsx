import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {ProductGrid} from './ProductGrid.jsx';

vi.mock('~/components/ds/index.js', () => ({
  ProductCard: ({product, revealDelay}) => (
    <div data-reveal-delay={revealDelay}>{product.title}</div>
  ),
}));

describe('ProductGrid', () => {
  it('renders a responsive product grid capped at eight products', () => {
    const products = Array.from({length: 9}, (_, index) => ({
      id: `product-${index}`,
      title: `Product ${index + 1}`,
    }));

    render(
      <MemoryRouter>
        <ProductGrid products={products} />
      </MemoryRouter>,
    );

    const grid = screen.getByRole('grid', {name: 'New arrivals products'});
    expect(grid).toHaveClass('uniinx-product-grid');
    expect(grid).not.toHaveClass('overflow-x-auto');
    expect(screen.getAllByText(/^Product \d+$/)).toHaveLength(8);
    expect(screen.queryByText('Product 9')).not.toBeInTheDocument();
    expect(screen.getByText('Product 2')).toHaveAttribute(
      'data-reveal-delay',
      '0',
    );
  });

  it('supports a reusable related-products presentation', () => {
    const products = Array.from({length: 9}, (_, index) => ({
      id: `related-${index}`,
      title: `Related ${index + 1}`,
    }));

    render(
      <MemoryRouter>
        <ProductGrid
          title="MORE LIKE THIS"
          eyebrow="Continue exploring"
          products={products}
          maxProducts={8}
          ariaLabel="More like this"
          ctaHref="/collections/all"
          ctaLabel="Explore all"
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('region', {name: 'More like this'}),
    ).toBeInTheDocument();
    expect(screen.getByText('MORE LIKE THIS')).toBeInTheDocument();
    expect(screen.getAllByText(/^Related \d+$/)).toHaveLength(8);
    expect(screen.queryByText('Related 9')).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('link', {name: 'Explore all →'})[0],
    ).toHaveAttribute('href', '/collections/all');
  });

  it('uses the compact Figma rhythm only for the homepage grid', () => {
    render(
      <MemoryRouter>
        <ProductGrid
          homeLayout
          products={[{id: 'home-product', title: 'Home Product'}]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('region', {name: 'New arrivals'})).toHaveClass(
      'lg:pt-12',
    );
    expect(screen.getByRole('grid', {name: 'New arrivals products'})).toHaveClass(
      'uniinx-home-product-grid',
      'uniinx-horizontal-scroll',
    );
  });
});
