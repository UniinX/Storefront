LanguageChipSelector is the radiogroup for picking the print language — the 10 major Indian languages + English, each shown by English label and native-script endonym set in its own Indic display face. Use on any PDP/customizer screen.

```jsx
<LanguageChipSelector value={languageId} onChange={setLanguageId} />
```

Notable exports: `LANGUAGES` (the full dataset, id/label/native/font/rtl) and `FontVar(fontKey)` for rendering the same endonym elsewhere (e.g. NavLanguageSwitcher). `size="sm"` for tighter mobile bottom-sheet contexts. Urdu is `dir="rtl"` automatically.
