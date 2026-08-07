import { z } from 'zod';

import { ID_PREFIXES, idSchema } from './ids';
import { isoInstantSchema } from './primitives';

/**
 * Data rights are deliberately narrow in V1. The export is a portable JSON
 * archive of the workspace records we own. Media bytes are referenced by
 * checksum and retention metadata; provider credentials and raw payloads never
 * enter an export.
 */
export const DATA_EXPORT_FORMATS = ['json'] as const;
export const dataExportFormatSchema = z.enum(DATA_EXPORT_FORMATS);
export type DataExportFormat = z.infer<typeof dataExportFormatSchema>;

export const DATA_EXPORT_SCOPES = ['workspace'] as const;
export const dataExportScopeSchema = z.enum(DATA_EXPORT_SCOPES);
export type DataExportScope = z.infer<typeof dataExportScopeSchema>;

export const DATA_EXPORT_STATES = [
  'requested',
  'building',
  'ready',
  'delivered',
  'expired',
  'failed',
] as const;
export const dataExportStateSchema = z.enum(DATA_EXPORT_STATES);
export type DataExportState = z.infer<typeof dataExportStateSchema>;

export const dataExportViewSchema = z
  .object({
    id: idSchema(ID_PREFIXES.dataExport),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    scope: dataExportScopeSchema,
    format: dataExportFormatSchema,
    state: dataExportStateSchema,
    preparedAt: isoInstantSchema.nullable(),
    expiresAt: isoInstantSchema.nullable(),
    byteSize: z.number().int().nonnegative().nullable(),
    checksumSha256: z
      .string()
      .regex(/^[0-9a-f]{64}$/)
      .nullable(),
    downloadUrl: z.string().url().nullable(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type DataExportView = z.infer<typeof dataExportViewSchema>;

export const dataExportDownloadSchema = z
  .object({
    downloadUrl: z.string().url(),
    expiresAt: isoInstantSchema,
  })
  .strict();
export type DataExportDownload = z.infer<typeof dataExportDownloadSchema>;
