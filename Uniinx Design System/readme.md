# Uniinx Design System

A design system reconstructed from a single Figma file ("Uniinx.fig"): an
India-focused multilingual fashion e‑commerce storefront, tagline
*"Clothes in your Language."* Editorial, black-and-white, serif-driven.

**Source:** Figma file "Uniinx.fig" (mounted read-only virtual filesystem),
pages `/Uniinx` (2 frames — the storefront). No GitHub repo or codebase was
attached for this project. If one exists, attach it via the Import menu so
component code (not just Figma reconstruction) can ground future work.

## Index

- `styles.css` — root stylesheet, imports everything below. Link this one
  file from any consuming project.
- `tokens/colors.css` — brand neutral scale, semantic aliases, raw storefront
  fills, **v3 Kalamkari accents** (madder red / turmeric gold / kasimi teal / leaf green).
- `tokens/typography.css` — font stacks (Google Fonts `@import`), type-scale
  variables, **per-language Indic font variables** (`--font-devanagari`,
  `--font-tamil`, etc.) consumed via `FontVar(fontKey)`.
- `tokens/spacing.css` — space scale, corner-radius scale, **mobile
  breakpoint/gutter/nav-height tokens**.
- `tokens/effects.css` — the one shadow token (footer hairline rule).
- `tokens/patterns.css` — **heritage motif classes** drawn in pure CSS:
  `.motif-block-print` (Ajrakh/Bagru diamond row), `.motif-temple-arch`
  (stepped-arch divider), `.motif-kalamkari-corner` (quarter-circle corner
  flourish), `.motif-madhubani-rule` (dotted eyebrow rule). Used as section
  dividers/card accents in place of flat gray placeholder blocks.

### Components

- `components/core/Button.*` — the storefront's pill CTA, dark/light/accent
  tones.
- `components/core/NavLanguageSwitcher.*` — the header-left language
  switcher: hovering/tapping the Uniinx mark reveals a language list
  rendered in each language's own script; selecting one sets the active
  language everywhere `FontVar()` is read. Doubles as the home link.
- `components/commerce/ProductCard.*` — storefront grid tile.
- `components/commerce/ClothTypeSelector.*` — fabric/garment customization
  picker (`GARMENTS`, `FABRICS` data exports + the selector UI).
- `components/commerce/LanguageChipSelector.*` — the language customization
  picker for product pages/filters (`LANGUAGES` data export + `FontVar()`
  helper, reused by `NavLanguageSwitcher`).
- `components/navigation/MobileTabBar.*` — fixed bottom tab bar for the
  mobile layout (<720px): Home / Shop / Cart with cart-count badge.
- `components/navigation/BottomSheet.*` — mobile modal host for the
  cloth-type/language selectors on PLP and PDP.
- `guidelines/` — foundation specimen cards (colors, type, spacing) shown in
  the Design System tab.
