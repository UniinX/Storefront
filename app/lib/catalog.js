const CATEGORY_LABELS = new Map([
  ['tshirt', 'T-Shirts'],
  ['tshirts', 'T-Shirts'],
  ['tee', 'T-Shirts'],
  ['classictshirt', 'T-Shirts'],
  ['mensclassictshirt', 'T-Shirts'],
  ['womensclassictshirt', 'T-Shirts'],
  ['hoodie', 'Hoodies'],
  ['hoodies', 'Hoodies'],
  ['sweatshirt', 'Sweatshirts'],
  ['sweatshirts', 'Sweatshirts'],
  ['sweatpant', 'Sweatpants'],
  ['sweatpants', 'Sweatpants'],
  ['jogger', 'Joggers'],
  ['joggers', 'Joggers'],
  ['oversized', 'Oversized'],
  ['polo', 'Polos'],
  ['polos', 'Polos'],
  ['cap', 'Caps'],
  ['bag', 'Bags'],
  ['totebag', 'Tote Bags'],
  ['phonecase', 'Phone Cases'],
  ['terryshort', 'Terry Shorts'],
  ['terryshorts', 'Terry Shorts'],
  ['accessory', 'Accessories'],
  ['accessorie', 'Accessories'],
  ['accessories', 'Accessories'],
]);

export function normalizeCatalogValue(value = '') {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/s$/, '');
}

export function categoryLabel(value) {
  const normalized = normalizeCatalogValue(value);
  const exact = CATEGORY_LABELS.get(normalized);
  if (exact) return exact;

  const collectionTitleMatches = [
    ['oversized', 'Oversized'],
    ['tshirt', 'T-Shirts'],
    ['tee', 'T-Shirts'],
    ['hoodie', 'Hoodies'],
    ['sweatshirt', 'Sweatshirts'],
    ['sweatpant', 'Sweatpants'],
    ['jogger', 'Joggers'],
    ['terryshort', 'Terry Shorts'],
    ['totebag', 'Tote Bags'],
    ['phonecase', 'Phone Cases'],
    ['cap', 'Caps'],
    ['bag', 'Bags'],
    ['accessorie', 'Accessories'],
    ['accessory', 'Accessories'],
  ];
  return (
    collectionTitleMatches.find(([key]) => normalized.includes(key))?.[1] ??
    null
  );
}

export function getProductCollection(product) {
  return product?.collectionName?.value ?? null;
}

export function getProductCategory(product) {
  return product?.category?.name ?? null;
}

export function getProductCollectionMemberships(product) {
  return (product?.collections?.nodes ?? [])
    .map((node) => node?.title)
    .filter(Boolean);
}

export function normalizeProductTaxonomy(product) {
  return {
    collection: getProductCollection(product),
    category: getProductCategory(product),
    collections: getProductCollectionMemberships(product),
  };
}

export function getProductCategoryCollections(product) {
  const theme = normalizeCatalogValue(product?.collectionName?.value);
  const seen = new Set();

  return (product?.collections?.nodes ?? []).flatMap((collection) => {
    if (!collection?.handle || !collection?.title) return [];
    if (theme && normalizeCatalogValue(collection.title) === theme) return [];

    const label = categoryLabel(collection.title);
    if (!label || seen.has(label)) return [];
    seen.add(label);
    return [{ ...collection, label }];
  });
}

function quoteSearchValue(value) {
  return `"${String(value).replace(/[\\"]/g, '\\$&')}"`;
}

