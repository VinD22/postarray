import { describe, expect, it } from 'vitest';

import { csvField, csvFilename, csvInstant, csvNumber, toCsv } from './csv';

describe('csvField', () => {
  it('leaves an ordinary field unquoted', () => {
    expect(csvField('impressions')).toBe('impressions');
    expect(csvField(42)).toBe('42');
  });

  it('quotes a field containing a comma', () => {
    // Without this the columns after it shift by one and the numbers end up
    // beside the wrong post.
    expect(csvField('Launch day, part two')).toBe('"Launch day, part two"');
  });

  it('doubles an embedded quote', () => {
    expect(csvField('She said "no"')).toBe('"She said ""no"""');
  });

  it('quotes a field containing a newline', () => {
    expect(csvField('line one\nline two')).toBe('"line one\nline two"');
  });

  it('quotes a field with surrounding whitespace so it survives', () => {
    expect(csvField('  spaced  ')).toBe('"  spaced  "');
  });

  it('writes an unavailable value as an empty cell, never as zero', () => {
    expect(csvField(null)).toBe('');
    expect(csvField(undefined)).toBe('');
    expect(csvField(null)).not.toBe('0');
  });
});

describe('csvNumber', () => {
  it('writes a real number unformatted so a spreadsheet can compute with it', () => {
    expect(csvNumber(1234.5)).toBe('1234.5');
    expect(csvNumber(0)).toBe('0');
  });

  it('writes an unavailable reading as an empty cell', () => {
    // The distinction the whole file exists for: a measured zero is "0" and an
    // unread metric is nothing at all, so AVERAGE excludes it.
    expect(csvNumber(null)).toBe('');
    expect(csvNumber(Number.NaN)).toBe('');
  });
});

describe('csvInstant', () => {
  it('writes an ISO instant', () => {
    expect(csvInstant('2026-03-01T12:30:00.000Z')).toBe('2026-03-01T12:30:00.000Z');
  });

  it('writes nothing for a missing or unparseable time', () => {
    expect(csvInstant(null)).toBe('');
    expect(csvInstant('not a date')).toBe('');
  });
});

describe('toCsv', () => {
  interface Row {
    readonly name: string;
    readonly value: number | null;
  }

  const columns = [
    { header: 'Account', value: (row: Row) => row.name },
    { header: 'Impressions', value: (row: Row) => csvNumber(row.value) },
  ];

  it('starts with a byte order mark so Excel reads it as UTF-8', () => {
    const csv = toCsv<Row>([], columns);
    expect(csv.codePointAt(0)).toBe(0xfeff);
  });

  it('separates rows with CRLF and ends with one', () => {
    const csv = toCsv<Row>([{ name: 'a', value: 1 }], columns);
    expect(csv).toBe('﻿Account,Impressions\r\na,1\r\n');
  });

  it('leaves an unavailable reading as an empty cell', () => {
    const csv = toCsv<Row>([{ name: 'a', value: null }], columns);
    expect(csv.endsWith('a,\r\n')).toBe(true);
    expect(csv).not.toContain('a,0');
  });
});

describe('csvFilename', () => {
  it('names the project and the range', () => {
    expect(
      csvFilename({
        project: 'Autumn campaign',
        from: '2026-03-01T00:00:00.000Z',
        to: '2026-03-28T00:00:00.000Z',
      }),
    ).toBe('postarray-autumn-campaign-2026-03-01-2026-03-28.csv');
  });

  it('cannot produce a path separator or a quote from a project name', () => {
    const name = csvFilename({
      project: 'Q3 / "Growth"',
      from: '2026-03-01T00:00:00.000Z',
      to: '2026-03-28T00:00:00.000Z',
    });
    expect(name).not.toContain('/');
    expect(name).not.toContain('"');
  });

  it('falls back rather than producing a nameless file', () => {
    const name = csvFilename({ project: '///', from: 'nope', to: 'nope' });
    expect(name).toBe('postarray-export-unknown-unknown.csv');
  });
});
