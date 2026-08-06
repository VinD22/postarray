import { z } from 'zod';

/**
 * Reddit OAuth v2 API response schemas. Every payload is parsed, never cast.
 */

export const redditUserSchema = z
  .object({
    name: z.string().min(1),
    id: z.string().min(1),
    icon_img: z.string().nullable().default(null),
    subreddit: z
      .object({
        display_name: z.string().nullable().default(null),
      })
      .nullable()
      .default(null),
  })
  .strict();

export const redditListingSchema = z
  .object({
    data: z
      .object({
        children: z.array(
          z.object({
            data: z
              .object({
                display_name: z.string().nullable().default(null),
                name: z.string().nullable().default(null),
                url: z.string().nullable().default(null),
                id: z.string().nullable().default(null),
                permalink: z.string().nullable().default(null),
              })
              .strict(),
          }),
        ),
      })
      .strict(),
  })
  .strict();

export const redditSubmitResponseSchema = z
  .object({
    json: z
      .object({
        errors: z.array(z.unknown()).default([]),
        data: z
          .object({
            id: z.string().nullable().default(null),
            url: z.string().nullable().default(null),
          })
          .strict()
          .nullable()
          .default(null),
      })
      .strict(),
  })
  .strict();

/** Per-connection provider options. The subreddit is the destination. */
export const redditProviderOptionsSchema = z
  .object({
    subreddit: z.string().min(1).optional(),
  })
  .strict();