// --- Verified live-store search/filter capability (Storefront API 2026-04) ---
// Directly tested against the live store's GraphQL endpoint: `products(query:)`
// string search only reliably narrows on `tag:`, `title:`, and `product_type:`
// — every `metafields.*` and `variant_option:` clause is silently ignored
// (a bogus value returns the same result count as a real one). Typed
// `ProductFilter[]` (`filters:` on collection.products, `productFilters:` on
// search) only narrows for `available`/`price`; `tag`, `variantOption`,
// `productType`, and `productMetafield` are all silently ignored there too.
// Facet *discovery* (the `filters[]`/`productFilters[]` Shopify returns
// alongside results, for building chip lists) is separately gated on
// Shopify Admin → Search & Discovery → Filters, and currently only exposes
// Availability/Price on this store regardless of query.
//
// Until Shopify's index actually narrows on an attribute, it's matched
// client-side — see `productMatchesFilters` — against a broader fetched
// batch. Flip an entry to `true` only after re-verifying that attribute
// narrows server-side with a real-vs-bogus test; this map is meant to record
// "live verified native support," not "should theoretically work" — a flag
// flipped on the strength of appearing in `filters[]` alone, without an
// actual narrowing test, is exactly how the productType and color bugs
// below happened. Nothing else needs to change to make a switch, since
// `getCollectionFilters()`/`getProductSearchQuery()` already gate on this
// map.
export const STOREFRONT_NATIVE_FILTER_SUPPORT = {
  theme: true,
  color: true,
  size: true,
  // `custom.language` has zero populated values on the live catalog (see
  // catalog audit), so there's nothing to observe a FilterValue.input for
  // or run a real-vs-bogus narrowing test against yet, even though the
  // mechanism (productMetafield, same family as `theme` above) should work
  // identically once data exists. Flip to `true` only after that test.
  language: false,
  // Shopify's `ProductFilter.productType` is genuinely native and does
  // narrow correctly (verified: real value -> matches, bogus -> 0) — but
  // it's a case-sensitive *exact* match against the single real value
  // Shopify stores (`"Hoodie"`, not this codebase's UI label `"Hoodies"`),
  // so it's only sent for categories with a verified exact mapping in
  // CATEGORY_TO_PRODUCT_TYPE below; anything else still needs
  // `productMatchesFilters` to narrow, so `hasClientOnlyFilters()` checks
  // the mapping per-value, not just this flag.
  productType: true,
  // Men/Women/Accessories are tag-based (matchesDepartment()), not a real
  // Shopify attribute — there is no native filter to switch to here, this
  // flag exists only for consistency/documentation and should stay `false`.
  department: false,
};

// Verified live mapping from this codebase's normalized category value to
// the exact `productType` string Shopify stores (case- and form-sensitive:
// "Hoodies" -> 0 results, "Hoodie" -> correct results). Only categories with
// a directly-tested mapping belong here — categories/tags that aren't a
// distinct Shopify productType (e.g. "Oversized" is a tag on productType
// "Hoodie", not its own type) must NOT be added, since a wrong or invented
// mapping would silently under-match instead of falling back correctly.
const CATEGORY_TO_PRODUCT_TYPE = {
  tshirt: 'T-Shirt',
  hoodie: 'Hoodie',
  sweatshirt: 'Sweatshirt',
  sweatpant: 'Sweatpants',
  jogger: 'Joggers',
  polo: 'Polo T-Shirt',
  terryshort: 'Shorts',
};

/** The exact Shopify `productType` value for `type`, or `null` if unmapped. */
function getNativeProductType(type) {
  const mappedLabel = categoryLabel(type) || type;
  return CATEGORY_TO_PRODUCT_TYPE[normalizeCatalogValue(mappedLabel)] ?? null;
}

export function getProductSearchQuery({ type, collection, q } = {}) {
  const clauses = [];
  const mappedLabel = categoryLabel(type) || type;
  const normalizedType = normalizeCatalogValue(mappedLabel);

  if (normalizedType && normalizedType !== 'all') {
    const categoryQueries = {
      tshirt:
        '(tag:tshirt OR tag:"t-shirt" OR tag:"T-shirt" OR tag:t-shirts OR product_type:"T-Shirts" OR product_type:"T-Shirt")',
      hoodie:
        '(tag:hoodie OR tag:hoodies OR product_type:Hoodie OR product_type:Hoodies)',
      sweatshirt:
        '(tag:sweatshirt OR tag:sweatshirts OR product_type:Sweatshirt OR product_type:Sweatshirts)',
      sweatpant: '(tag:sweatpant OR tag:sweatpants OR product_type:Sweatpants)',
      jogger: '(tag:jogger OR tag:joggers OR product_type:Joggers)',
      oversized: '(tag:oversized OR title:oversized OR product_type:Oversized)',
      terryshort:
        '(tag:"terry short" OR tag:terryshort OR tag:terry-shorts OR product_type:"Terry Shorts")',
      polo: '(tag:polo OR tag:"polo t-shirt" OR tag:"men polo t-shirt" OR product_type:Polos)',
      accessory:
        '(tag:accessories OR tag:accessory OR product_type:Accessories)',
    };
    clauses.push(
      categoryQueries[normalizedType] ??
      `(tag:${quoteSearchValue(type)} OR product_type:${quoteSearchValue(type)})`,
    );
  }

  if (collection) {
    const value = collection.toLowerCase();
    clauses.push(
      value === 'men' || value === 'women'
        ? `(tag:${value} OR tag:unisex)`
        : `tag:${quoteSearchValue(value)}`,
    );
  }
  if (q?.trim()) {
    const value = quoteSearchValue(q.trim());
    clauses.push(`(title:${value} OR tag:${value})`);
  }

  return clauses.join(' AND ') || null;
}

