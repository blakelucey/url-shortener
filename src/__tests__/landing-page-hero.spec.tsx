import { render, screen } from '@testing-library/react';
import LandingPageHero from '@/components/landing-page-hero';

describe('LandingPageHero', () => {
  it('communicates current and upcoming features clearly', () => {
    render(<LandingPageHero />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /powerful link management without the enterprise price tag/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/conversion routing tools \(coming soon\)/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/wallet-ready access \(coming soon\)/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/track clicks, referrers, and engagement/i)).toBeInTheDocument();
  });
});
