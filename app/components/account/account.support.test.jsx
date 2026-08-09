import {describe, it, expect, vi} from 'vitest';
import { action } from '~/routes/account.support.jsx';

describe('account.support action', () => {
  it('delivers authenticated submissions to the configured webhook', async () => {
    const mockRequest = {
      formData: async () => {
        const data = new Map([
          ['category', 'Size Issue'],
          ['orderRef', '1001'],
          ['subject', 'Sizing problem with Hoodies'],
          ['message', 'Please adjust layout.'],
        ]);
        return data;
      },
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ok: true});
    const response = await action({
      request: mockRequest,
      context: {
        customerAccount: {
          isLoggedIn: async () => true,
          i18n: {language: 'EN'},
          query: async () => ({
            data: {
              customer: {
                id: 'gid://shopify/Customer/1',
                emailAddress: {emailAddress: 'customer@example.com'},
                orders: {nodes: [{number: '1001'}]},
              },
            },
          }),
        },
        env: {SUPPORT_WEBHOOK_URL: 'https://support.example.test/hooks'},
      },
    });
    expect(response).toEqual({success: true});
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      customerId: 'gid://shopify/Customer/1',
      customerEmail: 'customer@example.com',
      orderRef: '1001',
    });
    fetchMock.mockRestore();
  });
});
