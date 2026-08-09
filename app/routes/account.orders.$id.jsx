import {redirect, useLoaderData, Link} from 'react-router';
import {Money, Image} from '@shopify/hydrogen';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  let orderId;
  try {
    orderId = atob(params.id);
  } catch {
    throw new Response('Order not found', {status: 404});
  }
  if (!orderId.startsWith('gid://shopify/Order/')) {
    throw new Response('Order not found', {status: 404});
  }
  const {data, errors} = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      orderId,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  const discountAmount = lineItems.reduce(
    (total, item) => total + Number(item.totalDiscount?.amount ?? 0),
    0,
  );
  const totalDiscount = discountAmount > 0
    ? {amount: discountAmount.toFixed(2), currencyCode: order.totalPrice.currencyCode}
    : null;

  return {
    order,
    lineItems,
    totalDiscount,
    fulfillmentStatus: order.fulfillmentStatus ?? 'UNFULFILLED',
  };
}

export default function OrderRoute() {
  /** @type {LoaderReturnData} */
  const {
    order,
    lineItems,
    totalDiscount,
    fulfillmentStatus,
  } = useLoaderData();

  // Extract tracking information from fulfillments
  const fulfillments = order.fulfillments?.nodes ?? [];
  const trackingInfo = fulfillments.flatMap((fulfillment) =>
    (fulfillment.trackingInformation ?? []).map((tracking) => ({
      ...tracking,
      key: `${fulfillment.id}-${tracking.number ?? tracking.url ?? tracking.company ?? 'tracking'}`,
    })),
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Back Button & Header */}
      <div>
        <Link
          to="/account/orders"
          className="font-work text-[9px] tracking-wider uppercase text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white mb-4 inline-flex items-center gap-1 transition-all"
        >
          ← Back to orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-marcellus text-2xl uppercase">
              Order {order.name}
            </h3>
            <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
              Placed on {new Date(order.processedAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
              order.financialStatus === 'PAID'
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
            }`}>
              {order.financialStatus}
            </span>
            <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-brand-accent/15 text-brand-accent dark:bg-brand-accent-light/15 dark:text-brand-accent-light`}>
              {fulfillmentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Tracking Card */}
      {trackingInfo.length > 0 && (
        <div className="border border-brand-accent/20 dark:border-brand-accent-light/20 bg-brand-accent/[0.02] dark:bg-brand-accent-light/[0.02] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-work text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-accent dark:text-brand-accent-light">
              Shipment Tracking
            </span>
            {trackingInfo.map((tracking) => (
              <span key={tracking.key} className="font-work text-xs text-black/70 dark:text-white/70">
                {tracking.company || 'Shipping Carrier'}: {tracking.number || 'Tracking pending'}
                {tracking.url ? <>{' '}<a className="underline" href={tracking.url} target="_blank" rel="noreferrer">Track package</a></> : null}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Line Items List */}
      <div className="flex flex-col gap-4">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/50 dark:text-white/40">
          Order Items
        </h4>
        <div className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-black/5 dark:divide-white/5 bg-black/[0.005] dark:bg-white/[0.005]">
          {lineItems.map((lineItem, index) => (
            <div key={lineItem.id || index} className="p-6 flex items-start gap-4">
              {lineItem?.image ? (
                <div className="w-16 h-16 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white dark:bg-black">
                  <Image data={lineItem.image} width={64} height={64} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/5 font-work text-[8px] text-black/40 dark:text-white/40">
                  Fit
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-marcellus text-sm text-black dark:text-white font-medium leading-snug">
                    {lineItem.title}
                  </span>
                  {lineItem.variantTitle && (
                    <span className="font-work text-[10px] text-black/50 dark:text-white/40 mt-0.5">
                      {lineItem.variantTitle}
                    </span>
                  )}
                  <span className="font-work text-[10px] text-black/40 dark:text-white/40 mt-1">
                    Qty: {lineItem.quantity}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-work text-xs text-black dark:text-white font-medium">
                    <Money data={lineItem.price} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Shipping Address */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005]">
          <h4 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">
            Shipping Destination
          </h4>
          {order?.shippingAddress ? (
            <div className="font-work text-xs leading-relaxed text-black/75 dark:text-white/70 font-light flex flex-col gap-1">
              <span className="font-medium text-black dark:text-white">
                {order.shippingAddress.name}
              </span>
              {order.shippingAddress.formatted && (
                <span>{order.shippingAddress.formatted}</span>
              )}
              {order.shippingAddress.formattedArea && (
                <span>{order.shippingAddress.formattedArea}</span>
              )}
            </div>
          ) : (
            <span className="font-work text-xs text-black/40 dark:text-white/40">
              No shipping destination defined.
            </span>
          )}
        </div>

        {/* Order Totals Summary */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005] flex flex-col gap-4 font-work text-xs">
          <h4 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-1">
            Cost Summary
          </h4>

          <div className="flex items-center justify-between text-black/70 dark:text-white/70 font-light">
            <span>Subtotal</span>
            <span>
              <Money data={order.subtotal} />
            </span>
          </div>

          {totalDiscount && (
            <div className="flex items-center justify-between text-green-600 dark:text-green-400 font-light">
              <span>Discount</span>
              <span>-<Money data={totalDiscount} /></span>
            </div>
          )}

          <div className="flex items-center justify-between text-black/70 dark:text-white/70 font-light">
            <span>Tax</span>
            <span>
              <Money data={order.totalTax} />
            </span>
          </div>

          <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 my-1" />

          <div className="flex items-center justify-between text-black dark:text-white font-semibold text-sm">
            <span>Total</span>
            <span>
              <Money data={order.totalPrice} />
            </span>
          </div>
        </div>

      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* External Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-work text-[10px] text-black/45 dark:text-white/45">
          Need status updates? Query Shopify direct details.
        </span>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/account/support?category=Refund+or+Cancellation&orderRef=${encodeURIComponent(order.number)}&subject=${encodeURIComponent(`Return request for order ${order.name}`)}`}
            className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 text-black/70 dark:text-white/60 font-work text-[10px] tracking-wider uppercase font-semibold"
          >
            Request Return
          </Link>
          <a
            target="_blank"
            href={order.statusPageUrl}
            rel="noreferrer"
            className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 text-black/70 hover:text-black dark:text-white/60 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-work text-[10px] tracking-wider uppercase font-semibold transition-all"
          >
            View Full Order Status Page →
          </a>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.orders.$id').Route} Route */
/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('customer-accountapi.generated').OrderQuery} OrderQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
