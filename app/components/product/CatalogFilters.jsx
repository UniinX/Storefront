import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router';
import {BottomSheet} from '~/components/ui/bottom-sheet.jsx';
import {categoryLabel, mergeCatalogFilterOptions} from '~/lib/catalog.js';

const SORT_OPTIONS = [
  {value: 'featured', label: 'Best Selling'},
  {value: 'newest', label: 'Newest'},
  {value: 'price-asc', label: 'Price: Low to High'},
  {value: 'price-desc', label: 'Price: High to Low'},
];

const DEPARTMENTS = [
  {value: 'men', label: 'Male'},
  {value: 'women', label: 'Female'},
  {value: 'unisex', label: 'Unisex'},
];

function clearPagination(params) {
  for (const key of ['cursor', 'direction', 'after', 'before'])
    params.delete(key);
}

function canonicalOption(options, selected) {
  if (!selected) return '';
  const mappedSelected = categoryLabel(selected) || selected;
  const match = options.find((option) => {
    const optVal =
      typeof option === 'object' && option !== null ? option.value : option;
    const optLabel =
      typeof option === 'object' && option !== null ? option.label : option;
    return (
      String(optVal).toLowerCase() === selected.toLowerCase() ||
      String(optLabel).toLowerCase() === selected.toLowerCase() ||
      String(optVal).toLowerCase() === mappedSelected.toLowerCase() ||
      String(optLabel).toLowerCase() === mappedSelected.toLowerCase()
    );
  });
  if (!match) return '';
  return typeof match === 'object' && match !== null ? match.value : match;
}

function getOptionDisplayLabel(options, selected) {
  if (!selected) return '';
  const mappedSelected = categoryLabel(selected) || selected;
  const match = options.find((option) => {
    const optVal =
      typeof option === 'object' && option !== null ? option.value : option;
    const optLabel =
      typeof option === 'object' && option !== null ? option.label : option;
    return (
      String(optVal).toLowerCase() === selected.toLowerCase() ||
      String(optLabel).toLowerCase() === selected.toLowerCase() ||
      String(optVal).toLowerCase() === mappedSelected.toLowerCase() ||
      String(optLabel).toLowerCase() === mappedSelected.toLowerCase()
    );
  });
  if (!match) return categoryLabel(selected) || selected;
  return typeof match === 'object' && match !== null ? match.label : match;
}

const COLOR_HEX_MAP = {
  black: '#121212',
  white: '#FFFFFF',
  'off white': '#F8F6F0',
  beige: '#E8DCC4',
  'grey melange': '#B0B5B9',
  'navy blue': '#1B2A4A',
  maroon: '#5B1A24',
  lavender: '#D8B4F8',
  'light pink': '#FFD1DC',
  'bottle green': '#1C3A27',
  'sky blue': '#87CEEB',
  blue: '#2563EB',
  coral: '#FF7F50',
  mint: '#98FF98',
  yellow: '#F59E0B',
};

const ALL_STORE_CATEGORIES = [
  {label: 'T-Shirts', value: 'T-Shirts'},
  {label: 'Hoodies', value: 'Hoodies'},
  {label: 'Sweatshirts', value: 'Sweatshirts'},
  {label: 'Sweatpants', value: 'Sweatpants'},
  {label: 'Joggers', value: 'Joggers'},
  {label: 'Terry Shorts', value: 'Terry Shorts'},
  {label: 'Oversized', value: 'Oversized'},
  {label: 'Polos', value: 'Polos'},
];

