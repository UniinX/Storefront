import {Await, Link} from 'react-router';
import {Suspense, useState} from 'react';
import {LocalizedLogo} from './LocalizedLogo.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      {label: 'All products', to: '/collections/all'},
      {label: 'Men', to: '/collections/men'},
      {label: 'Women', to: '/collections/women'},
      {label: 'Accessories', to: '/collections/accessories'},
    ],
  },
  {
    title: 'Explore',
    links: [
      {label: 'About', to: '/pages/about'},
      {label: 'Journal', to: '/blogs'},
      {label: 'FAQ', to: '/pages/faq'},
      {label: 'Size & Care', to: '/pages/size-care'},
    ],
  },
  {
    title: 'Help',
    links: [
      {label: 'Contact', to: '/pages/contact'},
      {label: 'Shipping & Returns', to: '/pages/shipping-returns'},
      {label: 'Account support', to: '/account/support'},
      {label: 'Orders', to: '/account/orders'},
    ],
  },
  {
    title: 'Legal',
    links: [
      {label: 'Refund policy', to: '/policies/refund-policy'},
      {label: 'Shipping policy', to: '/policies/shipping-policy'},
      {label: 'Privacy policy', to: '/policies/privacy-policy'},
      {label: 'Terms of service', to: '/policies/terms-of-service'},
      {label: 'All policies', to: '/policies'},
    ],
  },
];

export function Footer({language, isLoggedIn = false}) {
  return (
    <footer className="bg-[#121212] px-5 py-12 text-white sm:px-8 lg:px-[60px] lg:py-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <LocalizedLogo
              language={language}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
              Clothes in your Language
            </p>
            <NewsletterForm />
          </Reveal>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {FOOTER_LINKS.map((group, index) => (
              <Reveal
                as="section"
                delay={index * 70}
                key={group.title}
                aria-labelledby={`footer-${group.title.toLowerCase()}`}
              >
                <h2
                  id={`footer-${group.title.toLowerCase()}`}
                  className="mb-4 text-xs font-semibold"
                >
                  {group.title}
                </h2>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <AccountAwareFooterLink
                        link={link}
                        isLoggedIn={isLoggedIn}
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>

        <Reveal className="flex flex-col gap-3 border-t border-white/15 pt-6 text-[10px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} UniinX. Rooted in Indian language,
            craft &amp; culture. Made for India &amp; the world.
          </p>
          <Suspense fallback={<FooterAccountLink loggedIn={false} />}>
            <Await resolve={isLoggedIn}>
              {(loggedIn) => <FooterAccountLink loggedIn={loggedIn} />}
            </Await>
          </Suspense>
        </Reveal>
      </div>
    </footer>
  );
}

function AccountAwareFooterLink({link, isLoggedIn}) {
  const content = (loggedIn) => {
    const destination =
      loggedIn || !link.to.startsWith('/account/')
        ? link.to
        : `/account/login?return_to=${encodeURIComponent(link.to)}`;
    return (
      <Link
        to={destination}
        prefetch="intent"
        className="inline-flex min-h-11 items-center text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        {link.label}
      </Link>
    );
  };
  if (!link.to.startsWith('/account/')) return content(true);
  return (
    <Suspense fallback={content(false)}>
      <Await resolve={isLoggedIn}>{content}</Await>
    </Suspense>
  );
}

function FooterAccountLink({loggedIn}) {
  if (loggedIn)
    return (
      <Link
        to="/account"
        className="inline-flex min-h-11 items-center font-medium uppercase tracking-[0.1em] text-white"
      >
        My account
      </Link>
    );
  return (
    <Link
      to="/account/login?return_to=%2Faccount"
      className="inline-flex min-h-11 items-center font-medium uppercase tracking-[0.1em] text-white"
    >
      Sign in / Sign up
    </Link>
  );
}

export default Footer;

function NewsletterForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function subscribe(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch('/newsletter', {
        method: 'POST',
        body: new FormData(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error);
      form.reset();
      setStatus('success');
      setMessage('You’re on the list.');
    } catch (error) {
      setStatus('error');
      setMessage(error?.message || 'Signup failed. Please try again.');
    }
  }

  return (
    <form
      className="mt-8 max-w-sm"
      action="/newsletter"
      method="post"
      onSubmit={subscribe}
    >
      <div className="flex border-b border-white/45">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
        />
        <label className="sr-only">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe"
          className="grid size-12 place-items-center rounded-full text-lg disabled:opacity-50"
        >
          {status === 'submitting' ? '…' : '→'}
        </button>
      </div>
      {message ? (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`mt-3 text-xs ${status === 'error' ? 'text-red-300' : 'text-white/65'}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
