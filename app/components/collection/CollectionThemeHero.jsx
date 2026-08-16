import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import collectionsHero from '~/assets/collections/collections-hero.webp';
import solidsHero from '~/assets/collections/solids-hero.webp';

/**
 * Photography-led collection masthead based on the Figma collection templates.
 * Shopify collection art wins for dynamic collections; Solids keeps the exact
 * authored artwork from the supplied Figma template.
 */
export function CollectionThemeHero({
  title,
  description,
  image,
  directory = false,
  artwork = 'detail',
}) {
  const isSolids = /solid/i.test(title || '');
  const fallbackImage =
    directory || artwork === 'collections' ? collectionsHero : solidsHero;
  const showDynamicTitle = !directory && artwork !== 'collections' && !isSolids;
  const useShopifyImage = image && !isSolids;

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="relative aspect-[16/10] min-h-[420px] max-h-[820px] w-full sm:min-h-[560px] lg:min-h-[700px]">
        {useShopifyImage ? (
          <Image
            alt={image.altText || `${title} collection`}
            data={image}
            loading="eager"
            sizes="100vw"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <img
            alt={
              directory
                ? 'Folded garments arranged on a wooden chair'
                : 'Model wearing a black UniinX T-shirt'
            }
            src={fallbackImage}
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/35 to-transparent" />

        <nav
          aria-label="Breadcrumb"
          className="absolute left-5 top-18 sm:top-20 lg:top-22 z-10 flex min-h-11 items-center text-[11px] tracking-[-0.02em] text-black/70 sm:left-8 lg:left-[60px]"
        >
          <Link
            to="/"
            className="inline-flex min-h-11 items-center transition-opacity hover:opacity-55"
          >
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          {directory ? (
            <span>Collections</span>
          ) : (
            <>
              <Link
                to="/collections"
                className="inline-flex min-h-11 items-center transition-opacity hover:opacity-55"
              >
                Collections
              </Link>
              <span aria-hidden="true"> / </span>
              <span>{title}</span>
            </>
          )}
        </nav>

        {showDynamicTitle ? (
          <h1 className="absolute inset-x-5 top-1/2 z-10 -translate-y-1/2 text-center text-[clamp(64px,12vw,172px)] font-normal leading-none tracking-[-0.075em] text-[#d4ffee] drop-shadow-sm sm:inset-x-8">
            {title}
          </h1>
        ) : null}
      </div>

      {!directory ? (
        <div className="relative z-10 -mt-11 rounded-t-[30px] bg-white px-5 pb-8 pt-10 sm:px-8 lg:px-[60px]">
          <h1 className="text-[clamp(28px,3vw,42px)] font-medium leading-tight tracking-[-0.04em]">
            {title} Catalog
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
            {description ||
              `Explore products featuring ${title.toLowerCase()}.`}
          </p>
        </div>
      ) : (
        <div className="relative z-10 -mt-11 h-16 rounded-t-[30px] bg-white" />
      )}
    </section>
  );
}

export default CollectionThemeHero;
