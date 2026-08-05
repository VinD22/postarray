import { ianaTimeZoneSchema, localeSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { mediumTextSchema, shortTextSchema } from '../../common/schemas';

/**
 * A brand is the unit a connection, a campaign and a schedule belong to. It
 * carries its own posting time zone and default locale so an agency running
 * one workspace for clients in three countries does not have to remember
 * which one a draft was meant for.
 */
export const createBrandSchema = z
  .object({
    name: shortTextSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    defaultLocale: localeSchema,
    description: mediumTextSchema.optional(),
    /** Terms the composer should keep as written, for example a product name. */
    glossary: z.array(shortTextSchema).max(500).optional(),
    /** Approved link domains, used by the abuse preflight and by rules. */
    approvedDomains: z.array(z.string().trim().min(3).max(253)).max(100).optional(),
  })
  .strict();

export const updateBrandSchema = createBrandSchema.partial().strict();

export const listBrandsQuerySchema = cursorQuerySchema;

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
