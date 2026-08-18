import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe, expect, it} from 'vitest';
import {ThemeSwipeBar} from './ThemeSwipeBar.jsx';

describe('ThemeSwipeBar', () => {
  it('switches theme in the URL while preserving filters and clearing pagination', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/collections/all?language=Telugu&theme=Solids&cursor=abc&direction=next',
        ]}
      >
        <ThemeSwipeBar
          themes={['Solids', 'Antariksham', 'Language Editions']}
          activeTheme="Solids"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', {name: /Solids/i})).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', {name: /Antariksham/i})).toHaveAttribute(
      'href',
      '/collections/all?language=Telugu&theme=Antariksham',
    );
    expect(screen.getByRole('link', {name: /All themes/i})).toHaveAttribute(
      'href',
      '/collections/all?language=Telugu',
    );
  });

  it('supports touch-style horizontal navigation without buttons', () => {
    render(
      <MemoryRouter>
        <ThemeSwipeBar themes={['Solids', 'Antariksham']} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('link', {name: /Antariksham/i}));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
