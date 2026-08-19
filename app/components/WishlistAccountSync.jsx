import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {useWishlist} from '~/context/WishlistContext.jsx';

/**
 * Invisible component that keeps the local, device-scoped wishlist (backed
 * by localStorage in WishlistContext, so it always works for guests) synced
 * with the signed-in customer's account once they're authenticated. Nothing
 * here ever gates wishlisting itself on auth — this only layers server
 * persistence on top once a customer is known.
 * @param {{isLoggedIn: boolean}}
 */
export function WishlistAccountSync({isLoggedIn}) {
  const {wishlist, isLoaded, mergeWishlist} = useWishlist();
  const loadFetcher = useFetcher();
  const syncFetcher = useFetcher();
  const hasRequestedRemote = useRef(false);
  const hasMergedRemote = useRef(false);
  const lastSyncedRef = useRef(null);

  // Once the customer is known to be signed in, fetch their previously
  // synced wishlist (if any) exactly once per session.
  useEffect(() => {
    if (!isLoggedIn || !isLoaded || hasRequestedRemote.current) return;
    hasRequestedRemote.current = true;
    loadFetcher.load('/wishlist-sync');
    // loadFetcher intentionally omitted: react-router fetchers are stable
    // across renders, including it would refire this effect needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isLoaded]);

  // Merge the remote list into the local one exactly once, after which the
  // merged result becomes the new source of truth on this device too.
  useEffect(() => {
    if (!loadFetcher.data || hasMergedRemote.current) return;
    if (loadFetcher.data.items) mergeWishlist(loadFetcher.data.items);
    hasMergedRemote.current = true;
  }, [loadFetcher.data, mergeWishlist]);

  // After the initial merge, push any subsequent local change back to the
  // account so it stays consistent across devices.
  useEffect(() => {
    if (!isLoggedIn || !hasMergedRemote.current) return;
    const serialized = JSON.stringify(wishlist);
    if (serialized === lastSyncedRef.current) return;
    lastSyncedRef.current = serialized;
    const formData = new FormData();
    formData.set('wishlist', serialized);
    syncFetcher.submit(formData, {method: 'POST', action: '/wishlist-sync'});
    // syncFetcher intentionally omitted, same reasoning as above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist, isLoggedIn]);

  return null;
}
