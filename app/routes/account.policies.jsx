import {useLoaderData} from 'react-router';
import {useState} from 'react';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Store Policies'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();

  const data = await context.storefront.query(POLICIES_WITH_BODY_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {
      language: context.storefront.i18n?.language,
    },
  });

  const shopPolicies = data.shop;
  const policies = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
  ].filter((policy) => policy != null);

  return {policies};
}

export default function AccountPolicies() {
  /** @type {LoaderReturnData} */
  const {policies} = useLoaderData();
  const [openSection, setOpenSection] = useState(policies[0]?.id ?? '');

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Store Policies
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Review our terms of use, privacy statements, and fulfillment promises fetched directly from the storefront registry.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {policies.length > 0 ? (
          policies.map((policy) => {
            const isOpen = openSection === policy.id;
            return (
              <div
                key={policy.id}
                className="border border-black/5 dark:border-white/5 rounded-xl overflow-hidden transition-all duration-300 bg-black/[0.005] dark:bg-white/[0.005]"
              >
                <button
                  onClick={() => setOpenSection(isOpen ? '' : policy.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                >
                  <span className="font-marcellus text-sm text-black dark:text-white uppercase tracking-wider font-light">
                    {policy.title}
                  </span>
                  <span className="font-work text-xs text-black/40 dark:text-white/40">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-6 bg-white dark:bg-black border-t border-black/5 dark:border-white/5 font-work text-xs leading-relaxed text-black/70 dark:text-white/70 font-light prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{__html: policy.body}} />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <span className="font-work text-xs text-black/40 dark:text-white/40">
            No policies defined for this shop locale.
          </span>
        )}
      </div>
    </div>
  );
}

const POLICIES_WITH_BODY_QUERY = `#graphql
  query PoliciesWithBody($language: LanguageCode) @inContext(language: $language) {
    shop {
      privacyPolicy {
        id
        title
        handle
        body
      }
      shippingPolicy {
        id
        title
        handle
        body
      }
      termsOfService {
        id
        title
        handle
        body
      }
      refundPolicy {
        id
        title
        handle
        body
      }
    }
  }
`;

/** @typedef {import('./+types/account.policies').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
