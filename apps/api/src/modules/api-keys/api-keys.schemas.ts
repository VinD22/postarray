import { approvalLevelSchema, scopeSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { projectIdSchema, connectionIdSchema, shortTextSchema } from '../../common/schemas';

/**
 * Workspace API keys.
 *
 * Expiry is required and capped at 365 days. There is no "never expires"
 * option, because a credential nobody ever has to look at again is a credential
 * nobody notices has leaked. The UI defaults to 90 days, and the workspace is
 * emailed at 90, 30 and 7 days before the date.
 *
 * Every optional field below narrows and none of them widens. A key created by
 * an owner does not inherit the owner's powers: it gets exactly the scopes
 * named here, intersected with what the creator actually holds.
 */

export const MAX_API_KEY_LIFETIME_DAYS = 365;
export const DEFAULT_API_KEY_LIFETIME_DAYS = 90;

export const createApiKeySchema = z
  .object({
    name: shortTextSchema,
    scopes: z.array(scopeSchema).min(1).max(32),
    /** Required. Maximum 365 days from now, enforced by the application layer. */
    expiresInDays: z
      .number()
      .int()
      .min(1)
      .max(MAX_API_KEY_LIFETIME_DAYS)
      .default(DEFAULT_API_KEY_LIFETIME_DAYS),
    approvalLevel: approvalLevelSchema.default('level_1_draft'),
    projectIds: z.array(projectIdSchema).max(200).default([]),
    connectionIds: z.array(connectionIdSchema).max(200).default([]),
    /** CIDR blocks the key may be used from. Empty means no source restriction. */
    ipAllowlist: z.array(z.string().trim().min(7).max(43)).max(20).default([]),
  })
  .strict();

export const listApiKeysQuerySchema = cursorQuerySchema;

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
