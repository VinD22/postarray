import type {
  RuleInput,
  RulePreflightView as ApiRulePreflightView,
  RuleRunView as ApiRuleRunView,
  RuleView as ApiRuleView,
} from '@/lib/api';

import type {
  MeasurementSettings,
  ParameterValue,
  RuleDraft,
  RulePreflight,
  RuleRunView,
  RuleState,
} from './types';

const CONSEQUENTIAL_ACTIONS = new Set<string>(CONSEQUENTIAL_RULE_ACTION_KINDS);

export function toRuleInput(draft: RuleDraft, brandId: string): RuleInput {
  if (draft.trigger === null) throw new Error('RULE_TRIGGER_REQUIRED');
  const { kind, parameters, measurement } = draft.trigger;
  return {
    brandId,
    name: draft.name,
    trigger: {
      kind,
      config: {
        ...parameters,
        ...(measurement === undefined ? {} : { measurement }),
      },
    },
    conditions: draft.conditions.map((condition) => ({
      kind: condition.kind,
      config: { ...condition.parameters },
    })),
    actions: draft.actions.map((action) => ({
      kind: action.kind,
      config: { ...action.parameters },
    })),
    preauthorizedConnectionIds: [...draft.connectionIds],
    delaySeconds: draft.delaySeconds,
    endCondition: draft.end,
    requiresApproval: true,
    maxExecutionsPerSource:
      kind === 'analytics_threshold' ? (measurement?.maxExecutionsPerPost ?? null) : null,
    cooldownSeconds: kind === 'analytics_threshold' ? (measurement?.cooldownSeconds ?? null) : null,
    measurementWindowSeconds:
      kind === 'analytics_threshold' ? (measurement?.windowSeconds ?? null) : null,
  };
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toParameters(
  value: Readonly<Record<string, unknown>>,
): Readonly<Record<string, ParameterValue>> {
  const parameters: Record<string, ParameterValue> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'measurement') continue;
    if (
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean' ||
      entry === null
    ) {
      parameters[key] = entry;
    } else if (Array.isArray(entry) && entry.every((item) => typeof item === 'string')) {
      parameters[key] = entry;
    }
  }
  return parameters;
}

function toMeasurement(value: unknown): MeasurementSettings | undefined {
  if (!isRecord(value)) return undefined;
  const metric = value['metric'];
  const threshold = value['threshold'];
  const windowSeconds = value['windowSeconds'];
  const expirySeconds = value['expirySeconds'];
  const cooldownSeconds = value['cooldownSeconds'];
  const maxExecutionsPerPost = value['maxExecutionsPerPost'];
  const staleAfterSeconds = value['staleAfterSeconds'];
  if (
    typeof metric !== 'string' ||
    typeof threshold !== 'number' ||
    typeof windowSeconds !== 'number' ||
    typeof expirySeconds !== 'number' ||
    typeof cooldownSeconds !== 'number' ||
    typeof maxExecutionsPerPost !== 'number' ||
    typeof staleAfterSeconds !== 'number'
  ) {
    return undefined;
  }
  return {
    metric,
    threshold,
    windowSeconds,
    expirySeconds,
    cooldownSeconds,
    maxExecutionsPerPost,
    staleAfterSeconds,
  };
}

function toEditorState(state: ApiRuleView['state']): RuleState {
  switch (state) {
    case 'active':
      return 'active';
    case 'paused':
      return 'paused';
    case 'disabled':
    case 'archived':
      return 'stopped';
    case 'draft':
    default:
      return 'draft';
  }
}

export function toRuleDraft(rule: ApiRuleView): RuleDraft {
  const measurement = toMeasurement(rule.trigger.config['measurement']);
  const followUpConnectionId = rule.actions.find(
    (action) => action.kind === 'cross_account_follow_up',
  )?.config['account'];
  const hasCrossAccountAction = followUpConnectionId !== undefined;
  return {
    id: rule.id,
    name: rule.name,
    state: toEditorState(rule.state),
    trigger: {
      kind: rule.trigger.kind,
      parameters: toParameters(rule.trigger.config),
      ...(measurement === undefined ? {} : { measurement }),
    },
    conditions: rule.conditions.map((condition, index) => ({
      id: `condition-${String(index)}`,
      kind: condition.kind,
      parameters: toParameters(condition.config),
    })),
    actions: rule.actions.map((action, index) => ({
      id: `action-${String(index)}`,
      kind: action.kind,
      parameters: toParameters(action.config),
    })),
    delaySeconds: rule.delaySeconds,
    end: rule.endCondition,
    connectionIds: [...rule.preauthorizedConnectionIds],
    crossAccount: {
      enabled: hasCrossAccountAction,
      sourceConnectionId: rule.preauthorizedConnectionIds[0] ?? null,
      followUpConnectionId: typeof followUpConnectionId === 'string' ? followUpConnectionId : null,
      preauthorized: hasCrossAccountAction && rule.preauthorizedConnectionIds.length > 0,
    },
  };
}

function toRunOutcome(run: ApiRuleRunView): RuleRunView['outcome'] {
  if (run.isTest) return 'test';
  switch (run.state) {
    case 'pending':
      return 'pending';
    case 'running':
      return 'running';
    case 'succeeded':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'blocked_by_policy':
    case 'skipped':
    default:
      return 'skipped';
  }
}

export function toRuleRun(run: ApiRuleRunView): RuleRunView {
  return {
    id: run.id,
    startedAt: run.startedAt,
    outcome: toRunOutcome(run),
    externalActionCount: run.performedActions.filter((action) =>
      CONSEQUENTIAL_ACTIONS.has(action.kind),
    ).length,
    skippedReason: run.blockedReasonKey,
    errorCode: run.errorCode,
  };
}

export function toRulePreflight(value: ApiRulePreflightView): RulePreflight {
  const blockerKey = (key: string): string => {
    switch (key) {
      case 'rule.blocked.no_preauthorized_connections':
        return 'automation.editor.error.noAccounts';
      case 'rule.blocked.connection_not_active':
      default:
        return 'automation.state.errorBody';
    }
  };
  return {
    accounts: value.connections,
    maxExternalActionsPerRun: value.maxExternalActionsPerRun,
    cadenceImpactPerDay: value.cadenceImpactPerDay,
    requiresApproval: value.requiresApproval,
    requiredApprovalLevel: value.requiredApprovalLevel,
    providerRestrictionKeys: value.providerRestrictionKeys,
    estimatedCostMinor: value.estimatedCostMinor,
    costCurrency: value.costCurrency,
    duplicateRiskKey: value.duplicateRiskKey,
    blockers: value.blockedReasonKeys.map(blockerKey),
  };
}

export function parseSampleEvent(payload: string | undefined): Readonly<Record<string, unknown>> {
  if (payload === undefined || payload.trim() === '') return {};
  const parsed: unknown = JSON.parse(payload);
  if (!isRecord(parsed)) throw new TypeError('OBJECT_REQUIRED');
  return parsed;
}
import { CONSEQUENTIAL_RULE_ACTION_KINDS } from '@relay/contracts';
