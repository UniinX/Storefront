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
});
