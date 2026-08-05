/**
 * @file PLP (Product Listing Page) — hero band, breadcrumb + sort bar,
 * sticky filter sidebar, product grid. On mobile the sidebar filters
 * collapse into a BottomSheet.
 */
import {useState} from 'react';
import {Link, redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {LanguageChipSelector, ClothTypeSelector, BottomSheet, ProductCard} from '~/components/ds/index.js';
import {Reveal} from '~/components/motion/Reveal.jsx';

const eyebrow = {fontFamily: 'var(--font-work-sans)', fontSize: 'var(--uniinx-cta-size)', letterSpacing: 'var(--uniinx-tracking-tight)', color: 'var(--stone)', marginBottom: 12};

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured', sortKey: 'COLLECTION_DEFAULT', reverse: false},
  {value: 'newest', label: 'Newest', sortKey: 'CREATED', reverse: true},
  {value: 'price-asc', label: 'Price: Low to High', sortKey: 'PRICE', reverse: false},
  {value: 'price-desc', label: 'Price: High to Low', sortKey: 'PRICE', reverse: true},
];

function getSort(value) {
  return SORT_OPTIONS.find((s) => s.value === value) ?? SORT_OPTIONS[0];
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `UniinX | ${data?.collection.title ?? ''}`}];
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
  const paginationVariables = getPaginationVariables(request, {pageBy: 8});
  const sort = getSort(new URL(request.url).searchParams.get('sort'));

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey: sort.sortKey,
        reverse: sort.reverse,
        ...paginationVariables,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [languageId, setLanguageId] = useState(null);
  const [fabricId, setFabricId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeFilterCount = (languageId ? 1 : 0) + (fabricId ? 1 : 0);
  const sort = getSort(searchParams.get('sort'));
  const productCount = collection.products.nodes.length;

  const Filters = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
      {/* ClothTypeSelector already renders its own "STYLE" and "CLOTH" section labels internally — no outer label needed here. */}
      <ClothTypeSelector fabricId={fabricId} onFabricChange={setFabricId} />
      <div><div style={eyebrow}>LANGUAGE</div><LanguageChipSelector value={languageId} onChange={setLanguageId} size="sm" /></div>
      {activeFilterCount > 0 && (
        <button
          onClick={() => { setLanguageId(null); setFabricId(null); }}
          style={{alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--accent-cta)', textDecoration: 'underline'}}
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <section>
      {/* Hero band */}
      <div style={{padding: '32px clamp(20px, 6vw, var(--space-xl)) 40px', borderBottom: '1px solid var(--mist)'}}>
        <nav aria-label="Breadcrumb" style={{fontFamily: 'var(--font-work-sans)', fontSize: 12, color: 'var(--stone)', marginBottom: 20}}>
          <Link to="/" style={{color: 'var(--stone)'}}>Home</Link>
          <span style={{margin: '0 8px'}}>/</span>
          <span style={{color: 'var(--ink)'}}>{collection.title}</span>
        </nav>
        <h1 style={{fontFamily: 'var(--font-marcellus)', fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1}}>
          {collection.title.toUpperCase()}
        </h1>
        <p style={{fontFamily: 'var(--font-work-sans)', color: 'var(--stone)', margin: 0, maxWidth: 480}}>
          {collection.description || 'Every piece prints in your language'}
        </p>
      </div>

      <div style={{padding: '32px clamp(20px, 6vw, var(--space-xl)) 96px'}}>
        {/* Sub-header: count + sort + mobile filter trigger */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap'}}>
          <span style={{fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--stone)'}}>
            {productCount} {productCount === 1 ? 'design' : 'designs'}
          </span>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--stone)'}}>
              Sort
              <select
                value={sort.value}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('sort', e.target.value);
                  setSearchParams(next, {preventScrollReset: true});
                }}
                style={{minHeight: 44, maxWidth: 150, padding: '8px 12px', fontSize: 16, border: '1px solid var(--mist)', borderRadius: 'var(--radius-md)', background: 'var(--paper)', fontFamily: 'var(--font-work-sans)', color: 'var(--ink)', cursor: 'pointer', textOverflow: 'ellipsis'}}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <button className="uniinx-hide-desktop" onClick={() => setSheetOpen(true)}
              style={{minHeight: 44, padding: '8px 18px', border: '1px solid var(--mist)', borderRadius: 'var(--radius-full)', background: 'var(--paper)', fontFamily: 'var(--font-work-sans)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6}}>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>

        <div className="uniinx-plp-layout">
          <aside className="uniinx-hide-mobile uniinx-plp-sidebar">{Filters}</aside>
          {productCount === 0 ? (
            <div style={{textAlign: 'center', padding: '80px 20px'}}>
              <p style={{fontFamily: 'var(--font-marcellus)', fontSize: 24, color: 'var(--ink)', marginBottom: 12}}>Nothing here yet</p>
              <p style={{fontFamily: 'var(--font-work-sans)', color: 'var(--stone)', marginBottom: 24}}>New designs are on the way.</p>
              <button onClick={() => navigate('/')} style={{border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cta)', color: 'var(--paper)', fontFamily: 'var(--font-marcellus)', fontSize: 'var(--uniinx-cta-size)', letterSpacing: 'var(--uniinx-tracking-wide)'}}>
                Back to Home →
              </button>
            </div>
          ) : (
            <PaginatedResourceSection
              connection={collection.products}
              resourcesClassName="uniinx-product-grid"
              previousClassName="uniinx-plp-pagination-link"
              nextClassName="uniinx-plp-pagination-link"
            >
              {({node: product, index}) => (
                <Reveal key={product.id} delay={Math.min(index, 8) * 60}>
                  <ProductCard product={product} loading={index < 8 ? 'eager' : undefined} />
                </Reveal>
              )}
            </PaginatedResourceSection>
          )}
        </div>
      </div>
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Cloth & Language">{Filters}</BottomSheet>
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </section>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
