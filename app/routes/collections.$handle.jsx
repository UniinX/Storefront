import {useLoaderData} from 'react-router';
import {Analytics, CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ds/index.js';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';
import {useVisibleCatalogCount} from '~/hooks/useVisibleCatalogCount.js';
import {
  applyClientFilters,
  CLIENT_FILTER_BATCH_SIZE,
  getCatalogFilterOptions,
  getCatalogSort,
  getCollectionFilters,
  getProductFamilyKey,
  getProductSearchQuery,
  groupCatalogFamilies,
  hasClientOnlyFilters,
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
    size: url.searchParams.get('size'),
    collection: url.searchParams.get('collection'),
    q: url.searchParams.get('q'),
  };
  // Theme/language/color/size (and free-text q) aren't reliably filterable
  // Whatever isn't in STOREFRONT_NATIVE_FILTER_SUPPORT is fetched as a
  // larger, unfiltered batch and narrowed client-side below instead of
  // relying on `filters:` to do it — `collection.products(filters:)` does
  // support typed ProductFilters (unlike the department-fallback query
  // below), so this one respects the native-support flags.
  const clientFiltering = hasClientOnlyFilters(selected);
  const variables = {
    handle,
    ...(clientFiltering
      ? {first: CLIENT_FILTER_BATCH_SIZE}
      : getPaginationVariables(request, {pageBy: 12})),
    ...getCatalogSort(url.searchParams.get('sort') || 'featured', true),
    filters: getCollectionFilters(selected),
  };
  let {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables,
    cache: CacheShort(),
  });
  const isDepartment = ['men', 'women', 'accessories'].includes(handle);
  let usedDepartmentFallback = false;

  if (!collection && isDepartment) {
    usedDepartmentFallback = true;
    const query = getProductSearchQuery({
      type: selected.type,
      collection: selected.collection || handle,
    });
    const fallback = await context.storefront.query(CATALOG_PRODUCTS_QUERY, {
      variables: {
        first: CLIENT_FILTER_BATCH_SIZE,
        ...getCatalogSort(url.searchParams.get('sort') || 'featured'),
        query,
      },
      cache: CacheShort(),
    });
    // Department ("men"/"women"/"accessories") isn't a real Shopify
    // collection, so there's no server connection to narrow further — scope
    // to department membership only here (matching how the real-collection
    // branch below only has its plain, un-attribute-filtered batch at this
    // point). Theme/language/color/size/q are applied afterwards, uniformly
    // with the real-collection path, so facet options stay computed from the
    // same "department, not yet attribute-filtered" set either way.
    const nodes = fallback.products.nodes.filter((product) =>
      matchesDepartment(product, handle),
    );
    collection = {
      id: `virtual-collection-${handle}`,
      handle,
      title: handle[0].toUpperCase() + handle.slice(1),
      description: '',
      products: {
        ...fallback.products,
        nodes,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      },
    };
  }

  if (!collection)
    throw new Response(`Collection ${handle} not found`, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // The department-fallback branch above only ever used the top-level
  // `products(query:)` field, which has no typed-filter argument — so
  // unlike the real-collection path above, it must always client-match any
  // selected attribute here, regardless of STOREFRONT_NATIVE_FILTER_SUPPORT.
  const finalClientFiltering = usedDepartmentFallback
    ? hasClientOnlyFilters(selected, {typedFiltersAvailable: false})
    : clientFiltering;
  const scopedProducts = finalClientFiltering
    ? applyClientFilters(collection.products, selected)
    : collection.products;
  const products = groupCatalogFamilies(scopedProducts);

  return {
    collection,
    products,
    filterOptions: getCatalogFilterOptions(collection.products),
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
  } = useLoaderData();
  // The loader only ever sees its own single fetched page — the visible
  // count needs to track what <PaginatedResourceSection> has actually
  // accumulated (and de-duped) across every page loaded so far.
  const [visible, onVisibleCountChange] = useVisibleCatalogCount(
    totalCount,
    hasMoreResults,
  );
  return (
    <div className="bg-white">
      <CollectionThemeHero
        title={collection.title}
        description={collection.description || undefined}
        image={collection.image}
      />
      <section className="uniinx-plp-shell mx-auto max-w-[1440px] px-5 pb-24 text-black sm:px-8 lg:px-[60px]">
        <CatalogFilters
          totalCount={visible.count}
          hasMoreResults={visible.hasMore}
          filterOptions={filterOptions}
          currentCollection={collection.handle}
          hideTheme
        />
        {totalCount === 0 ? (
          <div className="uniinx-plp-results flex flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-black/15 py-20 text-center">
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
            className="uniinx-plp-results"
            resourcesClassName="uniinx-product-grid"
            autoLoadNext
            dedupeKey={getProductFamilyKey}
            onVisibleCountChange={onVisibleCountChange}
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
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    featuredImage { id altText url width height }
  }
  fragment ProductItem on Product {
    id handle title productType publishedAt tags availableForSale
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    language: metafield(namespace: "custom", key: "language") { value }
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    productFamily: metafield(namespace: "custom", key: "product_family") { reference { __typename ... on Metaobject {
      id handle type name: field(key: "name") { value } slug: field(key: "slug") { value }
      products: field(key: "products") { references(first: 20) { nodes { ...FamilyMemberProductItem } } }
    } } }
    variants(first: 10) { nodes { selectedOptions { name value } } }
    featuredImage { id altText url width height }
    category { id name }
    collections(first: 10) { nodes { id handle title } }
    priceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
    compareAtPriceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection($handle: String!, $country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys, $reverse: Boolean) @inContext(country: $country, language: $language) {
    collection(handle: $handle) { id handle title description image { id url altText width height } products(first: $first, last: $last, before: $startCursor, after: $endCursor, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
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
