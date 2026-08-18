import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {MotionConfig} from 'framer-motion';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import uniinxStyles from '~/styles/uniinx.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {useLanguage} from '~/hooks/useLanguage.js';
import {WishlistProvider} from '~/context/WishlistContext.jsx';
import {getLanguagePreference} from '~/hooks/useLanguage.js';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
    languagePreference: getLanguagePreference(args.request),
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const [header, megaMenu] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    storefront.query(MEGA_MENU_QUERY, {
      cache: storefront.CacheShort(),
    }),
  ]);

  return {
    header,
    megaMenuProducts: megaMenu.products?.nodes ?? [],
    megaMenuCollections: megaMenu.collections?.nodes ?? [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

/**
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();
  const data = useRouteLoaderData('root');

  return (
    <html lang={HTML_LANGUAGE_CODES[data?.languagePreference] ?? 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={uniinxStyles}></link>
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        <MotionConfig
          reducedMotion="user"
          transition={{duration: 0.6, ease: [0.16, 0.84, 0.32, 1]}}
          nonce={nonce}
        >
          {children}
        </MotionConfig>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  /** @type {RootLoader} */
  const data = useRouteLoaderData('root');
  const {language, changeLanguage} = useLanguage(
    data?.languagePreference ?? 'english',
  );

  if (!data) {
    return (
      <WishlistProvider>
        <Outlet context={{language, changeLanguage}} />
      </WishlistProvider>
    );
  }

  return (
    <WishlistProvider>
      <Analytics.Provider
        cart={data.cart}
        shop={data.shop}
        consent={data.consent}
      >
        <PageLayout
          cart={data.cart}
          language={language}
          isLoggedIn={data.isLoggedIn}
          megaMenuProducts={data.megaMenuProducts}
          megaMenuCollections={data.megaMenuCollections}
        >
          <Outlet context={{language, changeLanguage}} />
        </PageLayout>
      </Analytics.Provider>
    </WishlistProvider>
  );
}

const HTML_LANGUAGE_CODES = {
  english: 'en',
  hindi: 'hi',
  telugu: 'te',
  tamil: 'ta',
  malayalam: 'ml',
  kannada: 'kn',
  bengali: 'bn',
  odia: 'or',
};

const MEGA_MENU_QUERY = `#graphql
  query MegaMenuProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50) {
      nodes {
        id
        handle
        title
        description
        products(first: 5) {
          nodes {
            id
            handle
            title
            productType
            tags
            category { id name }
          }
        }
      }
    }
    products(first: 50, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        productType
        tags
        publishedAt
        collectionName: metafield(namespace: "custom", key: "collection_name") { value }
        category { id name }
        collections(first: 5) {
          nodes { id handle title }
        }
        featuredImage { id url altText width height }
      }
    }
  }
`;

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage =
      errorStatus >= 500 && !import.meta.env.DEV
        ? 'An unexpected error occurred.'
        : (error?.data?.message ?? error.data);
  } else if (error instanceof Error) {
    errorMessage = import.meta.env.DEV
      ? error.message
      : 'An unexpected error occurred.';
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