export function getCatalogSort(sort, collection = false) {
  const values = collection
    ? {
      featured: ['COLLECTION_DEFAULT', false],
      newest: ['CREATED', true],
      'price-asc': ['PRICE', false],
      'price-desc': ['PRICE', true],
    }
    : {
      featured: ['BEST_SELLING', false],
      newest: ['CREATED_AT', true],
      'price-asc': ['PRICE', false],
      'price-desc': ['PRICE', true],
    };
  const [sortKey, reverse] = values[sort] ?? values.featured;
  return { sortKey, reverse };
}

/**
 * Builds Shopify's typed `ProductFilter[]` input. Every branch is gated on
 * `STOREFRONT_NATIVE_FILTER_SUPPORT` (verified live against the store's own
 * `filters[].values.input` after Search & Discovery was enabled — see the
 * note above): theme, color, size, and mapped product types narrow
 * correctly via the shapes below. `department` stays off since Men/Women/
 * Accessories are tag-based, not a real Shopify attribute — there's nothing
 * native to switch to.
 */
export function getCollectionFilters({
  type,
  theme,
  language,
  color,
  size,
  collection,
}) {
  const filters = [];
  if (type && type !== 'All' && STOREFRONT_NATIVE_FILTER_SUPPORT.productType) {
    const productType = getNativeProductType(type);
    if (productType) filters.push({ productType });
  }
  if (theme && STOREFRONT_NATIVE_FILTER_SUPPORT.theme)
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'collection_name',
        value: theme,
      },
    });
  if (language && STOREFRONT_NATIVE_FILTER_SUPPORT.language)
    filters.push({
      productMetafield: { namespace: 'custom', key: 'language', value: language },
    });
  if (color && STOREFRONT_NATIVE_FILTER_SUPPORT.color)
    // Shopify exposes color as a variant-option facet, not a metafield —
    // confirmed via `filters[]`: `{"variantOption":{"name":"color","value":"Black"}}`.
    // Variant-option `name` matching is case-insensitive (verified live), so
    // 'Color' here is safe even though Shopify's own facet id uses lowercase.
    filters.push({
      variantOption: {
        name: 'Color',
        value: color,
      },
    });
  if (size && STOREFRONT_NATIVE_FILTER_SUPPORT.size)
    filters.push({
      variantOption: {
        name: 'Size',
        value: size,
      },
    });
  if (collection && STOREFRONT_NATIVE_FILTER_SUPPORT.department)
    filters.push({ tag: collection });
  return filters;
}

function add(set, value) {
  if (value) set.add(value);
}

function getProductCategories(product) {
  const set = new Set();
  const primaryCat = getProductCategory(product);
  if (primaryCat) {
    const label = categoryLabel(primaryCat);
    if (label) set.add(label);
  }
  if (product?.productType) {
    const label = categoryLabel(product.productType);
    if (label) set.add(label);
  }
  for (const tag of product?.tags ?? []) {
    const lower = tag.toLowerCase();
    if (
      lower === 'men' ||
      lower === 'women' ||
      lower === 'unisex' ||
      lower === 'solid' ||
      lower === 'solids'
    ) {
      continue;
    }
    const label = categoryLabel(tag);
    if (label) set.add(label);
  }
  return [...set];
}

