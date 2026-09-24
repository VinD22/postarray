import { describe, expect, it } from 'vitest';

import type { StoredInsight } from './insights-queries';
import { storedObservations } from './stored-observations';

const range = { start: '2026-09-01T00:00:00Z', end: '2026-09-08T00:00:00Z', preset: '7d' } as const;

function insight(
  overrides: Partial<StoredInsight> & { args?: Record<string, unknown> },
): StoredInsight {
  return {
    id: 'ins_1',
    kind: 'post_feedback',
    contentItemId: 'post_1',
    messageArgs: overrides.args ?? { verdict: 'above', effectSize: 0.4, metric: 'impressions' },
    evidenceIds: ['rcpt_1'],
    sampleSize: 12,
    createdAt: '2026-09-03T10:00:00Z',
    ...overrides,
  };
}

describe('storedObservations', () => {
  it('maps an above verdict to an observation with its sample size', () => {
    const [first] = storedObservations([insight({})], range);
    expect(first?.kind).toBe('above_baseline');
    expect(first?.values).toEqual({ percent: 0.4, metric: 'impressions', count: 12 });
    expect(first?.storedMessageKey).toBe('insight.observation.above');
  });

  it('drops similar, insufficient data, out of range and missing numbers', () => {
    expect(
      storedObservations(
        [
          insight({ args: { verdict: 'similar', effectSize: 0.01, metric: 'impressions' } }),
          insight({ args: { verdict: 'insufficient_data', effectSize: null, metric: 'reach' } }),
          insight({ createdAt: '2026-08-01T00:00:00Z' }),
          insight({ args: { verdict: 'below', effectSize: null, metric: 'reach' } }),
          insight({ sampleSize: null }),
          insight({ kind: 'digest' }),
        ],
        range,
      ),
    ).toEqual([]);
  });
});
