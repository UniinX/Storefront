/**
 * Figma-led responsive storefront header with a Little-Pebble-style mega menu.
 */
import {Suspense, useEffect, useState} from 'react';
import {Await, Link, useLocation} from 'react-router';
import {Image, useOptimisticCart} from '@shopify/hydrogen';
import {AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll} from 'framer-motion';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {LocalizedLogo} from './LocalizedLogo.jsx';
import {useWishlist} from '~/context/WishlistContext.jsx';
import {PUBLIC_PAGE_LINKS} from '~/components/content/PublicPages.jsx';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion.jsx';
import {categoryLabel, getProductCategory} from '~/lib/catalog.js';

const MotionLink = motion.create(Link);

const SHOP_DEPARTMENTS = [
  {
    key: 'men',
    label: 'Men',
    description: 'Everyday silhouettes made for movement.',
    to: '/collections/all?collection=men',
  },
  {
    key: 'women',
    label: 'Women',
    description: 'Contemporary essentials with a relaxed shape.',
    to: '/collections/all?collection=women',
  },
];

const FALLBACK_THEMES = [
  'Solids',
  'Antariksham',
  'Language Editions',
  'Essentials',
];

export function Header({
  cart,
  language = 'english',
  isLoggedIn,
  megaMenuProducts = [],
  megaMenuCollections = [],
}) {
  const [desktopMenu, setDesktopMenu] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {pathname} = useLocation();
  const reduceMotion = useReducedMotion();
  const {scrollY} = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    if (latest < 60 || desktopMenu || mobileOpen || isHovered) {
      setHidden(false);
    } else if (diff > 5 && latest > 80) {
      setHidden(true);
    } else if (diff < -5) {
      setHidden(false);
    }
  });

  const themes = deriveMenuThemes(megaMenuProducts);
  const promo = megaMenuProducts.find((product) => product.featuredImage);
  const departmentCategories = deriveDepartmentCategories(
    megaMenuProducts,
    megaMenuCollections,
  );

  useEffect(() => {
    setDesktopMenu('');
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (desktopMenu || mobileOpen || isHovered) {
      setHidden(false);
    }
  }, [desktopMenu, mobileOpen, isHovered]);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      {/* Top viewport hover trigger zone to reveal header when hidden */}
      <div
        className="fixed inset-x-0 top-0 z-[69] h-6 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        aria-hidden="true"
      />

      <AnimatePresence>
        {desktopMenu && (
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: reduceMotion ? 0.1 : 0.25}}
            className="fixed inset-0 z-50 cursor-default bg-black/60"
            onClick={() => setDesktopMenu('')}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={false}
        animate={{
          y: hidden && !isHovered && !desktopMenu && !mobileOpen ? '-120%' : '0%',
          opacity: hidden && !isHovered && !desktopMenu && !mobileOpen ? 0 : 1,
        }}
        transition={
          reduceMotion
            ? {duration: 0}
            : {type: 'spring', stiffness: 350, damping: 32, mass: 0.6}
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-[var(--header-inset)] pt-[max(var(--header-inset),env(safe-area-inset-top))]"
      >
        <motion.header
          layout
          data-header-state="floating"
          className="pointer-events-auto relative w-full max-w-[var(--content-max)] rounded-lg border border-border bg-surface/95 shadow-[var(--shadow-floating)] backdrop-blur-xl"
        >
          <motion.div
            layout
            className="grid h-[60px] grid-cols-[44px_minmax(0,1fr)_44px] items-center px-2 sm:h-[68px] sm:grid-cols-[144px_minmax(0,1fr)_144px] sm:px-4 lg:h-[72px] lg:grid-cols-[1fr_auto_1fr] lg:px-8"
          >
            <nav aria-label="Primary" className="hidden lg:block">
              <NavigationMenu.Root
                value={desktopMenu}
                onValueChange={setDesktopMenu}
                delayDuration={100}
                skipDelayDuration={200}
              >
                <NavigationMenu.List className="flex items-center gap-1">
                  {SHOP_DEPARTMENTS.map((department) => (
                    <NavigationMenu.Item
                      key={department.key}
                      value={department.key}
                    >
                      <NavigationMenu.Trigger
                        aria-label={department.label}
                        onFocus={() => setDesktopMenu(department.key)}
                        onPointerEnter={() => setDesktopMenu(department.key)}
                        className="group inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-focus-ring data-[state=open]:bg-primary data-[state=open]:text-primary-foreground xl:gap-2 xl:text-sm"
                      >
                        {department.label}
                        <ChevronDown />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="radix-navigation-content fixed left-1/2 top-[58px] hidden w-[calc(100vw-2*var(--header-inset))] max-w-[var(--content-max)] -translate-x-1/2 pt-9 lg:block">
                        <div className="overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-overlay)] lg:grid lg:grid-cols-[0.8fr_1.4fr_1fr]">
                          <DepartmentMenu
                            department={department}
                            categories={departmentCategories[department.key]}
                            promo={promo}
                            onClose={() => setDesktopMenu('')}
                          />
                        </div>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  ))}
                  <NavigationMenu.Item value="collections">
                    <NavigationMenu.Trigger
                      onFocus={() => setDesktopMenu('collections')}
                      onPointerEnter={() => setDesktopMenu('collections')}
                      className="group inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-focus-ring data-[state=open]:bg-primary data-[state=open]:text-primary-foreground xl:gap-2 xl:text-sm"
                    >
                      Collections <ChevronDown />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="radix-navigation-content fixed left-1/2 top-[58px] hidden w-[calc(100vw-2*var(--header-inset))] max-w-[var(--content-max)] -translate-x-1/2 pt-9 lg:block">
                      <div className="overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-[var(--shadow-overlay)] lg:grid lg:grid-cols-[0.8fr_1.4fr_1fr]">
                        <CollectionsMenu
                          themes={themes}
                          promo={promo}
                          onClose={() => setDesktopMenu('')}
                        />
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item value="more">
                    <NavigationMenu.Trigger className="group inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-medium text-foreground outline-none hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-focus-ring data-[state=open]:bg-primary data-[state=open]:text-primary-foreground xl:gap-2 xl:text-sm">
                      More <ChevronDown />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="radix-navigation-content fixed left-1/2 top-[58px] hidden w-[min(680px,calc(100vw-2*var(--header-inset)))] -translate-x-1/2 pt-9 lg:block">
                      <div className="overflow-hidden rounded-xl border border-border bg-border shadow-[var(--shadow-overlay)]">
                        <PagesMenu onClose={() => setDesktopMenu('')} />
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </nav>

            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                aria-controls="mobile-navigation"
                className="grid size-11 shrink-0 place-items-center justify-self-start rounded-full text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:hidden"
              >
                <MenuIcon />
              </button>
            </SheetTrigger>

            <Link
              to="/"
              aria-label="UniinX home"
              className="inline-flex min-h-11 min-w-0 max-w-full items-center justify-self-center px-1"
            >
              <LocalizedLogo
                language={language}
                className="h-6 w-auto max-w-[min(42vw,8.25rem)] object-contain sm:h-7 sm:max-w-[9.375rem] lg:h-8 lg:max-w-[11.875rem]"
              />
            </Link>

            <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-0 lg:gap-2">
              <form
                action="/search"
                method="get"
                role="search"
                className="hidden items-center border-b border-border-strong xl:flex"
              >
                <label htmlFor="header-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="header-search"
                  name="q"
                  type="search"
                  placeholder="What are you looking for?"
                  className="h-11 w-56 border-0 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
              <WishlistHeaderLink />
              <Suspense fallback={<SignedOutAccount pathname={pathname} />}>
                <Await resolve={isLoggedIn}>
                  {(loggedIn) =>
                    loggedIn ? (
                      <Link
                        to="/account"
                        aria-label="Account dashboard"
                        className="grid size-10 sm:size-11 place-items-center rounded-full transition-colors hover:bg-surface-subtle"
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
        </motion.header>
      </motion.div>

      <SheetContent
        id="mobile-navigation"
        aria-label="Mobile menu"
        className="inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] top-[calc(72px+env(safe-area-inset-top))] rounded-xl px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 sm:inset-x-6 sm:top-[calc(88px+env(safe-area-inset-top))] sm:p-6 lg:hidden"
      >
        <SheetTitle className="sr-only">Mobile menu</SheetTitle>
        <MobileNavigation
          departmentCategories={departmentCategories}
          themes={themes}
          promo={promo}
          onClose={() => setMobileOpen(false)}
          pathname={pathname}
        />
      </SheetContent>
    </Sheet>
  );
}

function DepartmentMenu({department, categories, promo, onClose}) {
  return (
    <>
      <section className="border-r border-border p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shop {department.label}
        </p>
        <h2 className="mt-4 text-[clamp(28px,3vw,44px)] font-semibold leading-[0.95] tracking-[-0.045em]">
          {department.label}
        </h2>
        <p className="mt-4 max-w-64 text-sm leading-6 text-muted-foreground">
          {department.description}
        </p>
        <Link
          to={department.to}
          onClick={onClose}
          className="mt-7 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          View all {department.label} →
        </Link>
      </section>

      <nav aria-label={`${department.label} categories`} className="p-8">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Categories
        </p>
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <Link
                key={category.label}
                to={category.to}
                onClick={onClose}
                className="group flex min-h-16 items-center justify-between rounded-lg border border-border bg-surface-subtle px-5 text-base font-semibold outline-none transition-colors hover:border-border-strong hover:bg-surface focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <span>
                  <span className="mr-3 text-[10px] font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {category.label}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Category collections will appear here when they are published in
            Shopify.
          </p>
        )}
      </nav>

      <PromoTile product={promo} className="m-7 ml-0" />
    </>
  );
}

