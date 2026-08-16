import {useFetchers, useLoaderData, data} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartPage} from '~/components/cart/CartPage.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `UniinX | Cart`}];
};

/**
 * @type {HeadersFunction}
 */
export const headers = ({actionHeaders, loaderHeaders}) => {
  const headers = new Headers(loaderHeaders);
  actionHeaders.forEach((value, key) => headers.set(key, value));
  return headers;
};

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine discount codes already applied on cart
      discountCodes.push(...(inputs.discountCodes ?? []));

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (
    typeof redirectTo === 'string' &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//')
  ) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {cart, env, storefront} = context;

  const recommendedProducts = storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {cache: storefront.CacheShort()})
    .catch((error) => {
      console.error(error);
      return null;
    });

  return data({
    cart: await cart.get(),
    recommendedProducts,
    testMode: env.SHOPIFY_TEST_MODE === 'true',
  }, {
    headers: {'Cache-Control': 'private, no-store'},
  });
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const {cart, recommendedProducts, testMode} = useLoaderData();
  const mutationMessages = useFetchers().flatMap((fetcher) => [
    ...(fetcher.data?.errors ?? []),
    ...(fetcher.data?.warnings ?? []),
  ]);

  return (
    <CartPage
      cart={cart}
      mutationMessages={mutationMessages}
      recommendedProducts={recommendedProducts}
      testMode={testMode}
    />
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    availableForSale
    familyValue: metafield(namespace: "custom", key: "family_value") {
      value
    }
    color: metafield(namespace: "custom", key: "color") {
      value
    }
    productFamily: metafield(namespace: "custom", key: "product_family") {
      reference {
        __typename
        ... on Metaobject {
          id
          handle
          type
          name: field(key: "name") { value }
          slug: field(key: "slug") { value }
          products: field(key: "products") {
            references(first: 20) {
              nodes {
                ... on Product {
                  id
                  handle
                  title
                  availableForSale
                  familyValue: metafield(namespace: "custom", key: "family_value") { value }
                  color: metafield(namespace: "custom", key: "color") { value }
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
          }
        }
      }
    }
    collectionName: metafield(namespace: "custom", key: "collection_name") { value }
    category { id name }
    collections(first: 10) {
      nodes {
        id
        handle
        title
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query CartRecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
/** @typedef {ReturnType<typeof useActionData<typeof action>>} ActionReturnData */
