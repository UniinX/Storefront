/**
 * ProductPageFloating — an alternate PDP composition: an open, airy
 * "studio" canvas with the garment large and centered, and all controls
 * living in floating pill/card chrome around the edges (back pill top-left,
 * garment-style rail on the right, a single info card bottom-left) rather
 * than a fixed two-column layout. Borrows the *composition* of a dedicated
 * garment-customizer canvas — not any particular brand's visuals, and no
 * 3D/rotation — while keeping Uniinx's own type, color and motion system.
 *
 * Customization stays exactly what the storefront already offers: garment
 * style, fabric, and print language. No color/pattern drawing tool.
 */

const GARMENT_IMAGES = {
  tshirt: "../assets/uniinx-tshirt-product.png",
  hoodie: null,
  kurta: null,
};
const GARMENT_PRICE = { tshirt: "R . 200", hoodie: "R . 650", kurta: "R . 450" };
const GARMENT_TONE = { tshirt: "teal", hoodie: "green", kurta: "ochre" };

function ProductPageFloating({ onBack, onAddToCart }) {
  const { Button, GARMENTS, FABRICS, LanguageChipSelector, LANGUAGES, FontVar } = window.UniinxDesignSystem_f52a6f;
  const [garmentId, setGarmentId] = React.useState(GARMENTS[0].id);
  const [fabricId, setFabricId] = React.useState("cotton");
  const [languageId, setLanguageId] = React.useState(LANGUAGES[0].id);

  const language = LANGUAGES.find((l) => l.id === languageId);
  const price = GARMENT_PRICE[garmentId];
  const image = GARMENT_IMAGES[garmentId];
  const tone = GARMENT_TONE[garmentId] || "maroon";
  const garment = GARMENTS.find((g) => g.id === garmentId);

  const addNow = () =>
    onAddToCart && onAddToCart({ label: "Bhasha Print", garmentId, fabricId, languageId, price });

  return (
    <section className="uniinx-pdp-canvas" style={{ position: "relative", minHeight: "100vh", background: "var(--paper)" }}>
      <div className="uniinx-pdp-canvas-dots" />

      {/* Back / wordmark pill — top-left */}
      <div className="uniinx-floating-pill uniinx-pdp-back-pill">
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "none", background: "var(--paper-warm)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-work-sans)", fontSize: 15, color: "var(--ink)",
          }}
        >
          ←
        </button>
        <span
          style={{
            fontFamily: "var(--font-marcellus)", fontSize: 15,
            letterSpacing: "var(--uniinx-tracking-wide)", color: "var(--ink)",
          }}
        >
          UNIINX
        </span>
      </div>

      {/* Garment — large, centered on the open canvas */}
      <div className="uniinx-pdp-canvas-stage">
        <window.CrossFade keyId={garmentId}>
          <div
            className={image ? undefined : "uniinx-fabric"}
            data-tone={image ? undefined : tone}
            style={{
              width: "min(64vw, 480px)",
              aspectRatio: "7 / 9",
              borderRadius: "var(--space-sm)",
              backgroundColor: "var(--paper-warm)",
              backgroundImage: image ? `url(${image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 40px 80px -32px rgba(20,16,14,0.28)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span className="motif-kalamkari-corner" style={{ top: 0, left: 0, zIndex: 1 }} />
          </div>
        </window.CrossFade>
        <window.CrossFade keyId={languageId}>
          <p
            dir={language.rtl ? "rtl" : "ltr"}
            style={{
              marginTop: 20,
              fontFamily: FontVar(language.font),
              fontSize: 16,
              color: "var(--accent-primary)",
              textAlign: "center",
            }}
          >
            Printed in {language.label} · {language.native}
          </p>
        </window.CrossFade>
      </div>

      {/* Garment-style rail — right edge */}
      <div className="uniinx-pdp-rail uniinx-hide-mobile">
        {GARMENTS.map((g) => {
          const selected = g.id === garmentId;
          return (
            <button
              key={g.id}
              onClick={() => setGarmentId(g.id)}
              aria-label={g.label}
              aria-pressed={selected}
              className="uniinx-pdp-rail-item"
              style={{
                boxShadow: selected
                  ? "0 0 0 2px var(--paper), 0 0 0 4px var(--accent-primary)"
                  : "0 0 0 2px var(--paper), 0 0 0 3px var(--mist)",
              }}
            >
              <div
                className={GARMENT_IMAGES[g.id] ? undefined : "uniinx-fabric"}
                data-tone={GARMENT_IMAGES[g.id] ? undefined : GARMENT_TONE[g.id]}
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  backgroundImage: GARMENT_IMAGES[g.id] ? `url(${GARMENT_IMAGES[g.id]})` : undefined,
                  backgroundSize: "cover", backgroundPosition: "center",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Info card — bottom-left */}
      <div className="uniinx-floating-card uniinx-pdp-info-card">
        <div style={{ fontFamily: "var(--font-work-sans)", fontSize: 12, letterSpacing: "var(--uniinx-tracking-tight)", color: "var(--stone)" }}>
          DESIGN
        </div>
        <h1
          style={{
            fontFamily: "var(--font-marcellus)", fontSize: 30, lineHeight: 1.08,
            letterSpacing: "var(--uniinx-tracking-tight)", color: "var(--ink)", margin: "4px 0 0",
          }}
        >
          Bhasha Print
        </h1>
        <div
          key={price}
          style={{ marginTop: 10, fontFamily: "var(--font-marcellus)", fontSize: 17, letterSpacing: "var(--uniinx-tracking-wide)", color: "var(--accent-cta)" }}
        >
          {price}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 6, flexWrap: "wrap" }} className="uniinx-hide-mobile">
          {FABRICS.map((f) => {
            const selected = f.id === fabricId;
            return (
              <button
                key={f.id}
                onClick={() => setFabricId(f.id)}
                className="uniinx-chip"
                style={{
                  minHeight: 32, padding: "6px 14px", border: "none", borderRadius: "var(--radius-md)",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-marcellus)", fontSize: 12, letterSpacing: "var(--uniinx-tracking-wide)",
                  background: selected ? "var(--accent-primary)" : "var(--paper-warm)",
                  color: selected ? "var(--paper)" : "var(--ink)",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: f.swatch, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }} />
                {f.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14 }} className="uniinx-hide-mobile">
          <LanguageChipSelector value={languageId} onChange={setLanguageId} size="sm" />
        </div>

        <div style={{ marginTop: 18 }}>
          <Button tone="accent" shape="pill" onClick={addNow}>Buy it →</Button>
        </div>
      </div>

      {/* Mobile garment rail — horizontal, above sticky buy bar */}
      <div className="uniinx-pdp-rail-mobile uniinx-hide-desktop">
        {GARMENTS.map((g) => {
          const selected = g.id === garmentId;
          return (
            <button
              key={g.id}
              onClick={() => setGarmentId(g.id)}
              aria-label={g.label}
              className="uniinx-pdp-rail-item"
              style={{
                boxShadow: selected
                  ? "0 0 0 2px var(--paper), 0 0 0 4px var(--accent-primary)"
                  : "0 0 0 2px var(--paper), 0 0 0 3px var(--mist)",
              }}
            >
              <div
                className={GARMENT_IMAGES[g.id] ? undefined : "uniinx-fabric"}
                data-tone={GARMENT_IMAGES[g.id] ? undefined : GARMENT_TONE[g.id]}
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  backgroundImage: GARMENT_IMAGES[g.id] ? `url(${GARMENT_IMAGES[g.id]})` : undefined,
                  backgroundSize: "cover", backgroundPosition: "center",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Sticky mobile buy bar */}
      <div className="uniinx-hide-desktop uniinx-sticky-buy">
        <div>
          <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 18, color: "var(--accent-cta)" }}>{price}</div>
          <div style={{ fontFamily: "var(--font-work-sans)", fontSize: 12, color: "var(--stone)" }}>{garment.label} · {language.label}</div>
        </div>
        <Button tone="accent" shape="pill" onClick={addNow}>Buy it →</Button>
      </div>
    </section>
  );
}
window.ProductPageFloating = ProductPageFloating;
