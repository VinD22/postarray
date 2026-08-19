import {
  CONSEQUENTIAL_RULE_ACTION_KINDS,
  RULE_ACTION_KINDS,
  RULE_CONDITION_KINDS,
  RULE_TRIGGER_KINDS,
  type RuleActionKind,
  type RuleConditionKind,
  type RuleTriggerKind,
} from '@relay/contracts';

/**
 * Everything a rule can react to, check and do.
 *
 * This file is the single source of what the sentence builder offers, and it is
 * derived from the enums in `@relay/contracts`, so an option cannot exist in
 * the UI without existing in the domain. `catalog.test.ts` asserts the coverage
 * in both directions.
 *
 * What is deliberately absent has as much weight as what is present. There is
 * no auto-like, no auto-follow, no unsolicited reply or message, no engagement
 * group, and no multi-account amplification, because those are not features we
 * chose not to ship yet: they are things this product does not do. They are not
 * disabled options with an explanatory tooltip either, because a disabled
 * option is still an advertisement for the behaviour.
 *
 * Provider availability is not hard coded here. An action that a platform must
 * explicitly support declares `requiresCapability`, and the editor resolves it
 * against the versioned capability snapshot of each selected connection. That
 * is why this file never claims that, say, X allows reposting: the connector
 * snapshot says so or it does not.
 */

export type ParameterKind =
  'text' | 'number' | 'duration' | 'time' | 'date' | 'select' | 'account' | 'accounts' | 'metric';

export interface ParameterSpec {
  readonly name: string;
  /** Catalog key for the field label. */
  readonly labelKey: string;
  readonly kind: ParameterKind;
  readonly required: boolean;
  /** Option values for a `select`. Labels come from `optionLabelKey`. */
  readonly options?: readonly string[];
  readonly optionLabelKey?: (value: string) => string;
}

export interface TriggerSpec {
  readonly kind: RuleTriggerKind;
  /** Catalog key for the clause that appears inside the sentence. */
  readonly sentenceKey: string;
  readonly groupKey: string;
  readonly parameters: readonly ParameterSpec[];
  /** Threshold triggers must configure a measurement block before saving. */
  readonly requiresMeasurement: boolean;
}

export interface ConditionSpec {
  readonly kind: RuleConditionKind;
  readonly sentenceKey: string;
  readonly groupKey: string;
  readonly parameters: readonly ParameterSpec[];
}

export interface ActionSpec {
  readonly kind: RuleActionKind;
  readonly sentenceKey: string;
  readonly groupKey: string;
  readonly parameters: readonly ParameterSpec[];
  /** True when running this action creates something on a platform. */
  readonly consequential: boolean;
  /**
   * The connector capability this action needs. When set, the action is absent
   * from the picker for any selected account whose snapshot does not report it
   * as supported, and the reason from the snapshot is shown under the picker.
   */
  readonly requiresCapability?: string;
  /** True when the action needs explicit preauthorization of two accounts. */
  readonly requiresCrossAccountPreauthorization?: boolean;
}

const param = (
  name: string,
  labelKey: string,
  kind: ParameterKind,
  required = true,
): ParameterSpec => ({ name, labelKey, kind, required });

export const TRIGGERS: readonly TriggerSpec[] = [
  {
    kind: 'scheduled_time',
    sentenceKey: 'automation.trigger.atTime',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [param('at', 'automation.param.time', 'time')],
    requiresMeasurement: false,
  },
  {
    kind: 'recurring_cadence',
    sentenceKey: 'automation.trigger.recurring',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [param('cadence', 'automation.param.cadence', 'duration')],
    requiresMeasurement: false,
  },
  {
    kind: 'next_free_slot',
    sentenceKey: 'automation.trigger.nextSlot',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'rss_item',
    sentenceKey: 'automation.trigger.rssItem',
    groupKey: 'automation.picker.groupExternal',
    parameters: [param('feed', 'automation.param.feed', 'select')],
    requiresMeasurement: false,
  },
  {
    kind: 'inbound_webhook',
    sentenceKey: 'automation.trigger.inboundWebhook',
    groupKey: 'automation.picker.groupExternal',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'media_imported',
    sentenceKey: 'automation.trigger.mediaImported',
    groupKey: 'automation.picker.groupExternal',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'manual_command',
    sentenceKey: 'automation.trigger.manual',
    groupKey: 'automation.picker.groupExternal',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'post_published',
    sentenceKey: 'automation.trigger.postPublished',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'post_failed',
    sentenceKey: 'automation.trigger.postFailed',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'post_partially_published',
    sentenceKey: 'automation.trigger.postPartiallyPublished',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'comment_completed',
    sentenceKey: 'automation.trigger.commentCompleted',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'comment_failed',
    sentenceKey: 'automation.trigger.commentFailed',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    requiresMeasurement: false,
  },
  {
    kind: 'analytics_threshold',
    sentenceKey: 'automation.trigger.analyticsThreshold',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [
      param('metric', 'automation.param.metric', 'metric'),
      param('value', 'automation.param.value', 'number'),
    ],
    requiresMeasurement: true,
  },
  {
    kind: 'connection_expiring',
    sentenceKey: 'automation.trigger.connectionExpiring',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [],
    requiresMeasurement: false,
  },
];

