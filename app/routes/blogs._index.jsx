import {Link, useLoaderData} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {Reveal} from '~/components/motion/Reveal.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Journal | UniinX'},
    {
      name: 'description',
      content:
        'Stories about Indian scripts, clothing, culture, and the making of UniinX collections.',
    },
  ];
};

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
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      cache: context.storefront.CacheLong(),
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
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

export default function Blogs() {
  /** @type {LoaderReturnData} */
  const {blogs} = useLoaderData();

  return (
    <div className="bg-surface-subtle text-foreground">
      <section className="uniinx-home-gutter border-b border-black/10 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-36">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
            Notes from the studio
          </p>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <h1 className="text-[clamp(48px,11vw,164px)] font-normal leading-[0.84] tracking-[-0.065em] sm:leading-[0.76] sm:tracking-[-0.08em]">
              Journal.
            </h1>
            <p className="max-w-md border-l border-black/20 pl-5 text-sm leading-7 text-black/60 sm:text-base">
              Indian scripts, material studies, collection stories, and the
              people who make UniinX.
            </p>
          </div>
        </Reveal>
      </section>
      <section className="uniinx-home-gutter py-16 sm:py-20 lg:py-28">
        {blogs.nodes.length ? (
          <PaginatedResourceSection connection={blogs}>
            {({node: blog, index}) => (
              <Link
                className="group grid gap-6 border-b border-black/15 py-8 sm:grid-cols-[72px_1fr_0.8fr_auto] sm:items-center"
                key={blog.handle}
                prefetch="intent"
                to={`/blogs/${blog.handle}`}
              >
                <span className="text-xs text-black/35">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-[clamp(30px,4vw,58px)] font-normal leading-[0.9] tracking-[-0.05em]">
                  {blog.title}
                </h2>
                <span className="relative block aspect-[3/2] overflow-hidden rounded-[16px] bg-[#ddd7cd]">
                  {blog.articles.nodes[0]?.image ? (
                    <Image
                      data={blog.articles.nodes[0].image}
                      alt={blog.articles.nodes[0].image.altText || blog.title}
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="grid size-full place-items-center text-xs uppercase tracking-[0.15em] text-black/30">
                      UniinX Journal
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className="text-3xl transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            )}
          </PaginatedResourceSection>
        ) : (
          <Reveal className="rounded-[24px] border border-black/10 bg-white p-8 sm:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
              The first issue is in progress
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(38px,5vw,72px)] font-normal leading-[0.9] tracking-[-0.055em]">
              Stories are being set in type.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
              When Shopify blog entries are published, they will appear here
              automatically.
            </p>
            <Link
              to="/pages/about"
              className="mt-7 inline-flex min-h-12 items-center rounded-full bg-black px-6 text-xs font-semibold text-white"
            >
              Read our story →
            </Link>
          </Reveal>
        )}
      </section>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        articles(first: 1) {
          nodes {
            title
            image { id altText url width height }
          }
        }
        seo {
          title
          description
        }
      }
    }
  }
`;

/** @typedef {BlogsQuery['blogs']['nodes'][0]} BlogNode */

/** @typedef {import('./+types/blogs._index').Route} Route */
/** @typedef {import('storefrontapi.generated').BlogsQuery} BlogsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
