import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runAutomationRule } from './core/automation-rule.core';
import type { AutomationRuleWorkflowInput, AutomationRuleWorkflowOutput } from './inputs';

/**
 * One automation rule run.

 * Workflow id: `rule:{workspaceId}:{ruleId}:{runKey}`. The kill switch is the
 * `killSwitch` signal and is checked before every action.
 */
export async function automationRuleWorkflow(
  input: AutomationRuleWorkflowInput,
): Promise<AutomationRuleWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runAutomationRule(runtime, workerActivities, input);
}
