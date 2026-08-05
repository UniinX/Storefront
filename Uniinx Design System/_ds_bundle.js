/* @ds-bundle: {"format":4,"namespace":"UniinxDesignSystem_f52a6f","components":[{"name":"GARMENTS","sourcePath":"components/commerce/ClothTypeSelector.jsx"},{"name":"FABRICS","sourcePath":"components/commerce/ClothTypeSelector.jsx"},{"name":"ClothTypeSelector","sourcePath":"components/commerce/ClothTypeSelector.jsx"},{"name":"LANGUAGES","sourcePath":"components/commerce/LanguageChipSelector.jsx"},{"name":"FontVar","sourcePath":"components/commerce/LanguageChipSelector.jsx"},{"name":"LanguageChipSelector","sourcePath":"components/commerce/LanguageChipSelector.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"NavLanguageSwitcher","sourcePath":"components/core/NavLanguageSwitcher.jsx"},{"name":"BottomSheet","sourcePath":"components/navigation/BottomSheet.jsx"},{"name":"MobileTabBar","sourcePath":"components/navigation/MobileTabBar.jsx"}],"sourceHashes":{"components/commerce/ClothTypeSelector.jsx":"16700e890aba","components/commerce/LanguageChipSelector.jsx":"8d80b86d27c2","components/commerce/ProductCard.jsx":"9ce28f371382","components/core/Button.jsx":"daebb5d92a08","components/core/NavLanguageSwitcher.jsx":"7ad665518655","components/navigation/BottomSheet.jsx":"e3363f6aed87","components/navigation/MobileTabBar.jsx":"9566b8083f24","ui_kits/uniinx-storefront/CartPage.jsx":"3b7f9735661a","ui_kits/uniinx-storefront/DepartmentBand.jsx":"1f55fdf874c1","ui_kits/uniinx-storefront/Footer.jsx":"9820123ece10","ui_kits/uniinx-storefront/Header.jsx":"f61f156f3869","ui_kits/uniinx-storefront/Hero.jsx":"2a4553c71def","ui_kits/uniinx-storefront/LogoAnimationScene.jsx":"8de8ad6f07e7","ui_kits/uniinx-storefront/MissionSection.jsx":"f25f6ba0ae31","ui_kits/uniinx-storefront/Motion.jsx":"21b8532d40f3","ui_kits/uniinx-storefront/PLP.jsx":"0b147044d968","ui_kits/uniinx-storefront/ProductGrid.jsx":"d37cde79f8a2","ui_kits/uniinx-storefront/ProductPage.jsx":"ae9ed6945b64","ui_kits/uniinx-storefront/ProductPageFloating.jsx":"94f57c4f2695","ui_kits/uniinx-storefront/animations.jsx":"a8d2a696abaa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.UniinxDesignSystem_f52a6f = window.UniinxDesignSystem_f52a6f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/ClothTypeSelector.jsx
try { (() => {
/** Garment silhouette — style of the piece itself. */
const GARMENTS = [{
  id: "tshirt",
  label: "Tshirt",
  price: "R . 200"
}, {
  id: "hoodie",
  label: "Hoodie",
  price: "R . 650"
}, {
  id: "kurta",
  label: "Kurta",
  price: "R . 450"
}];

/** Fabric — the "cloth type" customization axis (weight/weave/hand-feel). */
const FABRICS = [{
  id: "cotton",
  label: "Cotton",
  swatch: "oklch(88% 0.01 60)"
}, {
  id: "khadi",
  label: "Khadi",
  swatch: "oklch(83% 0.02 70)"
}, {
  id: "linen",
  label: "Linen",
  swatch: "oklch(90% 0.008 90)"
}, {
  id: "silk",
  label: "Silk",
  swatch: "oklch(78% 0.05 40)"
}];
function Chips({
  items,
  value,
  onChange,
  label,
  renderSwatch
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": label,
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, items.map(item => {
    const selected = item.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      role: "radio",
      "aria-checked": selected,
      onClick: () => onChange && onChange(item.id),
      className: "uniinx-chip",
      style: {
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
        transform: selected ? "scale(1.03)" : "scale(1)"
      },
      onMouseEnter: e => {
        if (!selected) e.currentTarget.style.opacity = "0.85";
      },
      onMouseLeave: e => e.currentTarget.style.opacity = "1"
    }, renderSwatch && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: item.swatch,
        display: "inline-block",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)"
      }
    }), item.label);
  }));
}

/**
 * Two-in-one customization selector: garment style (Tshirt/Hoodie/Kurta)
 * and fabric/cloth type (Cotton/Khadi/Linen/Silk), each a 44px-min
 * radiogroup with a dark/light-on-accent selected state matching
 * LanguageChipSelector.
 */
