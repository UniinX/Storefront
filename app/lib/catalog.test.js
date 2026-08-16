import {describe, expect, it} from 'vitest';
import {
  categoryLabel,
  getCatalogFilterOptions,
  getProductCategoryCollections,
  getProductSearchQuery,
  groupCatalogFamilies,
  mergeCatalogFilterOptions,
  normalizeProductTaxonomy,
} from './catalog';

describe('catalog helpers', () => {
  it('normalizes common T-shirt spellings to one category', () => {
    expect(categoryLabel('T-Shirts')).toBe('T-Shirts');
    expect(categoryLabel('tshirt')).toBe('T-Shirts');
    expect(categoryLabel('T Shirt')).toBe('T-Shirts');
    expect(categoryLabel("Women's Classic T-shirt")).toBe('T-Shirts');
  });

  it('builds a Shopify-side query for family color and metadata filters', () => {
    const query = getProductSearchQuery({
      type: 'T-Shirts',
      theme: 'Space',
      language: 'Telugu',
      color: 'Navy',
    });
    expect(query).toContain('tag:tshirt');
    expect(query).toContain('metafields.custom.collection_name:"Space"');
    expect(query).toContain('metafields.custom.family_value:"Navy"');
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
      familyValue: {value: 'Black'},
      productFamily: {
        reference: {
          __typename: 'Metaobject',
          products: {
            references: {nodes: [{familyValue: {value: 'Blue'}}]},
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
