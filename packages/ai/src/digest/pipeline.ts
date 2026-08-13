import { weeklyDigestPrompt } from '../prompts/analysis';
import type { AiCallContext, AiGateway, AiMeta } from '../types';
import { buildDigestFloor } from './floor';
import type { DigestFloor, DigestFloorInput } from './floor';
import { postProcessDigest } from './postprocess';
import type { DigestViolation } from './postprocess';
import type { DigestRetrieval } from './retrieval';
import type { WeeklyDigestResult } from './schema';
import type { DigestInsightRow } from './types';

/**
 * The weekly digest pipeline.
 *
 * Floor first, model second. The deterministic rows are built before the model
 * is consulted at all, so every exit from this function returns a digest: the
 * gateway being disabled, the circuit breaker being open, a budget refusal, a
 * timeout and a failed number audit all land on the same honest floor rather
 * than on an empty panel.
 *
 * There is no repair attempt. A digest that invented a number is not repaired
 * into one that did not; it is discarded, and the reason is reported.
 */

export const DIGEST_SOURCES = ['ai', 'deterministic'] as const;
export type DigestSource = (typeof DIGEST_SOURCES)[number];

/** Why a digest fell back to the floor. `null` when it did not. */
export const DIGEST_FALLBACK_REASONS = [
  'ai_disabled',
  'ai_circuit_open',
  'ai_call_failed',
  'audit_rejected',
] as const;
export type DigestFallbackReason = (typeof DIGEST_FALLBACK_REASONS)[number];

export interface GenerateDigestInput extends DigestFloorInput {
  readonly gateway: AiGateway;
  readonly callContext: AiCallContext;
}

export interface GeneratedDigest {
  readonly source: DigestSource;
  readonly fallbackReason: DigestFallbackReason | null;
  readonly floor: DigestFloor;
  /** The validated model output, or `null` when the floor is the whole answer. */
  readonly narrative: WeeklyDigestResult | null;
  /** Floor rows plus, when the audit passed, the narrative rows. Storable as-is. */
  readonly rows: readonly DigestInsightRow[];
  readonly promptVersion: string | null;
  readonly model: string | null;
  readonly meta: AiMeta | null;
  /** Audit violations from a rejected generation, kept for support and telemetry. */
  readonly violations: readonly DigestViolation[];
}

/** Message keys for the two narrative row kinds. Owned by the i18n catalog. */
export const DIGEST_NARRATIVE_KEYS = {
  headline: 'digest.narrative.headline',
  observation: 'digest.narrative.observation',
  notSupported: 'digest.narrative.notSupported',
  nextAction: 'digest.narrative.nextAction',
} as const;

function narrativeRows(digest: WeeklyDigestResult, retrieval: DigestRetrieval): DigestInsightRow[] {
  const base = {
    kind: 'digest' as const,
    windowStart: retrieval.windowStart,
    windowEnd: retrieval.windowEnd,
    isNarrative: true,
    sampleSize: null,
  };
  const rows: DigestInsightRow[] = [
    {
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.headline,
      messageArgs: { statement: digest.headline },
      evidenceIds: [],
      confidence: digest.uncertain ? 'low' : 'medium',
    },
  ];
  for (const observation of digest.observations) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.observation,
      messageArgs: {
        statement: observation.statement,
        confounder: observation.confounders[0] ?? null,
      },
      evidenceIds: [...observation.evidenceIds],
      confidence: observation.confidence,
    });
  }
  for (const statement of digest.notSupported) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.notSupported,
      messageArgs: { statement },
      evidenceIds: [],
      confidence: 'high',
    });
  }
  if (digest.suggestedNextAction !== null) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.nextAction,
      messageArgs: { statement: digest.suggestedNextAction },
      evidenceIds: [],
      confidence: 'low',
    });
  }
  return rows;
}

function floorOnly(
  floor: DigestFloor,
  reason: DigestFallbackReason,
  extra: {
    readonly meta?: AiMeta;
    readonly violations?: readonly DigestViolation[];
  } = {},
): GeneratedDigest {
  return {
    source: 'deterministic',
    fallbackReason: reason,
    floor,
    narrative: null,
    rows: floor.rows,
    promptVersion: null,
    model: null,
    meta: extra.meta ?? null,
    violations: extra.violations ?? [],
  };
}

export async function generateWeeklyDigest(input: GenerateDigestInput): Promise<GeneratedDigest> {
  const floor = buildDigestFloor(input);
  const status = input.gateway.status();

  if (status.availability !== 'ready') {
    return floorOnly(floor, status.availability === 'disabled' ? 'ai_disabled' : 'ai_circuit_open');
  }

  let output: unknown;
  let meta: AiMeta;
  try {
    const result = await input.gateway.completeStructured(weeklyDigestPrompt.schema, {
      context: input.callContext,
      promptId: weeklyDigestPrompt.id,
      promptVersion: weeklyDigestPrompt.version,
      variables: input.retrieval.variables,
    });
    output = result.output;
    meta = result.meta;
  } catch {
    // A vendor outage is not a reason to show the user nothing.
    return floorOnly(floor, 'ai_call_failed');
  }

  const audited = postProcessDigest({ output, retrieval: input.retrieval });
  if (!audited.ok) {
    return floorOnly(floor, 'audit_rejected', { meta, violations: audited.violations });
  }

  return {
    source: 'ai',
    fallbackReason: null,
    floor,
    narrative: audited.digest,
    rows: [...floor.rows, ...narrativeRows(audited.digest, input.retrieval)],
    promptVersion: meta.promptVersion,
    model: meta.model,
    meta,
    violations: [],
  };
}
