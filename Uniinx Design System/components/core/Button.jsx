import React from "react";

/**
 * Pill CTA button — Uniinx's storefront treatment: a graphite pill
 * with tracked Marcellus caps ("Buy it →"), a lighter mist-gray
 * secondary tone, and (v3) a Kalamkari madder-red "accent" tone for the
 * primary purchase action.
 */
export function Button({
  children = "Buy it →",
  tone = "dark",
  shape = "pill",
  font = "marcellus",
  onClick,
  style,
  ...rest
}) {
  const tones = {
    dark: { background: "var(--graphite)", color: "var(--paper)" },
    light: { background: "var(--mist)", color: "var(--ink)" },
    accent: { background: "var(--accent-cta)", color: "var(--paper)" },
  };
  const shapes = {
    pill: { borderRadius: "0px" },
    capsule: { borderRadius: "0px" },
  };
  const fonts = {
    marcellus: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "var(--uniinx-cta-size)",
      letterSpacing: "var(--uniinx-tracking-wide)",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        cursor: "pointer",
        padding: "12px 24px",
        lineHeight: 1,
        transition: "opacity 0.15s ease",
        ...tones[tone],
        ...shapes[shape],
        ...fonts[font],
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
