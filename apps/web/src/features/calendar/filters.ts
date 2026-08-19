/**
 * Calendar filters, held in the URL.
 *
 * The URL is the state store because a filtered calendar is something people
 * send to each other: "the failed LinkedIn posts this week" has to survive a
 * paste into a message. It also means the browser back button undoes a filter,
 * which is the behaviour everybody already expects.
 */

import type { ProviderId, PublishState } from '@/lib/api/types';
import { EMPTY_FILTERS, isAttentionState } from './types';
import type { CalendarEntry, CalendarFilters, CalendarView, QueueBucket } from './types';

const VIEWS: readonly CalendarView[] = ['day', 'week', 'month', 'list'];
const BUCKETS: readonly QueueBucket[] = ['scheduled', 'draft', 'published', 'failed'];
const PROVIDERS: readonly ProviderId[] = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  'mastodon',
  'telegram',
  'reddit',
  'wordpress',
  'medium',
  'devto',
  'pinterest',
  'discord',
  'slack',
  'fake',
];

/** A minimal read-only view of whatever search parameter carrier is in play. */
export interface ReadableParams {
  get(name: string): string | null;
}

function pick<T extends string>(
  params: ReadableParams,
  name: string,
  allowed: readonly T[],
): T | null {
  const raw = params.get(name);
  if (raw === null) return null;
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : null;
}

export function parseView(params: ReadableParams, fallback: CalendarView): CalendarView {
  return pick(params, 'view', VIEWS) ?? fallback;
}

/**
 * The anchor date. An unparseable value falls back to `now` rather than to the
 * epoch, because a calendar that silently jumps to 1970 looks broken.
 */
export function parseAnchor(params: ReadableParams, now: Date): Date {
  const raw = params.get('date');
  if (raw === null) return now;
  const parsed = new Date(`${raw}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? now : parsed;
}

/** `2026-08-06`, the form the anchor takes in the URL. */
export function formatAnchor(anchor: Date): string {
  return anchor.toISOString().slice(0, 10);
}

export function parseFilters(params: ReadableParams): CalendarFilters {
  return {
    projectId: params.get('project'),
    connectionId: params.get('account'),
    provider: pick(params, 'platform', PROVIDERS),
    bucket: pick(params, 'status', BUCKETS),
    contentLocale: params.get('locale'),
    campaignName: params.get('campaign'),
    customerGroupId: params.get('group'),
    attentionOnly: params.get('attention') === '1',
  };
}

/**
 * Serialize back into search parameters.
 *
 * Only non-default values are written, so the common case is a clean URL and
 * two people looking at "this week, everything" share the same link.
 */
export function toSearchParams(
  view: CalendarView,
  anchor: Date,
  filters: CalendarFilters,
  defaultView: CalendarView,
): URLSearchParams {
  const params = new URLSearchParams();
  if (view !== defaultView) params.set('view', view);
  params.set('date', formatAnchor(anchor));
  if (filters.projectId) params.set('project', filters.projectId);
  if (filters.connectionId) params.set('account', filters.connectionId);
  if (filters.provider) params.set('platform', filters.provider);
  if (filters.bucket) params.set('status', filters.bucket);
  if (filters.contentLocale) params.set('locale', filters.contentLocale);
  if (filters.campaignName) params.set('campaign', filters.campaignName);
  if (filters.customerGroupId) params.set('group', filters.customerGroupId);
  if (filters.attentionOnly) params.set('attention', '1');
  return params;
}

/** How many filters are narrowing the view right now. */
export function countActiveFilters(filters: CalendarFilters): number {
  let count = 0;
  if (filters.projectId) count += 1;
  if (filters.connectionId) count += 1;
  if (filters.provider) count += 1;
  if (filters.bucket) count += 1;
  if (filters.contentLocale) count += 1;
  if (filters.campaignName) count += 1;
  if (filters.customerGroupId) count += 1;
  if (filters.attentionOnly) count += 1;
  return count;
}

export function hasActiveFilters(filters: CalendarFilters): boolean {
  return countActiveFilters(filters) > 0;
}

export function clearFilters(): CalendarFilters {
  return EMPTY_FILTERS;
}

/**
 * Which queue bucket a publish state belongs to.
 *
 * `partially_published` is deliberately in `failed` rather than in `published`:
 * it is work that still needs a person, and hiding it under the published
 * filter is how a half-published campaign gets forgotten. The receipt is where
 * the honest split between the two halves is shown.
 */
export function bucketForState(state: PublishState): QueueBucket {
  switch (state) {
    case 'draft':
    case 'validation_needed':
    case 'approval_requested':
    case 'approved':
      return 'draft';
    case 'scheduled':
    case 'preparing_media':
    case 'dispatching':
    case 'provider_processing':
    case 'retry_scheduled':
      return 'scheduled';
    case 'published':
      return 'published';
    default:
      return 'failed';
  }
}

/** Apply every active filter. Pure, so the empty state can explain the result. */
export function applyFilters(
  entries: readonly CalendarEntry[],
  filters: CalendarFilters,
): readonly CalendarEntry[] {
  return entries.filter((entry) => {
    if (filters.projectId && (entry.projectId ?? null) !== filters.projectId) return false;
    if (filters.connectionId && (entry.connectionId ?? null) !== filters.connectionId) {
      return false;
    }
    if (filters.provider && entry.provider !== filters.provider) return false;
    if (filters.bucket && bucketForState(entry.state) !== filters.bucket) return false;
    if (filters.contentLocale && (entry.contentLocale ?? null) !== filters.contentLocale) {
      return false;
    }
    if (filters.campaignName && (entry.campaignName ?? null) !== filters.campaignName) {
      return false;
    }
    if (filters.customerGroupId && (entry.customerGroupId ?? null) !== filters.customerGroupId) {
      return false;
    }
    if (filters.attentionOnly && !needsAttention(entry)) return false;
    return true;
  });
}

/** True when a person has to decide or fix something for this entry. */
export function needsAttention(entry: CalendarEntry): boolean {
  return isAttentionState(entry.state) || entry.approvalState === 'requested';
}

/** Sort by publish time, then by account so a slot is stable between renders. */
export function sortEntries(entries: readonly CalendarEntry[]): readonly CalendarEntry[] {
  return [...entries].sort((left, right) => {
    const delta = new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime();
    if (delta !== 0) return delta;
    return left.accountLabel.localeCompare(right.accountLabel);
  });
}

/** Stable row key. The content item id alone repeats across targets. */
export function entryKey(entry: CalendarEntry): string {
  return entry.entryId ?? `${entry.contentItemId}:${entry.provider}:${entry.accountLabel}`;
}
