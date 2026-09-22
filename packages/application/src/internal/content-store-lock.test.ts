import { ConflictError, NotFoundError } from '@relay/contracts';
import { describe, expect, it, vi } from 'vitest';

import { assertExpectedVersion, lockContentItem, type ContentAggregate } from './content-store';
import type { Db } from './runtime';

function aggregate(currentVersionId: string): ContentAggregate {
  return { itemId: 'post_1', currentVersionId, revision: 4 } as unknown as ContentAggregate;
}

describe('composite save guards', () => {
  it('accepts a save built on the current version', () => {
    expect(() => assertExpectedVersion(aggregate('ver_4'), 'ver_4')).not.toThrow();
  });

  it('accepts a save with no expectation, as the API allows', () => {
    expect(() => assertExpectedVersion(aggregate('ver_4'), undefined)).not.toThrow();
    expect(() => assertExpectedVersion(aggregate('ver_4'), null)).not.toThrow();
  });

  it('refuses a stale save with a 409 conflict naming the current revision', () => {
    try {
      assertExpectedVersion(aggregate('ver_4'), 'ver_3');
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictError);
      const conflict = error as ConflictError;
      expect(conflict.messageKey).toBe('errors.content_conflict');
      expect(conflict.details).toMatchObject({ currentRevision: 4, currentVersionId: 'ver_4' });
    }
  });

  it('takes the row lock with an update before anything is read', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const db = { contentItem: { updateMany } } as unknown as Db;
    const now = new Date('2026-09-23T10:00:00.000Z');
    await lockContentItem(db, 'post_1', now);
    expect(updateMany).toHaveBeenCalledWith({ where: { id: 'post_1' }, data: { updatedAt: now } });
  });

  it('reports a missing item as not found rather than a conflict', async () => {
    const db = {
      contentItem: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
    } as unknown as Db;
    await expect(lockContentItem(db, 'post_x', new Date())).rejects.toBeInstanceOf(NotFoundError);
  });
});
