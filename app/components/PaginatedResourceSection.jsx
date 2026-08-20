import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

function dedupeNodes(nodes, getKey) {
  const seen = new Set();
  const result = [];
  for (const node of nodes) {
    const key = getKey(node);
    if (key) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    result.push(node);
  }
  return result;
}

/**
 * Reports the accumulated, deduped visible count back to the caller. A real
 * component (not a plain call inside the <Pagination> render-prop) so its
 * `useEffect` gets its own fiber — hooks called directly inside a render
 * prop invoked by another component attach to *that* component's fiber,
 * which is fragile and not how this should be done.
 */
function VisibleCountReporter({count, hasNextPage, onVisibleCountChange}) {
  React.useEffect(() => {
    onVisibleCountChange?.(count, hasNextPage);
  }, [count, hasNextPage, onVisibleCountChange]);
  return null;
}

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 * @param {(node: unknown) => string | null | undefined} [dedupeKey] Collapses
 *   nodes sharing the same key down to the first one seen, applied to the
 *   full cross-page accumulated list `<Pagination>` builds up — not just the
 *   current page — so it also catches a duplicate whose sibling appeared on
 *   an earlier page (e.g. two color variants of the same product family
 *   split across page boundaries, which per-page server-side dedup can't see).
 * @param {(count: number, hasNextPage: boolean) => void} [onVisibleCountChange]
 *   Called whenever the accumulated (deduped) visible count changes — use
 *   this instead of a loader's own `totalCount`/`hasMoreResults` for any
 *   on-screen "N Products" label, since the loader only ever sees its own
 *   single fetched page, not what `<Pagination>` has accumulated so far.
 */
export function PaginatedResourceSection({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
  previousClassName,
  nextClassName,
  autoLoadNext = false,
  className,
  dedupeKey,
  onVisibleCountChange,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, hasNextPage, PreviousLink, NextLink}) => {
        const dedupedNodes = dedupeKey ? dedupeNodes(nodes, dedupeKey) : nodes;
        const resourcesMarkup = dedupedNodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className={className}>
            {onVisibleCountChange ? (
              <VisibleCountReporter
                count={dedupedNodes.length}
                hasNextPage={hasNextPage}
                onVisibleCountChange={onVisibleCountChange}
              />
            ) : null}
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <nav aria-label={ariaLabel ? `${ariaLabel} pagination` : 'Pagination'} className="mt-8 flex items-center justify-center gap-3">
              {autoLoadNext ? (
                <AutoLoadNext NextLink={NextLink} isLoading={isLoading} />
              ) : (
                <NextLink className={nextClassName}>
                  {isLoading ? 'Loading...' : <span>Next <span aria-hidden="true">↓</span></span>}
                </NextLink>
              )}
            </nav>
          </div>
        );
      }}
    </Pagination>
  );
}

function AutoLoadNext({NextLink, isLoading}) {
  const sentinelRef = React.useRef(null);
  const linkRef = React.useRef(null);
  const requestedHrefRef = React.useRef(null);
  const isLoadingRef = React.useRef(isLoading);
  // IntersectionObserver only fires on a *transition* (entering/leaving),
  // not continuously while already intersecting — so this tracks the last
  // known state to re-check after a load settles, for pages short enough
  // that the sentinel never actually leaves the viewport between loads.
  const isIntersectingRef = React.useRef(false);
  isLoadingRef.current = isLoading;

  // Recreating the IntersectionObserver on every loading-state transition
  // (the previous approach) caused an immediate re-check each time
  // (observe() fires synchronously for an already-visible target), which
  // auto-refired the "next page" click far faster than each navigation
  // could settle. Since Hydrogen's <Pagination> accumulates nodes through
  // React Router's navigation `state`, overlapping `replace: true`
  // navigations raced each other and dropped whichever page's nodes
  // weren't read before the next one committed — cursors kept advancing
  // (jumping multiple pages per apparent "load") while the rendered
  // product count stayed frozen, and pagination exhausted itself almost
  // immediately instead of progressing with the user's scroll.
  const maybeLoadNext = React.useCallback(() => {
    const link = linkRef.current;
    const href = link?.getAttribute('href');
    if (
      !isIntersectingRef.current ||
      isLoadingRef.current ||
      !href ||
      requestedHrefRef.current === href
    ) {
      return;
    }
    requestedHrefRef.current = href;
    link.click();
  }, []);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = Boolean(entry?.isIntersecting);
        maybeLoadNext();
      },
      {rootMargin: '600px 0px'},
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // Mount once — the observer's own callback (above) re-evaluates on
    // every real crossing event without needing to be recreated.
  }, [maybeLoadNext]);

  // A load just finished — re-check with the latest known intersection
  // state instead of waiting for a fresh crossing event, since one won't
  // come if the sentinel never left the viewport between loads (e.g. a
  // short page, or several small pages loading in quick succession).
  React.useEffect(() => {
    if (!isLoading) maybeLoadNext();
  }, [isLoading, maybeLoadNext]);

  return (
    <div
      ref={sentinelRef}
      className="flex min-h-12 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <NextLink ref={linkRef} className="sr-only" aria-label="Load more products">
        Load more products
      </NextLink>
      {isLoading ? (
        <span className="text-xs text-black/50">Loading more products…</span>
      ) : null}
    </div>
  );
}
