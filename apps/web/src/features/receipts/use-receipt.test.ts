import { describe, expect, it } from 'vitest';

import { pickPrimaryReceiptId, pollDelayMs, shouldPollPostDetail } from './use-receipt';
import type { ContentPublication } from './types';

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

describe('publication read model polling', () => {
  const target = (final: boolean, receiptId: string | null = null) =>
    ({ final, receiptId }) as unknown as ContentPublication['targets'][number];

  it('polls until every target is final, whatever the primary receipt says', () => {
    expect(
      shouldPollPostDetail({
        receipt: {},
        job: { state: 'published' },
        publication: { settled: false, targets: [target(true, 'rcpt_1'), target(false)] },
      }),
    ).toBe(true);
    expect(
      shouldPollPostDetail({
        receipt: null,
        job: { state: 'failed_permanently' },
        publication: { settled: true, targets: [target(true)] },
      }),
    ).toBe(false);
  });

  it('backs off from two seconds to a fifteen second ceiling', () => {
    expect(pollDelayMs(0)).toBe(2_000);
    expect(pollDelayMs(1)).toBe(3_000);
    expect(pollDelayMs(2)).toBe(4_500);
    expect(pollDelayMs(20)).toBe(15_000);
  });

  it('opens the first receipt that exists, never a failed target', () => {
    expect(
      pickPrimaryReceiptId({
        targets: [target(true), target(true, 'rcpt_2')],
      } as unknown as ContentPublication),
    ).toBe('rcpt_2');
  });
});
