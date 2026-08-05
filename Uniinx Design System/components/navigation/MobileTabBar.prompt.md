MobileTabBar is the fixed bottom nav for the mobile layout (< 720px) — Home / Shop / Cart, with an optional cart-count badge. Render once at the app-shell level, not per screen.

```jsx
<MobileTabBar active={view} onNavigate={setView} cartCount={2} />
```

Icons are simple line glyphs drawn in-line (no shipped icon font) to match the source's two raster nav glyphs.
