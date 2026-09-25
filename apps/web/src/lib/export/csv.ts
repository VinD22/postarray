/**
 * CSV, written so a spreadsheet reads it the way we wrote it.
 *
 * Four decisions, each of which is a real bug somewhere if it goes the other
 * way:
 *
 * - **RFC 4180 quoting.** A field containing a comma, a quote or a newline is
 *   wrapped in quotes and its own quotes are doubled. A post title with a
 *   comma in it otherwise shifts every column after it by one, silently, and
 *   the reader gets a spreadsheet where the numbers belong to the wrong post.
 * - **A UTF-8 byte order mark.** Excel on Windows opens a BOM-less UTF-8 file
 *   as the system code page, which turns every accented handle into mojibake.
 *   The BOM is three bytes that cost nothing and are ignored by everything
 *   else that reads CSV.
 * - **CRLF line endings**, which is what RFC 4180 specifies and what older
 *   spreadsheet software still expects.
 * - **An unavailable value is an empty cell.** Never `0`, never `-`, never
 *   `N/A`. A zero is a measurement, and a spreadsheet will happily average it,
 *   sum it and chart it alongside real readings. An empty cell is excluded
 *   from `AVERAGE` by every spreadsheet there is, which is the correct
 *   arithmetic and the only one we can guarantee downstream.
 *
 * Dates go out as ISO instants. A localized date in a CSV is a date whose
 * meaning depends on who opens it.
 */

/** `null` is a reading the provider did not return. It becomes an empty cell. */
export type CsvValue = string | number | boolean | null | undefined;

export interface CsvColumn<Row> {
  /** The header cell. Already translated by the caller. */
  readonly header: string;
  readonly value: (row: Row) => CsvValue;
}

const BOM = '﻿';
const CRLF = '\r\n';

/**
 * Quote a field if it needs it, and only then.
 *
 * A leading space is preserved by quoting too: several spreadsheets strip it
 * otherwise, and a handle is not the same handle with a character removed.
 */
export function csvField(value: CsvValue): string {
  if (value === null || value === undefined) return '';

  const text = typeof value === 'string' ? value : String(value);
  const needsQuotes =
    text.includes(',') ||
    text.includes('"') ||
    text.includes('\n') ||
    text.includes('\r') ||
    text !== text.trim();

  return needsQuotes ? `"${text.replaceAll('"', '""')}"` : text;
}

/** An ISO instant, or an empty cell when there is no time to report. */
export function csvInstant(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

/**
 * A number, or an empty cell when the provider did not report one.
 *
 * Written unformatted on purpose: no thousands separators, no percent sign,
 * no currency. A grouped number is text to a spreadsheet, and the point of
 * exporting is that the recipient can compute with it.
 */
export function csvNumber(value: number | null | undefined): string {
  return value === null || value === undefined || !Number.isFinite(value) ? '' : String(value);
}

/** Render rows as an RFC 4180 document, header row first, with a BOM. */
export function toCsv<Row>(rows: readonly Row[], columns: readonly CsvColumn<Row>[]): string {
  const lines = [
    columns.map((column) => csvField(column.header)).join(','),
    ...rows.map((row) => columns.map((column) => csvField(column.value(row))).join(',')),
  ];
  return BOM + lines.join(CRLF) + CRLF;
}

/**
 * A filename that sorts and survives a filesystem.
 *
 * Every part is slugified, so a project called `Q3 / "Growth"` cannot produce
 * a path separator or a quote in a name a browser is about to write to disk.
 */
export function csvFilename(input: {
  readonly project: string;
  readonly from: string;
  readonly to: string;
}): string {
  const slug = (value: string): string =>
    value
      .normalize('NFKD')
      .replace(/[^\w-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
      .slice(0, 48) || 'export';

  const day = (value: string): string => csvInstant(value).slice(0, 10) || 'unknown';

  return `postarray-${slug(input.project)}-${day(input.from)}-${day(input.to)}.csv`;
}

/**
 * Hand the document to the browser as a download.
 *
 * An object URL and a synthetic click, revoked on the next frame. There is no
 * server round trip because there is nothing to ask a server: every number in
 * the file is already on the screen.
 *
 * `text/csv;charset=utf-8` rather than `application/octet-stream`, so a
 * spreadsheet is offered as the handler instead of the browser guessing.
 */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  // Not revoked synchronously: Safari has not started reading the blob by the
  // time click() returns, and revoking there cancels the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
