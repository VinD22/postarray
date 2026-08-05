import { CONSEQUENTIAL_RULE_ACTION_KINDS } from '@relay/contracts';

import type { ExecuteRuleActionResult, WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { stableSort, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type { AutomationRuleWorkflowInput, AutomationRuleWorkflowOutput } from '../inputs.js';

/**
 * The trigger, condition and action engine.
 *
 * The reservation step is the safety interlock. Before a single action runs,
 * `reserveRuleExecution` atomically checks the cooldown, the expiry, the
 * maximum execution count and the once-per-source-post rule, and claims the
 * slot. Two concurrent triggers for the same source therefore produce one run,
 * not two, and a rule can never exceed its own budget because the workflow
 * asked twice.
 *
 * Every action that touches the outside world is marked `consequential` and is
 * subject to the approval policy, which the application layer enforces inside
 * `executeRuleAction`. This workflow never bypasses it.
 */

/** The kill switch is checked before every action, not only at the start. */
export async function runAutomationRule(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: AutomationRuleWorkflowInput,
): Promise<AutomationRuleWorkflowOutput> {
  const { ctx } = input;
  const startedAt = toIsoInstant(runtime.now());
  const executedActionIds: string[] = [];
  const actionResults: {
    readonly actionId: string;
    readonly status: ExecuteRuleActionResult['status'];
  }[] = [];
  let externalActionCount = 0;

  const finish = async (
    status: 'succeeded' | 'skipped' | 'failed',
    reasonKey: string | null,
  ): Promise<AutomationRuleWorkflowOutput> => {
    await activities.recordRuleRun({
      ctx,
      ruleId: input.ruleId,
      runId: input.runId,
      startedAt,
      finishedAt: toIsoInstant(runtime.now()),
      status,
      actionResults,
      reasonKey,
    });
    await activities.emitEvent({
      ctx,
      event: status === 'failed' ? 'rule.run_failed' : 'rule.run_completed',
      resourceId: input.runId,
      payload: {
        ruleId: input.ruleId,
        runId: input.runId,
        status,
        reasonKey,
        executedActionIds,
        dryRun: input.dryRun,
      },
      dedupeKey: `rule:${input.runId}:${status}`,
    });
    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: status === 'failed' ? 'failed' : 'completed',
      phase: status,
      paused: false,
      cancelRequested: runtime.signals.cancelled !== null,
      scheduledInstant: null,
      attempts: executedActionIds.length,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });
    return {
      ruleId: input.ruleId,
      runId: input.runId,
      status,
      reasonKey,
      executedActionIds,
      externalActionCount,
    };
  };

  if (runtime.signals.killSwitchThrown || runtime.signals.cancelled !== null) {
    return finish('skipped', MESSAGE_KEYS.rule.killSwitch);
  }

  const rule = await activities.loadRuleDefinition({ ctx, ruleId: input.ruleId });
  if (!rule.enabled) {
    return finish('skipped', MESSAGE_KEYS.rule.disabled);
  }

  const evaluation = await activities.evaluateRuleConditions({
    ctx,
    ruleId: input.ruleId,
    runId: input.runId,
    sourceKey: input.sourceKey,
    event: input.event,
  });
  if (!evaluation.matched) {
    return finish('skipped', MESSAGE_KEYS.rule.conditionsNotMet);
  }

  // Claim the execution slot before anything external happens.
  const reservation = await activities.reserveRuleExecution({
    ctx,
    ruleId: input.ruleId,
    runId: input.runId,
    sourceKey: input.sourceKey,
    now: toIsoInstant(runtime.now()),
  });
  if (reservation.verdict !== 'allowed') {
    const reasonKey =
      reservation.verdict === 'cooldown'
        ? MESSAGE_KEYS.rule.cooldown
        : reservation.verdict === 'expired'
          ? MESSAGE_KEYS.rule.expired
          : reservation.verdict === 'max_executions'
            ? MESSAGE_KEYS.rule.maxExecutions
            : reservation.verdict === 'duplicate_source'
              ? MESSAGE_KEYS.rule.duplicateSource
              : MESSAGE_KEYS.rule.disabled;
    return finish('skipped', reasonKey);
  }

  const ordered = stableSort(
    rule.actions,
    (action) => String(action.order).padStart(6, '0') + action.actionId,
  );

  let failed = false;
  for (const action of ordered) {
    if (runtime.signals.killSwitchThrown || runtime.signals.cancelled !== null) {
      return finish(
        executedActionIds.length > 0 ? 'succeeded' : 'skipped',
        MESSAGE_KEYS.rule.killSwitch,
      );
    }
    if (action.delaySeconds > 0) {
      await runtime.awaitCondition(
        () => runtime.signals.killSwitchThrown || runtime.signals.cancelled !== null,
        action.delaySeconds * 1_000,
      );
      if (runtime.signals.killSwitchThrown || runtime.signals.cancelled !== null) {
        return finish('succeeded', MESSAGE_KEYS.rule.killSwitch);
      }
    }

    const result = await activities.executeRuleAction({
      ctx,
      ruleId: input.ruleId,
      runId: input.runId,
      actionId: action.actionId,
      kind: action.kind,
      event: input.event,
      dryRun: input.dryRun,
    });
    actionResults.push({ actionId: action.actionId, status: result.status });

    if (result.status === 'succeeded') {
      executedActionIds.push(action.actionId);
      if (CONSEQUENTIAL_RULE_ACTION_KINDS.includes(action.kind)) {
        externalActionCount += 1;
      }
      continue;
    }
    if (result.status === 'approval_required') {
      // The run stops here. A human decides, and the approval carries the run
      // forward: the workflow never waits indefinitely holding a reservation.
      return finish('skipped', result.messageKey ?? MESSAGE_KEYS.rule.approvalRequired);
    }
    if (result.status === 'failed') {
      failed = true;
      break;
    }
  }

  return finish(failed ? 'failed' : 'succeeded', failed ? null : MESSAGE_KEYS.rule.completed);
}

export const automationRuleDescriptor: ChildWorkflowDescriptor<
  AutomationRuleWorkflowInput,
  AutomationRuleWorkflowOutput
> = {
  name: 'automationRuleWorkflow',
  run: runAutomationRule,
};
