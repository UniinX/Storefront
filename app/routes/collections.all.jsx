import {useLoaderData} from 'react-router';
import {CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ds/index.js';
import {BentoFeaturedGrid} from '~/components/product/BentoFeaturedGrid';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';
import {
  getCatalogFilterOptions,
  getCatalogSort,
  getProductSearchQuery,
  groupCatalogFamilies,
} from '~/lib/catalog';

export const meta = () => [{title: 'UniinX | Products Catalog'}];

export async function loader({context, request}) {
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'featured';
  const query = getProductSearchQuery({
    type: url.searchParams.get('type'),
    theme: url.searchParams.get('theme'),
    language: url.searchParams.get('language'),
    color: url.searchParams.get('color'),
    collection: url.searchParams.get('collection'),
    q: url.searchParams.get('q'),
  });
  const variables = {
    ...getPaginationVariables(request, {pageBy: 12}),
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
  const products = groupCatalogFamilies(rawProducts);

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
    featuredImage { id altText url width height }
  }
  fragment CollectionItem on Product {
    id handle title productType publishedAt tags availableForSale
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    language: metafield(namespace: "custom", key: "language") { value }
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    productFamily: metafield(namespace: "custom", key: "product_family") {
      reference { __typename ... on Metaobject {
        id handle type name: field(key: "name") { value } slug: field(key: "slug") { value }
        products: field(key: "products") { references(first: 20) { nodes { ...FamilyMemberCollectionItem } } }
      } }
    }
    variants(first: 10) { nodes { selectedOptions { name value } } }
    featuredImage { id altText url width height }
    collections(first: 2) { nodes { title } }
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

/** @typedef {import('./+types/collections.all').Route} Route */
