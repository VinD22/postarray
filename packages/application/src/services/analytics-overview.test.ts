import { describe, expect, it } from 'vitest';

import { readOverview, readSeries } from './analytics-overview';
import type { Db } from '../internal/runtime';

/**
 * A stand-in for the workspace-scoped client.
 *
 * Documented boundary shim: `Db` is the generated Prisma client type, which has
 * hundreds of members these tests never touch. The tests drive the four reads
 * this module makes and nothing else, so the stub is cast once, here.
 */
function stubDb(tables: Readonly<Record<string, readonly unknown[]>>): Db {
  const model = (name: string): { findMany: () => Promise<readonly unknown[]> } => ({
    findMany: async () => tables[name] ?? [],
  });
  return {
    socialConnection: model('socialConnection'),
    publicationReceipt: model('publicationReceipt'),
    postVariant: model('postVariant'),
    mediaAsset: model('mediaAsset'),
    metricObservation: model('metricObservation'),
    analyticsSyncRun: model('analyticsSyncRun'),
  } as unknown as Db;
}

const NOW = new Date('2026-03-01T00:00:00.000Z');
const RANGE = { from: '2026-02-01T00:00:00.000Z', to: '2026-03-01T00:00:00.000Z' };

const CONNECTION = {
  id: 'conn_1',
  provider: 'linkedin',
  handle: 'acme',
  displayName: 'Acme',
  status: 'active',
};

function receipt(id: string, publishedAt: string) {
  return {
    id,
    connectionId: 'conn_1',
    provider: 'linkedin',
    publishedAt: new Date(publishedAt),
    permalink: `https://example.test/${id}`,
    contentVersionId: `cver_${id}`,
    contentVersion: {
      contentItemId: `content_${id}`,
      body: 'A post',
      contentItem: { title: `Post ${id}` },
    },
  };
}

const DEFINITION = {
  providerFieldName: 'impressionCount',
  providerDefinition: 'Times the post was on screen.',
  normalizedName: 'impressions',
  unit: 'count',
  aggregationRule: 'latest_snapshot',
  denominatorNote: null,
  documentationUrl: null,
  lastVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function observation(receiptId: string, value: number | null, availability = 'available') {
  return {
    receiptId,
    observedAt: new Date('2026-02-20T00:00:00.000Z'),
    rawValue: value === null ? null : { toString: () => String(value) },
    normalizedValue: null,
    availability,
    provider: 'linkedin',
    metricDefinition: DEFINITION,
  };
}

describe('readOverview', () => {
  it('returns an empty, honest payload when no account is in scope', async () => {
    const overview = await readOverview(stubDb({}), NOW, {
      connectionIds: [],
      range: RANGE,
      metric: 'impressions',
    });

    expect(overview.rows).toEqual([]);
    expect(overview.accountsRequested).toBe(0);
    expect(overview.accountsWithData).toBe(0);
    expect(overview.observations).toEqual([]);
  });

  it('carries the provider definition beside every number', async () => {
    const overview = await readOverview(
      stubDb({
        socialConnection: [CONNECTION],
        publicationReceipt: [receipt('r1', '2026-02-10T09:00:00.000Z')],
        metricObservation: [observation('r1', 1200)],
      }),
      NOW,
      { connectionIds: ['conn_1'], range: RANGE, metric: 'impressions' },
    );

    const row = overview.rows[0];
    expect(row?.reading.value).toBe(1200);
    expect(row?.reading.definition.providerField).toBe('impressionCount');
    expect(row?.reading.definition.definition).toBe('Times the post was on screen.');
    expect(row?.account.displayName).toBe('Acme');
    expect(overview.accountsWithData).toBe(1);
  });

  it('reports a metric the provider withheld as unavailable with a null value', async () => {
    const overview = await readOverview(
      stubDb({
        socialConnection: [CONNECTION],
        publicationReceipt: [receipt('r1', '2026-02-10T09:00:00.000Z')],
        metricObservation: [observation('r1', null, 'requires_permission')],
      }),
      NOW,
      { connectionIds: ['conn_1'], range: RANGE, metric: 'impressions' },
    );

    // The row is kept and says the provider would not answer. What it never
    // does is carry a zero, and the account is not counted as having answered.
    expect(overview.rows).toHaveLength(1);
    expect(overview.rows[0]?.reading.value).toBeNull();
    expect(overview.rows[0]?.reading.availability).toBe('unavailable_permission');
    expect(overview.accountsWithData).toBe(0);
    expect(overview.accountsWithoutData).toHaveLength(1);
  });

  it('never reports an account that has never synced as stale-with-a-number', async () => {
    const overview = await readOverview(
      stubDb({
        socialConnection: [CONNECTION],
        publicationReceipt: [receipt('r1', '2026-02-10T09:00:00.000Z')],
        metricObservation: [observation('r1', 5)],
      }),
      NOW,
      { connectionIds: ['conn_1'], range: RANGE, metric: 'impressions' },
    );

    expect(overview.freshness[0]?.state).toBe('never');
    expect(overview.freshness[0]?.lastSuccessAt).toBeNull();
  });

  it('names a revoked account as needing attention for its credential', async () => {
    const overview = await readOverview(
      stubDb({
        socialConnection: [{ ...CONNECTION, status: 'revoked' }],
      }),
      NOW,
      { connectionIds: ['conn_1'], range: RANGE, metric: 'impressions' },
    );

    expect(overview.attention[0]?.reason).toBe('access_expired');
  });

  it('refuses a baseline it does not have the history for', async () => {
    const overview = await readOverview(
      stubDb({
        socialConnection: [CONNECTION],
        publicationReceipt: [
          receipt('r2', '2026-02-20T09:00:00.000Z'),
          receipt('r1', '2026-02-10T09:00:00.000Z'),
        ],
        metricObservation: [observation('r2', 500), observation('r1', 100)],
      }),
      NOW,
      { connectionIds: ['conn_1'], range: RANGE, metric: 'impressions' },
    );

    // One prior post is below the minimum sample, so there is no comparison
    // rather than a confident number drawn from a single post.
    expect(overview.rows.every((row) => row.baseline === null)).toBe(true);
  });
});

describe('readSeries', () => {
  it('leaves a day with no observation null rather than zero', async () => {
    const series = await readSeries(
      stubDb({
        metricObservation: [
          {
            ...observation('r1', 40),
            observedAt: new Date('2026-02-01T12:00:00.000Z'),
          },
          {
            ...observation('r2', 60),
            observedAt: new Date('2026-02-03T12:00:00.000Z'),
          },
        ],
      }),
      NOW,
      {
        connectionId: 'conn_1',
        metric: 'impressions',
        range: { from: '2026-02-01T00:00:00.000Z', to: '2026-02-03T00:00:00.000Z' },
      },
    );

    expect(series.points.map((point) => point.value)).toEqual([40, null, 60]);
    expect(series.points.every((point) => point.bucketSeconds === 86_400)).toBe(true);
    expect(series.unit).toBe('count');
  });

  it('does not invent a value for an unavailable observation', async () => {
    const series = await readSeries(
      stubDb({
        metricObservation: [
          {
            ...observation('r1', null, 'requires_permission'),
            observedAt: new Date('2026-02-01T12:00:00.000Z'),
          },
        ],
      }),
      NOW,
      {
        connectionId: 'conn_1',
        metric: 'impressions',
        range: { from: '2026-02-01T00:00:00.000Z', to: '2026-02-01T00:00:00.000Z' },
      },
    );

    expect(series.points).toHaveLength(1);
    expect(series.points[0]?.value).toBeNull();
  });
});
