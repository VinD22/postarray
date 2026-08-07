import { ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { ACTIVITY_NAMES } from './activities/types';
import { loadGateway, missingActivityNames } from './main';

describe('worker gateway bootstrap', () => {
  it('builds exactly one callable for every registered activity', async () => {
    const gateway = await loadGateway('built-in-prelaunch-gateway');

    expect(new Set(ACTIVITY_NAMES).size).toBe(ACTIVITY_NAMES.length);
    expect(missingActivityNames(gateway)).toEqual([]);
  });

  it('fails unavailable activities honestly without retrying', async () => {
    const gateway = await loadGateway('built-in-prelaunch-gateway');
    const publishTarget: unknown = Reflect.get(gateway, 'publishTarget');

    expect(publishTarget).toBeTypeOf('function');
    if (typeof publishTarget !== 'function') {
      return;
    }
    await expect(publishTarget({})).rejects.toMatchObject({
      code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
      retryable: false,
      messageKey: 'errors.capability_not_implemented',
    });
  });

  it('allows the runtime to replace only the data export activity', async () => {
    const buildDataExport = async () => ({
      state: 'ready' as const,
      byteSize: 42,
      checksumSha256: 'a'.repeat(64),
    });
    const gateway = await loadGateway('built-in-prelaunch-gateway', { buildDataExport });

    await expect(
      gateway.buildDataExport({
        ctx: {
          workspaceId: 'ws_1',
          correlationId: 'corr_1',
          actorId: 'worker',
          actorType: 'system',
          surface: 'automation_rule',
          approvalLevel: 'level_3_confirm',
          locale: 'en',
        },
        exportId: 'export_1',
        scope: 'workspace',
        format: 'json',
      }),
    ).resolves.toMatchObject({
      state: 'ready',
      byteSize: 42,
    });
    const publishTarget: unknown = Reflect.get(gateway, 'publishTarget');
    expect(publishTarget).toBeTypeOf('function');
    if (typeof publishTarget === 'function') {
      await expect(publishTarget({})).rejects.toMatchObject({
        code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
      });
    }
  });

  it('allows the runtime to replace the deletion activities as one gateway', async () => {
    const dataDeletion = {
      loadDeletionScope: async () => ({
        publishJobIds: [],
        connectionIds: [],
        receiptIds: [],
        objectPrefixes: [],
        ruleIds: [],
        feedIds: [],
      }),
      cancelScheduledJob: async () => undefined,
      revokeProviderConnection: async () => undefined,
      deleteStoredObjects: async () => ({ deletedCount: 0, nextCursor: null }),
      tombstoneAnalytics: async () => undefined,
      finalizeDeletion: async () => undefined,
    };
    const gateway = await loadGateway('built-in-prelaunch-gateway', { dataDeletion });

    await expect(
      gateway.loadDeletionScope({
        ctx: {
          workspaceId: 'ws_1',
          correlationId: 'corr_1',
          actorId: 'worker',
          actorType: 'system',
          surface: 'automation_rule',
          approvalLevel: 'level_3_confirm',
          locale: 'en',
        },
        requestId: 'deletion_1',
      }),
    ).resolves.toMatchObject({ objectPrefixes: [] });
    await expect(
      gateway.deleteStoredObjects({
        ctx: {
          workspaceId: 'ws_1',
          correlationId: 'corr_1',
          actorId: 'worker',
          actorType: 'system',
          surface: 'automation_rule',
          approvalLevel: 'level_3_confirm',
          locale: 'en',
        },
        requestId: 'deletion_1',
        prefix: 'ws_1/',
        cursor: null,
      }),
    ).resolves.toEqual({
      deletedCount: 0,
      nextCursor: null,
    });
    const publishTarget: unknown = Reflect.get(gateway, 'publishTarget');
    expect(publishTarget).toBeTypeOf('function');
    if (typeof publishTarget === 'function') {
      await expect(publishTarget({})).rejects.toMatchObject({
        code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
      });
    }
  });
});
