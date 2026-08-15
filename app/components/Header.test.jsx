/** @file Tests for the responsive storefront header. */
import {describe, expect, it} from 'vitest';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {Header} from './Header.jsx';

const pendingCart = new Promise(() => {});

function renderHeader(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/collections/all']}>
      <Header cart={pendingCart} language="english" {...props} />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('renders the Figma-aligned primary navigation', () => {
    renderHeader();
    expect(document.querySelector('header')).toHaveAttribute(
      'data-header-state',
      'floating',
    );
    expect(screen.getByRole('button', {name: 'Men'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Women'})).toBeInTheDocument();
    expect(
      screen.getByRole('button', {name: 'Collections'}),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Accessories'}),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'New Collection'}),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'More'})).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: /Language/i}),
    ).not.toBeInTheDocument();
  });

  it('links every public content page from the pages menu', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', {name: 'More'}));

    const pages = screen.getByRole('navigation', {name: 'More'});
    expect(pages).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'About'})).toHaveAttribute(
      'href',
      '/pages/about',
    );
    expect(screen.getByRole('link', {name: 'Journal'})).toHaveAttribute(
      'href',
      '/blogs',
    );
    expect(screen.getByRole('link', {name: 'FAQ'})).toHaveAttribute(
      'href',
      '/pages/faq',
    );
    expect(screen.getByRole('link', {name: 'Contact'})).toHaveAttribute(
      'href',
      '/pages/contact',
    );
  });

  it('opens a department mega menu with category shortcuts', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', {name: 'Men'}));

    expect(
      screen.getByRole('navigation', {name: 'Men categories'}),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /Oversized/})).toHaveAttribute(
      'href',
      '/collections/men?type=Oversized',
    );
    expect(screen.getByRole('link', {name: /T-Shirts/})).toBeInTheDocument();
    expect(screen.getByText('Campaign placeholder')).toBeInTheDocument();
  });

  it('opens department categories on pointer hover', () => {
    renderHeader();
    fireEvent.pointerEnter(screen.getByRole('button', {name: 'Women'}));

    expect(
      screen.getByRole('navigation', {name: 'Women categories'}),
    ).toBeInTheDocument();
  });

  it('opens live Shopify collections from the primary navigation', () => {
    renderHeader({
      megaMenuProducts: [
        {
          id: 'product-1',
          handle: 'orbit-tee',
          title: 'Orbit Tee',
          productType: 'T-Shirt',
          tags: ['men'],
          collectionName: {value: 'Antariksham'},
          featuredImage: null,
        },
      ],
    });
    fireEvent.click(screen.getByRole('button', {name: 'Collections'}));

    expect(
      screen.getByRole('navigation', {name: 'Collections menu'}),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Antariksham'})).toHaveAttribute(
      'href',
      '/collections/all?theme=Antariksham',
    );
  });

  it('derives department categories from live product data', () => {
    renderHeader({
      megaMenuProducts: [
        {
          id: 'product-1',
          handle: 'orbit-tee',
          title: 'Orbit Tee',
          productType: 'T-Shirt',
          tags: ['men'],
          collectionName: {value: 'Antariksham'},
          featuredImage: null,
        },
      ],
    });
    fireEvent.click(screen.getByRole('button', {name: 'Men'}));

    expect(screen.getByRole('link', {name: /T-Shirts/})).toHaveAttribute(
      'href',
      '/collections/men?type=T-Shirts',
    );
  });

  it('renders a link to the cart and no dark-mode control', () => {
    renderHeader();
    expect(screen.getByRole('link', {name: 'Cart'})).toHaveAttribute(
      'href',
      '/cart',
    );
    expect(screen.queryByLabelText('Toggle theme')).not.toBeInTheDocument();
  });

  it('sends signed-out customers directly to Shopify Customer Accounts', () => {
    renderHeader();
    const signIn = screen.getByRole('link', {name: 'Sign in'});
    expect(signIn).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Fcollections%2Fall',
    );
  });

  it('opens a viewport-sized mobile menu with search and two-column navigation', async () => {
    renderHeader();
    const menuButton = screen.getByRole('button', {name: 'Open menu'});

    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation');
    fireEvent.click(menuButton);

    const dialog = screen.getByRole('dialog', {name: 'Mobile menu'});
    expect(dialog).toHaveAttribute('id', 'mobile-navigation');
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(dialog).toHaveClass('z-[80]', 'overscroll-contain');
    expect(dialog.querySelector('#mobile-menu-search')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', {name: 'Mobile navigation'}),
    ).toBeInTheDocument();
    expect(screen.queryByText('Language')).not.toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', {name: 'Men'}));
    expect(
      within(dialog).getByRole('link', {name: 'Oversized'}),
    ).toHaveAttribute('href', '/collections/men?type=Oversized');

    fireEvent.click(within(dialog).getByRole('button', {name: 'Collections'}));
    expect(
      within(dialog).getByRole('link', {name: 'View all collections →'}),
    ).toHaveAttribute('href', '/collections');
    expect(
      within(dialog).queryByRole('button', {name: 'Accessories'}),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'Close menu'}));
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', {name: 'Mobile menu'}),
      ).not.toBeInTheDocument();
    });
  });
});
