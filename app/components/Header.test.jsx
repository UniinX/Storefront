/** @file Tests for Header. */
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {vi} from 'vitest';
import { MemoryRouter } from 'react-router';
import { Header } from './Header.jsx';

describe('Header', () => {
  it('renders the nav links', () => {
    render(
      <MemoryRouter>
        <Header cart={Promise.resolve(null)} language="english" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Men')).toBeInTheDocument();
    expect(screen.getByText('Women')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
  });

  it('renders a link to the cart', () => {
    render(
      <MemoryRouter>
        <Header cart={Promise.resolve(null)} language="english" />
      </MemoryRouter>,
    );
    const cartLinks = screen.getAllByText(/Cart/);
    expect(cartLinks.length).toBeGreaterThan(0);
  });

  it('does not render a dark mode control', () => {
    render(
      <MemoryRouter>
        <Header cart={Promise.resolve(null)} language="english" />
      </MemoryRouter>,
    );
    expect(screen.queryByLabelText('Toggle theme')).not.toBeInTheDocument();
  });

  it('opens modal-first sign in while retaining the customer-account route fallback', () => {
    const onSignIn = vi.fn();
    render(
      <MemoryRouter initialEntries={['/collections/all']}>
        <Header cart={Promise.resolve(null)} language="english" onSignIn={onSignIn} />
      </MemoryRouter>,
    );
    const signIn = screen.getByRole('link', {name: 'Sign in'});
    expect(signIn).toHaveAttribute('href', '/account/login?return_to=%2Fcollections%2Fall');
    fireEvent.click(signIn);
    expect(onSignIn).toHaveBeenCalledWith('/collections/all');
  });
});
