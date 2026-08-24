import { ERROR_CODES, type ErrorCode, type PublishState } from '@relay/contracts';

import type {
  BeginPublishAttemptResult,
  ExternalPublication,
  PublishTargetResult,
  ReceiptItemInput,
  RevalidateTargetResult,
  WorkerActivities,
} from '../../activities/types';
import { MESSAGE_KEYS } from '../../messages';
import { backoffMs, toIsoInstant } from '../../runtime/deterministic';
import type {
  ChildWorkflowDescriptor,
  WorkflowRuntime,
  WorkflowStatusView,
  TargetStatusView,
} from '../../runtime/types';
import type {
  PublishTargetOutcome,
  PublishTargetWorkflowInput,
  ThreadSequenceItem,
  ThreadSequenceItemOutcome,
  ThreadSequenceWorkflowOutput,
} from '../inputs';

import { parsePublishTargetOutcome } from '../outputs.schema';

import { threadSequenceDescriptor } from './thread-sequence.core';

/**
 * One target, one child workflow, one external post.
 *
 * The whole file exists to guarantee a single provider create per target under
 * worker crash, provider timeout, duplicated webhook, revoked token and a
 * cancellation racing the dispatch. The guarantees come from three places:
 *
 * - `beginPublishAttempt` writes an in-flight row **before** the network call
 *   and reports back any publication a previous attempt already produced, so a
 *   worker that died mid-create finds its own footprint on the way back.
 * - Temporal never retries the create activity. The retry loop lives here, so
 *   every attempt re-runs the adoption check first.
 * - Where a provider offers no create-time idempotency token,
 *   `ensureNotAlreadyPublished` probes before the create, and an indeterminate
 *   probe on a connector that declares `recreateOnUnknown: false` ends in
 *   `action_required` rather than a second create.
 */

/** Provider create attempts per target before we stop trying. */
export const MAX_PUBLISH_ATTEMPTS = 4;

/** How long we will chase a provider that accepted but has not published. */
export const PROVIDER_PROCESSING_BUDGET_MS = 45 * 60_000;

const POLL_BACKOFF = { initialMs: 10_000, factor: 1.6, maxMs: 5 * 60_000 } as const;
const RETRY_BACKOFF = { initialMs: 15_000, factor: 2, maxMs: 10 * 60_000 } as const;

interface TargetRunState {
  attempts: number;
  providerCreateCalls: number;
  publication: ExternalPublication | null;
  adopted: boolean;
  dispatchedAt: string | null;
  attemptId: string | null;
  lastErrorCode: ErrorCode | null;
  lastMessageKey: string | null;
}

function outcomeOf(
  input: PublishTargetWorkflowInput,
  run: TargetRunState,
  state: PublishState,
  receiptId: string | null,
  failedSequenceItemIds: readonly string[],
): PublishTargetOutcome {
  return {
    targetId: input.target.targetId,
    connectionId: input.target.connectionId,
    provider: input.target.provider,
    state,
    externalPostId: run.publication?.externalPostId ?? null,
    permalink: run.publication?.permalink ?? null,
    receiptId,
    attempts: run.attempts,
    errorCode: run.lastErrorCode,
    messageKey: run.lastMessageKey,
    failedSequenceItemIds,
    providerCreateCalls: run.providerCreateCalls,
  };
}

function statusView(
  runtime: WorkflowRuntime,
  input: PublishTargetWorkflowInput,
  run: TargetRunState,
  phase: string,
  state: PublishState,
): WorkflowStatusView {
  const target: TargetStatusView = {
    targetId: input.target.targetId,
    connectionId: input.target.connectionId,
    provider: input.target.provider,
    state,
    externalPostId: run.publication?.externalPostId ?? null,
    permalink: run.publication?.permalink ?? null,
    attempts: run.attempts,
    lastErrorCode: run.lastErrorCode,
  };
  return {
    workflowId: runtime.workflowId,
    state,
    phase,
    paused: runtime.signals.paused,
    cancelRequested: runtime.signals.cancelled !== null,
    scheduledInstant: input.scheduledInstant,
    attempts: run.attempts,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [target],
  };
}

const PERMANENT_CODES: readonly string[] = [
  ERROR_CODES.CONTENT_INVALID,
  ERROR_CODES.PROVIDER_PERMANENT,
  ERROR_CODES.MEDIA_INVALID,
  ERROR_CODES.MEDIA_TOO_LARGE,
  ERROR_CODES.CAPABILITY_UNSUPPORTED,
];

