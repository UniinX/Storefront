import {Link, useLoaderData} from 'react-router';
import {Analytics, getPaginationVariables} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ProductCard.jsx';
import {CatalogFilters} from '~/components/product/CatalogFilters';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';
import {
  applyClientFilters,
  CLIENT_FILTER_BATCH_SIZE,
  getCatalogFilterOptions,
  getCollectionFilters,
  groupCatalogFamilies,
  hasClientOnlyFilters,
} from '~/lib/catalog';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';

const SEARCH_SORT_OPTIONS = [
  {value: 'relevance', label: 'Most relevant'},
  {value: 'price-asc', label: 'Price: Low to High'},
  {value: 'price-desc', label: 'Price: High to Low'},
];

export const meta = ({data}) => {
  const term = data?.term;
  return [{title: term ? `Search: ${term} | UniinX` : 'Search | UniinX'}];
};

export async function loader({request, context}) {
  const url = new URL(request.url);
  if (url.searchParams.has('predictive')) {
    return predictiveSearch({request, context});
  }
  return regularSearch({request, context});
}

export default function SearchPage() {
  const {
    type,
    term,
    result,
    error,
    products,
    filterOptions,
    totalCount,
    hasMoreResults,
  } = useLoaderData();
  if (type === 'predictive') return null;

  const pages = result?.items?.pages?.nodes ?? [];
  const articles = result?.items?.articles?.nodes ?? [];
  const description = term
    ? `${totalCount}${hasMoreResults ? '+' : ''} products matching “${term}”, with related stories and pages.`
    : 'Search the UniinX catalog by garment, collection, color, or language.';

  return (
    <div className="bg-white">
      <CollectionThemeHero
        title="Search Results"
        artwork="collections"
        description={description}
      />

      <section className="uniinx-plp-shell mx-auto max-w-[1440px] px-5 pb-24 text-black sm:px-8 lg:px-[60px]">
        <SearchForm
          role="search"
          className="col-span-full flex min-h-14 items-center gap-2 rounded-full border border-border-strong bg-white p-1.5 pl-5 shadow-sm focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2"
        >
          {({inputRef}) => (
            <>
              <label htmlFor="catalog-search" className="sr-only">
                Search products
              </label>
              <input
                id="catalog-search"
                defaultValue={term}
                name="q"
                placeholder="Search products, colors, languages…"
                ref={inputRef}
                type="search"
                className="min-w-0 flex-1 border-0 bg-transparent text-base outline-none placeholder:text-black/40"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Search
              </button>
            </>
          )}
        </SearchForm>

        {term ? (
          <CatalogFilters
            totalCount={totalCount}
            hasMoreResults={hasMoreResults}
            filterOptions={filterOptions}
            sortOptions={SEARCH_SORT_OPTIONS}
            defaultSort="relevance"
          />
        ) : null}

        {error ? (
          <CatalogMessage
            title="Search is temporarily unavailable"
            detail="Please try again in a moment."
          />
        ) : !term ? (
          <CatalogMessage
            title="What are you looking for?"
            detail="Try a garment, collection, color, or language."
          />
        ) : totalCount === 0 ? (
          <CatalogMessage
            title={`No products found for “${term}”`}
            detail="Try a broader term or adjust the catalog filters."
          />
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

        <RelatedSearchResults pages={pages} articles={articles} term={term} />
      </section>

      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

function CatalogMessage({title, detail}) {
  return (
    <div className="uniinx-plp-results flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-black/50">{detail}</p>
    </div>
  );
}

function RelatedSearchResults({pages, articles, term}) {
  if (!pages.length && !articles.length) return null;
  return (
    <aside className="col-span-full mt-6 border-t border-black/10 pt-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
        More from UniinX
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {pages.map((page) => (
          <RelatedLink
            key={page.id}
            item={page}
            to={`/pages/${page.handle}`}
            term={term}
            type="Page"
          />
        ))}
        {articles.map((article) => (
          <RelatedLink
            key={article.id}
            item={article}
            to={`/blogs/${article.handle}`}
            term={term}
            type="Journal"
          />
        ))}
      </div>
    </aside>
  );
}

function RelatedLink({item, to, term, type}) {
  const url = urlWithTrackingParams({
    baseUrl: to,
    trackingParams: item.trackingParameters,
    term,
  });
  return (
    <Link
      to={url}
      prefetch="intent"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-sm transition-colors hover:border-black/40"
    >
      <span className="text-[9px] font-semibold uppercase tracking-wider text-black/40">
        {type}
      </span>
      {item.title}
    </Link>
  );
}

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment MoneySearchProduct on MoneyV2 { amount currencyCode }
  fragment FamilyMemberSearchProduct on Product {
    id handle title availableForSale
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    featuredImage { id altText url width height }
  }
  fragment SearchProduct on Product {
    __typename id handle title productType publishedAt tags availableForSale trackingParameters
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    language: metafield(namespace: "custom", key: "language") { value }
    familyValue: metafield(namespace: "custom", key: "family_value") { value }
    color: metafield(namespace: "custom", key: "color") { value }
    colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
      references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
    }
    productFamily: metafield(namespace: "custom", key: "product_family") { reference { __typename ... on Metaobject {
      id handle type name: field(key: "name") { value } slug: field(key: "slug") { value }
      products: field(key: "products") { references(first: 20) { nodes { ...FamilyMemberSearchProduct } } }
    } } }
    variants(first: 10) { nodes { selectedOptions { name value } } }
    featuredImage { id altText url width height }
    category { id name }
    collections(first: 10) { nodes { id handle title } }
    priceRange { minVariantPrice { ...MoneySearchProduct } maxVariantPrice { ...MoneySearchProduct } }
    compareAtPriceRange { minVariantPrice { ...MoneySearchProduct } maxVariantPrice { ...MoneySearchProduct } }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
    __typename handle id title trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename handle id title trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage hasPreviousPage startCursor endCursor
  }
`;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $productFilters: [ProductFilter!]
    $reverse: Boolean
    $sortKey: SearchSortKeys
    $startCursor: String
    $term: String!
  ) @inContext(country: $country, language: $language) {
    articles: search(query: $term, types: [ARTICLE], first: 6) {
      nodes { ...on Article { ...SearchArticle } }
    }
    pages: search(query: $term, types: [PAGE], first: 6) {
      nodes { ...on Page { ...SearchPage } }
    }
    products: search(
      after: $endCursor
      before: $startCursor
      first: $first
      last: $last
      productFilters: $productFilters
      query: $term
      reverse: $reverse
      sortKey: $sortKey
      types: [PRODUCT]
      unavailableProducts: HIDE
    ) {
      nodes { ...on Product { ...SearchProduct } }
      pageInfo { ...PageInfoFragment }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const selected = {
    type: url.searchParams.get('type'),
    theme: url.searchParams.get('theme'),
    language: url.searchParams.get('language'),
    color: url.searchParams.get('color'),
    size: url.searchParams.get('size'),
    collection: url.searchParams.get('collection'),
  };
  const sort = url.searchParams.get('sort') || 'relevance';
  const sortKey = sort.startsWith('price-') ? 'PRICE' : 'RELEVANCE';
  const reverse = sort === 'price-desc';
  const emptyItems = {
    articles: {nodes: []},
    pages: {nodes: []},
    products: {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    },
  };

  if (!term) {
    return {
      type: 'regular',
      term,
      result: {total: 0, items: emptyItems},
      products: emptyItems.products,
      filterOptions: getCatalogFilterOptions(emptyItems.products),
      totalCount: 0,
      hasMoreResults: false,
    };
  }

  // `term` still goes straight to Shopify's `search(query:)` — that's the
  // real full-text engine (relevance, typo tolerance, boosts) and works
  // correctly on its own; verified narrowing 46->0 between a real and a
  // bogus term. `productFilters` narrows for whatever's enabled in
  // STOREFRONT_NATIVE_FILTER_SUPPORT (lib/catalog.js); anything not covered
  // there is matched client-side below instead.
  const clientFiltering = hasClientOnlyFilters(selected);
  const variables = {
    ...(clientFiltering
      ? {first: CLIENT_FILTER_BATCH_SIZE}
      : getPaginationVariables(request, {pageBy: 12})),
    productFilters: getCollectionFilters(selected),
    reverse,
    sortKey,
    term,
  };
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables,
    cache: storefront.CacheShort(),
  });

  if (!items?.products) {
    throw new Error('No search data returned from Shopify API');
  }

  const scopedProducts = clientFiltering
    ? applyClientFilters(items.products, selected)
    : items.products;
  const products = groupCatalogFamilies(scopedProducts);
  const totalCount = products.nodes.length;
  const hasMoreResults = Boolean(
    products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage,
  );
  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;
  const total =
    totalCount +
    (items.pages?.nodes.length ?? 0) +
    (items.articles?.nodes.length ?? 0);

  return {
    type: 'regular',
    term,
    error,
    result: {total, items: {...items, products}},
    products,
    filterOptions: getCatalogFilterOptions(items.products),
    totalCount,
    hasMoreResults,
  };
}

const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename id title handle blog { handle }
    image { url altText width height }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename id title handle image { url altText width height } trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename id title handle trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename id title handle trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id image { url altText width height } price { amount currencyCode }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename text styledText trackingParameters
  }
`;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit
      limitScope: $limitScope
      query: $term
      types: $types
    ) {
      articles { ...PredictiveArticle }
      collections { ...PredictiveCollection }
      pages { ...PredictivePage }
      products { ...PredictiveProduct }
      queries { ...PredictiveQuery }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      cache: storefront.CacheNone(),
      variables: {limit, limitScope: 'EACH', term},
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }
  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );
  return {type, term, result: {items, total}};
}

/** @typedef {import('./+types/search').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
