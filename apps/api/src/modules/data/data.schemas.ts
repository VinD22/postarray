import {
  dataExportFormatSchema,
  dataExportScopeSchema,
  dataExportViewSchema,
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
