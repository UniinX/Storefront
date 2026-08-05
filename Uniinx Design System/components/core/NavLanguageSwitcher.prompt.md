NavLanguageSwitcher is the Uniinx wordmark doubling as the site's language picker — hover (desktop) or tap (mobile) opens a panel of all 12 languages by native endonym. The Latin wordmark never changes; a small caption under it echoes the active language's endonym.

```jsx
<NavLanguageSwitcher activeId={siteLanguage} onSelect={setSiteLanguage} />
```

Place at the far left of Header, ahead of an explicit "Home" nav link — the logo itself no longer needs to double as a home link once this is interactive.