function ClothTypeSelector({
  garmentId,
  onGarmentChange,
  fabricId,
  onFabricChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "STYLE"), /*#__PURE__*/React.createElement(Chips, {
    items: GARMENTS,
    value: garmentId,
    onChange: onGarmentChange,
    label: "Garment style"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "CLOTH"), /*#__PURE__*/React.createElement(Chips, {
    items: FABRICS,
    value: fabricId,
    onChange: onFabricChange,
    label: "Fabric",
    renderSwatch: true
  })));
}
const eyebrow = {
  fontFamily: "var(--font-work-sans)",
  fontSize: "var(--uniinx-cta-size)",
  letterSpacing: "var(--uniinx-tracking-tight)",
  color: "var(--stone)",
  marginBottom: 12
};
Object.assign(__ds_scope, { GARMENTS, FABRICS, ClothTypeSelector, __ds_default_components_commerce_ClothTypeSelector_o0c94h: ClothTypeSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ClothTypeSelector.jsx", error: String((e && e.message) || e) }); }

// components/commerce/LanguageChipSelector.jsx
try { (() => {
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
const LANGUAGES = [{
  id: "hindi",
  label: "Hindi",
  native: "हिन्दी",
  wordmark: "यूनिंक्स",
  font: "devanagari"
}, {
  id: "tamil",
  label: "Tamil",
  native: "தமிழ்",
  wordmark: "யூனிங்க்ஸ்",
  font: "tamil"
}, {
  id: "telugu",
  label: "Telugu",
  native: "తెలుగు",
  wordmark: "యూనింక్స్",
  font: "telugu"
}, {
  id: "kannada",
  label: "Kannada",
  native: "ಕನ್ನಡ",
  wordmark: "ಯೂನಿಂಕ್ಸ್",
  font: "kannada"
}, {
  id: "bengali",
  label: "Bengali",
  native: "বাংলা",
  wordmark: "ইউনিংক্স",
  font: "bengali"
}, {
  id: "marathi",
  label: "Marathi",
  native: "मराठी",
  wordmark: "युनिंक्स",
  font: "devanagari"
}, {
  id: "gujarati",
  label: "Gujarati",
  native: "ગુજરાતી",
  wordmark: "યુનિંક્સ",
  font: "gujarati"
}, {
  id: "punjabi",
  label: "Punjabi",
  native: "ਪੰਜਾਬੀ",
  wordmark: "ਯੂਨਿੰਕਸ",
  font: "gurmukhi"
}, {
  id: "odia",
  label: "Odia",
  native: "ଓଡ଼ିଆ",
  wordmark: "ଉନିଙ୍କ୍ସ",
  font: "oriya"
}, {
  id: "urdu",
  label: "Urdu",
  native: "اردو",
  wordmark: "یونینکس",
  font: "urdu",
  rtl: true
}, {
  id: "english",
  label: "English",
  native: "English",
  wordmark: "UNIINX",
  font: "marcellus"
}];
function FontVar(fontKey) {
  return `var(--font-${fontKey})`;
}

/**
 * Radio-group chip selector for design language. 44px-minimum hit
 * targets, dark/light selected state, native endonym set in its own
 * script's font.
 */
function LanguageChipSelector({
  value,
  onChange,
  languages = LANGUAGES,
  size = "md"
}) {
  const compact = size === "sm";
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": "Design language",
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, languages.map(l => {
    const selected = l.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: l.id,
      role: "radio",
      "aria-checked": selected,
      onClick: () => onChange && onChange(l.id),
      className: "uniinx-chip",
      style: {
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
        transform: selected ? "scale(1.03)" : "scale(1)"
      },
      onMouseEnter: e => {
        if (!selected) e.currentTarget.style.opacity = "0.85";
      },
      onMouseLeave: e => e.currentTarget.style.opacity = "1"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, l.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: compact ? 13 : 15,
        fontFamily: FontVar(l.font)
      },
      dir: l.rtl ? "rtl" : "ltr"
    }, l.native));
  }));
}
Object.assign(__ds_scope, { LANGUAGES, FontVar, LanguageChipSelector, __ds_default_components_commerce_LanguageChipSelector_1xfkxvh: LanguageChipSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/LanguageChipSelector.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pill CTA button — Uniinx's storefront treatment: a graphite pill
 * with tracked Marcellus caps ("Buy it →"), a lighter mist-gray
 * secondary tone, and (v3) a Kalamkari madder-red "accent" tone for the
 * primary purchase action.
 */
function Button({
  children = "Buy it →",
  tone = "dark",
  shape = "pill",
  font = "marcellus",
  onClick,
  style,
  ...rest
}) {
  const tones = {
    dark: {
      background: "var(--graphite)",
      color: "var(--paper)"
    },
    light: {
      background: "var(--mist)",
      color: "var(--ink)"
    },
    accent: {
      background: "var(--accent-cta)",
      color: "var(--paper)"
    }
  };
  const shapes = {
    pill: {
      borderRadius: "var(--radius-md)"
    },
    capsule: {
      borderRadius: "var(--radius-full)"
    }
  };
  const fonts = {
    marcellus: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "var(--uniinx-cta-size)",
      letterSpacing: "var(--uniinx-tracking-wide)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      border: "none",
      cursor: "pointer",
      padding: "12px 24px",
      lineHeight: 1,
      transition: "opacity 0.15s ease",
      ...tones[tone],
      ...shapes[shape],
      ...fonts[font],
      ...style
    },
    onMouseEnter: e => e.currentTarget.style.opacity = "0.85",
    onMouseLeave: e => e.currentTarget.style.opacity = "1"
  }, rest), children);
}
Object.assign(__ds_scope, { Button, __ds_default_components_core_Button_51d4zy: Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
/**
 * Storefront grid card: placeholder product photo, Marcellus item
 * label, tracked price, and a "Buy it →" pill. Mirrors the repeating
 * Card frame on Desktop-2 of the Uniinx storefront.
 */
function ProductCard({
  image,
  label = "Tshirt",
  price = "R . 200",
  width = 388,
  height = 527,
  onBuy
}) {
  const tones = ["teal", "ochre", "green", "maroon"];
  const tone = tones[[...label].reduce((s, c) => s + c.charCodeAt(0), 0) % tones.length];
  return /*#__PURE__*/React.createElement("div", {
    className: "uniinx-card",
    style: {
      position: "relative",
      width,
      height,
      fontFamily: "var(--font-marcellus)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: image ? "uniinx-card-photo" : "uniinx-card-photo uniinx-fabric",
    "data-tone": image ? undefined : tone,
    style: {
      width,
      height,
      borderRadius: "var(--space-sm)",
      backgroundColor: "var(--paper-warm)",
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 0,
      left: 0,
      zIndex: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: height - 70,
      fontSize: "var(--uniinx-eyebrow-size)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 39,
      top: height - 104,
      fontSize: "var(--uniinx-price-size)",
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--accent-cta)"
    }
  }, price), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    tone: "accent",
    shape: "pill",
    onClick: onBuy,
    style: {
      position: "absolute",
      right: 0,
      top: height - 70,
      padding: "11px 22px"
    }
  }, "Buy it \u2192"));
}
Object.assign(__ds_scope, { ProductCard, __ds_default_components_commerce_ProductCard_8nvryn: ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/NavLanguageSwitcher.jsx
try { (() => {
/**
 * The Uniinx wordmark doubles as the site language switcher: hover
 * (desktop) or tap (mobile) reveals a panel of the same 10 languages +
 * English. Each entry shows the same "Uniinx" wordmark transliterated
 * into that script (not the language's own name) so the panel reads as
 * recognizably the same brand, just in a different script — picking one
 * sets the active site language, echoed by the small wordmark caption
 * under the mark.
 */
function NavLanguageSwitcher({
  activeId,
  onSelect,
  wordmark = "UNIINX"
}) {
  const [open, setOpen] = React.useState(false);
  const active = __ds_scope.LANGUAGES.find(l => l.id === activeId) || __ds_scope.LANGUAGES[__ds_scope.LANGUAGES.length - 1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    "aria-label": "Choose language",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      textAlign: "left",
      fontFamily: "var(--font-work-sans)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--uniinx-body-size)",
      letterSpacing: "var(--uniinx-tracking-tight)"
    }
  }, wordmark), /*#__PURE__*/React.createElement("div", {
    key: active.id,
    style: {
      fontSize: 15,
      marginTop: 2,
      fontFamily: __ds_scope.FontVar(active.font),
      animation: "uniinx-menu-in 0.25s cubic-bezier(.16,.84,.32,1) both"
    },
    dir: active.rtl ? "rtl" : "ltr"
  }, active.wordmark)), open && /*#__PURE__*/React.createElement("div", {
    role: "menu",
    className: "uniinx-lang-menu",
    style: {
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
      width: 300
    }
  }, __ds_scope.LANGUAGES.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    role: "menuitem",
    onClick: () => {
      onSelect && onSelect(l.id);
      setOpen(false);
    },
    className: "uniinx-chip",
    style: {
      minHeight: 44,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 2,
      padding: "6px 10px",
      border: "none",
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      background: l.id === active.id ? "var(--paper-warm)" : "transparent",
      color: "var(--ink)",
      fontFamily: "var(--font-work-sans)"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--paper-warm)",
    onMouseLeave: e => e.currentTarget.style.background = l.id === active.id ? "var(--paper-warm)" : "transparent"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--stone)"
    }
  }, l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontFamily: __ds_scope.FontVar(l.font),
      color: "var(--accent-primary)"
    },
    dir: l.rtl ? "rtl" : "ltr"
  }, l.wordmark)))));
}
Object.assign(__ds_scope, { NavLanguageSwitcher, __ds_default_components_core_NavLanguageSwitcher_1j0vmec: NavLanguageSwitcher });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavLanguageSwitcher.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomSheet.jsx
try { (() => {
/**
 * Mobile bottom sheet: slides up over a scrim, used to host the cloth
 * type / language selectors on small screens where a full side-by-side
 * panel doesn't fit. Tap the scrim or the close rule to dismiss.
 */
function BottomSheet({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    className: "uniinx-sheet-scrim",
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(20,16,14,0.45)",
      zIndex: 90,
      display: "flex",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "uniinx-sheet-panel",
    style: {
      background: "var(--paper)",
      width: "100%",
      maxHeight: "78vh",
      overflowY: "auto",
      borderRadius: "20px 20px 0 0",
      padding: "12px 24px 32px",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.18)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: "var(--mist)"
    }
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 22,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)",
      marginBottom: 20
    }
  }, title), children));
}
Object.assign(__ds_scope, { BottomSheet, __ds_default_components_navigation_BottomSheet_of063r: BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MobileTabBar.jsx
try { (() => {
const ITEMS = [{
  id: "home",
  label: "Home"
}, {
  id: "plp",
  label: "Shop"
}, {
  id: "cart",
  label: "Cart"
}];

/**
 * Fixed bottom tab bar for the mobile layout (< 720px). Simple line
 * glyphs drawn with CSS shapes — no icon font shipped by the source, so
 * kept to the same restrained stroke language as the two source PNG
 * glyphs (search/cart).
 */
function MobileTabBar({
  active = "home",
  onNavigate,
  cartCount = 0
}) {
  const prevCount = React.useRef(cartCount);
  const [bump, setBump] = React.useState(false);
  React.useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);
  const activeIndex = Math.max(0, ITEMS.findIndex(i => i.id === active));
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      height: "var(--mobile-nav-height)",
      background: "var(--paper)",
      boxShadow: "0 -1px 0 var(--mist)",
      display: "flex",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      top: 6,
      bottom: 6,
      width: `calc(${100 / ITEMS.length}% - 12px)`,
      left: `calc(${activeIndex * 100 / ITEMS.length}% + 6px)`,
      background: "var(--paper-warm)",
      borderRadius: "var(--radius-md)",
      transition: "left 0.28s cubic-bezier(.16,.84,.32,1)"
    }
  }), ITEMS.map(item => {
    const selected = item.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => onNavigate && onNavigate(item.id),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        minHeight: 44,
        border: "none",
        background: "none",
        cursor: "pointer",
        position: "relative",
        color: selected ? "var(--accent-primary)" : "var(--stone)",
        fontFamily: "var(--font-work-sans)",
        fontSize: 11,
        letterSpacing: "var(--uniinx-tracking-tight)",
        transition: "color 0.2s ease, transform 0.15s ease",
        transform: selected ? "translateY(-1px)" : "none"
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      id: item.id,
      active: selected
    }), item.label, item.id === "cart" && cartCount > 0 && /*#__PURE__*/React.createElement("span", {
      className: bump ? "uniinx-badge-pop" : "",
      style: {
        position: "absolute",
        top: 2,
        right: "calc(50% - 20px)",
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        background: "var(--accent-cta)",
        color: "var(--paper)",
        fontSize: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 4px"
      }
    }, cartCount));
  }));
}
function Glyph({
  id,
  active
}) {
  const stroke = active ? "var(--accent-primary)" : "var(--stone)";
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.6
  };
  if (id === "home") {
    return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
      d: "M4 11.5 12 4l8 7.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 10v9h12v-9",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  if (id === "plp") {
    return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "7",
      height: "7",
      rx: "1.2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "13",
      y: "4",
      width: "7",
      height: "7",
      rx: "1.2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "13",
      width: "7",
      height: "7",
      rx: "1.2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "13",
      y: "13",
      width: "7",
      height: "7",
      rx: "1.2"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M5 6h14l-1.5 10.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 6Z",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 6a4 4 0 0 1 8 0",
    strokeLinecap: "round"
  }));
}
Object.assign(__ds_scope, { MobileTabBar, __ds_default_components_navigation_MobileTabBar_1yd3gfx: MobileTabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MobileTabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/CartPage.jsx
try { (() => {
function CartPage({
  items,
  onRemove,
  onContinue
}) {
  const {
    Button,
    GARMENTS,
    FABRICS,
    LANGUAGES,
    FontVar
  } = window.UniinxDesignSystem_f52a6f;
  const priceNum = p => parseInt(String(p).replace(/[^\d]/g, ""), 10) || 0;
  const total = items.reduce((sum, it) => sum + priceNum(it.price), 0);
  const [leaving, setLeaving] = React.useState(() => new Set());
  const requestRemove = (i, cartId) => {
    setLeaving(s => new Set(s).add(cartId ?? i));
    setTimeout(() => onRemove(i), 220);
  };
  if (items.length === 0) {
    return /*#__PURE__*/React.createElement(window.Reveal, {
      as: "section",
      style: {
        padding: "96px 55px 140px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "motif-madhubani-rule",
      style: {
        width: 64,
        margin: "0 auto 24px"
      }
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-marcellus)",
        fontSize: 32,
        color: "var(--ink)"
      }
    }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-work-sans)",
        color: "var(--stone)",
        marginBottom: 32
      }
    }, "Every piece here can be printed in your language."), /*#__PURE__*/React.createElement(Button, {
      tone: "accent",
      shape: "pill",
      onClick: onContinue
    }, "Shop New Arrivals \u2192"));
  }
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "40px 55px 140px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-madhubani-rule",
    style: {
      width: 64,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(32px, 5vw, 48px)",
      color: "var(--ink)",
      margin: "0 0 32px"
    }
  }, "Your Cart"), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-cart-layout"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, items.map((it, i) => {
    const garment = GARMENTS.find(g => g.id === it.garmentId);
    const fabric = FABRICS.find(f => f.id === it.fabricId);
    const language = LANGUAGES.find(l => l.id === it.languageId);
    const isLeaving = leaving.has(it.cartId ?? i);
    return /*#__PURE__*/React.createElement("div", {
      key: it.cartId ?? i,
      className: `uniinx-cart-item${isLeaving ? " is-leaving" : ""}`,
      style: {
        display: "flex",
        gap: 20,
        alignItems: "center",
        padding: 20,
        borderRadius: "var(--radius-sm)",
        background: "var(--paper-warm)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "uniinx-fabric",
      "data-tone": ["teal", "ochre", "green", "maroon"][i % 4],
      style: {
        width: 88,
        height: 110,
        borderRadius: "var(--radius-sm)",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-marcellus)",
        fontSize: 20,
        color: "var(--ink)"
      }
    }, it.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-work-sans)",
        fontSize: 13,
        color: "var(--stone)",
        marginTop: 4
      }
    }, garment ? garment.label : "Tshirt", " \xB7 ", fabric ? fabric.label : "Cotton"), language && /*#__PURE__*/React.createElement("div", {
      dir: language.rtl ? "rtl" : "ltr",
      style: {
        fontFamily: FontVar(language.font),
        fontSize: 14,
        color: "var(--accent-primary)",
        marginTop: 4
      }
    }, language.label, " \xB7 ", language.native)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-marcellus)",
        fontSize: 16,
        letterSpacing: "var(--uniinx-tracking-wide)",
        color: "var(--accent-cta)"
      }
    }, it.price), /*#__PURE__*/React.createElement("button", {
      onClick: () => requestRemove(i, it.cartId),
      "aria-label": "Remove",
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--stone)",
        fontSize: 20,
        minHeight: 44,
        minWidth: 44,
        transition: "color 0.15s ease, transform 0.15s ease"
      },
      onMouseEnter: e => {
        e.currentTarget.style.color = "var(--accent-cta)";
        e.currentTarget.style.transform = "scale(1.15)";
      },
      onMouseLeave: e => {
        e.currentTarget.style.color = "var(--stone)";
        e.currentTarget.style.transform = "scale(1)";
      }
    }, "\xD7"));
  })), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 100,
    style: {
      borderRadius: "var(--radius-lg)",
      background: "var(--paper-warm)",
      padding: 32,
      alignSelf: "flex-start",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-temple-arch",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 22,
      color: "var(--ink)",
      marginTop: 16
    }
  }, "Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 20,
      fontFamily: "var(--font-work-sans)",
      color: "var(--stone)"
    }
  }, /*#__PURE__*/React.createElement("span", null, items.length, " item", items.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("span", null, "R . ", total)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 24,
      fontFamily: "var(--font-marcellus)",
      fontSize: 18,
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      transition: "opacity 0.2s ease"
    },
    key: total
  }, "R . ", total)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    tone: "accent",
    shape: "pill",
    style: {
      width: "100%",
      textAlign: "center"
    }
  }, "Checkout \u2192")))));
}
window.CartPage = CartPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/CartPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/DepartmentBand.jsx
try { (() => {
function DepartmentBand({
  onNavigate
}) {
  const cards = [{
    key: "men",
    title: "MEN",
    big: true,
    tone: "var(--kalamkari-teal-600)",
    fabricTone: "teal",
    nav: "plp:men"
  }, {
    key: "women",
    title: "WOMEN",
    tone: "var(--kalamkari-red-600)",
    fabricTone: "maroon",
    nav: "plp:women"
  }, {
    key: "acc",
    title: "ACCESSORIES",
    tone: "var(--kalamkari-ochre-500)",
    fabricTone: "ochre",
    nav: "plp:accessories"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "32px 65px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "uniinx-dept-grid"
  }, cards.map((c, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: c.key,
    delay: i * 90,
    className: "uniinx-dept-card uniinx-fabric",
    "data-tone": c.fabricTone,
    onClick: () => onNavigate && onNavigate(c.nav),
    style: {
      position: "relative",
      minHeight: c.big ? 320 : 220,
      gridColumn: c.big ? "span 2" : "span 1",
      borderRadius: "var(--radius-sm)",
      boxShadow: `inset 0 0 0 2px ${c.tone}`,
      display: "flex",
      alignItems: "flex-end",
      padding: 24,
      cursor: onNavigate ? "pointer" : "default",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 0,
      right: 0,
      transform: "rotate(90deg)",
      borderColor: c.tone,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      fontFamily: "var(--font-marcellus)",
      fontSize: c.big ? "clamp(40px, 6vw, 96px)" : 28,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--paper)",
      textShadow: "0 2px 18px rgba(20,16,14,0.35)",
      lineHeight: 1
    }
  }, c.title)))));
}
window.DepartmentBand = DepartmentBand;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/DepartmentBand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement(window.Reveal, {
    as: "footer",
    style: {
      padding: "32px 55px 96px",
      borderTop: "1px solid var(--ink)"
    },
    className: "uniinx-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-block-print",
    style: {
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(24px, 4vw, 32px)",
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--accent-deep)",
      textAlign: "center"
    }
  }, "Footer map"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: "var(--font-marcellus)",
      fontSize: 18,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--ink)",
      textAlign: "center"
    }
  }, "To this country & it's people"));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/Header.jsx
