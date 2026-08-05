import { z } from 'zod';

import { contentKindSchema, localeSchema, providerIdSchema } from '@relay/contracts';
import type { GrowthPlan } from '@relay/contracts';

/**
 * Structured output contracts, one per prompt.
 *
 * Three rules hold across every schema in this file:
 *  - no field may carry a free-form URL, an email address or a phone number.
 *    The application resolves identifiers to links when it renders.
 *  - every claim-bearing field is paired with `evidenceIds`.
 *  - every date is `YYYY-MM-DD` and is range-checked by a post-processor.
 *
 * Every schema also carries `uncertain` and `uncertaintyReason`, because a
 * model that cannot say "I am not sure" will invent something instead.
 */

const evidenceIds = z.array(z.string().min(1).max(128)).max(20);
const shortText = z.string().min(1).max(280);
const mediumText = z.string().min(1).max(900);
const uncertain = z.boolean();
const uncertaintyReason = z.string().max(280).nullable();

export const CONFIDENCES = ['low', 'medium', 'high'] as const;
export const confidenceSchema = z.enum(CONFIDENCES);

export const draftFromBriefResultSchema = z
  .object({
    title: z.string().max(140).nullable(),
    body: z.string().min(1).max(6000),
    contentKind: contentKindSchema,
    locale: localeSchema,
    threadParts: z.array(z.string().min(1).max(3000)).max(12),
    suggestedHashtags: z.array(z.string().min(1).max(60)).max(10),
    evidenceIds,
    rationale: mediumText,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type DraftFromBriefResult = z.infer<typeof draftFromBriefResultSchema>;

export const platformVariantResultSchema = z
  .object({
    provider: providerIdSchema,
    body: z.string().min(1).max(6000),
    threadParts: z.array(z.string().min(1).max(3000)).max(12),
    /** What the model changed and why, so the diff view can explain itself. */
    changes: z.array(shortText).max(12),
    withinLimitEstimate: z.boolean(),
    evidenceIds,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type PlatformVariantResult = z.infer<typeof platformVariantResultSchema>;

export const transcreateResultSchema = z
  .object({
    targetLanguage: localeSchema,
    body: z.string().min(1).max(6000),
    /** Terms deliberately left untranslated, from the brand glossary. */
    preservedTerms: z.array(z.string().min(1).max(80)).max(40),
    /** Phrases with no clean equivalent. Drives the composer's warning. */
    untranslatablePhrases: z
      .array(z.object({ phrase: z.string().min(1).max(160), note: shortText }).strict())
      .max(10),
    registerNote: mediumText,
    rationale: mediumText,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type TranscreateResult = z.infer<typeof transcreateResultSchema>;

export const shortenResultSchema = z
  .object({
    body: z.string().min(1).max(6000),
    removedIdeas: z.array(shortText).max(12),
    characterCount: z.number().int().nonnegative(),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type ShortenResult = z.infer<typeof shortenResultSchema>;

export const TONES = ['plain', 'warm', 'direct', 'technical', 'playful', 'formal'] as const;
export const toneSchema = z.enum(TONES);

export const toneAdjustResultSchema = z
  .object({
    tone: toneSchema,
    body: z.string().min(1).max(6000),
    changes: z.array(shortText).max(12),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type ToneAdjustResult = z.infer<typeof toneAdjustResultSchema>;

export const altTextResultSchema = z
  .object({
    altText: z.string().min(8).max(420),
    language: localeSchema,
    /** True when the image contains readable text that must be transcribed. */
    describesText: z.boolean(),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type AltTextResult = z.infer<typeof altTextResultSchema>;

export const hookOptionsResultSchema = z
  .object({
    options: z
      .array(
        z
          .object({ hook: z.string().min(1).max(280), angle: shortText, evidenceIds })
          .strict(),
      )
      .min(1)
      .max(5),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type HookOptionsResult = z.infer<typeof hookOptionsResultSchema>;

export const ctaOptionsResultSchema = z
  .object({
    options: z
      .array(
        z
          .object({
            cta: z.string().min(1).max(140),
            intent: shortText,
            /** Identifier of a link the application already owns, never a URL. */
            linkRef: z.string().max(128).nullable(),
          })
          .strict(),
      )
      .min(1)
      .max(5),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type CtaOptionsResult = z.infer<typeof ctaOptionsResultSchema>;

export const CLAIM_VERDICTS = ['supported', 'unsupported', 'needs_evidence', 'prohibited'] as const;
export const claimVerdictSchema = z.enum(CLAIM_VERDICTS);

export const claimCheckResultSchema = z
  .object({
    claims: z
      .array(
        z
          .object({
            quote: z.string().min(1).max(600),
            verdict: claimVerdictSchema,
            reason: mediumText,
            evidenceIds,
            suggestedRewrite: z.string().max(900).nullable(),
          })
          .strict(),
      )
      .max(30),
    overall: claimVerdictSchema,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type ClaimCheckResult = z.infer<typeof claimCheckResultSchema>;

const issueSchema = z
  .object({
    /** Stable machine code so the composer can map it to a message key. */
    code: z.string().min(1).max(80),
    severity: z.enum(['error', 'warning', 'info']),
    explanation: mediumText,
    suggestion: z.string().max(600).nullable(),
  })
  .strict();

export const platformFitCheckResultSchema = z
  .object({
    provider: providerIdSchema,
    issues: z.array(issueSchema).max(20),
    fitsNativeFormat: z.boolean(),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type PlatformFitCheckResult = z.infer<typeof platformFitCheckResultSchema>;

export const duplicateCheckResultSchema = z
  .object({
    /** Ids of prior content items supplied in the prompt. Never free text. */
    similarContentIds: z.array(z.string().min(1).max(128)).max(20),
    similarityScore: z.number().min(0).max(1),
    verdict: z.enum(['distinct', 'similar', 'near_duplicate']),
    reason: mediumText,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type DuplicateCheckResult = z.infer<typeof duplicateCheckResultSchema>;

export const accessibilityCheckResultSchema = z
  .object({
    findings: z.array(issueSchema).max(20),
    readingLevelEstimate: z.enum(['simple', 'moderate', 'complex']),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type AccessibilityCheckResult = z.infer<typeof accessibilityCheckResultSchema>;

export const analyticsSummaryResultSchema = z
  .object({
    observations: z
      .array(
        z
          .object({
            statement: mediumText,
            /** Receipt, experiment or metric ids passed into the prompt. */
            evidenceIds: z.array(z.string().min(1).max(128)).min(1).max(20),
            confidence: confidenceSchema,
            /** Reasons the observation could be wrong. Never empty. */
            confounders: z.array(shortText).min(1).max(6),
          })
          .strict(),
      )
      .max(8),
    notSupported: z.array(shortText).max(8),
    sampleIsSmall: z.boolean(),
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type AnalyticsSummaryResult = z.infer<typeof analyticsSummaryResultSchema>;

export const experimentSuggestionResultSchema = z
  .object({
    hypothesis: mediumText,
    variantA: mediumText,
    variantB: mediumText,
    successMetric: z.string().min(1).max(80),
    /** Whole days. The application turns this into an instant plus a zone. */
    windowDays: z.number().int().min(1).max(90),
    minimumSampleSize: z.number().int().min(1).max(1000),
    caveats: z.array(shortText).min(1).max(6),
    evidenceIds,
    uncertain,
    uncertaintyReason,
  })
  .strict();
export type ExperimentSuggestionResult = z.infer<typeof experimentSuggestionResultSchema>;

/**
 * The growth plan prompt returns the nine plan sections and nothing else. The
 * application supplies `id`, `workspaceId`, `schemaVersion`, `revision`,
 * `state`, `generatedAt`, `model` and `promptVersion`, so the model can never
 * forge provenance. The assembled object is then validated against
 * `growthPlanSchema` from `@relay/contracts`, which is the real gate.
 */
export const GROWTH_PLAN_PROVENANCE_FIELDS = [
  'id',
  'workspaceId',
  'schemaVersion',
  'revision',
  'state',
  'generatedAt',
  'model',
  'promptVersion',
] as const;

export type GrowthPlanBody = Omit<
  GrowthPlan,
  (typeof GROWTH_PLAN_PROVENANCE_FIELDS)[number]
>;

/**
 * Deliberately permissive: the strict shape lives in `@relay/contracts` and is
 * applied by the pipeline once the provenance fields are attached, so a model
 * that omits a section fails with a useful path instead of a misleading one.
 */
export const growthPlanBodySchema = z.unknown();
