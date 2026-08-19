/**
 * @file Below-the-hero PDP content. A two-column layout when there's real
 * media to show (product video when Shopify has one, otherwise a
 * supporting photo — never fabricated): media sits on one side (sticky on
 * desktop), and every piece of product data — the fabric/fit intro, every
 * detail accordion, and the help links — lives together as one collapsible
 * column on the other side. Falls back to a single column when there's no
 * media.
 *
 * The fabric intro is built from `parseProductDescription`, which turns the
 * merchant's free-form descriptionHtml (a story paragraph + a "Product
 * Details" bullet list + a "Wash Care" note, or a plain "Label: value"
 * format — both seen in real product data) into a clean spec sheet instead
 * of dumping raw HTML. Metafields win over parsed content when both exist.
 *
 * Reference data (SKU, vendor, design reference/group, language) is real
 * and useful, but it's not what a shopper needs to decide whether to buy —
 * it sits in its own accordion at the *end* of the list, after everything
 * a buyer actually needs (fit, care, sizing, returns).
 *
 * Every accordion always renders, even when its metafield is empty, with a
 * placeholder line instead — so filling in a metafield later in Shopify
 * admin makes it appear with no code changes.
 */
import {Link} from 'react-router';
import {useReducedMotion} from 'framer-motion';
import {Image} from '@shopify/hydrogen';
import {getMetafieldMap} from '~/lib/productDisplay.js';
import {orderSizeGuideLines} from '~/lib/sizing.js';
import {guessFactLabel, parseProductDescription} from '~/lib/productDescription.js';
import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion.jsx';

const EMPTY_VALUE = '—';
const SPEC_LABELS = ['Fabric', 'GSM', 'Fit', 'Neck', 'Sleeves'];

function placeholderCopy(label) {
  return `${label} will appear here once added.`;
}

/**
 * Merges metafields (authoritative when set) with the description's parsed
 * facts into a short spec sheet, plus a leftover "other" list for anything
 * that doesn't map to a known spec (e.g. "Double-stitched construction").
 */
function buildFabricSpec({fit, material, facts}) {
  const spec = {Fabric: material || null, GSM: null, Fit: fit || null, Neck: null, Sleeves: null};
  const other = [];

  for (const {label, value} of facts) {
    const key = label && SPEC_LABELS.includes(label) ? label : guessFactLabel(value);
    if (key && !spec[key]) {
      spec[key] = value;
    } else if (!key) {
      other.push(value);
    }
  }

  return {
    entries: SPEC_LABELS.map((label) => [label, spec[label]]).filter(([, v]) => v),
    other,
  };
}

