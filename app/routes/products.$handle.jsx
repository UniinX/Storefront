import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, useLoaderData, useNavigate} from 'react-router';
import {
  CacheShort,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  getSeoMeta,
} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {LANGUAGES} from '~/lib/languages.js';
import {Configurator} from '~/components/product/Configurator';
import {MobileBuyBar} from '~/components/product/MobileBuyBar';
import {ProductGrid} from '~/components/home/ProductGrid.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const product = data?.product;
  const variant = product?.selectedOrFirstAvailableVariant;
  return getSeoMeta({
    title: product?.seo?.title || product?.title,
    description: product?.seo?.description || product?.description,
    url: product ? `/products/${product.handle}` : undefined,
    jsonLd:
      product && variant
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.media?.nodes
              ?.map((media) => media.image?.url)
              .filter(Boolean),
            offers: {
              '@type': 'Offer',
              price: variant.price.amount,
              priceCurrency: variant.price.currencyCode,
              availability: variant.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }
        : undefined,
  });
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData.product.id);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      cache: CacheShort(),
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {product};
}

function loadDeferredData({context}, productId) {
  const recommendedProducts = context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      cache: CacheShort(),
      variables: {productId},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendedProducts} = useLoaderData();
  const navigate = useNavigate();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions ?? []);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Extract language configurations
  const currentMetafields = {};
  for (const mf of product.metafields ?? []) {
    if (mf) currentMetafields[mf.key] = mf.value;
  }
  const currentLangName = currentMetafields['language'] || 'English';
  const matchedLangDs =
    LANGUAGES.find(
      (l) => l.label.toLowerCase() === currentLangName.toLowerCase(),
    ) || LANGUAGES[0];

  const activeLanguage = matchedLangDs;

  // Media preview gallery states
  const mediaNodes = product.media?.nodes ?? [];
  const imagesList = mediaNodes
    .filter((m) => m.__typename === 'MediaImage')
    .map((m) => m.image)
    .filter(Boolean);

  // If no product images exist, fallback to variant image
  if (imagesList.length === 0 && selectedVariant?.image) {
    imagesList.push(selectedVariant.image);
  }

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenCloseRef = useRef(null);
  const fullscreenTriggerRef = useRef(null);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedVariant?.id]);

  useEffect(() => {
    if (!fullscreen) return undefined;

    const fullscreenTrigger = fullscreenTriggerRef.current;
    fullscreenCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      fullscreenTrigger?.focus();
    };
  }, [fullscreen]);

  const activeImage = imagesList[activeImageIdx];

  const familyProducts =
    product.productFamily?.reference?.products?.references?.nodes?.filter(
      (candidate) => candidate.id !== product.id,
    ) ?? [];

  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 text-black sm:px-8 lg:px-[60px] lg:pt-12">
        {/* Back CTA */}
        <button
          onClick={() => navigate('/collections/all')}
          className="mb-6 flex min-h-11 cursor-pointer items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50 transition-colors hover:text-black"
        >
          ← Back to catalog
        </button>

        {/* 2D Split Layout Configurator */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:gap-16">
          {/* Left 2D Preview Pane (70% width) */}
          <div className="flex w-full min-w-0 flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[18px] border border-black/[0.06] bg-[#ececec] lg:aspect-auto lg:h-[calc(100vh-10rem)]">
              {activeImage ? (
                <Image
                  data={activeImage}
                  alt={activeImage.altText || product.title}
                  aspectRatio="4/5"
                  sizes="(min-width: 45em) 720px, 100vw"
                  className={`h-full w-full object-contain transition-transform duration-500 ease-out ${
                    zoomed
                      ? 'scale-[1.18] cursor-zoom-out'
                      : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setZoomed(!zoomed)}
                />
              ) : (
                <div className="uniinx-fabric w-full h-full flex items-center justify-center">
                  <span className="font-work text-xs opacity-40">
                    Garment Preview Template
                  </span>
                </div>
              )}

              {/* Floating Zoom & View Controls */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-30">
                <button
                  type="button"
                  onClick={() => setZoomed(!zoomed)}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/95 font-work text-xs text-black shadow-md transition-all hover:scale-105 active:scale-[0.98] dark:border-white/5 dark:bg-black/95 dark:text-white"
                  title={zoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  🔍
                </button>
                <button
                  ref={fullscreenTriggerRef}
                  type="button"
                  onClick={() => setFullscreen(true)}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-black/5 bg-white/95 font-work text-xs text-black shadow-md transition-all hover:scale-105 active:scale-[0.98] dark:border-white/5 dark:bg-black/95 dark:text-white"
                  title="Fullscreen Preview"
                >
                  ⛶
                </button>
              </div>

              {/* Front / Back selection buttons */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-6 left-6 flex items-center gap-1.5 z-30 bg-white/90 dark:bg-black/90 p-1.5 rounded-full border border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveImageIdx(0)}
                    className={`min-h-11 rounded-full px-4 py-2 font-work text-[9px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeImageIdx === 0
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                        : 'text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIdx(1)}
                    className={`min-h-11 rounded-full px-4 py-2 font-work text-[9px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeImageIdx === 1
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                        : 'text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>

            {/* Swipeable Thumbnails Row */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
                {imagesList.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0 relative transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-brand-accent dark:border-brand-accent-light scale-[1.02] shadow-sm'
                        : 'border-black/10 dark:border-white/10 hover:border-black/25'
                    }`}
                  >
                    <Image
                      data={img}
                      alt={`Preview thumb ${idx}`}
                      className="w-full h-full object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Configuration Panel (30% width) */}
          <div className="w-full min-w-0">
            <Reveal delay={120}>
              <Configurator
                product={product}
                selectedVariant={selectedVariant}
                productOptions={productOptions}
              />
            </Reveal>
          </div>
        </div>

        {/* Fullscreen Modal Overlay */}
        {fullscreen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} fullscreen preview`}
            className="fixed inset-0 bg-black/95 dark:bg-black/98 z-50 flex items-center justify-center p-6 animate-fade-in text-white"
          >
            <button
              ref={fullscreenCloseRef}
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen preview"
              className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/15 cursor-pointer transition-all text-lg font-mono font-light"
            >
              ✕
            </button>

            <div className="relative max-w-2xl max-h-[85vh] aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              {activeImage && (
                <Image
                  data={activeImage}
                  alt={activeImage.altText || product.title}
                  className="w-full h-full object-cover"
                  sizes="(min-width: 45em) 1024px, 100vw"
                />
              )}
            </div>
          </div>
        )}

        {/* Analytics integration */}
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
        <MobileBuyBar
          selectedVariant={selectedVariant}
          language={activeLanguage}
          productOptions={productOptions}
          hasProductFamily={Boolean(product.productFamily?.reference)}
        />
      </section>

      <Suspense fallback={null}>
        <Await resolve={recommendedProducts}>
          {(response) => {
            const recommendations =
              response?.productRecommendations?.filter(
                (candidate) => candidate.id !== product.id,
              ) ?? [];
            const products = recommendations.length
              ? recommendations
              : familyProducts;

            return (
              <ProductGrid
                title="MORE LIKE THIS"
                eyebrow="Continue exploring"
                products={products}
                maxProducts={8}
                ariaLabel="More like this"
                ctaHref="/collections/all"
                ctaLabel="Explore all"
              />
            );
          }}
        </Await>
      </Suspense>
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    media(first: 10) {
      nodes {
        __typename
        ... on MediaImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "design_reference"},
      {namespace: "custom", key: "design_group"},
      {namespace: "custom", key: "language"},
      {namespace: "custom", key: "fit"},
      {namespace: "custom", key: "material"},
      {namespace: "custom", key: "size_guide"},
      {namespace: "custom", key: "garment_type"},
      {namespace: "custom", key: "design_story"}
    ]) {
      key
      value
    }
    familyColor: metafield(namespace: "custom", key: "color") {
      value
    }
    familyValue: metafield(namespace: "custom", key: "family_value") {
      value
    }
    productFamily: metafield(namespace: "custom", key: "product_family") {
      reference {
        __typename
        ... on Metaobject {
          id
          handle
          type
          name: field(key: "name") {
            value
          }
          slug: field(key: "slug") {
            value
          }
          products: field(key: "products") {
            references(first: 50) {
              nodes {
                ... on Product {
                  id
                  title
                  handle
                  availableForSale
                  featuredImage {
                    id
                    url
                    altText
                    width
                    height
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  familyColor: metafield(namespace: "custom", key: "color") {
                    value
                  }
                  familyValue: metafield(namespace: "custom", key: "family_value") {
                    value
                  }
                  options {
                    name
                    optionValues {
                      name
                      swatch {
                        color
                        image {
                          previewImage {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  fragment RelatedProductCard on Product {
    id
    title
    handle
    availableForSale
    productType
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    collections(first: 1) {
      nodes {
        title
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }

  query ProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
      ...RelatedProductCard
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
