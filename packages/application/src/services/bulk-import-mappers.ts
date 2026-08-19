import {
  BULK_IMPORT_ERROR_REPORT_COLUMNS,
  bulkImportApplyModeSchema,
  bulkImportColumnReportSchema,
  bulkImportIssueSchema,
  bulkImportOptionsSchema,
  bulkImportRowPayloadSchema,
  bulkImportRowStateSchema,
  bulkImportStateSchema,
  bulkImportValidationSchema,
  type BulkImportCounts,
  type BulkImportIssue,
  type BulkImportJobView,
  type BulkImportRowView,
} from '@relay/contracts';

/**
 * Row and job shapes on their way out of the database.
 *
 * Two rules run through everything here. A count we have not computed is
 * `null`, never `0`, because zero failures and an unknown number of failures
 * are different sentences. And an issue is parsed on the way out, not cast:
 * these columns are JSON, a JSON column is an external boundary, and a row
 * written by an older parser must not be able to hand the UI a shape it never
 * agreed to render.
 */

export interface BulkImportJobRow {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly state: string;
  readonly filename: string;
  readonly manifestChecksum: string;
  readonly byteSize: bigint;
  readonly parserVersion: string;
  readonly options: unknown;
  readonly manifestIssues: unknown;
  readonly columnsReport: unknown;
  readonly rowCount: number | null;
  readonly validRowCount: number | null;
  readonly invalidRowCount: number | null;
  readonly appliedRowCount: number | null;
  readonly failedRowCount: number | null;
  readonly skippedRowCount: number | null;
  readonly applyMode: string | null;
  readonly appliedAt: Date | null;
  readonly errorReportStorageKey: string | null;
  readonly createdAt: Date;
}

export interface BulkImportRowRow {
  readonly id: string;
  readonly bulkImportJobId: string;
  readonly externalRowKey: string;
  readonly lineNumber: number;
  readonly state: string;
  readonly payload: unknown;
  readonly validation: unknown;
  readonly issues: unknown;
  readonly contentItemId: string | null;
  readonly publishJobId: string | null;
  readonly appliedAt: Date | null;
}

export const BULK_IMPORT_JOB_SELECT = {
  id: true,
  workspaceId: true,
  projectId: true,
  state: true,
  filename: true,
  manifestChecksum: true,
  byteSize: true,
  parserVersion: true,
  options: true,
  manifestIssues: true,
  columnsReport: true,
  rowCount: true,
  validRowCount: true,
  invalidRowCount: true,
  appliedRowCount: true,
  failedRowCount: true,
  skippedRowCount: true,
  applyMode: true,
  appliedAt: true,
  errorReportStorageKey: true,
  createdAt: true,
} as const;

export const BULK_IMPORT_ROW_SELECT = {
  id: true,
  bulkImportJobId: true,
  externalRowKey: true,
  lineNumber: true,
  state: true,
  payload: true,
  validation: true,
  issues: true,
  contentItemId: true,
  publishJobId: true,
  appliedAt: true,
} as const;

/** Drop anything that is not a well formed issue rather than rendering it. */
export function toIssues(value: unknown): BulkImportIssue[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const issues: BulkImportIssue[] = [];
  for (const entry of value) {
    const parsed = bulkImportIssueSchema.safeParse(entry);
    if (parsed.success) {
      issues.push(parsed.data);
    }
  }
  return issues.slice(0, 50);
}

export function toCounts(row: BulkImportJobRow): BulkImportCounts {
  return {
    total: row.rowCount,
    valid: row.validRowCount,
    invalid: row.invalidRowCount,
    applied: row.appliedRowCount,
    failed: row.failedRowCount,
    skipped: row.skippedRowCount,
  };
}

export function toJobView(row: BulkImportJobRow): BulkImportJobView {
  const options = bulkImportOptionsSchema.safeParse(row.options);
  const mode = row.applyMode === null ? null : bulkImportApplyModeSchema.safeParse(row.applyMode);
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    state: bulkImportStateSchema.parse(row.state),
    filename: row.filename,
    manifestChecksum: row.manifestChecksum,
    byteSize: Number(row.byteSize),
    parserVersion: row.parserVersion,
    options: options.success ? options.data : { allowPastSchedules: false },
    counts: toCounts(row),
    appliedMode: mode !== null && mode.success ? mode.data : null,
    appliedAt: row.appliedAt?.toISOString() ?? null,
    errorReportAvailable: row.errorReportStorageKey !== null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toRowView(row: BulkImportRowRow): BulkImportRowView {
  const payload = bulkImportRowPayloadSchema.safeParse(row.payload);
  const validation = bulkImportValidationSchema.safeParse(row.validation);
  return {
    id: row.id,
    importJobId: row.bulkImportJobId,
    externalRowKey: row.externalRowKey,
    lineNumber: row.lineNumber,
    state: bulkImportRowStateSchema.parse(row.state),
    payload: payload.success ? payload.data : null,
    validation: validation.success ? validation.data : null,
    issues: toIssues(row.issues),
    contentItemId: row.contentItemId,
    publishJobId: row.publishJobId,
    appliedAt: row.appliedAt?.toISOString() ?? null,
  };
}

export function toColumnReport(value: unknown) {
  const parsed = bulkImportColumnReportSchema.safeParse(value);
  return parsed.success ? parsed.data : { present: [], missingRequired: [], unrecognized: [] };
}

function escapeCell(value: string): string {
  // A leading =, +, - or @ is executed as a formula by several spreadsheet
  // applications. Prefixing an apostrophe keeps the value readable and inert.
  const guarded = /^[=+\-@\t\r]/u.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/gu, '""')}"`;
}

/**
 * The failed rows as a CSV.
 *
 * It carries the ICU key and its values rather than a rendered sentence: the
 * person downloading it may not read the locale the job ran in, and a key is
 * something support can look up. Nothing here comes from a provider.
 */
export function toErrorReportCsv(
  rows: readonly BulkImportRowView[],
  manifestIssues: readonly BulkImportIssue[],
): string {
  const lines: string[] = [BULK_IMPORT_ERROR_REPORT_COLUMNS.join(',')];
  for (const issue of manifestIssues) {
    lines.push(
      [
        escapeCell(''),
        escapeCell('1'),
        escapeCell(issue.column ?? ''),
        escapeCell(issue.key),
        escapeCell(JSON.stringify(issue.values)),
      ].join(','),
    );
  }
  for (const row of rows) {
    for (const issue of row.issues) {
      lines.push(
        [
          escapeCell(row.externalRowKey),
          escapeCell(String(row.lineNumber)),
          escapeCell(issue.column ?? ''),
          escapeCell(issue.key),
          escapeCell(JSON.stringify(issue.values)),
        ].join(','),
      );
    }
  }
  return `${lines.join('\r\n')}\r\n`;
}
