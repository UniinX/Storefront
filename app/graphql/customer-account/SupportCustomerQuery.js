export const SUPPORT_CUSTOMER_QUERY = `#graphql
  query SupportCustomer($language: LanguageCode) @inContext(language: $language) {
    customer {
      id
      emailAddress { emailAddress }
      orders(first: 100, sortKey: PROCESSED_AT, reverse: true) {
        nodes { number }
      }
    }
  }
`;
