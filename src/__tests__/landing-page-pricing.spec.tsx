import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPagePricing from '@/components/landing-page-pricing';

const originalFetch = global.fetch;
const mockFetch = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'open', {
    configurable: true,
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window, 'alert', {
    configurable: true,
    writable: true,
    value: jest.fn(),
  });
});

describe('LandingPagePricing', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://stripe.test/checkout' }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;
    jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
    mockFetch.mockReset();
    (window.open as jest.Mock).mockReset();
  });

  it('highlights transparent pricing and upcoming features', () => {
    render(<LandingPagePricing />);

    expect(
      screen.getByText(/start at \$1\/month and only pay for the traffic you win/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/device, geo, and campaign routing \(coming soon\)/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/only pay for the clicks and active links you use/i),
    ).toBeInTheDocument();
  });

  it('initiates checkout when the primary call-to-action is clicked', async () => {
    render(<LandingPagePricing />);

    fireEvent.click(screen.getByRole('button', { name: /start for \$1\/month/i }));

    expect(mockFetch).toHaveBeenCalledWith('/api/stripe/create-checkout-session', {
      method: 'POST',
    });
    await waitFor(() =>
      expect(window.open).toHaveBeenCalledWith(
        'https://stripe.test/checkout',
        '_blank',
        'noopener noreferrer',
      ),
    );
  });
});
