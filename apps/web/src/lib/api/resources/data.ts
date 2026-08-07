import type { DataExportView, DeletionRequestView } from '@relay/application';
import type { Paginated } from '@relay/contracts';

import { call } from '../call';
import { page } from '../fixtures';

export interface DataExportDownload {
  readonly downloadUrl: string;
  readonly expiresAt: string;
}

export const dataExportsApi = {
  list: (
    query: { readonly cursor?: string; readonly limit?: number } = {},
  ): Promise<Paginated<DataExportView>> => call('/data/exports', { query }, () => page([])),

  request: (
    input: { readonly scope?: 'workspace'; readonly format?: 'json' },
    idempotencyKey: string,
  ): Promise<DataExportView> =>
    call('/data/exports', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'export_demo_new',
      workspaceId: 'ws_demo',
      scope: 'workspace' as const,
      format: 'json' as const,
      state: 'requested' as const,
      preparedAt: null,
      expiresAt: null,
      byteSize: null,
      checksumSha256: null,
      downloadUrl: null,
      createdAt: new Date().toISOString(),
    })),

  get: (exportId: string): Promise<DataExportView> =>
    call(`/data/exports/${exportId}`, {}, () => ({
      id: exportId,
      workspaceId: 'ws_demo',
      scope: 'workspace' as const,
      format: 'json' as const,
      state: 'requested' as const,
      preparedAt: null,
      expiresAt: null,
      byteSize: null,
      checksumSha256: null,
      downloadUrl: null,
      createdAt: new Date().toISOString(),
    })),

  download: (exportId: string): Promise<DataExportDownload> =>
    call(`/data/exports/${exportId}/download`, {}, () => ({
      downloadUrl: '',
      expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
    })),
};

export const dataDeletionApi = {
  current: (): Promise<DeletionRequestView | null> =>
    call('/data/deletion-requests', {}, () => null),

  request: (
    input: {
      readonly scope?: 'workspace';
      readonly confirmation: string;
      readonly reason?: string;
    },
    idempotencyKey: string,
  ): Promise<DeletionRequestView> =>
    call('/data/deletion-requests', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'deletion_demo_new',
      workspaceId: 'ws_demo',
      scope: 'workspace' as const,
      state: 'scheduled' as const,
      executeAfter: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
      verifiedAt: null,
      executedAt: null,
      canceledAt: null,
      createdAt: new Date().toISOString(),
    })),

  get: (requestId: string): Promise<DeletionRequestView> =>
    call(`/data/deletion-requests/${requestId}`, {}, () => ({
      id: requestId,
      workspaceId: 'ws_demo',
      scope: 'workspace' as const,
      state: 'scheduled' as const,
      executeAfter: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
      verifiedAt: null,
      executedAt: null,
      canceledAt: null,
      createdAt: new Date().toISOString(),
    })),

  cancel: (requestId: string, idempotencyKey: string): Promise<DeletionRequestView> =>
    call(
      `/data/deletion-requests/${requestId}/cancel`,
      { method: 'POST', body: {}, idempotencyKey },
      () => ({
        id: requestId,
        workspaceId: 'ws_demo',
        scope: 'workspace' as const,
        state: 'canceled' as const,
        executeAfter: new Date().toISOString(),
        verifiedAt: null,
        executedAt: null,
        canceledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }),
    ),
};
