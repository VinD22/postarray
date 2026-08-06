import { z } from 'zod';

/**
 * Medium integration API response schemas. Every payload is parsed, never cast.
 */

export const mediumUserSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().nullable().default(null),
    username: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
    imageUrl: z.string().nullable().default(null),
  })
  .strict();

export const mediumPostSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
    publishStatus: z.string().nullable().default(null),
    publishedAt: z.number().int().nullable().default(null),
  })
  .strict();

export const mediumEnvelopeSchema = z
  .object({
    data: z.unknown(),
  })
  .strict();
