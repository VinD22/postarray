import { z } from 'zod';

import type { ActorContext } from '../types';

/**
 * Image analysis: the vocabulary.
 *
 * Analysis only. A model describes an image the workspace already owns, and
 * code turns that description into alt text drafts, crop checks and pre-check
 * warnings. Nothing here creates, edits or extends an image.
 *
 * One schema set for the REST API, the MCP server and the CLI, so the surfaces
 * cannot disagree about what an analysis is.
 */

/**
 * The prompt version the stored analyses are keyed by. Restated from
 * `@relay/ai` (`MEDIA_UNDERSTANDING_VERSION`) because this package does not
 * depend on it; the runtime wiring test pins the two together.
 */
export const MEDIA_UNDERSTANDING_PROMPT_ID = 'media-understanding';
export const MEDIA_UNDERSTANDING_PROMPT_VERSION = '2026-09-23.1';

/** Providers bill at most this many input tokens per image. Mirrors `@relay/ai`. */
export const VISION_TOKENS_PER_IMAGE_CAP = 1024;

/** Long side of the derivative sent for analysis, in pixels. */
export const ANALYSIS_LONG_SIDE_PX = 1024;
/** Upper bound on the bytes sent for one image. */
export const ANALYSIS_MAX_BYTES = 1_048_576;

const unit = z.number().min(0).max(1);

export const analysisBoxSchema = z
  .object({ x: unit, y: unit, width: unit, height: unit })
  .strict()
  .refine((box) => box.x + box.width <= 1.0001 && box.y + box.height <= 1.0001, {
    error: 'BOX_OUT_OF_BOUNDS',
  });
export type AnalysisBox = z.infer<typeof analysisBoxSchema>;

/** Mirrors `mediaUnderstandingResultSchema` in `@relay/ai`. Parsed, never cast. */
export const mediaUnderstandingOutputSchema = z
  .object({
    subjects: z
      .array(
        z
          .object({
            label: z.string().min(1).max(120),
            box: analysisBoxSchema,
            prominence: z.enum(['primary', 'secondary']),
          })
          .strict(),
      )
      .max(12),
    visibleText: z
      .array(
        z.object({ text: z.string().min(1).max(500), box: analysisBoxSchema.nullable() }).strict(),
      )
      .max(20),
    setting: z.string().min(1).max(200).nullable(),
    mood: z.string().min(1).max(120).nullable(),
    textLegibilityRisk: z.enum(['none', 'low', 'medium', 'high']),
    sensitive: z
      .object({
        faces: z.boolean(),
        possibleMinors: z.boolean(),
        logos: z.array(z.string().min(1).max(120)).max(10),
      })
      .strict(),
    evidenceIds: z.array(z.string().min(1).max(128)).max(20),
    uncertain: z.boolean(),
    uncertaintyReason: z.string().max(280).nullable(),
  })
  .strict();
export type MediaUnderstandingOutput = z.infer<typeof mediaUnderstandingOutputSchema>;

const id = z.string().min(1).max(128);

export const mediaAnalysisRequestSchema = z.object({ mediaId: id }).strict();

export const mediaAnalysisChecksRequestSchema = z
  .object({
    mediaId: id,
    /** Channels the post is going to. Their recommended aspect ratios drive the crop check. */
    connectionIds: z.array(id).max(30).default([]),
  })
  .strict();

export const aiSettingsUpdateSchema = z.object({ imageAnalysisEnabled: z.boolean() }).strict();

/** Why an analysis did not run. Each maps to an i18n key; none is a failure of the user's work. */
export const MEDIA_ANALYSIS_BLOCK_REASONS = [
  'analysis_disabled',
  'ai_unavailable',
  'not_an_image',
  'scan_not_clean',
  'rights_undeclared',
  'source_unavailable',
] as const;
export type MediaAnalysisBlockReason = (typeof MEDIA_ANALYSIS_BLOCK_REASONS)[number];

export interface MediaAnalysisView {
  readonly id: string;
  readonly mediaId: string;
  readonly promptId: string;
  readonly promptVersion: string;
  readonly provider: string;
  readonly model: string;
  readonly createdAt: string;
  readonly result: MediaUnderstandingOutput;
}

export type MediaAnalysisOutcome =
  | { readonly status: 'ready'; readonly analysis: MediaAnalysisView }
  /** The downscaled copy is still being made. Ask again shortly. */
  | { readonly status: 'processing'; readonly workflowId: string | null }
  | {
      readonly status: 'blocked';
      readonly reason: MediaAnalysisBlockReason;
      readonly reasonKey: string;
    };

export type MediaCheckKind =
  'subject_cut_off' | 'small_text' | 'faces_consent' | 'minors_consent' | 'third_party_logos';

/** A pre-check. Always a warning, never a block: the person decides. */
export interface MediaCheckWarning {
  readonly kind: MediaCheckKind;
  readonly severity: 'warning';
  readonly messageKey: string;
  readonly values: Readonly<Record<string, string | number>>;
  /** For a crop warning, the normalized crop that keeps the subject in frame, or null. */
  readonly suggestedCrop: AnalysisBox | null;
  readonly connectionIds: readonly string[];
}

export type MediaChecksView =
  | {
      readonly status: 'ready';
      readonly analysisId: string;
      readonly warnings: readonly MediaCheckWarning[];
    }
  | Exclude<MediaAnalysisOutcome, { readonly status: 'ready' }>;

export interface AiSettingsView {
  readonly imageAnalysisEnabled: boolean;
  /** True when this actor may change the setting (owner or admin). */
  readonly canChange: boolean;
}

export interface MediaAnalysisService {
  settings(ctx: ActorContext): Promise<AiSettingsView>;
  updateSettings(ctx: ActorContext, input: unknown): Promise<AiSettingsView>;
  /** Stored analysis for the current prompt version, running one when allowed. */
  analyze(ctx: ActorContext, input: unknown): Promise<MediaAnalysisOutcome>;
  /** Stored analysis only. Never calls a model. */
  get(ctx: ActorContext, mediaId: string): Promise<MediaAnalysisView | null>;
  /** Code-based crop, legibility and consent checks over the stored analysis. */
  checks(ctx: ActorContext, input: unknown): Promise<MediaChecksView>;
  /** Short plain-text summaries for other prompts, as untrusted sources. */
  summariesFor(
    ctx: ActorContext,
    mediaIds: readonly string[],
  ): Promise<readonly { readonly mediaId: string; readonly summary: string }[]>;
}
