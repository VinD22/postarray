/**
 * The receipt timeline, as data.
 *
 * The screen renders a `Timeline` from the design system; this module decides
 * what is on it. Keeping that decision here, pure and ordered, is what lets a
 * test assert the two rules that matter most:
 *
 *  1. A failed follow up item never turns the root post's step into a failure.
 *     The root published. That is a fact about the world and no later event
 *     changes it.
 *  2. Every attempt appears, including the ones that succeeded after a retry,
 *     with its own sanitized reason. A receipt that hides attempt 1 is a
 *     receipt nobody can debug from.
 */

import type { PublicationReceipt, PublishAttempt, ReceiptItem } from '@relay/contracts';

/** A step, before any translation or formatting is applied. */
export interface TimelineStep {
  readonly id: string;
  /** Catalog key for the sentence. */
  readonly messageKey: string;
  /** ICU values that sentence needs. */
  readonly values: Readonly<Record<string, string | number>>;
  readonly at: string | null;
  readonly outcome: 'completed' | 'current' | 'pending' | 'retried' | 'warning' | 'failed';
  /** Extra facts rendered under the sentence: an external id, a permalink. */
  readonly detail?: {
    readonly externalPostId?: string;
    readonly permalink?: string;
    readonly errorCode?: string;
    readonly errorClass?: string;
    readonly httpStatus?: number;
    readonly providerRequestId?: string;
    readonly nextRetryAt?: string;
    readonly idempotencyKey?: string;
    readonly checksum?: string;
    readonly capabilityVersion?: string;
  };
}

export interface TimelineInput {
  readonly receipt: PublicationReceipt;
  readonly provider: string;
  readonly createdByName: string;
  readonly approverName: string | null;
  /** Media file count prepared for this target, when the job recorded it. */
  readonly preparedMediaCount: number | null;
  readonly analyticsSyncedAt: string | null;
  /** From the publish job. The receipt itself does not carry it. */
  readonly idempotencyKey: string | null;
}

/**
 * Build the ordered timeline.
 *
 * Order is chronological where a timestamp exists and structural where one
 * does not, so a step never appears before the thing that caused it even when
 * two events share a second.
 */
export function buildTimeline(input: TimelineInput): readonly TimelineStep[] {
  const { receipt } = input;
  const steps: TimelineStep[] = [];

  steps.push({
    id: 'created',
    messageKey: 'receipt.timeline.created',
    values: { actor: input.createdByName },
    at: null,
    outcome: 'completed',
  });

  if (receipt.approval.state === 'approved' && receipt.approval.decidedBy) {
    steps.push({
      id: 'approved',
      messageKey: 'receipt.timeline.approved',
      values: {
        actor: receipt.approval.decidedBy,
        policy: receipt.approval.policyKey ?? '',
      },
      at: receipt.approval.decidedAt,
      outcome: 'completed',
    });
  } else if (receipt.approval.state === 'requested' && input.approverName) {
    steps.push({
      id: 'approval-requested',
      messageKey: 'receipt.timeline.approvalRequested',
      values: { approver: input.approverName },
      at: null,
      outcome: 'current',
    });
  }

  steps.push({
    id: 'scheduled',
    messageKey: 'receipt.timeline.scheduled',
    values: { local: receipt.scheduledLocalTime, timeZone: receipt.ianaTimeZone },
    at: receipt.scheduledInstant,
    outcome: 'completed',
  });

  steps.push({
    id: 'revalidated',
    messageKey: 'receipt.timeline.revalidated',
    values: {},
    at: receipt.dispatchedAt,
    outcome: 'completed',
    detail: {
      capabilityVersion: receipt.capabilityVersion,
      checksum: receipt.contentVersionChecksum,
    },
  });

  if (input.preparedMediaCount !== null && input.preparedMediaCount > 0) {
    steps.push({
      id: 'media-prepared',
      messageKey: 'receipt.timeline.mediaPrepared',
      values: { count: input.preparedMediaCount },
      at: receipt.dispatchedAt,
      outcome: 'completed',
    });
  }

  steps.push({
    id: 'dispatched',
    messageKey: 'receipt.timeline.dispatched',
    values: { provider: input.provider },
    at: receipt.dispatchedAt,
    outcome: 'completed',
    detail: input.idempotencyKey === null ? {} : { idempotencyKey: input.idempotencyKey },
  });

  // Every attempt, in order, including the successful one.
  for (const attempt of [...receipt.attempts].sort(byAttemptNumber)) {
    steps.push(attemptStep(attempt, input.provider));
  }

  steps.push({
    id: 'published',
    messageKey: 'receipt.timeline.published',
    values: { externalId: receipt.externalPostId },
    at: receipt.publishedAt,
    outcome: 'completed',
    detail: {
      externalPostId: receipt.externalPostId,
      ...(receipt.permalink ? { permalink: receipt.permalink } : {}),
    },
  });

  // Follow up items. A failure here is a warning on its own row and never
  // reaches back to change the root post's step above.
  for (const item of [...receipt.items].sort(byOrder)) {
    steps.push(followUpStep(item, receipt.provider));
  }

  if (input.analyticsSyncedAt) {
    steps.push({
      id: 'analytics',
      messageKey: 'receipt.timeline.analyticsSynced',
      values: {},
      at: input.analyticsSyncedAt,
      outcome: 'completed',
    });
  }

  return steps;
}

