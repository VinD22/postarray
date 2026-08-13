import { collectStrings } from '../growth/postprocess';
import type { DigestRetrieval } from './retrieval';
import { weeklyDigestResultSchema } from './schema';
import type { WeeklyDigestResult } from './schema';

/**
 * The deterministic post-processor for the weekly digest.
 *
 * The growth pipeline rejects a plan that names a catalog id nobody passed in.
 * This is the same idea applied to arithmetic: every numeral in the model's
 * prose must be traceable to the retrieval payload, or be a count of evidence
 * ids the model itself listed. A model that cannot introduce a number cannot
 * fabricate a metric, which is the whole reason the retrieval half is
 * deterministic.
 *
 * It rejects. It never repairs. A rejected generation is never stored and never
 * partially shown: the caller falls back to the deterministic floor, which is
 * always available.
 */

export const DIGEST_REJECTION_RULES = [
  'D1_INVENTED_NUMBER',
  'D2_UNKNOWN_EVIDENCE_ID',
  'D3_CAUSAL_LANGUAGE',
  'D4_SMALL_SAMPLE_NOT_NAMED',
  'D5_UNAVAILABLE_TREATED_AS_ZERO',
] as const;
export type DigestRejectionRule = (typeof DIGEST_REJECTION_RULES)[number];

export interface DigestViolation {
  readonly rule: DigestRejectionRule;
  readonly path: string;
  /** A short, already-truncated excerpt. Never the whole digest. */
  readonly excerpt: string;
}

export interface DigestPostProcessInput {
  readonly output: unknown;
  readonly retrieval: DigestRetrieval;
}

export type DigestPostProcessResult =
  | { readonly ok: true; readonly digest: WeeklyDigestResult; readonly violations: readonly [] }
  | { readonly ok: false; readonly digest: null; readonly violations: readonly DigestViolation[] };

const EXCERPT_LENGTH = 160;
const NUMERAL_PATTERN = /-?\d+(?:\.\d+)?/g;

/** Words that turn an association into a claim about cause. */
const CAUSAL_PATTERNS: readonly RegExp[] = [
  /\bcaused\b/i,
  /\bcauses\b/i,
  /\bbecause of (?:this|that|the post)\b/i,
  /\bdrove\b/i,
  /\bled to\b/i,
  /\bresulted in\b/i,
];

/** Phrasing that reads an unavailable metric as a measured nothing. */
const ZERO_FOR_UNKNOWN_PATTERNS: readonly RegExp[] = [
  /\bno (?:impressions|saves|clicks|views|engagement)\b/i,
  /\bzero (?:impressions|saves|clicks|views|engagement)\b/i,
];

function excerpt(value: string): string {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  return collapsed.length > EXCERPT_LENGTH ? `${collapsed.slice(0, EXCERPT_LENGTH)}...` : collapsed;
}

/** Paths whose strings are identifiers, not prose, and carry no numerals to audit. */
function isIdentifierPath(path: string): boolean {
  return path.includes('evidenceIds');
}

/**
 * Numbers the model is allowed to write: everything present in the retrieval
 * payload, plus the size of any evidence list it cited (saying "three posts"
 * about three ids it just listed is restating, not inventing).
 */
export function allowedNumbersFor(
  retrieval: DigestRetrieval,
  digest: WeeklyDigestResult,
): ReadonlySet<number> {
  const allowed = new Set<number>(retrieval.allowedNumbers);
  allowed.add(digest.observations.length);
  for (const observation of digest.observations) {
    allowed.add(observation.evidenceIds.length);
    allowed.add(observation.confounders.length);
  }
  return allowed;
}

export function postProcessDigest(input: DigestPostProcessInput): DigestPostProcessResult {
  const parsed = weeklyDigestResultSchema.safeParse(input.output);
  if (!parsed.success) {
    return {
      ok: false,
      digest: null,
      violations: parsed.error.issues.slice(0, 10).map((issue) => ({
        rule: 'D1_INVENTED_NUMBER' as const,
        path: issue.path.map(String).join('.') || '(root)',
        excerpt: 'schema',
      })),
    };
  }

  const digest = parsed.data;
  const violations: DigestViolation[] = [];
  const allowed = allowedNumbersFor(input.retrieval, digest);

  for (const entry of collectStrings(digest)) {
    if (isIdentifierPath(entry.path)) {
      continue;
    }

    // D1: the number audit.
    for (const match of entry.value.matchAll(NUMERAL_PATTERN)) {
      const value = Number(match[0]);
      if (!Number.isFinite(value) || !allowed.has(value)) {
        violations.push({
          rule: 'D1_INVENTED_NUMBER',
          path: entry.path,
          excerpt: excerpt(match[0]),
        });
      }
    }

    for (const pattern of CAUSAL_PATTERNS) {
      if (pattern.test(entry.value)) {
        violations.push({
          rule: 'D3_CAUSAL_LANGUAGE',
          path: entry.path,
          excerpt: excerpt(entry.value),
        });
        break;
      }
    }

    if (input.retrieval.unavailable.length > 0) {
      for (const pattern of ZERO_FOR_UNKNOWN_PATTERNS) {
        if (pattern.test(entry.value)) {
          violations.push({
            rule: 'D5_UNAVAILABLE_TREATED_AS_ZERO',
            path: entry.path,
            excerpt: excerpt(entry.value),
          });
          break;
        }
      }
    }
  }

  // D2: evidence must be a receipt id or metric name that was supplied.
  digest.observations.forEach((observation, index) => {
    observation.evidenceIds.forEach((id, position) => {
      if (!input.retrieval.allowedEvidenceIds.has(id)) {
        violations.push({
          rule: 'D2_UNKNOWN_EVIDENCE_ID',
          path: `observations[${index}].evidenceIds[${position}]`,
          excerpt: excerpt(id),
        });
      }
    });
  });

  // D4: a small sample is named as small, not hedged away in a confounder.
  const anySmallSample = input.retrieval.baselines.some((result) => result.smallSample);
  if (anySmallSample && !digest.sampleIsSmall) {
    violations.push({ rule: 'D4_SMALL_SAMPLE_NOT_NAMED', path: 'sampleIsSmall', excerpt: 'false' });
  }

  return violations.length === 0
    ? { ok: true, digest, violations: [] }
    : { ok: false, digest: null, violations };
}
