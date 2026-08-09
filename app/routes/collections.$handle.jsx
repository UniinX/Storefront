import {useLoaderData} from 'react-router';
import {Analytics, CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ds/index.js';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {getCatalogFilterOptions, getCatalogSort, getCollectionFilters, getProductSearchQuery, groupCatalogFamilies, matchesDepartment} from '~/lib/catalog';

export const meta = ({data}) => [{title: `UniinX | ${data?.collection.title ?? 'Collection'}`}];

export async function loader({context, params, request}) {
  const {handle} = params;
  if (!handle) throw new Response('Collection handle is required', {status: 404});

  const url = new URL(request.url);
  const selected = {
    type: url.searchParams.get('type'), theme: url.searchParams.get('theme'),
    language: url.searchParams.get('language'), color: url.searchParams.get('color'),
    collection: url.searchParams.get('collection'),
  };
  const variables = {
    handle,
    ...getPaginationVariables(request, {pageBy: 12}),
    ...getCatalogSort(url.searchParams.get('sort') || 'featured', true),
    filters: getCollectionFilters(selected),
  };
  let {collection} = await context.storefront.query(COLLECTION_QUERY, {variables, cache: CacheShort()});
  const isDepartment = ['men', 'women', 'accessories'].includes(handle);

  if (!collection && isDepartment) {
    const query = getProductSearchQuery({...selected, collection: selected.collection || handle, q: url.searchParams.get('q')});
    const fallback = await context.storefront.query(CATALOG_PRODUCTS_QUERY, {
      variables: {...getPaginationVariables(request, {pageBy: 12}), ...getCatalogSort(url.searchParams.get('sort') || 'featured'), query},
      cache: CacheShort(),
    });
    const nodes = (fallback.products?.nodes ?? []).filter((product) => matchesDepartment(product, handle));
    collection = {id: `virtual-collection-${handle}`, handle, title: handle[0].toUpperCase() + handle.slice(1), description: '', products: {...fallback.products, nodes}};
  }

  if (!collection) throw new Response(`Collection ${handle} not found`, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // Shopify collection connections cannot text-search. Keep the URL contract while
  // limiting the fallback to the already cursor-paginated page.
  const search = url.searchParams.get('q')?.toLowerCase();
  const rawProducts = search
    ? {...collection.products, nodes: collection.products.nodes.filter((product) => product.title.toLowerCase().includes(search) || product.tags.some((tag) => tag.toLowerCase().includes(search)))}
    : collection.products;
  const products = groupCatalogFamilies(rawProducts);

  return {
    collection,
    products,
    filterOptions: getCatalogFilterOptions(collection.products),
    totalCount: products.nodes.length,
    hasMoreResults: Boolean(products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage),
  };
}

export default function Collection() {
  const {collection, products, filterOptions, totalCount, hasMoreResults} = useLoaderData();
  return (
    <section className="px-6 md:px-14 py-28 max-w-6xl mx-auto flex flex-col gap-10 text-black dark:text-white">
      <div>
        <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">Theme Collection</span>
        <h1 className="font-marcellus text-4xl uppercase font-light">{collection.title}</h1>
        {collection.description && <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1 max-w-lg">{collection.description}</p>}
      </div>
      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />
      <CatalogFilters totalCount={totalCount} hasMoreResults={hasMoreResults} filterOptions={filterOptions} currentCollection={collection.handle} />
      {totalCount === 0 ? (
        <div className="py-20 border border-dashed border-black/10 dark:border-white/10 text-center flex flex-col items-center justify-center gap-3">
          <span className="font-marcellus text-lg text-black/60 dark:text-white/50">No products match selected filters in this collection</span>
          <span className="font-work text-xs text-black/40 dark:text-white/40">Try adjusting your search criteria, script filter, or color options.</span>
        </div>
      ) : (
        <PaginatedResourceSection connection={products} resourcesClassName="uniinx-product-grid" previousClassName="uniinx-plp-pagination-link font-work text-xs rounded-full border border-black/10 px-6 py-3" nextClassName="uniinx-plp-pagination-link font-work text-xs rounded-full border border-black/10 px-6 py-3">
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
              revealDelay={Math.min(index, 8) * 0.06}
            />
          )}
        </PaginatedResourceSection>
      )}
      <Analytics.CollectionView data={{collection: {id: collection.id, handle: collection.handle}}} />
    </section>
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