try { (() => {
function Header({
  view,
  onNavigate,
  language,
  onLanguageChange
}) {
  const {
    NavLanguageSwitcher
  } = window.UniinxDesignSystem_f52a6f;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navItems = [{
    id: "home",
    label: "Home"
  }, {
    id: "plp:men",
    label: "Men"
  }, {
    id: "plp:women",
    label: "Women"
  }, {
    id: "plp:accessories",
    label: "Accessories"
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 60,
      background: "var(--paper)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 55px",
      fontFamily: "var(--font-work-sans)",
      fontSize: "var(--uniinx-body-size)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)"
    },
    className: "uniinx-header"
  }, /*#__PURE__*/React.createElement(NavLanguageSwitcher, {
    activeId: language,
    onSelect: onLanguageChange
  }), /*#__PURE__*/React.createElement("nav", {
    className: "uniinx-hide-mobile",
    style: {
      display: "flex",
      gap: 32
    }
  }, navItems.map(n => /*#__PURE__*/React.createElement("span", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    style: {
      cursor: "pointer",
      color: view === n.id ? "var(--accent-primary)" : "var(--ink)"
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uniinx-icon-search.png",
    alt: "",
    style: {
      width: 20,
      height: 20
    },
    className: "uniinx-hide-mobile"
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uniinx-icon-cart.png",
    alt: "cart",
    onClick: () => onNavigate("cart"),
    style: {
      width: 22,
      height: 20,
      cursor: "pointer"
    },
    className: "uniinx-hide-mobile"
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Menu",
    onClick: () => setMenuOpen(o => !o),
    className: "uniinx-hide-desktop",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 8,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ink)",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h16M4 12h16M4 18h16"
  })))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "uniinx-hide-desktop uniinx-mobile-menu",
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "var(--paper)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      padding: "12px 24px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, navItems.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => {
      onNavigate(n.id);
      setMenuOpen(false);
    },
    style: {
      minHeight: 44,
      textAlign: "left",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-work-sans)",
      fontSize: 17,
      color: view === n.id ? "var(--accent-primary)" : "var(--ink)"
    }
  }, n.label))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/Hero.jsx
