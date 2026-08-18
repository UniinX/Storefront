import {afterEach, describe, expect, it, vi} from 'vitest';
import {action as contactAction} from '~/routes/pages.$handle.jsx';
import {action as newsletterAction} from '~/routes/newsletter.jsx';

afterEach(() => vi.restoreAllMocks());

describe('public content actions', () => {
  it('delivers public contact requests to the configured webhook', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ok: true});
    const response = await contactAction({
      params: {handle: 'contact'},
      request: formRequest([
        ['name', 'Asha Rao'],
        ['email', 'asha@example.com'],
        ['topic', 'Product question'],
        ['orderNumber', ''],
        ['message', 'Can you help me choose a language edition?'],
      ]),
      context: {env: {CONTACT_WEBHOOK_URL: 'https://example.test/contact'}},
    });

    expect(response).toEqual({success: true});
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      source: 'public-contact',
      email: 'asha@example.com',
    });
  });

  it('delivers valid newsletter subscriptions', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ok: true});
    const response = await newsletterAction({
      request: formRequest([['email', 'reader@example.com']]),
      context: {
        env: {NEWSLETTER_WEBHOOK_URL: 'https://example.test/newsletter'},
      },
    });

    expect(response).toEqual({success: true});
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      source: 'newsletter',
      email: 'reader@example.com',
    });
  });
});

function formRequest(entries) {
  return {formData: async () => new Map(entries)};
}
