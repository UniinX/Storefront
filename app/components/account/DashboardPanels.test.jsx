/** @file Tests for DashboardPanels components. */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SecurityPanel, LegalitiesPanel, ContactPanel } from './DashboardPanels.jsx';

describe('SecurityPanel', () => {
  it('renders connected account and active sessions', () => {
    const mockCustomer = {
      id: 'gid://shopify/Customer/12345',
      emailAddress: { emailAddress: 'test@example.com' },
    };
    render(<SecurityPanel customer={mockCustomer} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Verified Customer ID: #12345')).toBeInTheDocument();
    expect(screen.getByText(/Mac \(Chrome Browser\)/i)).toBeInTheDocument();
  });

  it('toggles switches on click', () => {
    const mockCustomer = {};
    render(<SecurityPanel customer={mockCustomer} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2); // MFA & Login alerts

    // Click MFA toggle
    const mfaButton = buttons[0];
    const mfaTrack = mfaButton.querySelector('div');
    expect(mfaTrack).toHaveClass('translate-x-0');
    fireEvent.click(mfaButton);
    expect(mfaTrack).toHaveClass('translate-x-5');
  });
});

describe('LegalitiesPanel', () => {
  it('renders all sections and opens accordion on click', () => {
    render(<LegalitiesPanel />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();

    // Accordion for Privacy is open by default
    expect(screen.getByText(/UniinX respects your personal data/i)).toBeInTheDocument();

    // Click Terms of Service to expand it
    const termsButton = screen.getByText('Terms of Service');
    fireEvent.click(termsButton);
    expect(screen.getByText(/By utilizing the UniinX Studio platform/i)).toBeInTheDocument();
  });
});

describe('ContactPanel', () => {
  it('renders form inputs correctly', () => {
    const mockCustomer = {
      orders: {
        nodes: [
          { id: '1', name: '#1001', processedAt: '2026-08-01T00:00:00Z' }
        ]
      }
    };
    render(<ContactPanel customer={mockCustomer} />);
    expect(screen.getByLabelText(/Inquiry Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Relate to Order/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
  });

  it('submits form and displays success confirmation', () => {
    const mockCustomer = {
      emailAddress: { emailAddress: 'contact@example.com' },
      orders: { nodes: [] }
    };
    render(<ContactPanel customer={mockCustomer} />);
    
    const messageInput = screen.getByPlaceholderText(/Describe your inquiry details/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(messageInput, { target: { value: 'Hello support!' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Message Transmitted')).toBeInTheDocument();
    expect(screen.getByText(/contact@example.com/i)).toBeInTheDocument();
  });
});
