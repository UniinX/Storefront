/** @file Tests for CartSummary. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartSummary } from './CartSummary.jsx';

const cart = {
  totalQuantity: 2,
  checkoutUrl: 'https://example.myshopify.com/checkout',
  cost: {
    subtotalAmount: {amount: '400.00', currencyCode: 'INR'},
    totalAmount: {amount: '400.00', currencyCode: 'INR'},
  },
};

describe('CartSummary', () => {
  it('shows the item count and totals', () => {
    render(<CartSummary cart={cart} />);
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getAllByText(/400/).length).toBeGreaterThan(0);
  });

  it('links to the real Shopify checkout URL', () => {
    render(<CartSummary cart={cart} />);
    expect(screen.getByText('Checkout →')).toHaveAttribute('href', cart.checkoutUrl);
  });

  it('omits the checkout link when there is no checkoutUrl', () => {
    render(<CartSummary cart={{...cart, checkoutUrl: undefined}} />);
    expect(screen.queryByText('Checkout →')).not.toBeInTheDocument();
  });
});