/**
 * Canonical per-attribute value getters. These are the single source of
 * truth for "what is this product's theme/language/color/size" — used both
 * to build the facet chip lists below and, in `productMatchesFilters`, to
 * decide whether a product passes the currently selected filters. Keeping
 * one function per attribute means a chip a user can click always matches
 * the same product it was generated from.
 */
export function getProductTheme(product) {
  return product?.collectionName?.value ?? null;
}

export function getProductLanguage(product) {
  return product?.language?.value ?? null;
}

export function getProductColor(product) {
  // Canonical source: Shopify's standardized `shopify.color-pattern`
  // taxonomy metaobject, resolved to its human label. This is populated on
  // the live catalog; the legacy `custom.color`/`custom.family_value`
  // metafields are not (verified empty across the sampled catalog) and are
  // intentionally not used here.
  const resolvedLabel =
    product?.colorPattern?.references?.nodes?.[0]?.label?.value;
  if (resolvedLabel) return resolvedLabel;

  for (const variant of product?.variants?.nodes ?? []) {
    for (const opt of variant.selectedOptions ?? []) {
      if (opt.name?.toLowerCase() === 'color') return opt.value;
    }
  }
  return null;
}

export function getProductSizes(product) {
  const sizes = new Set();
  for (const variant of product?.variants?.nodes ?? []) {
    for (const opt of variant.selectedOptions ?? []) {
      if (opt.name?.toLowerCase() === 'size') sizes.add(opt.value);
    }
  }
  return [...sizes];
}

function valuesMatch(a, b) {
  return String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
}

/**
 * Whether `product` satisfies the currently selected catalog filters. This
 * is the client-side narrowing mechanism used everywhere
 * `STOREFRONT_NATIVE_FILTER_SUPPORT` says Shopify's own `filters:`/`query:` can't be
 * trusted to narrow — see the note above `STOREFRONT_NATIVE_FILTER_SUPPORT`. It reads
 * from exactly the same per-product fields as `getCatalogFilterOptions()`,
 * so a facet chip a user clicks always matches the product it was
 * generated from.
 */
export function productMatchesFilters(
  product,
  { type, theme, language, color, size, collection } = {},
) {
  if (type) {
    const mappedType = categoryLabel(type) || type;
    const categories = [
      ...getProductCategoryCollections(product).map((c) => c.label),
      ...getProductCategories(product),
    ];
    if (!categories.some((c) => valuesMatch(c, mappedType))) return false;
  }
  if (theme && !valuesMatch(getProductTheme(product), theme)) return false;
  if (language && !valuesMatch(getProductLanguage(product), language))
    return false;
  if (color) {
    const colors = [
      getProductColor(product),
      ...getFamilyProducts(product).map(getProductColor),
    ].filter(Boolean);
    if (!colors.some((c) => valuesMatch(c, color))) return false;
  }
  if (size && !getProductSizes(product).some((s) => valuesMatch(s, size)))
    return false;
  if (collection) {
    const dept = collection.toLowerCase();
    const matches =
      dept === 'men' || dept === 'women'
        ? matchesDepartment(product, dept)
        : (product.tags ?? []).some((t) => valuesMatch(t, collection));
    if (!matches) return false;
  }
  return true;
}

// How many products to fetch in one shot when any attribute filter isn't
// natively supported (see STOREFRONT_NATIVE_FILTER_SUPPORT) and has to be matched
// client-side instead of via Shopify's cursor pagination.
export const CLIENT_FILTER_BATCH_SIZE = 100;

/**
 * Whether any selected filter requires client-side matching right now.
 *
 * `typedFiltersAvailable` must be `false` for any fetch going through the
 * top-level `products(query:)` field (collections.all.jsx, and the virtual
 * Men/Women/Accessories department fallback) — that field has no `filters:`
 * argument at all (confirmed via schema introspection), so it can never use
 * typed `ProductFilter`s no matter what Shopify's index supports. Only
 * `collection.products(filters:)` and `search(productFilters:)` can, so
 * only those call sites should let `STOREFRONT_NATIVE_FILTER_SUPPORT`
 * decide.
 */
