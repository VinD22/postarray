import { describe, expect, it } from 'vitest';

import {
  applyFilters,
  bucketForState,
  countActiveFilters,
  entryKey,
  formatAnchor,
  needsAttention,
  parseAnchor,
  parseFilters,
  parseView,
  sortEntries,
  toSearchParams,
} from './filters';
import { EMPTY_FILTERS } from './types';
import type { CalendarEntry } from './types';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    contentItemId: 'post_01j000000000000000000001',
    title: 'Case study',
    scheduledAt: '2026-08-06T07:30:00.000Z',
    timeZone: 'Europe/Berlin',
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'linkedin',
    accountLabel: 'Acme EU',
    targetCount: 2,
    mediaKind: 'text',
    ...overrides,
  };
}

describe('parsing', () => {
  it('accepts a known view and rejects anything else', () => {
    expect(parseView(new URLSearchParams('view=month'), 'week')).toBe('month');
    expect(parseView(new URLSearchParams('view=spiral'), 'week')).toBe('week');
    expect(parseView(new URLSearchParams(''), 'list')).toBe('list');
  });

  it('falls back to now for an unparseable anchor', () => {
    const now = new Date('2026-08-06T00:00:00.000Z');
    expect(parseAnchor(new URLSearchParams('date=not-a-date'), now)).toEqual(now);
    expect(formatAnchor(parseAnchor(new URLSearchParams('date=2026-01-02'), now))).toBe(
      '2026-01-02',
    );
  });

  it('drops a platform value that is not a known provider', () => {
    expect(parseFilters(new URLSearchParams('platform=myspace')).provider).toBeNull();
    expect(parseFilters(new URLSearchParams('platform=tiktok')).provider).toBe('tiktok');
  });

  it('reads every filter from the query string', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'brand=brand_1&account=conn_1&platform=x&status=failed&locale=de&campaign=Q3&group=grp_1&attention=1',
      ),
    );
    expect(filters).toEqual({
      brandId: 'brand_1',
      connectionId: 'conn_1',
      provider: 'x',
      bucket: 'failed',
      contentLocale: 'de',
      campaignName: 'Q3',
      customerGroupId: 'grp_1',
      attentionOnly: true,
    });
    expect(countActiveFilters(filters)).toBe(8);
  });
});

describe('serializing', () => {
  it('omits the default view so a shared link stays short', () => {
    const params = toSearchParams('week', new Date('2026-08-06T00:00:00.000Z'), EMPTY_FILTERS, 'week');
    expect(params.get('view')).toBeNull();
    expect(params.get('date')).toBe('2026-08-06');
    expect(params.toString()).toBe('date=2026-08-06');
  });

  it('round trips a filtered view', () => {
    const filters = { ...EMPTY_FILTERS, provider: 'x' as const, bucket: 'failed' as const };
    const params = toSearchParams('list', new Date('2026-08-06T00:00:00.000Z'), filters, 'week');
    expect(parseView(params, 'week')).toBe('list');
    expect(parseFilters(params)).toMatchObject({ provider: 'x', bucket: 'failed' });
  });
});

describe('bucketForState', () => {
  it('treats a partially published campaign as work, not as published', () => {
    expect(bucketForState('partially_published')).toBe('failed');
    expect(bucketForState('published')).toBe('published');
  });

  it('groups the in flight states with scheduled', () => {
    expect(bucketForState('preparing_media')).toBe('scheduled');
    expect(bucketForState('dispatching')).toBe('scheduled');
    expect(bucketForState('retry_scheduled')).toBe('scheduled');
  });

  it('groups the pre-schedule states with drafts', () => {
    expect(bucketForState('draft')).toBe('draft');
    expect(bucketForState('approval_requested')).toBe('draft');
    expect(bucketForState('validation_needed')).toBe('draft');
  });

  it('puts every terminal failure in the failed bucket', () => {
    expect(bucketForState('failed_permanently')).toBe('failed');
    expect(bucketForState('action_required')).toBe('failed');
    expect(bucketForState('canceled')).toBe('failed');
    expect(bucketForState('deleted_externally')).toBe('failed');
  });
});

describe('applyFilters', () => {
  const entries: CalendarEntry[] = [
    entry({ contentItemId: 'a', provider: 'x', contentLocale: 'en', state: 'scheduled' }),
    entry({
      contentItemId: 'b',
      provider: 'linkedin',
      contentLocale: 'de',
      state: 'failed_permanently',
    }),
    entry({
      contentItemId: 'c',
      provider: 'x',
      contentLocale: 'de',
      state: 'published',
      approvalState: 'approved',
    }),
  ];

  it('narrows by platform', () => {
    expect(applyFilters(entries, { ...EMPTY_FILTERS, provider: 'x' })).toHaveLength(2);
  });

  it('narrows by content language', () => {
    expect(applyFilters(entries, { ...EMPTY_FILTERS, contentLocale: 'de' })).toHaveLength(2);
  });

  it('narrows by queue bucket', () => {
    expect(applyFilters(entries, { ...EMPTY_FILTERS, bucket: 'failed' })).toHaveLength(1);
  });

  it('narrows to work that needs a person', () => {
    const withApproval = [
      ...entries,
      entry({ contentItemId: 'd', state: 'scheduled', approvalState: 'requested' }),
    ];
    const result = applyFilters(withApproval, { ...EMPTY_FILTERS, attentionOnly: true });
    expect(result.map((item) => item.contentItemId).sort()).toEqual(['b', 'd']);
  });

  it('returns everything when nothing is set', () => {
    expect(applyFilters(entries, EMPTY_FILTERS)).toHaveLength(3);
  });
});

describe('needsAttention', () => {
  it('counts a waiting approval as needing a person', () => {
    expect(needsAttention(entry({ approvalState: 'requested' }))).toBe(true);
  });

  it('counts a partially published campaign as needing a person', () => {
    expect(needsAttention(entry({ state: 'partially_published' }))).toBe(true);
  });

  it('leaves a healthy scheduled post alone', () => {
    expect(needsAttention(entry())).toBe(false);
  });
});

describe('ordering and identity', () => {
  it('sorts by time then by account', () => {
    const sorted = sortEntries([
      entry({ contentItemId: 'b', accountLabel: 'Zed', scheduledAt: '2026-08-06T09:00:00.000Z' }),
      entry({ contentItemId: 'c', accountLabel: 'Ada', scheduledAt: '2026-08-06T09:00:00.000Z' }),
      entry({ contentItemId: 'a', scheduledAt: '2026-08-06T07:00:00.000Z' }),
    ]);
    expect(sorted.map((item) => item.contentItemId)).toEqual(['a', 'c', 'b']);
  });

  it('distinguishes two targets of the same content item', () => {
    const left = entry({ provider: 'x', accountLabel: '@acme' });
    const right = entry({ provider: 'linkedin', accountLabel: 'Acme EU' });
    expect(entryKey(left)).not.toBe(entryKey(right));
  });
});
