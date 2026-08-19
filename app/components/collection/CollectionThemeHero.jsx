import {Image} from '@shopify/hydrogen';
import collectionsHero from '~/assets/collections/collections-hero.webp';
import solidsHero from '~/assets/collections/solids-hero.webp';

/**
 * Photography-led collection masthead based on the Figma collection templates.
 * Shopify collection art wins for dynamic collections; Solids keeps the exact
 * authored artwork from the supplied Figma template.
 *
 * `hideImage` skips the photography entirely for a plain text masthead — used
 * on the full product catalog, which isn't really "a collection" and doesn't
 * have a specific image to represent it.
 */
export function CollectionThemeHero({
  title,
  description,
  image,
  directory = false,
  artwork = 'detail',
  hideImage = false,
}) {
  if (hideImage) {
    return (
      <section className="relative bg-background pb-10 pt-[104px] sm:pb-12 sm:pt-[128px] lg:pt-[152px]">
        {/* Matches the max-width + horizontal padding of the content
            section below, so the heading's left edge lines up with the
            filters/product grid rather than drifting apart on wide
            viewports (the section below is capped at 1440px and centered;
            this wasn't). */}
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[60px]">
          <h1 className="text-[clamp(28px,3vw,42px)] font-medium leading-tight tracking-[-0.04em]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
              {description}
            </p>
          )}
        </div>
      </section>
    );
  }

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
        <div className="relative z-10 -mt-11 rounded-t-[30px] bg-white px-5 pb-6 pt-8 sm:px-8 lg:px-[60px]">
          <h1 className="text-[clamp(28px,3vw,42px)] font-medium leading-tight tracking-[-0.04em]">
            {title}
          </h1>
        </div>
      )}
    </section>
  );
}

export default CollectionThemeHero;
