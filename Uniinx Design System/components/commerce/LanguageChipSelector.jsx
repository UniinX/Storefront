import React from "react";

/**
 * The 10 major Indian languages Uniinx prints in, plus English — each
 * shown by its English name and native-script endonym. FONT_MAP points
 * each language at the matching Indic display face from typography.css
 * so the endonym renders in a real serif for that script, not a
 * fallback. Urdu is RTL.
 *
 * `wordmark` is a phonetic transliteration of "Uniinx" itself in that
 * script (not the language's own name) — used by NavLanguageSwitcher so
 * the header mark stays recognizable as the same brand word across
 * scripts. Best-effort transliteration; have a native speaker per
 * script review before shipping.
 */
export const LANGUAGES = [
  { id: "hindi", label: "Hindi", native: "हिन्दी", wordmark: "यूनिंक्स", font: "devanagari" },
  { id: "tamil", label: "Tamil", native: "தமிழ்", wordmark: "யூனிங்க்ஸ்", font: "tamil" },
  { id: "telugu", label: "Telugu", native: "తెలుగు", wordmark: "యూనింక్స్", font: "telugu" },
  { id: "kannada", label: "Kannada", native: "ಕನ್ನಡ", wordmark: "ಯೂನಿಂಕ್ಸ್", font: "kannada" },
  { id: "bengali", label: "Bengali", native: "বাংলা", wordmark: "ইউনিংক্স", font: "bengali" },
  { id: "marathi", label: "Marathi", native: "मराठी", wordmark: "युनिंक्स", font: "devanagari" },
  { id: "gujarati", label: "Gujarati", native: "ગુજરાતી", wordmark: "યુનિંક્સ", font: "gujarati" },
  { id: "punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ", wordmark: "ਯੂਨਿੰਕਸ", font: "gurmukhi" },
  { id: "odia", label: "Odia", native: "ଓଡ଼ିଆ", wordmark: "ଉନିଙ୍କ୍ସ", font: "oriya" },
  { id: "urdu", label: "Urdu", native: "اردو", wordmark: "یونینکس", font: "urdu", rtl: true },
  { id: "english", label: "English", native: "English", wordmark: "UNIINX", font: "marcellus" },
];

export function FontVar(fontKey) {
  return `var(--font-${fontKey})`;
}

/**
 * Radio-group chip selector for design language. 44px-minimum hit
 * targets, dark/light selected state, native endonym set in its own
 * script's font.
 */
export function LanguageChipSelector({ value, onChange, languages = LANGUAGES, size = "md" }) {
  const compact = size === "sm";
  return (
    <div role="radiogroup" aria-label="Design language" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {languages.map((l) => {
        const selected = l.id === value;
        return (
          <button
            key={l.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange && onChange(l.id)}
            className="uniinx-chip"
            style={{
              minHeight: 44,
              padding: compact ? "6px 12px" : "8px 16px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              fontFamily: "var(--font-work-sans)",
              letterSpacing: "var(--uniinx-tracking-tight)",
              background: selected ? "var(--accent-primary)" : "var(--paper-warm)",
              color: selected ? "var(--paper)" : "var(--ink)",
              transform: selected ? "scale(1.03)" : "scale(1)",
            }}
            onMouseEnter={(e) => { if (!selected) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: 12 }}>{l.label}</span>
            <span style={{ fontSize: compact ? 13 : 15, fontFamily: FontVar(l.font) }} dir={l.rtl ? "rtl" : "ltr"}>
              {l.native}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageChipSelector;
