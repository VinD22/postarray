'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  BulkImportOptions,
  BulkImportReport,
  BulkImportRowState,
  BulkImportRowView,
} from '@relay/contracts';

import { newIdempotencyKey } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';

import { importApi } from './import-api';

/**
 * Reads and writes for bulk import.
 *
 * No mutation here is optimistic. An apply creates real drafts in a workspace
 * other people can see, and a wizard that looked applied in the browser but was
 * not would send someone looking for posts that do not exist.
 */

const THIRTY_SECONDS = 30 * 1000;

export const importKeys = {
  all: ['imports'] as const,
  job: (importJobId: string) => ['imports', 'job', importJobId] as const,
  rows: (importJobId: string, state: BulkImportRowState | 'all') =>
    ['imports', 'rows', importJobId, state] as const,
};

export function useImportJob(importJobId: string | null) {
  return useQuery({
    queryKey: importKeys.job(importJobId ?? 'none'),
    enabled: importJobId !== null,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<BulkImportReport> => {
      if (importJobId === null) throw new Error('IMPORT_JOB_REQUIRED');
      return importApi.get(importJobId);
    },
  });
}

export function useImportRows(importJobId: string | null, state: BulkImportRowState | 'all') {
  return useQuery({
    queryKey: importKeys.rows(importJobId ?? 'none', state),
    enabled: importJobId !== null,
    staleTime: THIRTY_SECONDS,
    queryFn: async (): Promise<readonly BulkImportRowView[]> => {
      if (importJobId === null) return [];
      const page = await importApi.listRows(
        importJobId,
        state === 'all' ? {} : { state },
      );
      return page.data;
    },
  });
}

export function useUploadManifest() {
  const client = useQueryClient();
  const { project } = useSession();
  return useMutation({
    mutationFn: async (input: {
      filename: string;
      content: string;
      options?: Partial<BulkImportOptions>;
    }): Promise<BulkImportReport> => {
      const projectId = project?.id ?? null;
      if (projectId === null) throw new Error('PROJECT_REQUIRED');
      return importApi.upload(
        {
          projectId,
          filename: input.filename,
          content: input.content,
          ...(input.options === undefined ? {} : { options: input.options }),
        },
        newIdempotencyKey('import'),
      );
    },
    onSuccess: (report) => {
      client.setQueryData(importKeys.job(report.job.id), report);
    },
  });
}

/**
 * Applying. The mode is chosen by which function the screen calls, so a stray
 * default cannot turn a request for drafts into a request to schedule.
 */
export function useApplyImport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      importJobId: string;
      mode: 'drafts' | 'scheduled';
    }): Promise<BulkImportReport> =>
      input.mode === 'scheduled'
        ? importApi.applyAsScheduled(input.importJobId, newIdempotencyKey('import'))
        : importApi.applyAsDrafts(input.importJobId, newIdempotencyKey('import')),
    onSuccess: async (report) => {
      client.setQueryData(importKeys.job(report.job.id), report);
      await client.invalidateQueries({ queryKey: ['imports', 'rows', report.job.id] });
    },
  });
}
