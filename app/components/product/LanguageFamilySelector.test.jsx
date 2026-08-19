import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {LanguageFamilySelector} from './LanguageFamilySelector';

const currentProduct = {
  id: 'telugu',
  title: 'Antariksham Telugu',
  handle: 'antariksham-telugu',
  availableForSale: true,
  language: {value: 'Telugu'},
};

describe('LanguageFamilySelector', () => {
  it('renders nothing when there is no language_family metaobject reference (the common case today)', () => {
    const {container} = render(
      <MemoryRouter>
        <LanguageFamilySelector currentProduct={currentProduct} languageFamily={null} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the family has only the current product (no real variants yet)', () => {
    const languageFamily = {
      name: {value: 'Language'},
      products: {references: {nodes: [currentProduct]}},
    };
    const {container} = render(
      <MemoryRouter>
        <LanguageFamilySelector currentProduct={currentProduct} languageFamily={languageFamily} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when a family member is missing a language value, rather than falling back to its title', () => {
    const languageFamily = {
      name: {value: 'Language'},
      products: {
        references: {
          nodes: [
            currentProduct,
            {id: 'hindi', title: 'Antariksham Hindi', handle: 'antariksham-hindi', availableForSale: true, language: null},
          ],
        },
      },
    };
    const {container} = render(
      <MemoryRouter>
        <LanguageFamilySelector currentProduct={currentProduct} languageFamily={languageFamily} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a link per language variant once real data exists, marking the current one and sold-out ones', () => {
    const languageFamily = {
      name: {value: 'Language'},
      products: {
        references: {
          nodes: [
            currentProduct,
            {
              id: 'hindi',
              title: 'Antariksham Hindi',
              handle: 'antariksham-hindi',
              availableForSale: false,
              language: {value: 'Hindi'},
              options: [{name: 'Size', optionValues: [{name: 'M'}]}],
            },
          ],
        },
      },
    };

    render(
      <MemoryRouter initialEntries={['/products/antariksham-telugu?Size=M']}>
        <LanguageFamilySelector currentProduct={currentProduct} languageFamily={languageFamily} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', {name: /Telugu.*selected/i}),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', {name: /Hindi.*sold out/i}),
    ).toHaveAttribute('href', '/products/antariksham-hindi?Size=M');
  });
});
