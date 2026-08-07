import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { shortLinksApi } from './insights';

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
