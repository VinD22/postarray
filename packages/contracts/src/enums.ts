import { z } from 'zod';

/** Every shared domain enum. Schema first, inferred type alongside it. */

export const PROVIDER_IDS = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  'fake',
] as const;
export const providerIdSchema = z.enum(PROVIDER_IDS);
export type ProviderId = z.infer<typeof providerIdSchema>;

export const ACCOUNT_TYPES = [
  'personal_profile',
  'creator_profile',
  'business_profile',
  'page',
  'organization',
  'channel',
  'group',
  'board',
  'community',
  'publication',
] as const;
export const accountTypeSchema = z.enum(ACCOUNT_TYPES);
export type AccountType = z.infer<typeof accountTypeSchema>;

export const ROLES = [
  'owner',
  'admin',
  'manager',
  'editor',
  'approver',
  'analyst',
  'viewer',
] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

export const CREATION_SURFACES = [
  'web',
  'api',
  'mcp',
  'cli',
  'rss',
  'automation_rule',
  'agent',
] as const;
export const creationSurfaceSchema = z.enum(CREATION_SURFACES);
export type CreationSurface = z.infer<typeof creationSurfaceSchema>;

/**
 * The publish state model. `partially_published` exists because one failed
 * target never rolls back a target that already produced an external post.
 */
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
export const publishStateSchema = z.enum(PUBLISH_STATES);
export type PublishState = z.infer<typeof publishStateSchema>;

export const APPROVAL_STATES = [
  'not_required',
  'requested',
  'approved',
  'rejected',
  'expired',
] as const;
export const approvalStateSchema = z.enum(APPROVAL_STATES);
export type ApprovalState = z.infer<typeof approvalStateSchema>;

export const ERROR_CLASSES = [
  'user_action_required',
  'content_invalid',
  'transient_provider',
  'permanent_provider',
  'internal',
  'unknown',
] as const;
export const errorClassSchema = z.enum(ERROR_CLASSES);
export type ErrorClass = z.infer<typeof errorClassSchema>;

/**
 * `unsupported` means the provider does not offer it. `not_implemented` means we
 * have not built it yet. The UI must never merge these two.
 */
export const CAPABILITY_SUPPORTS = [
  'supported',
  'unsupported',
  'not_implemented',
  'requires_review',
] as const;
export const capabilitySupportSchema = z.enum(CAPABILITY_SUPPORTS);
export type CapabilitySupport = z.infer<typeof capabilitySupportSchema>;

export const MEDIA_KINDS = ['image', 'video', 'gif', 'document', 'audio'] as const;
export const mediaKindSchema = z.enum(MEDIA_KINDS);
export type MediaKind = z.infer<typeof mediaKindSchema>;

export const CONTENT_KINDS = [
  'text',
  'image',
  'carousel',
  'video',
  'short_video',
  'long_video',
  'document',
  'thread',
] as const;
export const contentKindSchema = z.enum(CONTENT_KINDS);
export type ContentKind = z.infer<typeof contentKindSchema>;

/** A metric we cannot read is `unavailable_*`. It is never reported as zero. */
export const METRIC_AVAILABILITIES = [
  'available',
  'unavailable_provider',
  'unavailable_permission',
  'unavailable_pending',
  'unavailable_stale',
] as const;
export const metricAvailabilitySchema = z.enum(METRIC_AVAILABILITIES);
export type MetricAvailability = z.infer<typeof metricAvailabilitySchema>;

export const SUBSCRIPTION_STATUSES = [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
] as const;
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/** Agent autonomy ladder. Level 3 always needs a human confirmation. */
export const APPROVAL_LEVELS = [
  'level_0_read',
  'level_1_draft',
  'level_2_scheduled',
  'level_3_confirm',
] as const;
export const approvalLevelSchema = z.enum(APPROVAL_LEVELS);
export type ApprovalLevel = z.infer<typeof approvalLevelSchema>;

export const RULE_TRIGGER_KINDS = [
  'scheduled_time',
  'next_free_slot',
  'rss_item',
  'inbound_webhook',
  'media_imported',
  'post_published',
  'post_failed',
  'post_partially_published',
  'comment_completed',
  'comment_failed',
  'analytics_threshold',
  'connection_expiring',
  'manual_command',
  'recurring_cadence',
] as const;
export const ruleTriggerKindSchema = z.enum(RULE_TRIGGER_KINDS);
export type RuleTriggerKind = z.infer<typeof ruleTriggerKindSchema>;

export const RULE_CONDITION_KINDS = [
  'brand',
  'campaign',
  'account',
  'platform',
  'locale',
  'content_type',
  'time_window',
  'quiet_hours',
  'content_status',
  'engagement_minimum',
  'engagement_maximum',
  'time_since_publication',
  'domain_present',
  'hashtag_present',
  'keyword_present',
  'duplicate_similarity',
  'cadence_budget',
  'provider_capability',
  'connection_health',
  'plan_status',
  'usage_balance',
] as const;
export const ruleConditionKindSchema = z.enum(RULE_CONDITION_KINDS);
export type RuleConditionKind = z.infer<typeof ruleConditionKindSchema>;

export const RULE_ACTION_KINDS = [
  'create_draft',
  'adapt_text',
  'add_signature',
  'add_utm',
  'add_disclosure',
  'add_first_comment',
  'request_approval',
  'schedule_post',
  'publish_post',
  'wait_delay',
  'continue_sequence',
  'notify_workspace',
  'notify_email',
  'notify_webhook',
  'pause_rule',
  'pause_connection',
  'repost',
  'quote_post',
  'follow_up_comment',
  'cross_account_follow_up',
] as const;
export const ruleActionKindSchema = z.enum(RULE_ACTION_KINDS);
export type RuleActionKind = z.infer<typeof ruleActionKindSchema>;

/**
 * Actions that create an external side effect and therefore always run through
 * the approval policy, cadence budget and duplicate checks.
 */
export const CONSEQUENTIAL_RULE_ACTION_KINDS: readonly RuleActionKind[] = [
  'publish_post',
  'schedule_post',
  'repost',
  'quote_post',
  'follow_up_comment',
  'cross_account_follow_up',
  // Continuing a thread or comment sequence creates further public posts. It
  // belongs here for the same reason the others do: without it a level 2 agent
  // could keep a sequence running without the confirmation an external post needs.
  'continue_sequence',
];

/** Admin catalog lifecycle, shared by opportunities and the tool radar. */
export const CATALOG_STATES = ['draft', 'reviewed', 'active', 'stale', 'retired'] as const;
export const catalogStateSchema = z.enum(CATALOG_STATES);
export type CatalogState = z.infer<typeof catalogStateSchema>;

export const OPPORTUNITY_STATES = CATALOG_STATES;
export const opportunityStateSchema = catalogStateSchema;
export type OpportunityState = CatalogState;
