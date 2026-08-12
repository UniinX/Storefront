import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {Footer} from './Footer.jsx';

vi.mock('~/components/motion/Reveal.jsx', () => ({
  Reveal: ({as: Element = 'div', children, ...props}) => (
    <Element {...props}>{children}</Element>
  ),
}));

describe('Footer', () => {
  it('provides storefront, support, order, refund, and legal navigation', () => {
    render(
      <MemoryRouter>
        <Footer language="english" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', {name: 'All products'})).toHaveAttribute(
      'href',
      '/collections/all',
    );
    expect(screen.getByRole('link', {name: 'Support'})).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Faccount%2Fsupport',
    );
    expect(screen.getByRole('link', {name: 'Orders'})).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Faccount%2Forders',
    );
    expect(
      screen.getByRole('link', {name: 'Returns & refunds'}),
    ).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Faccount%2Fsupport%3Fcategory%3DRefund%2520or%2520Cancellation',
    );
    expect(screen.getByRole('link', {name: 'Privacy policy'})).toHaveAttribute(
      'href',
      '/policies/privacy-policy',
    );
  });

  it('uses Indian brand language', () => {
    render(
      <MemoryRouter>
        <Footer language="english" />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Rooted in Indian language, craft & culture/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Scandinavian/i)).not.toBeInTheDocument();
  });

  it('keeps the localized brand logo without duplicating the homepage language selector', () => {
    render(
      <MemoryRouter>
        <Footer language="hindi" />
      </MemoryRouter>,
    );
    expect(screen.getByAltText('UniinX logo in Hindi')).toHaveAttribute(
      'src',
      expect.stringContaining('Logo_Hindi.svg'),
    );
    expect(
      screen.queryByRole('button', {name: /select tamil/i}),
    ).not.toBeInTheDocument();
  });

  it('sends signed-out account actions directly to Shopify Customer Accounts', () => {
    render(
      <MemoryRouter>
        <Footer language="english" isLoggedIn={false} />
      </MemoryRouter>,
    );
    const orders = screen.getByRole('link', {name: 'Orders'});
    expect(orders).toHaveAttribute(
      'href',
      '/account/login?return_to=%2Faccount%2Forders',
    );
    expect(
      screen.getByRole('link', {name: 'Sign in / Sign up'}),
    ).toHaveAttribute('href', '/account/login?return_to=%2Faccount');
  });
});
