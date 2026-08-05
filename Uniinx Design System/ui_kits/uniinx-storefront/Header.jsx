function Header({ view, onNavigate, language, onLanguageChange }) {
  const { NavLanguageSwitcher } = window.UniinxDesignSystem_f52a6f;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navItems = [
    { id: "home", label: "Home" },
    { id: "plp:men", label: "Men" },
    { id: "plp:women", label: "Women" },
    { id: "plp:accessories", label: "Accessories" },
  ];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 55px",
        fontFamily: "var(--font-work-sans)",
        fontSize: "var(--uniinx-body-size)",
        letterSpacing: "var(--uniinx-tracking-tight)",
        color: "var(--ink)",
      }}
      className="uniinx-header"
    >
      <NavLanguageSwitcher activeId={language} onSelect={onLanguageChange} />

      <nav className="uniinx-hide-mobile" style={{ display: "flex", gap: 32 }}>
        {navItems.map((n) => (
          <span
            key={n.id}
            onClick={() => onNavigate(n.id)}
            style={{ cursor: "pointer", color: view === n.id ? "var(--accent-primary)" : "var(--ink)" }}
          >
            {n.label}
          </span>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src="../../assets/uniinx-icon-search.png" alt="" style={{ width: 20, height: 20 }} className="uniinx-hide-mobile" />
        <img
          src="../../assets/uniinx-icon-cart.png"
          alt="cart"
          onClick={() => onNavigate("cart")}
          style={{ width: 22, height: 20, cursor: "pointer" }}
          className="uniinx-hide-mobile"
        />
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="uniinx-hide-desktop"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="uniinx-hide-desktop uniinx-mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--paper)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
            padding: "12px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                onNavigate(n.id);
                setMenuOpen(false);
              }}
              style={{
                minHeight: 44,
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-work-sans)",
                fontSize: 17,
                color: view === n.id ? "var(--accent-primary)" : "var(--ink)",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
window.Header = Header;
