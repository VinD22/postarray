import { describe, expect, it } from 'vitest';
import type { BulkImportReport, BulkImportRowView } from '@relay/contracts';

import { canApply, problemsCsv, stepFor, templateCsv } from './wizard';

/**
 * The wizard's decisions, without a browser.
 *
 * Which step a person sees is derived from what the server said, so these are
 * the assertions that stop the screen offering "apply" for a file whose columns
 * were wrong, and stop it claiming an applied job is still waiting.
 */

function report(overrides: Partial<BulkImportReport['job']> = {}): BulkImportReport {
  return {
    job: {
      id: 'import_00000000000000000000000001',
      workspaceId: 'ws_00000000000000000000000001',
      projectId: 'brand_00000000000000000000000001',
      state: 'validated',
      filename: 'posts.csv',
      manifestChecksum: 'a'.repeat(64),
      byteSize: 128,
      parserVersion: '2026-08-10.1',
      options: { allowPastSchedules: false },
      counts: { total: 2, valid: 2, invalid: 0, applied: null, failed: null, skipped: null },
      appliedMode: null,
      appliedAt: null,
      errorReportAvailable: false,
      createdAt: '2026-08-10T09:00:00.000Z',
      ...overrides,
    },
    columns: { present: [], missingRequired: [], unrecognized: [] },
    manifestIssues: [],
  };
}

describe('import wizard steps', () => {
  it('starts on upload before anything has been read', () => {
    expect(stepFor(null)).toBe('upload');
  });

  it('stops on the column check when a required column is missing', () => {
    const withMissing = report();
    expect(
      stepFor({ ...withMissing, columns: { ...withMissing.columns, missingRequired: ['caption'] } }),
    ).toBe('columns');
  });

  it('offers review once at least one row is ready', () => {
    expect(stepFor(report())).toBe('review');
  });

  it('shows results once a person has applied', () => {
    expect(stepFor(report({ appliedAt: '2026-08-10T10:00:00.000Z', appliedMode: 'drafts' }))).toBe(
      'results',
    );
  });

  it('refuses to offer apply for a file that produced no ready rows', () => {
    expect(
      canApply(
        report({ counts: { total: 2, valid: 0, invalid: 2, applied: null, failed: null, skipped: null } }),
      ),
    ).toBe(false);
  });

  it('refuses to offer apply for a file that could not be read', () => {
    expect(canApply(report({ state: 'failed' }))).toBe(false);
  });
});

describe('import template and problem export', () => {
  it('offers a header only template rather than an invented example row', () => {
    const csv = templateCsv();
    expect(csv.split('\r\n')).toHaveLength(2);
    expect(csv).toContain('external_row_id');
    expect(csv).toContain('scheduled_local_time');
  });

  it('exports ICU keys and values rather than rendered sentences', () => {
    const rows: BulkImportRowView[] = [
      {
        id: 'importrow_00000000000000000000000001',
        importJobId: 'import_00000000000000000000000001',
        externalRowKey: 'r1',
        lineNumber: 2,
        state: 'invalid',
        payload: null,
        validation: null,
        issues: [{ key: 'import.error.invalidTimeZone', column: 'time_zone', values: { value: 'Mars/Olympus' } }],
        contentItemId: null,
        publishJobId: null,
        appliedAt: null,
      },
    ];
    const csv = problemsCsv(rows, []);
    expect(csv).toContain('import.error.invalidTimeZone');
    expect(csv).toContain('Mars/Olympus');
  });

  it('neutralises a cell a spreadsheet would execute as a formula', () => {
    const rows: BulkImportRowView[] = [
      {
        id: 'importrow_00000000000000000000000002',
        importJobId: 'import_00000000000000000000000001',
        externalRowKey: '=SUM(A1:A2)',
        lineNumber: 3,
        state: 'invalid',
        payload: null,
        validation: null,
        issues: [{ key: 'import.error.required', column: 'caption', values: {} }],
        contentItemId: null,
        publishJobId: null,
        appliedAt: null,
      },
    ];
    expect(problemsCsv(rows, [])).toContain('"\'=SUM(A1:A2)"');
  });
});