function attemptStep(attempt: PublishAttempt, provider: string): TimelineStep {
  const failed = attempt.errorCode !== null;
  if (!failed) {
    return {
      id: `attempt-${attempt.attemptNumber}`,
      messageKey: 'receipt.timeline.providerAccepted',
      values: { provider },
      at: attempt.finishedAt ?? attempt.startedAt,
      outcome: 'completed',
      detail: {
        ...(attempt.httpStatus === null ? {} : { httpStatus: attempt.httpStatus }),
        ...(attempt.providerRequestId === null
          ? {}
          : { providerRequestId: attempt.providerRequestId }),
      },
    };
  }

  const willRetry = attempt.retryable && attempt.nextRetryAt !== null;
  return {
    id: `attempt-${attempt.attemptNumber}`,
    messageKey: willRetry ? 'receipt.timeline.retryScheduled' : 'receipt.timeline.failed',
    values: willRetry
      ? { attempt: attempt.attemptNumber, time: attempt.nextRetryAt ?? '' }
      : { attempt: attempt.attemptNumber },
    at: attempt.finishedAt ?? attempt.startedAt,
    outcome: willRetry ? 'retried' : 'failed',
    detail: {
      ...(attempt.errorCode ? { errorCode: attempt.errorCode } : {}),
      ...(attempt.errorClass ? { errorClass: attempt.errorClass } : {}),
      ...(attempt.httpStatus === null ? {} : { httpStatus: attempt.httpStatus }),
      ...(attempt.providerRequestId === null
        ? {}
        : { providerRequestId: attempt.providerRequestId }),
      ...(attempt.nextRetryAt === null ? {} : { nextRetryAt: attempt.nextRetryAt }),
    },
  };
}

function followUpStep(item: ReceiptItem, provider: string): TimelineStep {
  if (item.state === 'published' && item.externalPostId) {
    return {
      id: `item-${item.order}`,
      messageKey: 'receipt.timeline.commentPublished',
      values: { position: item.order + 1 },
      at: item.publishedAt,
      outcome: 'completed',
      detail: {
        externalPostId: item.externalPostId,
        ...(item.permalink ? { permalink: item.permalink } : {}),
      },
    };
  }

  if (item.state === 'failed_permanently' || item.errorCode !== null) {
    return {
      id: `item-${item.order}`,
      messageKey: 'receipt.timeline.followUpFailed',
      values: { position: item.order + 1 },
      at: item.publishedAt,
      outcome: 'warning',
      detail: item.errorCode ? { errorCode: item.errorCode } : {},
    };
  }

  return {
    id: `item-${item.order}`,
    messageKey: 'receipt.timeline.providerProcessing',
    values: { provider },
    at: item.publishedAt,
    outcome: 'pending',
  };
}

function byAttemptNumber(left: PublishAttempt, right: PublishAttempt): number {
  return left.attemptNumber - right.attemptNumber;
}

function byOrder(left: ReceiptItem, right: ReceiptItem): number {
  return left.order - right.order;
}

/** True when at least one follow up item failed while the root post is live. */
export function hasFailedFollowUp(receipt: PublicationReceipt): boolean {
  return receipt.items.some(
    (item) => item.state === 'failed_permanently' || item.errorCode !== null,
  );
}

/** Milliseconds between the scheduled time and the actual dispatch. */
export function dispatchLatencyMs(receipt: PublicationReceipt): number {
  return new Date(receipt.dispatchedAt).getTime() - new Date(receipt.scheduledInstant).getTime();
}
