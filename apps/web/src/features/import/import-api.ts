import type {
  BulkImportOptions,
  BulkImportReport,
  BulkImportRowState,
  BulkImportRowView,
  Paginated,
} from '@relay/contracts';

import { call } from '@/lib/api/call';

/**
 * Bulk import over HTTP.
 *
 * Applying and scheduling are two calls because they are two routes: a token
 * that may only write drafts cannot reach the scheduling behaviour by setting a
 * field, and neither can this client by accident.
 */

function unavailable(): never {
  throw new Error('Importing is unavailable in demo mode.');
}

export const importApi = {
  upload: (
    input: {
      projectId: string;
      filename: string;
      content: string;
      options?: Partial<BulkImportOptions>;
    },
    idempotencyKey: string,
  ): Promise<BulkImportReport> =>
    call('/imports', { method: 'POST', body: input, idempotencyKey }, unavailable),

  get: (importJobId: string): Promise<BulkImportReport> =>
    call(`/imports/${importJobId}`, { method: 'GET' }, unavailable),

  listRows: (
    importJobId: string,
    query: { state?: BulkImportRowState; limit?: number } = {},
  ): Promise<Paginated<BulkImportRowView>> =>
    call(
      `/imports/${importJobId}/rows`,
      {
        method: 'GET',
        query: {
          ...(query.state === undefined ? {} : { state: query.state }),
          limit: String(query.limit ?? 100),
        },
      },
      unavailable,
    ),

  /** Creates drafts. Schedules nothing. */
  applyAsDrafts: (importJobId: string, idempotencyKey: string): Promise<BulkImportReport> =>
    call(`/imports/${importJobId}/apply`, { method: 'POST', body: {}, idempotencyKey }, unavailable),

  /** The deliberate second choice. */
  applyAsScheduled: (importJobId: string, idempotencyKey: string): Promise<BulkImportReport> =>
    call(
      `/imports/${importJobId}/schedule`,
      { method: 'POST', body: {}, idempotencyKey },
      unavailable,
    ),
};
