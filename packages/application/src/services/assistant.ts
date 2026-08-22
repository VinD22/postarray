import {
  ASSISTANT_TOOL_NAMES,
  assistantTool,
  checkPlatformFitInputSchema,
  planWeekInputSchema,
  suggestCaptionInputSchema,
  summarizeCapabilities,
  type AssistantToolName,
  type AssistantTurnRequest,
  type AssistantTurnResponse,
  type CheckPlatformFitOutput,
  type PlanWeekOutput,
  type SuggestCaptionOutput,
} from '@relay/contracts';

import type { ActorContext, AssistantService, ServiceDeps } from '../types';
import { invalid, notFound } from '../internal/errors';
import { provenanceOf, runAssistantTask } from './assistant-ai';
import { createAssistantActions } from './assistant-do';
import { createAssistantReports } from './assistant-report';
import {
  connectedProviders,
  gatherPlanContext,
  postBodySource,
  slotLocalTime,
  slotReasonKeys,
} from './assistant-grounding';
import { assertProjectOwned } from './assistant-actions';
import {
  captionOptionsOutputSchema,
  platformFitOutputSchema,
  routeOutputSchema,
  weekPlanOutputSchema,
} from './assistant-output';
import type { AssistantDelegates } from './assistant-types';

/**
 * The assistant.
 *
 * Someone the user can talk to. It plans, it suggests, it reports, and it can
 * do a small, named set of things on their behalf. Four rules hold across all
 * of it:
 *
 *  - it owns no domain logic. Every answer is assembled from services that
 *    already exist, in the caller's own tenancy and under the caller's own
 *    permissions.
 *  - nothing it produces is presented as fact. The view model carries
 *    `label: 'suggestion'` and the contract admits no other value.
 *  - it writes nothing without a durable human confirmation. See
 *    `./assistant-actions.ts`.
 *  - it generates no images and no video. There is no tool, no input field and
 *    no output field for one.
 */

const TURN_MESSAGE_KEYS: Readonly<Record<AssistantToolName, string>> = {
  plan_week: 'assistant.turn.plan_week',
  suggest_caption: 'assistant.turn.suggest_caption',
  check_platform_fit: 'assistant.turn.check_platform_fit',
  report_week: 'assistant.turn.report_week',
  report_failures: 'assistant.turn.report_failures',
  draft_post: 'assistant.turn.draft_post',
  adapt_draft_text: 'assistant.turn.adapt_draft_text',
  schedule_post: 'assistant.turn.schedule_post',
  request_approval: 'assistant.turn.request_approval',
};

