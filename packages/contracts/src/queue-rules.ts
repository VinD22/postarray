import { z } from 'zod';

import { ianaTimeZoneSchema, isoDateSchema, isoInstantSchema } from './primitives';

/**
 * Queue rules and slot reservations.
 *
 * A queue rule describes when a project is willing to post: which local windows
 * in which zone, how far apart, how many times a day, and which dates are off
 * limits. A slot reservation is one proposed instant produced by one rule,
 * carrying a frozen copy of that rule.
 *
 * The frozen copy is the whole design. A rule is a live, editable object; a
 * reservation is evidence. Editing or deleting a rule tomorrow must never move
 * an instant a person already accepted, and the reservation must still be able
 * to say why that instant was chosen when someone asks six months later.
 *
 * Nothing here schedules anything. `proposeSlot` proposes and a human accepts.
 */

/** ISO 8601 weekday: 1 is Monday, 7 is Sunday. */
export const queueWeekdaySchema = z.number().int().min(1).max(7);
export type QueueWeekday = z.infer<typeof queueWeekdaySchema>;

export const MINUTES_PER_DAY = 24 * 60;

/**
 * One weekly availability window, expressed as local minutes past midnight in
 * the rule's zone. Both edges are inclusive: a window of 09:00 to 17:00 accepts
 * a proposal at exactly 09:00 and at exactly 17:00.
 */
export const queueWindowSchema = z
  .object({
    weekday: queueWeekdaySchema,
    startMinute: z
      .number()
      .int()
      .min(0)
      .max(MINUTES_PER_DAY - 1),
    endMinute: z
      .number()
      .int()
      .min(0)
      .max(MINUTES_PER_DAY - 1),
  })
  .strict()
  .refine((window) => window.startMinute <= window.endMinute, { error: 'WINDOW_INVERTED' });
export type QueueWindow = z.infer<typeof queueWindowSchema>;

/** A blackout is a span of local calendar dates in the rule's zone, inclusive. */
export const queueBlackoutSchema = z
  .object({ from: isoDateSchema, to: isoDateSchema, note: z.string().max(200).optional() })
  .strict()
  .refine((span) => span.from <= span.to, { error: 'BLACKOUT_INVERTED' });
export type QueueBlackout = z.infer<typeof queueBlackoutSchema>;

/**
 * `maximumPerDay` is deliberately nullable rather than zero-defaulted. `null`
 * means the rule sets no daily ceiling. `0` means this rule will never propose
 * anything, which is a real and useful thing for a person to say. Treating 0 as
 * unlimited would silently invert the operator's intent, so nothing in this
 * package may do it.
 */
export const queueRuleDefinitionSchema = z
  .object({
    name: z.string().min(1).max(120),
    ianaTimeZone: ianaTimeZoneSchema,
    windows: z.array(queueWindowSchema).max(200),
    minimumGapMinutes: z
      .number()
      .int()
      .min(0)
      .max(MINUTES_PER_DAY * 30),
    maximumPerDay: z.number().int().min(0).max(500).nullable(),
    blackouts: z.array(queueBlackoutSchema).max(200).default([]),
    /** Empty means every connection in the project. */
    connectionIds: z.array(z.string()).max(200).default([]),
    /** Higher runs first. Ties break on the earlier instant, then on name. */
    priority: z.number().int().min(0).max(1000).default(0),
    enabled: z.boolean().default(true),
  })
  .strict();
export type QueueRuleDefinition = z.infer<typeof queueRuleDefinitionSchema>;

export const queueRuleInputSchema = queueRuleDefinitionSchema
  .extend({ projectId: z.string().min(1) })
  .strict();
export type QueueRuleInput = z.infer<typeof queueRuleInputSchema>;

export const queueRulePatchSchema = queueRuleDefinitionSchema.partial().strict();
export type QueueRulePatch = z.infer<typeof queueRulePatchSchema>;

export const queueRuleSchema = queueRuleDefinitionSchema
  .extend({
    id: z.string().min(1),
    workspaceId: z.string().min(1),
    projectId: z.string().min(1),
    archived: z.boolean(),
    createdByUserId: z.string().nullable(),
    createdAt: isoInstantSchema,
    updatedAt: isoInstantSchema,
  })
  .strict();
export type QueueRuleView = z.infer<typeof queueRuleSchema>;

