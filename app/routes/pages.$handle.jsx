import {data, useLoaderData, useRouteLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {AboutPage} from '~/components/about/AboutPage.jsx';
import {
  getPublicPageMeta,
  PublicContentPage,
} from '~/components/content/PublicPages.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const page = data?.page;
  const fallback = getPublicPageMeta(data?.handle);
  return [
    {
      title:
        page?.seo?.title ||
        `${page?.title ?? fallback?.title ?? 'Page'} | UniinX`,
    },
    ...(page?.seo?.description || fallback?.description
      ? [
          {
            name: 'description',
            content: page?.seo?.description || fallback.description,
          },
        ]
      : []),
  ];
};

const BUILT_IN_HANDLES = new Set([
  'about',
  'faq',
  'size-care',
  'shipping-returns',
  'contact',
]);

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page, shop} = await context.storefront.query(PAGE_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {handle: params.handle},
  });

  if (!page && !BUILT_IN_HANDLES.has(params.handle)) {
    throw new Response('Not Found', {status: 404});
  }

  if (page) {
    redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  }

  return {
    handle: params.handle,
    page,
    policies: [shop?.shippingPolicy, shop?.refundPolicy].filter(Boolean),
  };
}

/**
 * Send public contact requests to the configured studio webhook.
 * @param {Route.ActionArgs}
 */
export async function action({request, context, params}) {
  if (params.handle !== 'contact') {
    throw new Response('Method not allowed', {status: 405});
  }
  const form = await request.formData();
  if (form.get('website')) return {success: true};

  const name = form.get('name')?.toString().trim();
  const email = form.get('email')?.toString().trim();
  const topic = form.get('topic')?.toString().trim();
  const orderNumber = form.get('orderNumber')?.toString().trim();
  const message = form.get('message')?.toString().trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

  if (
    !name ||
    name.length > 120 ||
    !validEmail ||
    !message ||
    message.length > 5000
  ) {
    return data(
      {success: false, error: 'Enter a valid name, email, and message.'},
      {status: 400},
    );
  }

  const webhook =
    context.env.CONTACT_WEBHOOK_URL || context.env.SUPPORT_WEBHOOK_URL;
  if (!webhook) {
    return data(
      {success: false, error: 'Studio messaging is temporarily unavailable.'},
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
        source: 'public-contact',
        name,
        email,
        topic,
        orderNumber,
        message,
      }),
    });
    if (!response.ok) throw new Error('Webhook rejected request');
  } catch {
    return data(
      {
        success: false,
        error: 'Your message could not be sent. Please try again.',
      },
      {status: 502},
    );
  } finally {
    clearTimeout(timeout);
  }

  return {success: true};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {handle, page, policies} = useLoaderData();
  const rootData = useRouteLoaderData('root');

  if (handle === 'about') {
    return (
      <AboutPage
        page={page ?? {body: ''}}
        language={rootData?.languagePreference ?? 'english'}
      />
    );
  }

  return <PublicContentPage handle={handle} page={page} policies={policies} />;
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy { id title handle }
      refundPolicy { id title handle }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
