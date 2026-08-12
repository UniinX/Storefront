import {Link} from 'react-router';
import {CollectionTile} from './DepartmentBand.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';
import categoryTshirt from '~/assets/home/category-tshirt.webp';
import hoodieImage from '~/assets/home/hoodie.webp';
import joggersImage from '~/assets/home/joggers.webp';
import oversizedTeeImage from '~/assets/home/oversized-tee.webp';

const CATEGORY_SLOTS = [
  {
    title: 'T-Shirts',
    eyebrow: 'Browse',
    fallbackImages: [categoryTshirt],
    fallbackAlt: 'White T-shirt',
    matches: (title) =>
      /(t-?shirts?|tees?)/i.test(title) && !/oversized/i.test(title),
  },
  {
    title: 'Hoodies',
    eyebrow: 'Browse',
    fallbackImages: [hoodieImage],
    fallbackAlt: 'Sand-colored pullover hoodie',
    matches: (title) => /hoodies?/i.test(title) && !/oversized/i.test(title),
  },
  {
    title: 'Joggers',
    eyebrow: 'Browse',
    fallbackImages: [joggersImage],
    fallbackAlt: 'Sage green joggers',
    matches: (title) => /(joggers?|sweatpants?)/i.test(title),
  },
  {
    title: 'Oversized T-Shirts',
    eyebrow: 'Browse',
    fallbackImages: [oversizedTeeImage],
    fallbackAlt: 'Light blue oversized T-shirt',
    matches: (title) =>
      /(oversized.*(t-?shirts?|tees?)|(t-?shirts?|tees?).*oversized)/i.test(
        title,
      ),
  },
];

function selectCategories(collections) {
  return CATEGORY_SLOTS.map((slot, index) => {
    const linkedCollection = collections.find((collection) =>
      slot.matches(collection.title),
    );
    return {
      id: linkedCollection?.id ?? `category-placeholder-${index}`,
      title: slot.title,
      eyebrow: slot.eyebrow,
      handle: linkedCollection?.handle ?? 'all',
      fallbackImages: slot.fallbackImages,
      fallbackAlt: slot.fallbackAlt,
    };
  });
}

export function CategoryBento({collections = []}) {
  const categories = selectCategories(collections);
  const cardClasses = [
    'col-span-2 h-[260px] sm:col-span-1 sm:h-[300px] lg:col-span-5 lg:h-[clamp(260px,21.25vw,408px)] lg:min-h-0',
    'h-[220px] sm:h-[300px] lg:col-span-4 lg:h-[clamp(260px,21.25vw,408px)] lg:min-h-0',
    'h-[220px] sm:h-[300px] lg:col-span-4 lg:h-[clamp(260px,21.25vw,408px)] lg:min-h-0',
    'col-span-2 h-[260px] sm:col-span-1 sm:h-[300px] lg:col-span-8 lg:h-[clamp(260px,21.25vw,408px)] lg:min-h-0',
  ];

  return (
    <section
      className="uniinx-home-gutter bg-white py-10 sm:py-12 lg:py-12"
      aria-labelledby="shop-categories-title"
    >
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:gap-8">
        <Reveal className="col-span-2 flex flex-col items-start justify-center pb-4 sm:py-5 lg:col-span-3 lg:py-0 lg:pr-7">
          <h2
            id="shop-categories-title"
            aria-label="Shop by Categories"
            className="text-[clamp(34px,10vw,44px)] font-normal leading-[0.95] tracking-[-0.055em] sm:text-[clamp(36px,4.2vw,60px)]"
          >
            Shop by
            <br />
            Categories
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-6 text-black/65">
            Find the silhouette you want, then make it yours in the language
            that feels like home.
          </p>
          <Link
            to="/collections/all"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-black px-6 text-sm font-medium"
          >
            Browse Categories
          </Link>
        </Reveal>

        {categories.map((collection, index) => (
          <CollectionTile
            key={collection.id}
            collection={collection}
            delay={index * 75}
            className={cardClasses[index]}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryBento;
