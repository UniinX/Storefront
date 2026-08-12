import {Await, Link} from 'react-router';
import {Suspense} from 'react';
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
    title: 'Help',
    links: [
      {label: 'Support', to: '/account/support'},
      {
        label: 'Returns & refunds',
        to: '/account/support?category=Refund%20or%20Cancellation',
      },
      {label: 'Orders', to: '/account/orders'},
      {label: 'Cart', to: '/cart'},
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
            <form
              className="mt-8 flex max-w-sm border-b border-white/45"
              action="#"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid size-12 place-items-center rounded-full text-lg"
              >
                →
              </button>
            </form>
          </Reveal>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
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
                <ul className="space-y-2.5">
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
        className="inline-flex min-h-6 items-center text-xs text-white/60 hover:text-white"
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
        className="font-medium uppercase tracking-[0.1em] text-white"
      >
        My account
      </Link>
    );
  return (
    <Link
      to="/account/login?return_to=%2Faccount"
      className="font-medium uppercase tracking-[0.1em] text-white"
    >
      Sign in / Sign up
    </Link>
  );
}

export default Footer;