try { (() => {
function Hero({
  onShopNew
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    className: "motif-kalamkari-frame uniinx-fabric",
    "data-tone": "maroon",
    style: {
      margin: "36px 65px 0",
      height: "min(440px, 58vh)",
      borderRadius: 4,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-start",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 10,
      left: 10,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 10,
      right: 10,
      transform: "rotate(90deg)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      bottom: 10,
      left: 10,
      transform: "rotate(-90deg)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      bottom: 10,
      right: 10,
      transform: "rotate(180deg)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      padding: "28px 32px",
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: 12,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--paper)",
      textTransform: "uppercase",
      opacity: 0.85
    }
  }, "Hand-painted tree-of-life & peacock"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 15,
      color: "var(--paper)",
      marginTop: 8,
      lineHeight: 1.5,
      opacity: 0.75
    }
  }, "Placeholder wash \u2014 swap for the commissioned Kalamkari artwork"))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 65px 8px",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-madhubani-rule",
    style: {
      width: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "motif-kalamkari-vine",
    style: {
      width: 40
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 65px 0",
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: 13,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--accent-cta)",
      textTransform: "uppercase",
      marginBottom: 16
    }
  }, "Handprinted \xB7 For every language, for every state"), /*#__PURE__*/React.createElement(window.Reveal, {
    as: "h1",
    delay: 90,
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(40px, 6vw, 84px)",
      lineHeight: 1.02,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)",
      margin: 0
    }
  }, "Clothes in", /*#__PURE__*/React.createElement("br", null), "your Language")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 65px 64px",
      display: "flex",
      alignItems: "flex-end",
      gap: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    as: "p",
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: "var(--uniinx-body-size)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)",
      lineHeight: 1.5,
      margin: 0,
      maxWidth: 480,
      flex: "1 1 260px"
    }
  }, "UNIINX ~ every design, printed in the script that feels like home."), /*#__PURE__*/React.createElement(window.Reveal, {
    as: "button",
    delay: 120,
    onClick: onShopNew,
    style: {
      background: "var(--accent-cta)",
      color: "var(--paper)",
      border: "none",
      borderRadius: "var(--radius-md)",
      padding: "14px 32px",
      fontFamily: "var(--font-work-sans)",
      fontSize: "var(--uniinx-body-size)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      cursor: "pointer",
      transition: "opacity 0.15s ease, transform 0.15s ease"
    },
    onMouseEnter: e => e.currentTarget.style.opacity = "0.85",
    onMouseLeave: e => e.currentTarget.style.opacity = "1"
  }, "New Arrivals")));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/LogoAnimationScene.jsx
try { (() => {
/**
 * UNIINX "ink weave" logo animation.
 *
 * Sequence: Telugu → Hindi → Tamil → Kannada → Bengali → Marathi →
 * Gujarati → Punjabi → Odia → Urdu → Latin "UNIINX" (final hold).
 * Each step is the SAME word — a transliteration of "Uniinx" itself,
 * not the language's own name — so the loop reads as one brand mark
 * traveling through scripts, landing on the wordmark.
 *
 * Motion: a single clip-path wipe animates text + underline thread
 * together (same reference box), so the thread reads as an ink line
 * the letters are drawn from. Reveal → hold → retract-right, so each
 * word visually "pulls" itself off to the right as the next begins —
 * that's the continuous weave, done with sequential cuts instead of
 * true glyph morphing (real script-to-script letterform morphing isn't
 * feasible — the shapes don't share topology).
 *
 * BRAND COLORS — this is deliberately monochrome so it's easy to
 * restyle. Change INK / PAPER below (or swap in CSS vars) once real
 * brand colors are picked; nothing else in the animation needs to change.
 */

const INK = "#141110";
const PAPER = "#faf8f4";
const STEPS = [{
  text: "యూనింక్స్",
  font: '"Noto Serif Telugu", serif'
}, {
  text: "यूनिंक्स",
  font: '"Noto Serif Devanagari", serif'
}, {
  text: "யூனிங்க்ஸ்",
  font: '"Noto Serif Tamil", serif'
}, {
  text: "ಯೂನಿಂಕ್ಸ್",
  font: '"Noto Serif Kannada", serif'
}, {
  text: "ইউনিংক্স",
  font: '"Noto Serif Bengali", serif'
}, {
  text: "युनिंक्स",
  font: '"Noto Serif Devanagari", serif'
}, {
  text: "યુનિંક્સ",
  font: '"Noto Serif Gujarati", serif'
}, {
  text: "ਯੂਨਿੰਕਸ",
  font: '"Noto Serif Gurmukhi", serif'
}, {
  text: "ଉନିଙ୍କ୍ସ",
  font: '"Noto Serif Oriya", serif'
}, {
  text: "یونینکس",
  font: '"Noto Nastaliq Urdu", serif',
  rtl: true
}, {
  text: "UNIINX",
  font: '"Marcellus", serif',
  final: true
}];
const STEP_DUR = 0.62;
const FINAL_HOLD = 2.0;
function stepTiming(i) {
  const start = i * STEP_DUR;
  const isFinal = i === STEPS.length - 1;
  const end = start + (isFinal ? STEP_DUR + FINAL_HOLD : STEP_DUR);
  return {
    start,
    end
  };
}
const TOTAL_DURATION = stepTiming(STEPS.length - 1).end + 0.3;
function WordWeave({
  text,
  font,
  rtl,
  isFinal
}) {
  const {
    progress
  } = window.useSprite();
  const revealEnd = isFinal ? 0.55 : 0.42;
  const retractStart = isFinal ? 1 : 0.78;
  const revealFrac = window.clamp(progress / revealEnd, 0, 1);
  const retractFrac = isFinal ? 0 : window.clamp((progress - retractStart) / (1 - retractStart), 0, 1);
  const revealEase = window.Easing.easeOutCubic ? window.Easing.easeOutCubic(revealFrac) : revealFrac;
  const retractEase = window.Easing.easeInCubic ? window.Easing.easeInCubic(retractFrac) : retractFrac;
  const openInset = (1 - revealEase) * 100; // shrinks 100 -> 0 as word draws in
  const closeInset = retractEase * 100; // grows 0 -> 100 as word pulls away

  const clipPath = rtl ? `inset(0 ${closeInset}% 0 ${openInset}%)` : `inset(0 ${openInset}% 0 ${closeInset}%)`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-block",
      clipPath
    }
  }, /*#__PURE__*/React.createElement("div", {
    dir: rtl ? "rtl" : "ltr",
    style: {
      fontFamily: font,
      fontSize: isFinal ? 130 : 108,
      letterSpacing: isFinal ? "0.02em" : "normal",
      color: INK,
      whiteSpace: "nowrap",
      lineHeight: 1,
      padding: "0 4px"
    }
  }, text), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4,
      right: 4,
      bottom: -22,
      height: 4,
      borderRadius: 2,
      background: INK
    }
  })));
}
function LogoAnimationScene() {
  const {
    Stage,
    Sprite
  } = window;
  return /*#__PURE__*/React.createElement(Stage, {
    width: 1080,
    height: 1080,
    duration: TOTAL_DURATION,
    background: PAPER,
    loop: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 64,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: '"Work Sans", sans-serif',
      fontSize: 15,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: INK,
      opacity: 0.55
    }
  }, "Clothes in your Language"), STEPS.map((step, i) => {
    const {
      start,
      end
    } = stepTiming(i);
    return /*#__PURE__*/React.createElement(Sprite, {
      key: i,
      start: start,
      end: end
    }, /*#__PURE__*/React.createElement(WordWeave, {
      text: step.text,
      font: step.font,
      rtl: step.rtl,
      isFinal: step.final
    }));
  }));
}
window.LogoAnimationScene = LogoAnimationScene;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/LogoAnimationScene.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/MissionSection.jsx
try { (() => {
function MissionSection() {
  return /*#__PURE__*/React.createElement(window.Reveal, {
    as: "section",
    style: {
      margin: "0 55px 96px",
      borderRadius: "var(--radius-lg)",
      background: "var(--paper-warm)",
      padding: "56px 64px",
      display: "flex",
      gap: 64,
      flexWrap: "wrap",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-temple-arch",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(28px, 4vw, 40px)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--accent-deep)",
      margin: "16px 0 0",
      whiteSpace: "pre-line"
    }
  }, "OUR\nMISSION"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 16,
      lineHeight: 1.6,
      maxWidth: 480,
      color: "var(--ink)",
      marginTop: 16
    }
  }, "We believe that our true emotion can only be shared through our mother tongue. As people of India, we embrace all the languages that our country has, and we are proud to hold linguistic richness and cultural heritage. To help this grow, we are introducing our designs to every language as possible."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 22,
      lineHeight: 1.6,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--accent-cta)",
      margin: "16px 0 0",
      whiteSpace: "pre-line"
    }
  }, "For Every Language,\nFor Every State,\nFor Every One,\nFor India."));
}
window.MissionSection = MissionSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/MissionSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/Motion.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Shared motion helpers for the storefront kit. Kept in one file so
 * every screen (home, PLP, PDP, cart) uses the same easing/timing
 * vocabulary instead of one-off transitions per component.
 *
 * - <Reveal> fades + rises an element into place the first time it
 *   scrolls into view (IntersectionObserver, fires once, respects
 *   prefers-reduced-motion via the .reveal CSS rule in index.html).
 * - <CrossFade> swaps its `keyId`-addressed child with a soft
 *   cross-dissolve instead of a hard cut (used for the PDP garment
 *   photo + "printed in ___" caption).
 * - pressable(el) is a tiny onMouseDown/Up/Leave helper for a
 *   consistent "press" micro-interaction on tappable cards.
 */

