import { z } from 'zod';

import { providerIdSchema } from './enums';
import { ID_PREFIXES, idSchema } from './ids';
import {
  checksumSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
  localDateTimeSchema,
  webUrlSchema,
} from './primitives';

/**
 * Bulk import of a CSV manifest.
 *
 * Three properties are worth stating before any schema, because every shape in
 * this file exists to hold one of them true.
 *
 *   1. Upload and apply are separate steps. An upload parses, validates and
 *      reports. It creates no draft and schedules nothing. Applying is a second,
 *      explicit human decision, and its default outcome is drafts.
 *   2. A row is its own unit of work. `externalRowKey` is chosen by the person
 *      who wrote the file, is unique inside one job, and is the idempotency
 *      boundary that makes re-applying a job safe. One bad row is one bad row.
 *   3. An error is an ICU key plus values, never a sentence and never a
 *      provider payload. A failed row can be shown in any locale and downloaded
 *      as a CSV without leaking anything the person is not entitled to see.
 *
 * CSV only. XLSX is out of scope: a spreadsheet binary needs a parser we would
 * have to trust with untrusted input, and every tool that writes one can also
 * write a CSV.
 */

/** Bumped whenever the manifest grammar changes, and recorded on every job. */
export const CSV_MANIFEST_PARSER_VERSION = '2026-08-10.1';

export const BULK_IMPORT_STATES = [
  'uploaded',
  'validating',
  'validated',
  'applying',
  'applied',
  'failed',
] as const;
export const bulkImportStateSchema = z.enum(BULK_IMPORT_STATES);
export type BulkImportState = z.infer<typeof bulkImportStateSchema>;

/**
 * `skipped` is not a failure. It is the answer a row gives when a previous
 * apply already created its draft, which is what re-applying a job looks like.
 */
export const BULK_IMPORT_ROW_STATES = [
  'pending',
  'valid',
  'invalid',
  'applied',
  'skipped',
  'failed',
] as const;
export const bulkImportRowStateSchema = z.enum(BULK_IMPORT_ROW_STATES);
export type BulkImportRowState = z.infer<typeof bulkImportRowStateSchema>;

/**
 * What applying a job does. `drafts` is the default everywhere: in the schema,
 * in the API, and in the wizard. `scheduled` is a deliberate second choice a
 * person makes on a screen that says what it will do, and it still schedules
 * rather than publishes.
 */
export const BULK_IMPORT_APPLY_MODES = ['drafts', 'scheduled'] as const;
export const bulkImportApplyModeSchema = z.enum(BULK_IMPORT_APPLY_MODES);
export type BulkImportApplyMode = z.infer<typeof bulkImportApplyModeSchema>;

/** Columns every manifest must carry. Order in the file does not matter. */
export const BULK_IMPORT_REQUIRED_COLUMNS = [
  'external_row_id',
  'project',
  'targets',
  'caption',
  'scheduled_local_time',
  'time_zone',
  'media',
] as const;

/**
 * Columns a manifest may carry. `caption_<provider>` and `title_<provider>` are
 * recognised for any known provider id, which is why they are not listed here.
 */
export const BULK_IMPORT_OPTIONAL_COLUMNS = [
  'title',
  'destination',
  'privacy',
  'first_comment',
  'approval_policy',
] as const;

export type BulkImportRequiredColumn = (typeof BULK_IMPORT_REQUIRED_COLUMNS)[number];

/** True for `caption_instagram`, `title_youtube` and friends. */
export function parsePerPlatformColumn(
  header: string,
): { readonly field: 'body' | 'title'; readonly provider: string } | null {
  const match = /^(caption|title)_([a-z0-9_]+)$/u.exec(header);
  if (match === null) {
    return null;
  }
  const [, field, provider] = match;
  if (field === undefined || provider === undefined) {
    return null;
  }
  const known = providerIdSchema.safeParse(provider);
  if (!known.success) {
    return null;
  }
  return { field: field === 'caption' ? 'body' : 'title', provider: known.data };
}

/**
 * One sanitized problem with one cell or one row.
 *
 * `key` is an ICU message key that exists in the catalog. `values` carries only
 * data the person already supplied or a bounded value we chose, never a
 * provider response, never a stack, never an internal identifier.
 */
export const bulkImportIssueSchema = z
  .object({
    key: z.string().min(1).max(120),
    column: z.string().min(1).max(80).nullable(),
    values: z.record(z.string(), z.union([z.string().max(200), z.number(), z.boolean()])),
  })
  .strict();
export type BulkImportIssue = z.infer<typeof bulkImportIssueSchema>;

/** A per-platform override, expressed the way the composer expresses one. */
export const bulkImportVariantOverrideSchema = z
  .object({
    provider: providerIdSchema,
    body: z.string().max(20_000).nullable(),
    title: z.string().max(300).nullable(),
  })
  .strict();
export type BulkImportVariantOverride = z.infer<typeof bulkImportVariantOverrideSchema>;

/**
 * How a cell names a piece of media.
 *
 * `id` and `checksum` resolve against media the workspace already owns. `url`
 * is handed to the existing server-side import, which is SSRF guarded. A
 * filesystem path is not a thing this product accepts from a manifest.
 */
export const bulkImportMediaRefSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('id'), value: idSchema(ID_PREFIXES.media) }).strict(),
  z.object({ kind: z.literal('checksum'), value: checksumSchema }).strict(),
  z.object({ kind: z.literal('url'), value: webUrlSchema }).strict(),
]);
export type BulkImportMediaRef = z.infer<typeof bulkImportMediaRefSchema>;

