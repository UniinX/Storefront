import {Form, NavLink, Outlet, useLoaderData, useRouteLoaderData} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {LocalizedLogo} from '~/components/LocalizedLogo.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

const ACCOUNT_LINKS = [
  {to: '/account', label: 'Overview', index: '01', end: true},
  {to: '/account/orders', label: 'Orders & Tracking', index: '02'},
  {to: '/account/profile', label: 'Profile & Addresses', index: '03'},
  {to: '/account/security', label: 'Sign-in & Security', index: '04'},
  {to: '/account/policies', label: 'Store Policies', index: '05'},
  {to: '/account/support', label: 'Support & Returns', index: '06'},
  {to: '/wishlist', label: 'Wishlist', index: '07'},
];

export function shouldRevalidate() {
  return true;
}

export async function loader({context}) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {language: customerAccount.i18n.language},
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return Response.json(
    {customer: data.customer},
    {headers: {'Cache-Control': 'private, no-cache, no-store, must-revalidate'}},
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData();
  const rootData = useRouteLoaderData('root');
  const firstName = customer?.firstName?.trim() ?? '';
  const lastName = customer?.lastName?.trim() ?? '';
  const email = customer?.emailAddress?.emailAddress ?? 'Connected customer';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'UniinX member';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'UX';

  return (
    <section className="min-h-screen bg-white px-4 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16 lg:px-[60px] lg:pt-28 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
        {/* Sleek Member Profile Header Card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-5 shadow-sm sm:rounded-[24px] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Profile Avatar & Details */}
              <div className="flex items-center gap-3.5 sm:gap-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-black text-sm font-semibold text-white shadow-sm sm:size-14 sm:text-base">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-lg font-medium tracking-tight text-black sm:text-2xl">
                      {fullName}
                    </h1>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-black/60 sm:text-[10px]">
                      Verified Member
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-black/50 sm:text-sm">
                    {email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <Form method="POST" action="/account/logout">
                  <button
                    type="submit"
                    className="inline-flex min-h-9 items-center justify-center rounded-full border border-black/15 bg-white px-4 text-[11px] font-medium text-black transition-colors hover:border-black hover:bg-black hover:text-white sm:min-h-10 sm:px-5 sm:text-xs"
                  >
                    Sign Out
                  </button>
                </Form>
              </div>
            </div>

            {/* Horizontal Segmented Navigation Tab Bar */}
            <div className="mt-5 border-t border-black/[0.07] pt-3 sm:mt-8 sm:pt-4">
              <nav
                aria-label="Account navigation"
                className="uniinx-horizontal-scroll flex items-center gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none sm:gap-2"
              >
                {ACCOUNT_LINKS.map((item) => (
                  <AccountNavLink key={item.to} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </Reveal>

        {/* Main Content Card */}
        <div className="mt-5 sm:mt-6 min-w-0 w-full max-w-full">
          <main className="min-w-0 w-full max-w-full overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-8 lg:p-10">
            <Outlet context={{customer}} />
          </main>
        </div>
      </div>
    </section>
  );
}

function AccountNavLink({to, label, index, end = false}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({isActive}) =>
        `group flex min-h-9 shrink-0 snap-start items-center gap-2 rounded-full px-3.5 text-[11px] font-medium transition-all sm:min-h-10 sm:px-4 sm:text-xs ${
          isActive
            ? 'bg-black text-white shadow-sm'
            : 'bg-black/[0.03] text-black/65 hover:bg-black/10 hover:text-black'
        }`
      }
    >
      {({isActive}) => (
        <>
          <span
            className={`text-[9px] font-semibold tracking-wider ${
              isActive ? 'text-white/50' : 'text-black/35'
            }`}
          >
            {index}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

/** @typedef {import('./+types/account').Route} Route */
