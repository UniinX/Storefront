function Footer() {
  return (
    <window.Reveal as="footer" style={{ padding: "32px 55px 96px", borderTop: "1px solid var(--ink)" }} className="uniinx-footer">
      <div className="motif-block-print" style={{ marginBottom: 24 }} />
      <div
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(24px, 4vw, 32px)",
          letterSpacing: "var(--uniinx-tracking-wide)",
          color: "var(--accent-deep)",
          textAlign: "center",
        }}
      >
        Footer map
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: "var(--font-marcellus)",
          fontSize: 18,
          letterSpacing: "var(--uniinx-tracking-wide)",
          color: "var(--ink)",
          textAlign: "center",
        }}
      >
        To this country &amp; it's people
      </div>
    </window.Reveal>
  );
}
window.Footer = Footer;
