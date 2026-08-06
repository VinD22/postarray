import { z } from 'zod';

/**
 * WordPress REST API response schemas. Every payload is parsed, never cast.
 */

export const wordpressUserSchema = z
  .object({
    id: z.number().int(),
    name: z.string().nullable().default(null),
    slug: z.string().nullable().default(null),
    link: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
  })
  .strict();

export const wordpressPostSchema = z
  .object({
    id: z.number().int(),
    link: z.string().nullable().default(null),
    status: z.string().default('draft'),
    date: z.string().nullable().default(null),
    modified: z.string().nullable().default(null),
  })
  .strict();

/** Per-connection provider options. The site URL is the destination. */
export const wordpressProviderOptionsSchema = z
  .object({
    siteUrl: z.string().min(1).optional(),
  })
  .strict();
