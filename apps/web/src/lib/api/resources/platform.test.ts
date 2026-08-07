import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { automationRulesApi, rssApi } from './platform';

describe('browser automation resource contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue(null);
  });

  it('uses the canonical automation rule routes and object test event', async () => {
    await automationRulesApi.list({ limit: 10 });
    await automationRulesApi.get('rule_01');
    await automationRulesApi.previewSaved('rule_01');
    await automationRulesApi.testRun('rule_01', { sampleEvent: { source: 'test' } }, 'idem-test');
    await automationRulesApi.listRuns('rule_01', { limit: 20 });

    expect(callMock.mock.calls.map((entry) => entry[0])).toEqual([
      '/automation-rules',
      '/automation-rules/rule_01',
      '/automation-rules/rule_01/preview',
      '/automation-rules/rule_01/test-runs',
      '/automation-rules/rule_01/runs',
    ]);
    expect(callMock).toHaveBeenNthCalledWith(
      4,
      '/automation-rules/rule_01/test-runs',
      expect.objectContaining({
        method: 'POST',
        body: { sampleEvent: { source: 'test' } },
        idempotencyKey: 'idem-test',
      }),
      expect.any(Function),
    );
  });

  it('uses the nested RSS feed routes', async () => {
    await rssApi.validateFeed({ url: 'https://example.test/feed.xml' });
    await rssApi.list({ limit: 10 });
    await rssApi.getHealth('feed_01');
    await rssApi.update('feed_01', { paused: true });
    await rssApi.delete('feed_01');

    expect(callMock.mock.calls.map((entry) => entry[0])).toEqual([
      '/rss/feeds/validate',
      '/rss/feeds',
      '/rss/feeds/feed_01/health',
      '/rss/feeds/feed_01',
      '/rss/feeds/feed_01',
    ]);
    expect(callMock).toHaveBeenNthCalledWith(
      4,
      '/rss/feeds/feed_01',
      expect.objectContaining({ method: 'PATCH', body: { paused: true } }),
      expect.any(Function),
    );
  });
});
