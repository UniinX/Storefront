import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {
  getCompatibleOptionSearch,
  ProductFamilySelector,
} from './ProductFamilySelector';

describe('ProductFamilySelector', () => {
  it('preserves only option values supported by the destination product', () => {
    expect(
      getCompatibleOptionSearch('?Size=M&Color=Black&utm_source=test', [
        {name: 'Size', optionValues: [{name: 'M'}]},
        {name: 'Color', optionValues: [{name: 'White'}]},
      ]),
    ).toBe('?Size=M');
  });

  it('links family choices and marks the current product', () => {
    const currentProduct = {
      id: 'current',
      title: 'Black shirt',
      handle: 'black-shirt',
      availableForSale: true,
      familyColor: {value: 'Black'},
    };
    const family = {
      name: {value: 'Color'},
      products: {
        references: {
          nodes: [
            currentProduct,
            {
              id: 'white',
              title: 'White shirt',
              handle: 'white-shirt',
              availableForSale: false,
              familyColor: {value: 'White'},
              options: [{name: 'Size', optionValues: [{name: 'M'}]}],
            },
          ],
        },
      },
    };

    render(
      <MemoryRouter
        initialEntries={['/products/black-shirt?Size=M&Color=Black']}
      >
        <ProductFamilySelector
          currentProduct={currentProduct}
          family={family}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', {name: /Black.*selected/i}),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', {name: /White.*sold out/i}),
    ).toHaveAttribute('href', '/products/white-shirt?Size=M');
  });

  it('renders a solid color block instead of the product photo when there is no real swatch', () => {
    const currentProduct = {
      id: 'current',
      title: 'Regular tee',
      handle: 'brick-red-tee',
      availableForSale: true,
      familyColor: {value: 'Brick Red'},
      featuredImage: {id: 'img-1', url: 'https://cdn.example.com/brick-red.jpg'},
    };
    const family = {
      name: {value: 'Color'},
      products: {
        references: {
          nodes: [
            currentProduct,
            {
              id: 'navy',
              title: 'Navy tee',
              handle: 'navy-tee',
              availableForSale: true,
              familyColor: {value: 'Navy Blue'},
              featuredImage: {id: 'img-2', url: 'https://cdn.example.com/navy.jpg'},
              options: [{name: 'Size', optionValues: [{name: 'M'}]}],
            },
          ],
        },
      },
    };

    render(
      <MemoryRouter initialEntries={['/products/brick-red-tee']}>
        <ProductFamilySelector currentProduct={currentProduct} family={family} />
      </MemoryRouter>,
    );

    // No <img> for the product photo — the swatch is a solid color block.
    expect(document.querySelector('img')).not.toBeInTheDocument();
    const navyLink = screen.getByRole('link', {name: 'Navy Blue'});
    expect(navyLink.querySelector('span[style]')).toHaveStyle({
      backgroundColor: '#1f2d4a',
    });
  });
});
