import type { OperationRef } from '@relay/contracts';

import type { ActorContext } from '../../application/port';

/**
 * The application surface the digest routes call.
 *
 * It is declared here, beside the transport, rather than in
 * `../../application/port.ts`, because that file and its test doubles are owned
 * elsewhere this phase. The shape is the one it will take when it moves: same
 * `ActorContext`-first signature, same `OperationRef` for asynchronous work,
 * same view models. Moving it is a cut and paste plus a `Services` entry.
 */

export const INSIGHTS_PORT = Symbol('INSIGHTS_PORT');

/** One stored row of a digest, as the client sees it. */
export interface DigestRowView {
  /** An i18n key. This API never returns an English sentence of its own. */
  readonly messageKey: string;
  readonly messageArgs: Readonly<Record<string, string | number | boolean | null>>;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
  readonly sampleSize: number | null;
  /**
   * True when the row's argument is a sentence a model wrote. The client may
   * render it; the weekly email never does.
   */
  readonly isNarrative: boolean;
}

export interface DigestView {
  /** `YYYY-MM-DD`, inclusive. */
  readonly windowStart: string;
  readonly windowEnd: string;
  /** `ai` or `deterministic`. A deterministic digest is a complete digest. */
  readonly source: string;
  /** Why the deterministic floor was the whole answer. Null when it was not. */
  readonly fallbackReasonKey: string | null;
  readonly generatedAt: string;
  readonly aiModel: string | null;
  readonly aiPromptVersion: string | null;
  readonly rows: readonly DigestRowView[];
}

/** A per-post observation. The pre-existing `post_feedback` insight kind. */
export interface InsightView {
  readonly id: string;
  readonly kind: string;
  readonly contentItemId: string | null;
  readonly messageKey: string;
  readonly messageArgs: Readonly<Record<string, string | number | boolean | null>>;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
  readonly sampleSize: number | null;
  readonly state: string;
  readonly createdAt: string;
}

export interface InsightsPort {
  /** The most recent stored digest, or null when none has been built yet. */
  getLatestDigest(ctx: ActorContext): Promise<DigestView | null>;
  /** Asynchronous, idempotent per window. Returns a handle, never a digest. */
  generateDigest(
    ctx: ActorContext,
    input: { windowStart?: string; replaceExisting: boolean },
  ): Promise<OperationRef>;
  listInsights(
    ctx: ActorContext,
    query: { contentItemId?: string },
  ): Promise<readonly InsightView[]>;
}
