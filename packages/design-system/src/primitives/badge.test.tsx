import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Badge } from './badge';

// Test fixtures only. Product copy lives in @relay/i18n.
const LABEL = 'DE-AT';

const TONES = [
  'neutral',
  'accent',
  'success',
  'warning',
  'destructive',
  'info',
  'outline',
] as const;

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>{LABEL}</Badge>);
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it('forwards its ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>{LABEL}</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('hides a decorative icon from assistive technology', () => {
    render(<Badge icon={<svg data-testid="icon" />}>{LABEL}</Badge>);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the editorial small-caps label treatment on every tone', () => {
    for (const tone of TONES) {
      const { unmount } = render(<Badge tone={tone}>{LABEL}</Badge>);
      const { className } = screen.getByText(LABEL);
      expect(className).toContain('uppercase');
      expect(className).toContain('tracking-wide');
      unmount();
    }
  });

  it('draws every tone with a hairline border and no bold outline', () => {
    for (const tone of TONES) {
      const { unmount } = render(<Badge tone={tone}>{LABEL}</Badge>);
      const { className } = screen.getByText(LABEL);
      expect(className).not.toContain('border-2');
      expect(className).not.toContain('border-border-bold');
      unmount();
    }
  });

  // The loud decorative tones `pop` and `blush` were deleted once every call
  // site named the tone it actually meant. `badgeVariants` is the contract, so
  // asserting against its own key set is what keeps a reintroduced poster tone
  // from slipping back in unnoticed.
  it('offers no decorative poster tone', () => {
    for (const tone of TONES) {
      const { unmount } = render(<Badge tone={tone}>{LABEL}</Badge>);
      const { className } = screen.getByText(LABEL);
      expect(className).not.toContain('bg-cta');
      expect(className).not.toContain('bg-blush');
      unmount();
    }
  });
});
