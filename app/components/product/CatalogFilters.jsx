import {useState} from 'react';
import {useSearchParams} from 'react-router';
import {BottomSheet} from '~/components/ui/bottom-sheet.jsx';

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
  return (
    options.find((option) => option.toLowerCase() === selected.toLowerCase()) ??
    ''
  );
}

export function CatalogFilters({
  totalCount,
  hasMoreResults = false,
  filterOptions,
  hideTheme = false,
  currentCollection,
  sortOptions = SORT_OPTIONS,
  defaultSort = 'featured',
}) {
  const categories = filterOptions?.categories?.length
    ? filterOptions.categories
    : [];
  const themes = filterOptions?.themes || [];
  const languages = filterOptions?.languages || [];
  const colors = filterOptions?.colors || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const collectionValue =
    searchParams.get('collection') ||
    (DEPARTMENTS.some(({value}) => value === currentCollection)
      ? currentCollection
      : '');

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    clearPagination(next);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, {preventScrollReset: true});
  };

  const clearAll = () => {
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
    Number(Boolean(searchParams.get('type'))) +
    Number(!hideTheme && Boolean(searchParams.get('theme')));

  const countLabel = `${totalCount}${hasMoreResults ? '+' : ''} Products`;

  return (
    <>
      <div className="uniinx-plp-toolbar">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground lg:hidden"
        >
          <FilterIcon /> Filters
          {activeFiltersCount ? <span>({activeFiltersCount})</span> : null}
        </button>
        <span className="uniinx-plp-count text-sm text-black/65">
          {countLabel}
        </span>
        <label className="uniinx-plp-sort ml-auto flex min-w-0 items-center gap-3 text-sm">
          <span className="hidden sm:inline">Sort by</span>
          <select
            aria-label="Sort products"
            value={searchParams.get('sort') || defaultSort}
            onChange={(event) => updateParam('sort', event.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-full border border-black bg-white px-4 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <aside
        className="uniinx-plp-sidebar hidden lg:block"
        aria-label="Product filters"
      >
        <fieldset className="border-t border-black/20 pt-5">
          <legend className="mb-4 text-lg font-semibold tracking-[-0.02em]">
            Gender
          </legend>
          <div className="space-y-3">
            {DEPARTMENTS.map(({value, label}) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 text-base"
              >
                <input
                  type="checkbox"
                  checked={collectionValue === value}
                  onChange={() =>
                    updateParam(
                      'collection',
                      collectionValue === value ? '' : value,
                    )
                  }
                  className="size-6 rounded-[7px] border-black accent-black"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 space-y-6">
          <FilterSelect
            label="Collection"
            value={canonicalOption(themes, searchParams.get('theme'))}
            options={themes}
            placeholder="All collections"
            hidden={hideTheme}
            onChange={(value) => updateParam('theme', value)}
          />
          <FilterSelect
            label="Language"
            value={canonicalOption(languages, searchParams.get('language'))}
            options={languages}
            placeholder="All languages"
            onChange={(value) => updateParam('language', value)}
          />
          <FilterSelect
            label="Colors"
            value={canonicalOption(colors, searchParams.get('color'))}
            options={colors}
            placeholder="All colors"
            onChange={(value) => updateParam('color', value)}
          />
          <FilterSelect
            label="Category"
            value={canonicalOption(categories, searchParams.get('type'))}
            options={categories}
            placeholder="All categories"
            onChange={(value) => updateParam('type', value)}
          />
        </div>

        {activeFiltersCount ? (
          <button
            type="button"
            onClick={clearAll}
            className="mt-7 text-sm font-medium underline underline-offset-4"
          >
            Clear all filters
          </button>
        ) : null}
      </aside>

      <BottomSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Filters"
      >
        <div className="max-h-[72vh] space-y-6 overflow-y-auto p-1 text-black">
          <div>
            <p className="mb-3 text-sm font-semibold">Gender</p>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(({value, label}) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateParam(
                      'collection',
                      collectionValue === value ? '' : value,
                    )
                  }
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm ${collectionValue === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {!hideTheme ? (
            <FilterSelect
              label="Collection"
              value={canonicalOption(themes, searchParams.get('theme'))}
              options={themes}
              placeholder="All collections"
              onChange={(value) => updateParam('theme', value)}
            />
          ) : null}
          <FilterSelect
            label="Language"
            value={canonicalOption(languages, searchParams.get('language'))}
            options={languages}
            placeholder="All languages"
            onChange={(value) => updateParam('language', value)}
          />
          <FilterSelect
            label="Colors"
            value={canonicalOption(colors, searchParams.get('color'))}
            options={colors}
            placeholder="All colors"
            onChange={(value) => updateParam('color', value)}
          />
          <FilterSelect
            label="Category"
            value={canonicalOption(categories, searchParams.get('type'))}
            options={categories}
            placeholder="All categories"
            onChange={(value) => updateParam('type', value)}
          />
          <div className="flex gap-3 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="min-h-11 flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              View {countLabel}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="min-h-11 rounded-full border border-border-strong px-5 py-3 text-sm font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
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
      <span className="mb-2 block text-lg font-semibold tracking-[-0.02em]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-black bg-white px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-black/15"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
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
