import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  // Customer credentials mapping
  const firstName = customer?.firstName ?? '';
  const lastName = customer?.lastName ?? '';
  const email = customer?.emailAddress?.emailAddress ?? 'Connected Customer';
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  const fullName = firstName ? `${firstName} ${lastName}`.trim() : 'Studio Guest';

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-14 py-28 min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

        {/* Desktop Sidebar & Mobile Header Card */}
        <aside className="lg:col-span-1 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-6 transition-colors duration-200 shadow-sm">
          {/* User Info Header Block */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark flex items-center justify-center font-marcellus text-sm font-semibold tracking-wider flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-marcellus text-base text-black dark:text-white truncate font-medium">
                {fullName}
              </span>
              <span className="font-work text-[10px] text-black/40 dark:text-white/30 truncate">
                {email}
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-black/5 dark:bg-white/5 w-full hidden lg:block" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-col gap-1 w-full" aria-label="Account navigation">
            <AccountNavLink to="/account" label="Overview" end />
            <AccountNavLink to="/account/orders" label="Orders & History" />
            <AccountNavLink to="/account/profile" label="Personal Profile" />
            <AccountNavLink to="/account/addresses" label="Saved Addresses" />
            <AccountNavLink to="/account/security" label="Login & Security" />
            <AccountNavLink to="/account/policies" label="Store Policies" />
            <AccountNavLink to="/account/support" label="Contact Support" />
          </nav>

          {/* Mobile Navigation Links (horizontal scrollable bar) */}
          <nav className="flex lg:hidden overflow-x-auto whitespace-nowrap scrollbar-none gap-1 border-t border-b border-black/5 dark:border-white/5 py-3 -mx-6 px-6" aria-label="Mobile account navigation">
            <AccountNavLink to="/account" label="Overview" end />
            <AccountNavLink to="/account/orders" label="Orders" />
            <AccountNavLink to="/account/profile" label="Profile" />
            <AccountNavLink to="/account/addresses" label="Addresses" />
            <AccountNavLink to="/account/security" label="Security" />
            <AccountNavLink to="/account/policies" label="Policies" />
            <AccountNavLink to="/account/support" label="Support" />
          </nav>

          <div className="h-[1px] bg-black/5 dark:bg-white/5 w-full hidden lg:block" />

          {/* Logout Action */}
          <Logout />
        </aside>

        {/* Nested Content Panel Outlet */}
        <main className="lg:col-span-3 border border-black/5 dark:border-white/5 rounded-2xl p-8 bg-brand-surface-light dark:bg-brand-surface-dark transition-colors duration-200 shadow-sm min-h-[460px]">
          <Outlet context={{customer}} />
        </main>

      </div>
    </div>
  );
}

function AccountNavLink({to, label, end = false}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({isActive}) =>
        `font-work text-[11px] tracking-wider uppercase px-4 py-3 rounded-lg font-light transition-all flex-shrink-0 ${
          isActive
            ? 'bg-brand-accent/5 dark:bg-brand-accent-light/5 text-brand-accent dark:text-brand-accent-light font-semibold'
            : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Logout() {
  return (
    <Form className="w-full mt-auto" method="POST" action="/account/logout">
      <button
        type="submit"
        className="w-full py-3 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-work text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer"
      >
        Sign out
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