function Reveal({
  children,
  delay = 0,
  as = "div",
  style,
  className = "",
  ...rest
}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    className: `reveal ${inView ? "is-in" : ""} ${className}`.trim(),
    style: {
      transitionDelay: `${delay}ms`,
      ...style
    }
  }, rest), children);
}
function CrossFade({
  keyId,
  children,
  style
}) {
  const [display, setDisplay] = React.useState({
    key: keyId,
    node: children
  });
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (keyId === display.key) {
      setDisplay({
        key: keyId,
        node: children
      });
      return;
    }
    setVisible(false);
    const t = setTimeout(() => {
      setDisplay({
        key: keyId,
        node: children
      });
      setVisible(true);
    }, 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyId]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      transition: "opacity 0.18s ease, transform 0.22s ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.985)",
      ...style
    }
  }, display.node);
}
function pressable(scaleDown = 0.97) {
  return {
    onMouseDown: e => e.currentTarget.style.transform = `scale(${scaleDown})`,
    onMouseUp: e => e.currentTarget.style.transform = "",
    onMouseLeave: e => e.currentTarget.style.transform = ""
  };
}
window.Reveal = Reveal;
window.CrossFade = CrossFade;
window.pressable = pressable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/Motion.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/PLP.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PLP_PRODUCTS = [{
  label: "Tshirt",
  price: "R . 200",
  image: "../assets/uniinx-tshirt-product.png"
}, {
  label: "Kurta",
  price: "R . 450"
}, {
  label: "Dupatta",
  price: "R . 320"
}, {
  label: "Hoodie",
  price: "R . 650"
}, {
  label: "Saree Blouse",
  price: "R . 380"
}, {
  label: "Angavastram",
  price: "R . 290"
}];
const DEPT_LABEL = {
  "plp:men": "MEN",
  "plp:women": "WOMEN",
  "plp:accessories": "ACCESSORIES"
};
function PLP({
  view,
  onSelectProduct
}) {
  const {
    LanguageChipSelector,
    ClothTypeSelector,
    BottomSheet,
    ProductCard
  } = window.UniinxDesignSystem_f52a6f;
  const [languageId, setLanguageId] = React.useState(null);
  const [fabricId, setFabricId] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const Filters = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "CLOTH"), /*#__PURE__*/React.createElement(ClothTypeSelector, {
    fabricId: fabricId,
    onFabricChange: setFabricId
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "LANGUAGE"), /*#__PURE__*/React.createElement(LanguageChipSelector, {
    value: languageId,
    onChange: setLanguageId,
    size: "sm"
  })));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "40px 55px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "motif-madhubani-rule",
    style: {
      width: 64,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(32px, 5vw, 56px)",
      color: "var(--ink)",
      margin: "0 0 8px"
    }
  }, DEPT_LABEL[view] || "SHOP"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-work-sans)",
      color: "var(--stone)",
      margin: "0 0 32px"
    }
  }, PLP_PRODUCTS.length, " designs \xB7 every piece prints in your language"), /*#__PURE__*/React.createElement("button", {
    className: "uniinx-hide-desktop",
    onClick: () => setSheetOpen(true),
    style: {
      minHeight: 44,
      marginBottom: 20,
      padding: "10px 20px",
      border: "1px solid var(--mist)",
      borderRadius: "var(--radius-md)",
      background: "var(--paper)",
      fontFamily: "var(--font-work-sans)",
      cursor: "pointer"
    }
  }, "Filters \xB7 Cloth & Language"), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-plp-layout"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "uniinx-hide-mobile"
  }, Filters), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-product-grid"
  }, PLP_PRODUCTS.map((p, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: p.label,
    delay: i * 60,
    onClick: () => onSelectProduct && onSelectProduct(p),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(ProductCard, _extends({
    width: "100%",
    height: 340
  }, p, {
    onBuy: () => onSelectProduct && onSelectProduct(p)
  })))))), /*#__PURE__*/React.createElement(BottomSheet, {
    open: sheetOpen,
    onClose: () => setSheetOpen(false),
    title: "Cloth & Language"
  }, Filters));
}
const eyebrow = {
  fontFamily: "var(--font-work-sans)",
  fontSize: "var(--uniinx-cta-size)",
  letterSpacing: "var(--uniinx-tracking-tight)",
  color: "var(--stone)",
  marginBottom: 12
};
window.PLP = PLP;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/PLP.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/ProductGrid.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PRODUCTS = [{
  label: "Tshirt",
  price: "R . 200",
  image: "../assets/uniinx-tshirt-product.png"
}, {
  label: "Kurta",
  price: "R . 450"
}, {
  label: "Dupatta",
  price: "R . 320"
}, {
  label: "Hoodie",
  price: "R . 650"
}];
function ProductGrid({
  title = "NEWEST IN THE STORE",
  onSelectProduct
}) {
  const {
    ProductCard
  } = window.UniinxDesignSystem_f52a6f;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "48px 55px"
    },
    className: "uniinx-section"
  }, /*#__PURE__*/React.createElement(window.Reveal, {
    className: "motif-madhubani-rule",
    style: {
      width: 64,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement(window.Reveal, {
    as: "h2",
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "clamp(32px, 4.5vw, 48px)",
      lineHeight: 1.05,
      letterSpacing: "var(--uniinx-tracking-tight)",
      margin: "0 0 32px",
      color: "var(--ink)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-product-grid"
  }, PRODUCTS.map((p, i) => /*#__PURE__*/React.createElement(window.Reveal, {
    key: p.label,
    delay: i * 70,
    onClick: () => onSelectProduct && onSelectProduct(p),
    style: {
      cursor: onSelectProduct ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement(ProductCard, _extends({
    width: "100%",
    height: 340
  }, p, {
    onBuy: () => onSelectProduct && onSelectProduct(p)
  }))))));
}
window.ProductGrid = ProductGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/ProductGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/ProductPage.jsx
try { (() => {
const GARMENT_IMAGES = {
  tshirt: "../assets/uniinx-tshirt-product.png",
  hoodie: null,
  kurta: null
};
const GARMENT_PRICE = {
  tshirt: "R . 200",
  hoodie: "R . 650",
  kurta: "R . 450"
};
function ProductPage({
  onBack,
  onAddToCart
}) {
  const {
    Button,
    ClothTypeSelector,
    LanguageChipSelector,
    GARMENTS,
    LANGUAGES,
    BottomSheet,
    FontVar
  } = window.UniinxDesignSystem_f52a6f;
  const [garmentId, setGarmentId] = React.useState(GARMENTS[0].id);
  const [fabricId, setFabricId] = React.useState("cotton");
  const [languageId, setLanguageId] = React.useState(LANGUAGES[0].id);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const language = LANGUAGES.find(l => l.id === languageId);
  const price = GARMENT_PRICE[garmentId];
  const image = GARMENT_IMAGES[garmentId];
  const Selectors = /*#__PURE__*/React.createElement(ClothTypeSelector, {
    garmentId: garmentId,
    onGarmentChange: setGarmentId,
    fabricId: fabricId,
    onFabricChange: setFabricId
  });
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "48px 55px 140px"
    },
    className: "uniinx-pdp"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      marginBottom: 32,
      fontFamily: "var(--font-work-sans)",
      fontSize: "var(--uniinx-cta-size)",
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)"
    }
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-pdp-layout"
  }, /*#__PURE__*/React.createElement(window.Reveal, null, /*#__PURE__*/React.createElement(window.CrossFade, {
    keyId: garmentId
  }, /*#__PURE__*/React.createElement("div", {
    className: image ? undefined : "uniinx-fabric",
    "data-tone": image ? undefined : {
      tshirt: "teal",
      hoodie: "green",
      kurta: "ochre"
    }[garmentId] || "maroon",
    style: {
      aspectRatio: "7 / 9",
      maxWidth: 420,
      borderRadius: "var(--space-sm)",
      backgroundColor: "var(--paper-warm)",
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: image ? "block" : "flex",
      alignItems: "flex-end",
      justifyContent: "flex-start",
      textAlign: "left",
      padding: image ? 0 : 24,
      fontFamily: "var(--font-work-sans)",
      fontSize: 13,
      color: "var(--paper)",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 0,
      left: 0,
      zIndex: 1
    }
  }), !image && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      opacity: 0.85
    }
  }, "Garment photography placeholder \u2014 swap for the studio shot"))), /*#__PURE__*/React.createElement(window.CrossFade, {
    keyId: languageId
  }, /*#__PURE__*/React.createElement("p", {
    dir: language.rtl ? "rtl" : "ltr",
    style: {
      marginTop: 16,
      fontFamily: FontVar(language.font),
      fontSize: 16,
      color: "var(--accent-primary)"
    }
  }, "Printed in ", language.label, " \xB7 ", language.native))), /*#__PURE__*/React.createElement(window.Reveal, {
    delay: 90,
    style: {
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: "var(--uniinx-eyebrow-size)",
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--stone)"
    }
  }, "DESIGN"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 48,
      lineHeight: 1.05,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)",
      margin: "8px 0 0"
    }
  }, "Bhasha Print"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: "var(--font-marcellus)",
      fontSize: 20,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--accent-cta)",
      transition: "opacity 0.2s ease"
    },
    key: price
  }, price), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-hide-mobile",
    style: {
      marginTop: 40
    }
  }, Selectors, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "LANGUAGE"), /*#__PURE__*/React.createElement(LanguageChipSelector, {
    value: languageId,
    onChange: setLanguageId
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    tone: "accent",
    shape: "pill",
    onClick: () => onAddToCart && onAddToCart({
      label: "Bhasha Print",
      garmentId,
      fabricId,
      languageId,
      price
    })
  }, "Buy it \u2192"))), /*#__PURE__*/React.createElement("button", {
    className: "uniinx-hide-desktop",
    onClick: () => setSheetOpen(true),
    style: {
      marginTop: 32,
      minHeight: 44,
      width: "100%",
      padding: "12px 20px",
      border: "1px solid var(--mist)",
      borderRadius: "var(--radius-md)",
      background: "var(--paper)",
      fontFamily: "var(--font-work-sans)",
      cursor: "pointer",
      textAlign: "left"
    }
  }, "Customize \xB7 ", GARMENTS.find(g => g.id === garmentId).label, ", ", language.label, " \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-hide-desktop uniinx-sticky-buy"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 18,
      color: "var(--accent-cta)"
    }
  }, price), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: 12,
      color: "var(--stone)"
    }
  }, language.label)), /*#__PURE__*/React.createElement(Button, {
    tone: "accent",
    shape: "pill",
    onClick: () => onAddToCart && onAddToCart({
      label: "Bhasha Print",
      garmentId,
      fabricId,
      languageId,
      price
    })
  }, "Buy it \u2192")), /*#__PURE__*/React.createElement(BottomSheet, {
    open: sheetOpen,
    onClose: () => setSheetOpen(false),
    title: "Customize"
  }, Selectors, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "LANGUAGE"), /*#__PURE__*/React.createElement(LanguageChipSelector, {
    value: languageId,
    onChange: setLanguageId,
    size: "sm"
  }))));
}
const eyebrow = {
  fontFamily: "var(--font-work-sans)",
  fontSize: "var(--uniinx-cta-size)",
  letterSpacing: "var(--uniinx-tracking-tight)",
  color: "var(--stone)",
  marginBottom: 12
};
window.ProductPage = ProductPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/ProductPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/ProductPageFloating.jsx
try { (() => {
/**
 * ProductPageFloating — an alternate PDP composition: an open, airy
 * "studio" canvas with the garment large and centered, and all controls
 * living in floating pill/card chrome around the edges (back pill top-left,
 * garment-style rail on the right, a single info card bottom-left) rather
 * than a fixed two-column layout. Borrows the *composition* of a dedicated
 * garment-customizer canvas — not any particular brand's visuals, and no
 * 3D/rotation — while keeping Uniinx's own type, color and motion system.
 *
 * Customization stays exactly what the storefront already offers: garment
 * style, fabric, and print language. No color/pattern drawing tool.
 */

const GARMENT_IMAGES = {
  tshirt: "../assets/uniinx-tshirt-product.png",
  hoodie: null,
  kurta: null
};
const GARMENT_PRICE = {
  tshirt: "R . 200",
  hoodie: "R . 650",
  kurta: "R . 450"
};
const GARMENT_TONE = {
  tshirt: "teal",
  hoodie: "green",
  kurta: "ochre"
};
function ProductPageFloating({
  onBack,
  onAddToCart
}) {
  const {
    Button,
    GARMENTS,
    FABRICS,
    LanguageChipSelector,
    LANGUAGES,
    FontVar
  } = window.UniinxDesignSystem_f52a6f;
  const [garmentId, setGarmentId] = React.useState(GARMENTS[0].id);
  const [fabricId, setFabricId] = React.useState("cotton");
  const [languageId, setLanguageId] = React.useState(LANGUAGES[0].id);
  const language = LANGUAGES.find(l => l.id === languageId);
  const price = GARMENT_PRICE[garmentId];
  const image = GARMENT_IMAGES[garmentId];
  const tone = GARMENT_TONE[garmentId] || "maroon";
  const garment = GARMENTS.find(g => g.id === garmentId);
  const addNow = () => onAddToCart && onAddToCart({
    label: "Bhasha Print",
    garmentId,
    fabricId,
    languageId,
    price
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "uniinx-pdp-canvas",
    style: {
      position: "relative",
      minHeight: "100vh",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "uniinx-pdp-canvas-dots"
  }), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-floating-pill uniinx-pdp-back-pill"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      border: "none",
      background: "var(--paper-warm)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-work-sans)",
      fontSize: 15,
      color: "var(--ink)"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 15,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--ink)"
    }
  }, "UNIINX")), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-pdp-canvas-stage"
  }, /*#__PURE__*/React.createElement(window.CrossFade, {
    keyId: garmentId
  }, /*#__PURE__*/React.createElement("div", {
    className: image ? undefined : "uniinx-fabric",
    "data-tone": image ? undefined : tone,
    style: {
      width: "min(64vw, 480px)",
      aspectRatio: "7 / 9",
      borderRadius: "var(--space-sm)",
      backgroundColor: "var(--paper-warm)",
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "0 40px 80px -32px rgba(20,16,14,0.28)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "motif-kalamkari-corner",
    style: {
      top: 0,
      left: 0,
      zIndex: 1
    }
  }))), /*#__PURE__*/React.createElement(window.CrossFade, {
    keyId: languageId
  }, /*#__PURE__*/React.createElement("p", {
    dir: language.rtl ? "rtl" : "ltr",
    style: {
      marginTop: 20,
      fontFamily: FontVar(language.font),
      fontSize: 16,
      color: "var(--accent-primary)",
      textAlign: "center"
    }
  }, "Printed in ", language.label, " \xB7 ", language.native))), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-pdp-rail uniinx-hide-mobile"
  }, GARMENTS.map(g => {
    const selected = g.id === garmentId;
    return /*#__PURE__*/React.createElement("button", {
      key: g.id,
      onClick: () => setGarmentId(g.id),
      "aria-label": g.label,
      "aria-pressed": selected,
      className: "uniinx-pdp-rail-item",
      style: {
        boxShadow: selected ? "0 0 0 2px var(--paper), 0 0 0 4px var(--accent-primary)" : "0 0 0 2px var(--paper), 0 0 0 3px var(--mist)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: GARMENT_IMAGES[g.id] ? undefined : "uniinx-fabric",
      "data-tone": GARMENT_IMAGES[g.id] ? undefined : GARMENT_TONE[g.id],
      style: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        backgroundImage: GARMENT_IMAGES[g.id] ? `url(${GARMENT_IMAGES[g.id]})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-floating-card uniinx-pdp-info-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: 12,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--stone)"
    }
  }, "DESIGN"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 30,
      lineHeight: 1.08,
      letterSpacing: "var(--uniinx-tracking-tight)",
      color: "var(--ink)",
      margin: "4px 0 0"
    }
  }, "Bhasha Print"), /*#__PURE__*/React.createElement("div", {
    key: price,
    style: {
      marginTop: 10,
      fontFamily: "var(--font-marcellus)",
      fontSize: 17,
      letterSpacing: "var(--uniinx-tracking-wide)",
      color: "var(--accent-cta)"
    }
  }, price), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    },
    className: "uniinx-hide-mobile"
  }, FABRICS.map(f => {
    const selected = f.id === fabricId;
    return /*#__PURE__*/React.createElement("button", {
      key: f.id,
      onClick: () => setFabricId(f.id),
      className: "uniinx-chip",
      style: {
        minHeight: 32,
        padding: "6px 14px",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-marcellus)",
        fontSize: 12,
        letterSpacing: "var(--uniinx-tracking-wide)",
        background: selected ? "var(--accent-primary)" : "var(--paper-warm)",
        color: selected ? "var(--paper)" : "var(--ink)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: f.swatch,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)"
      }
    }), f.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    },
    className: "uniinx-hide-mobile"
  }, /*#__PURE__*/React.createElement(LanguageChipSelector, {
    value: languageId,
    onChange: setLanguageId,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    tone: "accent",
    shape: "pill",
    onClick: addNow
  }, "Buy it \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-pdp-rail-mobile uniinx-hide-desktop"
  }, GARMENTS.map(g => {
    const selected = g.id === garmentId;
    return /*#__PURE__*/React.createElement("button", {
      key: g.id,
      onClick: () => setGarmentId(g.id),
      "aria-label": g.label,
      className: "uniinx-pdp-rail-item",
      style: {
        boxShadow: selected ? "0 0 0 2px var(--paper), 0 0 0 4px var(--accent-primary)" : "0 0 0 2px var(--paper), 0 0 0 3px var(--mist)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: GARMENT_IMAGES[g.id] ? undefined : "uniinx-fabric",
      "data-tone": GARMENT_IMAGES[g.id] ? undefined : GARMENT_TONE[g.id],
      style: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        backgroundImage: GARMENT_IMAGES[g.id] ? `url(${GARMENT_IMAGES[g.id]})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "uniinx-hide-desktop uniinx-sticky-buy"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-marcellus)",
      fontSize: 18,
      color: "var(--accent-cta)"
    }
  }, price), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-work-sans)",
      fontSize: 12,
      color: "var(--stone)"
    }
  }, garment.label, " \xB7 ", language.label)), /*#__PURE__*/React.createElement(Button, {
    tone: "accent",
    shape: "pill",
    onClick: addNow
  }, "Buy it \u2192")));
}
window.ProductPageFloating = ProductPageFloating;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/ProductPageFloating.jsx", error: String((e && e.message) || e) }); }

