import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe, expect, it, vi} from 'vitest';
import {AboutPage} from './AboutPage.jsx';

vi.mock('~/components/home/BrandStory.jsx', () => ({
  BrandStory: () => <section>Design language story</section>,
}));

describe('AboutPage', () => {
  it('renders the UniinX brand narrative and preserves Shopify page content', () => {
    render(
      <MemoryRouter>
        <AboutPage
          page={{
            title: 'About',
            body: '<p>Founder context placeholder.</p>',
          }}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {name: /Clothes in your language/i}),
    ).toBeInTheDocument();
    expect(screen.getByText('Design language story')).toBeInTheDocument();
    expect(screen.getByText('Founder context placeholder.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: /Explore the collections/i}),
    ).toHaveAttribute('href', '/collections/all');
  });
});
