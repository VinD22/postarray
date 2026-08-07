import {
  RULE_ACTION_KINDS,
  RULE_CONDITION_KINDS,
  RULE_TRIGGER_KINDS,
  type RuleActionKind,
  type RuleConditionKind,
  type RuleTriggerKind,
} from '@relay/contracts';

import type {
  MeasurementSettings,
  ParameterValue,
  RuleActionDraft,
  RuleConditionDraft,
  RuleDraft,
  RuleEnd,
  RuleState,
} from './types';

/**
 * The rule as the API sees it, and back again.
 *
 * The structured and API views of the editor are not a second representation of
 * the rule, they are the rule. Round tripping has to be lossless in both
 * directions or an advanced user who drops into JSON, changes one field and
 * switches back silently loses everything the sentence builder knew and the
 * JSON view did not. `rule-serialization.test.ts` asserts that property.
 *
 * Parsing is defensive because this JSON is editable by hand. Anything that is
 * not a rule comes back as a reason string the editor shows next to the field,
 * never as a partially applied rule.
 */

const RULE_STATES: readonly RuleState[] = ['draft', 'testing', 'active', 'paused', 'stopped'];

export interface RuleJson {
  readonly id: string | null;
  readonly name: string;
  readonly state: RuleState;
  readonly connectionIds: readonly string[];
  readonly trigger: {
    readonly kind: RuleTriggerKind;
    readonly parameters: Readonly<Record<string, ParameterValue>>;
    readonly measurement: MeasurementSettings | null;
  } | null;
  readonly conditions: readonly {
    readonly id: string;
    readonly kind: RuleConditionKind;
    readonly parameters: Readonly<Record<string, ParameterValue>>;
  }[];
  readonly actions: readonly {
    readonly id: string;
    readonly kind: RuleActionKind;
    readonly parameters: Readonly<Record<string, ParameterValue>>;
  }[];
  readonly delaySeconds: number;
  readonly end: RuleEnd;
  readonly crossAccount: RuleDraft['crossAccount'];
}

export function toRuleJson(draft: RuleDraft): RuleJson {
  return {
    id: draft.id,
    name: draft.name,
    state: draft.state,
    connectionIds: [...draft.connectionIds],
    trigger: draft.trigger
      ? {
          kind: draft.trigger.kind,
          parameters: { ...draft.trigger.parameters },
          measurement: draft.trigger.measurement ?? null,
        }
      : null,
    conditions: draft.conditions.map((condition) => ({
      id: condition.id,
      kind: condition.kind,
      parameters: { ...condition.parameters },
    })),
    actions: draft.actions.map((action) => ({
      id: action.id,
      kind: action.kind,
      parameters: { ...action.parameters },
    })),
    delaySeconds: draft.delaySeconds,
    end: draft.end,
    crossAccount: draft.crossAccount,
  };
}

/** Pretty printed, stable key order, ready to be edited by hand. */
export function serializeRule(draft: RuleDraft): string {
  return `${JSON.stringify(toRuleJson(draft), null, 2)}\n`;
}

export type ParseResult =
  | { readonly ok: true; readonly draft: RuleDraft }
  | { readonly ok: false; readonly reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readParameters(value: unknown): Readonly<Record<string, ParameterValue>> {
  if (!isRecord(value)) {
    return {};
  }
  const parameters: Record<string, ParameterValue> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean' ||
      entry === null
    ) {
      parameters[key] = entry;
      continue;
    }
    if (Array.isArray(entry) && entry.every((item) => typeof item === 'string')) {
      parameters[key] = entry as readonly string[];
    }
  }
  return parameters;
}

function readMeasurement(value: unknown): MeasurementSettings | null {
  if (!isRecord(value)) {
    return null;
  }
  const numbers = [
    'threshold',
    'windowSeconds',
    'expirySeconds',
    'cooldownSeconds',
    'maxExecutionsPerPost',
    'staleAfterSeconds',
  ] as const;
  for (const key of numbers) {
    if (typeof value[key] !== 'number') {
      return null;
    }
  }
  if (typeof value.metric !== 'string') {
    return null;
  }
  return {
    metric: value.metric,
    threshold: value.threshold as number,
    windowSeconds: value.windowSeconds as number,
    expirySeconds: value.expirySeconds as number,
    cooldownSeconds: value.cooldownSeconds as number,
    maxExecutionsPerPost: value.maxExecutionsPerPost as number,
    staleAfterSeconds: value.staleAfterSeconds as number,
  };
}

