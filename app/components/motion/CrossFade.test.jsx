/** @file Tests for CrossFade motion component. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrossFade } from './CrossFade.jsx';

describe('CrossFade', () => {
  it('renders children', () => {
    render(<CrossFade keyId="a"><span>visible</span></CrossFade>);
    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('applies transition styles', () => {
    const { container } = render(<CrossFade keyId="a"><span>hi</span></CrossFade>);
    expect(container.firstChild).toHaveStyle({ opacity: '1' });
  });
});
