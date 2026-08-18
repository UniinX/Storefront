import {useLoaderData, Link} from 'react-router';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const data = await context.storefront.query(POLICIES_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const shopPolicies = data.shop;
  const policies = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy) => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  /** @type {LoaderReturnData} */
  const {policies} = useLoaderData();

  return (
    <div className="bg-surface-subtle text-foreground">
      <header className="uniinx-home-gutter border-b border-black/10 pb-16 pt-20 sm:pt-28 lg:pb-24 lg:pt-36">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
          Legal & transparent
        </p>
        <h1 className="mt-7 text-[clamp(48px,10vw,150px)] font-normal leading-[0.84] tracking-[-0.065em] sm:leading-[0.76] sm:tracking-[-0.08em]">
          Policies.
        </h1>
      </header>
      <nav
        aria-label="Store policies"
        className="uniinx-home-gutter py-14 lg:py-24"
      >
        <div className="border-t border-black/15">
          {policies.map((policy) => (
            <Link
              key={policy.id}
              to={`/policies/${policy.handle}`}
              className="group flex min-h-24 items-center justify-between border-b border-black/15 py-5 text-[clamp(24px,3vw,44px)] font-normal tracking-[-0.04em]"
            >
              {policy.title}
              <span
                aria-hidden="true"
                className="text-2xl transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;

/** @typedef {import('./+types/policies._index').Route} Route */
/** @typedef {import('storefrontapi.generated').PoliciesQuery} PoliciesQuery */
/** @typedef {import('storefrontapi.generated').PolicyItemFragment} PolicyItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
