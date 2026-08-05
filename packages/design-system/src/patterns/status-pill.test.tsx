import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  PUBLISH_STATES,
  PUBLISH_STATE_DEFINITIONS,
  StatusPill,
  type PublishState,
} from './status-pill.js';

// Test fixtures only. Product copy lives in @relay/i18n.
const label = (state: PublishState): string => state.replaceAll('_', ' ');

describe('StatusPill', () => {
  it('covers exactly the fifteen documented publish states', () => {
    expect(PUBLISH_STATES).toHaveLength(15);
    expect(new Set(PUBLISH_STATES).size).toBe(15);
    expect(Object.keys(PUBLISH_STATE_DEFINITIONS).sort()).toEqual([...PUBLISH_STATES].sort());
  });

  it.each(PUBLISH_STATES)('renders %s with a visible word, not colour alone', (state) => {
    render(<StatusPill state={state} label={label(state)} />);
    expect(screen.getByText(label(state))).toBeVisible();
  });

  it.each(PUBLISH_STATES)('renders an icon alongside the label for %s', (state) => {
    const { container } = render(<StatusPill state={state} label={label(state)} />);
    const icon = container.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes the state as a data attribute for testing and analytics', () => {
    render(<StatusPill state="partially_published" label="Partially published" />);
    expect(screen.getByText('Partially published').parentElement).toHaveAttribute(
      'data-state',
      'partially_published',
    );
  });

  it('keeps partially published distinct from failed and from published', () => {
    expect(PUBLISH_STATE_DEFINITIONS.partially_published.tone).toBe('warning');
    expect(PUBLISH_STATE_DEFINITIONS.failed_permanently.tone).toBe('destructive');
    expect(PUBLISH_STATE_DEFINITIONS.published.tone).toBe('success');
  });

  it('keeps retry scheduled in flight and failed permanently terminal', () => {
    expect(PUBLISH_STATE_DEFINITIONS.retry_scheduled.inFlight).toBe(true);
    expect(PUBLISH_STATE_DEFINITIONS.failed_permanently.inFlight).toBe(false);
    expect(PUBLISH_STATE_DEFINITIONS.canceled.inFlight).toBe(false);
    expect(PUBLISH_STATE_DEFINITIONS.deleted_externally.inFlight).toBe(false);
  });

  it('only spins for an in-flight state, and only when asked', () => {
    const { container, rerender } = render(
      <StatusPill state="dispatching" label="Dispatching" showActivity />,
    );
    expect(container.querySelector('.relay-anim-spin')).not.toBeNull();

    rerender(<StatusPill state="dispatching" label="Dispatching" />);
    expect(container.querySelector('.relay-anim-spin')).toBeNull();

    rerender(<StatusPill state="published" label="Published" showActivity />);
    expect(container.querySelector('.relay-anim-spin')).toBeNull();
  });

  it('renders optional detail after the label', () => {
    render(<StatusPill state="scheduled" label="Scheduled" detail="6 accounts" />);
    expect(screen.getByText('6 accounts')).toBeInTheDocument();
  });
});
