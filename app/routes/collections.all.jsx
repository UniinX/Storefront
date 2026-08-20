import {useLoaderData} from 'react-router';
import {CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ds/index.js';
import {BentoFeaturedGrid} from '~/components/product/BentoFeaturedGrid';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';
import {
  applyClientFilters,
  CLIENT_FILTER_BATCH_SIZE,
  getCatalogFilterOptions,
  getCatalogSort,
  getProductSearchQuery,
  groupCatalogFamilies,
  hasClientOnlyFilters,
} from '~/lib/catalog';

export const meta = () => [{title: 'UniinX | Products Catalog'}];

export async function loader({context, request}) {
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'featured';
  const selected = {
    type: url.searchParams.get('type'),
    theme: url.searchParams.get('theme'),
    language: url.searchParams.get('language'),
    color: url.searchParams.get('color'),
    size: url.searchParams.get('size'),
    collection: url.searchParams.get('collection'),
    q: url.searchParams.get('q'),
  };
  // `getProductSearchQuery` only narrows on type/collection/q — theme,
  // language, color, and size can't be filtered via `products(query:)`
  // (see STOREFRONT_NATIVE_FILTER_SUPPORT / typedFiltersAvailable in
  // lib/catalog.js), so those are matched client-side below against a
  // larger fetched batch.
  const query = getProductSearchQuery(selected);
  // Top-level `products(query:)` has no `filters:` argument at all, so this
  // route can never use typed ProductFilters regardless of what Shopify's
  // index supports — always client-match any selected attribute.
  const clientFiltering = hasClientOnlyFilters(selected, {
    typedFiltersAvailable: false,
  });
  const variables = {
    ...(clientFiltering
      ? {first: CLIENT_FILTER_BATCH_SIZE}
      : getPaginationVariables(request, {pageBy: 12})),
    ...getCatalogSort(sort),
    query,
  };
  const {products: rawProducts} = await context.storefront.query(
    CATALOG_QUERY,
    {
      variables,
      cache: CacheShort(),
    },
  );
  const scopedProducts = clientFiltering
    ? applyClientFilters(rawProducts, selected)
    : rawProducts;
  const products = groupCatalogFamilies(scopedProducts);

  return {
    products,
    filterOptions: getCatalogFilterOptions(rawProducts),
    selectedTheme: url.searchParams.get('theme') || '',
    totalCount: products.nodes.length,
    hasMoreResults: Boolean(
      products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage,
    ),
  };
}

export default function Catalog() {
  const {products, filterOptions, totalCount, hasMoreResults} = useLoaderData();
  return (
    <div className="bg-white">
      <CollectionThemeHero
        title="All Products"
        artwork="collections"
        description="Explore contemporary garments shaped by Indian scripts, language, and culture."
        hideImage
      />
      <section className="uniinx-plp-shell mx-auto max-w-[1440px] px-5 pb-24 text-black sm:px-8 lg:px-[60px]">
        <CatalogFilters
          totalCount={totalCount}
          hasMoreResults={hasMoreResults}
          filterOptions={filterOptions}
          hideTheme
        />
        {totalCount === 0 ? (
          <div className="uniinx-plp-results flex flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-black/15 py-20 text-center">
            <span className="text-lg text-black/60">
              No products match selected filters
            </span>
            <span className="text-xs text-black/45">
              Try another theme, script, color, or category.
            </span>
          </div>
        ) : (
          <PaginatedResourceSection
            connection={products}
            className="uniinx-plp-results"
            resourcesClassName="uniinx-product-grid"
            autoLoadNext
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
      </section>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 { amount currencyCode }
  fragment FamilyMemberCollectionItem on Product {
    id handle title availableForSale
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    featuredImage { id altText url width height }
  }
  fragment CollectionItem on Product {
    id handle title productType publishedAt tags availableForSale
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    language: metafield(namespace: "custom", key: "language") { value }
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    productFamily: metafield(namespace: "custom", key: "product_family") {
      reference { __typename ... on Metaobject {
        id handle type name: field(key: "name") { value } slug: field(key: "slug") { value }
        products: field(key: "products") { references(first: 20) { nodes { ...FamilyMemberCollectionItem } } }
      } }
    }
    variants(first: 10) { nodes { selectedOptions { name value } } }
    featuredImage { id altText url width height }
    category { id name }
    collections(first: 10) { nodes { id handle title } }
    priceRange { minVariantPrice { ...MoneyCollectionItem } maxVariantPrice { ...MoneyCollectionItem } }
    compareAtPriceRange { minVariantPrice { ...MoneyCollectionItem } maxVariantPrice { ...MoneyCollectionItem } }
  }
`;

const CATALOG_QUERY = `#graphql
  ${COLLECTION_ITEM_FRAGMENT}
  query Catalog($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes { ...CollectionItem }
      filters { id label type values { id label count input } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
`;

const ALL_FACETS_QUERY = `#graphql
  ${COLLECTION_ITEM_FRAGMENT}
  query AllCatalogFacets($country: CountryCode, $language: LanguageCode, $first: Int) @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes { ...CollectionItem }
      filters { id label type values { id label count input } }
    }
  }
`;

/** @typedef {import('./+types/collections.all').Route} Route */
