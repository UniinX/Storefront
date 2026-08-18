/** @file Tests for Breadcrumb. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Breadcrumb } from './Breadcrumb.jsx';

function renderBreadcrumb(props) {
  return render(
    <MemoryRouter>
      <Breadcrumb {...props} />
    </MemoryRouter>,
  );
}

describe('Breadcrumb', () => {
  it('renders Home / productType / title when productType is present', () => {
    renderBreadcrumb({ productType: 'T-Shirts', title: 'Bhasha Print' });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Bhasha Print')).toBeInTheDocument();
  });

  it('omits the productType segment when it is absent', () => {
    renderBreadcrumb({ productType: '', title: 'Bhasha Print' });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Bhasha Print')).toBeInTheDocument();
    // Only the trailing separator before the title remains.
    expect(screen.getAllByText('/')).toHaveLength(1);
  });
});
