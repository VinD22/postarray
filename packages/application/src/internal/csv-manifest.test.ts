import { describe, expect, it } from 'vitest';

import { parseCsvManifest, readDelimitedText } from './csv-manifest';
import type { BulkImportIssue } from '@relay/contracts';

/**
 * Manifest parser edge cases.
 *
 * Every case here is a real file someone will upload on the first day: a sheet
 * exported from Excel with a byte order mark, a caption containing a comma, a
 * caption containing a line break, a column someone renamed, a zone someone
 * invented, a time that has already passed, and the same row id pasted twice.
 */

const MEDIA = 'media_00000000000000000000000001';
const CONNECTION = 'conn_00000000000000000000000001';
const NOW = new Date('2026-08-10T09:00:00.000Z');

const HEADER = 'external_row_id,project,targets,caption,scheduled_local_time,time_zone,media';

function parse(text: string, allowPast = false) {
  return parseCsvManifest(text, { now: NOW, options: { allowPastSchedules: allowPast } });
}

function keys(issues: readonly BulkImportIssue[]): string[] {
  return issues.map((entry) => entry.key);
}

function row(externalRowKey: string, extra: Partial<Record<string, string>> = {}): string {
  const cells = [
    externalRowKey,
    extra['project'] ?? 'launch',
    extra['targets'] ?? CONNECTION,
    extra['caption'] ?? 'Hello',
    extra['scheduled_local_time'] ?? '2026-09-01T10:00',
    extra['time_zone'] ?? 'Europe/Berlin',
    extra['media'] ?? MEDIA,
  ];
  return cells.join(',');
}

describe('readDelimitedText', () => {
  it('drops a byte order mark so the first header is still recognisable', () => {
    const records = readDelimitedText('﻿external_row_id,project\r\na,b\r\n');
    expect(records[0]?.cells).toEqual(['external_row_id', 'project']);
    expect(records[1]?.cells).toEqual(['a', 'b']);
  });

  it('keeps a comma inside a quoted cell', () => {
    const records = readDelimitedText('a,b\n"one, two",three\n');
    expect(records[1]?.cells).toEqual(['one, two', 'three']);
  });

  it('keeps a line break inside a quoted cell and still counts physical lines', () => {
    const records = readDelimitedText('a,b\n"one\ntwo",three\nfour,five\n');
    expect(records[1]?.cells).toEqual(['one\ntwo', 'three']);
    // The quoted record spans physical lines 2 and 3, so the next one starts
    // on line 4. Counting records instead would misreport every later row.
    expect(records[2]?.lineNumber).toBe(4);
  });

  it('reads a doubled quote as one quote character', () => {
    expect(readDelimitedText('a\n"she said ""hi"""\n')[1]?.cells).toEqual(['she said "hi"']);
  });

  it('ignores a trailing newline rather than inventing an empty record', () => {
    expect(readDelimitedText('a,b\n1,2\n')).toHaveLength(2);
  });
});

