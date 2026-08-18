import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {LanguageShowcase} from './LanguageShowcase.jsx';

describe('LanguageShowcase', () => {
  it('renders the eight approved languages inside the curved transition', () => {
    const {container} = render(<LanguageShowcase language="english" />);

    expect(container.firstChild).toHaveClass(
      'rounded-t-[28px]',
      'sm:rounded-t-[30px]',
    );
    expect(screen.getByTestId('language-scroll')).toHaveClass(
      'overflow-x-auto',
      'snap-mandatory',
      'sm:grid',
    );
    expect(document.querySelector('#home-lang-english')).not.toHaveClass(
      'rounded-2xl',
      'border',
      'bg-black',
    );
    expect(screen.getAllByRole('button')).toHaveLength(8);
    for (const language of [
      'Telugu',
      'Hindi',
      'English',
      'Tamil',
      'Malayalam',
      'Kannada',
      'Bengali',
      'Odia',
    ]) {
      expect(screen.getByText(language)).toBeInTheDocument();
    }
  });

  it('updates the shared language when a wordmark is chosen', () => {
    const onLanguageChange = vi.fn();
    render(
      <LanguageShowcase
        language="english"
        onLanguageChange={onLanguageChange}
      />,
    );

    fireEvent.click(document.querySelector('#home-lang-telugu'));
    expect(onLanguageChange).toHaveBeenCalledWith('telugu');
  });
});
