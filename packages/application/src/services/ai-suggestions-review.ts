import { z } from 'zod';

import type {
  ReviewCheck,
  ReviewCheckStatus,
  ReviewCheckView,
  ReviewFinding,
  SuggestionProvenance,
} from './ai-suggestions-types';

/**
 * The Review button: claim, accessibility and duplicate checks, mapped onto the
 * readiness checklist.
 *
 * Pure. Each check degrades to `unavailable`, never to an implied pass: "review
 * could not run" is honest, a silent green tick is not. None of these results
 * can block publishing on its own; they join the checklist as items a person
 * reads, and approval policy stays where it is.
 */

export const REVIEW_PROMPTS: Readonly<Record<ReviewCheck, string>> = {
  claims: 'claim-check',
  accessibility: 'accessibility-check',
  duplicates: 'duplicate-check',
};

const uncertainty = { uncertain: z.boolean(), uncertaintyReason: z.string().nullable() };

export const claimOutputSchema = z
  .object({
    claims: z.array(
      z
        .object({
          quote: z.string(),
          verdict: z.enum(['supported', 'unsupported', 'needs_evidence', 'prohibited']),
          reason: z.string(),
          suggestedRewrite: z.string().nullable(),
        })
        .passthrough(),
    ),
    overall: z.enum(['supported', 'unsupported', 'needs_evidence', 'prohibited']),
    ...uncertainty,
  })
  .passthrough();

export const accessibilityOutputSchema = z
  .object({
    findings: z.array(
      z
        .object({
          code: z.string(),
          severity: z.enum(['error', 'warning', 'info']),
          explanation: z.string(),
          suggestion: z.string().nullable(),
        })
        .passthrough(),
    ),
    ...uncertainty,
  })
  .passthrough();

export const duplicateOutputSchema = z
  .object({
    similarContentIds: z.array(z.string()),
    similarityScore: z.number(),
    verdict: z.enum(['distinct', 'similar', 'near_duplicate']),
    reason: z.string(),
    ...uncertainty,
  })
  .passthrough();

const STATUS_RANK: Readonly<Record<ReviewCheckStatus, number>> = {
  passed: 0,
  unavailable: 1,
  attention: 2,
  blocked: 3,
};

export function worstStatus(statuses: readonly ReviewCheckStatus[]): ReviewCheckStatus {
  return statuses.reduce<ReviewCheckStatus>(
    (worst, next) => (STATUS_RANK[next] > STATUS_RANK[worst] ? next : worst),
    'passed',
  );
}

function view(
  check: ReviewCheck,
  status: ReviewCheckStatus,
  findings: readonly ReviewFinding[],
  provenance: SuggestionProvenance,
): ReviewCheckView {
  return { check, status, findings, reasonKey: null, provenance };
}

export function mapClaimCheck(output: unknown, provenance: SuggestionProvenance): ReviewCheckView {
  const value = claimOutputSchema.parse(output);
  const findings: ReviewFinding[] = value.claims
    .filter((claim) => claim.verdict !== 'supported')
    .map((claim) => ({
      code: `CLAIM_${claim.verdict.toUpperCase()}`,
      severity: claim.verdict === 'prohibited' ? 'error' : 'warning',
      explanation: claim.reason,
      quote: claim.quote,
      suggestion: claim.suggestedRewrite,
      relatedContentIds: [],
    }));
  const status: ReviewCheckStatus =
    value.overall === 'prohibited'
      ? 'blocked'
      : findings.length > 0 || value.uncertain
        ? 'attention'
        : 'passed';
  return view('claims', status, findings, provenance);
}

export function mapAccessibilityCheck(
  output: unknown,
  provenance: SuggestionProvenance,
): ReviewCheckView {
  const value = accessibilityOutputSchema.parse(output);
  const findings: ReviewFinding[] = value.findings.map((finding) => ({
    code: finding.code,
    severity: finding.severity,
    explanation: finding.explanation,
    quote: null,
    suggestion: finding.suggestion,
    relatedContentIds: [],
  }));
  const status: ReviewCheckStatus = findings.some((entry) => entry.severity !== 'info')
    ? 'attention'
    : 'passed';
  return view('accessibility', status, findings, provenance);
}

/**
 * Duplicates never block: reposting on purpose is legitimate. Only ids the
 * request supplied survive, so a model cannot point at a post it never saw.
 */
export function mapDuplicateCheck(
  output: unknown,
  provenance: SuggestionProvenance,
  candidateIds: readonly string[],
): ReviewCheckView {
  const value = duplicateOutputSchema.parse(output);
  const known = new Set(candidateIds);
  const related = value.similarContentIds.filter((entry) => known.has(entry));
  if (value.verdict === 'distinct') {
    return view('duplicates', 'passed', [], provenance);
  }
  return view(
    'duplicates',
    'attention',
    [
      {
        code: value.verdict === 'near_duplicate' ? 'NEAR_DUPLICATE' : 'SIMILAR_TOPIC',
        severity: value.verdict === 'near_duplicate' ? 'warning' : 'info',
        explanation: value.reason,
        quote: null,
        suggestion: null,
        relatedContentIds: related,
      },
    ],
    provenance,
  );
}

export function unavailableCheck(check: ReviewCheck, reasonKey: string): ReviewCheckView {
  return { check, status: 'unavailable', findings: [], reasonKey, provenance: null };
}
