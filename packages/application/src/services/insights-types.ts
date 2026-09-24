import type { OperationRef } from '@relay/contracts';
import { z } from 'zod';

import type { ActorContext, WorkerActivityContext } from '../types';

/**
 * "What happened and what to try next": the read side of stored insights.
 *
 * Every view here carries i18n keys and their arguments, never an English
 * sentence. A row a model wrote is marked `isNarrative`; the weekly email and
 * any surface that must not repeat model prose filter on it.
 */

export type InsightArgs = Readonly<Record<string, string | number | boolean | null>>;

/** One stored row of a weekly digest. */
export interface DigestRowView {
  readonly messageKey: string;
  readonly messageArgs: InsightArgs;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
  readonly sampleSize: number | null;
  readonly isNarrative: boolean;
}

export interface DigestView {
  /** `YYYY-MM-DD`, inclusive. */
  readonly windowStart: string;
  readonly windowEnd: string;
  /** `ai` or `deterministic`. A deterministic digest is a complete digest. */
  readonly source: string;
  readonly fallbackReasonKey: string | null;
  readonly generatedAt: string;
  readonly aiModel: string | null;
  readonly aiPromptVersion: string | null;
  readonly headlineKey: string;
  readonly headlineArgs: InsightArgs;
  readonly rows: readonly DigestRowView[];
}

/** A stored insight row, as any surface sees it. */
export interface InsightView {
  readonly id: string;
  /** `post_feedback`, `digest` or `other`, derived from the message key family. */
  readonly kind: string;
  readonly contentItemId: string | null;
  readonly messageKey: string;
  readonly messageArgs: InsightArgs;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
  readonly sampleSize: number | null;
  readonly state: string;
  readonly createdAt: string;
}

export type FeedbackVerdict = 'above' | 'below' | 'similar' | 'insufficient_data';
export type FeedbackWindow = 'twenty_four_hours' | 'seven_days';

/** One reading of a post against the account's own median. */
export interface PostFeedbackReadingView {
  readonly insightId: string;
  readonly window: FeedbackWindow;
  readonly verdict: FeedbackVerdict;
  readonly metric: string;
  /** Null when the reading could not be taken. Never a zero stand-in. */
  readonly subjectValue: number | null;
  readonly medianValue: number | null;
  readonly effectSize: number | null;
  readonly sampleSize: number | null;
  readonly smallSample: boolean;
  /** i18n keys, one per confounder the comparison found. */
  readonly confounderKeys: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly createdAt: string;
}

/** The single suggested next test. Changes exactly one variable. */
export interface NextTestView {
  readonly messageKey: string;
  readonly messageArgs: InsightArgs;
  /** A metric this account can actually read. */
  readonly metric: string;
  readonly evidenceIds: readonly string[];
  /** `deterministic` today; `ai` once a narrated version is stored. */
  readonly source: 'deterministic' | 'ai';
}

/** A failure in plain language, with the one thing that fixes it. */
export interface FailureExplanationView {
  readonly messageKey: string;
  readonly fixKey: string;
  /** What the fix button does. Null when there is nothing the person can do. */
  readonly action: 'reconnect' | 'edit' | 'retry' | 'wait' | null;
  readonly errorClass: string | null;
}

export interface PostChannelFeedbackView {
  readonly publishJobId: string;
  readonly receiptId: string | null;
  readonly connectionId: string;
  readonly provider: string;
  readonly state: string;
  readonly scheduledFor: string | null;
  readonly dispatchedAt: string | null;
  readonly publishedAt: string | null;
  readonly permalink: string | null;
  readonly readings: readonly PostFeedbackReadingView[];
  /** Null until a verdict exists; `insufficient_data` is a verdict. */
  readonly verdict: FeedbackVerdict | null;
  readonly nextTest: NextTestView | null;
  readonly failure: FailureExplanationView | null;
  /** i18n key explaining why no reading exists yet. Null when one does. */
  readonly pendingReasonKey: string | null;
}

export interface PostFeedbackView {
  readonly contentItemId: string;
  readonly channels: readonly PostChannelFeedbackView[];
}

