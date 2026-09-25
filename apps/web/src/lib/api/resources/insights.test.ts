import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyticsOverviewViewSchema } from '@relay/contracts';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { analyticsApi, shortLinksApi } from './insights';

describe('analytics browser contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue(null);
  });

  it('provides a schema-valid overview to explicit demo mode', async () => {
    await analyticsApi.getOverview({
      connectionIds: [],
      from: '2026-08-01T00:00:00.000Z',
      to: '2026-09-01T00:00:00.000Z',
      metric: 'impressions',
    });

    const demo = callMock.mock.calls[0]?.[2];
    expect(typeof demo).toBe('function');
    if (typeof demo !== 'function') throw new Error('Expected a demo analytics reader');

    const overview = analyticsOverviewViewSchema.parse(demo());
    expect(overview.rows).toHaveLength(3);
    expect(overview.accountsWithData).toBeLessThan(overview.accountsRequested);
    expect(overview.rows.find((row) => row.reading.value === null)?.reading.availability).not.toBe(
      'available',
    );
  });
});

describe('short link browser contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue(null);
  });

  it('uses the canonical management and analytics routes', async () => {
    await shortLinksApi.list({ limit: 20 });
    await shortLinksApi.get('lnk_01');
    await shortLinksApi.getStats('lnk_01', {
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-02-01T00:00:00.000Z',
      ianaTimeZone: 'Asia/Kolkata',
    });
    await shortLinksApi.updateDestination(
      'lnk_01',
      { destinationUrl: 'https://example.test/new', reason: 'Campaign moved' },
      'idem-update',
    );
    await shortLinksApi.setEnabled(
      'lnk_01',
      { enabled: false, reason: 'Campaign ended' },
      'idem-state',
    );

    expect(callMock.mock.calls.map((entry) => entry[0])).toEqual([
      '/short-links',
      '/short-links/lnk_01',
      '/short-links/lnk_01/stats',
      '/short-links/lnk_01/destination',
      '/short-links/lnk_01/state',
    ]);
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/short-links/lnk_01/stats',
      expect.objectContaining({
        query: expect.objectContaining({ ianaTimeZone: 'Asia/Kolkata' }),
      }),
      expect.any(Function),
    );
  });
});
