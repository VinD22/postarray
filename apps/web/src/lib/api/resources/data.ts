import type { DataExportView } from '@relay/application';
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
