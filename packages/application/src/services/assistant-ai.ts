import type { AssistantProvenance } from '@relay/contracts';
import type { z } from 'zod';

import type {
  ActorContext,
  AiCallMeta,
  AiCallRequest,
  AiStructuredOutcome,
  ServiceDeps,
  UntrustedSourceInput,
} from '../types';
import { assertMonthlyAiBudget, recordAiUsage } from '../internal/ai-spend';
import { authorized } from '../internal/runtime';

/**
 * One way to call a model from the assistant, and no other.
 *
 * Three things happen here that must never be optional. The monthly workspace
 * ceiling is checked against durable usage before the call. The output is
 * validated against a Zod schema, so free text can never become structured
 * data. The real cost is recorded afterwards, in the same table billing already
 * reads, so the next call's ceiling check sees it.
 *
 * Untrusted material is passed as `untrustedSources`, which the gateway fences
 * with a per-call nonce. Nothing here concatenates a post body, a handle or a
 * profile description into instruction text.
 */

export interface AssistantAiCall {
  readonly promptId: string;
  readonly variables: AiCallRequest['variables'];
  readonly untrustedSources: readonly UntrustedSourceInput[];
}

export async function runAssistantTask<TOut>(
  deps: ServiceDeps,
  ctx: ActorContext,
  schema: z.ZodType<TOut>,
  call: AssistantAiCall,
): Promise<AiStructuredOutcome<TOut>> {
  await authorized(deps, ctx, 'content.read', undefined, async (db) => {
    await assertMonthlyAiBudget(deps, ctx, db);
  });

  const result = await deps.ai.completeStructured<TOut>(schema, {
    context: {
      workspaceId: ctx.workspaceId,
      projectId: null,
      locale: ctx.locale,
      contentLanguage: null,
      correlationId: ctx.correlationId,
    },
    promptId: call.promptId,
    variables: call.variables,
    untrustedSources: call.untrustedSources,
  });

  await recordAiUsage(deps, ctx, result.meta);
  return result;
}

/**
 * The label the view model carries.
 *
 * `label` is the literal string `suggestion` and the contract gives it no other
 * possible value, so no surface has a branch that could render this as fact.
 */
export function provenanceOf(meta: AiCallMeta): AssistantProvenance {
  return {
    label: 'suggestion',
    promptId: meta.promptId,
    promptVersion: meta.promptVersion,
    provider: meta.provider,
    model: meta.model,
    degraded: meta.degraded,
  };
}