export function createAssistantService(
  deps: ServiceDeps,
  delegates: AssistantDelegates,
): AssistantService {
  const actions = createAssistantActions(deps, delegates);
  const reports = createAssistantReports(deps, delegates);

  async function plan(ctx: ActorContext, rawInput: unknown): Promise<PlanWeekOutput> {
    const input = planWeekInputSchema.parse(rawInput);
    await assertProjectOwned(deps, ctx, input.projectId);
    const context = await gatherPlanContext(deps, ctx, delegates, input.projectId);
    if (context.profile === null) {
      throw invalid('assistant.error.profile_required', { projectId: input.projectId });
    }

    const result = await runAssistantTask(deps, ctx, weekPlanOutputSchema, {
      promptId: 'assistant-week-plan',
      variables: {
        postCount: input.postCount,
        businessProfile: 'business_profile',
        connectedProviders: connectedProviders(context),
        contentLocale: context.profile.contentLocales[0] ?? ctx.locale,
        prohibitedClaims: context.profile.prohibitedClaims,
      },
      untrustedSources: context.sources,
    });

    const localTime = slotLocalTime(context.slot);
    const reasonKeys = slotReasonKeys(context.slot);
    return {
      projectId: input.projectId,
      weekStartDate: input.weekStartDate,
      posts: result.output.posts.map((post) => ({
        dayOffset: post.dayOffset,
        localTime,
        slotReasonKeys: [...reasonKeys],
        angle: post.angle,
        body: post.body,
        suggestedProviders: post.suggestedProviders,
      })),
      groundingNotes: result.output.groundingNotes,
      provenance: provenanceOf(result.meta),
    };
  }

  async function suggestCaption(
    ctx: ActorContext,
    rawInput: unknown,
  ): Promise<SuggestCaptionOutput> {
    const input = suggestCaptionInputSchema.parse(rawInput);
    await assertProjectOwned(deps, ctx, input.projectId);
    const item = await delegates.content.get(ctx, input.contentItemId);
    if (item.projectId !== input.projectId) {
      throw notFound('content_item', input.contentItemId);
    }

    const result = await runAssistantTask(deps, ctx, captionOptionsOutputSchema, {
      promptId: 'hook-options',
      variables: {
        body: 'draft_body',
        audience: input.tone ?? 'the project audience',
        provider: item.variants[0]?.provider ?? 'x',
      },
      untrustedSources: [postBodySource(item.id, item.body, deps.clock.now().toISOString())],
    });

    return {
      contentItemId: item.id,
      options: result.output.options.slice(0, 5).map((option) => ({
        body: option.hook,
        rationale: option.angle,
      })),
      provenance: provenanceOf(result.meta),
    };
  }

  async function checkPlatformFit(
    ctx: ActorContext,
    rawInput: unknown,
  ): Promise<CheckPlatformFitOutput> {
    const input = checkPlatformFitInputSchema.parse(rawInput);
    await assertProjectOwned(deps, ctx, input.projectId);
    const [item, snapshot] = await Promise.all([
      delegates.content.get(ctx, input.contentItemId),
      // The live per-connection snapshot is the composer's source of truth for
      // what this account may do right now. Never a static table, never a limit
      // a model remembered.
      delegates.connections.getCapabilities(ctx, input.connectionId),
    ]);
    if (item.projectId !== input.projectId) {
      throw notFound('content_item', input.contentItemId);
    }
    const summary = summarizeCapabilities(snapshot);

    const result = await runAssistantTask(deps, ctx, platformFitOutputSchema, {
      promptId: 'platform-fit-check',
      variables: {
        body: 'draft_body',
        provider: snapshot.provider,
        capabilitySummary: JSON.stringify({
          maxTextLength: summary.maxTextLength,
          supportsMarkdown: summary.supportsMarkdown,
          maxImages: summary.maxImages,
          threads: summary.threads,
          firstComment: summary.firstComment,
        }),
        contentKind: item.contentKind,
      },
      untrustedSources: [postBodySource(item.id, item.body, deps.clock.now().toISOString())],
    });

    return {
      contentItemId: item.id,
      connectionId: snapshot.connectionId,
      provider: snapshot.provider,
      capabilityVersion: snapshot.capabilityVersion,
      maxTextLength: summary.maxTextLength,
      bodyLength: [...item.body].length,
      withinTextLimit: [...item.body].length <= summary.maxTextLength,
      warnings: result.output.issues.map((issue) => ({
        code: issue.code,
        severity: issue.severity,
        explanation: issue.explanation,
        suggestion: issue.suggestion,
      })),
      provenance: provenanceOf(result.meta),
    };
  }

  async function turn(
    ctx: ActorContext,
    request: AssistantTurnRequest,
  ): Promise<AssistantTurnResponse> {
    await assertProjectOwned(deps, ctx, request.projectId);
    const routed = await runAssistantTask(deps, ctx, routeOutputSchema, {
      promptId: 'assistant-route',
      variables: {
        message: 'request_message',
        availableTools: [...ASSISTANT_TOOL_NAMES],
        locale: ctx.locale,
      },
      untrustedSources: [
        {
          id: 'request_message',
          origin: 'user_note',
          label: 'What the person asked for',
          text: request.message,
          retrievedAt: deps.clock.now().toISOString(),
        },
      ],
    });

    const descriptor = assistantTool(routed.output.tool);
    // Routing chooses a tool and nothing else. Every argument below comes from
    // the person's own request, never from the model, so a prompt injection can
    // at worst pick the wrong read tool.
    return {
      tool: descriptor.name,
      capability: descriptor.capability,
      risk: descriptor.risk,
      label: 'suggestion',
      messageKey: TURN_MESSAGE_KEYS[descriptor.name],
      data: descriptor.mutating
        ? { requiresConfirmation: true, missingInformation: routed.output.missingInformation }
        : { missingInformation: routed.output.missingInformation },
      provenance: provenanceOf(routed.meta),
    };
  }

  return {
    plan,
    suggestCaption,
    checkPlatformFit,
    reportWeek: reports.reportWeek,
    reportFailures: reports.reportFailures,
    turn,
    draftPost: actions.draftPost,
    adaptDraftText: actions.adaptDraftText,
    schedulePost: actions.schedulePost,
    requestApproval: actions.requestApproval,
  };
}
