/** @file Tests for ProductGallery. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGallery } from './ProductGallery.jsx';

const heroImage = { id: 'gid://shopify/ProductImage/1', url: 'https://example.com/hero.jpg', altText: 'Hero' };
const otherImage = { id: 'gid://shopify/ProductImage/2', url: 'https://example.com/other.jpg', altText: 'Other' };

describe('ProductGallery', () => {
  it('renders the fabric placeholder when there are no images at all', () => {
    render(<ProductGallery image={null} images={[]} language={null} />);
    expect(screen.getByText('Garment photography placeholder')).toBeInTheDocument();
  });

  it('renders the hero image when a variant image is present', () => {
    render(<ProductGallery image={heroImage} images={[heroImage]} language={null} />);
    expect(screen.getByAltText('Hero')).toBeInTheDocument();
    expect(screen.queryByText('Garment photography placeholder')).not.toBeInTheDocument();
  });

  it('stacks the remaining product images below the hero, excluding the hero itself', () => {
    render(<ProductGallery image={heroImage} images={[heroImage, otherImage]} language={null} />);
    expect(screen.getByAltText('Hero')).toBeInTheDocument();
    expect(screen.getByAltText('Other')).toBeInTheDocument();
    // Only one instance of the hero image renders — it isn't duplicated into the stacked list.
    expect(screen.getAllByAltText('Hero')).toHaveLength(1);
  });
});
