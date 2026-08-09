import {describe, expect, it} from 'vitest';
import {
  categoryLabel,
  getCatalogFilterOptions,
  getProductSearchQuery,
  groupCatalogFamilies,
} from './catalog';

describe('catalog helpers', () => {
  it('normalizes common T-shirt spellings to one category', () => {
    expect(categoryLabel('T-Shirts')).toBe('T-Shirts');
    expect(categoryLabel('tshirt')).toBe('T-Shirts');
    expect(categoryLabel('T Shirt')).toBe('T-Shirts');
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
    const options = getCatalogFilterOptions({nodes: [{
      productType: 'T-Shirt',
      tags: [],
      familyValue: {value: 'Black'},
      productFamily: {reference: {__typename: 'Metaobject', products: {references: {nodes: [
        {familyValue: {value: 'Blue'}},
      ]}}}},
    }]});
    expect(options.categories).toEqual(['All', 'T-Shirts']);
    expect(options.colors).toEqual(['Black', 'Blue']);
  });
});
