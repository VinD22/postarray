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

const connectionIdListSchema = z.array(z.string().trim().min(1).max(64)).max(200);

/**
 * `PATCH /v1/projects/{id}/connections`. A connection belongs to at most one
 * project, so `add` moves it here and `remove` leaves it unassigned. At least
 * one of the two must name something.
 */
export const updateProjectConnectionsSchema = z
  .object({
    add: connectionIdListSchema.default([]),
    remove: connectionIdListSchema.default([]),
  })
  .strict()
  .refine((value) => value.add.length + value.remove.length > 0, {
    message: 'add or remove must name at least one connection',
  });

export const listProjectsQuerySchema = cursorQuerySchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectConnectionsInput = z.infer<typeof updateProjectConnectionsSchema>;
