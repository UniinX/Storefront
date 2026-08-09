import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router';
import {Configurator} from './Configurator';

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
        variantUriQuery: 'Color=Black',
      },
      {
        name: 'White',
        selected: false,
        exists: true,
        variantUriQuery: 'Color=White',
      },
    ],
  },
  {
    name: 'Size',
    optionValues: [
      {name: 'XL', selected: false, exists: true, variantUriQuery: 'Size=XL'},
      {name: 'S', selected: false, exists: true, variantUriQuery: 'Size=S'},
      {name: 'L', selected: false, exists: true, variantUriQuery: 'Size=L'},
      {name: 'M', selected: true, exists: true, variantUriQuery: 'Size=M'},
    ],
  },
];

const mockLanguage = {
  id: 'en',
  label: 'English',
  native: 'English',
  font: 'work-sans',
};

function renderConfigurator() {
  return render(
    <MemoryRouter>
      <Configurator
        product={mockProduct}
        selectedVariant={mockVariant}
        productOptions={mockOptions}
        activeLanguage={mockLanguage}
        setLanguageId={vi.fn()}
      />
    </MemoryRouter>,
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

  it('renders accordions correctly', () => {
    renderConfigurator();
    expect(screen.getByText('Design Story')).toBeInTheDocument();
  });

  it('opens the sizing guide from its control', async () => {
    const user = userEvent.setup();
    renderConfigurator();

    await user.click(screen.getByRole('button', {name: 'Sizing Guide'}));
    expect(
      screen.getByRole('region', {name: 'Sizing guide'}),
    ).toHaveTextContent('Chest: measure around the fullest point.');
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
