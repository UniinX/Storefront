const GARMENT_IMAGES = {
  tshirt: "../assets/uniinx-tshirt-product.png",
  hoodie: null,
  kurta: null,
};
const GARMENT_PRICE = { tshirt: "R . 200", hoodie: "R . 650", kurta: "R . 450" };

function ProductPage({ onBack, onAddToCart }) {
  const { Button, ClothTypeSelector, LanguageChipSelector, GARMENTS, LANGUAGES, BottomSheet, FontVar } = window.UniinxDesignSystem_f52a6f;
  const [garmentId, setGarmentId] = React.useState(GARMENTS[0].id);
  const [fabricId, setFabricId] = React.useState("cotton");
  const [languageId, setLanguageId] = React.useState(LANGUAGES[0].id);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const language = LANGUAGES.find((l) => l.id === languageId);
  const price = GARMENT_PRICE[garmentId];
  const image = GARMENT_IMAGES[garmentId];

  const Selectors = (
    <ClothTypeSelector
      garmentId={garmentId}
      onGarmentChange={setGarmentId}
      fabricId={fabricId}
      onFabricChange={setFabricId}
    />
  );

  return (
    <section style={{ padding: "48px 55px 140px" }} className="uniinx-pdp">
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: 32,
          fontFamily: "var(--font-work-sans)",
          fontSize: "var(--uniinx-cta-size)",
          letterSpacing: "var(--uniinx-tracking-tight)",
          color: "var(--ink)",
        }}
      >
        ← Back
      </button>

      <div className="uniinx-pdp-layout">
        {/* Product image */}
        <window.Reveal>
          <window.CrossFade keyId={garmentId}>
            <div
              className={image ? undefined : "uniinx-fabric"}
              data-tone={image ? undefined : { tshirt: "teal", hoodie: "green", kurta: "ochre" }[garmentId] || "maroon"}
              style={{
                aspectRatio: "7 / 9",
                maxWidth: 420,
                borderRadius: "var(--space-sm)",
                backgroundColor: "var(--paper-warm)",
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: image ? "block" : "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                textAlign: "left",
                padding: image ? 0 : 24,
                fontFamily: "var(--font-work-sans)",
                fontSize: 13,
                color: "var(--paper)",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span className="motif-kalamkari-corner" style={{ top: 0, left: 0, zIndex: 1 }} />
              {!image && <span style={{ position: "relative", zIndex: 1, opacity: 0.85 }}>Garment photography placeholder — swap for the studio shot</span>}
            </div>
          </window.CrossFade>
          <window.CrossFade keyId={languageId}>
            <p
              dir={language.rtl ? "rtl" : "ltr"}
              style={{
                marginTop: 16,
                fontFamily: FontVar(language.font),
                fontSize: 16,
                color: "var(--accent-primary)",
              }}
            >
              Printed in {language.label} · {language.native}
            </p>
          </window.CrossFade>
        </window.Reveal>

        {/* Product details */}
        <window.Reveal delay={90} style={{ maxWidth: 460 }}>
          <div
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: "var(--uniinx-eyebrow-size)",
              letterSpacing: "var(--uniinx-tracking-wide)",
              color: "var(--stone)",
            }}
          >
            DESIGN
          </div>
          <h1
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: 48,
              lineHeight: 1.05,
              letterSpacing: "var(--uniinx-tracking-tight)",
              color: "var(--ink)",
              margin: "8px 0 0",
            }}
          >
            Bhasha Print
          </h1>
          <div
            style={{
              marginTop: 16,
              fontFamily: "var(--font-marcellus)",
              fontSize: 20,
              letterSpacing: "var(--uniinx-tracking-wide)",
              color: "var(--accent-cta)",
              transition: "opacity 0.2s ease",
            }}
            key={price}
          >
            {price}
          </div>

          <div className="uniinx-hide-mobile" style={{ marginTop: 40 }}>
            {Selectors}
            <div style={{ marginTop: 32 }}>
              <div style={eyebrow}>LANGUAGE</div>
              <LanguageChipSelector value={languageId} onChange={setLanguageId} />
            </div>
            <div style={{ marginTop: 40 }}>
              <Button tone="accent" shape="pill" onClick={() => onAddToCart && onAddToCart({ label: "Bhasha Print", garmentId, fabricId, languageId, price })}>
                Buy it →
              </Button>
            </div>
          </div>

          <button
            className="uniinx-hide-desktop"
            onClick={() => setSheetOpen(true)}
            style={{
              marginTop: 32,
              minHeight: 44,
              width: "100%",
              padding: "12px 20px",
              border: "1px solid var(--mist)",
              borderRadius: "var(--radius-md)",
              background: "var(--paper)",
              fontFamily: "var(--font-work-sans)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Customize · {GARMENTS.find((g) => g.id === garmentId).label}, {language.label} →
          </button>
        </window.Reveal>
      </div>

      {/* Sticky mobile buy bar */}
      <div className="uniinx-hide-desktop uniinx-sticky-buy">
        <div>
          <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 18, color: "var(--accent-cta)" }}>{price}</div>
          <div style={{ fontFamily: "var(--font-work-sans)", fontSize: 12, color: "var(--stone)" }}>{language.label}</div>
        </div>
        <Button tone="accent" shape="pill" onClick={() => onAddToCart && onAddToCart({ label: "Bhasha Print", garmentId, fabricId, languageId, price })}>
          Buy it →
        </Button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Customize">
        {Selectors}
        <div style={{ marginTop: 28 }}>
          <div style={eyebrow}>LANGUAGE</div>
          <LanguageChipSelector value={languageId} onChange={setLanguageId} size="sm" />
        </div>
      </BottomSheet>
    </section>
  );
}
const eyebrow = {
  fontFamily: "var(--font-work-sans)",
  fontSize: "var(--uniinx-cta-size)",
  letterSpacing: "var(--uniinx-tracking-tight)",
  color: "var(--stone)",
  marginBottom: 12,
};
window.ProductPage = ProductPage;
