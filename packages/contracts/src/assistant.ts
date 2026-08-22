import { z } from 'zod';

import { isoInstantSchema } from './primitives';
import { providerIdSchema } from './enums';

/**
 * The assistant tool contract.
 *
 * The in-app assistant and an external MCP agent must behave identically, so
 * there is exactly one catalog and this is the documented subset of it. Every
 * descriptor that has an equivalent in the remote MCP server names it in
 * `mcpTool`, and `apps/mcp/src/tools/assistant-parity.test.ts` fails if that
 * name, its risk or its confirmation requirement ever disagree with the
 * registry in `apps/mcp/src/tools`. A tool with `mcpTool: null` is one the
 * external catalog deliberately does not expose, and the comment on it says
 * why. There is no parallel catalog and no tool here that an agent could reach
 * on a looser gate than a person can.
 *
 * Nothing in this file generates an image or a video, and there is no
 * descriptor, input field or output field for one.
 */

export const ASSISTANT_CAPABILITIES = ['plan', 'do', 'suggest', 'report'] as const;
export const assistantCapabilitySchema = z.enum(ASSISTANT_CAPABILITIES);
export type AssistantCapability = z.infer<typeof assistantCapabilitySchema>;

/** Same vocabulary as the MCP registry's `ToolRisk`. Kept in step by test. */
export const ASSISTANT_TOOL_RISKS = ['read', 'reversible', 'consequential'] as const;
export const assistantToolRiskSchema = z.enum(ASSISTANT_TOOL_RISKS);
export type AssistantToolRisk = z.infer<typeof assistantToolRiskSchema>;

export const ASSISTANT_TOOL_NAMES = [
  'plan_week',
  'suggest_caption',
  'check_platform_fit',
  'report_week',
  'report_failures',
  'draft_post',
  'adapt_draft_text',
  'schedule_post',
  'request_approval',
] as const;
export const assistantToolNameSchema = z.enum(ASSISTANT_TOOL_NAMES);
export type AssistantToolName = z.infer<typeof assistantToolNameSchema>;

/* ------------------------------------------------------------------------- */
/* Tool inputs                                                                */
/* ------------------------------------------------------------------------- */

const projectId = z.string().min(1).max(64);
const contentItemId = z.string().min(1).max(64);

export const planWeekInputSchema = z
  .object({
    projectId,
    /** Local date the week starts on. The project's zone decides the instant. */
    weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    postCount: z.number().int().min(1).max(14).default(5),
  })
  .strict();
export type PlanWeekInput = z.infer<typeof planWeekInputSchema>;

export const suggestCaptionInputSchema = z
  .object({ projectId, contentItemId, tone: z.string().min(1).max(40).optional() })
  .strict();
export type SuggestCaptionInput = z.infer<typeof suggestCaptionInputSchema>;

export const checkPlatformFitInputSchema = z
  .object({ projectId, contentItemId, connectionId: z.string().min(1).max(64) })
  .strict();
export type CheckPlatformFitInput = z.infer<typeof checkPlatformFitInputSchema>;

export const reportWeekInputSchema = z
  .object({ projectId, from: isoInstantSchema, to: isoInstantSchema })
  .strict();
export type ReportWeekInput = z.infer<typeof reportWeekInputSchema>;

export const reportFailuresInputSchema = z.object({ projectId }).strict();
export type ReportFailuresInput = z.infer<typeof reportFailuresInputSchema>;

export const draftPostInputSchema = z
  .object({
    projectId,
    title: z.string().min(1).max(200).nullable().default(null),
    body: z.string().min(1).max(20_000),
  })
  .strict();
export type DraftPostInput = z.infer<typeof draftPostInputSchema>;

export const adaptDraftTextInputSchema = z
  .object({
    projectId,
    contentItemId,
    /** The variant target being rewritten. Never a provider name alone. */
    targetId: z.string().min(1).max(64),
    body: z.string().min(1).max(20_000),
  })
  .strict();
export type AdaptDraftTextInput = z.infer<typeof adaptDraftTextInputSchema>;

export const schedulePostInputSchema = z
  .object({ projectId, contentItemId, after: isoInstantSchema.optional() })
  .strict();
export type SchedulePostInput = z.infer<typeof schedulePostInputSchema>;

export const requestApprovalInputSchema = z
  .object({ projectId, contentItemId, note: z.string().max(2000).optional() })
  .strict();
export type RequestApprovalInput = z.infer<typeof requestApprovalInputSchema>;

