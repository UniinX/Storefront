// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    totalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    fulfillments(first: 10) {
      nodes {
        status
        trackingInformation {
          number
          url
          company
        }
      }
    }
    id
    number
    confirmationNumber
    processedAt
    lineItems(first: 10) {
      nodes {
        id
        title
        quantity
        variantTitle
        image {
          url
          altText
          width
          height
        }
      }
    }
  }

  fragment Customer on Customer {
    id
    firstName
    lastName
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
    defaultAddress {
      ...Address
    }
    addresses(first: 100) {
      nodes {
        ...Address
      }
    }
    orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
      nodes {
        ...OrderItem
      }
      pageInfo { hasNextPage }
    }
  }
  fragment Address on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
`;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
`;
