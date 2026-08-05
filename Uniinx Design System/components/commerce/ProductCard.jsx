import React from "react";
import { Button } from "../core/Button.jsx";

/**
 * Storefront grid card: placeholder product photo, Marcellus item
 * label, tracked price, and a "Buy it →" pill. Mirrors the repeating
 * Card frame on Desktop-2 of the Uniinx storefront.
 */
export function ProductCard({
  image,
  label = "Tshirt",
  price = "R . 200",
  width = 388,
  height = 527,
  onBuy,
}) {
  const tones = ["teal", "ochre", "green", "maroon"];
  const tone = tones[[...label].reduce((s, c) => s + c.charCodeAt(0), 0) % tones.length];
  return (
    <div className="uniinx-card" style={{ position: "relative", width, height, fontFamily: "var(--font-marcellus)" }}>
      <div
        className={image ? "uniinx-card-photo" : "uniinx-card-photo uniinx-fabric"}
        data-tone={image ? undefined : tone}
        style={{
          width,
          height,
          borderRadius: "var(--space-sm)",
          backgroundColor: "var(--paper-warm)",
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span className="motif-kalamkari-corner" style={{ top: 0, left: 0, zIndex: 1 }} />
      </div>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: height - 70,
          fontSize: "var(--uniinx-eyebrow-size)",
          letterSpacing: "var(--uniinx-tracking-tight)",
          color: "var(--ink)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "absolute",
          right: 39,
          top: height - 104,
          fontSize: "var(--uniinx-price-size)",
          letterSpacing: "var(--uniinx-tracking-wide)",
          color: "var(--accent-cta)",
        }}
      >
        {price}
      </span>
      <Button
        tone="accent"
        shape="pill"
        onClick={onBuy}
        style={{ position: "absolute", right: 0, top: height - 70, padding: "11px 22px" }}
      >
        Buy it →
      </Button>
    </div>
  );
}

export default ProductCard;
