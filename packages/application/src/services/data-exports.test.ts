import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, DataExportEncryptionPort, ServiceDeps, StoragePort } from '../types';

type FakeDb = {
  readonly dataExport: {
    readonly findFirst: ReturnType<typeof vi.fn>;
    readonly update: ReturnType<typeof vi.fn>;
  };
  readonly auditEvent: {
    readonly create: ReturnType<typeof vi.fn>;
  };
};

let activeDb: FakeDb;
let activeActor: unknown;
const authorizationPermissions: unknown[] = [];

/**
 * The content tests focus on the export service's storage and crypto boundary.
 * Policy itself has dedicated tests in authz and application runtime. Keeping
 * this seam fake also means a failing object-integrity check cannot be hidden
 * by a large Prisma fixture.
 */
vi.mock('../internal/runtime', () => ({
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    permission: unknown,
    _resource: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => {
    authorizationPermissions.push(permission);
    return handler(activeDb, activeActor);
  },
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => handler(activeDb, activeActor),
}));

import { createDataExportService } from './data-exports';

const now = new Date('2026-08-07T00:00:00.000Z');
const context: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_export_content',
  approvalLevel: 'level_0_read',
  locale: 'en',
};

const actor = {
  ctx: context,
  userId: 'user_1',
};

function checksum(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function rowFor(
  encrypted: Uint8Array,
  overrides: Partial<{
    state: string;
    byteSize: bigint | null;
    checksumSha256: string | null;
    expiresAt: Date | null;
  }> = {},
) {
  return {
    id: 'export_1',
    workspaceId: 'ws_1',
    scope: 'workspace',
    format: 'json',
    state: 'ready',
    storageKey: 'ws_1/exports/export_1.relay.json.enc',
    byteSize: BigInt(encrypted.byteLength),
    checksumSha256: checksum(encrypted),
    downloadedAt: null,
    expiresAt: new Date('2026-08-14T00:00:00.000Z'),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function database(row: ReturnType<typeof rowFor>): FakeDb {
  const dataExport = {
    findFirst: vi.fn().mockResolvedValue(row),
    update: vi.fn().mockResolvedValue(row),
  };
  const auditEvent = {
    create: vi.fn().mockResolvedValue({ id: 'audit_1', createdAt: now }),
  };
  return { dataExport, auditEvent };
}

function storageFor(
  encrypted: Uint8Array,
  headPatch: Partial<{
    byteSize: number;
    checksumSha256: string;
  }> = {},
  readBytes: Uint8Array = encrypted,
): StoragePort {
  return {
    head: vi.fn().mockResolvedValue({
      key: 'ws_1/exports/export_1.relay.json.enc',
      byteSize: encrypted.byteLength,
      contentType: 'application/octet-stream',
      checksumSha256: checksum(encrypted),
      ...headPatch,
    }),
    read: vi.fn().mockResolvedValue(readBytes),
  } as unknown as StoragePort;
}

function encryptionFor(plaintext: Uint8Array): DataExportEncryptionPort & {
  readonly decrypt: ReturnType<typeof vi.fn>;
} {
  return {
    encrypt: vi.fn(),
    decrypt: vi.fn().mockResolvedValue(plaintext),
  };
}

function depsFor(storage: StoragePort, exportEncryption?: DataExportEncryptionPort): ServiceDeps {
  return {
    storage,
    ...(exportEncryption === undefined ? {} : { exportEncryption }),
    clock: { now: () => now },
    config: { core: { apiUrl: 'https://api.example.test' } },
  } as unknown as ServiceDeps;
}

describe('data export content', () => {
  beforeEach(() => {
    authorizationPermissions.length = 0;
    activeActor = actor;
  });

  it('authorizes the workspace export and returns decrypted JSON content', async () => {
    const encrypted = new Uint8Array(Buffer.from('ciphertext'));
    const plaintext = new Uint8Array(Buffer.from('{"posts":[]}'));
    const row = rowFor(encrypted);
    activeDb = database(row);
    const storage = storageFor(encrypted);
    const encryption = encryptionFor(plaintext);
    const service = createDataExportService(depsFor(storage, encryption));

    const content = await service.content(context, row.id);

    expect(authorizationPermissions).toEqual(['analytics.export']);
    expect(encryption.decrypt).toHaveBeenCalledWith({
      workspaceId: context.workspaceId,
      exportId: row.id,
      bytes: encrypted,
    });
    expect(content).toEqual({
      bytes: plaintext,
      contentType: 'application/json',
      filename: 'relay-workspace-export-export_1.json',
      expiresAt: row.expiresAt?.toISOString(),
    });
    expect(activeDb.dataExport.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { state: 'delivered', downloadedAt: now },
    });
    expect(activeDb.auditEvent.create).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      name: 'storage metadata size differs',
      headPatch: { byteSize: 999 },
      readBytes: undefined,
    },
    {
      name: 'read bytes checksum differs',
      headPatch: {},
      readBytes: new Uint8Array(Buffer.from('different ciphertext')),
    },
  ])('rejects when $name', async ({ headPatch, readBytes }) => {
    const encrypted = new Uint8Array(Buffer.from('ciphertext'));
    const row = rowFor(encrypted);
    activeDb = database(row);
    const storage = storageFor(encrypted, headPatch, readBytes ?? encrypted);
    const encryption = encryptionFor(new Uint8Array(Buffer.from('{"posts":[]}')));
    const service = createDataExportService(depsFor(storage, encryption));

    await expect(service.content(context, row.id)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      messageKey: 'errors.export_unavailable',
    });

    expect(encryption.decrypt).not.toHaveBeenCalled();
    expect(activeDb.dataExport.update).not.toHaveBeenCalled();
    expect(activeDb.auditEvent.create).not.toHaveBeenCalled();
  });

  it('transitions an expired export and records the expiry audit event', async () => {
    const encrypted = new Uint8Array(Buffer.from('ciphertext'));
    const row = rowFor(encrypted, { expiresAt: new Date('2026-08-06T23:59:59.000Z') });
    activeDb = database(row);
    const service = createDataExportService(
      depsFor(storageFor(encrypted), encryptionFor(new Uint8Array(Buffer.from('{"posts":[]}')))),
    );

    await expect(service.content(context, row.id)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      messageKey: 'errors.export_expired',
    });

    expect(activeDb.dataExport.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { state: 'expired' },
    });
    expect(activeDb.auditEvent.create).toHaveBeenCalledTimes(1);
  });

  it('reports a clear unavailable error when no encryption adapter is configured', async () => {
    const encrypted = new Uint8Array(Buffer.from('ciphertext'));
    const row = rowFor(encrypted);
    activeDb = database(row);
    const service = createDataExportService(depsFor(storageFor(encrypted)));

    await expect(service.content(context, row.id)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      messageKey: 'errors.export_unavailable',
      details: { reason: 'export_encryption_unavailable' },
    });
    expect(activeDb.dataExport.update).not.toHaveBeenCalled();
  });
});
