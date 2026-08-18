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
    return [{...collection, label}];
  });
}

function quoteSearchValue(value) {
  return `"${String(value).replace(/[\\"]/g, '\\$&')}"`;
}

export function getProductSearchQuery({
  type,
  theme,
  language,
  color,
  size,
  collection,
  q,
}) {
  const clauses = [];
  const mappedLabel = categoryLabel(type) || type;
  const normalizedType = normalizeCatalogValue(mappedLabel);

  if (normalizedType && normalizedType !== 'all') {
    const categoryQueries = {
      tshirt:
        '(tag:tshirt OR tag:"t-shirt" OR tag:"T-shirt" OR tag:t-shirts OR product_type:"T-Shirts" OR product_type:"T-Shirt" OR category:"T-Shirts")',
      hoodie:
        '(tag:hoodie OR tag:hoodies OR product_type:Hoodie OR product_type:Hoodies OR category:Hoodies)',
      sweatshirt:
        '(tag:sweatshirt OR tag:sweatshirts OR product_type:Sweatshirt OR product_type:Sweatshirts OR category:Sweatshirts)',
      sweatpant:
        '(tag:sweatpant OR tag:sweatpants OR product_type:Sweatpants OR category:Sweatpants)',
      jogger:
        '(tag:jogger OR tag:joggers OR product_type:Joggers OR category:Joggers)',
      oversized: '(tag:oversized OR title:oversized OR product_type:Oversized)',
      terryshort:
        '(tag:"terry short" OR tag:terryshort OR tag:terry-shorts OR product_type:"Terry Shorts" OR category:Shorts)',
      polo: '(tag:polo OR tag:"polo t-shirt" OR tag:"men polo t-shirt" OR product_type:Polos OR category:Polos)',
      accessory:
        '(tag:accessories OR tag:accessory OR product_type:Accessories)',
    };
    clauses.push(
      categoryQueries[normalizedType] ??
        `(tag:${quoteSearchValue(type)} OR product_type:${quoteSearchValue(type)})`,
    );
  }

  if (theme)
    clauses.push(
      `(metafields.custom.collection_name:${quoteSearchValue(theme)} OR tag:${quoteSearchValue(theme)})`,
    );
  if (language)
    clauses.push(
      `(metafields.custom.language:${quoteSearchValue(language)} OR tag:${quoteSearchValue(language)})`,
    );
  if (color) {
    const value = quoteSearchValue(color);
    clauses.push(
      `(metafields.custom.family_value:${value} OR metafields.custom.color:${value} OR variant_option:${quoteSearchValue(`Color:${color}`)} OR tag:${value} OR title:${value})`,
    );
  }
  if (size) {
    const val = quoteSearchValue(size);
    clauses.push(
      `(variants.title:${val} OR variant_option:${val} OR variant_option:${quoteSearchValue(`size:${size}`)} OR variant_option:${quoteSearchValue(`Size:${size}`)} OR tag:${val} OR ${val})`,
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
  return {sortKey, reverse};
}

export function getCollectionFilters({
  type,
  theme,
  language,
  color,
  size,
  collection,
}) {
  const filters = [];
  if (type && type !== 'All') filters.push({tag: normalizeCatalogValue(type)});
  if (theme)
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'collection_name',
        value: theme,
      },
    });
  if (language)
    filters.push({
      productMetafield: {namespace: 'custom', key: 'language', value: language},
    });
  if (color)
    filters.push({
      productMetafield: {
        namespace: 'custom',
        key: 'family_value',
        value: color,
      },
    });
  if (size)
    filters.push({
      variantOption: {
        name: 'Size',
        value: size,
      },
    });
  if (collection) filters.push({tag: collection});
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

    add(themes, product.collectionName?.value);
    add(languages, product.language?.value);
    add(colors, product.familyValue?.value ?? product.color?.value);
    for (const member of getFamilyProducts(product)) {
      add(colors, member.familyValue?.value ?? member.color?.value);
    }
    for (const variant of product.variants?.nodes ?? []) {
      for (const opt of variant.selectedOptions ?? []) {
        const nameLower = opt.name?.toLowerCase();
        if (nameLower === 'color') add(colors, opt.value);
        if (nameLower === 'size') add(sizes, opt.value);
      }
    }
  }

  if (categoriesMap.size === 0) {
    const DEFAULT_CATEGORIES = [
      {label: 'T-Shirts', value: 'T-Shirts'},
      {label: 'Hoodies', value: 'Hoodies'},
      {label: 'Sweatshirts', value: 'Sweatshirts'},
      {label: 'Sweatpants', value: 'Sweatpants'},
      {label: 'Joggers', value: 'Joggers'},
      {label: 'Terry Shorts', value: 'Terry Shorts'},
      {label: 'Oversized', value: 'Oversized'},
      {label: 'Polos', value: 'Polos'},
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

export function groupCatalogFamilies(connection) {
  const seenFamilies = new Set();
  const nodes = [];

  for (const product of connection?.nodes ?? []) {
    const family = product.productFamily?.reference;
    const familyId = family?.__typename === 'Metaobject' ? family.id : null;
    if (familyId && seenFamilies.has(familyId)) continue;
    if (familyId) seenFamilies.add(familyId);
    nodes.push(product);
  }

  return {...connection, nodes};
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
