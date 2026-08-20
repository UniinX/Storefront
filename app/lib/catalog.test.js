import {describe, expect, it} from 'vitest';
import {
  applyClientFilters,
  categoryLabel,
  getCatalogFilterOptions,
  getCollectionFilters,
  getProductCategoryCollections,
  getProductColor,
  getProductSearchQuery,
  groupCatalogFamilies,
  hasClientOnlyFilters,
  mergeCatalogFilterOptions,
  normalizeProductTaxonomy,
  productMatchesFilters,
} from './catalog';

describe('catalog helpers', () => {
  it('normalizes common T-shirt spellings to one category', () => {
    expect(categoryLabel('T-Shirts')).toBe('T-Shirts');
    expect(categoryLabel('tshirt')).toBe('T-Shirts');
    expect(categoryLabel('T Shirt')).toBe('T-Shirts');
    expect(categoryLabel("Women's Classic T-shirt")).toBe('T-Shirts');
  });

  it('builds a Shopify-side query from only the fields verified to narrow (tag/title/product_type)', () => {
    const query = getProductSearchQuery({type: 'T-Shirts', collection: 'men', q: 'tiger'});
    expect(query).toContain('tag:tshirt');
    expect(query).toContain('(tag:men OR tag:unisex)');
    expect(query).toContain('title:"tiger"');
    // theme/language/color/size never narrow via products(query:) on this
    // store (metafields.*/variant_option: are silently ignored), so they're
    // no longer emitted here — they're matched client-side instead, see
    // productMatchesFilters below.
    expect(query).not.toContain('metafields');
    expect(query).not.toContain('variant_option');
  });

  it('matches products client-side for attributes Shopify does not narrow on', () => {
    const product = {
      collectionName: {value: 'Solids'},
      language: {value: 'Telugu'},
      colorPattern: {references: {nodes: [{label: {value: 'Navy Blue'}}]}},
      variants: {nodes: [{selectedOptions: [{name: 'Size', value: 'M'}]}]},
      tags: ['unisex'],
    };
    expect(productMatchesFilters(product, {theme: 'Solids'})).toBe(true);
    expect(productMatchesFilters(product, {theme: 'Stripes'})).toBe(false);
    expect(productMatchesFilters(product, {language: 'telugu'})).toBe(true);
    expect(productMatchesFilters(product, {color: 'navy blue'})).toBe(true);
    expect(productMatchesFilters(product, {color: 'Black'})).toBe(false);
    expect(productMatchesFilters(product, {size: 'M'})).toBe(true);
    expect(productMatchesFilters(product, {size: 'XL'})).toBe(false);
  });

  it('prefers the canonical shopify.color-pattern taxonomy over legacy metafields', () => {
    const product = {
      colorPattern: {references: {nodes: [{label: {value: 'Flamingo'}}]}},
      familyValue: {value: 'Legacy Value'},
      color: {value: 'Legacy Color'},
    };
    expect(getProductColor(product)).toBe('Flamingo');
  });

  it('applyClientFilters narrows a connection and returns a single unpaginated page', () => {
    const nodes = [
      {title: 'Tiger Hoodie', tags: ['unisex'], collectionName: {value: 'Wild'}},
      {title: 'Plain Hoodie', tags: ['unisex'], collectionName: {value: 'Solids'}},
    ];
    const result = applyClientFilters({nodes, pageInfo: {hasNextPage: true}}, {q: 'tiger'});
    expect(result.nodes.map((n) => n.title)).toEqual(['Tiger Hoodie']);
    expect(result.pageInfo.hasNextPage).toBe(false);
  });

  it('hasClientOnlyFilters is true whenever an unsupported-native attribute or q is selected', () => {
    expect(hasClientOnlyFilters({})).toBe(false);
    // 'Hoodies' has a verified CATEGORY_TO_PRODUCT_TYPE mapping ('Hoodie'),
    // so it's native now and no longer needs client-side matching.
    expect(hasClientOnlyFilters({type: 'Hoodies'})).toBe(false);
    // Language has no live data yet, so it stays client-matched even though
    // the flag map documents it as "mechanism should work, unverified".
    expect(hasClientOnlyFilters({language: 'Telugu'})).toBe(true);
    expect(hasClientOnlyFilters({q: 'tiger'})).toBe(true);
    expect(hasClientOnlyFilters({q: '  '})).toBe(false);
  });

  it('hasClientOnlyFilters still requires client matching for a category with no verified productType mapping', () => {
    // "Oversized" is a tag on productType "Hoodie", not its own Shopify
    // productType — CATEGORY_TO_PRODUCT_TYPE deliberately excludes it.
    expect(hasClientOnlyFilters({type: 'Oversized'})).toBe(true);
  });

  it('hasClientOnlyFilters never trusts typed filters when the fetch mechanism cannot send them', () => {
    // collections.all.jsx and the department fallback use products(query:),
    // which has no `filters:` argument at all.
    expect(
      hasClientOnlyFilters({type: 'Hoodies'}, {typedFiltersAvailable: false}),
    ).toBe(true);
    expect(
      hasClientOnlyFilters({color: 'Black'}, {typedFiltersAvailable: false}),
    ).toBe(true);
  });

  it('getCollectionFilters sends the exact mapped productType, not the UI label, and omits language entirely', () => {
    const filters = getCollectionFilters({
      type: 'Hoodies',
      language: 'Telugu',
      color: 'Black',
      size: 'M',
    });
    expect(filters).toContainEqual({productType: 'Hoodie'});
    expect(filters).toContainEqual({variantOption: {name: 'Color', value: 'Black'}});
    expect(filters).toContainEqual({variantOption: {name: 'Size', value: 'M'}});
    // language: false in STOREFRONT_NATIVE_FILTER_SUPPORT until real data exists.
    expect(filters.some((f) => f.productMetafield?.key === 'language')).toBe(false);
  });

  it('getCollectionFilters omits productType for an unmapped category rather than guessing', () => {
    const filters = getCollectionFilters({type: 'Oversized'});
    expect(filters.some((f) => f.productType)).toBe(false);
  });

  it('groups products from the same family within a cursor page', () => {
    const family = {__typename: 'Metaobject', id: 'family-1'};
    const result = groupCatalogFamilies({
      nodes: [
        {id: 'black', productFamily: {reference: family}},
        {id: 'blue', productFamily: {reference: family}},
        {id: 'standalone'},
      ],
      pageInfo: {},
    });
    expect(result.nodes.map(({id}) => id)).toEqual(['black', 'standalone']);
  });

  it('derives family colors and categories from live product data', () => {
    const product = {
      productType: 'Ignored for categories',
      tags: ['shirt'],
      collectionName: {value: 'Solids'},
      collections: {
        nodes: [
          {id: 'theme', handle: 'solids', title: 'Solids'},
          {
            id: 'category',
            handle: 'womens-classic-t-shirt',
            title: "Women's Classic T-shirt",
          },
        ],
      },
      colorPattern: {references: {nodes: [{label: {value: 'Black'}}]}},
      productFamily: {
        reference: {
          __typename: 'Metaobject',
          products: {
            references: {
              nodes: [
                {colorPattern: {references: {nodes: [{label: {value: 'Blue'}}]}}},
              ],
            },
          },
        },
      },
    };
    const options = getCatalogFilterOptions({nodes: [product]});
    expect(options.categories).toEqual([
      {label: 'T-Shirts', value: 'womens-classic-t-shirt'},
    ]);
    expect(options.themes).toEqual(['Solids']);
    expect(options.colors).toEqual(['Black', 'Blue']);
    expect(getProductCategoryCollections(product)).toEqual([
      {
        id: 'category',
        handle: 'womens-classic-t-shirt',
        title: "Women's Classic T-shirt",
        label: 'T-Shirts',
      },
    ]);
  });

  it('maps collection metafield, Shopify taxonomy category, and collection memberships as separate fields', () => {
    const product = {
      collectionName: {value: 'Solids'},
      category: {id: 'gid://shopify/TaxonomyCategory/aa-2-1', name: 'T-Shirts'},
      collections: {
        nodes: [
          {id: 'theme', handle: 'solids', title: 'Solids'},
          {
            id: 'category',
            handle: 'womens-classic-t-shirt',
            title: "Women's Classic T-shirt",
          },
        ],
      },
    };

    expect(normalizeProductTaxonomy(product)).toEqual({
      collection: 'Solids',
      category: 'T-Shirts',
      collections: ['Solids', "Women's Classic T-shirt"],
    });
  });

  it('does not let collection membership overwrite the collection or category fields', () => {
    const product = {
      collectionName: {value: 'Solids'},
      category: {name: 'T-Shirts'},
      collections: {
        nodes: [{id: 'x', handle: 'unrelated', title: 'Completely Different'}],
      },
    };

    const result = normalizeProductTaxonomy(product);
    expect(result.collection).toBe('Solids');
    expect(result.category).toBe('T-Shirts');
    expect(result.collections).toEqual(['Completely Different']);
  });

  it('falls back to null/empty when taxonomy fields are missing', () => {
    expect(normalizeProductTaxonomy({})).toEqual({
      collection: null,
      category: null,
      collections: [],
    });
  });

  it('accumulates and merges filter options across paginated reloads', () => {
    const page1 = {
      categories: [{label: 'T-Shirts', value: 'tshirts'}],
      colors: ['Black'],
      sizes: ['S', 'M'],
    };
    const page2 = {
      categories: [{label: 'Hoodies', value: 'hoodies'}],
      colors: ['Navy Blue'],
      sizes: ['L', 'XL'],
    };
    const merged = mergeCatalogFilterOptions(page1, page2);
    expect(merged.categories).toEqual([
      {label: 'Hoodies', value: 'hoodies'},
      {label: 'T-Shirts', value: 'tshirts'},
    ]);
    expect(merged.colors).toEqual(['Black', 'Navy Blue']);
    expect(merged.sizes).toEqual(['S', 'M', 'L', 'XL']);
  });
});
