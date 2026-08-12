import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {MOTION_EASE, Reveal} from '~/components/motion/Reveal.jsx';
import solidsTeeDetail from '~/assets/home/solids-tee-detail.webp';
import antarikshamFront from '~/assets/home/antariksham-front.webp';
import antarikshamBack from '~/assets/home/antariksham-back.webp';

const MotionLink = motion.create(Link);

const COLLECTION_PLACEHOLDERS = [
  {
    id: 'collection-placeholder-1',
    title: 'Shop Solids',
    handle: 'all',
    description: 'Quiet essentials designed as a canvas for everyday expression.',
    fallbackImages: [solidsTeeDetail],
    fallbackAlt: 'Close-up of a solid white T-shirt',
    matches: (title) => /solids?/i.test(title),
  },
  {
    id: 'collection-placeholder-2',
    title: 'Shop Antariksham',
    handle: 'all',
    description: 'Washed black layers inspired by language, space, and movement.',
    fallbackImages: [antarikshamFront, antarikshamBack],
    fallbackAlt: 'Front and back views of the Antariksham hoodie',
    matches: (title) => /antariksham/i.test(title),
  },
];

export function DepartmentBand({collections = []}) {
  const featured = COLLECTION_PLACEHOLDERS.map((editorialCollection) => {
    const linkedCollection = collections.find((collection) =>
      editorialCollection.matches(collection.title),
    );
    return {
      ...editorialCollection,
      id: linkedCollection?.id ?? editorialCollection.id,
      handle: linkedCollection?.handle ?? editorialCollection.handle,
    };
  });

  return (
    <section
      className="uniinx-home-gutter bg-white pb-10 pt-3 sm:pb-12 sm:pt-4 lg:pb-0 lg:pt-0"
      aria-labelledby="new-collections-title"
    >
      <div className="w-full">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex flex-col items-start justify-center lg:col-span-4 lg:pr-8">
            <h2
              id="new-collections-title"
              className="text-[clamp(34px,10vw,44px)] font-normal leading-[0.95] tracking-[-0.06em] sm:text-[clamp(36px,4.5vw,65px)]"
            >
              New
              <br />
              Collections
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-black/65 sm:mt-5 sm:text-base lg:text-lg lg:leading-[26px]">
              Explore current UniinX themes, language-led graphics, and everyday
              silhouettes.
            </p>
            <Link
              to="/collections"
              className="mt-5 inline-flex min-h-11 items-center rounded-full border border-black px-6 text-sm font-medium sm:mt-6 lg:min-h-[50px] lg:w-[306px] lg:justify-center lg:text-lg"
            >
              Browse Collections
            </Link>
          </Reveal>
          <div className="uniinx-horizontal-scroll -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:contents">
            {featured.map((collection, index) => (
              <CollectionTile
                key={collection.id}
                collection={collection}
                delay={index * 80}
                className="h-[340px] w-[82vw] max-w-[340px] shrink-0 snap-center sm:h-auto sm:w-auto sm:max-w-none sm:min-h-[340px] lg:col-span-4 lg:min-h-[306px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollectionTile({collection, className = '', delay = 0}) {
  const image =
    collection.image ?? collection.products?.nodes?.[0]?.featuredImage;
  const fallbackImages = collection.fallbackImages ?? [];
  return (
    <MotionLink
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      aria-label={`${collection.title} collection`}
      initial={{opacity: 0, y: 28, scale: 0.985}}
      whileInView={{opacity: 1, y: 0, scale: 1}}
      viewport={{once: true, amount: 0.16}}
      transition={{duration: 0.68, delay: delay / 1000, ease: MOTION_EASE}}
      whileHover={{y: -6}}
      className={`group relative flex overflow-hidden rounded-[20px] bg-[#e9e7e3] p-5 lg:p-4 ${className}`}
    >
      {image ? (
        <Image
          data={image}
          alt={image.altText || collection.title}
          sizes="(min-width:1024px) 34vw, 90vw"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      ) : fallbackImages.length ? (
        <span
          className={`absolute inset-0 grid ${fallbackImages.length > 1 ? 'grid-cols-2 gap-px bg-white' : ''}`}
        >
          {fallbackImages.map((fallbackImage, index) => (
            <img
              key={fallbackImage}
              src={fallbackImage}
              alt={index === 0 ? collection.fallbackAlt || collection.title : ''}
              className="size-full min-w-0 object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ))}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center text-[clamp(48px,8vw,92px)] font-semibold tracking-[-0.07em] text-black/[0.06]"
        >
          UNIINX
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <span className="relative mt-auto flex w-full items-end justify-between gap-4 text-white">
        <span>
          {collection.eyebrow ? (
            <span className="block text-[clamp(22px,3vw,40px)] font-medium leading-none tracking-[-0.055em]">
              {collection.eyebrow}
            </span>
          ) : null}
          <span className="block text-[clamp(22px,3vw,40px)] font-medium leading-none tracking-[-0.055em]">
            {collection.title}
          </span>
          {collection.description ? (
            <span className="mt-3 block max-w-sm text-xs leading-5 text-white/80">
              {collection.description}
            </span>
          ) : null}
        </span>
        <span aria-hidden="true" className="text-3xl">
          ↗
        </span>
      </span>
    </MotionLink>
  );
}

export default DepartmentBand;
