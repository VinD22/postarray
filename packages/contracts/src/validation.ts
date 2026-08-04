import { z } from 'zod';

import { currencyCodeSchema } from './primitives.js';

/**
 * Deterministic pre-flight. The same input always produces the same issues, so
 * the composer, the API, the CLI and the worker agree before anything is sent.
 * Message text lives in the i18n catalog; only keys and parameters travel here.
 */

export const VALIDATION_SEVERITIES = ['error', 'warning', 'info'] as const;
export const validationSeveritySchema = z.enum(VALIDATION_SEVERITIES);
export type ValidationSeverity = z.infer<typeof validationSeveritySchema>;

export const validationParamValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type ValidationParamValue = z.infer<typeof validationParamValueSchema>;

export const validationIssueSchema = z
  .object({
    /** Stable machine code, for example `TEXT_TOO_LONG`. */
    code: z.string().min(1),
    severity: validationSeveritySchema,
    /** Dotted path into the draft, for example `variants.0.body`. */
    field: z.string().min(1).optional(),
    /** The connection, variant or thread item the issue belongs to. */
    targetId: z.string().min(1).optional(),
    messageKey: z.string().min(1),
    params: z.record(z.string(), validationParamValueSchema),
    remediationKey: z.string().min(1).optional(),
  })
  .strict();
export type ValidationIssue = z.infer<typeof validationIssueSchema>;

export const validationResultSchema = z
  .object({
    ok: z.boolean(),
    issues: z.array(validationIssueSchema),
    estimatedCostMinor: z.number().int().nonnegative().optional(),
    currency: currencyCodeSchema.optional(),
  })
  .strict()
  .superRefine((result, ctx) => {
    const hasError = result.issues.some((issue) => issue.severity === 'error');
    if (result.ok === hasError) {
      ctx.addIssue({ code: 'custom', path: ['ok'], message: 'OK_DISAGREES_WITH_ISSUES' });
    }
    if (result.estimatedCostMinor !== undefined && result.currency === undefined) {
      ctx.addIssue({ code: 'custom', path: ['currency'], message: 'CURRENCY_REQUIRED' });
    }
  });
export type ValidationResult = z.infer<typeof validationResultSchema>;

export interface ValidationIssueInput {
  readonly code: string;
  readonly severity: ValidationSeverity;
  readonly messageKey?: string;
  readonly field?: string;
  readonly targetId?: string;
  readonly params?: Readonly<Record<string, ValidationParamValue>>;
  readonly remediationKey?: string;
}

/** Build an issue, defaulting the message key from the code. */
export function validationIssue(input: ValidationIssueInput): ValidationIssue {
  return {
    code: input.code,
    severity: input.severity,
    messageKey: input.messageKey ?? `validation.${input.code.toLowerCase()}`,
    params: { ...(input.params ?? {}) },
    ...(input.field === undefined ? {} : { field: input.field }),
    ...(input.targetId === undefined ? {} : { targetId: input.targetId }),
    ...(input.remediationKey === undefined ? {} : { remediationKey: input.remediationKey }),
  };
}

export function hasErrors(issues: readonly ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}

export function issuesFor(
  issues: readonly ValidationIssue[],
  targetId: string,
): ValidationIssue[] {
  return issues.filter((issue) => issue.targetId === targetId);
}

export interface ValidationResultInput {
  readonly issues: readonly ValidationIssue[];
  readonly estimatedCostMinor?: number;
  readonly currency?: string;
}

/** Build a result with `ok` derived from the issues, never set by hand. */
export function validationResult(input: ValidationResultInput): ValidationResult {
  return {
    ok: !hasErrors(input.issues),
    issues: [...input.issues],
    ...(input.estimatedCostMinor === undefined
      ? {}
      : { estimatedCostMinor: input.estimatedCostMinor }),
    ...(input.currency === undefined ? {} : { currency: input.currency }),
  };
}

/**
 * Combine per-target results into one. Costs are summed only when every priced
 * part agrees on a currency, otherwise the total is omitted rather than guessed.
 */
export function mergeValidationResults(
  results: readonly ValidationResult[],
): ValidationResult {
  const issues = results.flatMap((result) => result.issues);
  const priced = results.filter((result) => result.estimatedCostMinor !== undefined);
  const currencies = new Set(priced.map((result) => result.currency));
  if (priced.length === 0 || currencies.size !== 1) {
    return validationResult({ issues });
  }
  const [currency] = [...currencies];
  if (currency === undefined) {
    return validationResult({ issues });
  }
  return validationResult({
    issues,
    currency,
    estimatedCostMinor: priced.reduce((total, result) => total + (result.estimatedCostMinor ?? 0), 0),
  });
}

export interface ValidationSummary {
  readonly ok: boolean;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
  readonly targetIds: readonly string[];
}

export function summarizeValidation(result: ValidationResult): ValidationSummary {
  const targetIds = new Set<string>();
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  for (const issue of result.issues) {
    if (issue.targetId !== undefined) {
      targetIds.add(issue.targetId);
    }
    if (issue.severity === 'error') {
      errorCount += 1;
    } else if (issue.severity === 'warning') {
      warningCount += 1;
    } else {
      infoCount += 1;
    }
  }
  return { ok: result.ok, errorCount, warningCount, infoCount, targetIds: [...targetIds] };
}
