import {Link, useLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const article = data?.article;
  return [
    {title: article?.seo?.title || `${article?.title ?? 'Journal'} | UniinX`},
    ...(article?.seo?.description
      ? [{name: 'description', content: article.seo.description}]
      : []),
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
async function loadCriticalData({context, request, params}) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      cache: context.storefront.CacheLong(),
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
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

export default function Article() {
  /** @type {LoaderReturnData} */
  const {article} = useLoaderData();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="bg-surface-subtle text-foreground">
      <article>
        <header className="uniinx-home-gutter pb-14 pt-20 sm:pt-28 lg:pb-20 lg:pt-36">
          <Link
            to="/blogs"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45"
          >
            ← Journal
          </Link>
          <h1 className="mt-8 max-w-6xl text-[clamp(50px,8vw,118px)] font-normal leading-[0.82] tracking-[-0.07em]">
            {title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-black/45">
            <time dateTime={article.publishedAt}>{publishedDate}</time>
            {author?.name ? (
              <address className="not-italic">By {author.name}</address>
            ) : null}
          </div>
        </header>
        {image ? (
          <div className="uniinx-home-gutter">
            <div className="max-h-[760px] overflow-hidden rounded-[22px]">
              <Image
                data={image}
                sizes="100vw"
                loading="eager"
                className="size-full object-cover"
              />
            </div>
          </div>
        ) : null}
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="uniinx-rich-text mx-auto max-w-3xl px-5 py-16 text-base leading-8 text-black/70 sm:px-8 lg:py-24"
        />
      </article>
      <nav
        aria-label="Continue exploring"
        className="uniinx-home-gutter border-t border-black/10 py-12"
      >
        <Link
          to="/blogs"
          className="inline-flex min-h-12 items-center rounded-full bg-black px-6 text-xs font-semibold text-white"
        >
          Back to Journal →
        </Link>
      </nav>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;

/** @typedef {import('./+types/blogs.$blogHandle.$articleHandle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
