import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { LiveBadge } from './live-badge';
import {
  hiddenStateClassesIn,
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from './motion-test-media';

afterEach(restoreMotionPreference);

describe('LiveBadge with motion off', () => {
  it('renders the label visibly and unmoved', () => {
    mockMotionPreference('reduce');
    const { container } = render(<LiveBadge live label="Live" />);

    expect(screen.getByText('Live')).toBeVisible();
    expect(inlineTransformsIn(container)).toEqual([]);
  });

  it('still plays no settle animation on a badge that mounts already live', () => {
    mockMotionPreference('reduce');
    const { container } = render(<LiveBadge live label="Live" />);

    // A badge that was live before this component existed did not just go
    // live, so there is nothing to celebrate — in either motion mode.
    expect(container.querySelector('.relay-dot-settle')).toBeNull();
  });
});

describe('LiveBadge server HTML', () => {
  it('contains the label and no hidden-state class', () => {
    const markup = renderToStaticMarkup(<LiveBadge live label="Live" />);

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    expect(markup).toContain('Live');
  });

  it('never carries an animation class, so first paint is the settled state', () => {
    const markup = renderToStaticMarkup(<LiveBadge live label="Live" />);

    expect(markup).not.toContain('relay-dot-settle');
    expect(markup).not.toContain('relay-icon-draw');
  });
});

describe('LiveBadge state change', () => {
  it('never states its status with colour alone', () => {
    mockMotionPreference('no-preference');
    const { rerender } = render(<LiveBadge live={false} label="Scheduled" />);
    expect(screen.getByText('Scheduled')).toBeInTheDocument();

    rerender(<LiveBadge live label="Live" />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('plays the settle and draw-in once, only on the transition into live', () => {
    mockMotionPreference('no-preference');
    const { container, rerender } = render(
      <LiveBadge live={false} label="Scheduled" icon={<svg />} />,
    );
    expect(container.querySelector('.relay-dot-settle')).toBeNull();

    rerender(<LiveBadge live label="Live" icon={<svg />} />);
    expect(container.querySelector('.relay-dot-settle')).not.toBeNull();
    expect(container.querySelector('.relay-icon-draw')).not.toBeNull();

    // Going back to not-live clears it, so a later re-entry replays rather
    // than finding the class already sitting there doing nothing.
    rerender(<LiveBadge live={false} label="Scheduled" icon={<svg />} />);
    expect(container.querySelector('.relay-dot-settle')).toBeNull();
  });

  it('carries the explicit reduced-motion guard alongside the CSS override', () => {
    mockMotionPreference('no-preference');
    const { container, rerender } = render(<LiveBadge live={false} label="Scheduled" />);
    rerender(<LiveBadge live label="Live" />);

    const dot = container.querySelector('.relay-dot-settle');
    expect(dot?.classList.contains('motion-reduce:animate-none')).toBe(true);
  });
});
