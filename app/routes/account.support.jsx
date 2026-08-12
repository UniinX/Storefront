import {useState} from 'react';
import {data, Form, useActionData, useNavigation, useOutletContext, useSearchParams} from 'react-router';
import {SUPPORT_CUSTOMER_QUERY} from '~/graphql/customer-account/SupportCustomerQuery';
import {AccountPageHeader} from '~/components/account/AccountUI.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Contact Support'}];
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
  if (!(await context.customerAccount.isLoggedIn())) {
    return data({success: false, error: 'Unauthorized'}, {status: 401});
  }
  const formData = await request.formData();
  
  const category = formData.get('category')?.toString();
  const orderRef = formData.get('orderRef')?.toString();
  const subject = formData.get('subject')?.toString();
  const message = formData.get('message')?.toString();
  const returnReason = formData.get('returnReason')?.toString();
  const requestedResolution = formData.get('requestedResolution')?.toString();
  const requestedItems = formData.get('requestedItems')?.toString();

  if (!category || !subject?.trim() || !message?.trim() || subject.length > 200 || message.length > 5000) {
    return data({success: false, error: 'Complete all fields using the allowed lengths.'}, {status: 400});
  }
  if (
    category === 'Refund or Cancellation' &&
    (!orderRef || orderRef === 'None' || !returnReason || !requestedResolution || !requestedItems?.trim())
  ) {
    return data({success: false, error: 'Select an order, items, reason, and requested resolution.'}, {status: 400});
  }
  if (!context.env.SUPPORT_WEBHOOK_URL) {
    return data({success: false, error: 'Support delivery is temporarily unavailable.'}, {status: 503});
  }

  const {data: customerData, errors: customerErrors} = await context.customerAccount.query(
    SUPPORT_CUSTOMER_QUERY,
    {variables: {language: context.customerAccount.i18n.language}},
  );
  const customer = customerData?.customer;
  if (customerErrors?.length || !customer) {
    return data({success: false, error: 'Unable to verify your customer account.'}, {status: 502});
  }
  const knownOrderNumbers = new Set((customer.orders?.nodes ?? []).map(({number}) => String(number)));
  if (orderRef && orderRef !== 'None' && !knownOrderNumbers.has(orderRef)) {
    return data({success: false, error: 'Select an order associated with your account.'}, {status: 400});
  }

  const requestId = crypto.randomUUID();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let response;
  try {
    response = await fetch(context.env.SUPPORT_WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Uniinx-Request-Id': requestId},
      signal: controller.signal,
      body: JSON.stringify({
        requestId,
        customerId: customer.id,
        customerEmail: customer.emailAddress?.emailAddress,
        category,
        orderRef,
        subject: subject.trim(),
        message: message.trim(),
        returnReason,
        requestedResolution,
        requestedItems: requestedItems?.trim(),
      }),
    });
  } catch {
    return data({success: false, error: 'Support delivery timed out. Please try again.'}, {status: 504});
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    return data({success: false, error: 'Support delivery failed. Please try again.'}, {status: 502});
  }
  return {success: true};
}

export default function AccountSupport() {
  const {customer} = useOutletContext();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'Order Status');

  const orders = customer?.orders?.nodes ?? [];
  const email = customer?.emailAddress?.emailAddress ?? '';

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Studio support"
        title="How can we help?"
        description="Tell us what happened and include the related order when possible. Your message is sent securely with your verified customer details."
      />

      {/* Integration Warnings & Status Alert */}
      {actionData?.error && (
        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400 font-work text-xs">
          {actionData.error}
        </div>
      )}
      {actionData?.success && (
        <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400 font-work text-xs">
          Your inquiry was sent successfully.
        </div>
      )}

      {/* Support Form */}
      <Form method="POST" className="uniinx-account-form flex max-w-2xl flex-col gap-5 rounded-[22px] border border-black/10 bg-[#faf9f6] p-5 sm:p-7">
        
        {/* Customer Email (Read-only) */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-email" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Your Email
          </label>
          <input
            id="contact-email"
            type="email"
            readOnly
            defaultValue={email}
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.05] dark:bg-white/[0.05] text-black/50 dark:text-white/40 text-sm font-work font-light focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-category" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Inquiry Category
          </label>
          <select
            id="contact-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          >
            <option value="Order Status">Order Status</option>
            <option value="Delivery Issue">Delivery Issue</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Wrong Product Received">Wrong Product Received</option>
            <option value="Size Issue">Size Issue</option>
            <option value="Refund or Cancellation">Refund or Cancellation</option>
            <option value="Product Question">Product Question</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {category === 'Refund or Cancellation' && (
          <fieldset className="flex flex-col gap-4 rounded-2xl border border-black/10 dark:border-white/10 p-5">
            <legend className="px-2 font-work text-[10px] uppercase tracking-wider">Return or cancellation details</legend>
            <label className="flex flex-col gap-1 font-work text-xs">
              Items and quantities
              <input name="requestedItems" required placeholder="Example: 1 x Classic T-Shirt, size M" className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent" />
            </label>
            <label className="flex flex-col gap-1 font-work text-xs">
              Reason
              <select name="returnReason" required className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent">
                <option value="">Select a reason</option>
                <option value="Size or fit">Size or fit</option>
                <option value="Damaged">Damaged</option>
                <option value="Wrong item">Wrong item</option>
                <option value="Changed mind">Changed mind</option>
                <option value="Cancel before fulfillment">Cancel before fulfillment</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 font-work text-xs">
              Requested resolution
              <select name="requestedResolution" required className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent">
                <option value="">Select a resolution</option>
                <option value="Refund">Refund</option>
                <option value="Exchange">Exchange</option>
                <option value="Store credit">Store credit</option>
                <option value="Cancellation">Cancellation</option>
              </select>
            </label>
          </fieldset>
        )}

        {/* Orders Selection */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-order" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Related Order
          </label>
          <select
            id="contact-order"
            name="orderRef"
            defaultValue={searchParams.get('orderRef') || 'None'}
            required
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          >
            <option value="None">Not related to a recent order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.number}>
                Order #{order.number} — {new Date(order.processedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-subject" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            defaultValue={searchParams.get('subject') || ''}
            required
            placeholder="Inquiry subject line"
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-message" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Please detail your support query..."
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit px-8 py-3.5 mt-2 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Transmitting...' : 'Send Inquiry'}
        </button>
      </Form>
    </div>
  );
}

/** @typedef {import('./+types/account.support').Route} Route */
