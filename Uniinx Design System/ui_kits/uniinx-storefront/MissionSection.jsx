function MissionSection() {
  return (
    <window.Reveal
      as="section"
      style={{
        margin: "0 55px 96px",
        borderRadius: "var(--radius-lg)",
        background: "var(--paper-warm)",
        padding: "56px 64px",
        display: "flex",
        gap: 64,
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="motif-temple-arch" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <h2
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(28px, 4vw, 40px)",
          letterSpacing: "var(--uniinx-tracking-tight)",
          color: "var(--accent-deep)",
          margin: "16px 0 0",
          whiteSpace: "pre-line",
        }}
      >
        {"OUR\nMISSION"}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 480,
          color: "var(--ink)",
          marginTop: 16,
        }}
      >
        We believe that our true emotion can only be shared through our
        mother tongue. As people of India, we embrace all the languages
        that our country has, and we are proud to hold linguistic richness
        and cultural heritage. To help this grow, we are introducing our
        designs to every language as possible.
      </p>
      <p
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: 22,
          lineHeight: 1.6,
          letterSpacing: "var(--uniinx-tracking-tight)",
          color: "var(--accent-cta)",
          margin: "16px 0 0",
          whiteSpace: "pre-line",
        }}
      >
        {"For Every Language,\nFor Every State,\nFor Every One,\nFor India."}
      </p>
    </window.Reveal>
  );
}
window.MissionSection = MissionSection;
