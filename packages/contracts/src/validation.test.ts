import { describe, expect, it } from 'vitest';

import {
  hasErrors,
  issuesFor,
  mergeValidationResults,
  summarizeValidation,
  validationIssue,
  validationResult,
  validationResultSchema,
} from './validation';

describe('validationIssue', () => {
  it('derives a message key from the code', () => {
    const issue = validationIssue({ code: 'TEXT_TOO_LONG', severity: 'error' });
    expect(issue.messageKey).toBe('validation.text_too_long.message');
    expect(issue.params).toEqual({});
  });

  it('keeps params and remediation for the i18n layer', () => {
    const issue = validationIssue({
      code: 'TEXT_TOO_LONG',
      severity: 'error',
      field: 'variants.0.body',
      targetId: 'pv_1',
      params: { limit: 280, actual: 341 },
      remediationKey: 'validation.text_too_long.fix',
    });
    expect(issue.params).toEqual({ limit: 280, actual: 341 });
    expect(issue.remediationKey).toBe('validation.text_too_long.fix');
    expect(issue.field).toBe('variants.0.body');
  });
});

describe('validationResult', () => {
  it('derives ok from the issues rather than trusting the caller', () => {
    expect(validationResult({ issues: [] }).ok).toBe(true);
    const warned = validationResult({
      issues: [validationIssue({ code: 'HASHTAG_HEAVY', severity: 'warning' })],
    });
    expect(warned.ok).toBe(true);
    const failed = validationResult({
      issues: [validationIssue({ code: 'MEDIA_TOO_LARGE', severity: 'error' })],
    });
    expect(failed.ok).toBe(false);
  });

  it('rejects a result whose ok flag disagrees with its issues', () => {
    expect(
      validationResultSchema.safeParse({
        ok: true,
        issues: [validationIssue({ code: 'MEDIA_TOO_LARGE', severity: 'error' })],
      }).success,
    ).toBe(false);
  });

  it('requires a currency alongside an estimated cost', () => {
    expect(
      validationResultSchema.safeParse({ ok: true, issues: [], estimatedCostMinor: 20 }).success,
    ).toBe(false);
    expect(
      validationResultSchema.safeParse({
        ok: true,
        issues: [],
        estimatedCostMinor: 20,
        currency: 'USD',
      }).success,
    ).toBe(true);
  });
});

describe('mergeValidationResults', () => {
  it('sums costs when every priced part shares a currency', () => {
    const merged = mergeValidationResults([
      validationResult({ issues: [], estimatedCostMinor: 2, currency: 'USD' }),
      validationResult({ issues: [], estimatedCostMinor: 20, currency: 'USD' }),
    ]);
    expect(merged.estimatedCostMinor).toBe(22);
    expect(merged.currency).toBe('USD');
    expect(merged.ok).toBe(true);
  });

  it('omits a total rather than mixing currencies', () => {
    const merged = mergeValidationResults([
      validationResult({ issues: [], estimatedCostMinor: 2, currency: 'USD' }),
      validationResult({ issues: [], estimatedCostMinor: 20, currency: 'EUR' }),
    ]);
    expect(merged.estimatedCostMinor).toBeUndefined();
    expect(merged.currency).toBeUndefined();
  });

  it('fails the merged result when any part failed', () => {
    const merged = mergeValidationResults([
      validationResult({ issues: [] }),
      validationResult({
        issues: [validationIssue({ code: 'CONTENT_INVALID', severity: 'error', targetId: 'pv_2' })],
      }),
    ]);
    expect(merged.ok).toBe(false);
    expect(hasErrors(merged.issues)).toBe(true);
    expect(issuesFor(merged.issues, 'pv_2')).toHaveLength(1);
  });
});

describe('summarizeValidation', () => {
  it('counts by severity and lists affected targets', () => {
    const summary = summarizeValidation(
      validationResult({
        issues: [
          validationIssue({ code: 'A', severity: 'error', targetId: 'pv_1' }),
          validationIssue({ code: 'B', severity: 'warning', targetId: 'pv_1' }),
          validationIssue({ code: 'C', severity: 'info', targetId: 'pv_2' }),
        ],
      }),
    );
    expect(summary).toEqual({
      ok: false,
      errorCount: 1,
      warningCount: 1,
      infoCount: 1,
      targetIds: ['pv_1', 'pv_2'],
    });
  });
});