// ui_kits/uniinx-storefront/animations.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// animations.jsx — timeline engine. Exports (on window): Stage, Sprite,
//   TextSprite, ImageSprite, RectSprite, VideoSprite, PlaybackBar,
//   useTime, useTimeline, useSprite, Easing, interpolate, animate, clamp.
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <Sprite start={0} end={3}>
//       <TextSprite text="Hello" x={100} y={300} size={72} color="#111" />
//     </Sprite>
//     <Sprite start={2} end={8}>
//       <ImageSprite src="hero.png" x={200} y={120} width={640} height={360} kenBurns />
//     </Sprite>
//   </Stage>
//
// Stage({width,height,duration,background,fps,loop,autoplay}) — auto-scales to
//   viewport; scrubber + play/pause + ←/→ seek + space + 0-reset; persists
//   playhead. The canvas is an <svg><foreignObject>, export-ready: Share →
//   Export → Video (or the PlaybackBar's download button) renders it to .mp4.
//   Screenshot tools DOM-rerender (not pixel-capture) and unwrap this wrapper
//   so captures should work — but if one comes back black, that's a capture
//   artifact, not a render bug; trust the live preview.
// Sprite({start,end,keepMounted}) — mounts children only while playhead is in
//   [start,end]. Children read {localTime, progress, duration} via useSprite().
// useTime() → seconds; useTimeline() → {time,duration,playing,setTime,setPlaying}.
// TextSprite({text,x,y,size,color,font,weight,align,entryDur,exitDur}) — fades/scales in+out.
// ImageSprite({src,x,y,width,height,fit,radius,kenBurns,placeholder}) — same, with optional ken-burns.
// RectSprite({x,y,width,height,color,radius}) — solid box with entry/exit.
// VideoSprite({src,start,end,speed,style}) — looped <video> clip synced to the
//   timeline; its audio is mixed into the exported video.
// Easing.{linear,easeIn/Out/InOut Quad/Cubic/Quart/Quint/Expo/Back, …}
// interpolate([t0,t1,…],[v0,v1,…],ease?) → (t)=>v  — piecewise tween.
// animate({from,to,start,end,ease}) → (t)=>v  — single tween.
//
// Build scenes by composing Sprites inside Stage. Absolutely-position elements.
//
// In a .dc.html project, put your scene in a sibling my-scene.jsx (reading
// {Stage, Sprite, useTime, Easing, …} from window is safe) and mount BOTH:
//   <x-import component-from-global-scope="MyScene"
//             from="./animations.jsx ./my-scene.jsx"></x-import>
// The two files in from= load in order, so my-scene.jsx can use the globals
// animations.jsx set.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: t => t,
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Quart
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Expo
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  // Sine
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Back (overshoot)
  easeOutBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: t => {
    const c1 = 1.70158,
      c2 = c1 * 1.525;
    return t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  // Elastic
  easeOutElastic: t => {
    const c4 = 2 * Math.PI / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic
}) {
  return t => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({
  time: 0,
  duration: 10,
  playing: false
});
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({
  localTime: 0,
  progress: 0,
  duration: 0
});
const useSprite = () => React.useContext(SpriteContext);
function Sprite({
  start = 0,
  end = Infinity,
  children,
  keepMounted = false
}) {
  const {
    time
  } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;
  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value = {
    localTime,
    progress,
    duration,
    visible
  };
  return /*#__PURE__*/React.createElement(SpriteContext.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0,
  y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em'
}) {
  const {
    localTime,
    duration
  } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let ty = 0;
  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }
  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity'
    }
  }, text);
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0,
  y = 0,
  width = 400,
  height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null // {label: string} for striped placeholder
}) {
  const {
    localTime,
    duration
  } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }
  const content = placeholder ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, placeholder.label || 'image') : /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: fit,
      display: 'block'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity'
    }
  }, content);
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const {
    localTime,
    duration
  } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }
  const overrides = render ? render(spriteCtx) : {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides
    }
  });
}

