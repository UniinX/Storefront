import {Await, useLoaderData, useOutletContext} from 'react-router';
import {Suspense} from 'react';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Hero} from '~/components/home/Hero.jsx';
import {ProductGrid} from '~/components/home/ProductGrid.jsx';
import {DepartmentBand} from '~/components/home/DepartmentBand.jsx';
import {BrandStory} from '~/components/home/BrandStory.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'UniinX | Clothes in your Language'}];
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
async function loadCriticalData({context}) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {cache: context.storefront.CacheShort()})
    .catch((error) => {
      console.error(error);
      return null;
    });

  const featuredCollections = context.storefront
    .query(HOME_COLLECTIONS_QUERY, {cache: context.storefront.CacheLong()})
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts, featuredCollections};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const {language} = useOutletContext() || {language: 'english'};
  return (
    <>
      <Hero language={language} />
      {data.isShopLinked ? null : (
        <div className="px-6 md:px-14">
          <MockShopNotice />
        </div>
      )}
      <Suspense fallback={null}>
        <Await resolve={data.recommendedProducts}>
          {(response) => (
            <ProductGrid language={language} products={response?.products?.nodes ?? []} />
          )}
        </Await>
      </Suspense>
      <Suspense fallback={null}>
        <Await resolve={data.featuredCollections}>
          {(response) => (
            <DepartmentBand collections={response?.collections?.nodes ?? []} />
          )}
        </Await>
      </Suspense>
      <BrandStory language={language} />
    </>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    availableForSale
    familyValue: metafield(namespace: "custom", key: "family_value") {
      value
    }
    color: metafield(namespace: "custom", key: "color") {
      value
    }
    productFamily: metafield(namespace: "custom", key: "product_family") {
      reference {
        __typename
        ... on Metaobject {
          id
          handle
          type
          name: field(key: "name") { value }
          slug: field(key: "slug") { value }
          products: field(key: "products") {
            references(first: 20) {
              nodes {
                ... on Product {
                  id
                  handle
                  title
                  availableForSale
                  familyValue: metafield(namespace: "custom", key: "family_value") { value }
                  color: metafield(namespace: "custom", key: "color") { value }
                  featuredImage {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const HOME_COLLECTIONS_QUERY = `#graphql
  query HomeCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 1) {
          nodes {
            featuredImage {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
