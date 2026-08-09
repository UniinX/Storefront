import {useSearchParams} from 'react-router';
import {useState} from 'react';
import {BottomSheet} from '~/components/ds/index.js';

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'newest', label: 'Newest'},
  {value: 'price-asc', label: 'Price: Low to High'},
  {value: 'price-desc', label: 'Price: High to Low'},
];

function clearPagination(params) {
  for (const key of ['cursor', 'direction', 'after', 'before']) params.delete(key);
}

function canonicalOption(options, selected) {
  if (!selected) return '';
  return options.find((option) => option.toLowerCase() === selected.toLowerCase()) ?? '';
}

export function CatalogFilters({totalCount, hasMoreResults = false, filterOptions, hideTheme = false, currentCollection}) {
  const dynamicCategories = filterOptions?.categories?.length ? filterOptions.categories : ['All'];
  const dynamicThemes = filterOptions?.themes || [];
  const dynamicLanguages = filterOptions?.languages || [];
  const dynamicColors = filterOptions?.colors || [];
  const [searchParams, setSearchParams] = useSearchParams();

  const getCollectionVal = () => {
    return searchParams.get('collection') || (['men', 'women', 'accessories'].includes(currentCollection) ? currentCollection : '');
  };

  const draftFromParams = () => ({
    type: searchParams.get('type') || 'All',
    theme: searchParams.get('theme') || '',
    lang: searchParams.get('language') || '',
    color: searchParams.get('color') || '',
    collection: getCollectionVal(),
    sort: searchParams.get('sort') || 'featured',
  });

  // Mobile bottom sheet: staged edits, only committed to the URL on "Apply".
  // Re-seeded from the current URL each time the sheet opens.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState(draftFromParams);

  const openMobileFilters = () => {
    setDraft(draftFromParams());
    setMobileOpen(true);
  };

  const setTempType = (v) => setDraft((prev) => ({...prev, type: v}));
  const setTempTheme = (v) => setDraft((prev) => ({...prev, theme: v}));
  const setTempLang = (v) => setDraft((prev) => ({...prev, lang: v}));
  const setTempColor = (v) => setDraft((prev) => ({...prev, color: v}));
  const setTempCollection = (v) => setDraft((prev) => ({...prev, collection: v}));
  const setTempSort = (v) => setDraft((prev) => ({...prev, sort: v}));

  const {
    type: tempType,
    theme: tempTheme,
    lang: tempLang,
    color: tempColor,
    collection: tempCollection,
    sort: tempSort,
  } = draft;

  const activeFiltersCount =
    (!hideTheme && searchParams.get('theme') ? 1 : 0) +
    (searchParams.get('language') ? 1 : 0) +
    (searchParams.get('color') ? 1 : 0) +
    (searchParams.get('collection') ? 1 : 0) +
    (searchParams.get('type') && searchParams.get('type') !== 'All' ? 1 : 0);

  const handleApplyMobile = () => {
    const next = new URLSearchParams(searchParams);
    clearPagination(next);
    if (tempType && tempType !== 'All') next.set('type', tempType);
    else next.delete('type');
    
    if (!hideTheme && tempTheme) next.set('theme', tempTheme);
    else next.delete('theme');

    if (tempLang) next.set('language', tempLang);
    else next.delete('language');

    if (tempColor) next.set('color', tempColor);
    else next.delete('color');

    if (tempCollection && tempCollection !== currentCollection) next.set('collection', tempCollection);
    else next.delete('collection');

    if (tempSort !== 'featured') next.set('sort', tempSort);
    else next.delete('sort');

    setSearchParams(next, {preventScrollReset: true});
    setMobileOpen(false);
  };

  const handleClearAll = () => {
    const next = new URLSearchParams();
    const currentQ = searchParams.get('q');
    if (currentQ) next.set('q', currentQ);
    setSearchParams(next, {preventScrollReset: true});
    setMobileOpen(false);
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    clearPagination(next);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, {preventScrollReset: true});
  };

  return (
    <div className="flex flex-col gap-6 w-full font-work text-black dark:text-white">
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
        <div className="flex overflow-x-auto scrollbar-none gap-6 py-2">
          {dynamicCategories.map((cat) => {
            const activeType = searchParams.get('type') || 'All';
            const isActive = activeType === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateParam('type', cat === 'All' ? '' : cat)}
                className={`font-marcellus text-sm tracking-wider uppercase pb-2 transition-all cursor-pointer whitespace-nowrap border-b ${
                  isActive
                    ? 'border-black dark:border-white font-semibold'
                    : 'border-transparent text-black/55 dark:text-white/40 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span className="font-work text-xs text-black/45 dark:text-white/30 hidden sm:inline">
          {totalCount}{hasMoreResults ? '+' : ''} products shown
        </span>
      </div>

      {/* Desktop Horizontal Toolbar */}
      <div className="hidden md:flex items-center justify-between gap-4 py-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Collection Dropdown */}
          <select
            aria-label="Collection"
            value={getCollectionVal()}
            onChange={(e) => updateParam('collection', e.target.value)}
            className="px-4 py-2 text-xs border border-black/10 dark:border-white/10 bg-transparent focus:outline-none"
          >
            <option value="" className="text-black">All Collections</option>
            <option value="men" className="text-black">Men</option>
            <option value="women" className="text-black">Women</option>
            <option value="unisex" className="text-black">Unisex</option>
          </select>

          {/* Theme Dropdown */}
          {!hideTheme && (
            <select
              aria-label="Theme"
              value={canonicalOption(dynamicThemes, searchParams.get('theme'))}
              onChange={(e) => updateParam('theme', e.target.value)}
              className="px-4 py-2 text-xs border border-black/10 dark:border-white/10 bg-transparent focus:outline-none"
            >
              <option value="" className="text-black">All Themes</option>
              {dynamicThemes.map((theme) => (
                <option key={theme} value={theme} className="text-black">
                  {theme}
                </option>
              ))}
            </select>
          )}

          {/* Language Dropdown */}
          <select
            aria-label="Language"
            value={canonicalOption(dynamicLanguages, searchParams.get('language'))}
            onChange={(e) => updateParam('language', e.target.value)}
            className="px-4 py-2 text-xs border border-black/10 dark:border-white/10 bg-transparent focus:outline-none"
          >
            <option value="" className="text-black">All Languages</option>
            {dynamicLanguages.map((lang) => (
              <option key={lang} value={lang} className="text-black">
                {lang}
              </option>
            ))}
          </select>

          {/* Color Dropdown */}
          <select
            aria-label="Color"
            value={canonicalOption(dynamicColors, searchParams.get('color'))}
            onChange={(e) => updateParam('color', e.target.value)}
            className="px-4 py-2 text-xs border border-black/10 dark:border-white/10 bg-transparent focus:outline-none"
          >
            <option value="" className="text-black">All Colors</option>
            {dynamicColors.map((color) => (
              <option key={color} value={color} className="text-black">
                {color}
              </option>
            ))}
          </select>

          {/* Clear Filters CTA */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-brand-accent dark:text-brand-accent-light underline font-medium cursor-pointer"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Sort selector */}
        <select
          aria-label="Sort products"
          value={searchParams.get('sort') || 'featured'}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-4 py-2 text-xs border border-black/10 dark:border-white/10 rounded-lg bg-transparent focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Filter Row */}
      <div className="flex md:hidden items-center justify-between gap-4 py-2">
        <button
          onClick={openMobileFilters}
          className="px-6 py-2.5 border border-black/10 dark:border-white/10 rounded-full font-work text-xs uppercase tracking-wider font-semibold cursor-pointer"
        >
          Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
        </button>

        <span className="font-work text-xs text-black/45 dark:text-white/30">
          {totalCount}{hasMoreResults ? '+' : ''} products shown
        </span>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      <BottomSheet open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filters">
        <div className="flex flex-col gap-6 p-1 text-black dark:text-white font-work max-h-[70vh] overflow-y-auto">
          {/* Category Tabs in sheet */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTempType(cat)}
                  className={`px-4 py-2 rounded-full border text-xs cursor-pointer ${
                    tempType === cat
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Collection list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
              Collection
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTempCollection('')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempCollection === ''
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                All Collections
              </button>
              <button
                type="button"
                onClick={() => setTempCollection('men')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempCollection === 'men'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                Men
              </button>
              <button
                type="button"
                onClick={() => setTempCollection('women')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempCollection === 'women'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                Women
              </button>
              <button
                type="button"
                onClick={() => setTempCollection('unisex')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempCollection === 'unisex'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                Unisex
              </button>
            </div>
          </div>

          {/* Themes list */}
          {!hideTheme && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
                Theme / Collection
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTempTheme('')}
                  className={`px-4 py-2 border text-xs cursor-pointer ${
                    tempTheme === ''
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  All Themes
                </button>
                {dynamicThemes.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setTempTheme(theme)}
                    className={`px-4 py-2 border text-xs cursor-pointer ${
                      tempTheme.toLowerCase() === theme.toLowerCase()
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'border-black/10 dark:border-white/10'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Languages list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
              Language
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTempLang('')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempLang === ''
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                All Languages
              </button>
              {dynamicLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setTempLang(lang)}
                  className={`px-4 py-2 border text-xs cursor-pointer ${
                    tempLang.toLowerCase() === lang.toLowerCase()
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Colors list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
              Color
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTempColor('')}
                className={`px-4 py-2 border text-xs cursor-pointer ${
                  tempColor === ''
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                All Colors
              </button>
              {dynamicColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTempColor(color)}
                  className={`px-4 py-2 border text-xs cursor-pointer ${
                    tempColor.toLowerCase() === color.toLowerCase()
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sort list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
              Sort By
            </span>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTempSort(opt.value)}
                  className={`px-4 py-2 border text-xs cursor-pointer ${
                    tempSort === opt.value
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-6 border-t border-black/5 dark:border-white/5 mt-4">
            <button
              type="button"
              onClick={handleApplyMobile}
              className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black font-work text-xs uppercase tracking-wider font-semibold hover:opacity-90 cursor-pointer"
            >
              Apply Results
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-6 py-3.5 border border-black/10 dark:border-white/10 font-work text-xs uppercase tracking-wider font-semibold hover:bg-black/5 transition-all cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
