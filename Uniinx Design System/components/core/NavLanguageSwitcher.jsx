import React from "react";
import { LANGUAGES, FontVar } from "../commerce/LanguageChipSelector.jsx";

/**
 * The Uniinx wordmark doubles as the site language switcher: hover
 * (desktop) or tap (mobile) reveals a panel of the same 10 languages +
 * English. Each entry shows the same "Uniinx" wordmark transliterated
 * into that script (not the language's own name) so the panel reads as
 * recognizably the same brand, just in a different script — picking one
 * sets the active site language, echoed by the small wordmark caption
 * under the mark.
 */
export function NavLanguageSwitcher({ activeId, onSelect, wordmark = "UNIINX" }) {
  const [open, setOpen] = React.useState(false);
  const active = LANGUAGES.find((l) => l.id === activeId) || LANGUAGES[LANGUAGES.length - 1];
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose language"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "13px 0",
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          fontFamily: "var(--font-work-sans)",
          color: "var(--ink)",
        }}
      >
        <div
          key={active.id}
          style={{
            fontSize: 17,
            fontFamily: FontVar(active.font),
            letterSpacing: "var(--uniinx-tracking-tight)",
            animation: "uniinx-menu-in 0.25s cubic-bezier(.16,.84,.32,1) both",
          }}
          dir={active.rtl ? "rtl" : "ltr"}
        >
          {active.wordmark}
        </div>
      </button>
      {open && (
        <div
          role="menu"
          className="uniinx-lang-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 8,
            background: "var(--paper)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            borderRadius: "var(--radius-sm)",
            padding: 10,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
            zIndex: 40,
            width: 300,
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              role="menuitem"
              onClick={() => {
                onSelect && onSelect(l.id);
                setOpen(false);
              }}
              className="uniinx-chip"
              style={{
                minHeight: 44,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                padding: "6px 10px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                background: l.id === active.id ? "var(--paper-warm)" : "transparent",
                color: "var(--ink)",
                fontFamily: "var(--font-work-sans)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-warm)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = l.id === active.id ? "var(--paper-warm)" : "transparent")}
            >
              <span style={{ fontSize: 16, fontFamily: FontVar(l.font), color: "var(--accent-primary)" }} dir={l.rtl ? "rtl" : "ltr"}>
                {l.wordmark}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavLanguageSwitcher;
