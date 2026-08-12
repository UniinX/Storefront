/** @file Tests for the responsive storefront header. */
import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
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
      'full',
    );
    expect(screen.getByRole('button', {name: /Shop/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Collections'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Pages'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Language/i})).toBeInTheDocument();
  });

  it('opens a full shop mega menu with editorial shortcuts', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', {name: /Shop/i}));

    expect(
      screen.getByRole('navigation', {name: 'Shop shortcuts'}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'New Arrivals'}),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Shop All'})).toBeInTheDocument();
    expect(screen.getByText('Campaign placeholder')).toBeInTheDocument();
  });

  it('derives mega-menu themes from custom.collection_name', () => {
    renderHeader({
      megaMenuProducts: [
        {
          id: 'product-1',
          handle: 'orbit-tee',
          title: 'Orbit Tee',
          collectionName: {value: 'Antariksham'},
          featuredImage: null,
        },
      ],
    });
    fireEvent.click(screen.getByRole('button', {name: /Shop/i}));

    expect(screen.getByRole('link', {name: 'Antariksham'})).toHaveAttribute(
      'href',
      '/collections/all?theme=Antariksham',
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
    expect(dialog).toHaveClass('z-[80]', 'overscroll-contain');
    expect(
      dialog.querySelector('#mobile-menu-search'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', {name: 'Mobile navigation'}),
    ).toHaveClass('grid-cols-2');
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', {name: 'Close menu'}));
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', {name: 'Mobile menu'}),
      ).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
