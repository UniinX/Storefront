/** @file Tests for Reveal motion component. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reveal } from './Reveal.jsx';

describe('Reveal', () => {
  it('renders children', () => {
    render(<Reveal>Hello</Reveal>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies reveal class', () => {
    const { container } = render(<Reveal>test</Reveal>);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('renders as a custom tag via `as` prop', () => {
    render(<Reveal as="section" data-testid="sec">content</Reveal>);
    expect(screen.getByTestId('sec').tagName).toBe('SECTION');
  });

  it('applies transitionDelay from delay prop', () => {
    const { container } = render(<Reveal delay={200}>test</Reveal>);
    expect(container.firstChild).toHaveStyle({ transitionDelay: '200ms' });
  });
});
