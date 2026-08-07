import type { ProviderKey } from '@relay/design-system/tokens';

import type { ActionItemKind, ActionItemUrgency, ActionItemView, ProviderId } from '@/lib/api';

/**
 * The Action center catalogue.
 *
 * Eleven kinds, and every one of them maps to exactly one sentence and exactly
 * one remediation verb. This table is the reason a row never ends in "View" or
 * "Details": the next action is always named.
 */
export interface ActionKindDefinition {
  /** The sentence. Interpolates the item's own values. */
  readonly messageKey: string;
  /** The single verb the row ends in. */
  readonly actionKey: string;
}

export const ACTION_KIND_DEFINITIONS: Readonly<Record<ActionItemKind, ActionKindDefinition>> = {
  connection_expiring: {
    messageKey: 'actionCenter.item.connectionExpiring',
    actionKey: 'actionCenter.action.reconnect',
  },
  connection_action_required: {
    messageKey: 'actionCenter.item.connectionActionRequired',
    actionKey: 'actionCenter.action.fixConnection',
  },
  validation_failed: {
    messageKey: 'actionCenter.item.validationFailed',
    actionKey: 'actionCenter.action.openDraft',
  },
  approval_overdue: {
    messageKey: 'actionCenter.item.approvalOverdue',
    actionKey: 'actionCenter.action.review',
  },
  schedule_conflict: {
    messageKey: 'actionCenter.item.scheduleConflict',
    actionKey: 'actionCenter.action.openCalendar',
  },
  provider_incident: {
    messageKey: 'actionCenter.item.providerIncident',
    actionKey: 'actionCenter.action.viewStatus',
  },
  comment_failed: {
    messageKey: 'actionCenter.item.commentFailed',
    actionKey: 'actionCenter.action.openReceipt',
  },
  analytics_stale: {
    messageKey: 'actionCenter.item.analyticsStale',
    actionKey: 'actionCenter.action.viewStatus',
  },
  rss_stalled: {
    messageKey: 'actionCenter.item.rssStalled',
    actionKey: 'actionCenter.action.checkFeed',
  },
  webhook_failing: {
    messageKey: 'actionCenter.item.webhookFailing',
    actionKey: 'actionCenter.action.inspectDeliveries',
  },
  usage_balance: {
    messageKey: 'actionCenter.item.usageBalance',
    actionKey: 'actionCenter.action.addBalance',
  },
};

export const URGENCY_ORDER: readonly ActionItemUrgency[] = ['now', 'soon', 'watching'];

export const URGENCY_LABEL_KEY: Readonly<Record<ActionItemUrgency, string>> = {
  now: 'actionCenter.group.now.label',
  soon: 'actionCenter.group.soon.label',
  watching: 'actionCenter.group.watching.label',
};

export const URGENCY_HINT_KEY: Readonly<Record<ActionItemUrgency, string>> = {
  now: 'actionCenter.group.now.hint',
  soon: 'actionCenter.group.soon.hint',
  watching: 'actionCenter.group.watching.hint',
};

/**
 * The urgency word read next to the marker.
 *
 * The marker is never the only carrier of urgency: the word is always beside
 * it, which is what makes the queue readable in greyscale and in Windows high
 * contrast mode.
 */
export const URGENCY_SEVERITY_KEY: Readonly<Record<ActionItemUrgency, string>> = {
  now: 'actionCenter.severity.now',
  soon: 'actionCenter.severity.soon',
  watching: 'actionCenter.severity.watching',
};

/**
 * Providers the design system has an identity colour for. The dot is only ever
 * an 8px identity mark beside the account name, never a surface.
 */
const DOT_PROVIDERS = new Set<string>([
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  'pinterest',
  'reddit',
  'mastodon',
]);

export function providerDotKey(provider: ProviderId | null): ProviderKey | undefined {
  if (provider === null || !DOT_PROVIDERS.has(provider)) {
    return undefined;
  }
  return provider as ProviderKey;
}

interface ActionValueFormatters {
  readonly relative: (value: string) => string;
  readonly dateTime: (value: string) => string;
}

/** Convert service instants into human text before they enter an ICU sentence. */
export function formatActionItemValues(
  item: ActionItemView,
  format: ActionValueFormatters,
  unavailable: string,
): Readonly<Record<string, string | number>> {
  const values = { ...item.values };
  const date = values.date;
  if (typeof date !== 'string') return values;
  if (date === 'unavailable') return { ...values, date: unavailable };
  if (Number.isNaN(Date.parse(date))) return values;

  return {
    ...values,
    date: item.kind === 'schedule_conflict' ? format.dateTime(date) : format.relative(date),
  };
}
