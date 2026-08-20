import {useCallback, useState} from 'react';

/**
 * Tracks the true accumulated/deduped product count for an infinite-scroll
 * catalog grid. A route loader only ever computes totalCount/hasMoreResults
 * from its own single fetched page, so that value goes stale (or misleadingly
 * stays put) as `<PaginatedResourceSection>` accumulates more pages
 * client-side — pass the loader's values in as the initial seed here (for
 * the first server-rendered paint), then pass the returned
 * `onVisibleCountChange` into `<PaginatedResourceSection>` to keep the
 * displayed count in sync with what's actually accumulated on screen.
 * @param {number} initialCount
 * @param {boolean} initialHasMore
 */
export function useVisibleCatalogCount(initialCount, initialHasMore) {
  const [state, setState] = useState({
    count: initialCount,
    hasMore: initialHasMore,
  });
  const onVisibleCountChange = useCallback((count, hasNextPage) => {
    setState({count, hasMore: Boolean(hasNextPage)});
  }, []);
  return [state, onVisibleCountChange];
}
