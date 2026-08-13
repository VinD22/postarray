import { z } from 'zod';

import type { OutputScanOptions } from '../guardrails';
import type { AiTaskMode, AiVariables } from '../types';

/**
 * A versioned prompt module.
 *
 * Every prompt carries its id, a `YYYY-MM-DD.N` version, the locale it was
 * authored in, the schema its output must satisfy, its budget, what to do when
 * it cannot run, and its test fixtures. A publication receipt records the exact
 * version that produced a suggestion, so a prompt file is immutable once it has
 * produced a stored artifact: change the text, mint a new version.
 */

export const PROMPT_IDS = [
  'draft-from-brief',
  'platform-variant',
  'transcreate',
  'shorten',
  'tone-adjust',
  'alt-text',
  'hook-options',
  'cta-options',
  'claim-check',
  'platform-fit-check',
  'duplicate-check',
  'accessibility-check',
  'analytics-summary',
  'weekly-digest',
  'experiment-suggestion',
  'post-feedback',
  'growth-plan',
] as const;
export const promptIdSchema = z.enum(PROMPT_IDS);
export type PromptId = z.infer<typeof promptIdSchema>;

/** `YYYY-MM-DD.N`. Enforced so a prompt cannot ship without a version bump. */
export const PROMPT_VERSION_PATTERN = /^\d{4}-\d{2}-\d{2}\.\d+$/;
export const promptVersionSchema = z
  .string()
  .regex(PROMPT_VERSION_PATTERN, { error: 'INVALID_PROMPT_VERSION' });

/**
 * What the product does when this prompt cannot run: no key configured, budget
 * exhausted, timeout, or the circuit breaker is open. Never a silent failure
 * and never a silently truncated answer.
 */
export const PROMPT_DEGRADATIONS = [
  /** Return the caller's own input unchanged and say assistance is off. */
  'return_input_unchanged',
  /** Leave the field empty and mark it as still required. */
  'leave_empty_required',
  /** Surface the failure. A missing review must never read as a pass. */
  'fail_visibly',
  /** Show the deterministic data only, with no narrative layer. */
  'raw_data_only',
  /** Produce a partial artifact with the failed sections marked unavailable. */
  'partial_with_unavailable_sections',
] as const;
export type PromptDegradation = (typeof PROMPT_DEGRADATIONS)[number];

export interface PromptFixture<TOut = unknown> {
  readonly name: string;
  readonly variables: AiVariables;
  /** Canned, schema-valid output. The echo provider replays exactly this. */
  readonly output: TOut;
}

export interface PromptModule<TOut = unknown> {
  readonly id: PromptId;
  readonly version: string;
  /** The locale the instruction text is authored in. V1 authors in English. */
  readonly locale: string;
  readonly mode: AiTaskMode;
  readonly schema: z.ZodType<TOut>;
  readonly outputFormat: 'json' | 'text';
  readonly maxOutputTokens: number;
  readonly timeoutMs: number;
  /** Hard per-invocation ceiling in whole cents. */
  readonly budgetCents: number;
  readonly degradation: PromptDegradation;
  /** Model-facing instruction. Never rendered to a user. */
  readonly instruction: string;
  readonly requiredVariables: readonly string[];
  /** Post-validation rules applied to every string this prompt produces. */
  readonly scan: OutputScanOptions;
  readonly fixtures: readonly PromptFixture<TOut>[];
}

/** Shared closing instruction: how to answer, and what never to answer with. */
export const JSON_OUTPUT_RULE = [
  'Answer with a single JSON object and nothing else. No prose before or after it,',
  'no code fence, no comments. Use null where a value is unknown, never 0 and never',
  'an invented placeholder. Set "uncertain" to true and give a short',
  '"uncertaintyReason" whenever you are guessing.',
].join('\n');