const ACTION_REQUIRED_CODES: readonly string[] = [
  ERROR_CODES.CONNECTION_ACTION_REQUIRED,
  ERROR_CODES.AUTH_REQUIRED,
  ERROR_CODES.AUTH_INVALID_CREDENTIALS,
  ERROR_CODES.SCOPE_INSUFFICIENT,
  ERROR_CODES.FORBIDDEN,
];

/**
 * Pull a Post Array error code out of anything thrown across an activity boundary.
 * Temporal wraps failures, so the code may be on the error, on its `cause`, or
 * carried as the failure `type`.
 */
export function errorCodeOf(error: unknown): ErrorCode | null {
  const known: Record<string, ErrorCode | undefined> = ERROR_CODES;
  const visit = (candidate: unknown, depth: number): ErrorCode | null => {
    if (depth > 4 || typeof candidate !== 'object' || candidate === null) {
      return null;
    }
    // `Reflect.get` rather than a spread: `Error.cause` is non enumerable, so
    // spreading an error silently loses the chain we are trying to walk.
    for (const key of ['code', 'type']) {
      const value: unknown = Reflect.get(candidate, key);
      if (typeof value === 'string') {
        const resolved = known[value];
        if (resolved !== undefined) {
          return resolved;
        }
      }
    }
    return visit(Reflect.get(candidate, 'cause'), depth + 1);
  };
  return visit(error, 0);
}

/**
 * A thrown create is never assumed to have failed. Only a code that proves the
 * provider refused the request produces a terminal outcome; everything else is
 * `unknown`, which forces a probe before any second attempt.
 */
export function classifyThrownPublish(error: unknown): PublishTargetResult {
  const code = errorCodeOf(error);
  if (code !== null && PERMANENT_CODES.includes(code)) {
    return {
      outcome: 'permanent',
      publication: null,
      providerOperationId: null,
      errorClass: 'permanent_provider',
      errorCode: code,
      messageKey: MESSAGE_KEYS.publish.contentRejected,
      retryAfterMs: null,
    };
  }
  if (code !== null && ACTION_REQUIRED_CODES.includes(code)) {
    return {
      outcome: 'action_required',
      publication: null,
      providerOperationId: null,
      errorClass: 'user_action_required',
      errorCode: code,
      messageKey: MESSAGE_KEYS.publish.connectionActionRequired,
      retryAfterMs: null,
    };
  }
  return {
    outcome: 'unknown',
    publication: null,
    providerOperationId: null,
    errorClass: 'unknown',
    errorCode: code ?? ERROR_CODES.UNKNOWN,
    messageKey: null,
    retryAfterMs: null,
  };
}

/** A confirmation that arrived by signal, normalized to a publication. */
function confirmationPublication(
  runtime: WorkflowRuntime,
  targetId: string,
  externalAccountId: string,
): ExternalPublication | null {
  const confirmation = runtime.signals.confirmationFor(targetId);
  if (confirmation === undefined) {
    return null;
  }
  return {
    externalPostId: confirmation.externalPostId,
    permalink: confirmation.permalink,
    publishedAt: confirmation.observedAt,
    externalAccountId,
  };
}

