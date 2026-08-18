/** @file Tests for the Accordion/AccordionItem primitives. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem } from './Accordion.jsx';

describe('AccordionItem', () => {
  it('renders nothing when content is null', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem title="Materials">{null}</AccordionItem>
      </Accordion>,
    );
    expect(screen.queryByText('Materials')).not.toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('renders the title but keeps content collapsed by default', () => {
    render(
      <Accordion>
        <AccordionItem title="Materials">100% cotton.</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Materials')).toBeInTheDocument();
    expect(screen.queryByText('100% cotton.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Materials/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles content open and closed on click', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="Materials">100% cotton.</AccordionItem>
      </Accordion>,
    );

    const button = screen.getByRole('button', { name: /Materials/ });
    await user.click(button);
    expect(screen.getByText('100% cotton.')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.click(button);
    expect(screen.queryByText('100% cotton.')).not.toBeInTheDocument();
  });
});
