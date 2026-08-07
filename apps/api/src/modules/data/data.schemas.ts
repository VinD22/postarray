import {
  dataExportFormatSchema,
  dataExportScopeSchema,
  dataExportViewSchema,
  deletionRequestViewSchema,
  paginatedSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';

export const requestDataExportSchema = z
  .object({
    scope: dataExportScopeSchema.default('workspace'),
    format: dataExportFormatSchema.default('json'),
  })
  .strict();

export const listDataExportsQuerySchema = cursorQuerySchema;
export const dataExportViewSchemaForApi = dataExportViewSchema;
export const dataExportDownloadSchema = z
  .object({ downloadUrl: z.string().url(), expiresAt: z.string().datetime() })
  .strict();

export const dataExportPageSchema = paginatedSchema(dataExportViewSchema);

export type RequestDataExportInput = z.infer<typeof requestDataExportSchema>;

export const requestDeletionSchema = z
  .object({
    scope: z.literal('workspace').default('workspace'),
    confirmation: z.string().trim().min(1).max(200),
    reason: z.string().trim().max(2000).optional(),
  })
  .strict();

export const deletionRequestViewSchemaForApi = deletionRequestViewSchema;
export type RequestDeletionInput = z.infer<typeof requestDeletionSchema>;
