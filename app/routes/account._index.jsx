import {Image, Money} from '@shopify/hydrogen';
import {Link, useOutletContext} from 'react-router';
import {
  AccountPageHeader,
  AccountPanel,
  AccountPanelLabel,
  accountPrimaryButton,
  accountSecondaryButton,
} from '~/components/account/AccountUI.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

export const meta = () => [{title: 'Your UniinX'}];

export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export default function AccountOverview() {
  const {customer} = useOutletContext();
  const firstName = customer?.firstName?.trim() || 'there';
  const orders = customer?.orders?.nodes ?? [];
  const addresses = customer?.addresses?.nodes ?? [];
  const latestOrder = orders[0];
  const defaultAddress = customer?.defaultAddress;

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden min-w-0">
      <AccountPageHeader
        eyebrow="Account overview"
        title={`Hello, ${firstName}.`}
        description="Everything connected to your UniinX membership—orders, delivery details, and profile—in one quiet place."
        action={
          <Link to="/collections/all" className={accountPrimaryButton}>
            Continue shopping
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Orders" value={customer?.orders?.pageInfo?.hasNextPage ? `${orders.length}+` : orders.length} />
        <Metric label="Saved addresses" value={addresses.length} />
        <Metric label="Member status" value="Verified" compact />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <Reveal variant="card">
          <AccountPanel className="h-full">
            <div className="flex items-center justify-between gap-4">
              <AccountPanelLabel>Latest order</AccountPanelLabel>
              {latestOrder ? (
                <Link to="/account/orders" className="text-xs font-semibold underline decoration-black/20 underline-offset-4">
                  View all
                </Link>
              ) : null}
            </div>

            {latestOrder ? (
              <div className="mt-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-medium tracking-[-0.035em]">Order #{latestOrder.number}</p>
                    <p className="mt-2 text-xs text-black/45">
                      {formatDate(latestOrder.processedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusPill>{formatStatus(latestOrder.financialStatus)}</StatusPill>
                    <StatusPill tone="dark">{formatStatus(latestOrder.fulfillmentStatus)}</StatusPill>
                  </div>
                </div>

                <div className="mt-7 flex gap-3 overflow-x-auto pb-1">
                  {(latestOrder.lineItems?.nodes ?? []).slice(0, 4).map((item) => (
                    <div key={item.id} className="relative size-20 shrink-0 overflow-hidden rounded-[14px] border border-black/8 bg-white">
                      {item.image ? (
                        <Image data={item.image} sizes="80px" className="size-full object-cover" />
                      ) : (
                        <span className="grid size-full place-items-center text-[10px] uppercase tracking-widest text-black/25">UniinX</span>
                      )}
                      <span className="absolute bottom-1 right-1 rounded-full bg-black px-1.5 py-0.5 text-[9px] text-white">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="text-xs text-black/45">Order total</span>
                  <strong className="text-base">
                    <Money data={latestOrder.totalPrice} />
                  </strong>
                </div>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-start justify-center">
                <p className="text-2xl font-medium tracking-[-0.035em]">Your first piece starts here.</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                  Explore clothing shaped by the languages and scripts that feel like home.
                </p>
                <Link to="/collections/all" className={`${accountPrimaryButton} mt-6`}>
                  Explore collections
                </Link>
              </div>
            )}
          </AccountPanel>
        </Reveal>

        <Reveal variant="card" delay={80}>
          <AccountPanel className="h-full">
            <div className="flex items-center justify-between gap-4">
              <AccountPanelLabel>Default delivery address</AccountPanelLabel>
              <Link to="/account/addresses" className="text-xs font-semibold underline decoration-black/20 underline-offset-4">
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <address className="mt-8 not-italic text-sm leading-7 text-black/62">
                <strong className="block text-lg font-medium text-black">
                  {defaultAddress.firstName} {defaultAddress.lastName}
                </strong>
                {defaultAddress.company ? <span className="block">{defaultAddress.company}</span> : null}
                <span className="mt-3 block">{defaultAddress.address1}</span>
                {defaultAddress.address2 ? <span className="block">{defaultAddress.address2}</span> : null}
                <span className="block">
                  {[defaultAddress.city, defaultAddress.zoneCode, defaultAddress.zip]
                    .filter(Boolean)
                    .join(', ')}
                </span>
                <span className="block">{defaultAddress.territoryCode}</span>
                {defaultAddress.phoneNumber ? <span className="mt-3 block">{defaultAddress.phoneNumber}</span> : null}
              </address>
            ) : (
              <div className="flex min-h-64 flex-col items-start justify-center">
                <p className="text-xl font-medium tracking-[-0.025em]">No address saved yet.</p>
                <p className="mt-3 text-sm leading-6 text-black/50">
                  Save an address now for a faster checkout later.
                </p>
                <Link to="/account/addresses" className={`${accountSecondaryButton} mt-6`}>
                  Add an address
                </Link>
              </div>
            )}
          </AccountPanel>
        </Reveal>
      </div>

      <Reveal>
        <section>
          <AccountPanelLabel>Quick access</AccountPanelLabel>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <QuickLink to="/account/orders" number="01" label="Orders & tracking" />
            <QuickLink to="/account/profile" number="02" label="Profile & addresses" />
            <QuickLink to="/account/security" number="03" label="Security & sign-in" />
            <QuickLink to="/account/policies" number="04" label="Store policies" />
            <QuickLink to="/account/support" number="05" label="Returns & support" />
            <QuickLink to="/account/wishlist" number="06" label="Saved wishlist" />
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function Metric({label, value, compact = false}) {
  return (
    <Reveal variant="card">
      <div className="rounded-[18px] border border-black/10 bg-white px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/38">{label}</p>
        <p className={`mt-3 font-medium tracking-[-0.04em] ${compact ? 'text-2xl' : 'text-4xl'}`}>{value}</p>
      </div>
    </Reveal>
  );
}

function QuickLink({to, number, label}) {
  return (
    <Link
      to={to}
      className="group flex min-h-20 sm:min-h-24 flex-col justify-between rounded-[16px] border border-black/10 bg-white p-4 text-left transition-[transform,background-color,color] hover:-translate-y-0.5 hover:bg-black hover:text-white sm:rounded-[18px] sm:p-5"
    >
      <span className="text-[9px] tracking-[0.18em] text-current opacity-40">{number}</span>
      <span className="mt-2 flex items-end justify-between gap-2 text-xs font-semibold sm:text-sm">
        <span>{label}</span> <span className="text-base transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function StatusPill({children, tone = 'light'}) {
  return (
    <span className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${tone === 'dark' ? 'bg-black text-white' : 'border border-black/12 bg-white text-black/55'}`}>
      {children}
    </span>
  );
}

function formatStatus(value) {
  return value ? value.toLowerCase().replaceAll('_', ' ') : 'Pending';
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

/** @typedef {import('./+types/account._index').Route} Route */
