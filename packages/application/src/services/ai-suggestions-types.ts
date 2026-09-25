import { z } from 'zod';

import type { ActorContext } from '../types';

/**
 * The composer's Suggest and Review use cases: the vocabulary.
 *
 * One schema set, used by the REST controller, the MCP tools and the CLI, so
 * the three surfaces cannot disagree about what a suggestion request is. Every
 * answer is a proposal. Nothing here writes a draft; accepting a proposal is a
 * separate call that records provenance, and the text itself reaches the draft
 * through the ordinary content save path.
 */

export const SUGGESTION_KINDS = [
  'draft_from_brief',
  'hooks',
  'ctas',
  'shorten',
  'tone',
  'platform_variant',
  'transcreate',
] as const;
export type SuggestionKind = (typeof SUGGESTION_KINDS)[number];

export const SUGGESTION_TONES = [
  'plain',
  'warm',
  'direct',
  'technical',
  'playful',
  'formal',
] as const;
export type SuggestionTone = (typeof SUGGESTION_TONES)[number];

const text = z.string().max(6000);
const id = z.string().min(1).max(128);

export const suggestionRequestSchema = z
  .object({
    kind: z.enum(SUGGESTION_KINDS),
    /** The current body. Required for everything except a draft from a brief. */
    body: text.optional(),
    brief: z.string().max(4000).optional(),
    contentItemId: id.optional(),
    /** Channel tab the suggestion is for. Required for `platform_variant`. */
    connectionId: id.optional(),
    tone: z.enum(SUGGESTION_TONES).optional(),
    targetLanguage: z.string().min(2).max(35).optional(),
    sourceLanguage: z.string().min(2).max(35).optional(),
    targetCharacters: z.number().int().min(10).max(6000).optional(),
    audience: z.string().max(200).optional(),
    objective: z.string().max(200).optional(),
    /** Link identifiers the draft already owns. Never URLs. */
    linkRefs: z.array(id).max(10).optional(),
    /** Attached media whose stored analysis may inform the suggestion. */
    mediaIds: z.array(id).max(20).optional(),
    protectedTerms: z.array(z.string().min(1).max(80)).max(40).optional(),
  })
  .strict()
  .superRefine((value, issues) => {
    const needsBody = value.kind !== 'draft_from_brief';
    if (needsBody && (value.body === undefined || value.body.trim().length === 0)) {
      issues.addIssue({ code: 'custom', path: ['body'], message: 'required' });
    }
    if (value.kind === 'draft_from_brief' && (value.brief ?? '').trim().length === 0) {
      issues.addIssue({ code: 'custom', path: ['brief'], message: 'required' });
    }
    if (value.kind === 'platform_variant' && value.connectionId === undefined) {
      issues.addIssue({ code: 'custom', path: ['connectionId'], message: 'required' });
    }
    if (value.kind === 'transcreate' && value.targetLanguage === undefined) {
      issues.addIssue({ code: 'custom', path: ['targetLanguage'], message: 'required' });
    }
    if (value.kind === 'tone' && value.tone === undefined) {
      issues.addIssue({ code: 'custom', path: ['tone'], message: 'required' });
    }
  });
export type SuggestionRequest = z.infer<typeof suggestionRequestSchema>;

export const reviewRequestSchema = z
  .object({
    body: z.string().min(1).max(6000),
    contentItemId: id.optional(),
    projectId: id.optional(),
    mediaIds: z.array(id).max(20).optional(),
    altTextPresent: z.boolean().optional(),
  })
  .strict();
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;

export const acceptSuggestionRequestSchema = z
  .object({
    suggestionId: z.string().min(1).max(64),
    proposalIndex: z.number().int().min(0).max(9),
    contentItemId: id.optional(),
    connectionId: id.optional(),
  })
  .strict();
export type AcceptSuggestionRequest = z.infer<typeof acceptSuggestionRequestSchema>;

export const bestTimeRequestSchema = z.object({ connectionId: id }).strict();
export type BestTimeRequest = z.infer<typeof bestTimeRequestSchema>;

