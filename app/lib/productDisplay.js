/** @file Small product-display helpers shared across PDP and catalog components. */

export function isNewProduct(tags) {
  return Boolean(tags?.some((tag) => tag.toLowerCase() === 'new'));
}

function flattenRichTextNode(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  if (!Array.isArray(node.children)) return '';

  const inner = node.children.map(flattenRichTextNode).join('');
  if (node.type === 'paragraph' || node.type === 'heading') return `${inner}\n\n`;
  if (node.type === 'list-item') return `• ${inner}\n`;
  return inner;
}

/**
 * Shopify's "Rich text" metafield type stores content as a JSON AST
 * (`{type: "root", children: [...]}`), not plain text — a merchant can
 * define a field like `design_story` as either a plain single-line field or
 * a rich text field, and the two look identical from the schema alone.
 * Detects the rich-text shape and flattens it to readable plain text; any
 * value that isn't valid JSON, or doesn't match that shape, is returned
 * unchanged since it's already plain text.
 */
export function parseRichTextMetafield(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{')) return value;

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return value;
  }

  if (!parsed || parsed.type !== 'root' || !Array.isArray(parsed.children)) {
    return value;
  }

  return flattenRichTextNode(parsed).trim();
}

/** Flattens a product's `metafields(identifiers: [...])` array into a {key: value} lookup. */
export function getMetafieldMap(metafields) {
  const map = {};
  for (const mf of metafields ?? []) {
    if (mf) map[mf.key] = parseRichTextMetafield(mf.value);
  }
  return map;
}
