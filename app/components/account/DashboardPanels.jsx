import {useState} from 'react';

export function SecurityPanel({customer}) {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Login & Security
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Manage your login preferences, security credentials, and active studio sessions.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/[0.01] dark:bg-white/[0.01]">
          <span className="font-work text-[9px] tracking-wider text-black/40 dark:text-white/30 uppercase block mb-1">
            Connected Account
          </span>
          <span className="font-work text-sm text-black dark:text-white block font-medium">
            {customer?.emailAddress?.emailAddress ?? customer?.emailAddress ?? 'Connected via Shopify'}
          </span>
          <span className="font-work text-[10px] text-brand-accent dark:text-brand-accent-light mt-2 block">
            Verified Customer ID: #{customer?.id?.split('/').pop() || 'N/A'}
          </span>
        </div>

        <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/[0.01] dark:bg-white/[0.01]">
          <span className="font-work text-[9px] tracking-wider text-black/40 dark:text-white/30 uppercase block mb-1">
            Authentication Method
          </span>
          <span className="font-work text-sm text-black dark:text-white block font-medium">
            Shopify Passwordless Authentication
          </span>
          <p className="font-work text-[10px] text-black/40 dark:text-white/40 mt-2">
            Secure sign-in utilizing disposable one-time codes sent to your registered email address.
          </p>
        </div>
      </div>

      {/* Security Preferences */}
      <div className="flex flex-col gap-6">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/70 dark:text-white/70">
          Security Preferences
        </h4>

        {/* MFA Switch */}
        <div className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex flex-col gap-0.5 max-w-[80%]">
            <span className="font-work text-xs text-black dark:text-white font-medium">
              Multi-Factor Authentication (MFA)
            </span>
            <span className="font-work text-[10px] text-black/40 dark:text-white/40 leading-relaxed">
              Require an additional verification code from an authenticator app when logging in.
            </span>
          </div>
          <button
            onClick={() => setMfaEnabled(!mfaEnabled)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
              mfaEnabled ? 'bg-brand-accent dark:bg-brand-accent-light' : 'bg-black/10 dark:bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-black shadow transition-transform duration-200 ${
                mfaEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Login Alerts Switch */}
        <div className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex flex-col gap-0.5 max-w-[80%]">
            <span className="font-work text-xs text-black dark:text-white font-medium">
              Login Notification Alerts
            </span>
            <span className="font-work text-[10px] text-black/40 dark:text-white/40 leading-relaxed">
              Receive alert emails immediately when your account is logged into from a new browser or device.
            </span>
          </div>
          <button
            onClick={() => setLoginAlerts(!loginAlerts)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
              loginAlerts ? 'bg-brand-accent dark:bg-brand-accent-light' : 'bg-black/10 dark:bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-black shadow transition-transform duration-200 ${
                loginAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="flex flex-col gap-4">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/70 dark:text-white/70">
          Active Studio Sessions
        </h4>
        <div className="border border-black/5 dark:border-white/5 rounded-xl overflow-hidden bg-black/[0.005] dark:bg-white/[0.005]">
          <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.015]">
            <div className="flex flex-col">
              <span className="font-work text-xs text-black dark:text-white font-medium">
                Mac (Chrome Browser) — Current Session
              </span>
              <span className="font-work text-[10px] text-black/40 dark:text-white/40">
                New York, USA · IP: 192.168.1.1
              </span>
            </div>
            <span className="font-work text-[8px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              Active Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalitiesPanel() {
  const [openSection, setOpenSection] = useState('privacy');

  const policies = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content:
        'UniinX respects your personal data. We utilize industry-standard security protocols to verify login sessions and fulfill checkouts securely. We never sell, lease, or rent customer lists, sizing databases, or translation histories to third parties. Sizing information is stored locally and securely mapped to your verified customer token to facilitate a personalized custom fit recommendations model.',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      content:
        'By utilizing the UniinX Studio platform, you agree to our terms of order fulfillment, payment processing, and interactive custom sizing tools. All typographical scripts, layout assets, and branding logos (including the Signature Logo and transliterated scripts) are original intellectual property of UniinX. Sizing changes for custom orders are accepted up to 24 hours post-checkout.',
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      content:
        'Because our custom language fits are uniquely mapped to your script preferences, items custom transliterated with specific names/scripts are non-returnable unless defective. Standard collection garments (shirts, kurtas, hoodies, tees) are eligible for returns or exchanges within 14 days of receipt, provided they are unworn, unwashed, and retain original tags in minimal packaging.',
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      content:
        'We process and fulfill standard stock orders within 2-3 business days. Custom language-fitted garments take up to 7-10 days to manufacture and prepare for dispatch. All domestic shipping is carbon-neutral, and international packages are shipped via reputable express carriers with full tracking links available on your dashboard.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Legalities & Policies
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Review our terms of use, privacy statement, and customer service conditions.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      <div className="flex flex-col gap-4">
        {policies.map((policy) => {
          const isOpen = openSection === policy.id;
          return (
            <div
              key={policy.id}
              className="border border-black/5 dark:border-white/5 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenSection(isOpen ? '' : policy.id)}
                className="w-full flex items-center justify-between p-5 bg-black/[0.01] dark:bg-white/[0.01] text-left focus:outline-none cursor-pointer"
              >
                <span className="font-marcellus text-sm text-black dark:text-white uppercase tracking-wider font-light">
                  {policy.title}
                </span>
                <span className="text-xs text-black/40 dark:text-white/40">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="p-5 bg-white dark:bg-black border-t border-black/5 dark:border-white/5 font-work text-xs leading-relaxed text-black/70 dark:text-white/70 font-light">
                  {policy.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContactPanel({customer}) {
  const [category, setCategory] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Extract order names for dropdown
  const orders = customer?.orders?.nodes ?? [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 border border-brand-accent/20 dark:border-brand-accent-light/20 bg-brand-surface-light dark:bg-brand-surface-dark rounded-2xl text-center max-w-lg mx-auto animate-fade-in shadow-sm">
        <svg
          className="w-12 h-12 text-brand-accent dark:text-brand-accent-light mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3 className="font-marcellus text-xl text-black dark:text-white uppercase mb-2">
          Message Transmitted
        </h3>
        <p className="font-work text-xs text-black/60 dark:text-white/50 leading-relaxed mb-6">
          Your inquiry has been successfully sent to the UniinX studio support team. A representative will contact you at <strong>{customer?.emailAddress?.emailAddress ?? 'your email'}</strong> within 24 hours.
        </p>
        <button
          onClick={() => {
            setMessage('');
            setSubmitted(false);
          }}
          className="px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 font-work text-[10px] tracking-wider text-black dark:text-white uppercase hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Contact Studio Support
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Send a message directly to our customer support representatives.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        {/* Category Selection */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-category" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Inquiry Category
          </label>
          <select
            id="contact-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          >
            <option>Order Inquiry</option>
            <option>Custom Fit / Sizing</option>
            <option>Translation / Script Feedback</option>
            <option>General Feedback</option>
          </select>
        </div>

        {/* Conditional Order Selector */}
        {orders.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="contact-order" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Relate to Order (Optional)
            </label>
            <select
              id="contact-order"
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            >
              <option value="">Select an order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.name}>
                  {order.name} — {order.processedAt.split('T')[0]}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Input */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="contact-message" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Your Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your inquiry details..."
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-fit px-8 py-3.5 mt-2 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
