/** @file Tests for Header. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header.jsx';

describe('Header', () => {
  it('renders the nav links', () => {
    render(
      <MemoryRouter>
        <Header cart={Promise.resolve(null)} language="english" theme="light" onToggleTheme={() => {}} />
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
        <Header cart={Promise.resolve(null)} language="english" theme="light" onToggleTheme={() => {}} />
      </MemoryRouter>,
    );
    const cartLinks = screen.getAllByText(/Cart/);
    expect(cartLinks.length).toBeGreaterThan(0);
  });
});
