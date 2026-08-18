import {act, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {AddToCartButton} from './AddToCartButton.jsx';

const state = vi.hoisted(() => ({
  fetcher: {state: 'idle', data: undefined},
}));

vi.mock('@shopify/hydrogen', () => ({
  CartForm: Object.assign(({children}) => children(state.fetcher), {
    ACTIONS: {LinesAdd: 'LinesAdd'},
  }),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({children}) => children,
  motion: {
    span: ({children}) => <span>{children}</span>,
  },
  useReducedMotion: () => false,
}));

describe('AddToCartButton', () => {
  beforeEach(() => {
    vi.useRealTimers();
    state.fetcher = {state: 'idle', data: undefined};
  });

  it('disables and labels the button while a submission is pending', () => {
    state.fetcher = {state: 'submitting', data: undefined};
    render(
      <AddToCartButton lines={[]} disabled={false}>
        Add to cart
      </AddToCartButton>,
    );
    expect(screen.getByRole('button', {name: 'Adding…'})).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Adding item to cart');
  });

  it('honors an explicitly disabled product state', () => {
    render(
      <AddToCartButton lines={[]} disabled>
        Sold out
      </AddToCartButton>,
    );
    expect(screen.getByRole('button', {name: 'Sold out'})).toBeDisabled();
  });

  it('shows a brief confirmation and invokes onAdded after a successful add', () => {
    vi.useFakeTimers();
    const onAdded = vi.fn();
    const button = () => (
      <AddToCartButton lines={[]} onAdded={onAdded}>
        Add to cart
      </AddToCartButton>
    );
    const {rerender} = render(button());

    state.fetcher = {state: 'submitting', data: undefined};
    rerender(button());
    expect(screen.getByRole('button', {name: 'Adding…'})).toBeDisabled();

    const cart = {id: 'gid://shopify/Cart/1'};
    state.fetcher = {state: 'idle', data: {cart, errors: []}};
    rerender(button());

    expect(screen.getByRole('button', {name: 'Added ✓'})).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Item added to cart');
    expect(onAdded).toHaveBeenCalledExactlyOnceWith(cart);

    act(() => vi.advanceTimersByTime(1800));
    expect(screen.getByRole('button', {name: 'Add to cart'})).toBeEnabled();
  });

  it('recovers with an actionable label after Shopify rejects the add', () => {
    const button = () => (
      <AddToCartButton lines={[]}>Add to cart</AddToCartButton>
    );
    const {rerender} = render(button());

    state.fetcher = {state: 'submitting', data: undefined};
    rerender(button());
    state.fetcher = {
      state: 'idle',
      data: {cart: null, errors: [{message: 'Sold out'}]},
    };
    rerender(button());

    expect(
      screen.getByRole('button', {name: 'Couldn’t add — try again'}),
    ).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Item could not be added to cart',
    );
  });
});
