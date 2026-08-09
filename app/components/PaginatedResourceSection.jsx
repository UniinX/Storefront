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
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
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
              <PreviousLink className={previousClassName}>
                {isLoading ? 'Loading...' : <span><span aria-hidden="true">↑</span> Previous</span>}
              </PreviousLink>
              <NextLink className={nextClassName}>
                {isLoading ? 'Loading...' : <span>Next <span aria-hidden="true">↓</span></span>}
              </NextLink>
            </nav>
          </div>
        );
      }}
    </Pagination>
  );
}
