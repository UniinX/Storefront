/**
 * @file Mobile menu drawer — shown on screens < 720px.
 * Receives nav items + current pathname + close callback from Header.
 * Matches the scrim + explicit-close pattern used by BottomSheet elsewhere
 * on mobile, instead of floating with no way to tell it's dismissible.
 */
import {Link} from 'react-router';

export function MobileMenu({items, pathname, onClose}) {
  return (
    <>
      {/* Fixed to the viewport, z-indexed below the header pill (zIndex 60)
          so the header stays crisp while everything else dims. */}
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="uniinx-hide-desktop"
        style={{
          position: 'fixed', inset: 0, background: 'rgba(20,16,14,0.35)',
          border: 'none', padding: 0, cursor: 'pointer', zIndex: 55,
        }}
      />
      <div
        className="uniinx-hide-desktop uniinx-lang-menu"
        style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--paper)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 60,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button
            aria-label="Close menu"
            onClick={onClose}
            style={{minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink)'}}
          >
            ×
          </button>
        </div>
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={onClose}
            style={{
              minHeight: 44, display: 'flex', alignItems: 'center', textAlign: 'left', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-work-sans)', fontSize: 17,
              color: pathname === n.to ? 'var(--accent-primary)' : 'var(--ink)',
            }}
          >
            {n.label}
          </Link>
        ))}
        <Link
          to="/cart"
          onClick={onClose}
          style={{
            minHeight: 44, display: 'flex', alignItems: 'center', textAlign: 'left', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-work-sans)', fontSize: 17,
            color: pathname === '/cart' ? 'var(--accent-primary)' : 'var(--ink)',
          }}
        >
          Cart
        </Link>
      </div>
    </>
  );
}
