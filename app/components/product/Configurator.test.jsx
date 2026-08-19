import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router';
import {Configurator} from './Configurator';
import {resolveColorHex} from '~/lib/colorSwatch.js';

// Mock AddToCartButton to prevent useFetcher rendering requirements in tests
vi.mock('~/components/AddToCartButton', () => ({
  AddToCartButton: ({children, className, disabled}) => (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  ),
}));

const mockProduct = {
  id: 'gid://shopify/Product/1',
  title: 'Just Grow Hoodie',
  handle: 'just-grow-hoodie',
  productType: 'Hoodie',
  familyColor: {value: 'Black'},
  productFamily: {
    reference: {
      __typename: 'Metaobject',
      name: {value: 'Just Grow colors'},
      products: {
        references: {
          nodes: [
            {
              id: 'gid://shopify/Product/1',
              title: 'Just Grow Hoodie',
              handle: 'just-grow-hoodie',
              availableForSale: true,
              familyColor: {value: 'Black'},
              options: [{name: 'Size', optionValues: [{name: 'M'}]}],
            },
            {
              id: 'gid://shopify/Product/2',
              title: 'Just Grow Hoodie White',
              handle: 'just-grow-hoodie-white',
              availableForSale: true,
              familyColor: {value: 'White'},
              options: [{name: 'Size', optionValues: [{name: 'M'}]}],
            },
          ],
        },
      },
    },
  },
  metafields: [
    {key: 'garment_type', value: 'Hoodie'},
    {key: 'fit', value: 'Regular Fit'},
    {key: 'language', value: 'English'},
    {key: 'design_story', value: 'Linguistic stardust story...'},
    {key: 'size_guide', value: 'Chest: measure around the fullest point.'},
  ],
};

const mockVariant = {
  id: 'gid://shopify/ProductVariant/1',
  availableForSale: true,
  price: {amount: '1499', currencyCode: 'INR'},
  compareAtPrice: {amount: '1999', currencyCode: 'INR'},
  title: 'Black / M',
};

const mockOptions = [
  {
    name: 'Color',
    optionValues: [
      {
        name: 'Black',
        selected: true,
        exists: true,
        available: true,
        variantUriQuery: 'Color=Black',
      },
      {
        name: 'White',
        selected: false,
        exists: true,
        available: true,
        variantUriQuery: 'Color=White',
      },
    ],
  },
  {
    name: 'Size',
    optionValues: [
      {name: 'XL', selected: false, exists: true, available: true, variantUriQuery: 'Size=XL'},
      {name: 'S', selected: false, exists: true, available: true, variantUriQuery: 'Size=S'},
      {name: 'L', selected: false, exists: true, available: true, variantUriQuery: 'Size=L'},
      {name: 'M', selected: true, exists: true, available: true, variantUriQuery: 'Size=M'},
    ],
  },
];

const mockLanguage = {
  id: 'en',
  label: 'English',
  native: 'English',
  font: 'work-sans',
};

import {WishlistProvider} from '~/context/WishlistContext.jsx';

function renderConfigurator() {
  return render(
    <WishlistProvider>
      <MemoryRouter>
        <Configurator
          product={mockProduct}
          selectedVariant={mockVariant}
          productOptions={mockOptions}
          activeLanguage={mockLanguage}
          setLanguageId={vi.fn()}
        />
      </MemoryRouter>
    </WishlistProvider>,
  );
}