function readEnd(value: unknown): RuleEnd {
  if (isRecord(value)) {
    if (value.kind === 'count' && typeof value.runs === 'number') {
      return { kind: 'count', runs: value.runs };
    }
  }
  return { kind: 'manual' };
}

function readCrossAccount(value: unknown): RuleDraft['crossAccount'] {
  if (!isRecord(value)) {
    return {
      enabled: false,
      sourceConnectionId: null,
      followUpConnectionId: null,
      preauthorized: false,
    };
  }
  return {
    // Preauthorization defaults to false whatever the JSON says is enabled, so
    // hand editing cannot switch on a cross account action without the explicit
    // confirmation the editor requires.
    enabled: value.enabled === true,
    sourceConnectionId:
      typeof value.sourceConnectionId === 'string' ? value.sourceConnectionId : null,
    followUpConnectionId:
      typeof value.followUpConnectionId === 'string' ? value.followUpConnectionId : null,
    preauthorized: value.preauthorized === true,
  };
}

/** Parse hand edited JSON back into a draft, or say why it is not a rule. */
export function parseRule(source: string): ParseResult {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.name : 'SyntaxError' };
  }

  if (!isRecord(value)) {
    return { ok: false, reason: 'NOT_AN_OBJECT' };
  }
  if (typeof value.name !== 'string') {
    return { ok: false, reason: 'NAME_MISSING' };
  }

  const state = RULE_STATES.includes(value.state as RuleState)
    ? (value.state as RuleState)
    : 'draft';

  let trigger: RuleDraft['trigger'] = null;
  if (isRecord(value.trigger)) {
    const kind = value.trigger.kind;
    if (!RULE_TRIGGER_KINDS.includes(kind as RuleTriggerKind)) {
      return { ok: false, reason: 'TRIGGER_UNKNOWN' };
    }
    const measurement = readMeasurement(value.trigger.measurement);
    trigger = {
      kind: kind as RuleTriggerKind,
      parameters: readParameters(value.trigger.parameters),
      ...(measurement ? { measurement } : {}),
    };
  }

  const rawConditions = Array.isArray(value.conditions) ? value.conditions : [];
  const conditions: RuleConditionDraft[] = [];
  for (const [index, entry] of rawConditions.entries()) {
    if (!isRecord(entry) || !RULE_CONDITION_KINDS.includes(entry.kind as RuleConditionKind)) {
      return { ok: false, reason: 'CONDITION_UNKNOWN' };
    }
    conditions.push({
      id: typeof entry.id === 'string' ? entry.id : `condition-${index}`,
      kind: entry.kind as RuleConditionKind,
      parameters: readParameters(entry.parameters),
    });
  }

  const rawActions = Array.isArray(value.actions) ? value.actions : [];
  const actions: RuleActionDraft[] = [];
  for (const [index, entry] of rawActions.entries()) {
    if (!isRecord(entry) || !RULE_ACTION_KINDS.includes(entry.kind as RuleActionKind)) {
      return { ok: false, reason: 'ACTION_UNKNOWN' };
    }
    actions.push({
      id: typeof entry.id === 'string' ? entry.id : `action-${index}`,
      kind: entry.kind as RuleActionKind,
      parameters: readParameters(entry.parameters),
    });
  }

  return {
    ok: true,
    draft: {
      id: typeof value.id === 'string' ? value.id : null,
      name: value.name,
      state,
      trigger,
      conditions,
      actions,
      delaySeconds: typeof value.delaySeconds === 'number' ? value.delaySeconds : 0,
      end: readEnd(value.end),
      connectionIds: Array.isArray(value.connectionIds)
        ? value.connectionIds.filter((entry): entry is string => typeof entry === 'string')
        : [],
      crossAccount: readCrossAccount(value.crossAccount),
    },
  };
}