export function hasClientOnlyFilters(
  selected = {},
  {typedFiltersAvailable = true} = {},
) {
  const nativeOk = (key) => typedFiltersAvailable && STOREFRONT_NATIVE_FILTER_SUPPORT[key];
  // productType is only sent natively for categories with a verified exact
  // mapping (see CATEGORY_TO_PRODUCT_TYPE) — anything else (an unmapped
  // category, or a tag-only distinction like "Oversized") still needs
  // client-side matching even with the flag on.
  const productTypeNative = nativeOk('productType') && getNativeProductType(selected.type) != null;
  return Boolean(
    (selected.type && !productTypeNative) ||
    (selected.theme && !nativeOk('theme')) ||
    (selected.language && !nativeOk('language')) ||
    (selected.color && !nativeOk('color')) ||
    (selected.size && !nativeOk('size')) ||
    // Department (men/women) is tag-based (matchesDepartment()) — there's no
    // native attribute to switch to, so it's always client-matched.
    (selected.collection && !nativeOk('department')) ||
    selected.q?.trim(),
  );
}

/**
 * Applies `productMatchesFilters` (plus free-text `q`) to an already-fetched
 * product connection and re-shapes it back into a connection. Only called
 * when `hasClientOnlyFilters()` is true, since it trades true cursor
 * pagination for correctness: the whole fetched batch is matched and
 * returned as a single page (`hasNextPage: false`) rather than paginated
 * further. Catalog/collection sizes here are small enough (tens of products
 * per collection) that this is a reasonable accepted tradeoff — the same one
 * already made for `?q=` on collection pages — rather than a regression.
 */
