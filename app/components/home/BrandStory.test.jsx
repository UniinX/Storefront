/** @file Tests for the Figma design-language wheel. */
import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {BrandStory} from './BrandStory.jsx';

const LANGUAGES = [
  'Telugu',
  'Hindi',
  'English',
  'Tamil',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Odia',
];

describe('BrandStory', () => {
  it('renders the story and the designated 361px square language region', () => {
    const {container} = render(<BrandStory />);
    expect(
      screen.getByText(/India's Script As Design Material/i),
    ).toBeInTheDocument();
    const selector = screen.getByRole('group', {
      name: 'Select design language',
    });
    expect(selector).toHaveClass(
      'w-[min(90vw,340px)]',
      'sm:w-[min(82vw,361px)]',
    );
    expect(selector).toHaveAttribute('data-pattern', 'square');
    expect(container.querySelectorAll('svg rect')).toHaveLength(2);
    expect(container.querySelector('svg circle')).not.toBeInTheDocument();
  });

  it('offers exactly the eight approved languages', () => {
    render(<BrandStory />);
    for (const language of LANGUAGES) {
      expect(
        screen.getByRole('button', {name: `Select ${language}`}),
      ).toBeInTheDocument();
    }
    expect(screen.getAllByRole('button', {name: /^Select /})).toHaveLength(8);
  });

  it('updates the animated preview and shared language preference on selection', async () => {
    const onLanguageChange = vi.fn();
    render(<BrandStory onLanguageChange={onLanguageChange} />);
    fireEvent.click(screen.getByRole('button', {name: 'Select Tamil'}));

    expect(onLanguageChange).toHaveBeenCalledWith('tamil');
    expect(await screen.findByText('யூனிங்க்ஸ்')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Select Tamil'})).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
