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
            <PreviousLink className={previousClassName}>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  <span aria-hidden="true">↑</span> Load previous
                </span>
              )}
            </PreviousLink>
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
            <NextLink className={nextClassName}>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  Load more <span aria-hidden="true">↓</span>
                </span>
              )}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
