import { z } from 'zod';

/**
 * The structured output contract for the weekly digest.
 *
 * Same three rules as every other prompt schema: no free-form URL, email or
 * phone number; every claim-bearing field is paired with `evidenceIds`; and the
 * model can always say it is not sure rather than inventing something.
 *
 * The model writes prose and nothing else. It supplies no ids of its own, no
 * dates and no provenance: the application owns the window, the receipts and
 * the numbers, and the number audit in `postprocess.ts` enforces that.
 */

const shortText = z.string().min(1).max(280);
const mediumText = z.string().min(1).max(900);

export const DIGEST_CONFIDENCES = ['low', 'medium', 'high'] as const;
export const digestConfidenceSchema = z.enum(DIGEST_CONFIDENCES);

export const digestObservationSchema = z
  .object({
    statement: mediumText,
    /** Receipt ids or metric names that were supplied in the prompt variables. */
    evidenceIds: z.array(z.string().min(1).max(128)).min(1).max(20),
    confidence: digestConfidenceSchema,
    /** Reasons the observation could be wrong. Never empty. */
    confounders: z.array(shortText).min(1).max(6),
  })
  .strict();
export type DigestObservation = z.infer<typeof digestObservationSchema>;

export const weeklyDigestResultSchema = z
  .object({
    headline: shortText,
    observations: z.array(digestObservationSchema).max(6),
    /** Everything the data cannot support. An honest digest is rarely empty here. */
    notSupported: z.array(shortText).max(8),
    /** One next step, or null. "Do nothing yet" is expressed as null. */
    suggestedNextAction: mediumText.nullable(),
    sampleIsSmall: z.boolean(),
    uncertain: z.boolean(),
    uncertaintyReason: z.string().max(280).nullable(),
  })
  .strict();
export type WeeklyDigestResult = z.infer<typeof weeklyDigestResultSchema>;
