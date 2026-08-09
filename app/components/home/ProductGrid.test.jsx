import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {ProductGrid} from './ProductGrid.jsx';

vi.mock('~/components/motion/Reveal.jsx', () => ({
  Reveal: ({as: Element = 'div', children, ...props}) => <Element {...props}>{children}</Element>,
}));

vi.mock('~/components/ds/index.js', () => ({
  ProductCard: ({product, revealDelay}) => <div data-reveal-delay={revealDelay}>{product.title}</div>,
}));

describe('ProductGrid', () => {
  it('renders a horizontally scrollable new-arrivals rail capped at six products', () => {
    const products = Array.from({length: 8}, (_, index) => ({
      id: `product-${index}`,
      title: `Product ${index + 1}`,
    }));

    render(
      <MemoryRouter>
        <ProductGrid products={products} />
      </MemoryRouter>,
    );

    const rail = screen.getByLabelText('New arrivals');
    expect(rail).toHaveClass('overflow-x-auto', 'snap-x', 'snap-proximity');
    expect(screen.getAllByText(/^Product \d+$/)).toHaveLength(6);
    expect(screen.queryByText('Product 7')).not.toBeInTheDocument();
    expect(screen.getByText('01/06')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toHaveAttribute('data-reveal-delay', '0.06');
  });

  it('converts vertical wheel input to horizontal rail movement', () => {
    const products = Array.from({length: 6}, (_, index) => ({
      id: `product-${index}`,
      title: `Product ${index + 1}`,
    }));
    render(<MemoryRouter><ProductGrid products={products} /></MemoryRouter>);
    const rail = screen.getByLabelText('New arrivals');
    Object.defineProperties(rail, {
      clientWidth: {configurable: true, value: 300},
      scrollWidth: {configurable: true, value: 1200},
    });

    fireEvent.wheel(rail, {deltaY: 450, deltaX: 0});

    expect(rail.scrollLeft).toBe(450);
    expect(screen.getByText('04/06')).toBeInTheDocument();
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

    expect(screen.getByRole('region', {name: 'More like this'})).toBeInTheDocument();
    expect(screen.getByText('MORE LIKE THIS')).toBeInTheDocument();
    expect(screen.getAllByText(/^Related \d+$/)).toHaveLength(8);
    expect(screen.queryByText('Related 9')).not.toBeInTheDocument();
    expect(screen.getByText('01/08')).toBeInTheDocument();
    expect(screen.getAllByRole('link', {name: 'Explore all →'})[0]).toHaveAttribute(
      'href',
      '/collections/all',
    );
  });
});
