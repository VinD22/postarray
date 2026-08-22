import { describe, expect, it } from 'vitest';

import {
  BULK_IMPORT_APPLY_MODES,
  BULK_IMPORT_REQUIRED_COLUMNS,
  bulkImportApplyModeSchema,
  bulkImportIssueSchema,
  bulkImportJobSchema,
  bulkImportMediaRefSchema,
  bulkImportOptionsSchema,
  bulkImportRowPayloadSchema,
  parsePerPlatformColumn,
} from './bulk-import';

/**
 * Bulk import contracts.
 *
 * The assertions worth making at this level are the ones about what the shapes
 * refuse: a mode that publishes, a media reference that names a file on a disk,
 * a schedule without its zone, and a count that quietly reads zero when it is
 * actually unknown.
 */

const MEDIA = 'media_00000000000000000000000001';
const CONNECTION = 'conn_00000000000000000000000001';

function payload(overrides: Record<string, unknown> = {}) {
  return {
    projectRef: 'launch',
    targets: { setId: null, connectionIds: [CONNECTION] },
    body: 'Hello',
    title: null,
    variants: [],
    scheduledLocalTime: '2026-09-01T10:00',
    ianaTimeZone: 'Europe/Berlin',
    scheduledInstant: '2026-09-01T08:00:00.000Z',
    media: [{ kind: 'id', value: MEDIA }],
    destination: null,
    privacyValue: null,
    firstComment: null,
    approvalPolicy: null,
    ...overrides,
  };
}

describe('bulk import apply modes', () => {
  it('offers exactly two modes and neither of them publishes', () => {
    expect(BULK_IMPORT_APPLY_MODES).toEqual(['drafts', 'scheduled']);
    expect(bulkImportApplyModeSchema.safeParse('publish').success).toBe(false);
    expect(bulkImportApplyModeSchema.safeParse('published').success).toBe(false);
  });

  it('has no default mode, so a caller must say which one it means', () => {
    expect(bulkImportApplyModeSchema.safeParse(undefined).success).toBe(false);
  });
});

describe('bulk import options', () => {
  it('does not allow past schedules unless someone asked', () => {
    expect(bulkImportOptionsSchema.parse({})).toEqual({ allowPastSchedules: false });
  });

  it('refuses a default zone that is not in the tz database', () => {
    expect(bulkImportOptionsSchema.safeParse({ defaultTimeZone: 'Mars/Olympus' }).success).toBe(
      false,
    );
  });
});

describe('bulk import media references', () => {
  it('accepts an id, a checksum and an http address', () => {
    expect(bulkImportMediaRefSchema.safeParse({ kind: 'id', value: MEDIA }).success).toBe(true);
    expect(
      bulkImportMediaRefSchema.safeParse({ kind: 'checksum', value: 'a'.repeat(64) }).success,
    ).toBe(true);
    expect(
      bulkImportMediaRefSchema.safeParse({ kind: 'url', value: 'https://example.test/a.jpg' })
        .success,
    ).toBe(true);
  });

  it('has no shape that can carry a filesystem path', () => {
    expect(bulkImportMediaRefSchema.safeParse({ kind: 'path', value: '/etc/passwd' }).success).toBe(
      false,
    );
    expect(
      bulkImportMediaRefSchema.safeParse({ kind: 'url', value: 'file:///etc/passwd' }).success,
    ).toBe(false);
  });
});

describe('bulk import row payload', () => {
  it('accepts a local time paired with its zone and the instant they resolve to', () => {
    expect(bulkImportRowPayloadSchema.safeParse(payload()).success).toBe(true);
  });

  it('refuses a zone that is not a tz database name', () => {
    expect(bulkImportRowPayloadSchema.safeParse(payload({ ianaTimeZone: 'CEST' })).success).toBe(
      false,
    );
  });

  it('refuses an instant with no offset, because that is a naive timestamp', () => {
    expect(
      bulkImportRowPayloadSchema.safeParse(payload({ scheduledInstant: '2026-09-01T08:00:00' }))
        .success,
    ).toBe(false);
  });

  it('refuses an empty caption', () => {
    expect(bulkImportRowPayloadSchema.safeParse(payload({ body: '' })).success).toBe(false);
  });
});

describe('bulk import issues', () => {
  it('carries a key and bounded values, never a free-form message', () => {
    const parsed = bulkImportIssueSchema.safeParse({
      key: 'import.error.invalidTimeZone',
      column: 'time_zone',
      values: { value: 'Mars/Olympus' },
    });
    expect(parsed.success).toBe(true);
    expect(
      bulkImportIssueSchema.safeParse({
        key: 'import.error.applyFailed',
        column: null,
        values: {},
        message: 'the provider said no',
      }).success,
    ).toBe(false);
  });
});

describe('bulk import job view', () => {
  it('lets every count be unknown rather than forcing it to zero', () => {
    const parsed = bulkImportJobSchema.safeParse({
      id: 'import_00000000000000000000000001',
      workspaceId: 'ws_00000000000000000000000001',
      projectId: 'project_00000000000000000000000001',
      state: 'uploaded',
      filename: 'posts.csv',
      manifestChecksum: 'a'.repeat(64),
      byteSize: 0,
      parserVersion: '2026-08-10.1',
      options: { allowPastSchedules: false },
      counts: {
        total: null,
        valid: null,
        invalid: null,
        applied: null,
        failed: null,
        skipped: null,
      },
      appliedMode: null,
      appliedAt: null,
      errorReportAvailable: false,
      createdAt: '2026-08-10T09:00:00.000Z',
    });
    expect(parsed.success).toBe(true);
  });
});

describe('per platform columns', () => {
  it('recognises a caption or title column for a known provider only', () => {
    expect(parsePerPlatformColumn('caption_instagram')).toEqual({
      field: 'body',
      provider: 'instagram',
    });
    expect(parsePerPlatformColumn('title_youtube')).toEqual({
      field: 'title',
      provider: 'youtube',
    });
    expect(parsePerPlatformColumn('caption_myspace')).toBeNull();
    expect(parsePerPlatformColumn('notes')).toBeNull();
  });

  it('keeps the required column list stable', () => {
    expect(BULK_IMPORT_REQUIRED_COLUMNS).toEqual([
      'external_row_id',
      'project',
      'targets',
      'caption',
      'scheduled_local_time',
      'time_zone',
      'media',
    ]);
  });
});
