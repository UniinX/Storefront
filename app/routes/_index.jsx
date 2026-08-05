import {Await, useLoaderData} from 'react-router';
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
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <>
      <Hero />
      {data.isShopLinked ? null : (
        <div className="px-6 md:px-14">
          <MockShopNotice />
        </div>
      )}
      <Suspense fallback={null}>
        <Await resolve={data.recommendedProducts}>
          {(response) => (
            <ProductGrid products={response?.products?.nodes ?? []} />
          )}
        </Await>
      </Suspense>
      <DepartmentBand />
      <BrandStory />
    </>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
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
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