export function ProductDetails({product, selectedVariant, media = []}) {
  const metafields = getMetafieldMap(product.metafields);
  const parsed = parseProductDescription(product.descriptionHtml);

  const {entries: specEntries, other: otherFacts} = buildFabricSpec({
    fit: metafields.fit,
    material: metafields.material,
    facts: parsed?.facts ?? [],
  });
  const introText = parsed?.intro || product.description || null;
  const hasFabricIntro = Boolean(introText || specEntries.length);

  const designStory = metafields.design_story;
  const careInstructions =
    metafields.care_instructions ||
    (parsed?.careLines?.length ? parsed.careLines.join(' ') : null);
  const sustainability = metafields.sustainability;
  const orderedSizeGuide = metafields.size_guide
    ? orderSizeGuideLines(metafields.size_guide).join('\n')
    : null;

  const video = media.find((node) => node.__typename === 'Video');
  const galleryImages = media
    .filter((node) => node.__typename === 'MediaImage')
    .map((node) => node.image)
    .filter(Boolean);
  // A second photo (not the primary) to keep the intro visually paired,
  // only used when there's no real video for this product.
  const supportingImage = video ? null : galleryImages[1];
  const hasMedia = Boolean(video || supportingImage);

  // Reference data — real, but not what a buyer needs to decide. It gets
  // its own accordion at the end of the list rather than the top.
  const referenceFacts = [
    ['SKU', selectedVariant?.sku],
    ['Vendor', product.vendor],
    ['Design reference', metafields.design_reference],
    ['Design group', metafields.design_group],
    ['Language', metafields.language],
  ];

  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-10 sm:px-8 lg:px-[60px]">
      <div
        className={`grid grid-cols-1 gap-8 border-t border-black/[0.07] py-12 lg:gap-16 ${hasMedia ? 'lg:grid-cols-2' : ''}`}
      >
        {hasMedia && (
          <div className="aspect-[4/5] w-full overflow-hidden bg-[#f4f2ee] lg:order-2 lg:sticky lg:top-24 lg:self-start">
            {video ? (
              <ProductVideo video={video} />
            ) : (
              <Image
                data={supportingImage}
                aspectRatio="4/5"
                alt={
                  supportingImage.altText ||
                  (product.title ? `${product.title} — fabric detail` : '')
                }
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}

        {/* Every piece of product data lives together in this one column,
            so it reads as a single collapsible list next to the media
            rather than being split across separate blocks. */}
        <div className="flex flex-col gap-4 lg:order-1">
          {hasFabricIntro && (
            <>
              <h2 className="font-marcellus text-2xl">Fabric Quality & Fit</h2>
              {introText && (
                <p className="text-sm leading-relaxed text-black/60">{introText}</p>
              )}
              {specEntries.length > 0 && (
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                  {specEntries.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-[11px] uppercase tracking-wide text-black/40">
                        {label}
                      </dt>
                      <dd className="text-black/70">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {otherFacts.length > 0 && (
                <p className="text-xs text-black/45">{otherFacts.join(' · ')}</p>
              )}
            </>
          )}

          <div className={hasFabricIntro ? 'mt-2 border-t border-black/5' : ''}>
            <ProductAccordion
              title="Print & Design Details"
              content={designStory || placeholderCopy('Design story details')}
            />
            <ProductAccordion
              title="Size & Measurements"
              content={orderedSizeGuide || placeholderCopy('The size chart')}
              preserveLines
            />
            <ProductAccordion
              title="Care Instructions"
              content={careInstructions || placeholderCopy('Care instructions')}
              preserveLines
            />
            <ProductAccordion
              title="Sustainability"
              content={sustainability || placeholderCopy('Sustainability details')}
              preserveLines
            />
            <ProductAccordion
              title="Delivery & Returns"
              content="Delivery estimates and return eligibility are shown at checkout and in the store policies."
            />
            <ProductAccordion title="Product Reference">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                {referenceFacts.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-black/40 uppercase tracking-wide">
                      {label}
                    </dt>
                    <dd className="text-black/60">{value || EMPTY_VALUE}</dd>
                  </div>
                ))}
              </dl>
            </ProductAccordion>
          </div>

          <nav
            aria-label="Product help"
            className="flex flex-wrap gap-x-5 gap-y-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50"
          >
            <Link
              to="/pages/size-care"
              className="underline underline-offset-4 hover:text-black"
            >
              Size & care
            </Link>
            <Link
              to="/pages/shipping-returns"
              className="underline underline-offset-4 hover:text-black"
            >
              Shipping & returns
            </Link>
            <Link
              to="/pages/contact"
              className="underline underline-offset-4 hover:text-black"
            >
              Ask the studio
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

function ProductVideo({video}) {
  const reduceMotion = useReducedMotion();
  const source =
    video.sources?.find((s) => s.mimeType === 'video/mp4') ||
    video.sources?.[0];
  if (!source) return null;

  return (
    <video
      className="h-full w-full object-cover"
      src={source.url}
      poster={video.previewImage?.url}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      controls={reduceMotion}
    />
  );
}

function ProductAccordion({title, content, children, preserveLines = false}) {
  return (
    <AccordionRoot type="single" collapsible>
      <AccordionItem value={title} className="border-black/5">
        <AccordionTrigger className="min-h-0 py-4 font-marcellus text-xs uppercase tracking-wider text-black/75 hover:text-black">
          {title}
        </AccordionTrigger>
        <AccordionContent
          className={`text-xs font-light leading-relaxed text-black/50 ${preserveLines ? 'whitespace-pre-line' : ''}`}
        >
          {children ?? content}
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