describe('2D Configurator Panel', () => {
  it('renders title, fit and garment type', () => {
    renderConfigurator();
    expect(screen.getByText('Just Grow Hoodie')).toBeInTheDocument();
    expect(screen.getByText('Regular Fit · Hoodie')).toBeInTheDocument();
  });

  it('renders Product Family members as accessible product links', () => {
    renderConfigurator();
    expect(
      screen.getByRole('link', {name: /Black.*selected/i}),
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', {name: 'White'})).toHaveAttribute(
      'href',
      '/products/just-grow-hoodie-white',
    );
  });

  it('opens the sizing guide as a dialog from its control', async () => {
    const user = userEvent.setup();
    renderConfigurator();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', {name: 'Sizing Guide'}));
    expect(
      screen.getByRole('dialog', {name: 'Size Guide'}),
    ).toHaveTextContent('Chest: measure around the fullest point.');
  });

  it('disables a size that exists on the product but is currently sold out', () => {
    render(
      <WishlistProvider>
        <MemoryRouter>
          <Configurator
            product={mockProduct}
            selectedVariant={mockVariant}
            productOptions={[
              mockOptions[0],
              {
                name: 'Size',
                optionValues: mockOptions[1].optionValues.map((value) =>
                  value.name === 'L' ? {...value, available: false} : {...value, available: true},
                ),
              },
            ]}
            activeLanguage={mockLanguage}
            setLanguageId={vi.fn()}
          />
        </MemoryRouter>
      </WishlistProvider>,
    );

    expect(screen.getByRole('button', {name: /^L/})).toBeDisabled();
    expect(screen.getByRole('button', {name: /^M/})).not.toBeDisabled();
  });

  it('renders Shopify size values in standard garment order', () => {
    renderConfigurator();
    const sizeButtons = screen
      .getAllByRole('button')
      .map((button) => button.textContent)
      .filter((label) => ['S', 'M', 'L', 'XL'].includes(label));

    expect(sizeButtons).toEqual(['S', 'M', 'L', 'XL']);
  });
});

describe('color swatch fallback', () => {
  it('renders the "white" fallback swatch as true white, not off-white', () => {
    expect(resolveColorHex('white')).toBe('#ffffff');
  });
});

describe('NEW badge', () => {
  function renderWithTags(tags) {
    return render(
      <WishlistProvider>
        <MemoryRouter>
          <Configurator
            product={{...mockProduct, tags}}
            selectedVariant={mockVariant}
            productOptions={mockOptions}
            activeLanguage={mockLanguage}
            setLanguageId={vi.fn()}
          />
        </MemoryRouter>
      </WishlistProvider>,
    );
  }

  it('shows a NEW badge when the product has a "new" tag', () => {
    renderWithTags(['New']);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('hides the NEW badge when the product has no "new" tag', () => {
    renderWithTags(['Summer']);
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });
});

describe('product description', () => {
  it('does not render the description in the floating card — it lives in ProductDetails below the hero instead', () => {
    render(
      <WishlistProvider>
        <MemoryRouter>
          <Configurator
            product={{
              ...mockProduct,
              description: 'A soft cotton hoodie for everyday wear.',
              descriptionHtml: '<p>A soft cotton hoodie for everyday wear.</p>',
            }}
            selectedVariant={mockVariant}
            productOptions={mockOptions}
            activeLanguage={mockLanguage}
            setLanguageId={vi.fn()}
          />
        </MemoryRouter>
      </WishlistProvider>,
    );
    expect(
      screen.queryByText('A soft cotton hoodie for everyday wear.'),
    ).not.toBeInTheDocument();
  });
});

describe('color swatches', () => {
  it('lets the color row scroll horizontally instead of wrapping, and rounds the swatches', () => {
    const {container} = render(
      <WishlistProvider>
        <MemoryRouter>
          <Configurator
            product={{...mockProduct, productFamily: undefined}}
            selectedVariant={mockVariant}
            productOptions={mockOptions}
            activeLanguage={mockLanguage}
            setLanguageId={vi.fn()}
          />
        </MemoryRouter>
      </WishlistProvider>,
    );

    const row = container.querySelector('.overflow-x-auto');
    expect(row).toBeInTheDocument();
    const swatch = screen.getByRole('button', {name: 'Black'});
    expect(swatch).toHaveClass('rounded-2xl', 'shrink-0');
  });
});
