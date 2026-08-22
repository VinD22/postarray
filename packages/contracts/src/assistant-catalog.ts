import { z } from 'zod';

import { isoInstantSchema } from './primitives';
import { providerIdSchema } from './enums';
import {
  ASSISTANT_TOOL_INPUT_SCHEMAS,
  ASSISTANT_TOOL_NAMES,
  assistantToolNameSchema,
  checkPlatformFitOutputSchema,
  planWeekOutputSchema,
  suggestCaptionOutputSchema,
  type AssistantCapability,
  type AssistantToolName,
  type AssistantToolRisk,
} from './assistant';

/** Report outputs. Read-only projections of services that already exist. */

export const weekReportEntrySchema = z
  .object({
    contentItemId: z.string().min(1),
    jobId: z.string().min(1).nullable(),
    title: z.string().nullable(),
    provider: providerIdSchema.nullable(),
    accountLabel: z.string().nullable(),
    instant: isoInstantSchema,
    ianaTimeZone: z.string().min(1),
    state: z.string().min(1),
    approvalState: z.string().min(1),
  })
  .strict();

export const reportWeekOutputSchema = z
  .object({
    projectId: z.string().min(1),
    from: isoInstantSchema,
    to: isoInstantSchema,
    entries: z.array(weekReportEntrySchema).max(200),
    /** Absent counts are null. Missing data is `unavailable`, never `0`. */
    totalScheduled: z.number().int().nonnegative().nullable(),
    hasMore: z.boolean(),
  })
  .strict();
export type ReportWeekOutput = z.infer<typeof reportWeekOutputSchema>;

export const failureReportEntrySchema = z
  .object({
    source: z.enum(['receipt', 'action_center']),
    id: z.string().min(1),
    contentItemId: z.string().min(1).nullable(),
    provider: providerIdSchema.nullable(),
    /** An i18n key or a stable kind. Never provider prose. */
    reasonKey: z.string().min(1),
    occurredAt: isoInstantSchema,
    href: z.string().min(1).nullable(),
  })
  .strict();

export const reportFailuresOutputSchema = z
  .object({
    projectId: z.string().min(1),
    entries: z.array(failureReportEntrySchema).max(100),
    hasMore: z.boolean(),
  })
  .strict();
export type ReportFailuresOutput = z.infer<typeof reportFailuresOutputSchema>;

/* ------------------------------------------------------------------------- */
/* Mutating actions                                                           */
/* ------------------------------------------------------------------------- */

/**
 * The result of asking the assistant to do something that changes state.
 *
 * `awaiting_confirmation` is the only state a mutating tool can return on a
 * first call: the durable confirmation row exists, nothing has been written,
 * and a person has to approve it in Relay before a second call can execute it.
 * `proposal_only` is the honest answer for an action the durable confirmation
 * mechanism cannot yet fingerprint, and it means literally nothing happened.
 */
export const ASSISTANT_ACTION_STATES = [
  'awaiting_confirmation',
  'proposal_only',
  'applied',
] as const;
export const assistantActionStateSchema = z.enum(ASSISTANT_ACTION_STATES);
export type AssistantActionState = z.infer<typeof assistantActionStateSchema>;

export const assistantActionOutputSchema = z
  .object({
    tool: assistantToolNameSchema,
    state: assistantActionStateSchema,
    /** Present whenever `state` is `awaiting_confirmation`. */
    confirmationId: z.string().min(1).nullable(),
    confirmUrl: z.string().min(1).nullable(),
    /** What will be written, exactly, once a human confirms. */
    proposal: z.record(z.string(), z.unknown()),
    /** Set only once the confirmation was consumed and the write happened. */
    resultId: z.string().min(1).nullable(),
    /** Why nothing happened, when nothing happened. An i18n key. */
    blockedReasonKey: z.string().min(1).nullable(),
  })
  .strict();
export type AssistantActionOutput = z.infer<typeof assistantActionOutputSchema>;

export const ASSISTANT_TOOL_OUTPUT_SCHEMAS = {
  plan_week: planWeekOutputSchema,
  suggest_caption: suggestCaptionOutputSchema,
  check_platform_fit: checkPlatformFitOutputSchema,
  report_week: reportWeekOutputSchema,
  report_failures: reportFailuresOutputSchema,
  draft_post: assistantActionOutputSchema,
  adapt_draft_text: assistantActionOutputSchema,
  schedule_post: assistantActionOutputSchema,
  request_approval: assistantActionOutputSchema,
} as const satisfies Record<AssistantToolName, z.ZodType>;

/* ------------------------------------------------------------------------- */
/* Descriptors                                                                */
/* ------------------------------------------------------------------------- */

export interface AssistantToolDescriptor {
  readonly name: AssistantToolName;
  readonly capability: AssistantCapability;
  readonly risk: AssistantToolRisk;
  readonly mutating: boolean;
  readonly requiresHumanConfirmation: boolean;
  /** The tool in `apps/mcp`'s registry this one is, or null with a reason. */
  readonly mcpTool: string | null;
  /** Why there is no external equivalent. Empty when `mcpTool` is set. */
  readonly mcpAbsenceReason: string;
  /** The existing application service method this delegates to. */
  readonly delegatesTo: string;
  readonly summaryKey: string;
}