- `assets/` — copied product photo, profile/search/cart glyphs.
- `ui_kits/uniinx-storefront/` — clickable storefront recreation: Home,
  PLP (`PLP.jsx`), product customizer (`ProductPage.jsx`), Cart
  (`CartPage.jsx`), responsive header/mobile nav, department band, mission
  section, footer — desktop and mobile layouts both designed explicitly
  (see `index.html`'s `uniinx-*` responsive utility classes).
- `SKILL.md` — portable skill file for using this system in Claude Code.

## Content fundamentals

Short, declarative, almost slogan-like. Sentence fragments over full
sentences: *"UNIINX ~ Clothes in your Language."*, *"NEWEST IN THE STORE"*,
*"In the White"*. Department names are shouted in caps as oversized display
type ("MEN", 96px). The one piece of real prose — the mission statement —
switches to first-person-plural and is earnest, almost a manifesto: *"We
believe that our true emotion can only be shared through our mother
tongue... we are proud to hold linguistic richness and cultural heritage."*
and *"For Every Language, For Every State, For Every One, For India."*
Pricing is terse and spaced out: `R . 200`. CTAs are two words plus an
arrow: `Buy it →`, `View →`, `Next Page →`. No emoji. Casing is either ALL
CAPS (department names, "NEWEST IN THE STORE") or sentence case for body
copy — never title case.

Arrows (`→`) are the one recurring glyph used as punctuation/affordance,
not decoration.

## Visual foundations (v3 — Kalamkari)

Started from an editorial monochrome Figma frame; v3 keeps that ivory-and-ink
restraint as the base and now draws its accent palette and border/frame
language directly from **Kalamkari** temple-cloth painting, so the "clothes
in your language" premise reads as specifically, visibly Indian — not a
generic heritage gesture.

- *Color:* base stays ink-on-ivory (`--ink` / `--paper` / `--paper-warm` /
  `--paper-sand` — the "cloth ground"). Four Kalamkari accents carry every
  CTA, border, and active state: `--kalamkari-red-600` (madder-dyed outline
  red, primary CTA + borders), `--kalamkari-ochre-500` (turmeric/mustard
  gold, festive highlights + department accent), `--kalamkari-teal-600`
  (kasimi teal-blue, links/active nav/language state), `--kalamkari-green-700`
  (leaf green, secondary motif accent), plus `--kalamkari-maroon-900` (deepest
  madder, footer/high-contrast heritage text). Semantic aliases unchanged:
  `--accent-cta`, `--accent-primary`, `--accent-festive`, `--accent-deep`,
  `--accent-leaf`. Color is deliberately never the page background — it
  frames and accents an ivory ground, the way painted linework frames a
  cream cloth panel.
- *Motif system:* `tokens/patterns.css` now includes `.motif-kalamkari-frame`
  — a red-inner/gold-outer double-ruled border (box-shadow rings) that
  stands in for a painted manuscript frame — alongside the four existing
  CSS dividers (recolored to the new palette) and `.motif-illustration-slot`,
  a dashed-border cream placeholder that marks where **real** illustrated
  Kalamkari artwork (tree-of-life, peacocks, mythological figures — too
  fine-grained for CSS) should be dropped in; see the Hero's illustration
  panel for the pattern to reuse.
- *Type/shape/layout/borders/motion:* unchanged from v2 (Marcellus/Work
  Sans pairing, Indic per-language fonts via `FontVar`, soft photo-container
  radii, dedicated mobile layout, scroll-reveal motion) — this pass is a
  palette + framing change, not a structural one.
- *Type:* Marcellus (serif) for display/headline moments, Work Sans
  (grotesque) for UI/body, unchanged from v1. **New:** per-language Indic
  font variables (`--font-devanagari`, `--font-tamil`, `--font-telugu`,
  etc., see `tokens/typography.css`) so Hindi/Tamil/Telugu/Urdu/etc. text
  renders in a proper native-script face rather than falling back to
  Marcellus/Work Sans (which have no Indic glyphs). `FontVar(fontKey)`
  (exported from `LanguageChipSelector`) resolves a language's font
  everywhere it appears — chips, `NavLanguageSwitcher`, cart line items.
- *Imagery:* still clean white-background studio photography as the target;
  **v4** replaces flat gray placeholder blocks with `.uniinx-fabric` — a
  tinted gradient + animated SVG-grain texture (4 tones cycling through the
  Kalamkari palette) that reads as an actual dyed-cloth photograph rather
  than an empty box. Used on `ProductCard`, `Hero`'s illustration panel,
  `DepartmentBand` cards, `CartPage` line-item thumbnails, and `ProductPage`'s
  garment slot whenever no real `image` is supplied. Swap in real product/
  lifestyle photography by passing an `image` prop — it always takes
  priority over the fabric texture.
- *Shape:* unchanged — soft corner radii on photo containers (9–24px),
  fully rounded CTA pills (17px).
- *Layout — mobile and desktop both designed explicitly, not just
  reflowed:* desktop keeps the wide left-margin editorial scroll; mobile
  (<`--bp-mobile` / 720px) gets a dedicated fixed bottom `MobileTabBar`,
  a hamburger menu replacing the inline nav, single/2-column product grids,
  a `BottomSheet` for cloth/language filters instead of a sidebar, and a
  sticky buy bar on the product page. See `uniinx-*` classes in
  `ui_kits/uniinx-storefront/index.html`.
- *Borders/shadows:* still minimal — hairline rules only, no drop shadows,
  glass, or blur.
- *Motion/states:* hover as a subtle opacity dip on interactive elements;
  `BottomSheet` slides up over a scrim on open.

## Iconography

The file carries no icon font and no SVG icon set — only two ad-hoc raster
glyphs, both copied into `assets/`:
- `assets/uniinx-icon-search.png` — a line-style lightbulb glyph used near
  the storefront's top nav (likely a placeholder, not literally "search").
- `assets/uniinx-icon-cart.png` — a line-style shopping cart glyph, same nav.

Both are simple black-stroke line icons on transparent ground, ~1.5–2px
stroke weight. No emoji and no unicode symbols are used as icons anywhere
(only the `→` arrow, which is typographic punctuation, not an icon).

Because the source defines only two icons, any UI kit screen that needs
more (nav glyphs, settings, etc.) should pull from **Lucide** via CDN — its
default 1.5–2px stroke line style is the closest match to the two source
glyphs. This is a **flagged substitution**: if a real icon set exists,
swap Lucide out for it.

## Caveats & ask

- This Figma file is small (one real storefront concept, two frames) and
  reads as early/exploratory, not a shipped product spec — some frames have
  placeholder captions ("Background contains video", "Blocks contain
  image / animation in the background"). I built the system as faithfully
  as the source allows, but a lot of this is "the one example screen we
  have," not a proven pattern library.
- No codebase was attached, so nothing here is checked against real
  production code — everything is a Figma-faithful reconstruction.
- Iconography is mostly placeholder (2 raster glyphs); I substituted Lucide
  for anything beyond that and flagged it above.
- **Please tell me:** if you have a codebase or more Figma frames for
  Uniinx, attach them — that's the single biggest lever to make this system
  production-accurate. (A second, unrelated concept called "ThinkWise AI"
  was previously in this file and has been removed per your request — all
  tokens, components, and the UI kit tied only to it are gone.)