export const CONDITIONS: readonly ConditionSpec[] = [
  {
    kind: 'project',
    sentenceKey: 'automation.condition.project',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('project', 'automation.param.project', 'select')],
  },
  {
    kind: 'campaign',
    sentenceKey: 'automation.condition.campaign',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('campaign', 'automation.param.campaign', 'text')],
  },
  {
    kind: 'account',
    sentenceKey: 'automation.condition.account',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('account', 'automation.param.account', 'account')],
  },
  {
    kind: 'platform',
    sentenceKey: 'automation.condition.platform',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('platform', 'automation.param.platform', 'select')],
  },
  {
    kind: 'locale',
    sentenceKey: 'automation.condition.locale',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('locale', 'automation.param.locale', 'select')],
  },
  {
    kind: 'content_type',
    sentenceKey: 'automation.condition.contentType',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('contentType', 'automation.param.contentType', 'select')],
  },
  {
    kind: 'keyword_present',
    sentenceKey: 'automation.condition.containsKeyword',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('keyword', 'automation.param.keyword', 'text')],
  },
  {
    kind: 'hashtag_present',
    sentenceKey: 'automation.condition.hashtagPresent',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('hashtag', 'automation.param.hashtag', 'text')],
  },
  {
    kind: 'domain_present',
    sentenceKey: 'automation.condition.domainPresent',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('domain', 'automation.param.domain', 'text')],
  },
  {
    kind: 'time_window',
    sentenceKey: 'automation.condition.timeWindow',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [
      param('start', 'automation.param.startTime', 'time'),
      param('end', 'automation.param.endTime', 'time'),
      param('timeZone', 'automation.param.timeZone', 'select'),
    ],
  },
  {
    kind: 'quiet_hours',
    sentenceKey: 'automation.condition.quietHours',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [param('timeZone', 'automation.param.timeZone', 'select')],
  },
  {
    kind: 'time_since_publication',
    sentenceKey: 'automation.condition.timeSincePublish',
    groupKey: 'automation.picker.groupSchedule',
    parameters: [param('duration', 'automation.param.duration', 'duration')],
  },
  {
    kind: 'content_status',
    sentenceKey: 'automation.condition.approved',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
  },
  {
    kind: 'duplicate_similarity',
    sentenceKey: 'automation.condition.notDuplicate',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
  },
  {
    kind: 'cadence_budget',
    sentenceKey: 'automation.condition.withinCadenceBudget',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
  },
  {
    kind: 'engagement_minimum',
    sentenceKey: 'automation.condition.engagementAtLeast',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [
      param('metric', 'automation.param.metric', 'metric'),
      param('value', 'automation.param.value', 'number'),
    ],
  },
  {
    kind: 'engagement_maximum',
    sentenceKey: 'automation.condition.engagementAtMost',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [
      param('metric', 'automation.param.metric', 'metric'),
      param('value', 'automation.param.value', 'number'),
    ],
  },
  {
    kind: 'provider_capability',
    sentenceKey: 'automation.condition.providerCapability',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [param('capability', 'automation.param.capability', 'text')],
  },
  {
    kind: 'connection_health',
    sentenceKey: 'automation.condition.connectionHealthy',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [],
  },
  {
    kind: 'plan_status',
    sentenceKey: 'automation.condition.planStatus',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [],
  },
  {
    kind: 'usage_balance',
    sentenceKey: 'automation.condition.usageAvailable',
    groupKey: 'automation.picker.groupMeasurement',
    parameters: [],
  },
];

