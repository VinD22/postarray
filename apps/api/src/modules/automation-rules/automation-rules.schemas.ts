import {
  ruleActionKindSchema,
  ruleConditionKindSchema,
  ruleTriggerKindSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination.js';
import { passthroughObjectSchema, ruleIdSchema, shortTextSchema } from '../../common/schemas.js';

/**
 * Automation Rule payloads.
 *
 * A rule is a trigger, a set of conditions and an ordered list of actions. The
 * kinds are fixed registries in `@relay/contracts`, not free strings, which is
 * what makes "this rule cannot do that" a parse failure rather than a runtime
 * surprise.
 *
 * The product refuses to build certain rules at all, regardless of plan: no
 * auto-like, no auto-follow, no automated DMs, no unsolicited automated
 * replies, no engagement pods, no coordinated multi-account amplification.
 * Those are policy, not preference, so the rule builder rejects them with an
 * explanation rather than dropping them silently.
 */

export const ruleTriggerSchema = z
  .object({ kind: ruleTriggerKindSchema, config: passthroughObjectSchema.default({}) })
  .strict();

export const ruleConditionSchema = z
  .object({ kind: ruleConditionKindSchema, config: passthroughObjectSchema.default({}) })
  .strict();

export const ruleActionSchema = z
  .object({ kind: ruleActionKindSchema, config: passthroughObjectSchema.default({}) })
  .strict();

export const createRuleSchema = z
  .object({
    name: shortTextSchema,
    description: z.string().trim().max(2000).optional(),
    trigger: ruleTriggerSchema,
    conditions: z.array(ruleConditionSchema).max(30).default([]),
    actions: z.array(ruleActionSchema).min(1).max(20),
    /** A rule is created disabled. Enabling it is a separate, audited act. */
    enabled: z.literal(false).optional(),
  })
  .strict();

export const updateRuleSchema = createRuleSchema.partial().strict();

export const testRunSchema = z.object({ sampleEvent: passthroughObjectSchema }).strict();

export const listRulesQuerySchema = cursorQuerySchema;

export const listRunsQuerySchema = cursorQuerySchema;

export const ruleParamsSchema = z.object({ id: ruleIdSchema }).strict();

export type CreateRuleInput = z.infer<typeof createRuleSchema>;
export type UpdateRuleInput = z.infer<typeof updateRuleSchema>;
