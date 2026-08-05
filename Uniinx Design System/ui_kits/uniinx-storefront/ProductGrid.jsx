const PRODUCTS = [
  { label: "Tshirt", price: "R . 200", image: "../assets/uniinx-tshirt-product.png" },
  { label: "Kurta", price: "R . 450" },
  { label: "Dupatta", price: "R . 320" },
  { label: "Hoodie", price: "R . 650" },
];

function ProductGrid({ title = "NEWEST IN THE STORE", onSelectProduct }) {
  const { ProductCard } = window.UniinxDesignSystem_f52a6f;
  return (
    <section style={{ padding: "48px 55px" }} className="uniinx-section">
      <window.Reveal className="motif-madhubani-rule" style={{ width: 64, marginBottom: 16 }} />
      <window.Reveal as="h2"
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.05,
          letterSpacing: "var(--uniinx-tracking-tight)",
          margin: "0 0 32px",
          color: "var(--ink)",
        }}
      >
        {title}
      </window.Reveal>
      <div className="uniinx-product-grid">
        {PRODUCTS.map((p, i) => (
          <window.Reveal key={p.label} delay={i * 70} onClick={() => onSelectProduct && onSelectProduct(p)} style={{ cursor: onSelectProduct ? "pointer" : "default" }}>
            <ProductCard width="100%" height={340} {...p} onBuy={() => onSelectProduct && onSelectProduct(p)} />
          </window.Reveal>
        ))}
      </div>
    </section>
  );
}
window.ProductGrid = ProductGrid;
