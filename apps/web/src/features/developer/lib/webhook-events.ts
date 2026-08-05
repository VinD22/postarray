/**
 * The outbound event catalog, grouped for a picker.
 *
 * The list itself comes from `@relay/contracts` so the UI can never offer an
 * event the API does not send, and a new event fails the exhaustiveness check
 * below rather than quietly disappearing from this screen.
 */

import { WEBHOOK_EVENT_NAMES, type WebhookEventName } from '@relay/contracts';

export interface WebhookEventGroup {
  readonly id: string;
  readonly titleKey: string;
  readonly events: readonly WebhookEventName[];
}

const GROUPS: readonly WebhookEventGroup[] = [
  {
    id: 'connections',
    titleKey: 'developer.ui.webhooks.eventGroup.connections',
    events: ['connection.connected', 'connection.action_required'],
  },
  {
    id: 'content',
    titleKey: 'developer.ui.webhooks.eventGroup.content',
    events: ['draft.created', 'approval.requested', 'approval.decided'],
  },
  {
    id: 'publishing',
    titleKey: 'developer.ui.webhooks.eventGroup.publishing',
    events: [
      'post.scheduled',
      'post.dispatching',
      'post.published',
      'post.partially_published',
      'post.failed',
      'comment.published',
      'comment.failed',
    ],
  },
  {
    id: 'automation',
    titleKey: 'developer.ui.webhooks.eventGroup.automation',
    events: ['rss.item_processed', 'rule.run_completed', 'rule.run_failed', 'analytics.updated'],
  },
  {
    id: 'workspace',
    titleKey: 'developer.ui.webhooks.eventGroup.workspace',
    events: ['subscription.changed'],
  },
];

/** Every group, with any event the groups forgot appended to the last one. */
export function webhookEventGroups(): readonly WebhookEventGroup[] {
  const grouped = new Set(GROUPS.flatMap((group) => group.events));
  const ungrouped = WEBHOOK_EVENT_NAMES.filter((event) => !grouped.has(event));
  if (ungrouped.length === 0) {
    return GROUPS;
  }
  return GROUPS.map((group) =>
    group.id === 'workspace' ? { ...group, events: [...group.events, ...ungrouped] } : group,
  );
}