export const ACTIONS: readonly ActionSpec[] = [
  {
    kind: 'create_draft',
    sentenceKey: 'automation.action.createDraft',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('template', 'automation.param.template', 'select')],
    consequential: false,
  },
  {
    kind: 'adapt_text',
    sentenceKey: 'automation.action.transcreate',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('locale', 'automation.param.locale', 'select')],
    consequential: false,
  },
  {
    kind: 'add_signature',
    sentenceKey: 'automation.action.addSignature',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('signature', 'automation.param.signature', 'select')],
    consequential: false,
  },
  {
    kind: 'add_utm',
    sentenceKey: 'automation.action.addUtm',
    groupKey: 'automation.picker.groupContent',
    parameters: [],
    consequential: false,
  },
  {
    kind: 'add_disclosure',
    sentenceKey: 'automation.action.addDisclosure',
    groupKey: 'automation.picker.groupContent',
    parameters: [param('disclosure', 'automation.param.disclosure', 'select')],
    consequential: false,
  },
  {
    kind: 'add_first_comment',
    sentenceKey: 'automation.action.addFirstComment',
    groupKey: 'automation.picker.groupContent',
    parameters: [],
    consequential: false,
    requiresCapability: 'first_comment',
  },
  {
    kind: 'request_approval',
    sentenceKey: 'automation.action.requestApproval',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: false,
  },
  {
    kind: 'schedule_post',
    sentenceKey: 'automation.action.schedule',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
  },
  {
    kind: 'publish_post',
    sentenceKey: 'automation.action.publish',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
  },
  {
    kind: 'continue_sequence',
    sentenceKey: 'automation.action.continueSequence',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
    requiresCapability: 'thread',
  },
  {
    kind: 'repost',
    sentenceKey: 'automation.action.repost',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
    requiresCapability: 'repost',
  },
  {
    kind: 'quote_post',
    sentenceKey: 'automation.action.quotePost',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
    requiresCapability: 'quote_post',
  },
  {
    kind: 'follow_up_comment',
    sentenceKey: 'automation.action.followUpComment',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [],
    consequential: true,
    requiresCapability: 'comment_create',
  },
  {
    kind: 'cross_account_follow_up',
    sentenceKey: 'automation.action.followUpFromAccount',
    groupKey: 'automation.picker.groupPublishing',
    parameters: [param('account', 'automation.param.account', 'account')],
    consequential: true,
    requiresCapability: 'publish',
    requiresCrossAccountPreauthorization: true,
  },
  {
    kind: 'wait_delay',
    sentenceKey: 'automation.action.wait',
    groupKey: 'automation.picker.groupControl',
    parameters: [param('duration', 'automation.param.duration', 'duration')],
    consequential: false,
  },
  {
    kind: 'notify_workspace',
    sentenceKey: 'automation.action.notify',
    groupKey: 'automation.picker.groupNotify',
    parameters: [param('target', 'automation.param.target', 'text')],
    consequential: false,
  },
  {
    kind: 'notify_email',
    sentenceKey: 'automation.action.notifyEmail',
    groupKey: 'automation.picker.groupNotify',
    parameters: [param('target', 'automation.param.target', 'text')],
    consequential: false,
  },
  {
    kind: 'notify_webhook',
    sentenceKey: 'automation.action.notifyWebhook',
    groupKey: 'automation.picker.groupNotify',
    parameters: [param('target', 'automation.param.target', 'text')],
    consequential: false,
  },
  {
    kind: 'pause_rule',
    sentenceKey: 'automation.action.pauseRule',
    groupKey: 'automation.picker.groupControl',
    parameters: [],
    consequential: false,
  },
  {
    kind: 'pause_connection',
    sentenceKey: 'automation.action.pauseConnection',
    groupKey: 'automation.picker.groupControl',
    parameters: [],
    consequential: false,
  },
];

export function triggerSpec(kind: RuleTriggerKind): TriggerSpec {
  const found = TRIGGERS.find((spec) => spec.kind === kind);
  if (!found) {
    throw new Error(`Unknown trigger kind: ${kind}`);
  }
  return found;
}

export function conditionSpec(kind: RuleConditionKind): ConditionSpec {
  const found = CONDITIONS.find((spec) => spec.kind === kind);
  if (!found) {
    throw new Error(`Unknown condition kind: ${kind}`);
  }
  return found;
}

export function actionSpec(kind: RuleActionKind): ActionSpec {
  const found = ACTIONS.find((spec) => spec.kind === kind);
  if (!found) {
    throw new Error(`Unknown action kind: ${kind}`);
  }
  return found;
}

/** Every enum value the contract defines, for the coverage assertions. */
export const CONTRACT_ENUMS = {
  triggers: RULE_TRIGGER_KINDS,
  conditions: RULE_CONDITION_KINDS,
  actions: RULE_ACTION_KINDS,
  consequentialActions: CONSEQUENTIAL_RULE_ACTION_KINDS,
} as const;
