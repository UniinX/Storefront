import {describe, expect, it, beforeEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {WishlistProvider, useWishlist} from './WishlistContext.jsx';

const sampleProduct = {
  id: 'gid://shopify/Product/100',
  handle: 'antariksham-tee',
  title: 'Antariksham Oversized Tee',
  featuredImage: {url: 'https://cdn.shopify.com/tee.jpg'},
  priceRange: {minVariantPrice: {amount: '1499', currencyCode: 'INR'}},
};

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty wishlist', () => {
    const {result} = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });
    expect(result.current.wishlist).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('toggles product addition and removal in wishlist', () => {
    const {result} = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    act(() => {
      result.current.toggleWishlist(sampleProduct);
    });

    expect(result.current.count).toBe(1);
    expect(result.current.isInWishlist(sampleProduct.id)).toBe(true);

    act(() => {
      result.current.toggleWishlist(sampleProduct);
    });

    expect(result.current.count).toBe(0);
    expect(result.current.isInWishlist(sampleProduct.id)).toBe(false);
  });

  it('merges remote items into the local wishlist without duplicating existing ones', () => {
    const {result} = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    act(() => {
      result.current.toggleWishlist(sampleProduct);
    });

    const remoteOnlyProduct = {
      id: 'gid://shopify/Product/200',
      handle: 'solids-hoodie',
      title: 'Solids Hoodie',
    };

    act(() => {
      result.current.mergeWishlist([sampleProduct, remoteOnlyProduct]);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.isInWishlist(sampleProduct.id)).toBe(true);
    expect(result.current.isInWishlist(remoteOnlyProduct.id)).toBe(true);
  });

  it('ignores an empty or missing remote list when merging', () => {
    const {result} = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    act(() => {
      result.current.toggleWishlist(sampleProduct);
    });

    act(() => {
      result.current.mergeWishlist([]);
    });

    expect(result.current.count).toBe(1);
  });

  it('clears all wishlist items', () => {
    const {result} = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    act(() => {
      result.current.toggleWishlist(sampleProduct);
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.clearWishlist();
    });

    expect(result.current.count).toBe(0);
    expect(result.current.wishlist).toEqual([]);
  });
});
