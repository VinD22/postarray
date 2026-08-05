import { describe, expect, it } from 'vitest';

import {
  calendarDayNumber,
  crossesOffsetChange,
  formatBytes,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
  formatTimeZoneLabel,
  formatTimeZoneOffset,
  getCurrencyExponent,
  getTimeZoneOffsetMinutes,
  isValidTimeZone,
  toDate,
} from './format';

const NEW_YORK = 'America/New_York';
const BERLIN = 'Europe/Berlin';
const TOKYO = 'Asia/Tokyo';

describe('toDate', () => {
  it('accepts dates, epoch milliseconds and ISO strings', () => {
    const iso = '2026-03-08T12:00:00.000Z';
    expect(toDate(iso).toISOString()).toBe(iso);
    expect(toDate(new Date(iso)).toISOString()).toBe(iso);
    expect(toDate(Date.parse(iso)).toISOString()).toBe(iso);
  });

  it('rejects nonsense', () => {
    expect(() => toDate('not a date')).toThrow(TypeError);
  });
});

describe('time zones', () => {
  it('validates IANA zones', () => {
    expect(isValidTimeZone(BERLIN)).toBe(true);
    expect(isValidTimeZone('Mars/Olympus')).toBe(false);
  });

  it('refuses to format with an unknown zone rather than guessing', () => {
    expect(() => formatDate('en', '2026-03-08T12:00:00Z', { timeZone: 'Mars/Olympus' })).toThrow(
      RangeError,
    );
  });

  it('never uses the ambient zone', () => {
    const instant = '2026-06-01T22:30:00Z';
    const tokyo = formatDateTime('en', instant, { timeZone: TOKYO });
    const newYork = formatDateTime('en', instant, { timeZone: NEW_YORK });
    expect(tokyo).not.toBe(newYork);
    expect(tokyo).toContain('Jun 2');
    expect(newYork).toContain('Jun 1');
  });
});

describe('daylight saving boundaries', () => {
  // In 2026 the United States moves to daylight time on 8 March at 02:00 local.
  const beforeChange = '2026-03-08T06:59:00Z';
  const afterChange = '2026-03-08T07:00:00Z';

  it('renders the local wall clock on each side of the change', () => {
    expect(formatTime('en', beforeChange, { timeZone: NEW_YORK })).toBe('1:59 AM');
    expect(formatTime('en', afterChange, { timeZone: NEW_YORK })).toBe('3:00 AM');
  });

  it('reports the offset change', () => {
    expect(getTimeZoneOffsetMinutes(NEW_YORK, beforeChange)).toBe(-300);
    expect(getTimeZoneOffsetMinutes(NEW_YORK, afterChange)).toBe(-240);
    expect(crossesOffsetChange(NEW_YORK, beforeChange, afterChange)).toBe(true);
    expect(crossesOffsetChange(TOKYO, beforeChange, afterChange)).toBe(false);
  });

  it('keeps the same calendar day across the change', () => {
    expect(calendarDayNumber(beforeChange, NEW_YORK)).toBe(
      calendarDayNumber(afterChange, NEW_YORK),
    );
  });

  it('labels the zone differently before and after the change', () => {
    const winter = formatTimeZoneLabel('en', NEW_YORK, { at: beforeChange });
    const summer = formatTimeZoneLabel('en', NEW_YORK, { at: afterChange });
    expect(winter).not.toBe(summer);
    expect(winter).toContain('GMT-5');
    expect(summer).toContain('GMT-4');
  });

  it('formats an offset on its own', () => {
    expect(formatTimeZoneOffset('en', BERLIN, '2026-01-15T12:00:00Z')).toBe('GMT+1');
    expect(formatTimeZoneOffset('en', BERLIN, '2026-07-15T12:00:00Z')).toBe('GMT+2');
  });
});

describe('non Gregorian calendars', () => {
  const instant = '2026-03-08T12:00:00Z';

  it('honours an explicit calendar', () => {
    const gregorian = formatDate('en', instant, { timeZone: 'UTC' });
    const japanese = formatDate('en', instant, { timeZone: 'UTC', calendar: 'japanese' });
    expect(japanese).not.toBe(gregorian);
  });

  it('formats an Islamic calendar date for Arabic', () => {
    const islamic = formatDate('ar', instant, {
      timeZone: 'UTC',
      calendar: 'islamic-umalqura',
      dateStyle: 'long',
    });
    const gregorian = formatDate('ar', instant, { timeZone: 'UTC', dateStyle: 'long' });
    expect(islamic.length).toBeGreaterThan(0);
    expect(islamic).not.toBe(gregorian);
  });

  it('honours an explicit numbering system', () => {
    const latin = formatDate('ar', instant, { timeZone: 'UTC', numberingSystem: 'latn' });
    expect(latin).toMatch(/\d/);
  });
});

