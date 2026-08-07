import { ianaTimeZoneSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { noteSchema, shortTextSchema } from '../../common/schemas';

/**
 * A brand is the unit a connection, a campaign and a schedule belong to. It
 * carries its own posting time zone and default locale so an agency running
 * one workspace for clients in three countries does not have to remember
 * which one a draft was meant for.
 */
export const createBrandSchema = z
  .object({
    name: shortTextSchema,
    ianaTimeZone: ianaTimeZoneSchema.optional(),
  })
  .strict();

const brandListItemSchema = z.string().trim().min(1).max(200);

export const updateBrandSchema = createBrandSchema
  .extend({
    voice: noteSchema.optional(),
    audience: noteSchema.optional(),
    approvedClaims: z.array(brandListItemSchema).max(100).optional(),
    blockedTerms: z.array(brandListItemSchema).max(100).optional(),
    domains: z.array(z.string().trim().min(1).max(253)).max(100).optional(),
  })
  .partial()
  .strict();

export const listBrandsQuerySchema = cursorQuerySchema;

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
