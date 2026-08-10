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
  'pop',
  'blush',
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

  it('still accepts the visually deprecated pop and blush tones', () => {
    for (const tone of ['pop', 'blush'] as const) {
      const { unmount } = render(<Badge tone={tone}>{LABEL}</Badge>);
      expect(screen.getByText(LABEL).className).toContain('border-border-default');
      unmount();
    }
  });
});
