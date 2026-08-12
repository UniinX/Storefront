/**
 * Figma-led responsive storefront header with a Little-Pebble-style mega menu.
 */
import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Link, useLocation} from 'react-router';
import {Image, useOptimisticCart} from '@shopify/hydrogen';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {LANGUAGES} from '~/components/ds/index.js';
import {LocalizedLogo} from './LocalizedLogo.jsx';

const MotionLink = motion.create(Link);

const QUICK_LINKS = [
  {to: '/collections/all?sort=newest', label: 'New Arrivals'},
  {to: '/collections/all?sort=featured', label: 'Best Sellers'},
  {to: '/collections/men', label: 'Men'},
  {to: '/collections/women', label: 'Women'},
  {to: '/collections/accessories', label: 'Accessories'},
  {to: '/collections/all', label: 'Shop All'},
];

const FALLBACK_THEMES = [
  'Solids',
  'Antariksham',
  'Language Editions',
  'Essentials',
];

// Hysteresis band around the compact-header trigger point so scroll jitter
// (momentum/rubber-banding near the boundary) can't flap isCompact back and
// forth mid-scroll — that flapping was what caused the jerk once scrolling stopped.
const COMPACT_ENTER_AT = 72;
const COMPACT_EXIT_AT = 40;

export function Header({
  cart,
  language = 'english',
  onLanguageChange,
  isLoggedIn,
  megaMenuProducts = [],
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const {pathname} = useLocation();
  const reduceMotion = useReducedMotion();
  const {scrollY} = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });
  const shopTriggerRef = useRef(null);
  const themes = deriveMenuThemes(megaMenuProducts);
  const promo = megaMenuProducts.find((product) => product.featuredImage);

  useMotionValueEvent(smoothScrollY, 'change', (latest) => {
    setIsCompact((current) => {
      if (current && latest <= COMPACT_EXIT_AT) return false;
      if (!current && latest >= COMPACT_ENTER_AT) return true;
      return current;
    });
  });

  useEffect(() => {
    setIsCompact(window.scrollY > COMPACT_EXIT_AT);
  }, [pathname]);

  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setOpenMenu(null);
      shopTriggerRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [openMenu]);

  useEffect(() => {
    if (openMenu !== 'mobile') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMenu]);

  const toggleMenu = (menu) =>
    setOpenMenu((current) => (current === menu ? null : menu));

  return (
    <>
      <AnimatePresence>
        {openMenu && (
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: reduceMotion ? 0.1 : 0.25}}
            className="fixed inset-0 z-50 cursor-default bg-black/60"
            onClick={() => setOpenMenu(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={
          reduceMotion
            ? {duration: 0}
            : {type: 'spring', stiffness: 320, damping: 34, mass: 0.8}
        }
        className={`pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center ${isCompact ? 'px-2 pt-[max(8px,env(safe-area-inset-top))] sm:px-6 sm:pt-[max(12px,env(safe-area-inset-top))] lg:px-10 lg:pt-5' : 'px-0 pt-0'}`}
      >
        <motion.header
          layout
          data-header-state={isCompact ? 'compact' : 'full'}
          className={`pointer-events-auto relative w-full border bg-white/95 backdrop-blur-xl ${isCompact ? 'max-w-[1320px] rounded-[18px] border-black/10 shadow-[0_12px_38px_rgba(0,0,0,0.10)]' : 'max-w-none rounded-none border-transparent shadow-none'}`}
        >
          <motion.div
            layout
            className={`grid items-center lg:grid-cols-[1fr_auto_1fr] ${isCompact ? 'h-[60px] grid-cols-[44px_minmax(0,1fr)_44px] px-2 sm:h-[68px] sm:grid-cols-[144px_minmax(0,1fr)_144px] sm:px-4 lg:h-[72px] lg:px-8' : 'h-[calc(64px+env(safe-area-inset-top))] grid-cols-[44px_minmax(0,1fr)_44px] px-2 pt-[env(safe-area-inset-top)] sm:h-[calc(76px+env(safe-area-inset-top))] sm:grid-cols-[144px_minmax(0,1fr)_144px] sm:px-5 lg:h-[92px] lg:px-[60px] lg:pt-0'}`}
          >
            <nav
              aria-label="Primary"
              className="hidden items-center gap-1 lg:flex"
            >
              <button
                ref={shopTriggerRef}
                type="button"
                aria-expanded={openMenu === 'shop'}
                aria-controls="desktop-shop-menu"
                onClick={() => toggleMenu('shop')}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${openMenu === 'shop' ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
              >
                Shop <ChevronDown />
              </button>
              <Link
                className="inline-flex min-h-11 items-center px-4 text-sm font-medium hover:text-black/55"
                to="/collections"
              >
                Collections
              </Link>
              <Link
                className="inline-flex min-h-11 items-center px-4 text-sm font-medium hover:text-black/55"
                to="/pages/about"
              >
                Pages
              </Link>
              <button
                type="button"
                aria-expanded={openMenu === 'language'}
                onClick={() => toggleMenu('language')}
                className="inline-flex min-h-11 items-center gap-2 px-4 text-sm font-medium hover:text-black/55"
              >
                Language <ChevronDown />
              </button>
            </nav>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={openMenu === 'mobile'}
              aria-controls="mobile-navigation"
              onClick={() => toggleMenu('mobile')}
              className="grid size-11 shrink-0 place-items-center justify-self-start rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:hidden"
            >
              <MenuIcon />
            </button>

            <Link
              to="/"
              aria-label="UniinX home"
              className="min-w-0 max-w-full justify-self-center px-1"
            >
              <LocalizedLogo
                language={language}
                className="h-6 w-auto max-w-[min(42vw,132px)] object-contain sm:h-7 sm:max-w-[150px] lg:h-8 lg:max-w-[190px]"
              />
            </Link>

            <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-0 lg:gap-2">
              <form
                action="/search"
                method="get"
                role="search"
                className="hidden items-center border-b border-black/35 xl:flex"
              >
                <label htmlFor="header-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="header-search"
                  name="q"
                  type="search"
                  placeholder="What are you looking for?"
                  className="h-11 w-56 border-0 bg-transparent px-2 text-sm outline-none placeholder:text-black/55"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="grid size-11 place-items-center"
                >
                  <SearchIcon />
                </button>
              </form>
              <Link
                to="/search"
                aria-label="Search"
                className="hidden size-11 place-items-center sm:grid xl:hidden"
              >
                <SearchIcon />
              </Link>
              <Suspense
                fallback={<SignedOutAccount pathname={pathname} />}
              >
                <Await resolve={isLoggedIn}>
                  {(loggedIn) =>
                    loggedIn ? (
                      <Link
                        to="/account"
                        aria-label="Account dashboard"
                        className="hidden size-11 place-items-center sm:grid"
                      >
                        <AccountIcon />
                      </Link>
                    ) : (
                      <SignedOutAccount pathname={pathname} />
                    )
                  }
                </Await>
              </Suspense>
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative grid size-11 place-items-center"
              >
                <CartIcon />
                <Suspense fallback={null}>
                  <Await resolve={cart}>
                    {(resolvedCart) => <CartBadge cart={resolvedCart} />}
                  </Await>
                </Suspense>
              </Link>
            </div>
          </motion.div>

          <AnimatePresence>
            {openMenu === 'shop' && (
              <MegaMenu
                key="shop-menu"
                id="desktop-shop-menu"
                themes={themes}
                promo={promo}
                onClose={() => setOpenMenu(null)}
              />
            )}
            {openMenu === 'language' && (
              <LanguageMenu
                key="language-menu"
                language={language}
                onLanguageChange={onLanguageChange}
                onClose={() => setOpenMenu(null)}
              />
            )}
          </AnimatePresence>
        </motion.header>
      </motion.div>

      <AnimatePresence>
        {openMenu === 'mobile' && (
          <MobileNavigation
            key="mobile-menu"
            language={language}
            themes={themes}
            promo={promo}
            onLanguageChange={onLanguageChange}
            onClose={() => setOpenMenu(null)}
            pathname={pathname}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MegaMenu({id, themes, promo, onClose}) {
  return (
    <motion.div
      id={id}
      initial={{opacity: 0, y: -10, scale: 0.985}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, y: -8, scale: 0.99}}
      transition={{duration: 0.28, ease: [0.16, 0.84, 0.32, 1]}}
      className="absolute inset-x-0 top-[calc(100%+8px)] hidden overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.18)] lg:grid lg:grid-cols-[0.8fr_1.25fr_1.15fr]"
    >
      <nav aria-label="Shop shortcuts" className="border-r border-black/10 p-8">
        <ul className="space-y-1">
          {QUICK_LINKS.map((item, index) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className={`inline-flex min-h-11 items-center text-[clamp(18px,1.6vw,24px)] font-semibold ${index === 0 ? 'underline underline-offset-8' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-2 gap-x-7 gap-y-5 p-8">
        {themes.map((theme) => (
          <Link
            key={theme.key}
            to={theme.to}
            aria-label={theme.label}
            onClick={onClose}
            className="group flex min-w-0 items-center gap-4"
          >
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-[#f15353]">
              {theme.image ? (
                <Image
                  data={theme.image}
                  alt=""
                  sizes="56px"
                  className="size-full object-contain p-1"
                />
              ) : (
                <span className="text-lg font-semibold text-black/25">
                  {theme.label[0]}
                </span>
              )}
            </span>
            <span className="truncate text-base font-medium group-hover:underline">
              {theme.label}
            </span>
          </Link>
        ))}
      </div>

      <PromoTile product={promo} className="m-7 ml-0" />
    </motion.div>
  );
}

function LanguageMenu({language, onLanguageChange, onClose}) {
  return (
    <motion.div
      initial={{opacity: 0, y: -10, scale: 0.985}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, y: -8, scale: 0.99}}
      className="absolute right-40 top-[calc(100%+8px)] hidden w-[560px] grid-cols-2 gap-2 rounded-[18px] border border-black/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] lg:grid"
    >
      {LANGUAGES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            onLanguageChange?.(item.id);
            onClose();
          }}
          className={`flex min-h-14 items-center justify-between rounded-[12px] px-4 text-left ${language === item.id ? 'bg-black text-white' : 'hover:bg-black/5'}`}
        >
          <span className="text-sm font-medium">{item.label}</span>
          <span style={{fontFamily: `var(--font-${item.font})`}}>
            {item.native}
          </span>
        </button>
      ))}
    </motion.div>
  );
}

function MobileNavigation({
  language,
  themes,
  promo,
  onLanguageChange,
  onClose,
  pathname,
}) {
  return (
    <motion.div
      id="mobile-navigation"
      initial={{opacity: 0, y: 24, scale: 0.985}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, y: 18, scale: 0.99}}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
      className="fixed inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] top-[calc(72px+env(safe-area-inset-top))] z-[80] overflow-y-auto overscroll-contain rounded-[22px] border border-black/10 bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:inset-x-6 sm:top-[calc(88px+env(safe-area-inset-top))] sm:p-6 lg:hidden"
    >
      <div className="sticky top-0 z-10 -mx-1 mb-4 flex items-center justify-between bg-white/95 px-1 pb-3 backdrop-blur-xl">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
          Menu
        </span>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full bg-black text-xl text-white"
        >
          ×
        </button>
      </div>
      <form
        action="/search"
        method="get"
        role="search"
        className="mb-5 flex items-center rounded-full border border-black/12 bg-black/[0.025] pl-4 sm:hidden"
      >
        <label htmlFor="mobile-menu-search" className="sr-only">
          Search products
        </label>
        <input
          id="mobile-menu-search"
          name="q"
          type="search"
          placeholder="Search products"
          className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          aria-label="Search products"
          className="grid size-12 shrink-0 place-items-center"
        >
          <SearchIcon />
        </button>
      </form>

      <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-x-4">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex min-h-12 items-center border-b border-black/10 text-[15px] font-semibold sm:text-lg"
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/collections"
          onClick={onClose}
          className="flex min-h-12 items-center border-b border-black/10 text-[15px] font-semibold sm:text-lg"
        >
          Collections
        </Link>
      </nav>

      <section className="py-6" aria-labelledby="mobile-theme-heading">
        <h2
          id="mobile-theme-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45"
        >
          Collections
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <Link
              key={theme.key}
              to={theme.to}
              aria-label={theme.label}
              onClick={onClose}
              className="flex min-h-14 items-center rounded-[12px] bg-[#f15353] p-3 text-sm font-semibold"
            >
              {theme.label}
            </Link>
          ))}
        </div>
      </section>

      <section
        className="border-t border-black/10 py-6"
        aria-labelledby="mobile-language-heading"
      >
        <h2
          id="mobile-language-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45"
        >
          Language
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LANGUAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onLanguageChange?.(item.id);
                onClose();
              }}
              className={`min-h-12 rounded-[10px] border px-3 text-left text-xs ${language === item.id ? 'border-black bg-black text-white' : 'border-black/15'}`}
            >
              {item.label}
              <span
                className="mt-1 block text-sm"
                style={{fontFamily: `var(--font-${item.font})`}}
              >
                {item.native}
              </span>
            </button>
          ))}
        </div>
      </section>

      <PromoTile product={promo} compact />
      <Link
        to={`/account/login?return_to=${encodeURIComponent(pathname)}`}
        onClick={onClose}
        className="mt-5 flex min-h-12 items-center justify-center rounded-full border border-black text-sm font-semibold"
      >
        Sign in / Account
      </Link>
    </motion.div>
  );
}

function PromoTile({product, className = '', compact = false}) {
  return (
    <MotionLink
      to={product ? `/products/${product.handle}` : '/collections/all'}
      whileHover={{y: -4, scale: 1.008}}
      whileTap={{scale: 0.99}}
      className={`relative flex overflow-hidden rounded-[20px] bg-[#9abbb3] ${compact ? 'min-h-48 p-5' : 'min-h-64 p-7'} ${className}`}
    >
      {product?.featuredImage ? (
        <Image
          data={product.featuredImage}
          alt=""
          sizes="420px"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <span className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      <span className="relative mt-auto text-white">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em]">
          New collection
        </span>
        <span className="mt-3 block max-w-56 text-3xl font-semibold leading-tight">
          {product?.title || 'Campaign placeholder'}
        </span>
        <span className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-black">
          Shop Now →
        </span>
      </span>
    </MotionLink>
  );
}

function deriveMenuThemes(products) {
  const themes = new Map();
  for (const product of products) {
    const label = product.collectionName?.value?.trim();
    if (!label || themes.has(label.toLowerCase())) continue;
    themes.set(label.toLowerCase(), {
      key: label.toLowerCase(),
      label,
      image: product.featuredImage,
      to: `/collections/all?theme=${encodeURIComponent(label)}`,
    });
    if (themes.size === 8) break;
  }
  if (themes.size) return [...themes.values()];
  return FALLBACK_THEMES.map((label) => ({
    key: label.toLowerCase(),
    label,
    image: null,
    to: `/collections/all?theme=${encodeURIComponent(label)}`,
  }));
}

function SignedOutAccount({pathname}) {
  return (
    <Link
      to={`/account/login?return_to=${encodeURIComponent(pathname)}`}
      aria-label="Sign in"
      className="hidden size-11 place-items-center sm:grid"
    >
      <AccountIcon />
    </Link>
  );
}

function CartBadge({cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  if (!count) return null;
  return (
    <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-black text-[9px] text-white">
      {count}
    </span>
  );
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.7L21 8H7" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export default Header;
