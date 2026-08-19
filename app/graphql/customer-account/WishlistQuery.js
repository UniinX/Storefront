// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist {
    customer {
      id
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;
