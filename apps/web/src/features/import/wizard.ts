import {
  BULK_IMPORT_ERROR_REPORT_COLUMNS,
  BULK_IMPORT_OPTIONAL_COLUMNS,
  BULK_IMPORT_REQUIRED_COLUMNS,
  type BulkImportIssue,
  type BulkImportReport,
  type BulkImportRowView,
} from '@relay/contracts';

/**
 * The wizard's pure parts.
 *
 * Which step a person is on is a function of what the server has said so far,
 * not a counter the screen increments. That is what stops the wizard claiming
 * a file is ready to apply when the column check failed, and it is what lets a
 * reload land a person back where they were.
 */

export const IMPORT_STEPS = ['upload', 'columns', 'review', 'apply', 'results'] as const;
export type ImportStep = (typeof IMPORT_STEPS)[number];

export const IMPORT_TEMPLATE_COLUMNS = [
  ...BULK_IMPORT_REQUIRED_COLUMNS,
  ...BULK_IMPORT_OPTIONAL_COLUMNS,
] as const;

export function stepFor(report: BulkImportReport | null): ImportStep {
  if (report === null) return 'upload';
  if (report.job.state === 'failed' || report.columns.missingRequired.length > 0) return 'columns';
  if (report.job.appliedAt !== null) return 'results';
  const valid = report.job.counts.valid;
  return valid !== null && valid > 0 ? 'review' : 'columns';
}

export function stepIndex(step: ImportStep): number {
  return IMPORT_STEPS.indexOf(step) + 1;
}

/** True when there is something a person could reasonably apply. */
export function canApply(report: BulkImportReport | null): boolean {
  if (report === null || report.job.state === 'failed') return false;
  const valid = report.job.counts.valid;
  return valid !== null && valid > 0;
}

/**
 * A template a person can fill in.
 *
 * Header only. Seeding it with an example row would put a made-up account id
 * and a made-up date into a file someone might upload without reading.
 */
export function templateCsv(): string {
  return `${IMPORT_TEMPLATE_COLUMNS.join(',')}\r\n`;
}

function cell(value: string): string {
  const guarded = /^[=+\-@\t\r]/u.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/gu, '""')}"`;
}

/**
 * The problems as a CSV, built from the rows already on screen.
 *
 * It carries the ICU key and its values rather than the rendered sentence: the
 * file may be forwarded to someone reading a different language, and a key is
 * something support can look up.
 */
export function problemsCsv(
  rows: readonly BulkImportRowView[],
  manifestIssues: readonly BulkImportIssue[],
): string {
  const lines: string[] = [BULK_IMPORT_ERROR_REPORT_COLUMNS.join(',')];
  const push = (rowKey: string, line: number, issue: BulkImportIssue): void => {
    lines.push(
      [
        cell(rowKey),
        cell(String(line)),
        cell(issue.column ?? ''),
        cell(issue.key),
        cell(JSON.stringify(issue.values)),
      ].join(','),
    );
  };
  for (const issue of manifestIssues) push('', 1, issue);
  for (const row of rows) {
    for (const issue of row.issues) push(row.externalRowKey, row.lineNumber, issue);
  }
  return `${lines.join('\r\n')}\r\n`;
}

/** A count we do not have is `unavailable`, never zero. */
export function countLabel(value: number | null, unavailable: string): string {
  return value === null ? unavailable : String(value);
}
