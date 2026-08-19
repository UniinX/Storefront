/**
 * @file Parses a product's `descriptionHtml` into structured story / facts /
 * care content. Real UniinX product descriptions follow one of two
 * merchant-authored templates (checked against live product data):
 *
 *  1. Rich text: an intro paragraph, then a bold "Product Details" heading
 *     followed by a bullet list, then a bold "Wash Care" heading with a
 *     `<br>`-separated care line.
 *  2. Plain text: `\n\n`-separated paragraphs, each starting with a label
 *     like "Fabric:", "Fit:", "Features:", "Care:".
 *
 * Neither is guaranteed — a product with no recognizable structure returns
 * `null` so the caller can fall back to the plain description text instead
 * of guessing at a shape that isn't there.
 */

const HTML_BLOCK_RE = /<p>[\s\S]*?<\/p>|<ul>[\s\S]*?<\/ul>/g;
const LI_RE = /<li>[\s\S]*?<\/li>/g;
const BOLD_HEADING_RE =
  /^<p>\s*<strong>([^<]+)<\/strong>\s*(?:<br\s*\/?>([\s\S]*))?<\/p>$/i;

const DETAILS_HEADINGS = ['product details', 'details', 'features', 'highlights'];
const CARE_HEADINGS = ['wash care', 'care', 'care instructions', 'washing instructions'];
// Deliberately narrower than DETAILS_HEADINGS: a "Product Details" *heading*
// followed by a bullet list is genuinely structured (each bullet is a short
// spec), but a plain-text "Features: <paragraph>" label is prose — it reads
// better folded into the story than crammed into a spec-sheet value cell.
const DETAILS_LABELS = ['fabric', 'material', 'fit'];
const CARE_LABELS = ['care', 'wash care', 'washing instructions'];
const LABEL_LINE_RE = /^([A-Za-z][A-Za-z /]{1,20}):\s*([\s\S]+)$/;

function decodeEntities(text) {
  return text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
}

// Strips tags and collapses each block down to a single line — used once a
// block's boundaries are already known (a <li>, a heading's own <p>), where
// any blank lines inside it are just formatting noise, not meaningful
// paragraph breaks.
function stripTags(html) {
  return decodeEntities(
    html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

// Strips tags but preserves blank lines — used to prep raw content for the
// plain-text parser, which relies on `\n\n` to tell paragraphs apart.
// Stripping tags is still worthwhile here as a safety net in case a
// "plain text" description has the odd stray inline tag in it.
function stripTagsPreservingParagraphs(html) {
  return decodeEntities(
    html.replace(/<br\s*\/?>/gi, '\n\n').replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseHtmlDescription(html) {
  const blocks = html.match(HTML_BLOCK_RE);
  if (!blocks || blocks.length === 0) return null;

  const introParts = [];
  const facts = [];
  const careLines = [];
  let mode = 'intro';
  let matchedAnyHeading = false;

  for (const block of blocks) {
    if (block.startsWith('<ul')) {
      const items = block.match(LI_RE) || [];
      for (const item of items) {
        const text = stripTags(item);
        if (text) facts.push({label: null, value: text});
      }
      continue;
    }

    const headingMatch = block.match(BOLD_HEADING_RE);
    if (headingMatch) {
      const label = stripTags(headingMatch[1]).toLowerCase();
      if (DETAILS_HEADINGS.includes(label)) {
        mode = 'details';
        matchedAnyHeading = true;
        continue;
      }
      if (CARE_HEADINGS.includes(label)) {
        mode = 'care';
        matchedAnyHeading = true;
        const inline = headingMatch[2] ? stripTags(headingMatch[2]) : '';
        if (inline) careLines.push(inline);
        continue;
      }
      if (mode === 'intro' && introParts.length === 0) {
        // A standalone bold line before any real content is almost always
        // just the product name repeated — redundant with the page's own
        // <h1>, so it's dropped rather than shown twice.
        continue;
      }
    }

    const text = stripTags(block);
    if (!text) continue;
    if (mode === 'intro') introParts.push(text);
    else if (mode === 'care') careLines.push(text);
    else if (mode === 'details') facts.push({label: null, value: text});
  }

  if (!matchedAnyHeading) return null;

  return {intro: introParts.join(' ').trim() || null, facts, careLines};
}

function parsePlainTextDescription(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length < 2) return null;

  const introParts = [];
  const facts = [];
  const careLines = [];
  let matchedAnyLabel = false;

  for (const paragraph of paragraphs) {
    const match = paragraph.match(LABEL_LINE_RE);
    if (!match) {
      introParts.push(paragraph);
      continue;
    }
    const rawLabel = match[1].trim();
    const label = rawLabel.toLowerCase();
    const value = match[2].trim();
    if (CARE_LABELS.includes(label)) {
      careLines.push(value);
      matchedAnyLabel = true;
    } else if (DETAILS_LABELS.includes(label)) {
      facts.push({label: capitalize(rawLabel), value});
      matchedAnyLabel = true;
    } else {
      introParts.push(paragraph);
    }
  }

  if (!matchedAnyLabel) return null;
  return {intro: introParts.join(' ').trim() || null, facts, careLines};
}

/**
 * @param {string} [descriptionHtml]
 * @returns {{intro: string|null, facts: Array<{label: string|null, value: string}>, careLines: string[]}|null}
 */
export function parseProductDescription(descriptionHtml) {
  if (!descriptionHtml) return null;
  return (
    parseHtmlDescription(descriptionHtml) ||
    parsePlainTextDescription(stripTagsPreservingParagraphs(descriptionHtml))
  );
}

/**
 * Best-effort label for a fact bullet that has no explicit label (the rich
 * text template's bullets are unlabeled, e.g. "100% Cotton", "Crew neck").
 * Returns null when nothing is recognizable, so the caller can still show
 * the bullet, just without a dt/dd label pairing.
 */
export function guessFactLabel(value) {
  if (/^\d+%/.test(value)) return 'Fabric';
  if (/\bgsm\b/i.test(value)) return 'GSM';
  if (/\bfit\b/i.test(value)) return 'Fit';
  if (/\bneck\b/i.test(value)) return 'Neck';
  if (/\bsleeves?\b/i.test(value)) return 'Sleeves';
  return null;
}
