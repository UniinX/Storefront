import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {DepartmentBand} from './DepartmentBand.jsx';

vi.mock('~/components/motion/Reveal.jsx', () => ({
  Reveal: ({as: Element = 'div', children, ...props}) => (
    <Element {...props}>{children}</Element>
  ),
  MOTION_EASE: [0.16, 0.84, 0.32, 1],
}));

describe('DepartmentBand', () => {
  it('uses matching Shopify collections as destinations for editorial cards', () => {
    render(
      <MemoryRouter>
        <DepartmentBand
          collections={[
            {
              id: 'gid://shopify/Collection/1',
              title: 'Solid Essentials',
              handle: 'solid-essentials',
              products: {nodes: []},
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', {name: /Shop Solids/i}),
    ).toHaveAttribute('href', '/collections/solid-essentials');
    expect(screen.getByText('Shop Antariksham')).toBeInTheDocument();
  });

  it('uses the supplied editorial assets when collection context is not ready', () => {
    render(
      <MemoryRouter>
        <DepartmentBand collections={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Shop Solids')).toBeInTheDocument();
    expect(screen.getByText('Shop Antariksham')).toBeInTheDocument();
    expect(
      screen.getByAltText('Close-up of a solid white T-shirt'),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Front and back views of the Antariksham hoodie'),
    ).toBeInTheDocument();
  });
});
