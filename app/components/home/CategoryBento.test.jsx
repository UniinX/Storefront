import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {CategoryBento} from './CategoryBento.jsx';

describe('CategoryBento', () => {
  it('maps matching Shopify collections into the four bento slots', () => {
    const collections = [
      {id: '1', title: 'Graphic T-Shirts', handle: 'graphic-tees'},
      {id: '2', title: 'Everyday Hoodies', handle: 'hoodies'},
      {id: '3', title: 'Relaxed Joggers', handle: 'joggers'},
      {id: '4', title: 'Oversized T-Shirts', handle: 'oversized-tees'},
    ];

    render(
      <MemoryRouter>
        <CategoryBento collections={collections} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {name: /Shop by Categories/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'T-Shirts collection'}),
    ).toHaveClass(
      'lg:col-span-5',
      'lg:h-[clamp(260px,21.25vw,408px)]',
    );
    expect(
      screen.getByRole('link', {name: /Oversized T-Shirts collection/i}),
    ).toHaveClass('lg:col-span-8');
    expect(screen.getAllByRole('link', {name: /collection$/i})).toHaveLength(4);
  });

  it('renders useful category placeholders when Shopify data is unavailable', () => {
    render(
      <MemoryRouter>
        <CategoryBento collections={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Hoodies')).toBeInTheDocument();
    expect(screen.getByText('Joggers')).toBeInTheDocument();
    expect(screen.getByText('Oversized T-Shirts')).toBeInTheDocument();
    expect(screen.getByAltText('White T-shirt')).toBeInTheDocument();
    expect(screen.getByAltText('Sand-colored pullover hoodie')).toBeInTheDocument();
    expect(screen.getByAltText('Sage green joggers')).toBeInTheDocument();
    expect(screen.getByAltText('Light blue oversized T-shirt')).toBeInTheDocument();
    expect(screen.getAllByText('Browse')).toHaveLength(4);
  });
});
