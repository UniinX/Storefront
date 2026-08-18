/**
 * Product-card color bridge.
 *
 * Product imagery sits on a neutral stone surface by default. Add normalized
 * `custom.collection_name` keys only when a collection-specific card surface
 * is deliberately approved.
 */
export const PRODUCT_CARD_FALLBACK_COLOR = '#f0ede7';

export const PRODUCT_CARD_COLLECTION_COLORS = Object.freeze({
  // Example future mappings:
  // solids: '#d9d9d9',
  // antariksham: '#233c6b',
});

export function normalizeCollectionName(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getProductCollectionName(product) {
  return (
    product?.collectionName?.value ||
    product?.collections?.nodes?.[0]?.title ||
    ''
  );
}

export function resolveProductCardColor(
  product,
  collectionColors = PRODUCT_CARD_COLLECTION_COLORS,
) {
  const collectionKey = normalizeCollectionName(
    getProductCollectionName(product),
  );
  return collectionColors[collectionKey] || PRODUCT_CARD_FALLBACK_COLOR;
}