export async function runPublishTarget(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: PublishTargetWorkflowInput,
): Promise<PublishTargetOutcome> {
  const { ctx, target } = input;
  const run: TargetRunState = {
    attempts: 0,
    providerCreateCalls: 0,
    publication: null,
    adopted: false,
    dispatchedAt: null,
    attemptId: null,
    lastErrorCode: null,
    lastMessageKey: null,
  };

  const publish = (phase: string, state: PublishState): void => {
    runtime.publishStatus(statusView(runtime, input, run, phase, state));
  };

  const stop = async (
    state: PublishState,
    errorCode: ErrorCode | null,
    messageKey: string | null,
  ): Promise<PublishTargetOutcome> => {
    run.lastErrorCode = errorCode;
    run.lastMessageKey = messageKey;
    await activities.setTargetState({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      state,
      errorCode,
      messageKey,
    });
    if (messageKey !== null) {
      await activities.notify({
        ctx,
        messageKey,
        resourceId: input.publishJobId,
        params: { targetId: target.targetId, provider: target.provider },
      });
    }
    publish('stopped', state);
    return outcomeOf(input, run, state, null, []);
  };

  publish('starting', 'scheduled');

  // A cancellation that arrives before anything external happened is honoured.
  if (runtime.signals.cancelled !== null) {
    return stop('canceled', null, MESSAGE_KEYS.publish.canceledByUser);
  }

  // 1. Revalidate the connection, live capabilities, content and policy.
  const revalidation: RevalidateTargetResult = await activities.revalidateTarget({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    connectionId: target.connectionId,
    contentVersionId: input.contentVersionId,
    contentVersionChecksum: input.contentVersionChecksum,
    approvedCapabilityVersion: target.approvedCapabilityVersion,
  });
  publish('revalidated', 'scheduled');

  if (revalidation.verdict === 'blocked') {
    return stop(
      'failed_permanently',
      revalidation.errorCode ?? ERROR_CODES.PROVIDER_PERMANENT,
      revalidation.messageKey ?? MESSAGE_KEYS.publish.preflightBlocked,
    );
  }
  if (revalidation.verdict === 'needs_reapproval') {
    // Capability drift is a reapproval, never a silent adaptation.
    return stop(
      'validation_needed',
      revalidation.errorCode ?? ERROR_CODES.APPROVAL_REQUIRED,
      revalidation.messageKey ?? MESSAGE_KEYS.publish.capabilityDrift,
    );
  }
  if (revalidation.verdict === 'action_required') {
    return stop(
      'action_required',
      revalidation.errorCode ?? ERROR_CODES.CONNECTION_ACTION_REQUIRED,
      revalidation.messageKey ?? MESSAGE_KEYS.publish.connectionActionRequired,
    );
  }

  // 2. Prepare and upload platform specific media.
  await activities.setTargetState({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    state: 'preparing_media',
    errorCode: null,
    messageKey: null,
  });
  publish('preparing_media', 'preparing_media');
  let media;
  try {
    media = await activities.prepareTargetMedia({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      connectionId: target.connectionId,
      contentVersionId: input.contentVersionId,
    });
  } catch (error: unknown) {
    // Media never produced an external post, so failing here is safe and final.
    return stop(
      'failed_permanently',
      errorCodeOf(error) ?? ERROR_CODES.MEDIA_INVALID,
      MESSAGE_KEYS.publish.mediaRejected,
    );
  }

  // 3. Dispatch. One provider create, whatever happens.
  run.dispatchedAt = toIsoInstant(runtime.now());
  await activities.setTargetState({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    state: 'dispatching',
    errorCode: null,
    messageKey: null,
  });
  publish('dispatching', 'dispatching');

  while (run.attempts < MAX_PUBLISH_ATTEMPTS && run.publication === null) {
    // Cancellation is only honoured while no provider call has started.
    if (runtime.signals.cancelled !== null && run.providerCreateCalls === 0) {
      return stop('canceled', null, MESSAGE_KEYS.publish.canceledByUser);
    }

    run.attempts += 1;
    const attempt: BeginPublishAttemptResult = await activities.beginPublishAttempt({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      connectionId: target.connectionId,
      attemptNumber: run.attempts,
      idempotencyKey: input.idempotencyKey,
    });
    run.attemptId = attempt.attemptId;

    // Crash-after-accept: a previous attempt already produced a post.
    if (attempt.alreadyPublished !== null) {
      run.publication = attempt.alreadyPublished;
      run.adopted = true;
      break;
    }

    // Webhook race: the provider confirmed before we resumed.
    const early = confirmationPublication(runtime, target.targetId, target.connectionId);
    if (early !== null) {
      run.publication = early;
      run.adopted = true;
      break;
    }

    // Providers without a create-time idempotency token get probed first.
    if (!revalidation.supportsProviderIdempotency) {
      const probe = await activities.ensureNotAlreadyPublished({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        connectionId: target.connectionId,
        attemptId: attempt.attemptId,
        providerIdempotencyToken: attempt.providerIdempotencyToken,
        since: run.dispatchedAt,
      });
      if (probe.verdict === 'published' && probe.publication !== null) {
        run.publication = probe.publication;
        run.adopted = true;
        break;
      }
      if (probe.verdict === 'indeterminate' && !revalidation.recreateOnUnknown) {
        await activities.finalizeAttempt({
          ctx,
          publishJobId: input.publishJobId,
          targetId: target.targetId,
          attemptId: attempt.attemptId,
          resultState: 'action_required',
          errorClass: 'unknown',
          errorCode: ERROR_CODES.UNKNOWN,
          retryable: false,
          nextRetryAt: null,
        });
        return stop('action_required', ERROR_CODES.UNKNOWN, MESSAGE_KEYS.publish.unconfirmedCreate);
      }
    }

    run.providerCreateCalls += 1;
    let result: PublishTargetResult;
    try {
      result = await activities.publishTarget({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        connectionId: target.connectionId,
        contentVersionId: input.contentVersionId,
        attemptId: attempt.attemptId,
        providerIdempotencyToken: revalidation.supportsProviderIdempotency
          ? attempt.providerIdempotencyToken
          : null,
        preparedMediaIds: media.preparedMediaIds,
      });
    } catch (error: unknown) {
      // A worker that died mid-create, an activity timeout or a transport
      // failure all land here. The outcome is genuinely unknown, so the next
      // step is a probe, never a second create.
      result = classifyThrownPublish(error);
    }
    run.lastErrorCode = result.errorCode;

    if (result.outcome === 'published' && result.publication !== null) {
      run.publication = result.publication;
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'published',
        errorClass: null,
        errorCode: null,
        retryable: false,
        nextRetryAt: null,
      });
      break;
    }

    if (result.outcome === 'processing') {
      const confirmed = await awaitProviderConfirmation(
        runtime,
        activities,
        input,
        run,
        attempt,
        result,
      );
      if (confirmed !== null) {
        run.publication = confirmed;
        break;
      }
      if (run.lastErrorCode === ERROR_CODES.PROVIDER_PERMANENT) {
        return stop(
          'failed_permanently',
          ERROR_CODES.PROVIDER_PERMANENT,
          MESSAGE_KEYS.publish.contentRejected,
        );
      }
      if (run.lastErrorCode === ERROR_CODES.CONNECTION_ACTION_REQUIRED) {
        return stop(
          'action_required',
          ERROR_CODES.CONNECTION_ACTION_REQUIRED,
          MESSAGE_KEYS.publish.connectionActionRequired,
        );
      }
      // Still processing when the budget ran out. Never a second create.
      return stop(
        'action_required',
        ERROR_CODES.PROVIDER_TRANSIENT,
        MESSAGE_KEYS.publish.processingTimedOut,
      );
    }

    if (result.outcome === 'action_required') {
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'action_required',
        errorClass: 'user_action_required',
        errorCode: result.errorCode,
        retryable: false,
        nextRetryAt: null,
      });
      return stop(
        'action_required',
        result.errorCode ?? ERROR_CODES.CONNECTION_ACTION_REQUIRED,
        result.messageKey ?? MESSAGE_KEYS.publish.connectionActionRequired,
      );
    }

    if (result.outcome === 'permanent') {
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'failed_permanently',
        errorClass: 'permanent_provider',
        errorCode: result.errorCode,
        retryable: false,
        nextRetryAt: null,
      });
      return stop(
        'failed_permanently',
        result.errorCode ?? ERROR_CODES.PROVIDER_PERMANENT,
        result.messageKey ?? MESSAGE_KEYS.publish.contentRejected,
      );
    }

    if (result.outcome === 'unknown') {
      // The provider neither confirmed nor refused. Probe before anything else.
      const probe = await activities.ensureNotAlreadyPublished({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        connectionId: target.connectionId,
        attemptId: attempt.attemptId,
        providerIdempotencyToken: attempt.providerIdempotencyToken,
        since: run.dispatchedAt,
      });
      if (probe.verdict === 'published' && probe.publication !== null) {
        run.publication = probe.publication;
        run.adopted = true;
        break;
      }
      if (probe.verdict === 'indeterminate' || !revalidation.recreateOnUnknown) {
        await activities.finalizeAttempt({
          ctx,
          publishJobId: input.publishJobId,
          targetId: target.targetId,
          attemptId: attempt.attemptId,
          resultState: 'action_required',
          errorClass: 'unknown',
          errorCode: ERROR_CODES.UNKNOWN,
          retryable: false,
          nextRetryAt: null,
        });
        return stop('action_required', ERROR_CODES.UNKNOWN, MESSAGE_KEYS.publish.unconfirmedCreate);
      }
    }

    // Transient, or an unknown the connector says is safe to recreate.
    const waitMs =
      result.retryAfterMs ?? backoffMs(`${runtime.workflowId}:retry`, run.attempts, RETRY_BACKOFF);
    const nextRetryAt = toIsoInstant(runtime.now() + waitMs);
    await activities.finalizeAttempt({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      attemptId: attempt.attemptId,
      resultState: 'retry_scheduled',
      errorClass: result.errorClass ?? 'transient_provider',
      errorCode: result.errorCode ?? ERROR_CODES.PROVIDER_TRANSIENT,
      retryable: true,
      nextRetryAt,
    });
    if (run.attempts >= MAX_PUBLISH_ATTEMPTS) {
      break;
    }
    await activities.setTargetState({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      state: 'retry_scheduled',
      errorCode: result.errorCode,
      messageKey: null,
    });
    publish('retry_scheduled', 'retry_scheduled');
    await runtime.sleep(waitMs);
  }

  if (run.publication === null) {
    return stop(
      'failed_permanently',
      run.lastErrorCode ?? ERROR_CODES.PROVIDER_TRANSIENT,
      MESSAGE_KEYS.publish.attemptBudgetExhausted,
    );
  }

  const publication = run.publication;
  await activities.setTargetState({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    state: 'published',
    errorCode: null,
    messageKey: null,
  });
  publish('published', 'published');

  // 4. Ordered sequence items. A failed comment never un-publishes the root.
  let sequence: ThreadSequenceWorkflowOutput = {
    rootExternalPostId: publication.externalPostId,
    items: [],
    failedCount: 0,
    externalCreateCount: 0,
  };
  if (target.threadItemIds.length > 0 && run.attemptId !== null) {
    const items: ThreadSequenceItem[] = target.threadItemIds.map((threadItemId, index) => ({
      threadItemId,
      order: index + 1,
      delaySeconds: target.threadDelaysSeconds[index] ?? 0,
      kind: index === 0 ? 'comment' : 'thread',
    }));
    const child = await runtime.startChild(threadSequenceDescriptor, {
      workflowId: `thread:${ctx.workspaceId}:${input.publishJobId}:${target.targetId}`,
      input: {
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        connectionId: target.connectionId,
        contentVersionId: input.contentVersionId,
        attemptId: run.attemptId,
        rootExternalPostId: publication.externalPostId,
        items,
      },
    });
    sequence = await child.result();
  }

  // 5. Receipt. Idempotent by job and target, so a replay writes one row.
  const receiptItems: ReceiptItemInput[] = [
    ...sequence.items.map((item: ThreadSequenceItemOutcome): ReceiptItemInput => ({
      threadItemId: item.threadItemId,
      kind: item.kind,
      order: item.order,
      state: item.state,
      externalPostId: item.externalPostId,
      permalink: item.permalink,
      delaySeconds: item.delaySeconds,
      publishedAt: item.publishedAt,
      errorCode: item.errorCode,
    })),
  ];
  const receipt = await activities.writeReceipt({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    connectionId: target.connectionId,
    provider: target.provider,
    attemptId: run.attemptId ?? '',
    contentVersionId: input.contentVersionId,
    contentVersionChecksum: input.contentVersionChecksum,
    capabilityVersion: revalidation.capabilityVersion,
    scheduledInstant: input.scheduledInstant,
    scheduledLocalTime: input.scheduledLocalTime,
    ianaTimeZone: input.ianaTimeZone,
    dispatchedAt: run.dispatchedAt ?? publication.publishedAt,
    publication,
    items: receiptItems,
  });

  const failedSequenceItemIds = sequence.items
    .filter((item) => item.state !== 'published')
    .map((item) => item.threadItemId);
  const finalState: PublishState =
    failedSequenceItemIds.length > 0 ? 'partially_published' : 'published';
  if (finalState === 'partially_published') {
    await activities.setTargetState({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      state: 'partially_published',
      errorCode: null,
      messageKey: MESSAGE_KEYS.sequence.itemFailed,
    });
  }

  // 6. Events and notifications.
  await activities.emitEvent({
    ctx,
    event: finalState === 'published' ? 'post.published' : 'post.partially_published',
    resourceId: receipt.receiptId,
    payload: {
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      provider: target.provider,
      externalPostId: publication.externalPostId,
      permalink: publication.permalink,
      adopted: run.adopted,
    },
    dedupeKey: `${input.publishJobId}:${target.targetId}:${finalState}`,
  });

  // A cancellation that lost the race is reported, never hidden.
  if (runtime.signals.cancelled !== null) {
    await activities.notify({
      ctx,
      messageKey: MESSAGE_KEYS.publish.canceledTooLate,
      resourceId: receipt.receiptId,
      params: { targetId: target.targetId, provider: target.provider },
    });
  }

  // 7. Analytics, on provider appropriate intervals.
  await activities.scheduleAnalyticsFetches({
    ctx,
    connectionId: target.connectionId,
    receiptId: receipt.receiptId,
    provider: target.provider,
    publishedAt: publication.publishedAt,
  });

  run.lastMessageKey =
    finalState === 'published' ? MESSAGE_KEYS.publish.published : MESSAGE_KEYS.sequence.itemFailed;
  publish('completed', finalState);
  return outcomeOf(input, run, finalState, receipt.receiptId, failedSequenceItemIds);
}

