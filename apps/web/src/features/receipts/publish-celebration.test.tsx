/**
 * The publish celebration.
 *
 * Three things this panel must never get wrong, in order of how much damage
 * they would do:
 *
 *  1. A partial result must read as a partial result. Not a success with a
 *     footnote, not a failure. Both counts, both groups, in words.
 *  2. Under reduced motion the finished state must be exactly what a visitor
 *     gets: every badge settled, no burst mounted at all, no inline transform
 *     left on the card.
 *  3. Nothing here plays a sound. There is no audio element and no toggle for
 *     one, because none was built.
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

import {
  CELEBRATION_WINDOW_MS,
  PublishCelebration,
  isFreshPublication,
} from './publish-celebration';
import type { CampaignTargetView } from './types';

afterEach(restoreMotionPreference);

const NOW = Date.parse('2026-08-12T10:00:00.000Z');

function target(overrides: Partial<CampaignTargetView> = {}): CampaignTargetView {
  return {
    variantId: 'var_1',
    connectionId: 'conn_1',
    provider: 'x',
    accountLabel: '@acme',
    state: 'published',
    hasExternalPost: true,
    receiptId: 'rcpt_1',
    permalink: null,
    publishedAt: new Date(NOW - 1_000).toISOString(),
    failedItemCount: 0,
    ...overrides,
  };
}

function renderPanel(props: {
  readonly celebrate?: boolean;
  readonly outcome: Parameters<typeof PublishCelebration>[0]['outcome'];
  readonly targets: readonly CampaignTargetView[];
}) {
  return render(
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      <PublishCelebration
        celebrate={props.celebrate ?? true}
        outcome={props.outcome}
        targets={props.targets}
        campaignId="post_1"
        describeTarget={(entry) => entry.accountLabel}
      />
    </I18nProvider>,
  );
}

describe('isFreshPublication', () => {
  it('is true only when something actually reached a platform just now', () => {
    expect(isFreshPublication([target()], NOW)).toBe(true);
  });

  it('is false for a receipt older than the window', () => {
    const old = target({ publishedAt: new Date(NOW - CELEBRATION_WINDOW_MS - 1).toISOString() });
    expect(isFreshPublication([old], NOW)).toBe(false);
  });

  it('is false when nothing has reached a platform yet', () => {
    expect(
      isFreshPublication([target({ hasExternalPost: false, state: 'dispatching' })], NOW),
    ).toBe(false);
  });

  it('is false when the platform never told us when', () => {
    expect(isFreshPublication([target({ publishedAt: null })], NOW)).toBe(false);
  });
});

describe('a partial publication', () => {
  const targets = [
    target(),
    target({
      variantId: 'var_2',
      accountLabel: '@acme-news',
      state: 'failed_permanently',
      hasExternalPost: false,
      publishedAt: null,
    }),
  ];

  it('counts both groups in the heading instead of claiming a success', () => {
    renderPanel({ outcome: 'partially_published', targets });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1 destination is live');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1 is not');
    expect(screen.queryByText(/All \d+ destinations are live/)).toBeNull();
  });

  it('names every destination and says which ones are not live', () => {
    renderPanel({ outcome: 'partially_published', targets });

    expect(screen.getByText('@acme')).toBeVisible();
    expect(screen.getByText('@acme-news')).toBeVisible();
    expect(screen.getByText('Live')).toBeVisible();
    expect(screen.getByText('Not live')).toBeVisible();
  });

  it('does not rely on colour: every state is a word too', () => {
    const markup = renderToStaticMarkup(
      <I18nProvider locale="en" catalog={en} timeZone="UTC">
        <PublishCelebration
          celebrate={false}
          outcome="partially_published"
          targets={targets}
          campaignId="post_1"
          describeTarget={(entry) => entry.accountLabel}
        />
      </I18nProvider>,
    );
    expect(markup).toContain('Live');
    expect(markup).toContain('Not live');
  });
});

describe('with motion off', () => {
  it('renders the finished card: no burst, no inline transform', () => {
    mockMotionPreference('reduce');
    const { container } = renderPanel({ outcome: 'published', targets: [target()] });

    // The burst is additive celebration with no static state worth keeping,
    // so the correct fallback is that it never mounts.
    expect(container.querySelector('.relay-confetti-piece')).toBeNull();
    expect(inlineTransformsIn(container)).toEqual([]);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1 destination is live');
    expect(screen.getByText('Live')).toBeVisible();
  });

  it('leaves every badge already settled rather than mid-animation', () => {
    mockMotionPreference('reduce');
    const { container } = renderPanel({ outcome: 'published', targets: [target()] });

    // `LiveBadge` only plays on a false-to-true transition, and a panel that
    // mounts already live never had one.
    expect(container.querySelector('.relay-dot-settle')).toBeNull();
  });
});

describe('server HTML', () => {
  it('carries no hidden initial state and no audio', () => {
    const markup = renderToStaticMarkup(
      <I18nProvider locale="en" catalog={en} timeZone="UTC">
        <PublishCelebration
          celebrate
          outcome="published"
          targets={[target()]}
          campaignId="post_1"
          describeTarget={(entry) => entry.accountLabel}
        />
      </I18nProvider>,
    );

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    expect(markup).not.toContain('<audio');
    expect(markup).not.toContain('Audio(');
  });
});

describe('a campaign still in flight', () => {
  it('says it is waiting rather than reporting a result it does not have', () => {
    renderPanel({
      outcome: 'in_flight',
      targets: [target({ hasExternalPost: false, state: 'dispatching', publishedAt: null })],
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Waiting on the platforms');
    expect(screen.getByText('Waiting')).toBeVisible();
  });
});