// ── Font inlining ───────────────────────────────────────────────────────────
// Copy every @font-face rule from the page into a <style> inside the svg's
// foreignObject, with font URLs rewritten to data: URLs. Makes the svg
// self-describing so serializing it alone (video export fast path) still
// renders with the right fonts. Sets data-om-fonts-inlined on the svg when
// done so the exporter can wait for it.

function useInlineFontsInto(svgRef) {
  React.useEffect(() => {
    const svg = svgRef.current;
    const host = svg && svg.querySelector('foreignObject > div');
    if (!svg || !host) return;
    let cancelled = false;
    (async () => {
      const rules = [];
      for (const ss of document.styleSheets) {
        let cssRules;
        try {
          cssRules = ss.cssRules;
        } catch {
          // Cross-origin sheet without crossorigin attr (e.g. the standard
          // fonts.googleapis.com <link>) — fetch the CSS text directly and
          // regex-extract the @font-face blocks.
          if (ss.href) {
            try {
              const txt = await fetch(ss.href).then(r => {
                if (!r.ok) throw 0;
                return r.text();
              });
              for (const ff of txt.match(/@font-face\s*{[^}]*}/g) || []) rules.push({
                css: ff,
                base: ss.href
              });
            } catch {}
          }
          continue;
        }
        if (!cssRules) continue;
        for (const r of cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE) {
            rules.push({
              css: r.cssText,
              base: ss.href || location.href
            });
          }
        }
      }
      const toDataURL = url => fetch(url).then(r => {
        if (!r.ok) throw 0;
        return r.blob();
      }).then(b => new Promise(res => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => res(url);
        fr.readAsDataURL(b);
      })).catch(() => url);
      const parts = await Promise.all(rules.map(async ({
        css,
        base
      }) => {
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        let out = css,
          m;
        while (m = re.exec(css)) {
          const u = m[2];
          if (u.startsWith('data:')) continue;
          let abs;
          try {
            abs = new URL(u, base).href;
          } catch {
            continue;
          }
          out = out.split(m[0]).join(`url("${await toDataURL(abs)}")`);
        }
        return out;
      }));
      if (cancelled || !parts.length) {
        svg.setAttribute('data-om-fonts-inlined', 'true');
        return;
      }
      const style = document.createElement('style');
      style.textContent = parts.join('\n');
      host.insertBefore(style, host.firstChild);
      svg.setAttribute('data-om-fonts-inlined', 'true');
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children
}) {
  // Props arrive as strings when Stage is mounted via <x-import> (DC
  // projects) — coerce so style={{width}} gets a number React can px-ify.
  width = +width || 1280;
  height = +height || 720;
  duration = +duration || 10;
  fps = +fps || 60;
  if (typeof loop === 'string') loop = loop !== 'false';
  if (typeof autoplay === 'string') autoplay = autoplay !== 'false';
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch {
      return 0;
    }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time));
    } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = ts => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  // Video-export protocol: the exporter dispatches this event per frame;
  // pause + sync the playhead so the capture sees exactly that timestamp.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onSeek = e => {
      setPlaying(false);
      setTime(clamp(e.detail.time, 0, duration));
    };
    el.addEventListener('data-om-seek-to-time-frame', onSeek);
    return () => el.removeEventListener('data-om-seek-to-time-frame', onSeek);
  }, [duration]);

  // Inline @font-face rules into the svg's foreignObject so the svg is
  // self-describing — serializing it alone (for video export) then renders
  // with the right fonts. Sets data-om-fonts-inlined once done.
  useInlineFontsInto(canvasRef);
  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = React.useMemo(() => ({
    time: displayTime,
    duration,
    playing,
    setTime,
    setPlaying
  }), [displayTime, duration, playing]);
  return /*#__PURE__*/React.createElement("div", {
    ref: stageRef,
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#0a0a0a',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    ref: canvasRef,
    width: width,
    height: height,
    "data-om-exportable-video-with-duration-secs": duration,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      flexShrink: 0,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("foreignObject", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("div", {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: {
      width,
      height,
      background,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(TimelineContext.Provider, {
    value: ctxValue
  }, children))))), /*#__PURE__*/React.createElement(PlaybackBar, {
    time: displayTime,
    actualTime: time,
    duration: duration,
    playing: playing,
    onPlayPause: () => setPlaying(p => !p),
    onReset: () => {
      setTime(0);
    },
    onSeek: t => setTime(t),
    onHover: t => setHoverTime(t)
  }));
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const timeFromEvent = React.useCallback(e => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);
  const onTrackMove = e => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };
  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };
  const onTrackDown = e => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };
  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = e => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);
  const pct = duration > 0 ? time / duration * 100 : 0;
  const fmt = t => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor(total * 100 % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };
  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
  return /*#__PURE__*/React.createElement("div", {
    "data-omelette-chrome": true,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: onReset,
    title: "Return to start (0)"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2v10M12 2L5 7l7 5V2z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement(IconButton, {
    onClick: onPlayPause,
    title: "Play/pause (space)"
  }, playing ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2l9 5-9 5V2z",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'right',
      color: '#f6f4ef'
    }
  }, fmt(time)), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseMove: onTrackMove,
    onMouseLeave: onTrackLeave,
    onMouseDown: onTrackDown,
    style: {
      flex: 1,
      height: 22,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 4,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: `${pct}%`,
      height: 4,
      background: 'oklch(72% 0.12 250)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${pct}%`,
      top: '50%',
      width: 12,
      height: 12,
      marginLeft: -6,
      marginTop: -6,
      background: '#fff',
      borderRadius: 6,
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'left',
      color: 'rgba(246,244,239,0.55)'
    }
  }, fmt(duration)), typeof VideoEncoder !== 'undefined' && /*#__PURE__*/React.createElement(IconButton, {
    title: "Export video",
    onClick: () => window.parent.postMessage({
      type: 'omelette:request-video-export'
    }, '*')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 2v7m0 0L4 6m3 3l3-3M2 12h10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
function IconButton({
  children,
  onClick,
  title
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 6,
      color: '#f6f4ef',
      cursor: 'pointer',
      padding: 0,
      transition: 'background 120ms'
    }
  }, children);
}

