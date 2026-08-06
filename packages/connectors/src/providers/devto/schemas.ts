import { z } from 'zod';

/**
 * Dev.to (Forem) API response schemas. Every payload is parsed, never cast.
 */

export const devtoUserSchema = z
  .object({
    id: z.number().int(),
    username: z.string().min(1),
    name: z.string().nullable().default(null),
    profile_image: z.string().nullable().default(null),
    website_url: z.string().nullable().default(null),
  })
  .strict();

export const devtoArticleSchema = z
  .object({
    id: z.number().int(),
    title: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
    published: z.boolean().default(false),
    published_at: z.string().nullable().default(null),
  })
  .strict();

/** The payload `POST /api/articles` accepts. */
export const devtoArticleCreateSchema = devtoArticleSchema;
