import {act, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {PaginatedResourceSection} from './PaginatedResourceSection.jsx';

const nextPage = vi.fn((event) => event.preventDefault());

vi.mock('@shopify/hydrogen', async () => {
  const React = await import('react');
  const NextLink = React.forwardRef(function MockNextLink(props, ref) {
    const {children, ...linkProps} = props;
    return (
      <a
        {...linkProps}
        ref={ref}
        href="/?cursor=next"
        onClick={nextPage}
      >
        {children}
      </a>
    );
  });
  const PreviousLink = React.forwardRef(function MockPreviousLink(props, ref) {
    return null;
  });

  return {
    Pagination: ({children, connection}) =>
      children({
        nodes: connection.nodes,
        isLoading: false,
        PreviousLink,
        NextLink,
      }),
  };
});

afterEach(() => {
  nextPage.mockClear();
  vi.unstubAllGlobals();
});

describe('PaginatedResourceSection', () => {
  it('automatically requests the next product page without showing a next button', () => {
    let onIntersection;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class IntersectionObserver {
        constructor(callback) {
          onIntersection = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );

    render(
      <PaginatedResourceSection
        connection={{nodes: [{id: 'product-1'}]}}
        ariaLabel="Products"
        autoLoadNext
      >
        {({node}) => <div key={node.id}>{node.id}</div>}
      </PaginatedResourceSection>,
    );

    expect(screen.queryByText(/^Next/)).not.toBeInTheDocument();
    expect(observe).toHaveBeenCalledTimes(1);

    act(() => onIntersection([{isIntersecting: true}]));
    act(() => onIntersection([{isIntersecting: true}]));

    expect(nextPage).toHaveBeenCalledTimes(1);
  });
});
