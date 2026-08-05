BottomSheet is the mobile modal host for the cloth-type / language selectors — slides up from the bottom over a scrim, tap outside or drag handle area to imply dismiss.

```jsx
<BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Choose language">
  <LanguageChipSelector value={languageId} onChange={setLanguageId} size="sm" />
</BottomSheet>
```

Use on mobile (< 720px) wherever the desktop layout would show a selector inline in a side panel.
