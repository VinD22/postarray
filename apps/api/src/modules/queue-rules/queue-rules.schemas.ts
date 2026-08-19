import {
  ID_PREFIXES,
  idSchema,
  isoInstantSchema,
  queueRuleInputSchema,
  queueRulePatchSchema,
  queueRuleSchema,
  queueSlotReservationSchema,
  slotProposalSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { projectIdSchema, contentItemIdSchema } from '../../common/schemas';

/**
 * Queue rule payloads.
 *
 * The rule body is the contract schema unchanged. Restating it here would let
 * the edge and the application drift on the one field where drift is most
 * expensive: `maximumPerDay`, where `null` is no ceiling and `0` is zero.
 */

export const queueRuleIdSchema = idSchema(ID_PREFIXES.queueRule);
export const queueSlotIdSchema = idSchema(ID_PREFIXES.queueSlotReservation);

/**
 * The contract body, with the project identifier narrowed to its prefix so a
 * malformed id is a 422 at the edge rather than a lookup that finds nothing.
 */
export const createQueueRuleSchema = queueRuleInputSchema.extend({ projectId: projectIdSchema });
export const updateQueueRuleSchema = queueRulePatchSchema;

export const listQueueRulesQuerySchema = cursorQueryWith({
  projectId: projectIdSchema.optional(),
});

export const nextQueueSlotQuerySchema = z
  .object({ projectId: projectIdSchema, after: isoInstantSchema.optional() })
  .strict();

export const proposeQueueSlotSchema = z
  .object({
    projectId: projectIdSchema,
    after: isoInstantSchema.optional(),
    /** Attaching the draft up front is optional; accepting it is not. */
    contentItemId: contentItemIdSchema.optional(),
  })
  .strict();

export const acceptQueueSlotSchema = z.object({ contentItemId: contentItemIdSchema }).strict();

export const releaseQueueSlotSchema = z
  .object({ reason: z.string().min(1).max(280).optional() })
  .strict();

export const listQueueSlotsQuerySchema = cursorQueryWith({ projectId: projectIdSchema });

export { queueRuleSchema, queueSlotReservationSchema, slotProposalSchema };

export type CreateQueueRuleInput = z.infer<typeof createQueueRuleSchema>;
export type UpdateQueueRuleInput = z.infer<typeof updateQueueRuleSchema>;
export type ListQueueRulesQuery = z.infer<typeof listQueueRulesQuerySchema>;
export type NextQueueSlotQuery = z.infer<typeof nextQueueSlotQuerySchema>;
export type ProposeQueueSlotInput = z.infer<typeof proposeQueueSlotSchema>;
export type ListQueueSlotsQuery = z.infer<typeof listQueueSlotsQuerySchema>;
