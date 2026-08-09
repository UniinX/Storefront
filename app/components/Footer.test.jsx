import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {Footer} from './Footer.jsx';

vi.mock('~/components/motion/Reveal.jsx', () => ({
  Reveal: ({as: Element = 'div', children, ...props}) => <Element {...props}>{children}</Element>,
}));

describe('Footer', () => {
  it('provides storefront, support, order, refund, and legal navigation', () => {
    render(
      <MemoryRouter>
        <Footer language="english" onLanguageChange={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', {name: 'All products'})).toHaveAttribute('href', '/collections/all');
    expect(screen.getByRole('link', {name: 'Support'})).toHaveAttribute('href', '/account/support');
    expect(screen.getByRole('link', {name: 'Orders'})).toHaveAttribute('href', '/account/orders');
    expect(screen.getByRole('link', {name: 'Returns & refunds'})).toHaveAttribute(
      'href',
      '/account/support?category=Refund%20or%20Cancellation',
    );
    expect(screen.getByRole('link', {name: 'Privacy policy'})).toHaveAttribute('href', '/policies/privacy-policy');
  });

  it('uses Indian brand language', () => {
    render(
      <MemoryRouter>
        <Footer language="english" onLanguageChange={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Rooted in Indian language, craft & culture/i)).toBeInTheDocument();
    expect(screen.queryByText(/Scandinavian/i)).not.toBeInTheDocument();
  });

  it('uses localized logo assets for Hindi and Tamil without clipped image wrappers', () => {
    render(<MemoryRouter><Footer language="hindi" onLanguageChange={() => {}} /></MemoryRouter>);
    const hindiButton = document.querySelector('#footer-lang-hindi');
    const tamilButton = document.querySelector('#footer-lang-tamil');
    expect(hindiButton.querySelector('img').getAttribute('src')).toContain('Logo_Hindi.svg');
    expect(tamilButton.querySelector('img').getAttribute('src')).toContain('Logo_Tamil.svg');
    expect(hindiButton.querySelector('img')).toHaveClass('object-contain');
    expect(hindiButton.querySelector('img').parentElement).toHaveClass('overflow-visible');
  });

  it('opens account actions in the sign-in modal and retains route fallbacks', () => {
    const onSignIn = vi.fn();
    render(
      <MemoryRouter>
        <Footer language="english" onLanguageChange={() => {}} isLoggedIn={false} onSignIn={onSignIn} />
      </MemoryRouter>,
    );
    const orders = screen.getByRole('link', {name: 'Orders'});
    expect(orders).toHaveAttribute('href', '/account/orders');
    orders.click();
    expect(onSignIn).toHaveBeenCalledWith('/account/orders');
    expect(screen.getByRole('link', {name: 'Sign in / Sign up'})).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Faccount',
    );
  });
});
