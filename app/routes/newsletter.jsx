import {data, redirect} from 'react-router';

export async function loader() {
  return redirect('/');
}

/** @param {Route.ActionArgs} args */
export async function action({request, context}) {
  const form = await request.formData();
  if (form.get('website')) return {success: true};
  const email = form.get('email')?.toString().trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return data(
      {success: false, error: 'Enter a valid email address.'},
      {status: 400},
    );
  }

  const webhook =
    context.env.NEWSLETTER_WEBHOOK_URL || context.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return data(
      {success: false, error: 'Newsletter signup is temporarily unavailable.'},
      {status: 503},
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      signal: controller.signal,
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        source: 'newsletter',
        email,
      }),
    });
    if (!response.ok) throw new Error('Webhook rejected request');
  } catch {
    return data(
      {success: false, error: 'Signup failed. Please try again.'},
      {status: 502},
    );
  } finally {
    clearTimeout(timeout);
  }

  return {success: true};
}

export default function NewsletterRoute() {
  return null;
}

/** @typedef {import('./+types/newsletter').Route} Route */
