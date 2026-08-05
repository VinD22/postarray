import { z } from 'zod';

/**
 * AT Protocol / Bluesky XRPC response shapes.
 * Sources (retrieved 4 August 2026, re-verify before implementation; the source register
 * row for Bluesky lacks a pinned official URL and must be filled in when the connector
 * starts):
 * - https://docs.bsky.app/docs/api/com-atproto-server-create-session
 * - https://docs.bsky.app/docs/api/com-atproto-repo-create-record
 * - https://docs.bsky.app/docs/api/com-atproto-repo-upload-blob
 * - https://docs.bsky.app/docs/api/app-bsky-feed-get-post-thread
 * - https://docs.bsky.app/docs/api/app-bsky-actor-get-profile
 * - https://docs.bsky.app/docs/advanced-guides/rate-limits
 */

export const atprotoErrorSchema = z
  .object({ error: z.string().optional(), message: z.string().optional() })
  .loose();

export const atprotoSessionSchema = z
  .object({
    did: z.string().min(1),
    handle: z.string().min(1),
    accessJwt: z.string().min(1),
    refreshJwt: z.string().min(1),
    email: z.string().optional(),
    active: z.boolean().optional(),
  })
  .loose();
export type AtprotoSession = z.infer<typeof atprotoSessionSchema>;

export const atprotoBlobSchema = z
  .object({
    blob: z
      .object({
        $type: z.string().optional(),
        ref: z.object({ $link: z.string().min(1) }).loose(),
        mimeType: z.string().min(1),
        size: z.number().int().nonnegative(),
      })
      .loose(),
  })
  .loose();
export type AtprotoBlob = z.infer<typeof atprotoBlobSchema>;

/** An AT URI plus the record CID. The AT URI is the external post id. */
export const atprotoRecordRefSchema = z
  .object({
    uri: z.string().min(1),
    cid: z.string().min(1),
    commit: z
      .object({ cid: z.string().optional(), rev: z.string().optional() })
      .loose()
      .optional(),
    validationStatus: z.string().optional(),
  })
  .loose();
export type AtprotoRecordRef = z.infer<typeof atprotoRecordRefSchema>;

export const blueskyProfileSchema = z
  .object({
    did: z.string().min(1),
    handle: z.string().min(1),
    displayName: z.string().optional(),
    avatar: z.string().optional(),
    followersCount: z.number().int().nonnegative().optional(),
    followsCount: z.number().int().nonnegative().optional(),
    postsCount: z.number().int().nonnegative().optional(),
  })
  .loose();

export const blueskyActorSearchSchema = z
  .object({ actors: z.array(blueskyProfileSchema).default([]) })
  .loose();

export const blueskyPostViewSchema = z
  .object({
    uri: z.string().min(1),
    cid: z.string().min(1),
    author: blueskyProfileSchema.optional(),
    replyCount: z.number().int().nonnegative().optional(),
    repostCount: z.number().int().nonnegative().optional(),
    likeCount: z.number().int().nonnegative().optional(),
    quoteCount: z.number().int().nonnegative().optional(),
    indexedAt: z.string().optional(),
  })
  .loose();

export const blueskyPostThreadSchema = z
  .object({
    thread: z
      .object({
        $type: z.string().optional(),
        post: blueskyPostViewSchema.optional(),
        notFound: z.boolean().optional(),
        blocked: z.boolean().optional(),
      })
      .loose(),
  })
  .loose();

/** Bluesky specific draft options. Parsed, never cast. */
export const blueskyProviderOptionsSchema = z
  .object({
    /** BCP 47 tags stored on the post record so clients can offer translation. */
    langs: z.array(z.string().min(2).max(10)).max(3).optional(),
    /** Self applied content labels, for example `porn` or `graphic-media`. */
    selfLabels: z.array(z.string().min(1)).max(4).optional(),
    /** Reply to an existing post. Both the root and the parent are required by the lexicon. */
    replyRootUri: z.string().min(1).optional(),
    replyRootCid: z.string().min(1).optional(),
    replyParentUri: z.string().min(1).optional(),
    replyParentCid: z.string().min(1).optional(),
  })
  .strict();
export type BlueskyProviderOptions = z.infer<typeof blueskyProviderOptionsSchema>;
