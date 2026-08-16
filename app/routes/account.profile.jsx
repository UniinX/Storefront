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

import {Link} from 'react-router';

export const meta = () => [{title: 'Profile & Addresses | UniinX'}];

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
    for (const key of ['firstName', 'lastName', 'phoneNumber']) {
      const value = form.get(key);
      if (typeof value !== 'string') continue;
      const normalizedValue = value.trim();
      if (key === 'firstName' || key === 'lastName') {
        if (
          normalizedValue &&
          (normalizedValue.length < 2 || normalizedValue.length > 100)
        ) {
          return data(
            {error: 'Names must be between 2 and 100 characters.', customer: null},
            {status: 400},
          );
        }
        if (normalizedValue) customer[key] = normalizedValue;
      } else if (key === 'phoneNumber') {
        if (normalizedValue) {
          if (!/^\+?[0-9 ()-]{7,20}$/.test(normalizedValue)) {
            return data(
              {
                error:
                  'Enter a valid phone number (e.g. +91 98765 43210 or +1 415 555 2671).',
                customer: null,
              },
              {status: 400},
            );
          }
          customer.phoneNumber = normalizedValue;
        }
      }
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
      {
        error:
          error instanceof Error ? error.message : 'Profile update failed.',
        customer: null,
      },
      {status: 400},
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext();
  const action = useActionData();
  const navigation = useNavigation();
  const customer = action?.customer ?? account?.customer ?? {};
  const addresses = customer?.addresses?.nodes ?? [];
  const defaultAddress = customer?.defaultAddress;
  const isUpdating = navigation.state !== 'idle';
  const email = customer?.emailAddress?.emailAddress ?? 'Connected through Shopify';
  const phone = customer?.phoneNumber?.phoneNumber ?? '';

  return (
    <div className="space-y-10">
      <AccountPageHeader
        eyebrow="Profile & Addresses"
        title="Personal Details & Delivery Locations"
        description="Manage your account name, phone number for delivery tracking, verified email address, and saved shipping locations."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Personal & Contact Details Form */}
        <Reveal variant="card">
          <AccountPanel className="h-full">
            <AccountPanelLabel>Account & Contact Information</AccountPanelLabel>
            <Form method="PUT" className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={accountLabel}>
                    First name
                  </label>
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
                  <label htmlFor="lastName" className={accountLabel}>
                    Last name
                  </label>
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

              <div>
                <label htmlFor="phoneNumber" className={accountLabel}>
                  Phone number (SMS & Courier alerts)
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  defaultValue={phone}
                  className={accountField}
                />
                <p className="mt-1.5 text-[11px] text-black/45">
                  Format: International format with country code (e.g. +91 98765 43210).
                </p>
              </div>

              <div className="rounded-[14px] border border-black/10 bg-white p-4 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-black/40">
                    Verified Email Address
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                    Verified
                  </span>
                </div>
                <p className="mt-1.5 font-medium tracking-tight text-black text-xs sm:text-sm truncate">
                  {email}
                </p>
              </div>

              {action?.error ? (
                <AccountStatus tone="warning">{action.error}</AccountStatus>
              ) : null}
              {action && !action.error ? (
                <AccountStatus tone="success">
                  Your profile and phone number have been updated successfully.
                </AccountStatus>
              ) : null}

              <button
                type="submit"
                disabled={isUpdating}
                className={accountPrimaryButton}
              >
                {isUpdating ? 'Saving…' : 'Save Details & Phone Number'}
              </button>
            </Form>
          </AccountPanel>
        </Reveal>

        {/* Saved Shipping Addresses */}
        <Reveal variant="card" delay={80}>
          <AccountPanel className="h-full">
            <div className="flex items-center justify-between gap-4">
              <AccountPanelLabel>Saved Delivery Locations ({addresses.length})</AccountPanelLabel>
              <Link
                to="/account/addresses"
                className="text-xs font-semibold text-black underline decoration-black/20 underline-offset-4 hover:decoration-black"
              >
                Manage All →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {defaultAddress ? (
                <div className="rounded-[16px] border border-black/12 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                      Default Delivery Location
                    </span>
                  </div>
                  <address className="mt-4 not-italic text-xs leading-6 text-black/70">
                    <strong className="block text-sm font-semibold text-black">
                      {defaultAddress.firstName} {defaultAddress.lastName}
                    </strong>
                    {defaultAddress.company ? (
                      <span className="block">{defaultAddress.company}</span>
                    ) : null}
                    <span className="block">{defaultAddress.address1}</span>
                    {defaultAddress.address2 ? (
                      <span className="block">{defaultAddress.address2}</span>
                    ) : null}
                    <span className="block">
                      {[
                        defaultAddress.city,
                        defaultAddress.zoneCode,
                        defaultAddress.zip,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                    <span className="block">{defaultAddress.territoryCode}</span>
                    {defaultAddress.phoneNumber ? (
                      <span className="mt-2 block font-medium text-black">
                        📞 {defaultAddress.phoneNumber}
                      </span>
                    ) : null}
                  </address>
                </div>
              ) : (
                <div className="rounded-[16px] border border-dashed border-black/15 bg-white p-6 text-center">
                  <p className="text-sm font-medium text-black">
                    No default address saved yet.
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    Add a primary delivery location for 1-click checkout.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/account/addresses"
                  className="flex min-h-11 w-full items-center justify-center rounded-full border border-black/15 bg-white px-5 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Manage & Add Addresses
                </Link>
              </div>
            </div>
          </AccountPanel>
        </Reveal>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.profile').Route} Route */
