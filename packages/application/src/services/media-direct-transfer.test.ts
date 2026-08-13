import { newIdFor } from '@relay/contracts';
import { describe, expect, it, vi } from 'vitest';

import { FixedClock } from '../ports/clock';
import { LocalFileStorage } from '../ports/storage';
import type { ActorContext, ServiceDeps, StoragePort } from '../types';
import {
  assertStorageKeyBelongsToWorkspace,
  createMediaService,
  requireLocalStorage,
} from './media';

/**
 * The direct-transfer pair.
 *
 * `LocalFileStorage` hands out an upload ticket pointing at our own API rather
 * than at a presigned object-store URL, so these two seams exist to answer it.
 * Everything asserted here is a refusal: the routes must be inert wherever
 * presigned PUTs are configured, and every field of the request must be checked
 * against the pending row the ticket was issued for.
 */

const workspaceId = newIdFor('workspace');
const digest = 'a'.repeat(64);
const storageKey = `${workspaceId}/${digest}`;
const bytes = new Uint8Array([1, 2, 3, 4]);

const ctx: ActorContext = {
  actorType: 'user',
  actorId: newIdFor('user'),
  workspaceId,
  scopes: ['media:write', 'media:read'],
  surface: 'web',
  correlationId: 'corr_direct_transfer_test',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

function localStorageAdapter(): LocalFileStorage {
  return new LocalFileStorage({
    rootDirectory: '.relay-media-test',
    uploadBaseUrl: 'https://api.example.test/v1/media/uploads',
    downloadBaseUrl: 'https://api.example.test/v1/media/objects',
    clock: new FixedClock(new Date('2026-08-12T00:00:00.000Z')),
  });
}

interface HarnessOptions {
  readonly storage?: StoragePort;
  readonly asset?: Record<string, unknown> | null;
}

function harness(options: HarnessOptions = {}) {
  const write = vi.fn(async () => ({
    key: storageKey,
    byteSize: bytes.byteLength,
    contentType: 'image/png',
    checksumSha256: digest,
  }));
  const read = vi.fn(async () => bytes);
  const storage = options.storage ?? localStorageAdapter();
  if (storage instanceof LocalFileStorage) {
    // Exercise every check without touching the filesystem.
    Object.assign(storage, {});
    vi.spyOn(storage, 'write').mockImplementation(write);
    vi.spyOn(storage, 'read').mockImplementation(read);
  }

  const asset =
    options.asset === undefined
      ? {
          id: newIdFor('media'),
          mimeType: 'image/png',
          byteSize: BigInt(bytes.byteLength),
          checksumSha256: digest,
        }
      : options.asset;

  const db = {
    workspace: {
      findUnique: async () => ({
        id: workspaceId,
        name: 'Test workspace',
        status: 'active',
        defaultLocale: 'en',
        defaultTimeZone: 'UTC',
        killSwitchAt: null,
        deletedAt: null,
      }),
    },
    membership: {
      findFirst: async () => ({ role: 'owner', state: 'active', brandScope: [] }),
    },
    rolePermission: { findMany: async () => [] },
    mediaAsset: { findFirst: async () => asset },
    $executeRaw: async () => 0,
  };

  const deps = {
    prisma: {
      ...db,
      $transaction: async <T>(handler: (tx: typeof db) => Promise<T>): Promise<T> =>
        await handler(db),
    },
    storage,
    clock: new FixedClock(new Date('2026-08-12T00:00:00.000Z')),
    config: { neon: { storageBucket: 'relay-test' }, core: {} },
  } as unknown as ServiceDeps;

  return { deps, service: createMediaService(deps), write, read };
}

describe('storage key binding', () => {
  it('accepts only a key prefixed with the caller workspace', () => {
    expect(() => assertStorageKeyBelongsToWorkspace(workspaceId, storageKey)).not.toThrow();
    expect(() =>
      assertStorageKeyBelongsToWorkspace(workspaceId, `${newIdFor('workspace')}/${digest}`),
    ).toThrowError(expect.objectContaining({ code: 'FORBIDDEN' }));
  });

  it('refuses a traversal segment or a control character rather than cleaning it', () => {
    expect(() =>
      assertStorageKeyBelongsToWorkspace(workspaceId, `${workspaceId}/../secrets`),
    ).toThrowError(expect.objectContaining({ code: 'FORBIDDEN' }));
    expect(() =>
      assertStorageKeyBelongsToWorkspace(workspaceId, `${workspaceId}/a\x00b`),
    ).toThrowError(expect.objectContaining({ code: 'FORBIDDEN' }));
  });
});

describe('direct transfer availability', () => {
  it('is unavailable wherever presigned PUTs are configured', () => {
    // `NeonObjectStorage` lives in `@relay/runtime`, which this package must
    // not import. Any adapter that is not the local one is refused, so a bare
    // port double proves the same rule.
    const presigned = {
      createUploadTicket: async () => {
        throw new Error('not used');
      },
      head: async () => null,
      read: async () => new Uint8Array(),
      write: async () => {
        throw new Error('not used');
      },
      remove: async () => undefined,
      list: async () => ({ keys: [], nextCursor: null }),
    } as unknown as StoragePort;

    expect(() => requireLocalStorage({ storage: presigned })).toThrowError(
      expect.objectContaining({ code: 'CAPABILITY_NOT_IMPLEMENTED' }),
    );
  });

  it('is available for the local filesystem adapter', () => {
    expect(() => requireLocalStorage({ storage: localStorageAdapter() })).not.toThrow();
  });
});

describe('acceptDirectUpload', () => {
  it('stores the bytes when every ticketed fact matches', async () => {
    const test = harness();

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey,
        contentType: 'image/png',
        checksumSha256: digest,
        bytes,
      }),
    ).resolves.toEqual({ byteSize: bytes.byteLength });
    expect(test.write).toHaveBeenCalledWith(storageKey, bytes, 'image/png');
  });

  it('refuses a key belonging to another workspace before it reads anything', async () => {
    const test = harness();

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey: `${newIdFor('workspace')}/${digest}`,
        contentType: 'image/png',
        checksumSha256: digest,
        bytes,
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    expect(test.write).not.toHaveBeenCalled();
  });

  it('refuses a key no upload ticket was ever issued for', async () => {
    const test = harness({ asset: null });

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey,
        contentType: 'image/png',
        checksumSha256: digest,
        bytes,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    expect(test.write).not.toHaveBeenCalled();
  });

  it('refuses a content type the ticket did not declare', async () => {
    const test = harness();

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey,
        contentType: 'image/gif',
        checksumSha256: digest,
        bytes,
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(test.write).not.toHaveBeenCalled();
  });

  it('refuses a checksum that does not match the pending asset', async () => {
    const test = harness();

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey,
        contentType: 'image/png',
        checksumSha256: 'b'.repeat(64),
        bytes,
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(test.write).not.toHaveBeenCalled();
  });

  it('refuses more bytes than the ticket allowed for', async () => {
    const test = harness();

    await expect(
      test.service.acceptDirectUpload(ctx, {
        storageKey,
        contentType: 'image/png',
        checksumSha256: digest,
        bytes: new Uint8Array(bytes.byteLength + 1),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(test.write).not.toHaveBeenCalled();
  });
});

describe('readObjectForDownload', () => {
  it('returns the stored content type rather than sniffing the bytes', async () => {
    const test = harness();

    await expect(test.service.readObjectForDownload(ctx, { storageKey })).resolves.toEqual({
      bytes,
      contentType: 'image/png',
    });
  });

  it('treats an expired or deleted asset as gone', async () => {
    const test = harness({ asset: null });

    await expect(test.service.readObjectForDownload(ctx, { storageKey })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(test.read).not.toHaveBeenCalled();
  });
});
