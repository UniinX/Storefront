function CartPage({ items, onRemove, onContinue }) {
  const { Button, GARMENTS, FABRICS, LANGUAGES, FontVar } = window.UniinxDesignSystem_f52a6f;
  const priceNum = (p) => parseInt(String(p).replace(/[^\d]/g, ""), 10) || 0;
  const total = items.reduce((sum, it) => sum + priceNum(it.price), 0);
  const [leaving, setLeaving] = React.useState(() => new Set());

  const requestRemove = (i, cartId) => {
    setLeaving((s) => new Set(s).add(cartId ?? i));
    setTimeout(() => onRemove(i), 220);
  };

  if (items.length === 0) {
    return (
      <window.Reveal as="section" style={{ padding: "96px 55px 140px", textAlign: "center" }}>
        <div className="motif-madhubani-rule" style={{ width: 64, margin: "0 auto 24px" }} />
        <h1 style={{ fontFamily: "var(--font-marcellus)", fontSize: 32, color: "var(--ink)" }}>Your cart is empty</h1>
        <p style={{ fontFamily: "var(--font-work-sans)", color: "var(--stone)", marginBottom: 32 }}>
          Every piece here can be printed in your language.
        </p>
        <Button tone="accent" shape="pill" onClick={onContinue}>
          Shop New Arrivals →
        </Button>
      </window.Reveal>
    );
  }

  return (
    <section style={{ padding: "40px 55px 140px" }}>
      <div className="motif-madhubani-rule" style={{ width: 64, marginBottom: 16 }} />
      <h1 style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--ink)", margin: "0 0 32px" }}>
        Your Cart
      </h1>

      <div className="uniinx-cart-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((it, i) => {
            const garment = GARMENTS.find((g) => g.id === it.garmentId);
            const fabric = FABRICS.find((f) => f.id === it.fabricId);
            const language = LANGUAGES.find((l) => l.id === it.languageId);
            const isLeaving = leaving.has(it.cartId ?? i);
            return (
              <div
                key={it.cartId ?? i}
                className={`uniinx-cart-item${isLeaving ? " is-leaving" : ""}`}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  padding: 20,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--paper-warm)",
                }}
              >
                <div
                  className="uniinx-fabric"
                  data-tone={["teal", "ochre", "green", "maroon"][i % 4]}
                  style={{
                    width: 88,
                    height: 110,
                    borderRadius: "var(--radius-sm)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 20, color: "var(--ink)" }}>{it.label}</div>
                  <div style={{ fontFamily: "var(--font-work-sans)", fontSize: 13, color: "var(--stone)", marginTop: 4 }}>
                    {garment ? garment.label : "Tshirt"} · {fabric ? fabric.label : "Cotton"}
                  </div>
                  {language && (
                    <div
                      dir={language.rtl ? "rtl" : "ltr"}
                      style={{ fontFamily: FontVar(language.font), fontSize: 14, color: "var(--accent-primary)", marginTop: 4 }}
                    >
                      {language.label} · {language.native}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 16, letterSpacing: "var(--uniinx-tracking-wide)", color: "var(--accent-cta)" }}>
                  {it.price}
                </div>
                <button
                  onClick={() => requestRemove(i, it.cartId)}
                  aria-label="Remove"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", fontSize: 20, minHeight: 44, minWidth: 44, transition: "color 0.15s ease, transform 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-cta)"; e.currentTarget.style.transform = "scale(1.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--stone)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <window.Reveal
          delay={100}
          style={{
            borderRadius: "var(--radius-lg)",
            background: "var(--paper-warm)",
            padding: 32,
            alignSelf: "flex-start",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="motif-temple-arch" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
          <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 22, color: "var(--ink)", marginTop: 16 }}>Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: "var(--font-work-sans)", color: "var(--stone)" }}>
            <span>{items.length} item{items.length > 1 ? "s" : ""}</span>
            <span>R . {total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontFamily: "var(--font-marcellus)", fontSize: 18, color: "var(--ink)" }}>
            <span>Total</span>
            <span style={{ transition: "opacity 0.2s ease" }} key={total}>R . {total}</span>
          </div>
          <div style={{ marginTop: 24 }}>
            <Button tone="accent" shape="pill" style={{ width: "100%", textAlign: "center" }}>
              Checkout →
            </Button>
          </div>
        </window.Reveal>
      </div>
    </section>
  );
}
window.CartPage = CartPage;
