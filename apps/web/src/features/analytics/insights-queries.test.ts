import { describe, expect, it } from 'vitest';

import { parsePostFeedback, parseWhatWorks } from './insights-queries';

describe('insight response parsing', () => {
  it('keeps a missing reading as null rather than zero', () => {
    const parsed = parsePostFeedback({
      contentItemId: 'post_1',
      channels: [
        {
          publishJobId: 'job_1',
          receiptId: 'rcpt_1',
          connectionId: 'conn_1',
          provider: 'linkedin',
          state: 'succeeded',
          scheduledFor: null,
          dispatchedAt: null,
          publishedAt: '2026-09-01T10:00:00Z',
          permalink: null,
          readings: [
            {
              insightId: 'ins_1',
              window: 'twenty_four_hours',
              verdict: 'insufficient_data',
              metric: 'impressions',
              subjectValue: null,
              medianValue: null,
              effectSize: null,
              sampleSize: null,
              smallSample: false,
              confounderKeys: [],
            },
          ],
          verdict: 'insufficient_data',
          nextTest: null,
          failure: null,
          pendingReasonKey: null,
        },
      ],
    });
    expect(parsed.channels[0]?.readings[0]?.subjectValue).toBeNull();
  });

  it('rejects a malformed response instead of casting it', () => {
    expect(() => parseWhatWorks({ rows: 'nope' })).toThrow();
  });
});
