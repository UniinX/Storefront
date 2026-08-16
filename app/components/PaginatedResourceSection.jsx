import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
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
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className={className}>
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

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const link = linkRef.current;
        const href = link?.getAttribute('href');
        if (
          !entry?.isIntersecting ||
          isLoading ||
          !href ||
          requestedHrefRef.current === href
        ) {
          return;
        }
        requestedHrefRef.current = href;
        link.click();
      },
      {rootMargin: '600px 0px'},
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading]);

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
