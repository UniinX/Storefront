import {act} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {Hero} from './Hero.jsx';

describe('Hero', () => {
  it('uses the full Figma artwork with separate parallax media and copy layers', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('hero-parallax-media')).toHaveAttribute(
      'src',
      expect.stringContaining('HeroSectionBg01JPGWithText.jpg'),
    );
    expect(screen.getByTestId('hero-parallax-copy')).toBeInTheDocument();
    expect(screen.getByTestId('home-hero')).toHaveAttribute(
      'data-figma-grid',
      '1440/1320/60',
    );
    expect(screen.getByTestId('home-hero')).toHaveClass('lg:min-h-[992px]');
    expect(screen.queryByTestId('hero-contrast-overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-mobile-gradient')).toHaveClass(
      'bg-[linear-gradient(180deg,rgba(0,0,0,0)_44%,rgba(0,0,0,0.38)_68%,rgba(0,0,0,0.78)_100%)]',
      'sm:hidden',
    );
    expect(screen.getByTestId('hero-parallax-copy')).toHaveClass(
      'text-white',
      '[text-shadow:none]',
      'sm:text-black',
      'sm:[text-shadow:0_1px_18px_rgba(255,255,255,0.55)]',
    );
    expect(
      screen.queryByText(/Campaign image placeholder/i),
    ).not.toBeInTheDocument();
  });

  it('animates the headline through supported languages, keeping a stable accessible name', () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const heading = screen.getByRole('heading', {
      name: 'Clothes in your Language',
    });
    expect(heading).toHaveTextContent('Language');

    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(heading).toHaveTextContent('भाषा');
    expect(heading).toHaveAccessibleName('Clothes in your Language');

    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(heading).toHaveTextContent('భాష');
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
