import React from "react";

/** Garment silhouette — style of the piece itself. */
export const GARMENTS = [
  { id: "tshirt", label: "Tshirt", price: "R . 200" },
  { id: "hoodie", label: "Hoodie", price: "R . 650" },
  { id: "kurta", label: "Kurta", price: "R . 450" },
];

/** Fabric — the "cloth type" customization axis (weight/weave/hand-feel). */
export const FABRICS = [
  { id: "cotton", label: "Cotton", swatch: "oklch(88% 0.01 60)" },
  { id: "khadi", label: "Khadi", swatch: "oklch(83% 0.02 70)" },
  { id: "linen", label: "Linen", swatch: "oklch(90% 0.008 90)" },
  { id: "silk", label: "Silk", swatch: "oklch(78% 0.05 40)" },
];

function Chips({ items, value, onChange, label, renderSwatch }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange && onChange(item.id)}
            className="uniinx-chip"
            style={{
              minHeight: 44,
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontFamily: "var(--font-marcellus)",
              fontSize: "var(--uniinx-cta-size)",
              letterSpacing: "var(--uniinx-tracking-wide)",
              background: selected ? "var(--accent-primary)" : "var(--paper-warm)",
              color: selected ? "var(--paper)" : "var(--ink)",
              transform: selected ? "scale(1.03)" : "scale(1)",
            }}
            onMouseEnter={(e) => { if (!selected) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {renderSwatch && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: item.swatch,
                  display: "inline-block",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                }}
              />
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Two-in-one customization selector: garment style (Tshirt/Hoodie/Kurta)
 * and fabric/cloth type (Cotton/Khadi/Linen/Silk), each a 44px-min
 * radiogroup with a dark/light-on-accent selected state matching
 * LanguageChipSelector.
 */
export function ClothTypeSelector({ garmentId, onGarmentChange, fabricId, onFabricChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={eyebrow}>STYLE</div>
        <Chips items={GARMENTS} value={garmentId} onChange={onGarmentChange} label="Garment style" />
      </div>
      <div>
        <div style={eyebrow}>CLOTH</div>
        <Chips items={FABRICS} value={fabricId} onChange={onFabricChange} label="Fabric" renderSwatch />
      </div>
    </div>
  );
}

const eyebrow = {
  fontFamily: "var(--font-work-sans)",
  fontSize: "var(--uniinx-cta-size)",
  letterSpacing: "var(--uniinx-tracking-tight)",
  color: "var(--stone)",
  marginBottom: 12,
};

export default ClothTypeSelector;