/**
 * Why a slot was chosen, as ICU keys plus their arguments. Never English: this
 * travels through the API to a browser that may be running any locale, and it
 * is also read back out of a reservation years later.
 */
export const slotReasonSchema = z
  .object({
    key: z.string().min(1),
    values: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  })
  .strict();
export type SlotReason = z.infer<typeof slotReasonSchema>;

export const SLOT_REASON_KEYS = {
  noRulesConfigured: 'queue.reason.noRulesConfigured',
  fallbackFirstFreeHour: 'queue.reason.fallbackFirstFreeHour',
  matchedRule: 'queue.reason.matchedRule',
  matchedWindow: 'queue.reason.matchedWindow',
  minimumGap: 'queue.reason.minimumGap',
  noMinimumGap: 'queue.reason.noMinimumGap',
  dailyCap: 'queue.reason.dailyCap',
  dailyCapUnlimited: 'queue.reason.dailyCapUnlimited',
  blackoutSkipped: 'queue.reason.blackoutSkipped',
  dstNonexistentSkipped: 'queue.reason.dstNonexistentSkipped',
  dstAmbiguousFirst: 'queue.reason.dstAmbiguousFirst',
  priorityChosen: 'queue.reason.priorityChosen',
  connectionScoped: 'queue.reason.connectionScoped',
  horizonExhausted: 'queue.reason.horizonExhausted',
} as const;
export type SlotReasonKey = (typeof SLOT_REASON_KEYS)[keyof typeof SLOT_REASON_KEYS];

export const slotProposalSchema = z
  .object({
    instant: isoInstantSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    /** The wall clock the person will actually see, in the rule's zone. */
    localDateTime: z.string().min(1),
    /** Null when no rule applied and the labelled fallback produced the slot. */
    queueRuleId: z.string().nullable(),
    reasons: z.array(slotReasonSchema),
  })
  .strict();
export type SlotProposal = z.infer<typeof slotProposalSchema>;

export const QUEUE_RESERVATION_STATES = ['proposed', 'accepted', 'released', 'expired'] as const;
export const queueReservationStateSchema = z.enum(QUEUE_RESERVATION_STATES);
export type QueueReservationState = z.infer<typeof queueReservationStateSchema>;

/**
 * The frozen rule. Stored as JSON on the reservation and never re-read from the
 * live rule row, so a later edit or delete cannot move or invalidate the slot.
 */
export const queueRuleSnapshotSchema = queueRuleDefinitionSchema
  .extend({
    /**
     * Empty when the labelled fallback produced the slot and no rule existed.
     * A live rule always has a name; a snapshot has to be able to say there
     * was not one, rather than inventing a placeholder that reads like one.
     */
    name: z.string().max(120),
    queueRuleId: z.string().nullable(),
    capturedAt: isoInstantSchema,
    reasons: z.array(slotReasonSchema),
  })
  .strict();
export type QueueRuleSnapshot = z.infer<typeof queueRuleSnapshotSchema>;

export const queueSlotReservationSchema = z
  .object({
    id: z.string().min(1),
    workspaceId: z.string().min(1),
    projectId: z.string().min(1),
    state: queueReservationStateSchema,
    instant: isoInstantSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    localDateTime: z.string().min(1),
    ruleSnapshot: queueRuleSnapshotSchema,
    contentItemId: z.string().nullable(),
    publishJobId: z.string().nullable(),
    expiresAt: isoInstantSchema.nullable(),
    createdByUserId: z.string().nullable(),
    createdAt: isoInstantSchema,
    updatedAt: isoInstantSchema,
  })
  .strict();
export type QueueSlotReservationView = z.infer<typeof queueSlotReservationSchema>;

/** How long an unaccepted proposal holds its instant before it lapses. */
export const QUEUE_PROPOSAL_TTL_SECONDS = 30 * 60;

/** How far ahead the slot finder is willing to look before giving up. */
export const QUEUE_SEARCH_HORIZON_DAYS = 60;

/**
 * With no minimum gap configured a rule still needs a candidate granularity.
 * Hourly, measured from the window start, matches what the calendar draws.
 */
export const QUEUE_DEFAULT_STEP_MINUTES = 60;

/** True when the rule places no ceiling on a day. Never true for zero. */
export function isUnlimitedPerDay(maximumPerDay: number | null): boolean {
  return maximumPerDay === null;
}