describe('parseCsvManifest', () => {
  it('reports an empty file as an empty file, not as zero valid rows', () => {
    const manifest = parse('');
    expect(keys(manifest.issues)).toEqual(['import.error.emptyFile']);
    expect(manifest.rows).toEqual([]);
  });

  it('names every missing required column and parses no rows', () => {
    const manifest = parse('external_row_id,project\nr1,launch\n');
    expect(manifest.columns.missingRequired).toContain('caption');
    expect(manifest.columns.missingRequired).toContain('time_zone');
    expect(keys(manifest.issues)).toContain('import.error.missingColumn');
    expect(manifest.rows).toEqual([]);
  });

  it('reports an unrecognised column without discarding the file', () => {
    const manifest = parse(`${HEADER},notes\n${row('r1')},extra\n`);
    expect(manifest.columns.unrecognized).toEqual(['notes']);
    expect(manifest.rows).toHaveLength(1);
    expect(manifest.rows[0]?.payload).not.toBeNull();
  });

  it('accepts a per platform caption column for a known provider', () => {
    const manifest = parse(`${HEADER},caption_instagram\n${row('r1')},Square version\n`);
    expect(manifest.columns.unrecognized).toEqual([]);
    expect(manifest.rows[0]?.payload?.variants).toEqual([
      { provider: 'instagram', body: 'Square version', title: null },
    ]);
  });

  it('normalises a good row into a composer shaped payload with an instant and a zone', () => {
    const manifest = parse(`${HEADER}\n${row('r1')}\n`);
    const payload = manifest.rows[0]?.payload;
    expect(payload?.scheduledLocalTime).toBe('2026-09-01T10:00');
    expect(payload?.ianaTimeZone).toBe('Europe/Berlin');
    expect(payload?.scheduledInstant).toBe('2026-09-01T08:00:00.000Z');
    expect(payload?.media).toEqual([{ kind: 'id', value: MEDIA }]);
    expect(payload?.targets).toEqual({ setId: null, connectionIds: [CONNECTION] });
  });

  it('rejects a zone that is not in the tz database', () => {
    const manifest = parse(`${HEADER}\n${row('r1', { time_zone: 'Mars/Olympus' })}\n`);
    expect(keys(manifest.rows[0]?.issues ?? [])).toContain('import.error.invalidTimeZone');
    expect(manifest.rows[0]?.payload).toBeNull();
  });

  it('reports a scheduled time that has already passed instead of moving it', () => {
    const manifest = parse(
      `${HEADER}\n${row('r1', { scheduled_local_time: '2026-01-01T10:00' })}\n`,
    );
    expect(keys(manifest.rows[0]?.issues ?? [])).toContain('import.error.scheduleInPast');
  });

  it('accepts a past time only when the uploader asked for it', () => {
    const manifest = parse(
      `${HEADER}\n${row('r1', { scheduled_local_time: '2026-01-01T10:00' })}\n`,
      true,
    );
    expect(keys(manifest.rows[0]?.issues ?? [])).not.toContain('import.error.scheduleInPast');
  });

  it('marks the second use of a row id as duplicate and keeps the first', () => {
    const manifest = parse(`${HEADER}\n${row('r1')}\n${row('r1', { caption: 'Second' })}\n`);
    expect(manifest.rows[0]?.payload).not.toBeNull();
    expect(keys(manifest.rows[1]?.issues ?? [])).toEqual(['import.error.duplicateRowId']);
    expect(manifest.rows[1]?.externalRowKey).not.toBe(manifest.rows[0]?.externalRowKey);
  });

  it('keeps a caption that contains a comma and a line break intact', () => {
    const caption = '"Two things, and\nthen a second line"';
    const manifest = parse(`${HEADER}\n${row('r1', { caption })}\n`);
    expect(manifest.rows[0]?.payload?.body).toBe('Two things, and\nthen a second line');
  });

  it('reports a row with too few cells without touching the next row', () => {
    const manifest = parse(`${HEADER}\nr1,launch,${CONNECTION}\n${row('r2')}\n`);
    expect(keys(manifest.rows[0]?.issues ?? [])).toContain('import.error.rowShape');
    expect(manifest.rows[1]?.payload).not.toBeNull();
  });

  it('refuses a filesystem path in the media column and accepts a checksum', () => {
    const bad = parse(`${HEADER}\n${row('r1', { media: '/Users/me/photo.jpg' })}\n`);
    expect(keys(bad.rows[0]?.issues ?? [])).toContain('import.error.invalidMedia');

    const checksum = `sha256:${'a'.repeat(64)}`;
    const good = parse(`${HEADER}\n${row('r1', { media: checksum })}\n`);
    expect(good.rows[0]?.payload?.media).toEqual([{ kind: 'checksum', value: 'a'.repeat(64) }]);
  });

  it('rejects a target list that is not connection ids or a posting set', () => {
    const manifest = parse(`${HEADER}\n${row('r1', { targets: 'my instagram' })}\n`);
    expect(keys(manifest.rows[0]?.issues ?? [])).toContain('import.error.invalidTargets');
  });

  it('carries the parser version so a stored job can say how it was read', () => {
    expect(parse(`${HEADER}\n${row('r1')}\n`).parserVersion).toMatch(/^\d{4}-\d{2}-\d{2}\./u);
  });
});
