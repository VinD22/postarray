import { ERROR_CODES } from '@relay/contracts';
import { describe, expect, it, vi } from 'vitest';

import type { WorkerActivities } from './activities/types';
import type { ProviderActivities } from './connector-execution-activities';
import { createWorkerGateway } from './prelaunch-gateway';

describe('createWorkerGateway connector execution', () => {
  it('keeps provider activities fail closed without a connector bridge', async () => {
    const gateway = createWorkerGateway({ connectorBridge: null });
    await expect(
      gateway.publishTarget({
        ctx: {
          workspaceId: 'ws_1',
          correlationId: 'corr_1',
          actorId: 'user_1',
          actorType: 'user',
          surface: 'web',
          approvalLevel: 'level_3_confirm',
          locale: 'en',
        },
        publishJobId: 'job_1',
        targetId: 'pv_1',
        connectionId: 'conn_1',
        contentVersionId: 'cver_1',
        attemptId: 'att_1',
        providerIdempotencyToken: 'token_1',
        preparedMediaIds: [],
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED });
  });

  it('merges the connector provider activity surface', async () => {
    const publishTarget = vi.fn<WorkerActivities['publishTarget']>().mockResolvedValue({
      outcome: 'published',
      publication: {
        externalPostId: 'post_1',
        permalink: null,
        publishedAt: '2026-01-01T00:00:00.000Z',
        externalAccountId: 'did:plc:example',
      },
      providerOperationId: null,
      errorClass: null,
      errorCode: null,
      messageKey: null,
      retryAfterMs: null,
    });
    const connectorBridge: ProviderActivities = {
      publishTarget,
      pollPublishStatus: vi.fn(),
      publishSequenceItem: vi.fn(),
      revalidateTarget: vi.fn(),
      refreshCredential: vi.fn(),
      revokeProviderConnection: vi.fn(),
      fetchPostMetrics: vi.fn(),
      fetchAccountMetrics: vi.fn(),
    };
    const gateway = createWorkerGateway({ connectorBridge });
    const input: Parameters<WorkerActivities['publishTarget']>[0] = {
      ctx: {
        workspaceId: 'ws_1',
        correlationId: 'corr_1',
        actorId: 'user_1',
        actorType: 'user',
        surface: 'web',
        approvalLevel: 'level_3_confirm',
        locale: 'en',
      },
      publishJobId: 'job_1',
      targetId: 'pv_1',
      connectionId: 'conn_1',
      contentVersionId: 'cver_1',
      attemptId: 'att_1',
      providerIdempotencyToken: 'token_1',
      preparedMediaIds: [],
    };

    await expect(gateway.publishTarget(input)).resolves.toMatchObject({ outcome: 'published' });
    expect(publishTarget).toHaveBeenCalledWith(input);
  });
});
