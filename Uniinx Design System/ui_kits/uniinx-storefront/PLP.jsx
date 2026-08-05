const PLP_PRODUCTS = [
  { label: "Tshirt", price: "R . 200", image: "../assets/uniinx-tshirt-product.png" },
  { label: "Kurta", price: "R . 450" },
  { label: "Dupatta", price: "R . 320" },
  { label: "Hoodie", price: "R . 650" },
  { label: "Saree Blouse", price: "R . 380" },
  { label: "Angavastram", price: "R . 290" },
];

const DEPT_LABEL = { "plp:men": "MEN", "plp:women": "WOMEN", "plp:accessories": "ACCESSORIES" };

function PLP({ view, onSelectProduct }) {
  const { LanguageChipSelector, ClothTypeSelector, BottomSheet, ProductCard } = window.UniinxDesignSystem_f52a6f;
  const [languageId, setLanguageId] = React.useState(null);
  const [fabricId, setFabricId] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const Filters = (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div style={eyebrow}>CLOTH</div>
        <ClothTypeSelector fabricId={fabricId} onFabricChange={setFabricId} />
      </div>
      <div>
        <div style={eyebrow}>LANGUAGE</div>
        <LanguageChipSelector value={languageId} onChange={setLanguageId} size="sm" />
      </div>
    </div>
  );

  return (
    <section style={{ padding: "40px 55px 96px" }}>
      <div className="motif-madhubani-rule" style={{ width: 64, marginBottom: 16 }} />
      <h1
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(32px, 5vw, 56px)",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        {DEPT_LABEL[view] || "SHOP"}
      </h1>
      <p style={{ fontFamily: "var(--font-work-sans)", color: "var(--stone)", margin: "0 0 32px" }}>
        {PLP_PRODUCTS.length} designs · every piece prints in your language
      </p>

      <button
        className="uniinx-hide-desktop"
        onClick={() => setSheetOpen(true)}
        style={{
          minHeight: 44,
          marginBottom: 20,
          padding: "10px 20px",
          border: "1px solid var(--mist)",
          borderRadius: "var(--radius-md)",
          background: "var(--paper)",
          fontFamily: "var(--font-work-sans)",
          cursor: "pointer",
        }}
      >
        Filters · Cloth &amp; Language
      </button>

      <div className="uniinx-plp-layout">
        <aside className="uniinx-hide-mobile">{Filters}</aside>
        <div className="uniinx-product-grid">
          {PLP_PRODUCTS.map((p, i) => (
            <window.Reveal key={p.label} delay={i * 60} onClick={() => onSelectProduct && onSelectProduct(p)} style={{ cursor: "pointer" }}>
              <ProductCard width="100%" height={340} {...p} onBuy={() => onSelectProduct && onSelectProduct(p)} />
            </window.Reveal>
          ))}
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Cloth & Language">
        {Filters}
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
window.PLP = PLP;