export function applyClientFilters(connection, selected = {}) {
  const q = selected.q?.trim().toLowerCase();
  const nodes = (connection?.nodes ?? []).filter((product) => {
    if (!productMatchesFilters(product, selected)) return false;
    if (q) {
      const inTitle = product.title?.toLowerCase().includes(q);
      const inTags = (product.tags ?? []).some((t) =>
        t.toLowerCase().includes(q),
      );
      if (!inTitle && !inTags) return false;
    }
    return true;
  });
  return {
    ...connection,
    nodes,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

export function getCatalogFilterOptions(connection) {
  const categoriesMap = new Map();
  const themes = new Set();
  const languages = new Set();
  const colors = new Set();
  const sizes = new Set();

  for (const filter of connection?.filters ?? []) {
    const id = filter.id.toLowerCase();
    for (const value of filter.values ?? []) {
      if (!value.count) continue;
      if (id.includes('custom.collection_name')) add(themes, value.label);
      else if (id.includes('custom.language')) add(languages, value.label);
      else if (
        id.includes('custom.family_value') ||
        id.includes('custom.color') ||
        id.includes('option.color')
      )
        add(colors, value.label);
      else if (id.includes('option.size')) add(sizes, value.label);
    }
  }

  for (const product of connection?.nodes ?? []) {
    for (const collection of getProductCategoryCollections(product)) {
      if (!categoriesMap.has(collection.label)) {
        categoriesMap.set(collection.label, {
          label: collection.label,
          value: collection.handle,
        });
      }
    }

    const catList = getProductCategories(product);
    for (const cat of catList) {
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, {
          label: cat,
          value: cat,
        });
      }
    }

    add(themes, getProductTheme(product));
    add(languages, getProductLanguage(product));
    add(colors, getProductColor(product));
    for (const member of getFamilyProducts(product)) {
      add(colors, getProductColor(member));
    }
    for (const size of getProductSizes(product)) {
      add(sizes, size);
    }
  }

  if (categoriesMap.size === 0) {
    const DEFAULT_CATEGORIES = [
      { label: 'T-Shirts', value: 'T-Shirts' },
      { label: 'Hoodies', value: 'Hoodies' },
      { label: 'Sweatshirts', value: 'Sweatshirts' },
      { label: 'Sweatpants', value: 'Sweatpants' },
      { label: 'Joggers', value: 'Joggers' },
      { label: 'Terry Shorts', value: 'Terry Shorts' },
      { label: 'Oversized', value: 'Oversized' },
      { label: 'Polos', value: 'Polos' },
    ];

    for (const cat of DEFAULT_CATEGORIES) {
      if (!categoriesMap.has(cat.label)) {
        categoriesMap.set(cat.label, {
          label: cat.label,
          value: cat.value,
        });
      }
    }
  }

  if (languages.size === 0) {
    [
      'English',
      'Hindi',
      'Telugu',
      'Tamil',
      'Malayalam',
      'Kannada',
      'Odia',
      'Bengali',
    ].forEach((l) => languages.add(l));
  }

  if (colors.size === 0) {
    [
      'Black',
      'White',
      'Off White',
      'Beige',
      'Grey Melange',
      'Navy Blue',
      'Maroon',
      'Lavender',
      'Light Pink',
      'Bottle Green',
    ].forEach((c) => colors.add(c));
  }

  if (sizes.size === 0) {
    ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].forEach((s) => sizes.add(s));
  }

  const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL'];
  const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));
  const sortedSizes = [...sizes].sort((a, b) => {
    const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
    const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return {
    categories: [...categoriesMap.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    themes: sorted(themes),
    languages: sorted(languages),
    colors: sorted(colors),
    sizes: sortedSizes,
  };
}

export function getFamilyProducts(product) {
  if (product.productFamily?.reference?.__typename !== 'Metaobject') return [];
  return (
    product.productFamily.reference.products?.references?.nodes?.filter(
      Boolean,
    ) ?? []
  );
}

/** The product-family metaobject id for `product`, or `null` if it has none. */
export function getProductFamilyKey(product) {
  const family = product?.productFamily?.reference;
  return family?.__typename === 'Metaobject' ? family.id : null;
}

/**
 * De-dupes products sharing the same product family down to one card each,
 * keeping the first one seen. Only ever sees one loader call's own raw page
 * of results (12 items at a time) — a family whose members span more than
 * one page (common; e.g. this store's "Hoodie" family has 11 members) will
 * still produce a duplicate card once that family's other members show up
 * on a later page. `PaginatedResourceSection`'s `dedupeKey` prop re-dedupes
 * the full cross-page accumulated list on the client for that reason; this
 * one stays useful for a single page's `totalCount`/`filterOptions`.
 */
export function groupCatalogFamilies(connection) {
  const seenFamilies = new Set();
  const nodes = [];

  for (const product of connection?.nodes ?? []) {
    const familyId = getProductFamilyKey(product);
    if (familyId && seenFamilies.has(familyId)) continue;
    if (familyId) seenFamilies.add(familyId);
    nodes.push(product);
  }

  return { ...connection, nodes };
}

export function matchesDepartment(product, department) {
  const tags = new Set((product.tags ?? []).map((tag) => tag.toLowerCase()));
  return department === 'men' || department === 'women'
    ? tags.has(department) || tags.has('unisex')
    : tags.has(department);
}

export function mergeCatalogFilterOptions(accumulated = {}, incoming = {}) {
  const categoriesMap = new Map();

  const addCategory = (item) => {
    if (!item) return;
    const label = typeof item === 'object' && item !== null ? item.label : item;
    const value = typeof item === 'object' && item !== null ? item.value : item;
    if (label && !categoriesMap.has(String(label).toLowerCase())) {
      categoriesMap.set(String(label).toLowerCase(), {
        label,
        value: value || label,
      });
    }
  };

  for (const item of accumulated.categories || []) addCategory(item);
  for (const item of incoming.categories || []) addCategory(item);

  const mergeUniqueList = (accList = [], incList = []) => {
    const map = new Map();
    for (const item of [...accList, ...incList]) {
      if (!item) continue;
      const val =
        typeof item === 'object' && item !== null ? item.value || item.label : item;
      const key = String(val).toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  };

  const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL'];
  const sortedSizes = mergeUniqueList(
    accumulated.sizes,
    incoming.sizes,
  ).sort((a, b) => {
    const valA = typeof a === 'object' && a !== null ? a.value || a.label : a;
    const valB = typeof b === 'object' && b !== null ? b.value || b.label : b;
    const idxA = SIZE_ORDER.indexOf(String(valA).toUpperCase());
    const idxB = SIZE_ORDER.indexOf(String(valB).toUpperCase());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return String(valA).localeCompare(String(valB));
  });

  return {
    categories: Array.from(categoriesMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    themes: mergeUniqueList(accumulated.themes, incoming.themes).sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    languages: mergeUniqueList(accumulated.languages, incoming.languages).sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    colors: mergeUniqueList(accumulated.colors, incoming.colors).sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    sizes: sortedSizes,
  };
}
