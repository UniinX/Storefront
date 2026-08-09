import {describe, expect, it, vi} from 'vitest';
import {loader} from '../routes/collections.$handle.jsx';

function product(id, tags = []) {
  return {
    id,
    handle: id,
    title: id,
    tags,
    variants: {nodes: []},
    priceRange: {minVariantPrice: {amount: '10', currencyCode: 'USD'}},
  };
}

function requestFor(handle, search = '') {
  return new Request(`https://example.test/collections/${handle}${search}`);
}

describe('department collection loader', () => {
  it('uses Shopify collection membership when the department collection exists', async () => {
    const storefront = {
      query: vi.fn().mockResolvedValue({
        collection: {
          id: 'gid://shopify/Collection/1',
          handle: 'men',
          title: 'Men',
          description: '',
          products: {
            nodes: [product('curated-product')],
            pageInfo: {hasNextPage: false, endCursor: null},
          },
        },
      }),
    };

    const result = await loader({
      context: {storefront},
      params: {handle: 'men'},
      request: requestFor('men'),
    });

    expect(result.products.nodes.map(({id}) => id)).toEqual(['curated-product']);
    expect(storefront.query).toHaveBeenCalledOnce();
  });

  it('strictly filters a missing department collection by tags', async () => {
    const storefront = {
      query: vi
        .fn()
        .mockResolvedValueOnce({collection: null})
        .mockResolvedValueOnce({
          products: {
            nodes: [
              product('womens-product', ['Women']),
              product('unisex-product', ['Unisex']),
              product('mens-product', ['Men']),
              product('untagged-product'),
            ],
            pageInfo: {hasNextPage: false, endCursor: null},
          },
        }),
    };

    const result = await loader({
      context: {storefront},
      params: {handle: 'women'},
      request: requestFor('women'),
    });

    expect(result.products.nodes.map(({id}) => id)).toEqual([
      'womens-product',
      'unisex-product',
    ]);
    expect(result.totalCount).toBe(2);
  });

  it('uses Hydrogen cursor and direction parameters for the next page', async () => {
    const products = [product('product-8', ['Men']), product('product-9', ['Men'])];
    const storefront = {
      query: vi.fn().mockResolvedValue({
        collection: {
          id: 'gid://shopify/Collection/1',
          handle: 'men',
          title: 'Men',
          description: '',
          products: {
            nodes: products,
            pageInfo: {hasPreviousPage: true, hasNextPage: false, startCursor: 'page-2', endCursor: null},
          },
        },
      }),
    };

    const result = await loader({
      context: {storefront},
      params: {handle: 'men'},
      request: requestFor('men', '?direction=next&cursor=OA%3D%3D'),
    });

    expect(result.products.nodes.map(({id}) => id)).toEqual([
      'product-8',
      'product-9',
    ]);
    expect(result.products.pageInfo.hasPreviousPage).toBe(true);
    expect(result.products.pageInfo.hasNextPage).toBe(false);
    expect(storefront.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        variables: expect.objectContaining({first: 12, endCursor: 'OA=='}),
      }),
    );
  });
});
