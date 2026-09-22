import { describe, expect, it, vi } from 'vitest';

import { collectAllPages } from './paginate';

function page(data: number[], nextCursor: string | null) {
  return { data, pageInfo: { nextCursor, hasMore: nextCursor !== null, limit: 2 } };
}

describe('collectAllPages', () => {
  it('follows cursors until the list is exhausted', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(page([1, 2], 'c1'))
      .mockResolvedValueOnce(page([3, 4], 'c2'))
      .mockResolvedValueOnce(page([5], null));
    const result = await collectAllPages(fetchPage);
    expect(result.data).toEqual([1, 2, 3, 4, 5]);
    expect(result.pageInfo.hasMore).toBe(false);
    expect(fetchPage.mock.calls.map((call) => call[0])).toEqual([undefined, 'c1', 'c2']);
  });

  it('stops on a repeated cursor instead of looping', async () => {
    const fetchPage = vi.fn().mockResolvedValue(page([1], 'same'));
    const result = await collectAllPages(fetchPage);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(result.data).toEqual([1, 1]);
  });

  it('reports a capped read as partial, never as complete', async () => {
    const fetchPage = vi.fn((cursor: string | undefined) =>
      Promise.resolve(page([1], `${cursor ?? ''}x`)),
    );
    const result = await collectAllPages(fetchPage, 3);
    expect(result.data).toHaveLength(3);
    expect(result.pageInfo.hasMore).toBe(true);
    expect(result.pageInfo.nextCursor).toBe('xxx');
  });
});
