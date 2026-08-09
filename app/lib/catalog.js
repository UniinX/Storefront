const CATEGORY_LABELS = new Map([
  ['tshirt', 'T-Shirts'],
  ['tee', 'T-Shirts'],
  ['hoodie', 'Hoodies'],
  ['sweatshirt', 'Sweatshirts'],
  ['sweatpant', 'Sweatpants'],
  ['jogger', 'Joggers'],
  ['terryshort', 'Terry Shorts'],
  ['accessory', 'Accessories'],
]);

export function normalizeCatalogValue(value = '') {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');
}

export function categoryLabel(value) {
  return CATEGORY_LABELS.get(normalizeCatalogValue(value)) ?? null;
}

function quoteSearchValue(value) {
  return `"${String(value).replace(/[\\"]/g, '\\$&')}"`;
}

export function getProductSearchQuery({type, theme, language, color, collection, q}) {
  const clauses = [];
  const normalizedType = normalizeCatalogValue(type);

  if (normalizedType && normalizedType !== 'all') {
    const categoryQueries = {
      tshirt: '(tag:tshirt OR tag:"t-shirt" OR product_type:"T-Shirts")',
      hoodie: '(tag:hoodie OR tag:hoodies OR product_type:Hoodie)',
      sweatshirt: '(tag:sweatshirt OR product_type:Sweatshirt)',
      sweatpant: '(tag:sweatpant OR tag:sweatpants OR product_type:Sweatpants)',
      jogger: '(tag:jogger OR tag:joggers OR product_type:Joggers)',
      terryshort: '(tag:"terry short" OR tag:terryshort OR product_type:"Terry Shorts")',
      accessory: '(tag:accessories OR tag:accessory OR product_type:Accessories)',
    };
    clauses.push(categoryQueries[normalizedType] ?? `tag:${quoteSearchValue(type)}`);
  }

  if (theme) clauses.push(`metafields.custom.collection_name:${quoteSearchValue(theme)}`);
  if (language) clauses.push(`metafields.custom.language:${quoteSearchValue(language)}`);
  if (color) {
    const value = quoteSearchValue(color);
    clauses.push(`(metafields.custom.family_value:${value} OR metafields.custom.color:${value} OR variant_option:${quoteSearchValue(`Color:${color}`)})`);
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

export function getCollectionFilters({type, theme, language, color, collection}) {
  const filters = [];
  if (type && type !== 'All') filters.push({tag: normalizeCatalogValue(type)});
  if (theme) filters.push({productMetafield: {namespace: 'custom', key: 'collection_name', value: theme}});
  if (language) filters.push({productMetafield: {namespace: 'custom', key: 'language', value: language}});
  if (color) filters.push({productMetafield: {namespace: 'custom', key: 'family_value', value: color}});
  if (collection) filters.push({tag: collection});
  return filters;
}

function add(set, value) {
  if (value) set.add(value);
}

export function getCatalogFilterOptions(connection) {
  const categories = new Set();
  const themes = new Set();
  const languages = new Set();
  const colors = new Set();

  for (const filter of connection?.filters ?? []) {
    const id = filter.id.toLowerCase();
    for (const value of filter.values ?? []) {
      if (!value.count) continue;
      if (id.includes('custom.collection_name')) add(themes, value.label);
      else if (id.includes('custom.language')) add(languages, value.label);
      else if (id.includes('custom.family_value') || id.includes('custom.color') || id.includes('option.color')) add(colors, value.label);
      else if (id.includes('product_type') || id.includes('tag')) add(categories, categoryLabel(value.label));
    }
  }

  for (const product of connection?.nodes ?? []) {
    add(categories, categoryLabel(product.productType));
    for (const tag of product.tags ?? []) add(categories, categoryLabel(tag));
    add(themes, product.collectionName?.value);
    add(languages, product.language?.value);
    add(colors, product.familyValue?.value ?? product.color?.value);
    for (const member of getFamilyProducts(product)) {
      add(colors, member.familyValue?.value ?? member.color?.value);
    }
    for (const variant of product.variants?.nodes ?? []) {
      add(colors, variant.selectedOptions?.find(({name}) => name.toLowerCase() === 'color')?.value);
    }
  }

  const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));
  return {
    categories: ['All', ...sorted(categories)],
    themes: sorted(themes),
    languages: sorted(languages),
    colors: sorted(colors),
  };
}

export function getFamilyProducts(product) {
  if (product.productFamily?.reference?.__typename !== 'Metaobject') return [];
  return product.productFamily.reference.products?.references?.nodes?.filter(Boolean) ?? [];
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
