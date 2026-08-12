import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getCollectionThemeStyle} from '~/lib/collectionTheme.js';
import {Reveal} from '~/components/motion/Reveal.jsx';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
      cache: context.storefront.CacheLong(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="bg-[#eee9e0] pb-24 pt-[92px] text-black">
      <header className="uniinx-home-gutter border-b border-black/10 py-16 sm:py-20 lg:py-28">
        <Reveal>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
            UniinX theme directory
          </span>
          <div className="mt-7 grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <h1 className="text-[clamp(62px,10vw,148px)] font-normal leading-[0.76] tracking-[-0.075em]">
              Every theme, its own world.
            </h1>
            <p className="max-w-md border-l border-black/20 pl-5 text-sm leading-7 text-black/60">
              Move between palettes, scripts, and cultural references. Each
              collection carries a distinct atmosphere while remaining part of
              one UniinX wardrobe.
            </p>
          </div>
        </Reveal>
      </header>
      <section className="mx-auto max-w-[1440px] px-5 pt-12 sm:px-8 lg:px-[60px] lg:pt-16">
        <PaginatedResourceSection
          connection={collections}
          resourcesClassName="grid gap-5 md:grid-cols-2"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  const style = getCollectionThemeStyle(collection.title);
  return (
    <Reveal as="article" variant="card" delay={(index % 4) * 70}>
      <Link
        style={style}
        className="group relative flex min-h-[440px] overflow-hidden rounded-[22px] bg-[var(--collection-hero)] p-6 text-[var(--collection-ink)] sm:min-h-[520px] sm:p-8"
        to={`/collections/${collection.handle}`}
        prefetch="intent"
      >
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 900px) 50vw, 100vw"
            className="absolute inset-0 size-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.025]"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <span aria-hidden="true" className="absolute right-7 top-2 select-none text-[180px] leading-none text-[var(--collection-pattern)] opacity-20 sm:text-[260px]">
          అ
        </span>
        <span className="relative mt-auto flex w-full items-end justify-between gap-6">
          <span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Enter theme
            </span>
            <span className="mt-3 block text-[clamp(40px,5vw,74px)] font-normal leading-[0.82] tracking-[-0.06em] text-white">
              {collection.title}
            </span>
            {collection.description ? (
              <span className="mt-5 block max-w-md text-sm leading-6 text-white/65">
                {collection.description}
              </span>
            ) : null}
          </span>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-xl text-black transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
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
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('./+types/collections._index').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
