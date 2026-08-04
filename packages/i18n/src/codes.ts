/**
 * Stable domain code lists that the message catalog must cover exhaustively.
 *
 * TODO(i18n): these mirror the canonical unions in `@relay/contracts`. When that
 * package lands, replace the literal arrays with a type-level assertion against
 * its exports so a new code in contracts fails the i18n catalog lint instead of
 * silently shipping an untranslated state. The lists are duplicated here on
 * purpose: `@relay/i18n` must stay dependency free so the design system can
 * import it without pulling in the domain layer.
 */

/** Every error code a `RelayError` may carry. One `error.<code>` message each. */
export const RELAY_ERROR_CODES = [
  'unknown',
  'internal',
  'not_implemented',
  'offline',
  'network_unreachable',
  'request_invalid',
  'validation_failed',
  'unauthenticated',
  'session_expired',
  'mfa_required',
  'forbidden',
  'insufficient_scope',
  'workspace_not_found',
  'workspace_suspended',
  'not_found',
  'conflict',
  'idempotency_key_reused',
  'rate_limited',
  'quota_exceeded',
  'payment_required',
  'subscription_past_due',
  'trial_expired',
  'entitlement_missing',
  'channel_limit_reached',
  'connection_not_found',
  'connection_revoked',
  'connection_expired',
  'connection_paused',
  'connection_permission_missing',
  'connection_account_type_invalid',
  'connection_review_pending',
  'capability_unsupported',
  'capability_not_implemented',
  'capability_requires_review',
  'content_invalid',
  'content_changed_after_approval',
  'duplicate_content',
  'cadence_limit_reached',
  'media_invalid',
  'media_too_large',
  'media_processing_failed',
  'media_rights_undeclared',
  'alt_text_required',
  'approval_required',
  'approval_expired',
  'schedule_in_past',
  'schedule_conflict',
  'time_zone_invalid',
  'destination_unavailable',
  'mention_unresolved',
  'provider_transient',
  'provider_permanent',
  'provider_rate_limited',
  'provider_unavailable',
  'provider_content_rejected',
  'user_action_required',
  'short_link_destination_blocked',
  'short_link_domain_unverified',
  'rss_feed_invalid',
  'webhook_signature_invalid',
  'webhook_delivery_failed',
  'automation_rule_not_permitted',
  'ai_unavailable',
  'ai_output_invalid',
  'ai_budget_exceeded',
  'storage_unavailable',
  'export_unavailable',
] as const;

export type RelayErrorCode = (typeof RELAY_ERROR_CODES)[number];

/** The fifteen explicit publish states. One `state.<state>` message each. */
export const PUBLISH_STATES = [
  'draft',
  'validation_needed',
  'approval_requested',
  'approved',
  'scheduled',
  'preparing_media',
  'dispatching',
  'provider_processing',
  'published',
  'partially_published',
  'action_required',
  'retry_scheduled',
  'failed_permanently',
  'canceled',
  'deleted_externally',
] as const;

export type PublishState = (typeof PUBLISH_STATES)[number];

/** Approval decision states. One `state.approval.<state>` message each. */
export const APPROVAL_STATES = [
  'not_required',
  'requested',
  'in_review',
  'approved',
  'changes_requested',
  'rejected',
  'expired',
  'withdrawn',
] as const;

export type ApprovalState = (typeof APPROVAL_STATES)[number];

/** Deterministic validation issue codes. One `validation.<code>` message each. */
export const VALIDATION_ISSUE_CODES = [
  'text_required',
  'text_too_long',
  'text_too_short',
  'title_required',
  'title_too_long',
  'description_too_long',
  'media_required',
  'media_count_exceeded',
  'media_type_unsupported',
  'media_aspect_ratio_unsupported',
  'media_resolution_too_low',
  'media_duration_too_long',
  'media_duration_too_short',
  'media_file_too_large',
  'media_mixed_types_unsupported',
  'alt_text_missing',
  'thumbnail_unsupported',
  'destination_required',
  'destination_unsupported',
  'mention_unresolved',
  'hashtag_count_exceeded',
  'link_not_allowed',
  'link_destination_unverified',
  'privacy_setting_required',
  'disclosure_required',
  'first_comment_unsupported',
  'thread_unsupported',
  'repeat_end_required',
  'schedule_in_past',
  'schedule_too_far_ahead',
  'schedule_outside_quiet_hours',
  'duplicate_within_window',
  'blocked_term_present',
  'unsupported_claim',
  'cadence_exceeded',
  'connection_paused',
  'account_type_invalid',
] as const;

export type ValidationIssueCode = (typeof VALIDATION_ISSUE_CODES)[number];

/** Capability support levels shown in the composer and capability matrix. */
export const CAPABILITY_LEVELS = [
  'supported',
  'unsupported',
  'not_implemented',
  'requires_review',
  'beta',
  'unknown',
] as const;

export type CapabilityLevel = (typeof CAPABILITY_LEVELS)[number];
