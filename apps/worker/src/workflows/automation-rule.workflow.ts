import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runAutomationRule } from './core/automation-rule.core.js';
import type { AutomationRuleWorkflowInput, AutomationRuleWorkflowOutput } from './inputs.js';

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