// ── VideoSprite ─────────────────────────────────────────────────────────────
// Renders a <video> that loops within [start,end] of its source at `speed`,
// kept in sync with the Stage's playhead. Carries the
// data-om-exportable-video-play-* attrs so video export can mix its audio.
//
//   <VideoSprite src="clip.mp4" start={2} end={5} speed={1}
//     style={{ width: 640, height: 360 }} />

function VideoSprite({
  src,
  start = 0,
  end,
  speed = 1,
  style,
  ...rest
}) {
  start = +start || 0;
  speed = +speed || 1;
  if (end != null) end = +end || undefined;
  const t = useTime();
  const ref = React.useRef(null);
  const span = Math.max(0.001, (end ?? start + 1) - start);
  React.useEffect(() => {
    const v = ref.current;
    if (!v || v.readyState < 1) return;
    const target = start + t * speed % span;
    if (Math.abs(v.currentTime - target) > 0.05) v.currentTime = target;
  }, [t, start, span, speed]);
  return /*#__PURE__*/React.createElement("video", _extends({
    ref: ref,
    src: src,
    muted: true,
    playsInline: true,
    preload: "auto",
    "data-om-exportable-video-play-start": start,
    "data-om-exportable-video-play-end": end ?? start + span,
    "data-om-exportable-video-play-speed": speed,
    style: {
      display: 'block',
      objectFit: 'cover',
      ...style
    }
  }, rest));
}
Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Sprite,
  SpriteContext,
  useSprite,
  TextSprite,
  ImageSprite,
  RectSprite,
  VideoSprite,
  Stage,
  PlaybackBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/uniinx-storefront/animations.jsx", error: String((e && e.message) || e) }); }

__ds_ns.GARMENTS = __ds_scope.GARMENTS;

__ds_ns.FABRICS = __ds_scope.FABRICS;

__ds_ns.ClothTypeSelector = __ds_scope.ClothTypeSelector;

__ds_ns.LANGUAGES = __ds_scope.LANGUAGES;

__ds_ns.FontVar = __ds_scope.FontVar;

__ds_ns.LanguageChipSelector = __ds_scope.LanguageChipSelector;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.NavLanguageSwitcher = __ds_scope.NavLanguageSwitcher;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.MobileTabBar = __ds_scope.MobileTabBar;

})();
