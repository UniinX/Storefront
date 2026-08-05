function DepartmentBand({ onNavigate }) {
  const cards = [
    { key: "men", title: "MEN", big: true, tone: "var(--kalamkari-teal-600)", fabricTone: "teal", nav: "plp:men" },
    { key: "women", title: "WOMEN", tone: "var(--kalamkari-red-600)", fabricTone: "maroon", nav: "plp:women" },
    { key: "acc", title: "ACCESSORIES", tone: "var(--kalamkari-ochre-500)", fabricTone: "ochre", nav: "plp:accessories" },
  ];
  return (
    <section style={{ padding: "32px 65px 64px" }}>
      <div className="uniinx-dept-grid">
        {cards.map((c, i) => (
          <window.Reveal
            key={c.key}
            delay={i * 90}
            className="uniinx-dept-card uniinx-fabric"
            data-tone={c.fabricTone}
            onClick={() => onNavigate && onNavigate(c.nav)}
            style={{
              position: "relative",
              minHeight: c.big ? 320 : 220,
              gridColumn: c.big ? "span 2" : "span 1",
              borderRadius: "var(--radius-sm)",
              boxShadow: `inset 0 0 0 2px ${c.tone}`,
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
              cursor: onNavigate ? "pointer" : "default",
              overflow: "hidden",
            }}
          >
            <span className="motif-kalamkari-corner" style={{ top: 0, right: 0, transform: "rotate(90deg)", borderColor: c.tone, zIndex: 1 }} />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-marcellus)",
                fontSize: c.big ? "clamp(40px, 6vw, 96px)" : 28,
                letterSpacing: "var(--uniinx-tracking-wide)",
                color: "var(--paper)",
                textShadow: "0 2px 18px rgba(20,16,14,0.35)",
                lineHeight: 1,
              }}
            >
              {c.title}
            </span>
          </window.Reveal>
        ))}
      </div>
    </section>
  );
}
window.DepartmentBand = DepartmentBand;
