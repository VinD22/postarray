import { actionSpec, conditionSpec, triggerSpec } from './catalog';
import type { MeasurementSettings, RuleDraft } from './types';

/**
 * What must be true before a rule can be saved or turned on.
 *
 * Two lists, because they are two different decisions. `saveIssues` is about a
 * rule being coherent at all. `activationBlockers` is about a rule being safe
 * to let loose on real accounts, and it is deliberately stricter: a rule with a
 * cross account follow up that has not been preauthorized can be saved as a
 * draft and read by a colleague, but it cannot run.
 *
 * Every entry is a catalog key plus its values. Nothing here contains English.
 */

export interface Issue {
  readonly key: string;
  readonly values?: Readonly<Record<string, string | number>>;
  /** The field to move focus to when the user activates the issue. */
  readonly field?: string;
}

export const DEFAULT_MEASUREMENT: MeasurementSettings = {
  metric: 'comments',
  threshold: 10,
  /** One day of watching is long enough for most provider aggregation lags. */
  windowSeconds: 86_400,
  /** Stop watching a source post after a week whatever happens. */
  expirySeconds: 604_800,
  /** An hour between executions for the same source post. */
  cooldownSeconds: 3_600,
  /** Run once per source post. This is the documented default. */
  maxExecutionsPerPost: 1,
  /** A reading older than six hours does not authorize an external action. */
  staleAfterSeconds: 21_600,
};

export function saveIssues(draft: RuleDraft): readonly Issue[] {
  const issues: Issue[] = [];

  if (draft.name.trim().length === 0) {
    issues.push({ key: 'automation.editor.error.missingParameter', values: { label: '' }, field: 'name' });
  }

  if (draft.trigger === null) {
    issues.push({ key: 'automation.editor.error.noTrigger', field: 'trigger' });
  } else {
    const spec = triggerSpec(draft.trigger.kind);
    for (const parameter of spec.parameters) {
      if (parameter.required && isEmpty(draft.trigger.parameters[parameter.name])) {
        issues.push({
          key: 'automation.editor.error.missingParameter',
          values: { label: parameter.labelKey },
          field: `trigger.${parameter.name}`,
        });
      }
    }
    if (spec.requiresMeasurement) {
      issues.push(...measurementIssues(draft.trigger.measurement));
    }
  }

  for (const condition of draft.conditions) {
    const spec = conditionSpec(condition.kind);
    for (const parameter of spec.parameters) {
      if (parameter.required && isEmpty(condition.parameters[parameter.name])) {
        issues.push({
          key: 'automation.editor.error.missingParameter',
          values: { label: parameter.labelKey },
          field: `condition.${condition.id}.${parameter.name}`,
        });
      }
    }
  }

  if (draft.actions.length === 0) {
    issues.push({ key: 'automation.editor.error.noAction', field: 'actions' });
  }

  for (const action of draft.actions) {
    const spec = actionSpec(action.kind);
    for (const parameter of spec.parameters) {
      if (parameter.required && isEmpty(action.parameters[parameter.name])) {
        issues.push({
          key: 'automation.editor.error.missingParameter',
          values: { label: parameter.labelKey },
          field: `action.${action.id}.${parameter.name}`,
        });
      }
    }
  }

  if (draft.connectionIds.length === 0 && hasConsequentialAction(draft)) {
    issues.push({ key: 'automation.editor.error.noAccounts', field: 'accounts' });
  }

  if (requiresCrossAccountPreauthorization(draft) && !draft.crossAccount.preauthorized) {
    issues.push({
      key: 'automation.crossAccount.preauthorizeRequired',
      field: 'crossAccount',
    });
  }

  return issues;
}

/** Everything in `saveIssues`, plus what only matters once a rule can act. */
export function activationBlockers(draft: RuleDraft): readonly Issue[] {
  const blockers = [...saveIssues(draft)];

  if (
    requiresCrossAccountPreauthorization(draft) &&
    (draft.crossAccount.sourceConnectionId === null ||
      draft.crossAccount.followUpConnectionId === null)
  ) {
    blockers.push({
      key: 'automation.crossAccount.preauthorizeRequired',
      field: 'crossAccount',
    });
  }

  return blockers;
}

function measurementIssues(
  measurement: MeasurementSettings | undefined,
): readonly Issue[] {
  if (!measurement) {
    return [
      { key: 'automation.threshold.windowRequired', field: 'measurement.windowSeconds' },
      { key: 'automation.threshold.cooldownRequired', field: 'measurement.cooldownSeconds' },
    ];
  }

  const issues: Issue[] = [];
  if (measurement.windowSeconds <= 0) {
    issues.push({ key: 'automation.threshold.windowRequired', field: 'measurement.windowSeconds' });
  }
  if (measurement.cooldownSeconds <= 0) {
    issues.push({
      key: 'automation.threshold.cooldownRequired',
      field: 'measurement.cooldownSeconds',
    });
  }
  if (measurement.expirySeconds <= 0) {
    issues.push({ key: 'automation.threshold.windowRequired', field: 'measurement.expirySeconds' });
  }
  if (measurement.maxExecutionsPerPost < 1) {
    issues.push({
      key: 'automation.threshold.maxExecutions',
      values: { count: measurement.maxExecutionsPerPost },
      field: 'measurement.maxExecutionsPerPost',
    });
  }
  if (measurement.staleAfterSeconds <= 0) {
    issues.push({ key: 'automation.threshold.staleMetric', field: 'measurement.staleAfterSeconds' });
  }
  return issues;
}

export function hasConsequentialAction(draft: RuleDraft): boolean {
  return draft.actions.some((action) => actionSpec(action.kind).consequential);
}

export function requiresCrossAccountPreauthorization(draft: RuleDraft): boolean {
  return draft.actions.some(
    (action) => actionSpec(action.kind).requiresCrossAccountPreauthorization === true,
  );
}

/**
 * The most external actions one run can produce.
 *
 * Counted rather than estimated: every consequential action can touch every
 * selected account once. The server recomputes this and its number is the one
 * shown in the preflight, but the editor needs a figure while the user is still
 * typing.
 */
export function maxExternalActionsPerRun(draft: RuleDraft): number {
  const consequential = draft.actions.filter(
    (action) => actionSpec(action.kind).consequential,
  ).length;
  return consequential * Math.max(1, draft.connectionIds.length);
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}
