import { describe, expect, it } from 'vitest';

import { shouldPollPostDetail } from './use-receipt';

describe('live post detail polling', () => {
  it('keeps polling while an accepted job can still produce a receipt', () => {
    expect(shouldPollPostDetail({ receipt: null, job: { state: 'scheduled' } })).toBe(true);
    expect(shouldPollPostDetail({ receipt: null, job: { state: 'provider_processing' } })).toBe(
      true,
    );
  });

  it('stops when a receipt arrives or a job ends without one', () => {
    expect(shouldPollPostDetail({ receipt: {}, job: { state: 'published' } })).toBe(false);
    expect(shouldPollPostDetail({ receipt: null, job: { state: 'failed_permanently' } })).toBe(
      false,
    );
    expect(shouldPollPostDetail({ receipt: null, job: null })).toBe(false);
  });
});
