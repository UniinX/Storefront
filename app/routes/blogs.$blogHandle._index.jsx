import {Link, useLoaderData} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Reveal} from '~/components/motion/Reveal.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `${data?.blog.title ?? 'Journal'} | UniinX`}];
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
async function loadCriticalData({context, request, params}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      cache: context.storefront.CacheLong(),
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
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

export default function Blog() {
  /** @type {LoaderReturnData} */
  const {blog} = useLoaderData();
  const {articles} = blog;

  return (
    <div className="bg-surface-subtle text-foreground">
      <section className="uniinx-home-gutter border-b border-black/10 pb-14 pt-20 sm:pt-28 lg:pb-20 lg:pt-36">
        <Reveal>
          <Link
            to="/blogs"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45"
          >
            ← Journal
          </Link>
          <h1 className="mt-8 max-w-6xl text-[clamp(58px,9vw,136px)] font-normal leading-[0.78] tracking-[-0.075em]">
            {blog.title}
          </h1>
        </Reveal>
      </section>
      <section className="uniinx-home-gutter py-14 sm:py-20 lg:py-24">
        {articles.nodes.length ? (
          <PaginatedResourceSection connection={articles}>
            {({node: article, index}) => (
              <ArticleItem
                article={article}
                key={article.id}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <p className="rounded-[20px] border border-black/10 bg-white p-8 text-sm text-black/60">
            No stories have been published in this journal yet.
          </p>
        )}
      </section>
    </div>
  );
}

/**
 * @param {{
 *   article: ArticleItemFragment;
 *   loading?: HTMLImageElement['loading'];
 * }}
 */
function ArticleItem({article, loading}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));
  return (
    <Reveal
      as="article"
      className="border-b border-black/15 py-8"
      key={article.id}
    >
      <Link
        className="group grid gap-6 sm:grid-cols-[0.8fr_1fr] sm:items-center"
        to={`/blogs/${article.blog.handle}/${article.handle}`}
      >
        {article.image && (
          <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-black/5">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          </div>
        )}
        <span>
          <small className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
            {publishedAt}
          </small>
          <h2 className="mt-4 text-[clamp(30px,4vw,58px)] font-normal leading-[0.9] tracking-[-0.05em]">
            {article.title}
          </h2>
          <span className="mt-6 inline-flex text-xs font-semibold">
            Read story →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
`;

/** @typedef {import('./+types/blogs.$blogHandle._index').Route} Route */
/** @typedef {import('storefrontapi.generated').ArticleItemFragment} ArticleItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