/** Which accounts a row posts to: a saved set, or explicit connections. */
export const bulkImportTargetsSchema = z
  .object({
    setId: idSchema(ID_PREFIXES.set).nullable(),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(50),
  })
  .strict();
export type BulkImportTargets = z.infer<typeof bulkImportTargetsSchema>;

/**
 * The composer-shaped payload one manifest row normalizes to.
 *
 * The local time and the zone are both kept, next to the instant they resolve
 * to. Storing only the instant would lose what the person wrote; storing only
 * the local time would be a naive timestamp, which this product does not have.
 */
export const bulkImportRowPayloadSchema = z
  .object({
    projectRef: z.string().min(1).max(200),
    targets: bulkImportTargetsSchema,
    body: z.string().min(1).max(20_000),
    title: z.string().max(300).nullable(),
    variants: z.array(bulkImportVariantOverrideSchema).max(20),
    scheduledLocalTime: localDateTimeSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    scheduledInstant: isoInstantSchema,
    media: z.array(bulkImportMediaRefSchema).max(20),
    destination: z.string().max(200).nullable(),
    privacyValue: z.string().max(80).nullable(),
    firstComment: z.string().max(5_000).nullable(),
    approvalPolicy: z.string().max(40).nullable(),
  })
  .strict();
export type BulkImportRowPayload = z.infer<typeof bulkImportRowPayloadSchema>;

/** What a dry run concluded about one row. */
export const bulkImportValidationSchema = z
  .object({
    status: z.enum(['valid', 'invalid']),
    checkedAt: isoInstantSchema,
    parserVersion: z.string().min(1).max(40),
  })
  .strict();
export type BulkImportValidation = z.infer<typeof bulkImportValidationSchema>;

export const bulkImportRowSchema = z
  .object({
    id: idSchema(ID_PREFIXES.bulkImportRow),
    importJobId: idSchema(ID_PREFIXES.bulkImportJob),
    externalRowKey: z.string().min(1).max(200),
    lineNumber: z.number().int().positive(),
    state: bulkImportRowStateSchema,
    payload: bulkImportRowPayloadSchema.nullable(),
    validation: bulkImportValidationSchema.nullable(),
    issues: z.array(bulkImportIssueSchema).max(50),
    contentItemId: idSchema(ID_PREFIXES.contentItem).nullable(),
    publishJobId: idSchema(ID_PREFIXES.publishJob).nullable(),
    appliedAt: isoInstantSchema.nullable(),
  })
  .strict();
export type BulkImportRowView = z.infer<typeof bulkImportRowSchema>;

/**
 * Counts are never guessed. A count we have not computed is null, which the UI
 * renders as unavailable, because a zero here would read as "nothing failed".
 */
export const bulkImportCountsSchema = z
  .object({
    total: z.number().int().nonnegative().nullable(),
    valid: z.number().int().nonnegative().nullable(),
    invalid: z.number().int().nonnegative().nullable(),
    applied: z.number().int().nonnegative().nullable(),
    failed: z.number().int().nonnegative().nullable(),
    skipped: z.number().int().nonnegative().nullable(),
  })
  .strict();
export type BulkImportCounts = z.infer<typeof bulkImportCountsSchema>;

export const bulkImportOptionsSchema = z
  .object({
    /** Rows whose scheduled instant is already past are reported, not silently moved. */
    allowPastSchedules: z.boolean().default(false),
    /** The zone used only when a row leaves `time_zone` empty. */
    defaultTimeZone: ianaTimeZoneSchema.optional(),
  })
  .strict();
export type BulkImportOptions = z.infer<typeof bulkImportOptionsSchema>;

export const bulkImportJobSchema = z
  .object({
    id: idSchema(ID_PREFIXES.bulkImportJob),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    projectId: idSchema(ID_PREFIXES.brand),
    state: bulkImportStateSchema,
    filename: z.string().min(1).max(255),
    manifestChecksum: checksumSchema,
    byteSize: z.number().int().nonnegative(),
    parserVersion: z.string().min(1).max(40),
    options: bulkImportOptionsSchema,
    counts: bulkImportCountsSchema,
    /** Null until a person applies. Never defaulted to a scheduling mode. */
    appliedMode: bulkImportApplyModeSchema.nullable(),
    appliedAt: isoInstantSchema.nullable(),
    /** True when a downloadable CSV of the failed rows exists. */
    errorReportAvailable: z.boolean(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type BulkImportJobView = z.infer<typeof bulkImportJobSchema>;

/** The header check the wizard shows before anyone looks at a single row. */
export const bulkImportColumnReportSchema = z
  .object({
    present: z.array(z.string().max(80)).max(200),
    missingRequired: z.array(z.string().max(80)).max(50),
    unrecognized: z.array(z.string().max(80)).max(200),
  })
  .strict();
export type BulkImportColumnReport = z.infer<typeof bulkImportColumnReportSchema>;

/** Everything the dry-run screen renders, in one response. */
export const bulkImportReportSchema = z
  .object({
    job: bulkImportJobSchema,
    columns: bulkImportColumnReportSchema,
    manifestIssues: z.array(bulkImportIssueSchema).max(50),
  })
  .strict();
export type BulkImportReport = z.infer<typeof bulkImportReportSchema>;

/** The header row of the downloadable error CSV. */
export const BULK_IMPORT_ERROR_REPORT_COLUMNS = [
  'external_row_id',
  'line',
  'column',
  'error_key',
  'error_values',
] as const;
