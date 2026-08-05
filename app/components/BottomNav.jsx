/**
 * @file BottomNav — floating pill bottom navigation (mobile).
 * Mirrors the top pill aesthetic: frosted glass, centred, detached from edges.
 */
import {Suspense} from 'react';
import {Await, Link, useLocation} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';

const TABS = [
  {to: '/', label: 'Home', icon: <path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-8z" />},
  {to: '/collections/men', label: 'Shop', icon: <><rect x="3" y="7" width="18" height="14" rx="1" /><path d="M8 7V5a4 4 0 018 0v2" /></>},
  {to: '/cart', label: 'Cart', icon: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.72L23 6H6" /></>},
];

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  if (to === '/collections/men') return pathname.startsWith('/collections');
  return pathname.startsWith(to);
}

export function BottomNav({cart}) {
  const {pathname} = useLocation();
  return (
    <div className="uniinx-hide-desktop" style={{position: 'fixed', bottom: 'calc(20px + env(safe-area-inset-bottom))', left: 0, right: 0, zIndex: 60, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <nav style={{
        pointerEvents: 'all',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 9999, border: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 4px 28px rgba(20,10,8,0.14)',
        fontFamily: 'var(--font-work-sans)',
      }}>
        {TABS.map((t) => {
          const active = isActive(pathname, t.to);
          return (
            <Link key={t.to} to={t.to}
              aria-label={t.label}
              style={{background: active ? 'var(--ink)' : 'transparent', border: 'none', cursor: 'pointer', borderRadius: 9999, padding: '8px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'background 0.18s', position: 'relative'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--paper)' : 'var(--ink)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              <span style={{fontSize: 10, letterSpacing: 'var(--uniinx-tracking-wide)', textTransform: 'uppercase', color: active ? 'var(--paper)' : 'var(--ink)', lineHeight: 1}}>{t.label}</span>
              {t.to === '/cart' && (
                <Suspense fallback={null}>
                  <Await resolve={cart}>
                    {(resolvedCart) => <CartBadge cart={resolvedCart} />}
                  </Await>
                </Suspense>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function CartBadge({cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  if (!count) return null;
  return (
    <span style={{position: 'absolute', top: 4, right: 12, background: 'var(--accent-cta)', color: 'var(--paper)', borderRadius: 9999, fontSize: 9, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{count}</span>
  );
}
