import { describe, expect, it } from 'vitest';

import { composerReducer } from './composer-reducer.js';
import { countCharacters, readCounter } from './capability-rules.js';
import { repeatOccurrences, sequenceTimeline, summarizeTargets, totalsFor } from './selectors.js';
import { initialComposerState, SEED_ACCOUNTS, SEED_BOOTSTRAP } from './seed.js';
import type { MediaLookup } from './selectors.js';

const X = 'conn_seed_x_acme';
const LINKEDIN = 'conn_seed_li_acme';
const EMPTY_MEDIA: MediaLookup = { get: () => null };

function summarize(state = initialComposerState(SEED_BOOTSTRAP)) {
  return summarizeTargets({
    state,
    accounts: SEED_ACCOUNTS,
    media: EMPTY_MEDIA,
    approvalRequired: false,
  });
}

/** A seeded account the suite depends on, failing loudly if the seed changes. */
function requireSeed(connectionId: string) {
  const account = SEED_ACCOUNTS.find((entry) => entry.connectionId === connectionId);
  if (account === undefined) {
    throw new Error(`expected a seeded account for ${connectionId}`);
  }
  return account;
}

describe('counters', () => {
  it('charges a fixed cost per link where the provider does', () => {
    const x = requireSeed(X);
    const withLink = countCharacters(
      'See https://example.com/a/very/long/path/indeed',
      x.capabilities,
    );
    const withoutLink = countCharacters('See ', x.capabilities);
    expect(withLink).toBe(withoutLink + 23);
  });

  it('counts the real length where the provider counts characters', () => {
    const linkedin = requireSeed(LINKEDIN);
    const text = 'See https://example.com/a/very/long/path/indeed';
    expect(countCharacters(text, linkedin.capabilities)).toBe([...text].length);
  });

  it('warns at ninety percent and blocks past the limit', () => {
    const x = requireSeed(X);
    expect(readCounter('a'.repeat(100), x.capabilities).level).toBe('ok');
    expect(readCounter('a'.repeat(260), x.capabilities).level).toBe('near');
    expect(readCounter('a'.repeat(281), x.capabilities).level).toBe('over');
  });
});

describe('target summaries', () => {
  it('gives each target its own limit and state', () => {
    const summaries = summarize();
    const x = summaries.find((summary) => summary.connectionId === X);
    const linkedin = summaries.find((summary) => summary.connectionId === LINKEDIN);

    expect(x?.characterLimit).toBe(280);
    expect(linkedin?.characterLimit).toBe(3000);
    expect(x?.state).toBe('blocked');
    expect(x?.issues.some((issue) => issue.code === 'DESTINATION_REQUIRED')).toBe(true);
  });

  it('marks a target as overridden once it diverges', () => {
    const state = composerReducer(initialComposerState(SEED_BOOTSTRAP), {
      type: 'variant/override',
      connectionId: LINKEDIN,
      field: 'body',
      value: 'A LinkedIn specific version that is well within its limit.',
    });
    const summary = summarize(state).find((entry) => entry.connectionId === LINKEDIN);
    expect(summary?.overriddenFields).toEqual(['body']);
  });

  it('never reports a fabricated zero cost for an unmetered provider', () => {
    const linkedin = summarize().find((summary) => summary.connectionId === LINKEDIN);
    expect(linkedin?.estimatedCostMinor).toBeNull();
    expect(linkedin?.costCurrency).toBeNull();
  });

  it('sums a cost only when every priced target agrees on a currency', () => {
    const totals = totalsFor(summarize());
    expect(totals.targetCount).toBe(2);
    expect(totals.costCurrency).toBe('USD');
    expect(totals.canSchedule).toBe(false);
  });
});

describe('sequence and repeat maths', () => {
  it('accumulates delays from the root time', () => {
    const timeline = sequenceTimeline('2026-08-06T07:30:00.000Z', [
      { id: 'a', delaySeconds: 120 },
      { id: 'b', delaySeconds: 300 },
    ]);
    expect(timeline[0]?.instant).toBe('2026-08-06T07:32:00.000Z');
    expect(timeline[1]?.instant).toBe('2026-08-06T07:37:00.000Z');
  });

  it('returns no instants when there is no scheduled time yet', () => {
    const timeline = sequenceTimeline(null, [{ id: 'a', delaySeconds: 120 }]);
    expect(timeline[0]?.instant).toBeNull();
  });

  it('stops a repeat at the occurrence count', () => {
    const dates = repeatOccurrences('2026-08-06T07:30:00.000Z', 7, null, 3, 52);
    expect(dates).toHaveLength(3);
    expect(dates[2]).toBe('2026-08-20T07:30:00.000Z');
  });

  it('stops a repeat at the end date', () => {
    const dates = repeatOccurrences('2026-08-06T07:30:00.000Z', 7, '2026-08-20', null, 52);
    expect(dates).toHaveLength(3);
  });
});
