import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';

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
    <div className="bg-white pb-24 text-black">
      <CollectionThemeHero title="Collections" directory />
      <section className="mx-auto max-w-[1440px] px-3 pt-2 sm:px-5 lg:px-[60px]">
        <PaginatedResourceSection
          connection={collections}
          ariaLabel="Collections"
          resourcesClassName="uniinx-collection-mosaic"
          previousClassName="uniinx-plp-pagination-link"
          nextClassName="uniinx-plp-pagination-link"
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
  const image = collection.image || collection.products?.nodes?.[0]?.featuredImage;
  const featureCopy = index === 0
    ? `Say it with ${collection.title}`
    : index === 1
      ? `The ${collection.title}`
      : collection.title;

  return (
    <Reveal as="article" variant="card" delay={(index % 4) * 70}>
      <Link
        className="group relative flex h-full min-h-[240px] overflow-hidden rounded-[20px] bg-[#d9d9d9] p-5 text-white sm:rounded-[30px] sm:p-7"
        to={`/collections/${collection.handle}`}
        prefetch="intent"
      >
        {image ? (
          <Image
            alt={image.altText || collection.title}
            data={image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 1100px) 66vw, (min-width: 720px) 50vw, 100vw"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="relative mt-auto flex w-full items-end justify-between gap-4">
          <span className="max-w-[80%] text-[clamp(28px,4.5vw,78px)] font-normal leading-[0.9] tracking-[-0.065em]">
            {featureCopy}
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-2xl text-black transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-14">
            ↗
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
    products(first: 1) {
      nodes {
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
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
