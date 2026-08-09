/** @file Tests for CartPage. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CartPage } from './CartPage.jsx';

// useOptimisticCart's useFetchers() call needs a full data router that jsdom
// doesn't reliably provide in isolated component tests — the merge logic
// itself (matching pending fetcher actions against cart lines) has nothing
// to do with what this test checks, so stub it as pass-through.
vi.mock('@shopify/hydrogen', async (importOriginal) => {
  const actual = await importOriginal();
  return {...actual, useOptimisticCart: (cart) => cart};
});

describe('CartPage', () => {
  it('shows the empty state when there are no lines', () => {
    render(
      <MemoryRouter>
        <CartPage cart={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Shop New Arrivals →')).toBeInTheDocument();
  });

  it('shows mutation errors even when the cart is empty', () => {
    render(
      <MemoryRouter>
        <CartPage cart={null} mutationMessages={[{code: 'SOLD_OUT', message: 'This item sold out.'}]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('This item sold out.');
  });
});
