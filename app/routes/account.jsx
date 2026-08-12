import {Form, NavLink, Outlet, useLoaderData, useRouteLoaderData} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {LocalizedLogo} from '~/components/LocalizedLogo.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

const ACCOUNT_LINKS = [
  {to: '/account', label: 'Overview', index: '01', end: true},
  {to: '/account/orders', label: 'Orders', index: '02'},
  {to: '/account/profile', label: 'Profile', index: '03'},
  {to: '/account/addresses', label: 'Addresses', index: '04'},
  {to: '/account/security', label: 'Sign-in & security', index: '05'},
  {to: '/account/policies', label: 'Store policies', index: '06'},
  {to: '/account/support', label: 'Support', index: '07'},
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
    <section className="min-h-screen bg-[#e9e4dc] px-4 py-8 sm:px-8 sm:py-12 lg:px-[60px] lg:py-16">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <header className="relative overflow-hidden rounded-[28px] bg-[#151515] px-6 py-8 text-white sm:px-9 lg:px-12 lg:py-10">
            <span
              aria-hidden="true"
              className="absolute -right-3 -top-14 text-[180px] font-semibold leading-none text-white/[0.045] sm:right-12"
            >
              உ
            </span>
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <LocalizedLogo
                  language={rootData?.languagePreference ?? 'english'}
                  className="h-auto w-[122px] brightness-0 invert"
                />
                <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Member account
                </p>
                <h1 className="mt-3 text-[clamp(40px,6vw,72px)] font-medium leading-[0.9] tracking-[-0.055em]">
                  Your UniinX
                </h1>
              </div>
              <div className="flex items-center gap-4 rounded-[18px] border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#a13a2d] text-sm font-semibold">
                  {initials}
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-sm font-semibold">{fullName}</strong>
                  <span className="mt-1 block truncate text-xs text-white/48">{email}</span>
                </span>
              </div>
            </div>
          </header>
        </Reveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-[286px_minmax(0,1fr)]">
          <Reveal variant="card">
            <aside className="rounded-[26px] border border-black/10 bg-[#f8f6f2] p-3 lg:sticky lg:top-28">
              <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {ACCOUNT_LINKS.map((item) => (
                  <AccountNavLink key={item.to} {...item} />
                ))}
              </nav>
              <div className="mt-3 border-t border-black/10 pt-3">
                <Form method="POST" action="/account/logout">
                  <button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-between rounded-[14px] px-4 text-left text-xs font-semibold text-black/55 transition-colors hover:bg-black hover:text-white"
                  >
                    Sign out <span aria-hidden="true">↗</span>
                  </button>
                </Form>
              </div>
            </aside>
          </Reveal>

          <main className="min-w-0 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(30,24,18,0.06)] sm:p-8 lg:p-10">
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
        `group flex min-h-12 shrink-0 items-center gap-3 rounded-[14px] px-4 text-xs font-semibold transition-colors ${
          isActive
            ? 'bg-black text-white'
            : 'text-black/55 hover:bg-black/[0.055] hover:text-black'
        }`
      }
    >
      {({isActive}) => (
        <>
          <span className={`text-[9px] tracking-[0.16em] ${isActive ? 'text-white/45' : 'text-black/30'}`}>
            {index}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

/** @typedef {import('./+types/account').Route} Route */
