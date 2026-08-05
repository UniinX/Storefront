function Hero({ onShopNew }) {
  return (
    <section style={{ position: "relative", background: "var(--paper)" }}>
      <window.Reveal
        className="motif-kalamkari-frame uniinx-fabric"
        data-tone="maroon"
        style={{
          margin: "36px 65px 0",
          height: "min(440px, 58vh)",
          borderRadius: 4,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <span className="motif-kalamkari-corner" style={{ top: 10, left: 10, zIndex: 1 }} />
        <span className="motif-kalamkari-corner" style={{ top: 10, right: 10, transform: "rotate(90deg)", zIndex: 1 }} />
        <span className="motif-kalamkari-corner" style={{ bottom: 10, left: 10, transform: "rotate(-90deg)", zIndex: 1 }} />
        <span className="motif-kalamkari-corner" style={{ bottom: 10, right: 10, transform: "rotate(180deg)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px", maxWidth: 380 }}>
          <div style={{ fontFamily: "var(--font-work-sans)", fontSize: 12, letterSpacing: "var(--uniinx-tracking-wide)", color: "var(--paper)", textTransform: "uppercase", opacity: 0.85 }}>
            Hand-painted tree-of-life &amp; peacock
          </div>
          <div style={{ fontFamily: "var(--font-marcellus)", fontSize: 15, color: "var(--paper)", marginTop: 8, lineHeight: 1.5, opacity: 0.75 }}>
            Placeholder wash — swap for the commissioned Kalamkari artwork
          </div>
        </div>
      </window.Reveal>

      <div style={{ margin: "24px 65px 8px", display: "flex", gap: 8 }}>
        <div className="motif-madhubani-rule" style={{ width: 40 }} />
        <div className="motif-kalamkari-vine" style={{ width: 40 }} />
      </div>

      <div style={{ margin: "16px 65px 0", maxWidth: 720 }}>
        <window.Reveal
          style={{
            fontFamily: "var(--font-work-sans)",
            fontSize: 13,
            letterSpacing: "var(--uniinx-tracking-wide)",
            color: "var(--accent-cta)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Handprinted · For every language, for every state
        </window.Reveal>
        <window.Reveal
          as="h1"
          delay={90}
          style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "clamp(40px, 6vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "var(--uniinx-tracking-tight)",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Clothes in
          <br />
          your Language
        </window.Reveal>
      </div>

      <div style={{ margin: "24px 65px 64px", display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
        <window.Reveal
          as="p"
          style={{
            fontFamily: "var(--font-work-sans)",
            fontSize: "var(--uniinx-body-size)",
            letterSpacing: "var(--uniinx-tracking-tight)",
            color: "var(--ink)",
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 480,
            flex: "1 1 260px",
          }}
        >
          UNIINX ~ every design, printed in the script that feels like home.
        </window.Reveal>
        <window.Reveal
          as="button"
          delay={120}
          onClick={onShopNew}
          style={{
            background: "var(--accent-cta)",
            color: "var(--paper)",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "14px 32px",
            fontFamily: "var(--font-work-sans)",
            fontSize: "var(--uniinx-body-size)",
            letterSpacing: "var(--uniinx-tracking-tight)",
            cursor: "pointer",
            transition: "opacity 0.15s ease, transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          New Arrivals
        </window.Reveal>
      </div>
    </section>
  );
}
window.Hero = Hero;
