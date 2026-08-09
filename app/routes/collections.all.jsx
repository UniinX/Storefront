import {useLoaderData} from 'react-router';
import {CacheShort, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ds/index.js';
import {BentoFeaturedGrid} from '~/components/product/BentoFeaturedGrid';
import {CatalogFilters} from '~/components/product/CatalogFilters';
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
  const {products: rawProducts} = await context.storefront.query(CATALOG_QUERY, {
    variables,
    cache: CacheShort(),
  });
  const products = groupCatalogFamilies(rawProducts);

  return {
    products,
    filterOptions: getCatalogFilterOptions(rawProducts),
    totalCount: products.nodes.length,
    hasMoreResults: Boolean(products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage),
  };
}

export default function Catalog() {
  const {products, filterOptions, totalCount, hasMoreResults} = useLoaderData();
  return (
    <section className="px-6 md:px-14 py-28 max-w-6xl mx-auto flex flex-col gap-10 text-black dark:text-white">
      <div>
        <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">Editorial Catalog</span>
        <h2 className="font-marcellus text-4xl uppercase font-light">Linguistic Templates</h2>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">Explore products featuring script details in Telugu, Hindi, Tamil, and Sanskrit.</p>
      </div>
      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />
      <CatalogFilters totalCount={totalCount} hasMoreResults={hasMoreResults} filterOptions={filterOptions} />
      {totalCount === 0 ? (
        <div className="py-20 border border-dashed border-black/10 dark:border-white/10 text-center flex flex-col items-center justify-center gap-3">
          <span className="font-marcellus text-lg text-black/60 dark:text-white/50">No products match selected filters</span>
          <span className="font-work text-xs text-black/40 dark:text-white/40">Try adjusting your search query, scripts, or color options.</span>
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
    </section>
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
