import {Reveal} from '~/components/motion/Reveal.jsx';
import {Link} from 'react-router';
import {Await} from 'react-router';
import {Suspense} from 'react';
import {LANGUAGE_NAMES, LocalizedLogo} from './LocalizedLogo.jsx';

const LOGO_LANGUAGES = Object.entries(LANGUAGE_NAMES).map(([id, label]) => ({id, label}));

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
      {label: 'Returns & refunds', to: '/account/support?category=Refund%20or%20Cancellation'},
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

export function Footer({language, onLanguageChange, isLoggedIn = false, onSignIn}) {
  return (
    <Reveal as="footer" className="px-6 md:px-14 py-16 bg-brand-bg-light border-t border-black/10 transition-colors duration-200">

      {/* Brand logo closer */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <LocalizedLogo
          language={language}
          className="h-10 w-auto mb-4 transition-all duration-200"
        />
        <p className="font-work text-xs tracking-[0.2em] text-black/50 uppercase">
          Clothes in your Language
        </p>
      </div>

      {/* Interactive Script Carousel Language Switcher */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <span className="font-work text-[9px] tracking-widest text-black/40 uppercase block text-center mb-6">
          Select Design Language / भारतीय भाषाएं
        </span>

        {/* Horizontal Script Row */}
        <div className="flex items-center justify-start md:justify-center gap-6 overflow-x-auto pb-4 scrollbar-none mask-image-horizontal">
          {LOGO_LANGUAGES.map((lang) => {
            const isActive = lang.id === language;
            return (
              <button
                key={lang.id}
                onClick={() => onLanguageChange?.(lang.id)}
                className={`flex flex-col items-center justify-center min-w-[124px] min-h-[72px] px-3 py-2 focus:outline-none transition-all duration-300 rounded-md border ${
                  isActive
                    ? 'border-brand-accent bg-brand-surface-light'
                    : 'border-transparent hover:bg-black/5'
                }`}
                id={`footer-lang-${lang.id}`}
              >
                <span className="h-9 w-[108px] flex items-center justify-center overflow-visible" aria-hidden="true">
                  <LocalizedLogo
                    language={lang.id}
                    alt=""
                    className={`block max-h-8 max-w-[108px] w-auto h-auto object-contain transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-55'}`}
                  />
                </span>
                <span className="font-work text-[9px] tracking-wide text-black/40 mt-1 uppercase">
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <nav
        aria-label="Footer"
        className="w-full max-w-5xl mx-auto mb-14 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 border-y border-black/10 py-10"
      >
        {FOOTER_LINKS.map((group) => (
          <section key={group.title} aria-labelledby={`footer-${group.title.toLowerCase()}`}>
            <h2
              id={`footer-${group.title.toLowerCase()}`}
              className="font-work text-[10px] tracking-[0.18em] uppercase text-black mb-5"
            >
              {group.title}
            </h2>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <AccountAwareFooterLink link={link} isLoggedIn={isLoggedIn} onSignIn={onSignIn} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      {/* Footer bottom metadata */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-work text-[10px] tracking-wide text-black/45 text-center md:text-left">
          © {new Date().getFullYear()} UniinX. Rooted in Indian language, craft &amp; culture. Made for India &amp; the world.
        </p>
        <p className="font-marcellus text-xs tracking-[0.1em] text-black">
          To this country &amp; its people
        </p>
        <Suspense fallback={<FooterAccountLink loggedIn={false} onSignIn={onSignIn} />}>
          <Await resolve={isLoggedIn}>
            {(loggedIn) => <FooterAccountLink loggedIn={loggedIn} onSignIn={onSignIn} />}
          </Await>
        </Suspense>
      </div>
    </Reveal>
  );
}

export default Footer;

function AccountAwareFooterLink({link, isLoggedIn, onSignIn}) {
  const content = (loggedIn) => (
    <Link
      to={link.to}
      prefetch="intent"
      onClick={(event) => {
        if (loggedIn || !link.to.startsWith('/account/') || !onSignIn) return;
        event.preventDefault();
        onSignIn(link.to);
      }}
      className="inline-flex min-h-6 items-center font-work text-xs text-black/55 hover:text-brand-accent transition-colors"
    >
      {link.label}
    </Link>
  );
  if (!link.to.startsWith('/account/')) return content(true);
  return (
    <Suspense fallback={content(false)}>
      <Await resolve={isLoggedIn}>{content}</Await>
    </Suspense>
  );
}

function FooterAccountLink({loggedIn, onSignIn}) {
  if (loggedIn) {
    return <Link to="/account" className="font-work text-[10px] tracking-wide uppercase text-brand-accent">My account</Link>;
  }
  return (
    <Link
      to="/account/login?return_to=%2Faccount"
      onClick={(event) => {
        if (!onSignIn) return;
        event.preventDefault();
        onSignIn('/account');
      }}
      className="font-work text-[10px] tracking-wide uppercase text-brand-accent"
    >
      Sign in / Sign up
    </Link>
  );
}
