import type { ActivityContext } from '../../activities/types';
import type { WorkflowRuntime } from '../../runtime/types';

/**
 * The weekly digest workflow, as a pure core.
 *
 * Shell and core are split the same way every other workflow here splits them:
 * this file is deterministic and takes its IO as an argument, so the whole
 * decision table is unit-testable without Temporal, without a database and
 * without a model.
 *
 * The decisions this workflow makes are small on purpose. Retrieval, the
 * deterministic floor, the model call and the number audit all live in
 * `@relay/ai`'s digest pipeline behind `buildWeeklyDigest`. What the workflow
 * owns is the order of operations and the honest handling of each outcome:
 * a workspace that switched the digest off is not built, a digest that was
 * already built for this window is not built twice, and an email is only sent
 * for a digest that actually exists.
 */

/**
 * The activity slice the digest needs.
 *
 * Declared here rather than added to `WorkerActivities` because the
 * implementation lives in `@relay/application`, which this phase does not
 * touch. `assertDigestActivities` is the checked narrowing that connects the
 * two once the gateway implements them.
 */
export interface DigestActivities {
  /**
   * Retrieve, build the floor, optionally ask the model, audit, and store the
   * window's rows. Idempotent per window: a second call for the same window
   * replaces that window's rows rather than appending a second digest.
   */
  buildWeeklyDigest(input: BuildWeeklyDigestInput): Promise<BuildWeeklyDigestResult>;
  /**
   * Render the STORED message keys of one window and send them through the
   * mailer port. Model prose is never rendered here.
   */
  sendWeeklyDigestEmail(input: SendWeeklyDigestEmailInput): Promise<SendWeeklyDigestEmailResult>;
}

export interface BuildWeeklyDigestInput {
  readonly ctx: ActivityContext;
  /** `YYYY-MM-DD`, inclusive. */
  readonly windowStart: string;
  /** `YYYY-MM-DD`, inclusive. */
  readonly windowEnd: string;
  /** True when the user asked for a rebuild of a window that already exists. */
  readonly replaceExisting: boolean;
}

export interface BuildWeeklyDigestResult {
  /** False when this workspace switched the weekly digest off. */
  readonly enabled: boolean;
  /** False when a digest for this window already existed and was kept. */
  readonly stored: boolean;
  readonly rowCount: number;
  /** `ai` or `deterministic`. A deterministic digest is a complete digest. */
  readonly source: string;
  /** Why the deterministic floor was the whole answer. Null when it was not. */
  readonly fallbackReasonKey: string | null;
}

export interface SendWeeklyDigestEmailInput {
  readonly ctx: ActivityContext;
  readonly windowStart: string;
  readonly windowEnd: string;
}

export interface SendWeeklyDigestEmailResult {
  readonly sent: boolean;
  /** i18n key naming why nothing was sent. Never an English sentence. */
  readonly skippedReasonKey: string | null;
}

export interface WeeklyDigestWorkflowInput {
  readonly ctx: ActivityContext;
  readonly windowStart: string;
  readonly windowEnd: string;
  /** On-demand regeneration replaces the window. The weekly run does not. */
  readonly replaceExisting: boolean;
  /** Per-workspace toggle, default on. False skips the email, never the digest. */
  readonly sendEmail: boolean;
}

export interface WeeklyDigestWorkflowOutput {
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly enabled: boolean;
  readonly stored: boolean;
  readonly rowCount: number;
  readonly source: string;
  readonly emailSent: boolean;
  readonly reasonKey: string | null;
}

/** Message keys this workflow can return. Resolved by whichever surface renders. */
export const DIGEST_MESSAGE_KEYS = {
  disabled: 'digest.settings.enabled',
  alreadyBuilt: 'digest.title',
  emailOff: 'digest.settings.title',
} as const;

export async function runWeeklyDigest(
  runtime: WorkflowRuntime,
  activities: DigestActivities,
  input: WeeklyDigestWorkflowInput,
): Promise<WeeklyDigestWorkflowOutput> {
  const built = await activities.buildWeeklyDigest({
    ctx: input.ctx,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    replaceExisting: input.replaceExisting,
  });

  const base = {
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    enabled: built.enabled,
    stored: built.stored,
    rowCount: built.rowCount,
    source: built.source,
  };

  if (!built.enabled) {
    runtime.log.info('weekly digest disabled for workspace');
    return { ...base, emailSent: false, reasonKey: DIGEST_MESSAGE_KEYS.disabled };
  }

  if (!input.sendEmail) {
    return { ...base, emailSent: false, reasonKey: DIGEST_MESSAGE_KEYS.emailOff };
  }

  // A digest that was already stored for this window is still worth mailing:
  // idempotency lives in the mailer's own delivery key, not in a skipped send.
  const email = await activities.sendWeeklyDigestEmail({
    ctx: input.ctx,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
  });

  return {
    ...base,
    emailSent: email.sent,
    reasonKey: email.skippedReasonKey ?? built.fallbackReasonKey,
  };
}
