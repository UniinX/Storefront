/**
 * @file Product detail page — composes ProductGallery, ProductInfo,
 * ProductAccordions, RelatedProducts and MobileBuyBar around real Shopify
 * product/variant data, in Kaft.com's PDP layout (scrolling gallery +
 * sticky info panel, accordions and related products below the fold).
 */
import {useState} from 'react';
import {useLoaderData, useNavigate} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {LANGUAGES} from '~/components/ds/index.js';
import {Breadcrumb} from '~/components/product/Breadcrumb.jsx';
import {ProductGallery} from '~/components/product/ProductGallery.jsx';
import {ProductInfo} from '~/components/product/ProductInfo.jsx';
import {ProductAccordions} from '~/components/product/ProductAccordions.jsx';
import {RelatedProducts} from '~/components/product/RelatedProducts.jsx';
import {MobileBuyBar} from '~/components/product/MobileBuyBar.jsx';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `UniinX | ${data?.product.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  // Recommendations need the product's real id, which only exists once the
  // critical query above has resolved — kicked off here but not awaited, so
  // it streams in after first paint instead of blocking the response.
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
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

/**
 * Related products stream in after first paint — a failed/slow
 * recommendations call shouldn't hold up or break the PDP, so a rejected
 * fetch resolves to an empty list instead of throwing.
 * @param {Route.LoaderArgs} args
 * @param {string} productId
 */
function loadDeferredData({context}, productId) {
  const {storefront} = context;
  const recommendations = storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {variables: {productId}})
    .then(({productRecommendations}) => productRecommendations ?? [])
    .catch(() => []);

  return {recommendations};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendations} = useLoaderData();
  const navigate = useNavigate();
  const [languageId, setLanguageId] = useState(LANGUAGES[0].id);
  const language = LANGUAGES.find((l) => l.id === languageId);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <section style={{padding: '48px var(--space-xl) 140px'}}>
      <button onClick={() => navigate(-1)}
        style={{background: 'none', border: 'none', cursor: 'pointer', padding: '13px 0', minHeight: 44, display: 'flex', alignItems: 'center', marginBottom: 20, fontFamily: 'var(--font-work-sans)', fontSize: 'var(--uniinx-cta-size)', letterSpacing: 'var(--uniinx-tracking-tight)', color: 'var(--ink)'}}>
        ← Back
      </button>
      <Breadcrumb productType={product.productType} title={product.title} />
      <div className="uniinx-pdp-layout">
        <Reveal>
          <ProductGallery image={selectedVariant?.image} images={product.images?.nodes} language={language} />
        </Reveal>
        <Reveal delay={90}>
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            productOptions={productOptions}
            languageId={languageId}
            setLanguageId={setLanguageId}
            activeLanguage={language}
          />
        </Reveal>
      </div>
      <div style={{marginTop: 48, maxWidth: 700}}>
        <ProductAccordions product={product} />
      </div>
      <div style={{marginTop: 64}}>
        <RelatedProducts recommendations={recommendations} />
      </div>
      <MobileBuyBar selectedVariant={selectedVariant} language={language} />
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
    </section>
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
    tags
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    material: metafield(namespace: "custom", key: "material") {
      value
    }
    careInstructions: metafield(namespace: "custom", key: "care_instructions") {
      value
    }
    sustainability: metafield(namespace: "custom", key: "sustainability") {
      value
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
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
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
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
