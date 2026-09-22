import type { Paginated } from '@relay/contracts';

/**
 * Hard stop on how many pages one read may follow. With the server's maximum
 * page size this is thousands of rows, far past anything a screen renders; it
 * exists so a server bug that repeats a cursor cannot spin forever.
 */
export const MAX_FOLLOWED_PAGES = 20;

/** Largest page the API accepts (`MAX_PAGE_SIZE` in `@relay/contracts`). */
export const FOLLOW_PAGE_SIZE = 100;

/**
 * Follow `pageInfo.nextCursor` until the list is exhausted and return one page
 * holding every row.
 *
 * Screens that draw a whole set (a calendar range, the accounts a post can go
 * to, the media a post can use) used to read only the first page and silently
 * drop the rest. If the cap is reached, the returned `pageInfo` still says
 * `hasMore: true` with the next cursor, so a caller can tell the list is
 * partial instead of presenting it as complete.
 */
export async function collectAllPages<T>(
  fetchPage: (cursor: string | undefined) => Promise<Paginated<T>>,
  maxPages: number = MAX_FOLLOWED_PAGES,
): Promise<Paginated<T>> {
  const rows: T[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  let last: Paginated<T> | null = null;

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const page: Paginated<T> = await fetchPage(cursor);
    last = page;
    rows.push(...page.data);
    const next = page.pageInfo.nextCursor;
    if (!page.pageInfo.hasMore || next === null || seen.has(next)) {
      return { data: rows, pageInfo: { ...page.pageInfo, hasMore: false, nextCursor: null } };
    }
    seen.add(next);
    cursor = next;
  }

  return {
    data: rows,
    pageInfo: {
      limit: last?.pageInfo.limit ?? FOLLOW_PAGE_SIZE,
      hasMore: true,
      nextCursor: cursor ?? null,
    },
  };
}
