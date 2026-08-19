import {Link, useLocation} from 'react-router';
import {getCompatibleOptionSearch} from '~/components/product/ProductFamilySelector.jsx';

function getLanguageValue(product) {
  return product.language?.value || product.title;
}

/**
 * Lets a shopper switch between language variants of the same design
 * (mirroring how `ProductFamilySelector` switches between colors), driven
 * by a `custom.language_family` metaobject reference — the same pattern as
 * `custom.product_family`. This is a placeholder in the sense that it's
 * fully wired up but stays invisible: nothing in the store currently sets
 * that metaobject relationship, so it renders nothing until a merchant
 * actually links language variants together in Shopify admin. Also refuses
 * to render if a member is missing a `language` value, rather than falling
 * back to a product title that would read like a broken label.
 */
export function LanguageFamilySelector({currentProduct, languageFamily}) {
  const {search} = useLocation();
  const referencedProducts = languageFamily?.products?.references?.nodes ?? [];
  const products = [...referencedProducts];

  if (!products.some(({id}) => id === currentProduct.id)) {
    products.unshift(currentProduct);
  }

  const hasLanguageData = products.every((item) => Boolean(item.language?.value));
  if (products.length < 2 || !hasLanguageData) return null;

  const familyName = languageFamily?.name?.value || 'Language';
  const currentValue = getLanguageValue(currentProduct);

  return (
    <fieldset className="flex flex-col gap-3 min-w-0">
      <legend className="text-[10px] tracking-wider uppercase text-black/45 dark:text-white/35 font-semibold">
        {familyName}:{' '}
        <span className="normal-case font-normal text-black/60 dark:text-white/55">
          {currentValue}
        </span>
      </legend>
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none"
        aria-label={`${familyName} choices`}
      >
        {products.map((item) => {
          const selected = item.id === currentProduct.id;
          const value = getLanguageValue(item);
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
              title={unavailable ? `${value} — Sold out` : value}
              className={`flex min-h-11 shrink-0 items-center justify-center rounded-full border px-4 text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent ${
                selected
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40'
              } ${unavailable ? 'opacity-45' : ''}`}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </fieldset>
  );
}
