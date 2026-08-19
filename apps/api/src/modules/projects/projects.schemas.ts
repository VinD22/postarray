import { ianaTimeZoneSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { noteSchema, shortTextSchema } from '../../common/schemas';

/**
 * A project is the unit a connection, a campaign and a schedule belong to. It
 * carries its own posting time zone and default locale so an agency running
 * one workspace for clients in three countries does not have to remember
 * which one a draft was meant for.
 */
export const createProjectSchema = z
  .object({
    name: shortTextSchema,
    ianaTimeZone: ianaTimeZoneSchema.optional(),
  })
  .strict();

const projectListItemSchema = z.string().trim().min(1).max(200);

export const updateProjectSchema = createProjectSchema
  .extend({
    voice: noteSchema.optional(),
    audience: noteSchema.optional(),
    approvedClaims: z.array(projectListItemSchema).max(100).optional(),
    blockedTerms: z.array(projectListItemSchema).max(100).optional(),
    domains: z.array(z.string().trim().min(1).max(253)).max(100).optional(),
  })
  .partial()
  .strict();

export const listProjectsQuerySchema = cursorQuerySchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
