import { GROWTH_PLAN_SCHEMA_VERSION, growthPlanSchema } from '@relay/contracts';
import type { GrowthPlan } from '@relay/contracts';

import { nowIso } from '../clock.js';
import type { Clock } from '../clock.js';
import { aiOutputInvalidError } from '../errors.js';
import { growthPlanPrompt } from '../prompts/analysis.js';
import type { AiCallContext, AiGateway, AiMeta } from '../types.js';
import { postProcessGrowthPlan } from './postprocess.js';
import type { GrowthViolation } from './postprocess.js';
import type { GrowthPlanContext } from './retrieval.js';

/**
 * The Growth Advisor generation pipeline.
 *
 * Retrieve, generate, assemble provenance, validate against the contract
 * schema, then run the deterministic post-processor. A rejected generation gets
 * exactly one repair attempt carrying the failing rule ids. A second failure
 * surfaces as a single honest error and nothing is saved. A rejected generation
 * is never partially shown.
 */

export interface GeneratePlanInput {
  readonly gateway: AiGateway;
  readonly callContext: AiCallContext;
  readonly planContext: GrowthPlanContext;
  readonly clock: Clock;
  readonly planId: string;
  readonly revision: number;
  readonly consentAssetIds?: readonly string[];
}

export interface GeneratePlanResult {
  readonly plan: GrowthPlan;
  readonly meta: AiMeta;
  /** Violations from the first attempt, kept for telemetry and support. */
  readonly repairedViolations: readonly GrowthViolation[];
}

interface Attempt {
  readonly plan: GrowthPlan | null;
  readonly meta: AiMeta;
  readonly violations: readonly GrowthViolation[];
  readonly repairInstruction: string;
}

export function assemblePlan(
  body: unknown,
  provenance: {
    readonly id: string;
    readonly workspaceId: string;
    readonly revision: number;
    readonly generatedAt: string;
    readonly model: string;
    readonly promptVersion: string;
  },
): unknown {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return body;
  }
  return {
    ...(body as Record<string, unknown>),
    id: provenance.id,
    workspaceId: provenance.workspaceId,
    schemaVersion: GROWTH_PLAN_SCHEMA_VERSION,
    revision: provenance.revision,
    state: 'draft',
    generatedAt: provenance.generatedAt,
    model: provenance.model,
    promptVersion: provenance.promptVersion,
  };
}

export async function generateGrowthPlan(input: GeneratePlanInput): Promise<GeneratePlanResult> {
  async function attempt(repairInstruction: string | undefined): Promise<Attempt> {
    const result = await input.gateway.completeStructured(growthPlanPrompt.schema, {
      context: input.callContext,
      promptId: growthPlanPrompt.id,
      promptVersion: growthPlanPrompt.version,
      variables: input.planContext.variables,
      untrustedSources: input.planContext.untrustedSources,
      ...(repairInstruction === undefined ? {} : { repairInstruction }),
    });

    const candidate = assemblePlan(result.output, {
      id: input.planId,
      workspaceId: input.callContext.workspaceId,
      revision: input.revision,
      generatedAt: nowIso(input.clock),
      model: result.meta.model,
      promptVersion: result.meta.promptVersion,
    });

    const parsed = growthPlanSchema.safeParse(candidate);
    if (!parsed.success) {
      const paths = parsed.error.issues
        .slice(0, 10)
        .map((issue) => issue.path.map(String).join('.') || '(root)');
      return {
        plan: null,
        meta: result.meta,
        violations: paths.map((path) => ({
          rule: 'R4_CAP_EXCEEDED' as const,
          path,
          excerpt: 'schema',
        })),
        repairInstruction: `The plan did not match the required shape at: ${paths.join(', ')}.`,
      };
    }

    const post = postProcessGrowthPlan({
      plan: parsed.data,
      context: input.planContext,
      now: input.clock.now(),
      ...(input.consentAssetIds === undefined ? {} : { consentAssetIds: input.consentAssetIds }),
    });

    return post.ok
      ? { plan: parsed.data, meta: result.meta, violations: [], repairInstruction: '' }
      : {
          plan: null,
          meta: result.meta,
          violations: post.violations,
          repairInstruction: post.repairInstruction,
        };
  }

  const first = await attempt(undefined);
  if (first.plan !== null) {
    return { plan: first.plan, meta: first.meta, repairedViolations: [] };
  }

  const second = await attempt(first.repairInstruction);
  if (second.plan !== null) {
    return { plan: second.plan, meta: second.meta, repairedViolations: first.violations };
  }

  throw aiOutputInvalidError('growth_plan_rejected', {
    correlationId: input.callContext.correlationId,
    details: {
      rules: [...new Set(second.violations.map((violation) => violation.rule))],
      firstAttemptRules: [...new Set(first.violations.map((violation) => violation.rule))],
    },
  });
}
