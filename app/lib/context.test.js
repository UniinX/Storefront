import {describe, expect, it} from 'vitest';
import {getSignedOutRedirect} from './context.js';

describe('getSignedOutRedirect', () => {
  it('sends protected account requests directly to Shopify Customer Accounts', () => {
    expect(
      getSignedOutRedirect(
        new Request('https://uniinx.test/account/orders?cursor=next'),
      ),
    ).toBe('/account/login?return_to=%2Faccount%2Forders%3Fcursor%3Dnext');
  });
});
