/** @file Tests for SignInModal. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { buildCustomerLoginPath, SignInModal } from './SignInModal.jsx';

describe('SignInModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <MemoryRouter>
        <SignInModal isOpen={false} onClose={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Sign in or join UniinX/i)).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <MemoryRouter>
        <SignInModal isOpen={true} onClose={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Sign in or join UniinX/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@domain.com')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(
      <MemoryRouter>
        <SignInModal isOpen={true} onClose={onCloseMock} />
      </MemoryRouter>,
    );
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('uses Shopify passwordless authentication', () => {
    render(
      <MemoryRouter>
        <SignInModal isOpen={true} onClose={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', {name: /Continue with Shopify/i})).toBeInTheDocument();
    expect(screen.getByText(/create a Shopify customer account if you are new/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', {name: /Password/i})).not.toBeInTheDocument();
  });

  it('calls onClose when Guest button is clicked', () => {
    const onCloseMock = vi.fn();
    render(
      <MemoryRouter>
        <SignInModal isOpen={true} onClose={onCloseMock} />
      </MemoryRouter>,
    );
    const guestBtn = screen.getByText(/Continue as Guest/i);
    fireEvent.click(guestBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('builds a safe Shopify login fallback and rejects external return targets', () => {
    expect(buildCustomerLoginPath({email: 'person@example.com', returnTo: '/cart'})).toBe(
      '/account/login?login_hint=person%40example.com&return_to=%2Fcart',
    );
    expect(buildCustomerLoginPath({returnTo: '//malicious.example'})).toBe('/account/login');
  });
});
