import { describe, expect, it } from 'vitest';

import { metricSeriesQuerySchema, overviewQuerySchema } from './analytics.schemas';

const WINDOW = { from: '2026-02-01T00:00:00.000Z', to: '2026-03-01T00:00:00.000Z' };

describe('overview query', () => {
  it('reads the comma separated connection list the client sends', () => {
    const parsed = overviewQuerySchema.parse({
      ...WINDOW,
      metric: 'impressions',
      connectionIds: 'conn_1,conn_2 , conn_3',
    });
    expect(parsed.connectionIds).toEqual(['conn_1', 'conn_2', 'conn_3']);
  });

  it('treats an absent or empty list as every account in scope', () => {
    expect(overviewQuerySchema.parse({ ...WINDOW, metric: 'impressions' }).connectionIds).toEqual(
      [],
    );
    expect(
      overviewQuerySchema.parse({ ...WINDOW, metric: 'impressions', connectionIds: '' })
        .connectionIds,
    ).toEqual([]);
  });

  it('refuses a metric that is not one of the normalized names', () => {
    expect(() => overviewQuerySchema.parse({ ...WINDOW, metric: 'engagement_rate_ish' })).toThrow();
  });

  it('refuses an unknown parameter rather than ignoring it', () => {
    expect(() =>
      overviewQuerySchema.parse({ ...WINDOW, metric: 'impressions', sortBy: 'value' }),
    ).toThrow();
  });
});

describe('metric series query', () => {
  it('requires the metric and the window', () => {
    expect(metricSeriesQuerySchema.parse({ ...WINDOW, metric: 'reach' }).metric).toBe('reach');
    expect(() => metricSeriesQuerySchema.parse({ ...WINDOW })).toThrow();
    expect(() => metricSeriesQuerySchema.parse({ metric: 'reach' })).toThrow();
  });
});
