import { describe, expect, it } from 'vitest';

import { DIGEST_FLOOR_KEYS, buildDigestFloor, emailDigestRows } from './floor';
import { makeReceiptsOnlyRetrieval } from './testing';
import type { DigestInsightRow, InsightLike } from './types';

const UNAVAILABILITY_INSIGHT: InsightLike = {
  kind: 'not_supported',
  code: 'UNAVAILABLE_PERMISSION',
  messageKey: 'analytics.value.unavailableReason.permission',
  params: { metric: 'impressions', provider: 'mastodon' },
  evidenceIds: ['impressions'],
  confidence: 'high',
};

describe('buildDigestFloor', () => {
  it('describes a week with no metrics at all', () => {
    const floor = buildDigestFloor({ retrieval: makeReceiptsOnlyRetrieval() });

    expect(floor.headlineKey).toBe(DIGEST_FLOOR_KEYS.headlinePublished);
    expect(floor.rows.map((row) => row.messageKey)).toContain(DIGEST_FLOOR_KEYS.noMetricsYet);
  });

  it('says nothing was published when nothing was', () => {
    const floor = buildDigestFloor({
      retrieval: makeReceiptsOnlyRetrieval({ receipts: [] }),
    });

    expect(floor.headlineKey).toBe(DIGEST_FLOOR_KEYS.headlineNothingPublished);
  });

  it('carries the analytics-domain insight rows through unchanged', () => {
    const floor = buildDigestFloor({
      retrieval: makeReceiptsOnlyRetrieval(),
      unavailabilityInsights: [UNAVAILABILITY_INSIGHT],
    });

    const carried = floor.rows.find((row) => row.messageKey === UNAVAILABILITY_INSIGHT.messageKey);
    expect(carried).toMatchObject({
      kind: 'digest',
      messageArgs: { metric: 'impressions', provider: 'mastodon' },
      evidenceIds: ['impressions'],
    });
  });

  it('every floor row is stored against the window it describes', () => {
    const floor = buildDigestFloor({ retrieval: makeReceiptsOnlyRetrieval() });

    expect(floor.rows.every((row) => row.windowStart === '2026-08-03')).toBe(true);
    expect(floor.rows.every((row) => row.kind === 'digest')).toBe(true);
  });
});

describe('emailDigestRows', () => {
  it('never sends model prose', () => {
    const rows: DigestInsightRow[] = [
      ...buildDigestFloor({ retrieval: makeReceiptsOnlyRetrieval() }).rows,
      {
        kind: 'digest',
        messageKey: 'digest.narrative.headline',
        messageArgs: { statement: 'A sentence a model wrote.' },
        evidenceIds: [],
        confidence: 'medium',
        sampleSize: null,
        windowStart: '2026-08-03',
        windowEnd: '2026-08-10',
        isNarrative: true,
      },
    ];

    expect(emailDigestRows(rows).every((row) => !row.isNarrative)).toBe(true);
  });
});
