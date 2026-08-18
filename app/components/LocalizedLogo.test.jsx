import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {LocalizedLogo, getLogoForLanguage} from './LocalizedLogo.jsx';

describe('LocalizedLogo', () => {
  it('uses the active language logo', () => {
    render(<LocalizedLogo language="tamil" />);

    expect(screen.getByAltText('UniinX logo in Tamil').getAttribute('src'))
      .toContain('Logo_Tamil.svg');
  });

  it('falls back to English when no dedicated logo exists', () => {
    expect(getLogoForLanguage('bengali')).toBe(getLogoForLanguage('english'));
  });

  it('normalizes language names before selecting an asset', () => {
    expect(getLogoForLanguage(' Hindi ')).toBe(getLogoForLanguage('hindi'));
  });
});
