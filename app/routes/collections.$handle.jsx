import {useLoaderData, useRouteLoaderData} from 'react-router';
import {Analytics, CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ds/index.js';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';
import {
  FALLBACK_COLLECTION_THEMES,
  getCollectionThemeStyle,
  uniqueThemeNames,
} from '~/lib/collectionTheme.js';
import {
  getCatalogFilterOptions,
  getCatalogSort,
  getCollectionFilters,
  getProductSearchQuery,
  groupCatalogFamilies,
  matchesDepartment,
} from '~/lib/catalog';

export const meta = ({data}) => [
  {title: `UniinX | ${data?.collection.title ?? 'Collection'}`},
];

export async function loader({context, params, request}) {
  const {handle} = params;
  if (!handle)
    throw new Response('Collection handle is required', {status: 404});

  const url = new URL(request.url);
  const selected = {
    type: url.searchParams.get('type'),
    theme: url.searchParams.get('theme'),
    language: url.searchParams.get('language'),
    color: url.searchParams.get('color'),
    collection: url.searchParams.get('collection'),
  };
  const variables = {
    handle,
    ...getPaginationVariables(request, {pageBy: 12}),
    ...getCatalogSort(url.searchParams.get('sort') || 'featured', true),
    filters: getCollectionFilters(selected),
  };
  let {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables,
    cache: CacheShort(),
  });
  const isDepartment = ['men', 'women', 'accessories'].includes(handle);

  if (!collection && isDepartment) {
    const query = getProductSearchQuery({
      ...selected,
      collection: selected.collection || handle,
      q: url.searchParams.get('q'),
    });
    const fallback = await context.storefront.query(CATALOG_PRODUCTS_QUERY, {
      variables: {
        ...getPaginationVariables(request, {pageBy: 12}),
        ...getCatalogSort(url.searchParams.get('sort') || 'featured'),
        query,
      },
      cache: CacheShort(),
    });
    const nodes = (fallback.products?.nodes ?? []).filter((product) =>
      matchesDepartment(product, handle),
    );
    collection = {
      id: `virtual-collection-${handle}`,
      handle,
      title: handle[0].toUpperCase() + handle.slice(1),
      description: '',
      products: {...fallback.products, nodes},
    };
  }

  if (!collection)
    throw new Response(`Collection ${handle} not found`, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // Shopify collection connections cannot text-search. Keep the URL contract while
  // limiting the fallback to the already cursor-paginated page.
  const search = url.searchParams.get('q')?.toLowerCase();
  const rawProducts = search
    ? {
        ...collection.products,
        nodes: collection.products.nodes.filter(
          (product) =>
            product.title.toLowerCase().includes(search) ||
            product.tags.some((tag) => tag.toLowerCase().includes(search)),
        ),
      }
    : collection.products;
  const products = groupCatalogFamilies(rawProducts);

  return {
    collection,
    products,
    filterOptions: getCatalogFilterOptions(collection.products),
    selectedTheme: url.searchParams.get('theme') || '',
    totalCount: products.nodes.length,
    hasMoreResults: Boolean(
      products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage,
    ),
  };
}

export default function Collection() {
  const {
    collection,
    products,
    filterOptions,
    totalCount,
    hasMoreResults,
    selectedTheme,
  } = useLoaderData();
  const rootData = useRouteLoaderData('root');
  const themes = uniqueThemeNames([
    ...filterOptions.themes,
    ...(rootData?.megaMenuProducts ?? []).map(
      (product) => product.collectionName?.value,
    ),
    ...FALLBACK_COLLECTION_THEMES,
  ]);
  const visualTheme = selectedTheme || collection.title;
  return (
    <div
      style={getCollectionThemeStyle(visualTheme)}
      className="bg-[var(--collection-page,#f5f1ea)]"
    >
      <CollectionThemeHero
        title={collection.title}
        activeTheme={selectedTheme}
        themes={themes}
        description={collection.description || undefined}
      />
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-24 pt-14 text-black sm:px-8 lg:px-[60px] lg:pt-20">
        <CatalogFilters
          totalCount={totalCount}
          hasMoreResults={hasMoreResults}
          filterOptions={filterOptions}
          currentCollection={collection.handle}
          hideTheme
        />
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-black/15 bg-white/50 py-20 text-center">
            <span className="text-lg text-black/60">
              No products match this theme and filter combination
            </span>
            <span className="text-xs text-black/45">
              Swipe to another theme or adjust the product filters.
            </span>
          </div>
        ) : (
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="uniinx-product-grid"
            autoLoadNext
            previousClassName="uniinx-plp-pagination-link font-work text-xs rounded-full border border-black/10 px-6 py-3"
            nextClassName="uniinx-plp-pagination-link font-work text-xs rounded-full border border-black/10 px-6 py-3"
          >
            {({node: product, index}) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
                revealDelay={0}
              />
            )}
          </PaginatedResourceSection>
        )}
        <Analytics.CollectionView
          data={{collection: {id: collection.id, handle: collection.handle}}}
        />
      </section>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 { amount currencyCode }
  fragment FamilyMemberProductItem on Product {
    id handle title availableForSale
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    featuredImage { id altText url width height }
  }
  fragment ProductItem on Product {
    id handle title productType publishedAt tags availableForSale
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    language: metafield(namespace: "custom", key: "language") { value }
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    productFamily: metafield(namespace: "custom", key: "product_family") { reference { __typename ... on Metaobject {
      id handle type name: field(key: "name") { value } slug: field(key: "slug") { value }
      products: field(key: "products") { references(first: 20) { nodes { ...FamilyMemberProductItem } } }
    } } }
    variants(first: 10) { nodes { selectedOptions { name value } } }
    featuredImage { id altText url width height }
    collections(first: 2) { nodes { title } }
    priceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
    compareAtPriceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection($handle: String!, $country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys, $reverse: Boolean) @inContext(country: $country, language: $language) {
    collection(handle: $handle) { id handle title description products(first: $first, last: $last, before: $startCursor, after: $endCursor, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
      nodes { ...ProductItem } filters { id label type values { id label count input } } pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    } }
  }
`;

const CATALOG_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query CatalogProducts($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query, sortKey: $sortKey, reverse: $reverse) { nodes { ...ProductItem } filters { id label type values { id label count input } } pageInfo { hasPreviousPage hasNextPage startCursor endCursor } }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
