import { describe, expect, it } from 'vitest';

import { buildChannelRollups, sortChannelRollups } from './channels';
import type {
  AccountRef,
  AnalyticsOverview,
  MetricReading,
  PostComparisonRow,
} from './types';

const account = (id: string, name: string): AccountRef => ({
  connectionId: id,
  provider: 'x',
  handle: name,
  displayName: name,
});

function reading(overrides: Partial<MetricReading> = {}): MetricReading {
  return {
    normalizedName: 'impressions',
    provider: 'x',
    availability: 'available',
    value: 100,
    observedAt: '2026-03-04T10:30:00Z',
    freshnessSeconds: 60,
    definition: {
      normalizedName: 'impressions',
      provider: 'x',
      providerField: 'impression_count',
      definition: 'Number of times the post was seen.',
      unit: 'count',
      denominator: 'none',
      aggregation: 'sum',
      historyWindowDays: 30,
      lastVerifiedAt: '2026-03-01T00:00:00Z',
    },
    ...overrides,
  };
}

function row(connectionId: string, name: string, reading_: MetricReading): PostComparisonRow {
  return {
    contentItemId: `post-${connectionId}-${Math.random()}`,
    title: 'A post',
    account: account(connectionId, name),
    format: 'text',
    publishedAt: '2026-03-03T09:00:00Z',
    reading: reading_,
    baseline: null,
  };
}

function overview(rows: readonly PostComparisonRow[]): AnalyticsOverview {
  return {
    range: { preset: '30d', start: '2026-03-01T00:00:00Z', end: '2026-03-31T00:00:00Z' },
    rankMetric: 'impressions',
    rows,
    freshness: [],
    attention: [],
    observations: [],
    accountsRequested: 1,
    accountsWithData: 1,
    accountsWithoutData: [],
  };
}

describe('buildChannelRollups', () => {
  it('adds a metric up only when the provider says it may be added', () => {
    const rollups = buildChannelRollups(
      overview([
        row('a', 'Anna', reading({ value: 100 })),
        row('a', 'Anna', reading({ value: 50 })),
      ]),
      [account('a', 'Anna')],
    );

    expect(rollups[0]?.total).toBe(150);
    expect(rollups[0]?.addable).toBe(true);
  });

  it('refuses to add a metric whose aggregation is not a sum', () => {
    // Adding five average-view-duration readings together produces a number
    // that looks like a total and means nothing.
    const average = reading({
      definition: { ...reading().definition, aggregation: 'average' },
    });
    const rollups = buildChannelRollups(
      overview([row('a', 'Anna', average), row('a', 'Anna', average)]),
      [account('a', 'Anna')],
    );

    expect(rollups[0]?.addable).toBe(false);
    expect(rollups[0]?.total).toBeNull();
  });

  it('refuses to add when the read did not say how the metric aggregates', () => {
    const unknown = reading({ definition: { ...reading().definition, aggregation: null } });
    const rollups = buildChannelRollups(overview([row('a', 'Anna', unknown)]), [
      account('a', 'Anna'),
    ]);
    expect(rollups[0]?.addable).toBe(false);
  });

  it('counts an unavailable reading and never folds it in as zero', () => {
    const rollups = buildChannelRollups(
      overview([
        row('a', 'Anna', reading({ value: 100 })),
        row(
          'a',
          'Anna',
          reading({ availability: 'unavailable_permission', value: null }),
        ),
      ]),
      [account('a', 'Anna')],
    );

    expect(rollups[0]?.total).toBe(100);
    expect(rollups[0]?.unavailableCount).toBe(1);
    expect(rollups[0]?.postsMeasured).toBe(2);
  });

  it('reports nothing rather than zero when no reading was available', () => {
    const rollups = buildChannelRollups(
      overview([row('a', 'Anna', reading({ availability: 'unavailable_stale', value: null }))]),
      [account('a', 'Anna')],
    );
    expect(rollups[0]?.total).toBeNull();
    expect(rollups[0]?.total).not.toBe(0);
  });

  it('keeps a row for an account that returned nothing at all', () => {
    // A silently shorter table is how a reader concludes an account is fine
    // when it simply did not answer.
    const rollups = buildChannelRollups(overview([]), [
      account('a', 'Anna'),
      account('b', 'Bo'),
    ]);
    expect(rollups).toHaveLength(2);
    expect(rollups.map((one) => one.postsMeasured)).toEqual([0, 0]);
  });

  it('adds an account the response mentions that the filter list does not', () => {
    const rollups = buildChannelRollups(overview([row('z', 'Zed', reading())]), [
      account('a', 'Anna'),
    ]);
    expect(rollups.map((one) => one.account.connectionId)).toEqual(['a', 'z']);
  });
});

describe('sortChannelRollups', () => {
  const rollups = buildChannelRollups(
    overview([
      row('a', 'Anna', reading({ value: 10 })),
      row('b', 'Bo', reading({ value: 90 })),
      row('c', 'Cy', reading({ availability: 'unavailable_stale', value: null })),
    ]),
    [account('a', 'Anna'), account('b', 'Bo'), account('c', 'Cy')],
  );

  it('ranks by the total, descending', () => {
    expect(
      sortChannelRollups(rollups, 'total', 'descending').map((one) => one.account.connectionId),
    ).toEqual(['b', 'a', 'c']);
  });

  it('keeps a channel with no total out of the ranking in both directions', () => {
    // Ascending must not float "we could not add this up" to the top as if it
    // were the worst performer.
    expect(
      sortChannelRollups(rollups, 'total', 'ascending').map((one) => one.account.connectionId),
    ).toEqual(['a', 'b', 'c']);
  });

  it('sorts by account name', () => {
    expect(
      sortChannelRollups(rollups, 'account', 'ascending').map((one) => one.account.displayName),
    ).toEqual(['Anna', 'Bo', 'Cy']);
  });
});
