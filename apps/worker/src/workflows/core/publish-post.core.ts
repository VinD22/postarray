import {
  ERROR_CODES,
  rollUpCampaignState,
  type PublishState,
  type WebhookEventName,
} from '@relay/contracts';

import type { WorkerActivities } from '../../activities/types';
import { MESSAGE_KEYS } from '../../messages';
import { parseInstant, stableSort, toIsoInstant } from '../../runtime/deterministic';
import {
  WORKFLOW_SIGNALS,
  type ChildWorkflowDescriptor,
  type ChildWorkflowHandle,
  type TargetStatusView,
  type WorkflowRuntime,
} from '../../runtime/types';
import type {
  PublishPostWorkflowInput,
  PublishPostWorkflowOutput,
  PublishTargetOutcome,
  PublishTargetPlan,
} from '../inputs';

import { parsePublishPostOutput } from '../outputs.schema';

import { publishTargetDescriptor } from './publish-target.core';

/**
 * The campaign workflow.
 *
 * It owns the durable timer, the campaign level preflight and the roll-up. It
 * owns no provider call at all: every external side effect belongs to a child
 * target workflow, so one failing target produces `partially_published` and
 * never rolls back a target that already published.
 *
 * Signals: `cancel`, `pause`, `resume`, `reschedule`. Queries: `status`.
 */

/** Only used to keep a paused workflow from spinning; it never fires normally. */
const PAUSE_POLL_MS = 60 * 60_000;

function targetStatus(target: PublishTargetPlan): TargetStatusView {
  return {
    targetId: target.targetId,
    connectionId: target.connectionId,
    provider: target.provider,
    state: 'scheduled',
    externalPostId: null,
    permalink: null,
    attempts: 0,
    lastErrorCode: null,
  };
}

function campaignEvent(state: PublishState): WebhookEventName {
  if (state === 'published') {
    return 'post.published';
  }
  if (state === 'partially_published') {
    return 'post.partially_published';
  }
  return 'post.failed';
}

