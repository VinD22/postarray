import {
  ID_PREFIXES,
  bulkImportJobSchema,
  bulkImportOptionsSchema,
  bulkImportReportSchema,
  bulkImportRowSchema,
  bulkImportRowStateSchema,
  idSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { brandIdSchema } from '../../common/schemas';

/**
 * Bulk import payloads.
 *
 * The manifest arrives as text, not as a multipart file part and not as a URL
 * the server would go and fetch. A CSV is text, and accepting it as text keeps
 * the request body something the edge can validate before anything reads it.
 *
 * There is no `mode` on the upload body. Choosing what applying does is a
 * separate request to a separate route, which is what makes "drafts by default"
 * a property of the API rather than a habit of the client.
 */

export const importJobIdSchema = idSchema(ID_PREFIXES.bulkImportJob);

export const MAX_MANIFEST_CHARACTERS = 5 * 1024 * 1024;

export const uploadImportSchema = z
  .object({
    projectId: brandIdSchema,
    filename: z.string().min(1).max(255),
    /** The CSV text. XLSX is out of scope and is not accepted here. */
    content: z.string().min(1).max(MAX_MANIFEST_CHARACTERS),
    options: bulkImportOptionsSchema.partial().optional(),
  })
  .strict();

export const listImportsQuerySchema = cursorQueryWith({ projectId: brandIdSchema.optional() });

export const listImportRowsQuerySchema = cursorQueryWith({
  state: bulkImportRowStateSchema.optional(),
});

/** Applying takes no body. The route decides the mode; the caller cannot. */
export const applyImportSchema = z.object({}).strict();

export { bulkImportJobSchema, bulkImportReportSchema, bulkImportRowSchema };

export type UploadImportInput = z.infer<typeof uploadImportSchema>;
export type ListImportsQuery = z.infer<typeof listImportsQuerySchema>;
export type ListImportRowsQuery = z.infer<typeof listImportRowsQuerySchema>;
