import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router';
import {ProductDetails} from './ProductDetails';

// Real descriptionHtml pulled from the live store (men's classic tee).
const RICH_TEXT_DESCRIPTION =
  '<p><strong>Men’s Classic Crew T-Shirt</strong></p>\n' +
  '<p>Crafted from soft 180 GSM super-combed cotton, this everyday T-shirt offers a comfortable regular fit with a classic Lycra-ribbed crew neck.</p>\n' +
  '<p><strong>Product Details</strong></p>\n' +
  '<ul>\n<li>\n<p>100% Cotton</p>\n</li>\n<li>\n<p>180 GSM fabric</p>\n</li>\n<li>\n<p>Regular fit</p>\n</li>\n<li>\n<p>Crew neck</p>\n</li>\n<li>\n<p>Bio-washed &amp; pre-shrunk</p>\n</li>\n</ul>\n' +
  '<p><strong>Wash Care</strong><br>Machine wash cold. Do not bleach.</p>';

function renderDetails(product, media = [], selectedVariant) {
  return render(
    <MemoryRouter>
      <ProductDetails
        product={product}
        selectedVariant={selectedVariant}
        media={media}
      />
    </MemoryRouter>,
  );
}

// Radix unmounts an accordion panel's children entirely while collapsed
// (not just CSS-hidden), so its content must actually be opened to inspect.
async function openAccordion(title) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', {name: title}));
}

