import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Profile'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
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
    const validInputKeys = ['firstName', 'lastName'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
        if (typeof value === 'string') {
          const normalizedValue = value.trim();
          if (normalizedValue && (normalizedValue.length < 2 || normalizedValue.length > 100)) {
          return data(
            {error: 'Names must be between 2 and 100 characters.', customer: null},
            {status: 400},
          );
        }
        customer[key] = normalizedValue;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext();
  const {state} = useNavigation();
  /** @type {ActionReturnData} */
  const action = useActionData();
  const customer = action?.customer ?? account?.customer;
  const isUpdating = state !== 'idle';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Personal Profile
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Review and update your personal details used for orders and transliterated labels.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      <Form method="PUT" className="flex flex-col gap-6 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="firstName" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="lastName" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>
        </div>

        {/* Action Error / Success Status */}
        {action?.error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
            {action.error}
          </div>
        )}
        {action && !action.error && (
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 font-work text-xs font-light">
            Profile updated successfully.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className="w-fit px-8 py-3.5 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update Details'}
        </button>
      </Form>
    </div>
  );
}

/**
 * @typedef {{
 *   error: string | null;
 *   customer: CustomerFragment | null;
 * }} ActionResponse
 */

/** @typedef {import('customer-accountapi.generated').CustomerFragment} CustomerFragment */
/** @typedef {import('@shopify/hydrogen/customer-account-api-types').CustomerUpdateInput} CustomerUpdateInput */
/** @typedef {import('./+types/account.profile').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
/** @typedef {ReturnType<typeof useActionData<typeof action>>} ActionReturnData */
