import { ASSISTANT_TOOL_NAMES, providerIdSchema } from '@relay/contracts';
import { z } from 'zod';

/**
 * What the assistant is willing to accept back from a model.
 *
 * These are deliberately the application's own schemas rather than an import
 * from the prompt package. The gateway validates against whatever schema the
 * caller supplies, and the caller is the only party that knows which fields it
 * is about to use. Declaring the subset here means a prompt that grows a field
 * cannot silently start feeding this service something it never read, and a
 * prompt that loses one fails loudly at the boundary instead of downstream.
 *
 * Everything is `.strict()`. Nothing here has a field for an image or a video.
 */

const uncertain = z.boolean();
const uncertaintyReason = z.string().max(400).nullable();

export const routeOutputSchema = z
  .object({
    tool: z.enum(ASSISTANT_TOOL_NAMES),
    missingInformation: z.array(z.string().max(200)).max(6),
    rationale: z.string().max(600),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type RouteOutput = z.infer<typeof routeOutputSchema>;

export const weekPlanOutputSchema = z
  .object({
    posts: z
      .array(
        z
          .object({
            dayOffset: z.number().int().min(0).max(6),
            angle: z.string().min(1).max(300),
            body: z.string().min(1).max(4000),
            suggestedProviders: z.array(providerIdSchema).max(12),
          })
          .strict(),
      )
      .max(14),
    groundingNotes: z.array(z.string().max(400)).max(20),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type WeekPlanOutput = z.infer<typeof weekPlanOutputSchema>;

export const captionOptionsOutputSchema = z
  .object({
    options: z
      .array(
        z
          .object({
            hook: z.string().min(1).max(280),
            angle: z.string().min(1).max(200),
            evidenceIds: z.array(z.string().max(128)).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(5),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type CaptionOptionsOutput = z.infer<typeof captionOptionsOutputSchema>;

export const platformFitOutputSchema = z
  .object({
    provider: providerIdSchema,
    issues: z
      .array(
        z
          .object({
            code: z.string().min(1).max(80),
            severity: z.enum(['error', 'warning', 'info']),
            explanation: z.string().max(600),
            suggestion: z.string().max(600).nullable(),
          })
          .strict(),
      )
      .max(20),
    fitsNativeFormat: z.boolean(),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type PlatformFitOutput = z.infer<typeof platformFitOutputSchema>;
