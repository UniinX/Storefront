import {Image} from '@shopify/hydrogen';
import {Link, useLocation} from 'react-router';

/**
 * Keep a selected option only when the destination product exposes the same
 * option and value. This prevents a color/size from one product family member
 * producing an unavailable selection on another member.
 */
export function getCompatibleOptionSearch(search, options = []) {
  const current = new URLSearchParams(search);
  const next = new URLSearchParams();

  for (const option of options) {
    const currentEntry = Array.from(current.entries()).find(
      ([name]) => name.toLowerCase() === option.name.toLowerCase(),
    );
    if (!currentEntry) continue;

    const [, selectedValue] = currentEntry;
    const compatibleValue = option.optionValues?.find(
      ({name}) => name.toLowerCase() === selectedValue.toLowerCase(),
    );
    if (compatibleValue) next.set(option.name, compatibleValue.name);
  }

  const query = next.toString();
  return query ? `?${query}` : '';
}

function getFamilyValue(product) {
  return (
    product.familyColor?.value || product.familyValue?.value || product.title
  );
}

function getProductSwatch(product, familyValue) {
  const colorOption = product.options?.find((option) =>
    /colou?r/i.test(option.name),
  );
  const matchingValue = colorOption?.optionValues?.find(
    ({name}) => name.toLowerCase() === familyValue.toLowerCase(),
  );
  return matchingValue?.swatch;
}

export function ProductFamilySelector({currentProduct, family}) {
  const {search} = useLocation();
  const referencedProducts = family?.products?.references?.nodes ?? [];
  const products = [...referencedProducts];

  if (!products.some(({id}) => id === currentProduct.id)) {
    products.unshift(currentProduct);
  }

  if (products.length < 2) return null;

  const familyName = family?.name?.value || 'Product family';
  const currentValue = getFamilyValue(currentProduct);

  return (
    <fieldset className="flex flex-col gap-3 min-w-0">
      <legend className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
        {familyName}:{' '}
        <span className="normal-case font-normal text-black/60 dark:text-white/55">
          {currentValue}
        </span>
      </legend>
      <div
        className="flex flex-wrap gap-3"
        aria-label={`${familyName} choices`}
      >
        {products.map((item) => {
          const selected = item.id === currentProduct.id;
          const value = getFamilyValue(item);
          const swatch = getProductSwatch(item, value);
          const swatchImage = swatch?.image?.previewImage?.url;
          const image = item.featuredImage;
          const unavailable = !item.availableForSale;
          const to = `/products/${item.handle}${getCompatibleOptionSearch(
            search,
            item.options,
          )}`;

          return (
            <Link
              key={item.id}
              to={to}
              preventScrollReset
              aria-current={selected ? 'page' : undefined}
              aria-label={`${value}${unavailable ? ', sold out' : ''}${selected ? ', selected' : ''}`}
              title={`${value}${unavailable ? ' — Sold out' : ''}`}
              className={`group relative w-12 h-12 overflow-hidden border transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent ${
                selected
                  ? 'ring-2 ring-black dark:ring-white border-transparent'
                  : 'border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40'
              } ${unavailable ? 'opacity-45' : ''}`}
            >
              {swatchImage ? (
                <img
                  src={swatchImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : swatch?.color ? (
                <span
                  aria-hidden="true"
                  className="block w-full h-full"
                  style={{backgroundColor: swatch.color}}
                />
              ) : image ? (
                <Image
                  data={image}
                  alt=""
                  sizes="48px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex w-full h-full items-center justify-center bg-black/5 dark:bg-white/10 text-[9px] uppercase">
                  {value.slice(0, 2)}
                </span>
              )}
              {unavailable && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_47%,currentColor_48%,currentColor_52%,transparent_53%)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </fieldset>
  );
}
