/**
 * Product-card color bridge.
 *
 * The storefront intentionally ships with the Figma coral as the universal
 * fallback. Add normalized `custom.collection_name` keys to the map below when
 * the collection palette is approved; ProductCard will adopt them without a
 * component rewrite.
 */
export const PRODUCT_CARD_FALLBACK_COLOR = '#f15353';

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