describe('ProductDetails', () => {
  it('always renders every accordion trigger, even with no data behind it', () => {
    renderDetails({
      metafields: [{key: 'design_story', value: 'A linguistic template.'}],
    });

    // These have no data behind them, but the accordion itself still
    // renders — with placeholder copy once opened — so it appears
    // automatically once a merchant fills the metafield in later, with no
    // code changes, rather than being omitted from the DOM entirely.
    expect(screen.getByText('Print & Design Details')).toBeInTheDocument();
    expect(screen.getByText('Care Instructions')).toBeInTheDocument();
    expect(screen.getByText('Sustainability')).toBeInTheDocument();
    expect(screen.getByText('Size & Measurements')).toBeInTheDocument();
    expect(screen.getByText('Delivery & Returns')).toBeInTheDocument();
    expect(screen.getByText('Product Reference')).toBeInTheDocument();
  });

  it('puts buyer-relevant accordions before the reference (SKU/vendor) one, not at the top', () => {
    const {container} = renderDetails({metafields: []});
    const titles = Array.from(
      container.querySelectorAll('button.font-marcellus'),
    ).map((el) => el.textContent);

    expect(titles).toEqual([
      'Print & Design Details+',
      'Size & Measurements+',
      'Care Instructions+',
      'Sustainability+',
      'Delivery & Returns+',
      'Product Reference+',
    ]);
  });

  it('shows placeholder copy in an accordion whose metafield is empty', async () => {
    renderDetails({metafields: []});
    await openAccordion('Care Instructions');
    expect(
      screen.getByText('Care instructions will appear here once added.'),
    ).toBeInTheDocument();
  });

  it('shows real content in an accordion once its metafield is set', async () => {
    renderDetails({
      metafields: [
        {key: 'care_instructions', value: 'Machine wash cold.'},
        {key: 'sustainability', value: 'Made from recycled cotton.'},
        {key: 'size_guide', value: 'S 36 27'},
      ],
    });

    await openAccordion('Care Instructions');
    expect(screen.getByText('Machine wash cold.')).toBeInTheDocument();
    await openAccordion('Sustainability');
    expect(screen.getByText('Made from recycled cotton.')).toBeInTheDocument();
    await openAccordion('Size & Measurements');
    expect(screen.getByText('S 36 27')).toBeInTheDocument();
  });

  it('lists SKU, vendor, design reference/group, and language in the Product Reference accordion, last in the list', async () => {
    renderDetails(
      {
        vendor: 'UniinX',
        metafields: [{key: 'design_reference', value: 'DR-104'}],
      },
      [],
      {sku: 'SKU-001'},
    );

    await openAccordion('Product Reference');
    expect(screen.getByText('SKU-001')).toBeInTheDocument();
    expect(screen.getByText('UniinX')).toBeInTheDocument();
    expect(screen.getByText('DR-104')).toBeInTheDocument();
    // Design group and language are unset — placeholder dash, not blank.
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('shows the fabric intro with material/fit facts and full description', () => {
    renderDetails({
      metafields: [
        {key: 'material', value: 'Cotton'},
        {key: 'fit', value: 'Regular'},
      ],
      description: 'A soft everyday tee.',
      descriptionHtml: '<p>A soft everyday tee.</p>',
    });

    expect(screen.getByText('Fabric Quality & Fit')).toBeInTheDocument();
    expect(screen.getByText('A soft everyday tee.')).toBeInTheDocument();
    // Metafield-backed facts render as their own labeled spec row, not
    // mashed into one string — cleaner for a shopper to scan.
    expect(screen.getByText('Fabric')).toBeInTheDocument();
    expect(screen.getByText('Cotton')).toBeInTheDocument();
    expect(screen.getByText('Fit')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument();
  });

  it('parses a real rich-text description into a clean intro + spec sheet, not a raw HTML dump', () => {
    const {container} = renderDetails({
      metafields: [],
      descriptionHtml: RICH_TEXT_DESCRIPTION,
    });

    // No raw markup leaking through — the redundant bold product-name line
    // and the "Product Details"/"Wash Care" headings are gone, replaced by
    // real section structure.
    expect(container.innerHTML).not.toContain('<strong>');
    expect(
      screen.getByText(/Crafted from soft 180 GSM super-combed cotton/),
    ).toBeInTheDocument();

    // Bullets are parsed into a real spec sheet.
    expect(screen.getByText('GSM')).toBeInTheDocument();
    expect(screen.getByText('180 GSM fabric')).toBeInTheDocument();
    expect(screen.getByText('Neck')).toBeInTheDocument();
    expect(screen.getByText('Crew neck')).toBeInTheDocument();
    // A bullet with no confident label ("Bio-washed & pre-shrunk") is kept
    // as supplementary text rather than dropped.
    expect(screen.getByText(/Bio-washed & pre-shrunk/)).toBeInTheDocument();
  });

  it('falls back to the description\'s parsed wash-care text when the care_instructions metafield is empty', async () => {
    renderDetails({
      metafields: [],
      descriptionHtml: RICH_TEXT_DESCRIPTION,
    });

    await openAccordion('Care Instructions');
    expect(
      screen.getByText('Machine wash cold. Do not bleach.'),
    ).toBeInTheDocument();
  });

  it('prefers the care_instructions metafield over the parsed description when both exist', async () => {
    renderDetails({
      metafields: [{key: 'care_instructions', value: 'Hand wash only.'}],
      descriptionHtml: RICH_TEXT_DESCRIPTION,
    });

    await openAccordion('Care Instructions');
    expect(screen.getByText('Hand wash only.')).toBeInTheDocument();
    expect(
      screen.queryByText('Machine wash cold. Do not bleach.'),
    ).not.toBeInTheDocument();
  });

  it('omits the fabric intro entirely when there is no fit/material/description', () => {
    renderDetails({metafields: []});
    expect(screen.queryByText('Fabric Quality & Fit')).not.toBeInTheDocument();
  });

  it('uses a real product video when one exists, not a fabricated one', () => {
    const {container} = renderDetails(
      {metafields: [{key: 'fit', value: 'Regular'}]},
      [
        {__typename: 'MediaImage', image: {id: '1', url: 'https://cdn.example.com/a.jpg'}},
        {
          __typename: 'Video',
          previewImage: {url: 'https://cdn.example.com/poster.jpg'},
          sources: [{url: 'https://cdn.example.com/clip.mp4', mimeType: 'video/mp4'}],
        },
      ],
    );

    const video = container.querySelector('video');
    expect(video).toHaveAttribute('src', 'https://cdn.example.com/clip.mp4');
  });

  it('falls back to a supporting product photo when no video exists', () => {
    render(
      <MemoryRouter>
        <ProductDetails
          product={{
            title: 'Just Grow Hoodie',
            metafields: [{key: 'fit', value: 'Regular'}],
          }}
          media={[
            {__typename: 'MediaImage', image: {id: '1', url: 'https://cdn.example.com/a.jpg'}},
            {__typename: 'MediaImage', image: {id: '2', url: 'https://cdn.example.com/b.jpg'}},
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('cdn.example.com/b.jpg'),
    );
  });

  it('keeps all product data — fabric copy, accordions, and help links — in one column next to the media', () => {
    const {container} = renderDetails(
      {
        title: 'Just Grow Hoodie',
        metafields: [
          {key: 'fit', value: 'Regular'},
          {key: 'design_story', value: 'A linguistic template.'},
        ],
      },
      [
        {__typename: 'MediaImage', image: {id: '1', url: 'https://cdn.example.com/a.jpg'}},
        {__typename: 'MediaImage', image: {id: '2', url: 'https://cdn.example.com/b.jpg'}},
      ],
    );

    const dataColumn = screen.getByText('Fabric Quality & Fit').closest('div');
    expect(dataColumn).toContainElement(screen.getByText('Print & Design Details'));
    expect(dataColumn).toContainElement(screen.getByText('Delivery & Returns'));
    expect(dataColumn).toContainElement(
      screen.getByRole('link', {name: 'Shipping & returns'}),
    );

    // The data column and the media sit as two grid columns on desktop.
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-2');
    expect(screen.getByRole('img').closest('.lg\\:sticky')).toBeInTheDocument();
  });

  it('falls back to a single column when there is no media at all', () => {
    const {container} = renderDetails({
      metafields: [{key: 'fit', value: 'Regular'}],
    });

    const grid = container.querySelector('.grid');
    expect(grid).not.toHaveClass('lg:grid-cols-2');
  });
});
