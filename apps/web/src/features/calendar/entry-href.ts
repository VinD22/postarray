import type { CalendarEntry } from './types';

/** Preserve the accepted job identity when a calendar row opens its status. */
export function receiptHrefForEntry(postHrefPattern: string, entry: CalendarEntry): string | null {
  if (!entry.publishJobId) return null;
  const postHref = postHrefPattern.replace('{id}', entry.contentItemId);
  return `${postHref}?job=${encodeURIComponent(entry.publishJobId)}#receipt`;
}
