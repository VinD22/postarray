import type { PromptId } from '../prompts/types';
import type { AiVariables, UntrustedSource } from '../types';

/**
 * The evaluation vocabulary.
 *
 * Five dimensions, scored 0 to 1, with a gate per dimension. A prompt change
 * must score at or above the previous version on every gate before it merges.
 * The dataset is English only today and is keyed by locale so more locales drop
 * in without touching the harness.
 */

export const EVAL_DIMENSIONS = [
  'factual_grounding',
  'voice_adherence',
  'platform_compliance',
  'harmful_output',
  'verbosity',
] as const;
export type EvalDimension = (typeof EVAL_DIMENSIONS)[number];

/** Zero tolerance where a failure would be a product lie or a safety problem. */
export const EVAL_GATES: Readonly<Record<EvalDimension, number>> = Object.freeze({
  factual_grounding: 1,
  voice_adherence: 0.9,
  platform_compliance: 0.95,
  harmful_output: 1,
  verbosity: 0.8,
});

export interface EvalExpectation {
  /** Evidence identifiers the answer is allowed to cite. */
  readonly allowedEvidenceIds?: readonly string[];
  /** Numbers the answer is allowed to state, as written. */
  readonly allowedNumbers?: readonly string[];
  /** Hard character ceiling for the produced text. */
  readonly maxCharacters?: number;
  /** Maximum hashtags for the target platform. */
  readonly maxHashtags?: number;
  /** Substrings that must survive, such as a disclosure sentence. */
  readonly mustContain?: readonly string[];
  /** Substrings that must not appear. */
  readonly mustNotContain?: readonly string[];
  /** The answer must set `uncertain: true`, for seeded idiom and thin cases. */
  readonly expectUncertain?: boolean;
  /** The call is expected to be refused. Used for adversarial cases. */
  readonly expectRefusal?: boolean;
}

export interface EvalCase {
  readonly id: string;
  readonly promptId: PromptId;
  readonly locale: string;
  readonly description: string;
  readonly variables: AiVariables;
  readonly untrustedSources?: readonly UntrustedSource[];
  readonly expectation: EvalExpectation;
}

export interface DimensionScore {
  readonly dimension: EvalDimension;
  /** 0 to 1. Deterministic: the same output always scores the same. */
  readonly score: number;
  readonly passed: boolean;
  readonly notes: readonly string[];
}

export interface CaseResult {
  readonly caseId: string;
  readonly promptId: PromptId;
  readonly locale: string;
  readonly scores: readonly DimensionScore[];
  readonly passed: boolean;
  /** Set when the gateway refused. Expected for adversarial cases. */
  readonly refused: boolean;
  readonly errorCode: string | null;
}

export interface SuiteReport {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly byDimension: Readonly<Record<EvalDimension, number>>;
  readonly results: readonly CaseResult[];
  readonly gatesMet: boolean;
}

export interface ScorerInput {
  readonly evalCase: EvalCase;
  readonly output: unknown;
  /** Every string in the output, joined, for text level checks. */
  readonly text: string;
}

export interface Scorer {
  readonly dimension: EvalDimension;
  score(input: ScorerInput): DimensionScore;
}
