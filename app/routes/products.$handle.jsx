import {Suspense} from 'react';
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
import {Breadcrumb} from '~/components/product/Breadcrumb.jsx';
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
        <Breadcrumb productType={product.productType} title={product.title} />

        {/* PDP Layout: Vertical Photos on Left, Sticky Details on Right */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12 xl:gap-16">
          {/* Left: Scrollable Photos (Horizontal Carousel on Mobile, Vertical Stack on Desktop) */}
          <div className="uniinx-horizontal-scroll -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scrollbar-none sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-hidden lg:px-0 lg:pb-0 rounded-[16px] border border-black/[0.06] bg-[#f4f2ee]">
            {imagesList.length > 0 ? (
              imagesList.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="group relative aspect-square w-[86vw] max-w-[420px] shrink-0 snap-center overflow-hidden bg-[#f4f2ee] sm:w-[75vw] lg:w-full lg:max-w-none"
                >
                  <Image
                    data={img}
                    alt={img.altText || `${product.title} view ${idx + 1}`}
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  />
                </div>
              ))
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-[#f4f2ee]">
                <span className="font-work text-xs opacity-40">
                  Garment Preview Template
                </span>
              </div>
            )}
          </div>

          {/* Right: Sticky Details & Configuration Panel */}
          <div className="w-full min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Reveal delay={80}>
              <Configurator
                product={product}
                selectedVariant={selectedVariant}
                productOptions={productOptions}
              />
            </Reveal>
          </div>
        </div>

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

      {/* Row 1: VARIANTS Section (if available) */}
      {familyProducts.length > 0 && (
        <ProductGrid
          title="VARIANTS"
          eyebrow="Available styles & colors"
          products={familyProducts}
          maxProducts={8}
          ariaLabel="Product variants"
          ctaHref="/collections/all"
          ctaLabel="View all"
        />
      )}

      {/* Row 2: MORE LIKE THIS Section */}
      <Suspense fallback={null}>
        <Await resolve={recommendedProducts}>
          {(response) => {
            const recommendations =
              response?.productRecommendations?.filter(
                (candidate) => candidate.id !== product.id,
              ) ?? [];

            if (!recommendations.length) return null;

            return (
              <ProductGrid
                title="MORE LIKE THIS"
                eyebrow="Continue exploring"
                products={recommendations}
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
      {namespace: "custom", key: "design_story"},
      {namespace: "custom", key: "care_instructions"},
      {namespace: "custom", key: "sustainability"}
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
    category { id name }
    collections(first: 10) {
      nodes {
        id
        handle
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
