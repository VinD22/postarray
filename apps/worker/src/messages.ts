/**
 * Message keys the worker emits.
 *
 * The worker never produces user-visible English. It produces stable ICU keys
 * that `@relay/i18n` resolves on whichever surface renders them, so a rename or
 * a new locale is a catalog edit rather than a code change.
 */
export const MESSAGE_KEYS = {
  publish: {
    canceledByUser: 'publish.canceled_by_user',
    canceledTooLate: 'publish.canceled_after_publication',
    capabilityDrift: 'publish.capability_changed_reapproval_required',
    connectionActionRequired: 'publish.connection_needs_attention',
    contentRejected: 'publish.content_rejected_by_provider',
    unconfirmedCreate: 'publish.could_not_confirm_publication',
    attemptBudgetExhausted: 'publish.attempts_exhausted',
    preflightBlocked: 'publish.preflight_blocked',
    published: 'publish.published',
    partiallyPublished: 'publish.partially_published',
    pausedAwaitingResume: 'publish.paused_awaiting_resume',
    rescheduled: 'publish.rescheduled',
    mediaRejected: 'publish.media_rejected',
    processingTimedOut: 'publish.provider_still_processing',
  },
  sequence: {
    itemFailed: 'sequence.item_failed_root_post_is_live',
    itemPublished: 'sequence.item_published',
    unsupported: 'sequence.not_supported_on_this_account',
  },
  repeat: {
    seriesComplete: 'repeat.series_complete',
    seriesEnded: 'repeat.series_reached_end_date',
    seriesCountReached: 'repeat.series_reached_count',
    seriesCanceled: 'repeat.series_canceled',
    occurrenceSkipped: 'repeat.occurrence_skipped',
  },
  analytics: {
    syncComplete: 'analytics.sync_complete',
    syncStopped: 'analytics.sync_stopped',
    windowExhausted: 'analytics.history_window_exhausted',
  },
  connection: {
    refreshFailed: 'connection.token_refresh_failed',
    refreshNotSupported: 'connection.token_refresh_not_supported',
    revoked: 'connection.access_revoked',
    reconnectRequired: 'connection.reconnect_required',
  },
  rss: {
    pollFailed: 'rss.poll_failed',
    feedDisabled: 'rss.feed_disabled_after_repeated_failures',
    pollStopped: 'rss.poll_stopped',
  },
  rule: {
    cooldown: 'rule.cooldown_active',
    expired: 'rule.expired',
    maxExecutions: 'rule.max_executions_reached',
    duplicateSource: 'rule.already_ran_for_this_source',
    disabled: 'rule.disabled',
    conditionsNotMet: 'rule.conditions_not_met',
    approvalRequired: 'rule.approval_required',
    killSwitch: 'rule.stopped_by_kill_switch',
    completed: 'rule.completed',
  },
  webhook: {
    delivered: 'webhook.delivered',
    exhausted: 'webhook.retries_exhausted',
    endpointDisabled: 'webhook.endpoint_disabled_after_repeated_failures',
    deadLettered: 'webhook.moved_to_dead_letter_queue',
    alreadyDelivered: 'webhook.already_delivered',
  },
  deletion: {
    started: 'deletion.started',
    aborted: 'deletion.aborted',
    completed: 'deletion.completed',
  },
  worker: {
    degradedInlineScheduler: 'worker.degraded_inline_scheduler',
  },
} as const;
