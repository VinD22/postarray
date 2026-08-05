import { isoInstantSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination.js';
import { userIdSchema } from '../../common/schemas.js';

/**
 * Audit log queries.
 *
 * The log exists to answer one question precisely: who published this, from
 * which surface, under which approval, with which content hash. The filters
 * below are the ones that question needs, and nothing more.
 */
export const listAuditQuerySchema = cursorQuerySchema.extend({
  actorId: z.string().trim().min(1).max(128).optional(),
  subjectUserId: userIdSchema.optional(),
  action: z.string().trim().min(1).max(120).optional(),
  resourceType: z.string().trim().min(1).max(64).optional(),
  resourceId: z.string().trim().min(1).max(128).optional(),
  from: isoInstantSchema.optional(),
  to: isoInstantSchema.optional(),
});

export type ListAuditQuery = z.infer<typeof listAuditQuerySchema>;
