import {Link, useOutletContext} from 'react-router';
import {Money, Image} from '@shopify/hydrogen';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Account Overview'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export default function AccountOverview() {
  const {customer} = useOutletContext();

  const firstName = customer?.firstName ?? '';
  const fullName = firstName ? `${firstName}` : 'Studio Member';

  const orders = customer?.orders?.nodes ?? [];
  const orderCountLabel = customer?.orders?.pageInfo?.hasNextPage ? `${orders.length}+` : String(orders.length);
  const latestOrder = orders[0];

  const addresses = customer?.addresses?.nodes ?? [];
  const defaultAddress = customer?.defaultAddress;

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Greeting Banner */}
      <div>
        <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">
          Studio Dashboard
        </span>
        <h2 className="font-marcellus text-3xl md:text-4xl text-black dark:text-white uppercase font-light">
          Welcome, <span className="italic font-normal">{fullName}</span>
        </h2>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
          Review your linguistic collections, addresses, and order histories.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Latest Order Summary Card */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005] flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">
              Latest Shipment Status
            </h3>
            {latestOrder ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-marcellus text-base text-black dark:text-white font-medium">
                    Order #{latestOrder.number}
                  </span>
                  <span className="font-work text-[10px] text-black/40 dark:text-white/40">
                    {new Date(latestOrder.processedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  {latestOrder.lineItems?.nodes.map((item) => (
                    <div key={item.id} className="relative w-12 h-12 rounded-lg border border-black/5 dark:border-white/5 bg-white dark:bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image data={item.image} width={48} height={48} className="object-cover" />
                      ) : (
                        <span className="font-work text-[8px] text-black/20 dark:text-white/20">Fit</span>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 dark:bg-white/60 text-white dark:text-black font-work text-[8px] px-1 rounded-sm leading-tight">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                    latestOrder.financialStatus === 'PAID'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {latestOrder.financialStatus}
                  </span>
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                    latestOrder.fulfillmentStatus === 'FULFILLED'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40'
                  }`}>
                    {latestOrder.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <span className="font-work text-xs text-black/40 dark:text-white/40 mb-4 block">
                  You have not placed any orders yet.
                </span>
                <Link
                  to="/collections"
                  className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
          {latestOrder && (
            <Link
              to="/account/orders"
              className="font-work text-[10px] tracking-wider uppercase text-brand-accent dark:text-brand-accent-light border-b border-brand-accent/20 dark:border-brand-accent-light/20 pb-0.5 hover:border-brand-accent dark:hover:border-brand-accent-light w-fit mt-6 transition-all"
            >
              View all orders ({orderCountLabel})
            </Link>
          )}
        </div>

        {/* Saved Address Summary Card */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005] flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">
              Primary Address
            </h3>
            {defaultAddress ? (
              <div className="flex flex-col gap-2 font-work text-xs leading-relaxed text-black/70 dark:text-white/70 font-light">
                <span className="font-medium text-black dark:text-white block">
                  {defaultAddress.firstName} {defaultAddress.lastName}
                </span>
                {defaultAddress.company && <span>{defaultAddress.company}</span>}
                <span>{defaultAddress.address1}</span>
                {defaultAddress.address2 && <span>{defaultAddress.address2}</span>}
                <span>
                  {defaultAddress.city}, {defaultAddress.zoneCode} {defaultAddress.zip}
                </span>
                <span>{defaultAddress.territoryCode}</span>
                {defaultAddress.phoneNumber && <span className="block mt-2">{defaultAddress.phoneNumber}</span>}
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <span className="font-work text-xs text-black/40 dark:text-white/40 mb-4 block">
                  No default shipping addresses saved.
                </span>
                <Link
                  to="/account/addresses"
                  className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  Create Address
                </Link>
              </div>
            )}
          </div>
          {defaultAddress && (
            <Link
              to="/account/addresses"
              className="font-work text-[10px] tracking-wider uppercase text-brand-accent dark:text-brand-accent-light border-b border-brand-accent/20 dark:border-brand-accent-light/20 pb-0.5 hover:border-brand-accent dark:hover:border-brand-accent-light w-fit mt-6 transition-all"
            >
              Manage Saved Addresses ({addresses.length})
            </Link>
          )}
        </div>

      </div>

      {/* Quick Actions Footer Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/50 dark:text-white/40">
          Quick Studio Actions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionLink to="/account/orders" label="View orders" />
          <QuickActionLink to="/account/profile" label="Edit profile" />
          <QuickActionLink to="/account/addresses" label="Manage addresses" />
          <QuickActionLink to="/account/support" label="Contact support" />
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({to, label}) {
  return (
    <Link
      to={to}
      className="p-4 border border-black/5 dark:border-white/5 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/10 text-center font-work text-[10px] tracking-wider uppercase text-black dark:text-white font-medium transition-all"
    >
      {label}
    </Link>
  );
}

/** @typedef {import('./+types/account._index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
