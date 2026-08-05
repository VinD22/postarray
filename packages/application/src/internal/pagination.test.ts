import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { decodeCursor, encodeCursor, normalizeLimit, pageArgs, toPage } from './pagination.js';

interface Row {
  readonly id: string;
  readonly name: string;
}

const rows: readonly Row[] = Array.from({ length: 5 }, (_, index) => ({
  id: `row-${index}`,
  name: `Row ${index}`,
}));

describe('cursors', () => {
  it('round trip', () => {
    expect(decodeCursor(encodeCursor('row-3'))).toBe('row-3');
  });

  it('treat an absent or empty cursor as the first page', () => {
    expect(decodeCursor(undefined)).toBeNull();
    expect(decodeCursor('')).toBeNull();
  });
});

describe('normalizeLimit', () => {
  it('defaults when absent', () => {
    expect(normalizeLimit(undefined)).toBe(DEFAULT_PAGE_SIZE);
  });

  it('clamps to the maximum and the minimum', () => {
    expect(normalizeLimit(1000)).toBe(MAX_PAGE_SIZE);
    expect(normalizeLimit(0)).toBe(1);
    expect(normalizeLimit(-5)).toBe(1);
  });
});

describe('pageArgs', () => {
  it('asks for one extra row so hasMore is a fact', () => {
    expect(pageArgs({ limit: 10 }).take).toBe(11);
  });

  it('skips the cursor row itself', () => {
    const args = pageArgs({ limit: 10, cursor: encodeCursor('row-2') });
    expect(args.skip).toBe(1);
    expect(args.cursor).toEqual({ id: 'row-2' });
  });
});

describe('toPage', () => {
  it('trims the lookahead row and returns a next cursor', () => {
    const args = pageArgs({ limit: 4 });
    const page = toPage(
      rows,
      args,
      (row) => row.id,
      (row) => row.name,
    );
    expect(page.data).toEqual(['Row 0', 'Row 1', 'Row 2', 'Row 3']);
    expect(page.pageInfo.hasMore).toBe(true);
    expect(decodeCursor(page.pageInfo.nextCursor ?? undefined)).toBe('row-3');
  });

  it('reports the end of the list honestly', () => {
    const args = pageArgs({ limit: 10 });
    const page = toPage(
      rows,
      args,
      (row) => row.id,
      (row) => row.name,
    );
    expect(page.data).toHaveLength(5);
    expect(page.pageInfo.hasMore).toBe(false);
    expect(page.pageInfo.nextCursor).toBeNull();
  });

  it('handles an empty result', () => {
    const args = pageArgs({});
    const page = toPage(
      [],
      args,
      (row: Row) => row.id,
      (row: Row) => row.name,
    );
    expect(page.data).toEqual([]);
    expect(page.pageInfo.hasMore).toBe(false);
    expect(page.pageInfo.limit).toBe(DEFAULT_PAGE_SIZE);
  });
});