export function CatalogFilters({
  totalCount,
  hasMoreResults = false,
  filterOptions,
  hideTheme = false,
  currentCollection,
  sortOptions = SORT_OPTIONS,
  defaultSort = 'featured',
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accumulatedOptions, setAccumulatedOptions] = useState(() => filterOptions || {});

  const filterKey = `${searchParams.get('type') || ''}_${searchParams.get('theme') || ''}_${searchParams.get('language') || ''}_${searchParams.get('color') || ''}_${searchParams.get('size') || ''}_${searchParams.get('collection') || ''}_${searchParams.get('q') || ''}`;

  useEffect(() => {
    setAccumulatedOptions(filterOptions || {});
  }, [filterKey]);

  useEffect(() => {
    if (filterOptions) {
      setAccumulatedOptions((prev) => mergeCatalogFilterOptions(prev, filterOptions));
    }
  }, [filterOptions]);

  const effectiveOptions = mergeCatalogFilterOptions(accumulatedOptions, filterOptions || {});

  const rawCategories = effectiveOptions?.categories?.length
    ? effectiveOptions.categories
    : [];
  const categoriesMap = new Map();
  for (const cat of rawCategories) {
    const val = typeof cat === 'object' && cat !== null ? cat.value : cat;
    const lbl = typeof cat === 'object' && cat !== null ? cat.label : cat;
    categoriesMap.set(String(lbl).toLowerCase(), {label: lbl, value: val});
  }
  for (const cat of ALL_STORE_CATEGORIES) {
    if (!categoriesMap.has(cat.label.toLowerCase())) {
      categoriesMap.set(cat.label.toLowerCase(), cat);
    }
  }
  const categories = Array.from(categoriesMap.values());

  const themes = effectiveOptions?.themes || [];
  const languages = effectiveOptions?.languages || [];
  const colors = effectiveOptions?.colors || [];
  const sizes = effectiveOptions?.sizes || [];

  const collectionValue =
    searchParams.get('collection') ||
    (DEPARTMENTS.some(({value}) => value === currentCollection)
      ? currentCollection
      : '');

  const activeCategory = canonicalOption(categories, searchParams.get('type'));
  const activeTheme = canonicalOption(themes, searchParams.get('theme'));
  const activeLanguage = canonicalOption(languages, searchParams.get('language'));
  const activeColor = canonicalOption(colors, searchParams.get('color'));
  const activeSize = canonicalOption(sizes, searchParams.get('size'));

  const activeCategoryLabel = getOptionDisplayLabel(categories, searchParams.get('type'));
  const activeThemeLabel = getOptionDisplayLabel(themes, searchParams.get('theme'));
  const activeLanguageLabel = getOptionDisplayLabel(languages, searchParams.get('language'));
  const activeColorLabel = getOptionDisplayLabel(colors, searchParams.get('color'));
  const activeSizeLabel = getOptionDisplayLabel(sizes, searchParams.get('size'));

  const handleGenderToggle = (value) => {
    const isCurrentlyActive = collectionValue === value;
    const next = new URLSearchParams(searchParams);
    clearPagination(next);

    if (isCurrentlyActive) {
      next.delete('collection');
    } else {
      next.set('collection', value);
    }

    if (
      currentCollection &&
      (currentCollection === 'men' || currentCollection === 'women')
    ) {
      const queryString = next.toString();
      window.location.href = `/collections/all${queryString ? `?${queryString}` : ''}`;
      return;
    }
    setSearchParams(next, {preventScrollReset: true});
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    clearPagination(next);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, {preventScrollReset: true});
  };

  const clearAll = () => {
    if (
      currentCollection &&
      (currentCollection === 'men' || currentCollection === 'women')
    ) {
      window.location.href = '/collections/all';
      return;
    }
    const next = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) next.set('q', query);
    setSearchParams(next, {preventScrollReset: true});
    setMobileOpen(false);
  };

  const activeFiltersCount =
    Number(Boolean(searchParams.get('collection'))) +
    Number(Boolean(searchParams.get('language'))) +
    Number(Boolean(searchParams.get('color'))) +
    Number(Boolean(searchParams.get('size'))) +
    Number(Boolean(searchParams.get('type'))) +
    Number(!hideTheme && Boolean(searchParams.get('theme')));

  const countLabel = `${totalCount}${hasMoreResults ? '+' : ''} Products`;

  return (
    <>
      {/* Sticky Top Filter Header & Toolbar */}
      <div className="uniinx-plp-sticky-header">
        <div className="uniinx-plp-toolbar">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform active:scale-95 lg:hidden"
            >
              <FilterIcon /> Filters
              {activeFiltersCount ? (
                <span className="ml-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                  {activeFiltersCount}
                </span>
              ) : null}
            </button>

            <span className="uniinx-plp-count text-xs sm:text-sm text-muted-foreground font-medium">
              {countLabel}
            </span>
          </div>

          <label className="uniinx-plp-sort flex min-w-0 items-center gap-2 text-xs sm:text-sm">
            <span className="hidden sm:inline font-medium text-muted-foreground">Sort by</span>
            <select
              aria-label="Sort products"
              value={searchParams.get('sort') || defaultSort}
              onChange={(event) => updateParam('sort', event.target.value)}
              className="min-h-9 min-w-0 rounded-full border border-border bg-surface px-3 py-1.5 pr-8 text-xs sm:text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Separate Active Filter Pills Row */}
        {activeFiltersCount > 0 && (
          <div className="uniinx-plp-active-bar">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Active:</span>

            {collectionValue ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Gender:{' '}
                {DEPARTMENTS.find((d) => d.value === collectionValue)?.label ||
                  collectionValue}
                <button
                  type="button"
                  onClick={() => handleGenderToggle(collectionValue)}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove gender filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            {activeCategoryLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Category: {activeCategoryLabel}
                <button
                  type="button"
                  onClick={() => updateParam('type', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            {activeThemeLabel && !hideTheme ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Collection: {activeThemeLabel}
                <button
                  type="button"
                  onClick={() => updateParam('theme', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove collection filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            {activeLanguageLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Language: {activeLanguageLabel}
                <button
                  type="button"
                  onClick={() => updateParam('language', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove language filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            {activeColorLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Color: {activeColorLabel}
                <button
                  type="button"
                  onClick={() => updateParam('color', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove color filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            {activeSizeLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                Size: {activeSizeLabel}
                <button
                  type="button"
                  onClick={() => updateParam('size', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground font-bold"
                  aria-label="Remove size filter"
                >
                  ✕
                </button>
              </span>
            ) : null}

            <button
              type="button"
              onClick={clearAll}
              className="ml-auto text-xs font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Desktop Filter Sidebar */}
      <aside
        className="uniinx-plp-sidebar hidden lg:block"
        aria-label="Product filters"
      >
        {/* Gender Pills */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between h-5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/75">
              Gender
            </span>
            {collectionValue ? (
              <button
                type="button"
                onClick={() => handleGenderToggle(collectionValue)}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map(({value, label}) => {
              const isSelected = collectionValue === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleGenderToggle(value)}
                  className={`inline-flex h-8 items-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-semibold'
                      : 'border-border/70 bg-surface-subtle text-foreground hover:border-border hover:bg-surface'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <ChipFilterGroup
          label="Categories"
          value={activeCategory}
          options={categories}
          onChange={(value) => updateParam('type', value)}
        />

        {/* Collections */}
        <ChipFilterGroup
          label="Collections"
          value={activeTheme}
          options={themes}
          hidden={hideTheme}
          onChange={(value) => updateParam('theme', value)}
        />

        {/* Language */}
        <ChipFilterGroup
          label="Language"
          value={activeLanguage}
          options={languages}
          onChange={(value) => updateParam('language', value)}
        />

        {/* Color Swatches */}
        <ChipFilterGroup
          label="Colors"
          value={activeColor}
          options={colors}
          isColor
          onChange={(value) => updateParam('color', value)}
        />

        {/* Sizes */}
        <ChipFilterGroup
          label="Size"
          value={activeSize}
          options={sizes}
          isSize
          onChange={(value) => updateParam('size', value)}
        />

        {activeFiltersCount > 0 ? (
          <div className="mt-5 pt-5 border-t border-border/40">
            <button
              type="button"
              onClick={clearAll}
              className="w-full rounded-full border border-border/80 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-subtle"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </aside>

      {/* Mobile Bottom Sheet Filters */}
      <BottomSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Filters & Refinements"
      >
        <div className="max-h-[72vh] overflow-y-auto p-2 text-foreground space-y-5">
          {/* Gender */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between h-5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/75">
                Gender
              </span>
              {collectionValue ? (
                <button
                  type="button"
                  onClick={() => handleGenderToggle(collectionValue)}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(({value, label}) => {
                const isSelected = collectionValue === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleGenderToggle(value)}
                    className={`inline-flex h-8 items-center rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-semibold'
                        : 'border-border/70 bg-surface-subtle text-foreground hover:border-border hover:bg-surface'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <ChipFilterGroup
            label="Categories"
            value={activeCategory}
            options={categories}
            showBorder={false}
            onChange={(value) => updateParam('type', value)}
          />

          {/* Collections */}
          {!hideTheme ? (
            <ChipFilterGroup
              label="Collections"
              value={activeTheme}
              options={themes}
              showBorder={false}
              onChange={(value) => updateParam('theme', value)}
            />
          ) : null}

          {/* Language */}
          <ChipFilterGroup
            label="Language"
            value={activeLanguage}
            options={languages}
            showBorder={false}
            onChange={(value) => updateParam('language', value)}
          />

          {/* Colors */}
          <ChipFilterGroup
            label="Colors"
            value={activeColor}
            options={colors}
            isColor
            showBorder={false}
            onChange={(value) => updateParam('color', value)}
          />

          {/* Size */}
          <ChipFilterGroup
            label="Size"
            value={activeSize}
            options={sizes}
            isSize
            showBorder={false}
            onChange={(value) => updateParam('size', value)}
          />

          {/* Mobile Action Footer */}
          <div className="sticky bottom-0 bg-surface/95 backdrop-blur-md pt-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="min-h-11 flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-95"
            >
              Apply ({countLabel})
            </button>
            {activeFiltersCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="min-h-11 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

function ChipFilterGroup({
  label,
  value,
  options,
  onChange,
  hidden = false,
  isColor = false,
  isSize = false,
  showBorder = true,
}) {
  if (hidden || !options?.length) return null;

  return (
    <div className={`space-y-2.5 ${showBorder ? 'mt-5 pt-5 border-t border-border/40' : ''}`}>
      <div className="flex items-center justify-between h-5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/75">
          {label}
        </span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optValue =
            typeof option === 'object' && option !== null ? option.value : option;
          const optLabel =
            typeof option === 'object' && option !== null ? option.label : option;
          const isSelected =
            String(optValue).toLowerCase() === String(value).toLowerCase();

          if (isColor) {
            const hex = COLOR_HEX_MAP[String(optLabel).toLowerCase()] || null;
            return (
              <button
                key={optValue}
                type="button"
                aria-label={`Filter by color ${optLabel}`}
                aria-pressed={isSelected}
                onClick={() => onChange(isSelected ? '' : optValue)}
                className={`group inline-flex h-8 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-semibold'
                    : 'border-border/70 bg-surface-subtle text-foreground hover:border-border hover:bg-surface'
                }`}
              >
                {hex ? (
                  <span
                    className="size-3 rounded-full shrink-0 border border-black/15 shadow-2xs"
                    style={{backgroundColor: hex}}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="whitespace-nowrap">{optLabel}</span>
              </button>
            );
          }

          if (isSize) {
            return (
              <button
                key={optValue}
                type="button"
                aria-label={`Filter by size ${optLabel}`}
                aria-pressed={isSelected}
                onClick={() => onChange(isSelected ? '' : optValue)}
                className={`flex h-8 w-10 items-center justify-center rounded-md border text-xs font-semibold uppercase transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-semibold'
                    : 'border-border/70 bg-surface-subtle text-foreground hover:border-border hover:bg-surface'
                }`}
              >
                {optLabel}
              </button>
            );
          }

          return (
            <button
              key={optValue}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(isSelected ? '' : optValue)}
              className={`inline-flex h-8 items-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-semibold'
                  : 'border-border/70 bg-surface-subtle text-foreground hover:border-border hover:bg-surface'
              }`}
            >
              {optLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
  hidden = false,
}) {
  if (hidden) return null;
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground tracking-[-0.01em]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-border bg-surface px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-focus-ring"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optValue =
            typeof option === 'object' && option !== null ? option.value : option;
          const optLabel =
            typeof option === 'object' && option !== null ? option.label : option;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M2 4h13M4.5 8.5h8M7 13h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