export const ASSISTANT_TOOLS: readonly AssistantToolDescriptor[] = Object.freeze([
  {
    name: 'plan_week',
    capability: 'plan',
    risk: 'read',
    mutating: false,
    requiresHumanConfirmation: false,
    mcpTool: null,
    mcpAbsenceReason:
      'The external catalog exposes generate_growth_plan, which persists a plan. This is its read-only sibling: it returns a proposal and writes nothing.',
    delegatesTo: 'growth.getBusinessProfile + connections.list + queueRules.previewSlot',
    summaryKey: 'assistant.tool.plan_week',
  },
  {
    name: 'suggest_caption',
    capability: 'suggest',
    risk: 'read',
    mutating: false,
    requiresHumanConfirmation: false,
    mcpTool: null,
    mcpAbsenceReason:
      'Composer-side assistance. An external agent edits text by calling draft_post with the text it wants.',
    delegatesTo: 'content.get',
    summaryKey: 'assistant.tool.suggest_caption',
  },
  {
    name: 'check_platform_fit',
    capability: 'suggest',
    risk: 'read',
    mutating: false,
    requiresHumanConfirmation: false,
    mcpTool: 'validate_post',
    mcpAbsenceReason: '',
    delegatesTo: 'connections.getCapabilities + content.get',
    summaryKey: 'assistant.tool.check_platform_fit',
  },
  {
    name: 'report_week',
    capability: 'report',
    risk: 'read',
    mutating: false,
    requiresHumanConfirmation: false,
    mcpTool: 'get_calendar',
    mcpAbsenceReason: '',
    delegatesTo: 'scheduling.getCalendar',
    summaryKey: 'assistant.tool.report_week',
  },
  {
    name: 'report_failures',
    capability: 'report',
    risk: 'read',
    mutating: false,
    requiresHumanConfirmation: false,
    mcpTool: null,
    mcpAbsenceReason:
      'Joins receipts and the action center into one answer. The external catalog exposes get_post_status per post instead.',
    delegatesTo: 'receipts.listRecent + actionCenter.list',
    summaryKey: 'assistant.tool.report_failures',
  },
  {
    name: 'draft_post',
    capability: 'do',
    risk: 'reversible',
    mutating: true,
    requiresHumanConfirmation: true,
    mcpTool: 'draft_post',
    mcpAbsenceReason: '',
    delegatesTo: 'content.createDraft',
    summaryKey: 'assistant.tool.draft_post',
  },
  {
    name: 'adapt_draft_text',
    capability: 'do',
    risk: 'reversible',
    mutating: true,
    requiresHumanConfirmation: true,
    mcpTool: null,
    mcpAbsenceReason:
      'Per-variant override. The external catalog has no tool that edits one target of an existing item.',
    delegatesTo: 'content.overrideVariant',
    summaryKey: 'assistant.tool.adapt_draft_text',
  },
  {
    name: 'schedule_post',
    capability: 'do',
    risk: 'consequential',
    mutating: true,
    requiresHumanConfirmation: true,
    mcpTool: 'schedule_post',
    mcpAbsenceReason: '',
    delegatesTo: 'queueRules.proposeSlot + scheduling.schedule',
    summaryKey: 'assistant.tool.schedule_post',
  },
  {
    name: 'request_approval',
    capability: 'do',
    risk: 'reversible',
    mutating: true,
    requiresHumanConfirmation: true,
    mcpTool: 'request_approval',
    mcpAbsenceReason: '',
    delegatesTo: 'approvals.request',
    summaryKey: 'assistant.tool.request_approval',
  },
] as const satisfies readonly AssistantToolDescriptor[]);

const BY_NAME: ReadonlyMap<AssistantToolName, AssistantToolDescriptor> = new Map(
  ASSISTANT_TOOLS.map((tool) => [tool.name, tool] as const),
);

export function assistantTool(name: AssistantToolName): AssistantToolDescriptor {
  const tool = BY_NAME.get(name);
  if (tool === undefined) {
    throw new RangeError('UNKNOWN_ASSISTANT_TOOL');
  }
  return tool;
}

export function assistantToolsFor(
  capability: AssistantCapability,
): readonly AssistantToolDescriptor[] {
  return ASSISTANT_TOOLS.filter((tool) => tool.capability === capability);
}

/** Every mutating tool must be confirmation gated. Asserted, not assumed. */
export function assistantToolContractProblems(): readonly string[] {
  const problems: string[] = [];
  for (const name of ASSISTANT_TOOL_NAMES) {
    const tool = assistantTool(name);
    if (tool.mutating !== tool.requiresHumanConfirmation) {
      problems.push(`${name}:MUTATION_WITHOUT_CONFIRMATION`);
    }
    if (tool.mcpTool === null && tool.mcpAbsenceReason.trim().length === 0) {
      problems.push(`${name}:UNEXPLAINED_ABSENCE`);
    }
    if (!Object.hasOwn(ASSISTANT_TOOL_INPUT_SCHEMAS, name)) {
      problems.push(`${name}:NO_INPUT_SCHEMA`);
    }
    if (!Object.hasOwn(ASSISTANT_TOOL_OUTPUT_SCHEMAS, name)) {
      problems.push(`${name}:NO_OUTPUT_SCHEMA`);
    }
  }
  return problems;
}
