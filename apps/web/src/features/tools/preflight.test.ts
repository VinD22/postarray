import { describe, expect, it } from 'vitest';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';

import { evaluateProvider, runPreflight, type PreflightInput } from './preflight';

const BASE: PreflightInput = {
  draft: '',
  providers: [],
  mediaKind: 'none',
  imageCount: 0,
  byteSize: null,
  durationSeconds: null,
  width: null,
  height: null,
};

function codesFor(row: { findings: readonly { code: string }[] }): string[] {
  return row.findings.map((finding) => finding.code);
}

describe('preflight text rules', () => {
  it('passes a short draft on every platform with a known limit', () => {
    const report = runPreflight({
      ...BASE,
      draft: 'A short, calm sentence.',
      providers: ['x', 'bluesky', 'linkedin'],
    });
    expect(report.failCount).toBe(0);
    expect(report.rows.map((row) => row.status)).toEqual(['pass', 'pass', 'pass']);
  });

  it('fails a draft that is over a platform ceiling', () => {
    const row = evaluateProvider({ ...BASE, draft: 'a'.repeat(400) }, 'bluesky');
    expect(row.status).toBe('fail');
    expect(codesFor(row)).toContain('textOver');
    const over = row.findings.find((finding) => finding.code === 'textOver');
    expect(over?.values['over']).toBe(400 - 300);
  });

  it('warns when a draft is close to the ceiling', () => {
    const row = evaluateProvider({ ...BASE, draft: 'a'.repeat(295) }, 'bluesky');
    expect(row.status).toBe('warning');
    expect(codesFor(row)).toContain('textNear');
  });

  it('charges a fixed cost per link where the platform rewrites links', () => {
    const long = `https://example.test/${'p'.repeat(200)}`;
    const row = evaluateProvider({ ...BASE, draft: `hi ${long}` }, 'x');
    expect(PUBLISHING_LIMITS.x.text?.linkCountingMode).toBe('fixed');
    expect(row.count).toBe(3 + (PUBLISHING_LIMITS.x.text?.charactersPerLink ?? 0));
    expect(row.status).toBe('pass');
    expect(codesFor(row)).toContain('linkFixed');
  });

  it('charges the real link length where the platform does not rewrite links', () => {
    const long = `https://example.test/${'p'.repeat(400)}`;
    const row = evaluateProvider({ ...BASE, draft: long }, 'bluesky');
    expect(PUBLISHING_LIMITS.bluesky.text?.linkCountingMode).toBe('actual');
    expect(row.status).toBe('fail');
    expect(codesFor(row)).toContain('linkActual');
  });

  it('measures with the unit the platform documents', () => {
    // Two CJK characters cost four on a weighted platform and two elsewhere.
    const weighted = evaluateProvider({ ...BASE, draft: '日本' }, 'x');
    const grapheme = evaluateProvider({ ...BASE, draft: '日本' }, 'bluesky');
    expect(PUBLISHING_LIMITS.x.countingUnit).toBe('weighted');
    expect(weighted.count).toBe(4);
    expect(grapheme.count).toBe(2);
  });
});

describe('preflight media rules', () => {
  it('fails when there are more images than the platform accepts', () => {
    const row = evaluateProvider({ ...BASE, draft: 'hi', mediaKind: 'image', imageCount: 9 }, 'x');
    expect(row.status).toBe('fail');
    expect(codesFor(row)).toContain('imagesOver');
  });

  it('fails when a file is over the byte ceiling', () => {
    const cap = PUBLISHING_LIMITS.bluesky.media?.maxImageBytes ?? 0;
    const row = evaluateProvider(
      { ...BASE, draft: 'hi', mediaKind: 'image', imageCount: 1, byteSize: cap + 1 },
      'bluesky',
    );
    expect(row.status).toBe('fail');
    expect(codesFor(row)).toContain('bytesOver');
  });

  it('fails a video that is longer than the platform ceiling', () => {
    const row = evaluateProvider(
      { ...BASE, draft: 'hi', mediaKind: 'video', durationSeconds: 100_000 },
      'x',
    );
    expect(row.status).toBe('fail');
    expect(codesFor(row)).toContain('durationOver');
  });

  it('fails a video that is shorter than the platform minimum', () => {
    const row = evaluateProvider(
      { ...BASE, draft: 'hi', mediaKind: 'video', durationSeconds: 1 },
      'instagram',
    );
    expect(codesFor(row)).toContain('durationUnder');
  });

  it('says a missing byte ceiling is unavailable rather than passing silently', () => {
    const row = evaluateProvider(
      { ...BASE, draft: 'hi', mediaKind: 'video', imageCount: 0, byteSize: 10 },
      'pinterest',
    );
    expect(PUBLISHING_LIMITS.pinterest.media?.maxVideoBytes).toBeNull();
    expect(codesFor(row)).toContain('bytesUnknown');
  });

  it('reports the aspect ratio when both dimensions are given', () => {
    const row = evaluateProvider(
      { ...BASE, draft: 'hi', mediaKind: 'image', imageCount: 1, width: 1920, height: 1080 },
      'x',
    );
    const ratio = row.findings.find((finding) => finding.code === 'ratio');
    expect(ratio?.values['ratio']).toBe('1.78');
  });
});

describe('preflight unavailable platforms', () => {
  it('reports a platform with no adapter as unavailable, never as a pass', () => {
    const row = evaluateProvider({ ...BASE, draft: 'hi' }, 'google_business_profile');
    expect(PUBLISHING_LIMITS.google_business_profile.adapterPresent).toBe(false);
    expect(row.status).toBe('unavailable');
    expect(row.count).toBeNull();
    expect(row.findings).toEqual([]);
  });
});

describe('preflight report', () => {
  it('returns rows in cohort order whatever order they were selected in', () => {
    const report = runPreflight({
      ...BASE,
      draft: 'hi',
      providers: ['bluesky', 'x', 'instagram'],
    });
    expect(report.rows.map((row) => row.provider)).toEqual(['x', 'instagram', 'bluesky']);
  });

  it('counts failures and warnings separately', () => {
    const report = runPreflight({
      ...BASE,
      draft: 'a'.repeat(295),
      providers: ['bluesky', 'x'],
    });
    expect(report.failCount).toBe(1);
    expect(report.warningCount).toBe(1);
  });
});
