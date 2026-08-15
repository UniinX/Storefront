import {useLoaderData} from 'react-router';
import {AccountPageHeader} from '~/components/account/AccountUI.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion.jsx';

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

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Transparency"
        title="Store policies"
        description="The current privacy, shipping, service, and refund policies published by UniinX."
      />

      {/* Accordion List */}
      <div>
        {policies.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            defaultValue={policies[0]?.id}
            className="flex flex-col gap-4"
          >
            {policies.map((policy) => (
              <AccordionItem
                key={policy.id}
                value={policy.id}
                className="border border-black/5 dark:border-white/5 rounded-xl overflow-hidden transition-all duration-300 bg-black/[0.005] dark:bg-white/[0.005]"
              >
                <AccordionTrigger className="w-full p-5 font-marcellus text-sm font-light uppercase tracking-wider text-black hover:bg-black/[0.01] dark:text-white dark:hover:bg-white/[0.01]">
                  {policy.title}
                </AccordionTrigger>
                <AccordionContent className="border-t border-black/5 bg-white p-6 font-work text-xs font-light leading-relaxed text-black/70 dark:border-white/5 dark:bg-black dark:text-white/70">
                  <div
                    className="uniinx-rich-text max-w-none"
                    dangerouslySetInnerHTML={{__html: policy.body}}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