function CollectionsMenu({themes, promo, onClose}) {
  return (
    <>
      <section className="border-r border-border p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Discover UniinX
        </p>
        <h2 className="mt-4 text-[clamp(28px,3vw,44px)] font-semibold leading-[0.95] tracking-[-0.045em]">
          Collections
        </h2>
        <p className="mt-4 max-w-64 text-sm leading-6 text-muted-foreground">
          Explore language-led graphics, everyday solids, and seasonal stories.
        </p>
        <Link
          to="/collections"
          onClick={onClose}
          className="mt-7 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          View all collections →
        </Link>
      </section>
      <nav aria-label="Collections menu" className="p-8">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shop by collection
        </p>
        <CollectionThemeLinks themes={themes} onClose={onClose} />
      </nav>
      <PromoTile product={promo} className="m-7 ml-0" />
    </>
  );
}

function CollectionThemeLinks({themes, onClose}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => (
        <Link
          key={theme.key}
          to={theme.to}
          aria-label={theme.label}
          onClick={onClose}
          className="group flex min-h-14 min-w-0 items-center gap-3 rounded-md border border-border bg-surface-subtle p-3"
        >
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-surface-muted">
            {theme.image ? (
              <Image
                data={theme.image}
                alt=""
                sizes="40px"
                className="size-full object-contain p-1"
              />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground/50">
                {theme.label[0]}
              </span>
            )}
          </span>
          <span className="truncate text-sm font-medium group-hover:underline">
            {theme.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function PagesMenu({onClose}) {
  return (
    <nav aria-label="More" className="grid grid-cols-2 gap-px">
      {PUBLIC_PAGE_LINKS.map((item, index) => (
        <Link
          key={item.to}
          to={item.to}
          aria-label={item.label}
          onClick={onClose}
          className="group flex min-h-24 items-end justify-between bg-surface p-5 text-foreground outline-none hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
        >
          <span>
            <span className="block text-[10px] text-muted-foreground">
              0{index + 1}
            </span>
            <span className="mt-3 block text-lg font-medium tracking-[-0.025em]">
              {item.label}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-xl transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation({
  departmentCategories,
  themes,
  promo,
  onClose,
  pathname,
}) {
  return (
    <>
      <div className="sticky top-0 z-10 -mx-1 mb-4 flex items-center justify-between bg-surface/95 px-1 pb-3 backdrop-blur-xl">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Menu
        </span>
        <SheetClose asChild>
          <button
            type="button"
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full bg-primary text-xl text-primary-foreground"
          >
            ×
          </button>
        </SheetClose>
      </div>
      <form
        action="/search"
        method="get"
        role="search"
        className="mb-5 flex items-center rounded-full border border-border bg-surface-subtle pl-4 sm:hidden"
      >
        <label htmlFor="mobile-menu-search" className="sr-only">
          Search products
        </label>
        <input
          id="mobile-menu-search"
          name="q"
          type="search"
          placeholder="Search products"
          className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Search products"
          className="grid size-12 shrink-0 place-items-center"
        >
          <SearchIcon />
        </button>
      </form>

      <nav aria-label="Mobile navigation">
        <Accordion type="single" collapsible className="border-t border-border">
          {SHOP_DEPARTMENTS.map((department) => (
            <AccordionItem key={department.key} value={department.key}>
              <AccordionTrigger className="text-lg">
                {department.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {departmentCategories[department.key].map((category) => (
                    <Link
                      key={category.label}
                      to={category.to}
                      onClick={onClose}
                      className="flex min-h-12 items-center rounded-md border border-border bg-surface-subtle px-3 text-sm font-semibold"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
                <Link
                  to={department.to}
                  onClick={onClose}
                  className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  View all {department.label} →
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
          <AccordionItem value="collections">
            <AccordionTrigger className="text-lg">Collections</AccordionTrigger>
            <AccordionContent>
              <CollectionThemeLinks themes={themes} onClose={onClose} />
              <Link
                to="/collections"
                onClick={onClose}
                className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                View all collections →
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>

      <section
        className="border-t border-border py-6"
        aria-labelledby="mobile-pages-heading"
      >
        <h2
          id="mobile-pages-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          Explore
        </h2>
        <nav aria-label="Mobile pages" className="grid grid-cols-2 gap-x-4">
          {PUBLIC_PAGE_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex min-h-12 items-center border-b border-border text-sm font-semibold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>

      <PromoTile product={promo} compact />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          to="/account/wishlist"
          onClick={onClose}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-strong text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          <HeartIcon className="size-4" />
          Wishlist
        </Link>
        <Link
          to="/account"
          onClick={onClose}
          className="flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-black text-xs font-semibold uppercase tracking-wider text-white"
        >
          Account →
        </Link>
      </div>
    </>
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

function categoryHref(department, category) {
  const params = new URLSearchParams({type: category, collection: department});
  return `/collections/all?${params.toString()}`;
}

const FALLBACK_CATEGORIES = [
  'T-Shirts',
  'Hoodies',
  'Oversized',
  'Sweatshirts',
  'Joggers',
  'Accessories',
];

function getProductCategories(product) {
  const set = new Set();

  const primaryCat = getProductCategory(product);
  if (primaryCat) {
    const label = categoryLabel(primaryCat);
    if (label) set.add(label);
  }

  if (product?.productType) {
    const label = categoryLabel(product.productType);
    if (label) set.add(label);
  }

  for (const tag of product?.tags ?? []) {
    const lower = tag.toLowerCase();
    if (
      lower === 'men' ||
      lower === 'women' ||
      lower === 'unisex' ||
      lower === 'solid' ||
      lower === 'solids'
    ) {
      continue;
    }
    const label = categoryLabel(tag);
    if (label) set.add(label);
  }

  return [...set];
}

function deriveDepartmentCategories(products = [], collections = []) {
  return Object.fromEntries(
    SHOP_DEPARTMENTS.map((department) => {
      const categories = new Map();

      // 1. Process Shopify Collections first (merchant collections in store)
      for (const col of collections) {
        if (!col || col.handle === 'frontpage' || col.handle === 'solids') {
          continue;
        }

        const isDepCollection = belongsToDepartment(col, department.key);
        const hasMatchingProducts = col.products?.nodes?.some((p) =>
          belongsToDepartment(p, department.key),
        );

        if (!isDepCollection && !hasMatchingProducts) continue;

        const rawName = col.title;
        const categoryName = categoryLabel(rawName) || rawName;
        if (categoryName && !categories.has(categoryName)) {
          categories.set(categoryName, {
            label: categoryName,
            to: categoryHref(department.key, categoryName),
          });
        }
      }

      // 2. Process individual Products to ensure no product categories are missed
      for (const product of products) {
        if (!belongsToDepartment(product, department.key)) continue;
        const catList = getProductCategories(product);
        for (const cat of catList) {
          if (!categories.has(cat)) {
            categories.set(cat, {
              label: cat,
              to: categoryHref(department.key, cat),
            });
          }
        }
      }

      return [department.key, [...categories.values()].slice(0, 8)];
    }),
  );
}

function belongsToDepartment(product, department) {
  const tags = (product.tags ?? []).map((tag) => tag.toLowerCase());
  const type = (product.productType ?? '').toLowerCase();
  const title = (product.title ?? '').toLowerCase();

  // Unisex products (explicitly tagged/typed or untagged by gender) belong to both Men and Women
  if (
    tags.includes('unisex') ||
    type.includes('unisex') ||
    title.includes('unisex')
  ) {
    return true;
  }
  if (tags.includes(department)) return true;
  return !tags.includes('men') && !tags.includes('women');
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

function WishlistHeaderLink() {
  const {count} = useWishlist();
  return (
    <Link
      to="/account/wishlist"
      aria-label={`Wishlist (${count} items)`}
      title="Saved Wishlist Items"
      className="relative grid size-10 sm:size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-subtle"
    >
      <HeartIcon />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

function HeartIcon({filled = false, className = "size-5"}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default Header;
