import { z } from 'zod';

/**
 * Pinterest v5 API response schemas. Every payload is parsed, never cast.
 */

export const pinterestUserSchema = z
  .object({
    username: z.string().min(1),
    id: z.string().nullable().default(null),
    account_type: z.string().nullable().default(null),
  })
  .strict();

export const pinterestBoardSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
  })
  .strict();

export const pinterestBoardsResponseSchema = z
  .object({
    items: z.array(pinterestBoardSchema).default([]),
  })
  .strict();

export const pinterestPinSchema = z
  .object({
    id: z.string().min(1),
    url: z.string().nullable().default(null),
    board_id: z.string().nullable().default(null),
  })
  .strict();
