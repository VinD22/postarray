/**
 * The chip's motion states.
 *
 * Everything the drag adds here is decorative on purpose: the lift, the
 * settle and the snap back all sit on top of state that is already fully
 * readable without them (the ring, the dashed target outline, the
 * announcements the screen makes). So the test that matters is the negative
 * one: with motion off, the chip is exactly where it will end up, carrying no
 * inline transform and no hidden state, in every one of those phases.
 */

import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import {
  hiddenStateClassesIn,
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from '@/components/motion/motion-test-media';

import { EntryChip } from './entry-chip';
import type { CalendarEntry } from './types';

afterEach(restoreMotionPreference);

const BERLIN = 'Europe/Berlin';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    publishJobId: 'job_01j000000000000000000001',
    contentItemId: 'post_01j000000000000000000001',
    title: 'Scheduled first comments are live',
    scheduledAt: '2026-08-06T07:30:00.000Z',
    timeZone: BERLIN,
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@acme',
    targetCount: 1,
    mediaKind: 'image',
    ...overrides,
  };
}

function renderChip(props: Partial<React.ComponentProps<typeof EntryChip>> = {}) {
  return render(
    <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
      <EntryChip entry={entry()} href="/posts/post_1" onPickUp={() => undefined} {...props} />
    </I18nProvider>,
  );
}

describe('the drag lift', () => {
  it('lifts and shadows the chip while the pointer carries it', () => {
    mockMotionPreference('no-preference');
    const { container } = renderChip({ dragging: true });

    const chip = container.querySelector('article');
    expect(chip?.className).toContain('scale-[1.02]');
    expect(chip?.className).toContain('shadow-hard');
    // The lift is the one state on this chip that has to feel instant.
    expect(chip?.className).toContain('duration-(--duration-fast)');
  });

  it('adds no transform at all with motion off', () => {
    mockMotionPreference('reduce');
    const { container } = renderChip({ dragging: true });

    const chip = container.querySelector('article');
    expect(chip?.className).not.toContain('scale-[1.02]');
    expect(inlineTransformsIn(container)).toEqual([]);
    // The fade still applies: it carries the "this is the copy you are
    // holding" meaning, and it is not motion.
    expect(chip?.className).toContain('opacity-70');
  });
});

describe('the settle and the snap back', () => {
  it.each(['drop', 'cancel'] as const)('leaves the chip unmoved for %s with motion off', (kind) => {
    mockMotionPreference('reduce');
    const { container } = renderChip({ settleKind: kind, settleId: 1 });

    expect(inlineTransformsIn(container)).toEqual([]);
    expect(screen.getByText('Scheduled first comments are live')).toBeVisible();
  });

  it('is inert when nothing was released', () => {
    mockMotionPreference('no-preference');
    const { container } = renderChip({ settleKind: null, settleId: null });
    expect(inlineTransformsIn(container)).toEqual([]);
  });
});

describe('a published entry', () => {
  it('wears the live badge and still says the word', () => {
    renderChip({ entry: entry({ state: 'published' }) });
    expect(screen.getByText(en['state.published.label'])).toBeVisible();
  });

  it('does not play the settle on a chip that mounts already published', () => {
    mockMotionPreference('no-preference');
    const { container } = renderChip({ entry: entry({ state: 'published' }) });
    // `LiveBadge` animates only on the false-to-true transition. A calendar
    // that replayed a celebration on every scroll would be unbearable.
    expect(container.querySelector('.relay-dot-settle')).toBeNull();
  });
});

describe('server HTML', () => {
  it('carries no hidden initial state', () => {
    const markup = renderToStaticMarkup(
      <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
        <EntryChip entry={entry({ state: 'published' })} href="/posts/post_1" />
      </I18nProvider>,
    );
    expect(hiddenStateClassesIn(markup)).toEqual([]);
  });
});
