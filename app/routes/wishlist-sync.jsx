import {data} from 'react-router';
import {CUSTOMER_WISHLIST_QUERY} from '~/graphql/customer-account/WishlistQuery';
import {WISHLIST_SYNC_MUTATION} from '~/graphql/customer-account/WishlistSyncMutation';

const WISHLIST_METAFIELD_NAMESPACE = 'custom';
const WISHLIST_METAFIELD_KEY = 'wishlist';

/**
 * Resource route (no UI) that lets the signed-in customer's wishlist be
 * read from and written to a `custom.wishlist` customer metafield. The
 * local, localStorage-backed wishlist in WishlistContext is the source of
 * truth for guests; this route only exists to sync it once a customer is
 * authenticated.
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  if (!(await customerAccount.isLoggedIn())) {
    return data({items: null});
  }

  const {data: queryData, errors} = await customerAccount.query(
    CUSTOMER_WISHLIST_QUERY,
  );
  if (errors?.length || !queryData?.customer) {
    return data({items: null});
  }

  const items = parseWishlistValue(queryData.customer.metafield?.value);
  return data({items});
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;
  if (!(await customerAccount.isLoggedIn())) {
    return data({ok: false, error: 'Not signed in'}, {status: 401});
  }

  const form = await request.formData();
  const raw = form.get('wishlist');
  const items = typeof raw === 'string' ? parseWishlistValue(raw) : null;
  if (!Array.isArray(items)) {
    return data({ok: false, error: 'Invalid wishlist payload'}, {status: 400});
  }

  const {data: queryData, errors: queryErrors} = await customerAccount.query(
    CUSTOMER_WISHLIST_QUERY,
  );
  const customerId = queryData?.customer?.id;
  if (queryErrors?.length || !customerId) {
    return data({ok: false, error: 'Unable to resolve customer'}, {status: 400});
  }

  const {data: mutationData, errors} = await customerAccount.mutate(
    WISHLIST_SYNC_MUTATION,
    {
      variables: {
        metafields: [
          {
            ownerId: customerId,
            namespace: WISHLIST_METAFIELD_NAMESPACE,
            key: WISHLIST_METAFIELD_KEY,
            type: 'json',
            value: JSON.stringify(items),
          },
        ],
      },
    },
  );

  if (errors?.length || mutationData?.metafieldsSet?.userErrors?.length) {
    return data({ok: false, error: 'Failed to sync wishlist'}, {status: 400});
  }

  return data({ok: true});
}

function parseWishlistValue(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** @typedef {import('./+types/wishlist-sync').Route} Route */
