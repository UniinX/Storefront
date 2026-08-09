import React from "react";

/**
 * Mobile bottom sheet: slides up over a scrim, used to host the cloth
 * type / language selectors on small screens where a full side-by-side
 * panel doesn't fit. Tap the scrim or the close rule to dismiss.
 */
export function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="uniinx-sheet-scrim"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,16,14,0.45)",
        zIndex: 90,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="uniinx-sheet-panel"
        style={{
          background: "var(--paper)",
          width: "100%",
          maxHeight: "78vh",
          overflowY: "auto",
          borderRadius: "0px",
          padding: "12px 24px 32px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 0, background: "var(--mist)" }} />
        </div>
        {title && (
          <div
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: 22,
              letterSpacing: "var(--uniinx-tracking-tight)",
              color: "var(--ink)",
              marginBottom: 20,
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
