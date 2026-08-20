import {useLoaderData, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {CollectionThemeHero} from '~/components/collection/CollectionThemeHero.jsx';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context}) {
  // Themes ("Solids" and whatever else gets added) come from the
  // `custom.collection_name` product metafield, not real Shopify
  // Collections — those are the garment-type ones (Hoodies, Joggers, etc.)
  // used elsewhere. There's no Storefront API query that lists distinct
  // metafield values directly, so this fetches the (currently small, ~80
  // product) catalog and derives them, same approach as the catalog
  // filter facets in lib/catalog.js.
  const {products} = await context.storefront.query(THEME_PRODUCTS_QUERY, {
    variables: {first: 100, sortKey: 'BEST_SELLING'},
    cache: context.storefront.CacheLong(),
  });

  const themes = new Map();
  for (const product of products.nodes) {
    const value = product.collectionName?.value;
    if (!value) continue;
    const color = product.colorPattern?.references?.nodes?.[0]?.label?.value;
    const existing = themes.get(value);
    if (!existing) {
      // sortKey: BEST_SELLING means the first product seen per theme is
      // already its top seller — a reasonable representative image on its
      // own — but if a later, less-best-selling product turns out to be
      // the neutral "Black" variant, prefer that instead, since that's the
      // conventional hero color for a basics/solids line.
      themes.set(value, {value, image: product.featuredImage, count: 1, imageColor: color});
      continue;
    }
    existing.count += 1;
    if (color === 'Black' && existing.imageColor !== 'Black') {
      existing.image = product.featuredImage;
      existing.imageColor = color;
    }
  }

  return {
    themes: [...themes.values()].sort((a, b) => a.value.localeCompare(b.value)),
  };
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {themes} = useLoaderData();

  return (
    <div className="bg-white pb-24 text-black">
      <CollectionThemeHero title="Collections" directory />
      <section className="mx-auto max-w-[1440px] px-3 pt-2 sm:px-5 lg:px-[60px]">
        <div
          className="uniinx-collection-mosaic"
          aria-label="Collections"
          role="region"
        >
          {themes.map((theme, index) => (
            <ThemeItem key={theme.value} theme={theme} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ThemeItem({theme, index}) {
  const featureCopy =
    index === 0
      ? `Say it with ${theme.value}`
      : index === 1
        ? `The ${theme.value}`
        : theme.value;

  return (
    <Reveal as="article" variant="card" delay={(index % 4) * 70}>
      <Link
        className="group relative flex h-full min-h-[240px] overflow-hidden rounded-[20px] bg-[#d9d9d9] p-5 text-white sm:rounded-[30px] sm:p-7"
        to={`/collections/all?theme=${encodeURIComponent(theme.value)}`}
        prefetch="intent"
      >
        {theme.image ? (
          <Image
            alt={theme.image.altText || theme.value}
            data={theme.image}
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

const THEME_PRODUCTS_QUERY = `#graphql
  query ThemeProducts($first: Int, $sortKey: ProductSortKeys, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: $sortKey) {
      nodes {
        collectionName: metafield(namespace: "custom", key: "collection_name") { value }
        colorPattern: metafield(namespace: "shopify", key: "color-pattern") {
          references(first: 1) { nodes { ... on Metaobject { label: field(key: "label") { value } } } }
        }
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
`;

/** @typedef {import('./+types/collections._index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
