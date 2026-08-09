import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {DepartmentBand} from './DepartmentBand.jsx';

vi.mock('~/components/motion/Reveal.jsx', () => ({
  Reveal: ({as: Element = 'div', children, ...props}) => <Element {...props}>{children}</Element>,
}));

describe('DepartmentBand', () => {
  it('renders collection content supplied by Shopify', () => {
    render(
      <MemoryRouter>
        <DepartmentBand collections={[{
          id: 'gid://shopify/Collection/1',
          title: 'Monsoon Scripts',
          handle: 'monsoon-scripts',
          description: 'An Indian monsoon-inspired edit.',
          products: {nodes: []},
        }]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', {name: /Monsoon Scripts/i})).toHaveAttribute(
      'href',
      '/collections/monsoon-scripts',
    );
    expect(screen.getByText('An Indian monsoon-inspired edit.')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /^All Collections/i})).toHaveAttribute(
      'href',
      '/collections/all',
    );
  });

  it('does not render placeholder collections when Shopify returns none', () => {
    const {container} = render(
      <MemoryRouter>
        <DepartmentBand collections={[]} />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
