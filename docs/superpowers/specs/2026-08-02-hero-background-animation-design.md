# Hero Background: More Glyphs + Ambient Drift Animation

## Context

The Home page landing screen (`app/components/home/Hero.jsx`) renders a full-viewport
hero section. Its background has no image asset — it's a solid theme color
(`bg-brand-bg-light` / `bg-brand-bg-dark`) overlaid with large, near-invisible
single-character "watermarks" in different Indic scripts, positioned absolutely
behind the foreground copy. Today there are 4 of these glyphs (Devanagari,
Tamil, Telugu, Bengali), and they are static.

This spec covers two changes to that background layer only:

1. Expand the glyph set from 4 to all 9 scripts already defined as CSS font
   tokens in `Uniinx Design System/tokens/typography.css`.
2. Give the glyphs a slow, ambient drift/breathing animation, disabled when
   the user has `prefers-reduced-motion` set.

No changes to the foreground hero copy, the language-cycling text animation,
or the CTA button.

## Data: glyph set

`BACKGROUND_GLYPHS` in `Hero.jsx` grows from 4 entries to 9, one per script
token already defined in `typography.css`:

| Script     | Font token           | Glyph |
|------------|----------------------|-------|
| Devanagari | `--font-devanagari`  | अ     |
| Tamil      | `--font-tamil`       | க     |
| Telugu     | `--font-telugu`      | క     |
| Kannada    | `--font-kannada`     | ಅ     |
| Bengali    | `--font-bengali`     | অ     |
| Gujarati   | `--font-gujarati`    | અ     |
| Gurmukhi   | `--font-gurmukhi`    | ਅ     |
| Oriya      | `--font-oriya`       | ଓ     |
| Urdu       | `--font-urdu`        | ا     |

Each entry keeps the existing shape (`char`, `font`, position keys, `size`)
plus new fields to drive the animation (see below). Positions are
redistributed across corners, mid-edges, and one soft near-center placement
so 9 glyphs read as ambient texture rather than clutter — same low-opacity
treatment as today (`text-[#121212]/[0.02]` light / `[0.015]` dark), no
opacity animation.

## Animation: CSS-driven ambient drift

Each glyph gets a slow, independent drift + scale ("breathing") loop rather
than a snap-to-position static render. Mechanism:

- One shared `@keyframes uniinx-hero-glyph-drift` rule (transform-only:
  translate + scale), added to `app/styles/uniinx.css` (the stylesheet
  actually imported by `root.jsx`; `app/styles/app.css` is dead — a
  leftover from the Hydrogen skeleton scaffold, not imported anywhere),
  following that file's `uniinx-*` naming convention.
- Each glyph's `<span>` gets a `uniinx-hero-glyph` class plus inline CSS custom
  properties — `--dx`, `--dy`, `--ds` (drift distance/scale delta),
  `animation-duration`, `animation-delay` — set from its `BACKGROUND_GLYPHS`
  data entry. Varying these per glyph makes the 9 loops feel organic and
  asynchronous instead of mechanically synchronized.
- Negative `animation-delay` values are used so glyphs are already
  mid-cycle on first paint (no jarring simultaneous start from a resting
  position).
- Pure CSS, `transform`-only: no per-frame JS, no additional React state,
  cheap for the browser (GPU-composited).

This is CSS instead of framer-motion (already imported and used elsewhere in
`Hero.jsx`) because it would mean 9 independent infinite imperative loops —
CSS keyframes + custom properties express the same "drift" declaratively
with one rule, no re-render risk, and no extra JS on an already
animation-heavy page.

## Accessibility

`uniinx.css` gets a matching rule:

```css
@media (prefers-reduced-motion: reduce) {
  .uniinx-hero-glyph {
    animation: none;
  }
}
```

Reduced-motion users see the glyphs fully static, in their base drift
position — matching today's behavior exactly.

## Out of scope

- Foreground hero copy, language-cycling animation (`CYCLES`), CTA button:
  unchanged.
- No new dependencies.
- No changes to `BrandStory.jsx` / `ProductCard.jsx`, which reference the
  same font tokens but are separate components.

## Testing

Manual verification only (visual/decorative feature, no business logic):

- Load `/` in light and dark mode, confirm all 9 glyphs render, positioned
  without excessive overlap, at the existing low-opacity watermark look.
- Confirm drift is visible but subtle (no glyph moves far enough to become
  legible/distracting or to overlap the foreground text block).
- Enable OS-level reduced-motion, reload, confirm glyphs are static.
- Resize to mobile viewport width, confirm no glyph animation causes
  horizontal overflow/scrollbar.
