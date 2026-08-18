import {describe, expect, it, vi} from 'vitest';
import {loader} from '~/routes/sign-in.jsx';

describe('sign-in loader', () => {
  it('redirects safe internal return paths directly to Shopify login', async () => {
    const response = await loader({
      request: new Request('https://uniinx.test/sign-in?return_to=%2Faccount%2Forders'),
      context: {customerAccount: {isLoggedIn: vi.fn().mockResolvedValue(false)}},
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      '/account/login?return_to=%2Faccount%2Forders',
    );
  });

  it('rejects external return paths', async () => {
    const response = await loader({
      request: new Request('https://uniinx.test/sign-in?return_to=%2F%2Fevil.test'),
      context: {customerAccount: {isLoggedIn: vi.fn().mockResolvedValue(false)}},
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      '/account/login?return_to=%2Faccount',
    );
  });

  it('redirects authenticated customers to their account', async () => {
    const response = await loader({
      request: new Request('https://uniinx.test/sign-in'),
      context: {customerAccount: {isLoggedIn: vi.fn().mockResolvedValue(true)}},
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/account');
  });
});
