# Uniinx Storefront — UI Kit

A clickable recreation of the Uniinx fashion storefront ("Clothes in your
Language") from `/Uniinx/Desktop---1` and `/Uniinx/Desktop---2` of the
source Figma file.

Open `index.html`. It assembles:
- `Header.jsx` — Ux mark, Men/Women/Accessories nav, search + cart glyphs.
- `Hero.jsx` — video-background placeholder + wordmark + "New Arrivals" CTA
  (click it for a toast — the only interaction the source implies).
- `ProductGrid.jsx` — "NEWEST IN THE STORE" headline + `ProductCard` tiles.
- `DepartmentBand.jsx` — large "MEN" department mark + placeholder image
  blocks (source frame literally captions these "Blocks contain image /
  animation in the background").
- `MissionSection.jsx` — the brand's one piece of real prose, on a mist
  background band.
- `Footer.jsx` — hairline rule + "Footer map" + closing line.
- `ProductPage.jsx` — product detail view (click any card in the grid to
  open it). The design title ("Bhasha Print") and image stay fixed while
  two selectors change the variant: **Type** (Tshirt / Hoodie, swaps the
  price) and **Language** (the 10 major Indian languages + English, each
  shown by its English name and native-script endonym — reflects the
  brand's "clothes in your language" mission). Selectors use
  `role="radiogroup"`/`role="radio"` with a visible dark/light selected
  state and 44px-minimum hit targets; Urdu flips the caption to `dir="rtl"`.

All screens are plain global-scope JSX (`window.Header = Header`, etc. —
no `import`/`export`) loaded as sibling `<script type="text/babel" src="...">`
tags, then composed in `index.html`. This keeps each screen file small and
directly editable without a bundler.
