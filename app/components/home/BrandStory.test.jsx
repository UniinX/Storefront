/** @file Tests for BrandStory. */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandStory } from './BrandStory.jsx';

describe('BrandStory', () => {
  it('renders the heading and main story content', () => {
    render(<BrandStory />);
    expect(screen.getByText(/India's Script As/i)).toBeInTheDocument();
    expect(screen.getByText(/Design Material/i)).toBeInTheDocument();
    expect(screen.getByText(/About UniinX/i)).toBeInTheDocument();
  });

  it('renders the interactive region nodes', () => {
    render(<BrandStory />);
    expect(screen.getByText('North')).toBeInTheDocument();
    expect(screen.getByText('East')).toBeInTheDocument();
    expect(screen.getByText('South')).toBeInTheDocument();
    expect(screen.getByText('West')).toBeInTheDocument();
  });

  it('initially renders the Northern Region and corresponding coordinates', () => {
    const { container } = render(<BrandStory />);
    expect(screen.getByText('Northern Region')).toBeInTheDocument();
    
    // Default active region is North (angle 270)
    // x2 = 50 + 40 * cos(270) = 50%
    // y2 = 50 + 40 * sin(270) = 10%
    const line = container.querySelector('line');
    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute('x1', '50%');
    expect(line).toHaveAttribute('y1', '50%');
    expect(line).toHaveAttribute('x2', '50%');
    expect(line).toHaveAttribute('y2', '10%');
  });

  it('updates active region label and line coordinates on hover or click', () => {
    const { container } = render(<BrandStory />);
    
    // Click East button
    const eastButton = screen.getByText('East');
    fireEvent.click(eastButton);
    
    expect(screen.getByText('Eastern Region')).toBeInTheDocument();
    
    // East angle is 0
    // x2 = 50 + 40 * cos(0) = 90%
    // y2 = 50 + 40 * sin(0) = 50%
    const line = container.querySelector('line');
    expect(line).toHaveAttribute('x2', '90%');
    expect(line).toHaveAttribute('y2', '50%');
  });

  it('renders Tamil quote when language !== english', () => {
    render(<BrandStory language="tamil" />);
    expect(screen.getByText(/"ஒவ்வொரு மொழிக்கும், ஒவ்வொரு மாநிலத்திற்கும், இந்தியாவுக்கு."/i)).toBeInTheDocument();
  });
});
