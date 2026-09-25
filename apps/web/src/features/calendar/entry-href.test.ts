import { describe, expect, it } from 'vitest';

import type { CalendarEntry } from './types';
import { receiptHrefForEntry } from './entry-href';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    publishJobId: 'job_01j000000000000000000001',
    contentItemId: 'content_01j0000000000000000001',
    title: 'Launch note',
    scheduledAt: '2026-09-04T10:00:00.000Z',
    timeZone: 'Europe/Berlin',
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@example',
    targetCount: 1,
    mediaKind: 'text',
    ...overrides,
  };
}

describe('receiptHrefForEntry', () => {
  it('carries the job through to the post status and receipt anchor', () => {
    expect(receiptHrefForEntry('/posts/{id}', entry())).toBe(
      '/posts/content_01j0000000000000000001?job=job_01j000000000000000000001#receipt',
    );
  });

  it('does not invent a receipt destination for a draft without a job', () => {
    expect(receiptHrefForEntry('/posts/{id}', entry({ publishJobId: null }))).toBeNull();
  });
});
