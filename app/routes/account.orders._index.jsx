import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import {useRef} from 'react';
import {
  Money,
  Image,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {
  AccountEmptyState,
  AccountPageHeader,
  accountPrimaryButton,
  accountSecondaryButton,
} from '~/components/account/AccountUI.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Orders'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  /** @type {LoaderReturnData} */
  const {customer, filters} = useLoaderData();
  const {orders} = customer;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Order history"
        title="Your orders"
        description="Track delivery progress, review order totals, and revisit every UniinX piece connected to your account."
      />

      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

/**
 * @param {{
 *   orders: CustomerOrdersFragment['orders'];
 *   filters: OrderFilterParams;
 * }}
 */
function OrdersTable({orders, filters}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

/**
 * @param {{hasFilters?: boolean}}
 */
function EmptyOrders({hasFilters = false}) {
  return (
    <AccountEmptyState
      title={hasFilters ? 'No matching orders' : 'No orders yet'}
      description={
        hasFilters
          ? 'Try another order or confirmation number.'
          : 'Your order history will appear here after your first UniinX purchase.'
      }
      action={hasFilters ? (
        <Link
          to="/account/orders"
          className={accountSecondaryButton}
        >
          Clear filters
        </Link>
      ) : (
        <Link
          to="/collections/all"
          className={accountPrimaryButton}
        >
          Start shopping
        </Link>
      )}
    />
  );
}

/**
 * @param {{
 *   currentFilters: OrderFilterParams;
 * }}
 */
function OrderSearchForm({currentFilters}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="uniinx-account-form flex flex-col gap-4 rounded-[22px] border border-black/10 bg-white p-5"
      aria-label="Search orders"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="search-order-name" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Order Number
          </label>
          <input
            id="search-order-name"
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="search-confirmation" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Confirmation Number
          </label>
          <input
            id="search-confirmation"
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {hasFilters && (
          <button
            type="button"
            disabled={isSearching}
            onClick={() => {
              setSearchParams(new URLSearchParams());
              formRef.current?.reset();
            }}
            className="px-5 py-2 rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 font-work text-[10px] tracking-wider uppercase hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}

/**
 * @param {{order: OrderItemFragment}}
 */
function OrderItem({order}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  // Status badging style helpers
  const financialBadge = order.financialStatus === 'PAID'
    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';

  const fulfillmentBadge = fulfillmentStatus === 'FULFILLED'
    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-black/5 dark:border-white/5 rounded-xl hover:border-black/10 dark:hover:border-white/10 transition-colors duration-200 gap-4">
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="font-marcellus text-base text-black dark:text-white font-medium hover:underline"
          >
            #{order.number}
          </Link>
          <span className="font-work text-[9px] text-black/40 dark:text-white/30 uppercase">
            {new Date(order.processedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {order.confirmationNumber && (
          <span className="font-work text-[10px] text-black/40 dark:text-white/45">
            Confirmation: {order.confirmationNumber}
          </span>
        )}

        {/* Thumbnails Row */}
        {order.lineItems?.nodes && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 mt-2 scrollbar-none">
            {order.lineItems.nodes.map((item) => (
              <div key={item.id} className="relative w-10 h-10 rounded bg-white dark:bg-black border border-black/5 dark:border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.image ? (
                  <Image data={item.image} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <span className="font-work text-[8px] text-black/20 dark:text-white/20">Fit</span>
                )}
                <span className="absolute bottom-0.5 right-0.5 bg-black/60 dark:bg-white/60 text-white dark:text-black font-work text-[7px] px-1 rounded-sm leading-tight">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${financialBadge}`}>
            {order.financialStatus}
          </span>
          {fulfillmentStatus && (
            <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${fulfillmentBadge}`}>
              {fulfillmentStatus}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-black/5 dark:border-white/5 pt-4 md:pt-0">
        <span className="font-work text-sm text-black dark:text-white font-semibold">
          <Money data={order.totalPrice} />
        </span>
        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="font-work text-[10px] tracking-wider uppercase text-brand-accent dark:text-brand-accent-light border-b border-brand-accent/20 dark:border-brand-accent-light/20 pb-0.5 hover:border-brand-accent dark:hover:border-brand-accent-light transition-all"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

/**
 * @typedef {{
 *   customer: CustomerOrdersFragment;
 *   filters: OrderFilterParams;
 * }} OrdersLoaderData
 */

/** @typedef {import('./+types/account.orders._index').Route} Route */
/** @typedef {import('~/lib/orderFilters').OrderFilterParams} OrderFilterParams */
/** @typedef {import('customer-accountapi.generated').CustomerOrdersFragment} CustomerOrdersFragment */
/** @typedef {import('customer-accountapi.generated').OrderItemFragment} OrderItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
