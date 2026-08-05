import React from "react";

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "plp", label: "Shop" },
  { id: "cart", label: "Cart" },
];

/**
 * Fixed bottom tab bar for the mobile layout (< 720px). Simple line
 * glyphs drawn with CSS shapes — no icon font shipped by the source, so
 * kept to the same restrained stroke language as the two source PNG
 * glyphs (search/cart).
 */
export function MobileTabBar({ active = "home", onNavigate, cartCount = 0 }) {
  const prevCount = React.useRef(cartCount);
  const [bump, setBump] = React.useState(false);
  React.useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const activeIndex = Math.max(0, ITEMS.findIndex((i) => i.id === active));

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "var(--mobile-nav-height)",
        background: "var(--paper)",
        boxShadow: "0 -1px 0 var(--mist)",
        display: "flex",
        zIndex: 50,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 6,
          bottom: 6,
          width: `calc(${100 / ITEMS.length}% - 12px)`,
          left: `calc(${(activeIndex * 100) / ITEMS.length}% + 6px)`,
          background: "var(--paper-warm)",
          borderRadius: "var(--radius-md)",
          transition: "left 0.28s cubic-bezier(.16,.84,.32,1)",
        }}
      />
      {ITEMS.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate && onNavigate(item.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minHeight: 44,
              border: "none",
              background: "none",
              cursor: "pointer",
              position: "relative",
              color: selected ? "var(--accent-primary)" : "var(--stone)",
              fontFamily: "var(--font-work-sans)",
              fontSize: 11,
              letterSpacing: "var(--uniinx-tracking-tight)",
              transition: "color 0.2s ease, transform 0.15s ease",
              transform: selected ? "translateY(-1px)" : "none",
            }}
          >
            <Glyph id={item.id} active={selected} />
            {item.label}
            {item.id === "cart" && cartCount > 0 && (
              <span
                className={bump ? "uniinx-badge-pop" : ""}
                style={{
                  position: "absolute",
                  top: 2,
                  right: "calc(50% - 20px)",
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: "var(--accent-cta)",
                  color: "var(--paper)",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function Glyph({ id, active }) {
  const stroke = active ? "var(--accent-primary)" : "var(--stone)";
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.6 };
  if (id === "home") {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "plp") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 6h14l-1.5 10.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 6Z" strokeLinejoin="round" />
      <path d="M8 6a4 4 0 0 1 8 0" strokeLinecap="round" />
    </svg>
  );
}

export default MobileTabBar;
