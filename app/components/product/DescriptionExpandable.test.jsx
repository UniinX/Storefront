/** @file Tests for DescriptionExpandable. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DescriptionExpandable } from './DescriptionExpandable.jsx';

const LONG_TEXT = 'A'.repeat(200);

describe('DescriptionExpandable', () => {
  it('renders nothing when there is no description at all', () => {
    const { container } = render(<DescriptionExpandable description="" descriptionHtml="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders short descriptions without a toggle', () => {
    render(<DescriptionExpandable description="Short teaser." descriptionHtml="<p>Short teaser.</p>" />);
    expect(screen.getByText('Short teaser.')).toBeInTheDocument();
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  it('clamps long descriptions behind a "Show more" toggle', async () => {
    const user = userEvent.setup();
    render(<DescriptionExpandable description={LONG_TEXT} descriptionHtml={`<p>${LONG_TEXT}</p>`} />);

    expect(screen.getByText('Show more')).toBeInTheDocument();
    await user.click(screen.getByText('Show more'));
    expect(screen.getByText('Show less')).toBeInTheDocument();
    await user.click(screen.getByText('Show less'));
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });
});
