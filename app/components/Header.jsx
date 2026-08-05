/**
 * @file Header — floating pill, 3-part: wordmark | nav | actions.
 */
import {useState, useEffect, useRef} from 'react';
import {Link, useLocation} from 'react-router';
import {Suspense} from 'react';
import {Await} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {NavLanguageSwitcher} from '~/components/ds/index.js';
import {MobileMenu} from './MobileMenu.jsx';

const NAV = [
  {to: '/', label: 'Home'},
  {to: '/collections/men', label: 'Men'},
  {to: '/collections/women', label: 'Women'},
  {to: '/collections/accessories', label: 'Accessories'},
];

const pillStyle = {
  pointerEvents: 'all', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 20px 10px 16px', gap: 0,
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  borderRadius: 9999, border: '1px solid rgba(255,255,255,0.55)',
  boxShadow: '0 4px 28px rgba(20,10,8,0.12)',
  fontFamily: 'var(--font-work-sans)', fontSize: 'var(--uniinx-body-size)',
  letterSpacing: 'var(--uniinx-tracking-tight)', color: 'var(--ink)',
  maxWidth: 900, width: 'calc(100% - 48px)',
};

export function Header({cart, language, onLanguageChange, theme, onToggleTheme}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const {pathname} = useLocation();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = Math.max(0, window.scrollY);
        const lastY = lastScrollY.current;
        if (currentY < 24) {
          setHidden(false);
        } else if (currentY > lastY) {
          setHidden(true);
        } else if (currentY < lastY) {
          setHidden(false);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHidden = hidden && !menuOpen;

  return (
    <div style={{
      position: 'fixed', top: 'calc(20px + env(safe-area-inset-top))', left: 0, right: 0, zIndex: 60,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      transform: isHidden ? 'translateY(-150%)' : 'translateY(0)',
      transition: 'transform 0.35s cubic-bezier(.16,.84,.32,1)',
    }}>
      <header style={pillStyle}>
        {/* Left — wordmark / language switcher */}
        <div style={{flex: '0 0 auto'}}>
          <NavLanguageSwitcher activeId={language} onSelect={onLanguageChange} />
        </div>
        {/* Centre — page links */}
        <nav className="uniinx-hide-mobile" style={{flex: 1, display: 'flex', gap: 28, justifyContent: 'center'}}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} prefetch="intent"
              style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', minHeight: 44, color: pathname === n.to ? 'var(--accent-cta)' : 'var(--ink)', transition: 'color 0.15s'}}>
              {n.label}
            </Link>
          ))}
        </nav>
        {/* Right — theme + cart */}
        <div style={{flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 14}}>
          <button
            id="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <svg className="uniinx-hide-mobile" style={{cursor: 'pointer', display: 'block'}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <Link className="uniinx-hide-mobile" to="/cart" style={{cursor: 'pointer', fontSize: 13, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', minHeight: 44}}>
            Cart{' '}
            <Suspense fallback="→">
              <Await resolve={cart}>
                {(resolvedCart) => <CartCount cart={resolvedCart} />}
              </Await>
            </Suspense>
          </Link>
          <button aria-label="Menu" onClick={() => setMenuOpen((o) => !o)} className="uniinx-hide-desktop"
            style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        {menuOpen && <MobileMenu items={NAV} pathname={pathname} onClose={() => setMenuOpen(false)} />}
      </header>
    </div>
  );
}

function CartCount({cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  return <>{count > 0 ? `(${count}) →` : '→'}</>;
}
