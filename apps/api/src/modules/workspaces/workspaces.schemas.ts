import { ianaTimeZoneSchema, localeSchema, roleSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { noteSchema, shortTextSchema } from '../../common/schemas';

/**
 * Workspace, membership and invitation payloads.
 *
 * A workspace always carries its own IANA time zone and default locale. Both
 * are stored, never inferred from the browser: a schedule computed in the
 * viewer's zone is the single most common way a publishing product posts at the
 * wrong hour.
 */

export const createWorkspaceSchema = z
  .object({
    name: shortTextSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    defaultLocale: localeSchema,
  })
  .strict();

export const updateWorkspaceSchema = createWorkspaceSchema.partial().strict();

export const listWorkspacesQuerySchema = cursorQuerySchema;

export const inviteMemberSchema = z
  .object({
    /** Invitations are bound to one address and are single use. */
    email: z.string().trim().min(3).max(320).toLowerCase(),
    role: roleSchema,
    note: noteSchema.optional(),
  })
  .strict();

export const updateRoleSchema = z.object({ role: roleSchema }).strict();

export const acceptInvitationSchema = z.object({ token: z.string().min(16).max(512) }).strict();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