describe('formatRelativeTime', () => {
  const now = '2026-08-04T12:00:00Z';

  it('picks a sensible unit', () => {
    expect(formatRelativeTime('en', '2026-08-04T11:59:30Z', { now })).toBe('30 seconds ago');
    expect(formatRelativeTime('en', '2026-08-04T11:30:00Z', { now })).toBe('30 minutes ago');
    expect(formatRelativeTime('en', '2026-08-04T06:00:00Z', { now })).toBe('6 hours ago');
    expect(formatRelativeTime('en', '2026-08-01T12:00:00Z', { now })).toBe('3 days ago');
    expect(formatRelativeTime('en', '2026-07-01T12:00:00Z', { now })).toBe('last month');
    expect(formatRelativeTime('en', '2026-09-04T12:00:00Z', { now })).toBe('next month');
  });

  it('uses the given zone for day boundaries', () => {
    // 23:30 UTC on 4 August is already 5 August in Tokyo, but still 4 August in UTC.
    const target = '2026-08-04T23:30:00Z';
    const reference = '2026-08-04T00:30:00Z';
    expect(
      formatRelativeTime('en', target, { now: reference, timeZone: TOKYO, numeric: 'auto' }),
    ).toBe('tomorrow');
    expect(
      formatRelativeTime('en', target, { now: reference, timeZone: 'UTC', numeric: 'auto' }),
    ).toBe('today');
  });

  it('accepts a forced unit', () => {
    expect(formatRelativeTime('en', '2026-08-05T12:00:00Z', { now, unit: 'hour' })).toBe(
      'in 24 hours',
    );
  });
});

describe('numbers', () => {
  it('formats plainly', () => {
    expect(formatNumber('en', 1234.5)).toBe('1,234.5');
    expect(formatNumber('de', 1234.5)).toBe('1.234,5');
  });

  it('formats compactly', () => {
    expect(formatCompactNumber('en', 12000)).toBe('12K');
    expect(formatCompactNumber('en', 12400)).toBe('12.4K');
    expect(formatCompactNumber('en', 3450000)).toBe('3.5M');
  });

  it('formats percentages from a ratio', () => {
    expect(formatPercent('en', 0.42)).toBe('42%');
    expect(formatPercent('en', 0.4237, { fractionDigits: 1 })).toBe('42.4%');
  });

  it('formats lists without concatenating', () => {
    expect(formatList('en', ['X', 'LinkedIn', 'TikTok'])).toBe('X, LinkedIn, and TikTok');
    expect(formatList('en', ['X', 'LinkedIn'], { type: 'disjunction' })).toBe('X or LinkedIn');
  });
});

describe('formatCurrency', () => {
  it('treats money as integer minor units', () => {
    expect(formatCurrency('en', 2900, 'USD')).toBe('$29.00');
    expect(formatCurrency('en', 30000, 'USD')).toBe('$300.00');
    expect(formatCurrency('en', 0, 'USD')).toBe('$0.00');
  });

  it('uses the correct exponent for zero decimal currencies', () => {
    expect(getCurrencyExponent('en', 'JPY')).toBe(0);
    expect(getCurrencyExponent('en', 'USD')).toBe(2);
    expect(formatCurrency('ja', 3000, 'JPY')).toContain('3,000');
  });

  it('can trim a zero fraction', () => {
    expect(formatCurrency('en', 2900, 'USD', { trimZeroFraction: true })).toBe('$29');
    expect(formatCurrency('en', 2950, 'USD', { trimZeroFraction: true })).toBe('$29.50');
  });

  it('rejects floats', () => {
    expect(() => formatCurrency('en', 29.5, 'USD')).toThrow(TypeError);
  });

  it('renders small provider costs', () => {
    expect(formatCurrency('en', 20, 'USD')).toBe('$0.20');
  });
});

describe('formatDuration', () => {
  it('composes units', () => {
    expect(formatDuration('en', 90 * 60 * 1000)).toBe('1 hr, 30 min');
    expect(formatDuration('en', 45 * 1000)).toBe('45 sec');
    expect(formatDuration('en', 0)).toBe('0 sec');
  });

  it('respects the unit budget', () => {
    const value = 26 * 60 * 60 * 1000 + 30 * 60 * 1000;
    expect(formatDuration('en', value, { maxUnits: 1 })).toBe('1 day');
    expect(formatDuration('en', value, { maxUnits: 2 })).toBe('1 day, 2 hr');
  });

  it('stops at the smallest requested unit', () => {
    expect(formatDuration('en', 90 * 1000, { smallestUnit: 'minute' })).toBe('1 min');
  });
});

describe('formatBytes', () => {
  it('uses the same decimal units the platforms document', () => {
    expect(formatBytes('en', 512)).toBe('512 byte');
    expect(formatBytes('en', 1500)).toBe('1.5 kB');
    expect(formatBytes('en', 5_000_000)).toBe('5 MB');
    expect(formatBytes('en', 2_100_000_000)).toBe('2.1 GB');
  });
});

describe('formatTimeZoneLabel', () => {
  it('names the zone and its offset', () => {
    const label = formatTimeZoneLabel('en', BERLIN, { at: '2026-07-15T12:00:00Z' });
    expect(label).toContain('Central European Summer Time');
    expect(label).toContain('GMT+2');
  });

  it('can omit the offset', () => {
    const label = formatTimeZoneLabel('en', BERLIN, {
      at: '2026-07-15T12:00:00Z',
      withOffset: false,
    });
    expect(label).toBe('Central European Summer Time');
  });

  it('localizes the zone name', () => {
    const label = formatTimeZoneLabel('de', BERLIN, { at: '2026-01-15T12:00:00Z' });
    expect(label).not.toContain('Central European');
  });
});