export const ASSISTANT_TOOL_INPUT_SCHEMAS = {
  plan_week: planWeekInputSchema,
  suggest_caption: suggestCaptionInputSchema,
  check_platform_fit: checkPlatformFitInputSchema,
  report_week: reportWeekInputSchema,
  report_failures: reportFailuresInputSchema,
  draft_post: draftPostInputSchema,
  adapt_draft_text: adaptDraftTextInputSchema,
  schedule_post: schedulePostInputSchema,
  request_approval: requestApprovalInputSchema,
} as const satisfies Record<AssistantToolName, z.ZodType>;

/* ------------------------------------------------------------------------- */
/* Tool outputs                                                               */
/* ------------------------------------------------------------------------- */

/**
 * Where an answer came from. Present on everything a model touched, so the UI
 * can never present a suggestion as a fact: `label` is the literal
 * `"suggestion"` and there is no other value it can take.
 */
export const assistantProvenanceSchema = z
  .object({
    label: z.literal('suggestion'),
    promptId: z.string().min(1),
    promptVersion: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    /** True when the answer is a truthful fallback rather than a model answer. */
    degraded: z.boolean(),
  })
  .strict();
export type AssistantProvenance = z.infer<typeof assistantProvenanceSchema>;

export const plannedPostSchema = z
  .object({
    dayOffset: z.number().int().min(0).max(6),
    localTime: z.string().regex(/^\d{2}:\d{2}$/),
    /** Why this time, in reason keys from the queue rules. Never prose. */
    slotReasonKeys: z.array(z.string().min(1)).max(10),
    angle: z.string().min(1).max(300),
    body: z.string().min(1).max(4000),
    suggestedProviders: z.array(providerIdSchema).max(12),
  })
  .strict();
export type PlannedPost = z.infer<typeof plannedPostSchema>;

export const planWeekOutputSchema = z
  .object({
    projectId,
    weekStartDate: z.string(),
    posts: z.array(plannedPostSchema).max(14),
    groundingNotes: z.array(z.string().max(400)).max(20),
    provenance: assistantProvenanceSchema,
  })
  .strict();
export type PlanWeekOutput = z.infer<typeof planWeekOutputSchema>;

export const captionSuggestionSchema = z
  .object({ body: z.string().min(1).max(4000), rationale: z.string().max(600) })
  .strict();

export const suggestCaptionOutputSchema = z
  .object({
    contentItemId,
    options: z.array(captionSuggestionSchema).max(5),
    provenance: assistantProvenanceSchema,
  })
  .strict();
export type SuggestCaptionOutput = z.infer<typeof suggestCaptionOutputSchema>;

export const platformFitWarningSchema = z
  .object({
    code: z.string().min(1).max(80),
    severity: z.enum(['error', 'warning', 'info']),
    explanation: z.string().max(600),
    suggestion: z.string().max(600).nullable(),
  })
  .strict();

export const checkPlatformFitOutputSchema = z
  .object({
    contentItemId,
    connectionId: z.string().min(1),
    provider: providerIdSchema,
    /** Read from the live per-connection snapshot, never from a static table. */
    capabilityVersion: z.string().min(1),
    maxTextLength: z.number().int().positive(),
    bodyLength: z.number().int().nonnegative(),
    withinTextLimit: z.boolean(),
    warnings: z.array(platformFitWarningSchema).max(20),
    provenance: assistantProvenanceSchema,
  })
  .strict();
export type CheckPlatformFitOutput = z.infer<typeof checkPlatformFitOutputSchema>;

/* ------------------------------------------------------------------------- */
/* The conversational turn                                                    */
/* ------------------------------------------------------------------------- */

export const assistantTurnRequestSchema = z
  .object({
    projectId: z.string().min(1).max(64),
    /** What the person typed. Untrusted, fenced before it reaches a prompt. */
    message: z.string().min(1).max(4000),
    /** Second call for a mutating tool, carrying the human's approval. */
    confirmationId: z.string().min(1).max(64).optional(),
  })
  .strict();
export type AssistantTurnRequest = z.infer<typeof assistantTurnRequestSchema>;

export const assistantTurnResponseSchema = z
  .object({
    tool: assistantToolNameSchema,
    capability: assistantCapabilitySchema,
    risk: assistantToolRiskSchema,
    /** Never `fact`. The UI has no branch that renders this as truth. */
    label: z.literal('suggestion'),
    /** i18n key the surface renders as the assistant's sentence. */
    messageKey: z.string().min(1),
    data: z.unknown(),
    provenance: assistantProvenanceSchema.nullable(),
  })
  .strict();
export type AssistantTurnResponse = z.infer<typeof assistantTurnResponseSchema>;
