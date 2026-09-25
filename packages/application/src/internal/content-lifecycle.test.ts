import { describe, expect, it, vi } from 'vitest';

import { latestJobPerTarget, settleContentItem, settleContentState } from './content-lifecycle';
import type { Db } from './runtime';

const t = (seconds: number): Date => new Date(Date.UTC(2026, 8, 1, 10, 0, seconds));

describe('content item settlement', () => {
  it('settles to published, partially published or failed', () => {
    expect(settleContentState(['published', 'published'])).toBe('published');
    expect(settleContentState(['published', 'failed_permanently'])).toBe('partially_published');
    expect(settleContentState(['action_required', 'failed_permanently'])).toBe(
      'failed_permanently',
    );
  });

  it('waits while any target is still moving', () => {
    expect(settleContentState(['published', 'dispatching'])).toBeNull();
    expect(settleContentState(['published', 'retry_scheduled'])).toBeNull();
  });

  it('ignores canceled targets and leaves an all-canceled item alone', () => {
    expect(settleContentState(['published', 'canceled'])).toBe('published');
    expect(settleContentState(['canceled'])).toBeNull();
    expect(settleContentState([])).toBeNull();
  });

  it('lets a retry replace the failure it retried', () => {
    const rows = [
      {
        id: 'job_a',
        postVariantId: 'pv_a',
        contentVersionId: 'v1',
        state: 'published',
        createdAt: t(0),
      },
      {
        id: 'job_b',
        postVariantId: 'pv_b',
        contentVersionId: 'v1',
        state: 'failed_permanently',
        createdAt: t(1),
      },
      {
        id: 'job_c',
        postVariantId: 'pv_b',
        contentVersionId: 'v1',
        state: 'published',
        createdAt: t(9),
      },
    ];
    expect(latestJobPerTarget(rows).map((row) => row.id)).toEqual(['job_a', 'job_c']);
  });

  it('counts only the most recently sent version', () => {
    const rows = [
      {
        id: 'job_old',
        postVariantId: 'pv_old',
        contentVersionId: 'v1',
        state: 'canceled',
        createdAt: t(0),
      },
      {
        id: 'job_new',
        postVariantId: 'pv_new',
        contentVersionId: 'v2',
        state: 'published',
        createdAt: t(5),
      },
    ];
    expect(latestJobPerTarget(rows).map((row) => row.id)).toEqual(['job_new']);
  });

  it('writes the settled state once every job is final', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const db = {
      publishJob: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'job_a',
            postVariantId: 'pv_a',
            contentVersionId: 'v1',
            state: 'published',
            createdAt: t(0),
          },
          {
            id: 'job_b',
            postVariantId: 'pv_b',
            contentVersionId: 'v1',
            state: 'failed_permanently',
            createdAt: t(1),
          },
        ]),
      },
      contentItem: { updateMany },
    } as unknown as Db;
    await expect(
      settleContentItem(db, { workspaceId: 'ws_1', contentItemId: 'ci_1' }),
    ).resolves.toBe('partially_published');
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 'ci_1', workspaceId: 'ws_1', state: { not: 'partially_published' } },
      data: { state: 'partially_published' },
    });
  });

  it('writes nothing while a sibling is still moving', async () => {
    const updateMany = vi.fn();
    const db = {
      publishJob: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'job_a',
            postVariantId: 'pv_a',
            contentVersionId: 'v1',
            state: 'published',
            createdAt: t(0),
          },
          {
            id: 'job_b',
            postVariantId: 'pv_b',
            contentVersionId: 'v1',
            state: 'dispatching',
            createdAt: t(1),
          },
        ]),
      },
      contentItem: { updateMany },
    } as unknown as Db;
    await expect(
      settleContentItem(db, { workspaceId: 'ws_1', contentItemId: 'ci_1' }),
    ).resolves.toBeNull();
    expect(updateMany).not.toHaveBeenCalled();
  });
});
