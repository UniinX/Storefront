import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {ProductGallery} from './ProductGallery';

const images = [
  {id: 'img-1', url: 'https://cdn.example.com/1.jpg', altText: 'Front view'},
  {id: 'img-2', url: 'https://cdn.example.com/2.jpg', altText: null},
];

describe('ProductGallery', () => {
  it('shows a placeholder when the product has no images', () => {
    render(<ProductGallery images={[]} productTitle="Just Grow Hoodie" />);
    expect(screen.getByText('Garment Preview Template')).toBeInTheDocument();
  });

  it('exposes exactly one accessible image per photo, with a meaningful alt', () => {
    const {container} = render(
      <ProductGallery images={images} productTitle="Just Grow Hoodie" />,
    );
    // getByRole respects aria-hidden, so this only sees the real (non-duplicate) copy.
    const accessibleImages = screen.getAllByRole('img');
    expect(accessibleImages).toHaveLength(images.length);
    expect(accessibleImages[0]).toHaveAttribute('alt', 'Front view');
    expect(accessibleImages[1]).toHaveAttribute('alt', 'Just Grow Hoodie view 2');

    // The loop duplicate exists in the DOM (for the seamless scroll effect) but is hidden.
    expect(container.querySelectorAll('[aria-hidden="true"] img')).toHaveLength(
      images.length,
    );
  });

  it('has no play/pause control — autoplay stops permanently on the user\'s first interaction', () => {
    render(<ProductGallery images={images} productTitle="Just Grow Hoodie" />);
    expect(
      screen.queryByRole('button', {name: /automatic image scrolling/}),
    ).not.toBeInTheDocument();
  });

  it('drops the duplicated loop copy once the user touches the strip, leaving only the real images', () => {
    const {container} = render(
      <ProductGallery images={images} productTitle="Just Grow Hoodie" />,
    );

    // While playing, the strip is duplicated for the seamless loop.
    expect(container.querySelectorAll('img')).toHaveLength(images.length * 2);

    const strip = screen.getByRole('group', {
      name: 'Just Grow Hoodie — product images',
    });
    fireEvent.pointerDown(strip);

    // Once stopped, only the original set remains — a manual scroll through
    // the strip now only ever encounters the real images, not a doubled set.
    expect(container.querySelectorAll('img')).toHaveLength(images.length);
    expect(strip.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it('keeps scrolling through page scroll — only interacting with the strip itself stops it', () => {
    const {container} = render(
      <ProductGallery images={images} productTitle="Just Grow Hoodie" />,
    );
    expect(container.querySelectorAll('img')).toHaveLength(images.length * 2);

    fireEvent.scroll(window);
    fireEvent.scroll(window);
    fireEvent.scroll(window);

    // Still playing — page scroll never touches the gallery's autoplay.
    expect(container.querySelectorAll('img')).toHaveLength(images.length * 2);
  });

  it('never resumes once stopped — there is no control to bring the loop back', () => {
    const {container} = render(
      <ProductGallery images={images} productTitle="Just Grow Hoodie" />,
    );
    const strip = screen.getByRole('group', {
      name: 'Just Grow Hoodie — product images',
    });
    fireEvent.pointerDown(strip);
    expect(container.querySelectorAll('img')).toHaveLength(images.length);

    // Further interaction (another touch, a page scroll) is a no-op — it
    // was already stopped, and stays stopped.
    fireEvent.pointerDown(strip);
    fireEvent.scroll(window);
    expect(container.querySelectorAll('img')).toHaveLength(images.length);
  });
});