export async function runPublishPost(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: PublishPostWorkflowInput,
): Promise<PublishPostWorkflowOutput> {
  const { ctx } = input;
  const targets = stableSort(input.targets, (target) => target.targetId);
  let executeAt = parseInstant(input.executeAt);
  let scheduledLocalTime = input.scheduledLocalTime;
  let ianaTimeZone = input.ianaTimeZone;
  let phase = 'waiting';

  const publish = (state: PublishState, targetViews: readonly TargetStatusView[]): void => {
    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state,
      phase,
      paused: runtime.signals.paused,
      cancelRequested: runtime.signals.cancelled !== null,
      scheduledInstant: toIsoInstant(executeAt),
      attempts: 0,
      updatedAt: toIsoInstant(runtime.now()),
      targets: targetViews,
    });
  };

  const initialViews = targets.map(targetStatus);
  publish('scheduled', initialViews);

  const abandon = async (
    state: PublishState,
    messageKey: string,
  ): Promise<PublishPostWorkflowOutput> => {
    phase = 'stopped';
    await activities.setJobState({
      ctx,
      publishJobId: input.publishJobId,
      state,
      errorCode: null,
    });
    await activities.notify({
      ctx,
      messageKey,
      resourceId: input.publishJobId,
      params: { publishJobId: input.publishJobId },
    });
    publish(state, initialViews);
    return {
      publishJobId: input.publishJobId,
      state,
      targets: [],
      externalCreateCount: 0,
    };
  };

  // 1 and 2. Durable sleep until the workspace-aware UTC instant, interruptible
  // by cancel, pause, resume and reschedule.
  if (!input.immediate) {
    for (;;) {
      if (runtime.signals.cancelled !== null) {
        return abandon('canceled', MESSAGE_KEYS.publish.canceledByUser);
      }

      const pending = runtime.signals.takeReschedule();
      if (pending !== null) {
        executeAt = parseInstant(pending.instant);
        ianaTimeZone = pending.ianaTimeZone;
        scheduledLocalTime = input.scheduledLocalTime;
        await activities.setJobState({
          ctx,
          publishJobId: input.publishJobId,
          state: 'scheduled',
          errorCode: null,
        });
        await activities.notify({
          ctx,
          messageKey: MESSAGE_KEYS.publish.rescheduled,
          resourceId: input.publishJobId,
          params: { instant: pending.instant, ianaTimeZone: pending.ianaTimeZone },
        });
        publish('scheduled', initialViews);
        continue;
      }

      if (runtime.signals.paused) {
        phase = 'paused';
        publish('scheduled', initialViews);
        await runtime.awaitCondition(
          () =>
            !runtime.signals.paused ||
            runtime.signals.cancelled !== null ||
            runtime.signals.peekReschedule() !== null,
          PAUSE_POLL_MS,
        );
        continue;
      }

      const remaining = executeAt - runtime.now();
      if (remaining <= 0) {
        break;
      }
      phase = 'waiting';
      await runtime.awaitCondition(
        () =>
          runtime.signals.cancelled !== null ||
          runtime.signals.paused ||
          runtime.signals.peekReschedule() !== null,
        remaining,
      );
    }
  }

  if (runtime.signals.cancelled !== null) {
    return abandon('canceled', MESSAGE_KEYS.publish.canceledByUser);
  }

  // 3. Campaign level preflight: entitlement, cadence, duplicates, approval.
  phase = 'preflight';
  publish('scheduled', initialViews);
  const preflight = await activities.preflightCampaign({
    ctx,
    publishJobId: input.publishJobId,
    contentItemId: input.contentItemId,
    contentVersionId: input.contentVersionId,
    contentVersionChecksum: input.contentVersionChecksum,
    targetIds: targets.map((target) => target.targetId),
    scheduledInstant: toIsoInstant(executeAt),
  });

  if (preflight.verdict === 'blocked') {
    return abandon(
      'failed_permanently',
      preflight.messageKey ?? MESSAGE_KEYS.publish.preflightBlocked,
    );
  }
  if (preflight.verdict === 'needs_reapproval') {
    return abandon(
      'validation_needed',
      preflight.messageKey ?? MESSAGE_KEYS.publish.capabilityDrift,
    );
  }
  if (preflight.verdict === 'action_required') {
    return abandon(
      'action_required',
      preflight.messageKey ?? MESSAGE_KEYS.publish.connectionActionRequired,
    );
  }

  const blocked = new Set(preflight.blockedTargetIds);
  const runnable = targets.filter((target) => !blocked.has(target.targetId));
  if (runnable.length === 0) {
    return abandon('failed_permanently', MESSAGE_KEYS.publish.preflightBlocked);
  }

  await activities.emitEvent({
    ctx,
    event: 'post.dispatching',
    resourceId: input.publishJobId,
    payload: {
      publishJobId: input.publishJobId,
      contentItemId: input.contentItemId,
      targetCount: runnable.length,
    },
    dedupeKey: `${input.publishJobId}:dispatching`,
  });

  // 4 to 8. Every target is an independent child workflow.
  phase = 'dispatching';
  publish('dispatching', initialViews);
  const handles: ChildWorkflowHandle<PublishTargetOutcome>[] = [];
  for (const target of runnable) {
    const handle = await runtime.startChild(publishTargetDescriptor, {
      workflowId: `publish:${ctx.workspaceId}:${input.publishJobId}:${target.targetId}`,
      input: {
        ctx,
        publishJobId: input.publishJobId,
        contentItemId: input.contentItemId,
        contentVersionId: input.contentVersionId,
        contentVersionChecksum: input.contentVersionChecksum,
        idempotencyKey: `${input.idempotencyKey}:${target.targetId}`,
        scheduledInstant: toIsoInstant(executeAt),
        scheduledLocalTime,
        ianaTimeZone,
        target,
      },
      searchAttributes: {
        workspaceId: ctx.workspaceId,
        provider: target.provider,
        connectionId: target.connectionId,
        jobId: input.publishJobId,
        correlationId: ctx.correlationId,
      },
    });
    handles.push(handle);
  }

  const outcomes = await collectTargets(runtime, handles);

  // 9. Roll up. A target that published externally is never rolled back.
  const blockedOutcomes: PublishTargetOutcome[] = targets
    .filter((target) => blocked.has(target.targetId))
    .map((target) => ({
      targetId: target.targetId,
      connectionId: target.connectionId,
      provider: target.provider,
      state: 'action_required' as PublishState,
      externalPostId: null,
      permalink: null,
      receiptId: null,
      attempts: 0,
      errorCode: preflight.errorCode ?? ERROR_CODES.CONNECTION_ACTION_REQUIRED,
      messageKey: preflight.messageKey ?? MESSAGE_KEYS.publish.connectionActionRequired,
      failedSequenceItemIds: [],
      providerCreateCalls: 0,
    }));

  const all = [...outcomes, ...blockedOutcomes];
  const campaignState = rollUpCampaignState(all.map((outcome) => outcome.state));
  const externalCreateCount = all.reduce(
    (total, outcome) => total + outcome.providerCreateCalls,
    0,
  );

  phase = 'completed';
  await activities.setJobState({
    ctx,
    publishJobId: input.publishJobId,
    state: campaignState,
    errorCode: all.find((outcome) => outcome.errorCode !== null)?.errorCode ?? null,
  });

  await activities.emitEvent({
    ctx,
    event: campaignEvent(campaignState),
    resourceId: input.publishJobId,
    payload: {
      publishJobId: input.publishJobId,
      contentItemId: input.contentItemId,
      state: campaignState,
      targets: all.map((outcome) => ({
        targetId: outcome.targetId,
        provider: outcome.provider,
        state: outcome.state,
        externalPostId: outcome.externalPostId,
        permalink: outcome.permalink,
      })),
    },
    dedupeKey: `${input.publishJobId}:${campaignState}`,
  });

  publish(
    campaignState,
    all.map((outcome) => ({
      targetId: outcome.targetId,
      connectionId: outcome.connectionId,
      provider: outcome.provider,
      state: outcome.state,
      externalPostId: outcome.externalPostId,
      permalink: outcome.permalink,
      attempts: outcome.attempts,
      lastErrorCode: outcome.errorCode,
    })),
  );

  return {
    publishJobId: input.publishJobId,
    state: campaignState,
    targets: all,
    externalCreateCount,
  };
}

/**
 * Await every child, forwarding a cancellation that arrives mid flight exactly
 * once. Children decide for themselves whether the cancel arrived in time.
 */
async function collectTargets(
  runtime: WorkflowRuntime,
  handles: readonly ChildWorkflowHandle<PublishTargetOutcome>[],
): Promise<PublishTargetOutcome[]> {
  const progress = { finished: false };
  const results = Promise.all(handles.map((handle) => handle.result())).then((outcomes) => {
    progress.finished = true;
    return outcomes;
  });

  const forwarder = (async (): Promise<void> => {
    await runtime.awaitCondition(() => progress.finished || runtime.signals.cancelled !== null);
    if (progress.finished || runtime.signals.cancelled === null) {
      return;
    }
    const request = runtime.signals.cancelled;
    for (const handle of handles) {
      await handle.signal(WORKFLOW_SIGNALS.cancel, request);
    }
  })();

  const outcomes = await results;
  await forwarder;
  return outcomes;
}

export const publishPostDescriptor: ChildWorkflowDescriptor<
  PublishPostWorkflowInput,
  PublishPostWorkflowOutput
> = {
  name: 'publishPostWorkflow',
  run: runPublishPost,
  parseResult: parsePublishPostOutput,
};
