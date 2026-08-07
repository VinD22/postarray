import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FixedClock } from './clock';
import { LocalFileStorage, MemoryStorage } from './storage';

const clock = new FixedClock(new Date('2026-08-07T00:00:00.000Z'));

describe('storage prefix pagination', () => {
  it('pages memory objects without crossing a workspace prefix', async () => {
    const storage = new MemoryStorage(clock);
    await storage.write('ws_1/media/a', new Uint8Array([1]), 'application/octet-stream');
    await storage.write('ws_1/media/b', new Uint8Array([2]), 'application/octet-stream');
    await storage.write('ws_2/media/c', new Uint8Array([3]), 'application/octet-stream');

    const first = await storage.list({
      workspaceId: 'ws_1',
      prefix: 'ws_1/media/',
      cursor: null,
      limit: 1,
    });
    expect(first).toEqual({ keys: ['ws_1/media/a'], nextCursor: 'ws_1/media/a' });

    const second = await storage.list({
      workspaceId: 'ws_1',
      prefix: 'ws_1/media/',
      cursor: first.nextCursor,
      limit: 1,
    });
    expect(second).toEqual({ keys: ['ws_1/media/b'], nextCursor: null });
    await expect(
      storage.list({ workspaceId: 'ws_2', prefix: 'ws_1/media/', cursor: null, limit: 10 }),
    ).rejects.toMatchObject({ code: 'MEDIA_INVALID' });
  });

  it('walks nested local files and resumes after a cursor', async () => {
    const root = await mkdtemp(join(tmpdir(), 'relay-storage-'));
    try {
      const storage = new LocalFileStorage({
        rootDirectory: root,
        uploadBaseUrl: 'http://localhost/uploads',
        downloadBaseUrl: 'http://localhost/objects',
        clock,
      });
      await storage.write('ws_1/media/a', new Uint8Array([1]), 'application/octet-stream');
      await storage.write('ws_1/media/nested/b', new Uint8Array([2]), 'application/octet-stream');
      await storage.write('ws_1/other/c', new Uint8Array([3]), 'application/octet-stream');

      const first = await storage.list({
        workspaceId: 'ws_1',
        prefix: 'ws_1/media/',
        cursor: null,
        limit: 1,
      });
      expect(first.keys).toEqual(['ws_1/media/a']);
      const second = await storage.list({
        workspaceId: 'ws_1',
        prefix: 'ws_1/media/',
        cursor: first.nextCursor,
        limit: 10,
      });
      expect(second).toEqual({ keys: ['ws_1/media/nested/b'], nextCursor: null });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
