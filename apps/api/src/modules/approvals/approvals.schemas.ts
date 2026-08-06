import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { contentItemIdSchema, noteSchema, userIdSchema } from '../../common/schemas';

/**
 * Approval payloads.
 *
 * Requesting and deciding are separate scopes and separate routes on purpose:
 * an agent may ask, and it may not answer (`04-auth-oauth-and-security.md`,
 * section 10.2, rule 3). No actor may approve a draft it created unless the
 * workspace has explicitly enabled self-approval for that role, and that
 * decision is audited as such.
 */
export const requestApprovalSchema = z
  .object({
    contentItemId: contentItemIdSchema,
    /** Absent means route to the workspace's configured approvers. */
    approverIds: z.array(userIdSchema).max(50).optional(),
    note: noteSchema.optional(),
  })
  .strict();

export const decideApprovalSchema = z
  .object({
    decision: z.enum(['approve', 'request_changes', 'reject']),
    note: noteSchema.optional(),
  })
  .strict();

export const listPendingQuerySchema = cursorQuerySchema;

export type RequestApprovalInput = z.infer<typeof requestApprovalSchema>;
export type DecideApprovalInput = z.infer<typeof decideApprovalSchema>;
