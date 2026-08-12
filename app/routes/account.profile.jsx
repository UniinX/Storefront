import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  AccountPageHeader,
  AccountPanel,
  AccountPanelLabel,
  AccountStatus,
  accountField,
  accountLabel,
  accountPrimaryButton,
} from '~/components/account/AccountUI.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

export const meta = () => [{title: 'Profile | UniinX'}];

export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}) {
  const {customerAccount} = context;
  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  try {
    if (!(await customerAccount.isLoggedIn())) {
      return data({error: 'Unauthorized', customer: null}, {status: 401});
    }

    const customer = {};
    for (const key of ['firstName', 'lastName']) {
      const value = form.get(key);
      if (typeof value !== 'string') continue;
      const normalizedValue = value.trim();
      if (
        normalizedValue &&
        (normalizedValue.length < 2 || normalizedValue.length > 100)
      ) {
        return data(
          {error: 'Names must be between 2 and 100 characters.', customer: null},
          {status: 400},
        );
      }
      customer[key] = normalizedValue;
    }

    const {data: mutationData, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) throw new Error(errors[0].message);
    if (!mutationData?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {error: null, customer: mutationData.customerUpdate.customer};
  } catch (error) {
    return data(
      {error: error instanceof Error ? error.message : 'Profile update failed.', customer: null},
      {status: 400},
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext();
  const action = useActionData();
  const navigation = useNavigation();
  const customer = action?.customer ?? account?.customer ?? {};
  const isUpdating = navigation.state !== 'idle';
  const email = customer?.emailAddress?.emailAddress ?? 'Connected through Shopify';
  const phone = customer?.phoneNumber?.phoneNumber;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Personal details"
        title="Your profile"
        description="Keep the name associated with your orders current. Your verified email and phone are managed through Shopify’s secure customer account."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Reveal variant="card">
          <AccountPanel>
            <AccountPanelLabel>Display information</AccountPanelLabel>
            <Form method="PUT" className="mt-6 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={accountLabel}>First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    defaultValue={customer.firstName ?? ''}
                    minLength={2}
                    maxLength={100}
                    className={accountField}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={accountLabel}>Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    defaultValue={customer.lastName ?? ''}
                    minLength={2}
                    maxLength={100}
                    className={accountField}
                  />
                </div>
              </div>

              {action?.error ? <AccountStatus tone="warning">{action.error}</AccountStatus> : null}
              {action && !action.error ? <AccountStatus tone="success">Your profile has been updated.</AccountStatus> : null}

              <button type="submit" disabled={isUpdating} className={accountPrimaryButton}>
                {isUpdating ? 'Saving…' : 'Save profile'}
              </button>
            </Form>
          </AccountPanel>
        </Reveal>

        <Reveal variant="card" delay={80}>
          <AccountPanel className="h-full">
            <AccountPanelLabel>Verified contact</AccountPanelLabel>
            <dl className="mt-6 space-y-6 text-sm">
              <div>
                <dt className="text-xs text-black/40">Email address</dt>
                <dd className="mt-2 break-words font-medium">{email}</dd>
              </div>
              <div className="border-t border-black/10 pt-5">
                <dt className="text-xs text-black/40">Phone number</dt>
                <dd className="mt-2 font-medium">{phone || 'Not added'}</dd>
              </div>
            </dl>
            <p className="mt-8 text-xs leading-5 text-black/45">
              To change verified contact information, open your Shopify customer account after signing in.
            </p>
          </AccountPanel>
        </Reveal>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.profile').Route} Route */
