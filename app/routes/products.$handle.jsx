/**
 * @file Product detail page — composes ProductImage, ProductInfo, MobileBuyBar
 * around real Shopify product/variant data.
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
import {ProductImage} from '~/components/product/ProductImage.jsx';
import {ProductInfo} from '~/components/product/ProductInfo.jsx';
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
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
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

function loadDeferredData() {
  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
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
      <div className="uniinx-pdp-layout">
        <Reveal>
          <ProductImage image={selectedVariant?.image} language={language} />
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
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
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

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
