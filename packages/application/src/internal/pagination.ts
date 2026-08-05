import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, type Paginated } from '@relay/contracts';

/**
 * Cursor pagination.
 *
 * The cursor is the last row's sortable primary key, base64url encoded so it is
 * opaque to a client and cannot be arithmetic'd into somebody else's page. It
 * carries no workspace, because every query is already workspace scoped.
 */

export function encodeCursor(id: string): string {
  return Buffer.from(id, 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string | undefined): string | null {
  if (cursor === undefined || cursor === '') {
    return null;
  }
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return decoded === '' ? null : decoded;
}

export function normalizeLimit(limit: number | undefined): number {
  if (limit === undefined || !Number.isFinite(limit)) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(limit)));
}

/**
 * Prisma arguments for one page. We ask for `limit + 1` rows so `hasMore` is a
 * fact rather than a second count query.
 */
export interface PageArgs {
  readonly take: number;
  readonly skip: number;
  readonly cursor: { readonly id: string } | undefined;
  readonly limit: number;
}

export function pageArgs(query: { cursor?: string; limit?: number } | undefined): PageArgs {
  const limit = normalizeLimit(query?.limit);
  const after = decodeCursor(query?.cursor);
  return {
    take: limit + 1,
    skip: after === null ? 0 : 1,
    cursor: after === null ? undefined : { id: after },
    limit,
  };
}

/** Trim the lookahead row and build the envelope. */
export function toPage<Row, View>(
  rows: readonly Row[],
  args: PageArgs,
  idOf: (row: Row) => string,
  map: (row: Row) => View,
): Paginated<View> {
  const hasMore = rows.length > args.limit;
  const page = hasMore ? rows.slice(0, args.limit) : rows;
  const last = page.at(-1);
  return {
    data: page.map(map),
    pageInfo: {
      nextCursor: hasMore && last !== undefined ? encodeCursor(idOf(last)) : null,
      hasMore,
      limit: args.limit,
    },
  };
}

/** Build a page from an already materialised list, for in-memory projections. */
export function toPageOf<View>(items: readonly View[], limit: number): Paginated<View> {
  return {
    data: [...items],
    pageInfo: { nextCursor: null, hasMore: false, limit },
  };
}
