import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/motion/Reveal.jsx';

export function DepartmentBand({collections = []}) {
  if (!collections.length) return null;

  const tiles = [
    ...collections.slice(0, 5).map((collection) => ({...collection, isAll: false})),
    {
      id: 'all-collections',
      title: 'All',
      handle: 'all',
      description: 'Explore every language, silhouette, and story in the UniinX catalogue.',
      isAll: true,
    },
  ];

  return (
    <section className="px-6 md:px-14 py-16 bg-brand-bg-light border-b border-black/5">
      <div className="flex items-end justify-between gap-6 mb-8">
        <Reveal>
          <span className="font-work text-[10px] tracking-[0.2em] text-brand-accent uppercase font-semibold">
            Curated by UniinX
          </span>
          <h2 className="font-marcellus text-3xl md:text-4xl uppercase font-light text-black mt-1">
            Shop Collections
          </h2>
        </Reveal>
        <Link
          to="/collections"
          prefetch="intent"
          className="hidden sm:inline-flex font-work text-[10px] tracking-[0.16em] uppercase text-black/55 hover:text-brand-accent transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[210px] gap-4 md:gap-5">
        {tiles.map((collection, index) => {
          const image = collection.image ?? collection.products?.nodes?.[0]?.featuredImage;
          const layout = index === 0
            ? 'lg:col-span-7 lg:row-span-2 min-h-[420px]'
            : index === 1 || index === 2
              ? 'lg:col-span-5 min-h-[260px] lg:min-h-0'
              : 'lg:col-span-4 min-h-[280px] lg:min-h-0';
          return (
          <Reveal
            key={collection.id}
            delay={index * 60}
            as={Link}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
            className={`relative flex flex-col justify-end p-7 cursor-pointer overflow-hidden group border border-black/5 rounded-2xl ${layout} ${collection.isAll ? 'bg-brand-accent' : 'bg-brand-surface-light'}`}
          >
            {image && !collection.isAll ? (
              <Image
                data={image}
                alt={image.altText || collection.title}
                loading={index < 3 ? 'eager' : 'lazy'}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
              />
            ) : (
              <div className={`absolute inset-0 uniinx-fabric ${collection.isAll ? 'opacity-20' : 'bg-brand-surface-light'}`} />
            )}
            <div className={`absolute inset-0 ${collection.isAll ? 'bg-gradient-to-br from-white/10 to-black/20' : 'bg-gradient-to-t from-black/75 via-black/10 to-transparent'}`} />

            <div className="relative z-10">
              <h3 className="font-marcellus text-2xl md:text-3xl tracking-wide text-white uppercase group-hover:translate-x-1 transition-transform duration-300">
                {collection.isAll ? 'All Collections' : collection.title}
              </h3>
              {collection.description ? (
                <p className="font-work text-xs leading-relaxed text-white/70 mt-2 line-clamp-2 max-w-sm">
                  {collection.description}
                </p>
              ) : null}
              <span className="font-work text-[10px] tracking-wide text-white/75 uppercase block mt-4">
                {collection.isAll ? 'Shop everything →' : 'Explore collection →'}
              </span>
            </div>
          </Reveal>
          );
        })}
      </div>

      <Link
        to="/collections"
        prefetch="intent"
        className="sm:hidden inline-flex mt-8 font-work text-[10px] tracking-[0.16em] uppercase text-black/55"
      >
        View all collections →
      </Link>
    </section>
  );
}

export default DepartmentBand;
