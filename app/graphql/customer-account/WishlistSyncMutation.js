// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/metafieldsSet
export const WISHLIST_SYNC_MUTATION = `#graphql
  mutation WishlistSync($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;
