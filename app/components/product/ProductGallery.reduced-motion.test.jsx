import {describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import {ProductGallery} from './ProductGallery';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {...actual, useReducedMotion: () => true};
});

const images = [
  {id: 'img-1', url: 'https://cdn.example.com/1.jpg', altText: 'Front view'},
  {id: 'img-2', url: 'https://cdn.example.com/2.jpg', altText: null},
];

describe('ProductGallery with prefers-reduced-motion', () => {
  it('never starts playing automatically — renders only the real images, no duplicated loop copy', () => {
    const {container} = render(
      <ProductGallery images={images} productTitle="Just Grow Hoodie" />,
    );
    expect(container.querySelectorAll('img')).toHaveLength(images.length);
  });
});