/** Which model and which exact prompt produced a proposal. Stored on accept. */
export interface SuggestionProvenance {
  readonly label: 'suggestion';
  readonly promptId: string;
  readonly promptVersion: string;
  readonly provider: string;
  readonly model: string;
  readonly degraded: boolean;
}

export interface SuggestionProposal {
  readonly body: string;
  /** Short model-written note: an angle, an intent, or what was removed. */
  readonly note: string | null;
  readonly threadParts: readonly string[];
  readonly linkRef: string | null;
}

export type SuggestionView =
  | {
      readonly status: 'ready';
      readonly suggestionId: string;
      readonly kind: SuggestionKind;
      readonly proposals: readonly SuggestionProposal[];
      /** Model-written caveats, for example phrases with no clean translation. */
      readonly warnings: readonly string[];
      readonly uncertain: boolean;
      readonly uncertaintyReason: string | null;
      readonly provenance: SuggestionProvenance;
      /** Ids of untrusted sources the suggestion was allowed to read. */
      readonly sourceIds: readonly string[];
    }
  | {
      readonly status: 'unavailable';
      readonly kind: SuggestionKind;
      /** i18n key. Never model or provider prose. */
      readonly reasonKey: string;
    };

export const REVIEW_CHECKS = ['claims', 'accessibility', 'duplicates'] as const;
export type ReviewCheck = (typeof REVIEW_CHECKS)[number];

/** How a check joins the readiness checklist. `unavailable` is never a pass. */
export type ReviewCheckStatus = 'passed' | 'attention' | 'blocked' | 'unavailable';

export interface ReviewFinding {
  readonly code: string;
  readonly severity: 'error' | 'warning' | 'info';
  /** Model-written; shown labelled as a suggestion, never as a verdict. */
  readonly explanation: string;
  readonly quote: string | null;
  readonly suggestion: string | null;
  readonly relatedContentIds: readonly string[];
}

export interface ReviewCheckView {
  readonly check: ReviewCheck;
  readonly status: ReviewCheckStatus;
  readonly findings: readonly ReviewFinding[];
  readonly reasonKey: string | null;
  readonly provenance: SuggestionProvenance | null;
}

export interface ReviewView {
  readonly checks: readonly ReviewCheckView[];
  /** The worst status across checks. `unavailable` outranks `passed`. */
  readonly overall: ReviewCheckStatus;
}

export interface AcceptedSuggestionView {
  readonly suggestionId: string;
  readonly aiAssisted: true;
  readonly provenance: SuggestionProvenance;
  readonly body: string;
  readonly threadParts: readonly string[];
}

export type BestTimeView =
  | {
      readonly status: 'available';
      readonly connectionId: string;
      readonly provider: string;
      readonly metric: string;
      readonly timeZone: string;
      /** Local hours, half-open: 9 and 11 means 9:00 to 10:59. */
      readonly startHour: number;
      readonly endHour: number;
      /** Band median over the account's overall median. */
      readonly ratio: number;
      readonly bandSampleSize: number;
      readonly totalSampleSize: number;
    }
  | {
      readonly status: 'unavailable';
      readonly connectionId: string;
      readonly reasonKey: string;
      readonly totalSampleSize: number;
      readonly minimumSample: number;
    };

export interface AiSuggestionService {
  suggest(ctx: ActorContext, input: unknown): Promise<SuggestionView>;
  review(ctx: ActorContext, input: unknown): Promise<ReviewView>;
  accept(ctx: ActorContext, input: unknown): Promise<AcceptedSuggestionView>;
  bestTime(ctx: ActorContext, input: unknown): Promise<BestTimeView>;
}

/**
 * The stored analysis of an attached image, from the media-understanding
 * feature. Treated as untrusted: text visible in an image can carry an
 * injection, so it is fenced like any other retrieved material.
 */
export interface MediaUnderstandingReader {
  summariesFor(
    ctx: ActorContext,
    mediaIds: readonly string[],
  ): Promise<readonly { readonly mediaId: string; readonly summary: string }[]>;
}