/**
 * Race the provider's own confirmation against our polling. Whichever answers
 * first wins; both paths adopt the same external id, so a duplicated webhook
 * cannot produce a second publication.
 */
async function awaitProviderConfirmation(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: PublishTargetWorkflowInput,
  run: TargetRunState,
  attempt: BeginPublishAttemptResult,
  initial: PublishTargetResult,
): Promise<ExternalPublication | null> {
  const { ctx, target } = input;
  await activities.setTargetState({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    state: 'provider_processing',
    errorCode: null,
    messageKey: null,
  });

  const startedAt = runtime.now();
  let poll = 0;
  while (runtime.now() - startedAt < PROVIDER_PROCESSING_BUDGET_MS) {
    poll += 1;
    const waitMs = backoffMs(`${runtime.workflowId}:poll`, poll, POLL_BACKOFF);
    const confirmed = await runtime.awaitCondition(
      () => runtime.signals.confirmationFor(target.targetId) !== undefined,
      waitMs,
    );
    if (confirmed) {
      const publication = confirmationPublication(runtime, target.targetId, target.connectionId);
      if (publication !== null) {
        await activities.finalizeAttempt({
          ctx,
          publishJobId: input.publishJobId,
          targetId: target.targetId,
          attemptId: attempt.attemptId,
          resultState: 'published',
          errorClass: null,
          errorCode: null,
          retryable: false,
          nextRetryAt: null,
        });
        return publication;
      }
    }

    const status = await activities.pollPublishStatus({
      ctx,
      publishJobId: input.publishJobId,
      targetId: target.targetId,
      connectionId: target.connectionId,
      attemptId: attempt.attemptId,
      providerOperationId: initial.providerOperationId,
      providerIdempotencyToken: attempt.providerIdempotencyToken,
    });
    if (status.outcome === 'published' && status.publication !== null) {
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'published',
        errorClass: null,
        errorCode: null,
        retryable: false,
        nextRetryAt: null,
      });
      return status.publication;
    }
    if (status.outcome === 'permanent') {
      run.lastErrorCode = ERROR_CODES.PROVIDER_PERMANENT;
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'failed_permanently',
        errorClass: 'permanent_provider',
        errorCode: status.errorCode,
        retryable: false,
        nextRetryAt: null,
      });
      return null;
    }
    if (status.outcome === 'action_required') {
      run.lastErrorCode = ERROR_CODES.CONNECTION_ACTION_REQUIRED;
      await activities.finalizeAttempt({
        ctx,
        publishJobId: input.publishJobId,
        targetId: target.targetId,
        attemptId: attempt.attemptId,
        resultState: 'action_required',
        errorClass: 'user_action_required',
        errorCode: status.errorCode,
        retryable: false,
        nextRetryAt: null,
      });
      return null;
    }
  }

  run.lastErrorCode = ERROR_CODES.PROVIDER_TRANSIENT;
  await activities.finalizeAttempt({
    ctx,
    publishJobId: input.publishJobId,
    targetId: target.targetId,
    attemptId: attempt.attemptId,
    resultState: 'action_required',
    errorClass: 'transient_provider',
    errorCode: ERROR_CODES.PROVIDER_TRANSIENT,
    retryable: false,
    nextRetryAt: null,
  });
  return null;
}

export const publishTargetDescriptor: ChildWorkflowDescriptor<
  PublishTargetWorkflowInput,
  PublishTargetOutcome
> = {
  name: 'publishTargetWorkflow',
  run: runPublishTarget,
  parseResult: parsePublishTargetOutcome,
};