/** "Posts with a person in the image: 1.3x your Instagram median (n=9)". */
export interface WhatWorksRowView {
  readonly provider: string;
  readonly trait: 'person' | 'text_in_image' | 'logo';
  readonly metric: string;
  /** Rounded to one decimal. Only produced above the sample threshold. */
  readonly ratio: number;
  readonly sampleSize: number;
  readonly baselineSize: number;
  readonly evidenceIds: readonly string[];
}

export interface WhatWorksView {
  /** Posts needed with a trait before a row is shown. */
  readonly minimumSample: number;
  readonly rows: readonly WhatWorksRowView[];
  /** Null when rows exist; otherwise why none are shown. */
  readonly emptyReasonKey: string | null;
}

/** The experiment a post belongs to, summarized. Never names a winner early. */
export interface PostExperimentView {
  readonly experimentId: string;
  readonly name: string;
  readonly metric: string;
  /** The variant this post is in. */
  readonly variantId: string | null;
  readonly conclusive: boolean;
  /** Null unless the result is conclusive. */
  readonly leadingVariantId: string | null;
  readonly relativeDifference: number | null;
  readonly variants: readonly {
    readonly variantId: string;
    readonly label: string;
    readonly sampleSize: number;
    /** Null when no reading was available. Never a zero stand-in. */
    readonly medianValue: number | null;
    readonly unavailableCount: number;
  }[];
  readonly caveatKeys: readonly string[];
}

/** An experiment a draft can join. */
export interface OpenExperimentView {
  readonly experimentId: string;
  readonly name: string;
  readonly variants: readonly { readonly id: string; readonly label: string }[];
}

export interface DigestSettingsView {
  readonly emailEnabled: boolean;
  readonly canChange: boolean;
}

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'INVALID_DATE' });

export const generateDigestRequestSchema = z
  .object({
    windowStart: isoDate.optional(),
    replaceExisting: z.boolean().default(false),
  })
  .strict();

export const digestSettingsUpdateSchema = z.object({ emailEnabled: z.boolean() }).strict();

export interface InsightService {
  latestDigest(ctx: ActorContext): Promise<DigestView | null>;
  /**
   * Build one week now. Idempotent per window: without `replaceExisting` an
   * existing week is returned untouched. The handle is already complete.
   */
  generateDigest(ctx: ActorContext, input: unknown): Promise<OperationRef>;
  list(ctx: ActorContext, query: { contentItemId?: string }): Promise<readonly InsightView[]>;
  postFeedback(ctx: ActorContext, contentItemId: string): Promise<PostFeedbackView>;
  whatWorks(ctx: ActorContext): Promise<WhatWorksView>;
  digestSettings(ctx: ActorContext): Promise<DigestSettingsView>;
  /** The experiment this post is part of, or null. */
  postExperiment(ctx: ActorContext, contentItemId: string): Promise<PostExperimentView | null>;
  /** Experiments a draft can still join. */
  openExperiments(ctx: ActorContext): Promise<readonly OpenExperimentView[]>;
  /** Tag an unpublished post into one variant. Refused once it has published. */
  tagExperiment(
    ctx: ActorContext,
    contentItemId: string,
    input: unknown,
  ): Promise<PostExperimentView | null>;
  updateDigestSettings(ctx: ActorContext, input: unknown): Promise<DigestSettingsView>;
}

/** The two activities the weekly digest workflow calls. */
export interface WorkerDigestService {
  buildWeeklyDigest(input: {
    readonly ctx: WorkerActivityContext;
    readonly windowStart: string;
    readonly windowEnd: string;
    readonly replaceExisting: boolean;
  }): Promise<{
    readonly enabled: boolean;
    readonly stored: boolean;
    readonly rowCount: number;
    readonly source: string;
    readonly fallbackReasonKey: string | null;
  }>;
  sendWeeklyDigestEmail(input: {
    readonly ctx: WorkerActivityContext;
    readonly windowStart: string;
    readonly windowEnd: string;
  }): Promise<{ readonly sent: boolean; readonly skippedReasonKey: string | null }>;
}
