const SIZE_ORDER = [
  'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '3XL', '4XL', '5XL', '6XL', 'ONE SIZE',
];

const SIZE_ALIASES = {
  '2XS': 'XXS',
  '2XL': 'XXL',
  XXXL: '3XL',
  XXXXL: '4XL',
  XXXXXL: '5XL',
  OS: 'ONE SIZE',
  OSFA: 'ONE SIZE',
  ONESIZE: 'ONE SIZE',
};

function normalizeSize(value) {
  const compact = String(value ?? '').trim().toUpperCase().replace(/[\s_-]+/g, '');
  return SIZE_ALIASES[compact] ?? compact;
}

function sizeRank(value, fallbackIndex) {
  const normalized = normalizeSize(value);
  const namedIndex = SIZE_ORDER.findIndex(
    (size) => normalizeSize(size) === normalized,
  );
  if (namedIndex >= 0) return namedIndex;

  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) return 100 + numeric;

  return 10_000 + fallbackIndex;
}

export function sortSizes(values = [], getLabel = (value) => value) {
  return values
    .map((value, index) => ({value, index}))
    .sort((a, b) => {
      const rankDifference =
        sizeRank(getLabel(a.value), a.index) -
        sizeRank(getLabel(b.value), b.index);
      return rankDifference || a.index - b.index;
    })
    .map(({value}) => value);
}

const LEADING_SIZE = /^(XXS|2XS|XS|S|M|L|XL|XXL|2XL|XXXL|3XL|4XL|5XL|6XL|OSFA|OS|ONE\s+SIZE|\d+)\b/i;

export function orderSizeGuideLines(content = '') {
  const lines = String(content)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim());

  const firstSizeRow = lines.findIndex((line) => LEADING_SIZE.test(line.trim()));
  if (firstSizeRow < 0) return lines;

  const prefix = lines.slice(0, firstSizeRow);
  const sizeRows = lines.slice(firstSizeRow);
  if (!sizeRows.every((line) => LEADING_SIZE.test(line.trim()))) return lines;

  return [
    ...prefix,
    ...sortSizes(sizeRows, (line) => line.trim().match(LEADING_SIZE)?.[1] ?? ''),
  ];
}

