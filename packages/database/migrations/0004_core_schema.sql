-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "app"."user_status" AS ENUM ('invited', 'active', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "app"."workspace_status" AS ENUM ('active', 'trialing', 'past_due', 'read_only', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "app"."workspace_role" AS ENUM ('owner', 'admin', 'manager', 'editor', 'approver', 'analyst', 'viewer');

-- CreateEnum
CREATE TYPE "app"."membership_state" AS ENUM ('invited', 'active', 'suspended', 'removed');

-- CreateEnum
CREATE TYPE "private"."invitation_state" AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "app"."actor_type" AS ENUM ('user', 'service_account', 'oauth_client', 'system');

-- CreateEnum
CREATE TYPE "app"."consent_kind" AS ENUM ('terms_of_service', 'privacy_notice', 'product_analytics', 'marketing_email', 'ai_improvement_program', 'affiliate_disclosure');

-- CreateEnum
CREATE TYPE "app"."consent_state" AS ENUM ('granted', 'withdrawn', 'expired');

-- CreateEnum
CREATE TYPE "app"."source_consent_state" AS ENUM ('declared', 'verified', 'withheld', 'revoked');

-- CreateEnum
CREATE TYPE "app"."brand_source_kind" AS ENUM ('uploaded_document', 'linked_url', 'pasted_text', 'imported_export');

-- CreateEnum
CREATE TYPE "app"."publish_state" AS ENUM ('draft', 'validation_needed', 'approval_requested', 'approved', 'scheduled', 'preparing_media', 'dispatching', 'provider_processing', 'published', 'partially_published', 'action_required', 'retry_scheduled', 'failed_permanently', 'canceled', 'deleted_externally');

-- CreateEnum
CREATE TYPE "app"."creation_surface" AS ENUM ('web', 'api', 'mcp', 'cli', 'rss', 'automation_rule', 'agent', 'import');

-- CreateEnum
CREATE TYPE "app"."creation_method" AS ENUM ('human', 'ai_assisted', 'imported', 'template', 'duplicated');

-- CreateEnum
CREATE TYPE "app"."approval_state" AS ENUM ('pending', 'approved', 'changes_requested', 'rejected', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "app"."approval_decision_kind" AS ENUM ('approve', 'request_changes', 'reject');

-- CreateEnum
CREATE TYPE "app"."approval_policy" AS ENUM ('none', 'single_approver', 'any_approver', 'named_approver', 'policy_auto');

-- CreateEnum
CREATE TYPE "app"."provider_kind" AS ENUM ('x', 'linkedin', 'instagram', 'facebook', 'youtube', 'tiktok', 'threads', 'bluesky', 'mastodon', 'telegram', 'reddit', 'wordpress', 'medium', 'devto', 'pinterest', 'discord', 'slack', 'fake');

-- CreateEnum
CREATE TYPE "app"."external_account_type" AS ENUM ('personal_profile', 'creator_account', 'business_account', 'page', 'organization', 'channel', 'group');

-- CreateEnum
CREATE TYPE "app"."connection_status" AS ENUM ('active', 'action_required', 'expired', 'revoked', 'paused', 'disconnected');

-- CreateEnum
CREATE TYPE "app"."capability_state" AS ENUM ('supported', 'unsupported', 'not_implemented', 'unknown');

-- CreateEnum
CREATE TYPE "app"."destination_kind" AS ENUM ('community', 'board', 'group', 'organization', 'page', 'channel', 'publication', 'playlist');

-- CreateEnum
CREATE TYPE "app"."mention_entity_kind" AS ENUM ('person', 'company', 'page', 'organization', 'community');

-- CreateEnum
CREATE TYPE "app"."media_kind" AS ENUM ('image', 'video', 'document', 'audio');

-- CreateEnum
CREATE TYPE "app"."media_scan_state" AS ENUM ('pending', 'clean', 'suspicious', 'infected', 'failed');

-- CreateEnum
CREATE TYPE "app"."rights_declaration" AS ENUM ('owned_original', 'licensed', 'public_domain', 'user_generated_with_consent', 'unverified');

-- CreateEnum
CREATE TYPE "app"."derivative_kind" AS ENUM ('transcode', 'crop', 'resize', 'thumbnail', 'format_conversion', 'compressed');

-- CreateEnum
CREATE TYPE "app"."error_class" AS ENUM ('user_action_required', 'content_invalid', 'transient_provider', 'permanent_provider', 'internal', 'unknown');

-- CreateEnum
CREATE TYPE "app"."attempt_outcome" AS ENUM ('pending', 'succeeded', 'failed', 'abandoned');

-- CreateEnum
CREATE TYPE "app"."incident_kind" AS ENUM ('invalid_token', 'permission_lost', 'review_restriction', 'rate_limited', 'account_restricted', 'provider_outage', 'refresh_failed');

-- CreateEnum
CREATE TYPE "app"."incident_state" AS ENUM ('open', 'acknowledged', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "app"."automation_rule_state" AS ENUM ('draft', 'active', 'paused', 'disabled', 'archived');

-- CreateEnum
CREATE TYPE "app"."run_state" AS ENUM ('pending', 'running', 'succeeded', 'failed', 'skipped', 'blocked_by_policy');

-- CreateEnum
CREATE TYPE "app"."feed_health" AS ENUM ('healthy', 'degraded', 'invalid', 'stalled');

-- CreateEnum
CREATE TYPE "app"."rss_item_state" AS ENUM ('seen', 'drafted', 'scheduled', 'published', 'skipped', 'failed');

-- CreateEnum
CREATE TYPE "private"."webhook_endpoint_state" AS ENUM ('active', 'paused', 'disabled_on_failure', 'deleted');

-- CreateEnum
CREATE TYPE "private"."webhook_delivery_state" AS ENUM ('pending', 'delivering', 'delivered', 'failed', 'dead_lettered');

-- CreateEnum
CREATE TYPE "app"."metric_availability" AS ENUM ('available', 'unavailable', 'unsupported', 'requires_permission', 'restricted_by_provider');

-- CreateEnum
CREATE TYPE "app"."metric_unit" AS ENUM ('count', 'ratio', 'seconds', 'percentage', 'currency_minor');

-- CreateEnum
CREATE TYPE "app"."aggregation_rule" AS ENUM ('latest_snapshot', 'sum', 'average', 'max', 'not_aggregatable');

-- CreateEnum
CREATE TYPE "app"."experiment_state" AS ENUM ('planned', 'running', 'concluded', 'abandoned');

-- CreateEnum
CREATE TYPE "app"."insight_state" AS ENUM ('new', 'accepted', 'dismissed', 'superseded');

-- CreateEnum
CREATE TYPE "app"."short_link_state" AS ENUM ('active', 'disabled', 'expired', 'blocked');

-- CreateEnum
CREATE TYPE "app"."bot_classification" AS ENUM ('human', 'suspected_bot', 'known_bot', 'unknown');

-- CreateEnum
CREATE TYPE "private"."subscription_status" AS ENUM ('incomplete', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');

-- CreateEnum
CREATE TYPE "private"."billing_interval" AS ENUM ('month', 'year');

-- CreateEnum
CREATE TYPE "private"."entitlement_kind" AS ENUM ('boolean_flag', 'numeric_limit', 'metered_allowance');

-- CreateEnum
CREATE TYPE "private"."inbox_processing_state" AS ENUM ('received', 'verified', 'processed', 'rejected', 'duplicate', 'failed');

-- CreateEnum
CREATE TYPE "private"."affiliate_partner_state" AS ENUM ('applied', 'approved', 'suspended', 'terminated');

-- CreateEnum
CREATE TYPE "private"."commission_state" AS ENUM ('pending', 'on_hold', 'approved', 'reversed', 'paid');

-- CreateEnum
CREATE TYPE "private"."payout_batch_state" AS ENUM ('open', 'locked', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "private"."oauth_client_type" AS ENUM ('public', 'confidential');

-- CreateEnum
CREATE TYPE "private"."oauth_client_status" AS ENUM ('active', 'sandbox', 'disabled', 'deleted');

-- CreateEnum
CREATE TYPE "private"."oauth_transaction_purpose" AS ENUM ('connect_social_account', 'reconnect_social_account', 'authorize_developer_app', 'mcp_session');

-- CreateEnum
CREATE TYPE "app"."growth_plan_state" AS ENUM ('draft', 'in_review', 'approved', 'superseded', 'discarded');

-- CreateEnum
CREATE TYPE "app"."catalog_state" AS ENUM ('draft', 'reviewed', 'active', 'stale', 'retired');

-- CreateEnum
CREATE TYPE "app"."opportunity_kind" AS ENUM ('directory', 'community', 'publication', 'launch_platform', 'partner', 'integration_marketplace', 'newsletter');

-- CreateEnum
CREATE TYPE "app"."match_decision" AS ENUM ('proposed', 'accepted', 'dismissed', 'in_progress', 'completed', 'rejected_by_source');

-- CreateEnum
CREATE TYPE "app"."tool_category" AS ENUM ('image_editing', 'video_editing', 'ugc', 'research', 'automation', 'analytics', 'accessibility', 'asset_management');

-- CreateEnum
CREATE TYPE "app"."deletion_request_state" AS ENUM ('requested', 'verifying', 'scheduled', 'executing', 'completed', 'canceled', 'failed');

-- CreateEnum
CREATE TYPE "app"."data_export_state" AS ENUM ('requested', 'building', 'ready', 'delivered', 'expired', 'failed');

-- CreateEnum
CREATE TYPE "private"."session_state" AS ENUM ('active', 'expired', 'revoked');

-- CreateTable
CREATE TABLE "app"."users" (
    "id" TEXT NOT NULL DEFAULT app.new_id('user'),
    "auth_subject_id" TEXT,
    "email" CITEXT NOT NULL,
    "email_verified_at" TIMESTAMPTZ(6),
    "display_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "status" "app"."user_status" NOT NULL DEFAULT 'active',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "time_zone" TEXT NOT NULL DEFAULT 'UTC',
    "mfa_enrolled_at" TIMESTAMPTZ(6),
    "last_seen_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."user_aliases" (
    "id" TEXT NOT NULL DEFAULT app.new_id('alias'),
    "user_id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "normalized_handle" CITEXT NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "reserved_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."workspaces" (
    "id" TEXT NOT NULL DEFAULT app.new_id('ws'),
    "name" TEXT NOT NULL,
    "slug" CITEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "status" "app"."workspace_status" NOT NULL DEFAULT 'trialing',
    "default_locale" TEXT NOT NULL DEFAULT 'en',
    "default_time_zone" TEXT NOT NULL DEFAULT 'UTC',
    "kill_switch_at" TIMESTAMPTZ(6),
    "kill_switch_reason" TEXT,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."memberships" (
    "id" TEXT NOT NULL DEFAULT app.new_id('membership'),
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "app"."workspace_role" NOT NULL,
    "state" "app"."membership_state" NOT NULL DEFAULT 'invited',
    "brand_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "invited_by_user_id" TEXT,
    "invited_at" TIMESTAMPTZ(6),
    "accepted_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."invitations" (
    "id" TEXT NOT NULL DEFAULT app.new_id('invitation'),
    "workspace_id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "role" "app"."workspace_role" NOT NULL,
    "note" TEXT,
    "token_hash" TEXT NOT NULL,
    "state" "private"."invitation_state" NOT NULL DEFAULT 'pending',
    "invited_by_user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "accepted_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."role_permissions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('roleperm'),
    "workspace_id" TEXT NOT NULL,
    "role" "app"."workspace_role" NOT NULL,
    "permission" TEXT NOT NULL,
    "effect" TEXT NOT NULL DEFAULT 'allow',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."service_accounts" (
    "id" TEXT NOT NULL DEFAULT app.new_id('svc'),
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "brand_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "connection_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "provider_scope" "app"."provider_kind"[] DEFAULT ARRAY[]::"app"."provider_kind"[],
    "locale_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "approved_domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "max_daily_publishes" INTEGER,
    "max_look_ahead_days" INTEGER,
    "max_approval_level" INTEGER NOT NULL DEFAULT 1,
    "disabled_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "service_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."api_keys" (
    "id" TEXT NOT NULL DEFAULT app.new_id('key'),
    "workspace_id" TEXT NOT NULL,
    "service_account_id" TEXT,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "hash_algorithm" TEXT NOT NULL DEFAULT 'argon2id',
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expires_at" TIMESTAMPTZ(6),
    "last_used_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."audit_events" (
    "id" TEXT NOT NULL DEFAULT app.new_id('aud'),
    "workspace_id" TEXT NOT NULL,
    "actor_type" "app"."actor_type" NOT NULL,
    "actor_id" TEXT,
    "actor_client_id" TEXT,
    "surface" "app"."creation_surface" NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "before_hash" TEXT,
    "after_hash" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ip_address" INET,
    "user_agent" TEXT,
    "correlation_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."user_sessions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('session'),
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    "state" "private"."session_state" NOT NULL DEFAULT 'active',
    "auth_method" TEXT NOT NULL,
    "mfa_satisfied_at" TIMESTAMPTZ(6),
    "ip_address" INET,
    "user_agent" TEXT,
    "last_seen_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."consents" (
    "id" TEXT NOT NULL DEFAULT app.new_id('consent'),
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT,
    "kind" "app"."consent_kind" NOT NULL,
    "state" "app"."consent_state" NOT NULL DEFAULT 'granted',
    "document_version" TEXT NOT NULL,
    "country_code" CHAR(2),
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMPTZ(6),
    "ip_address" INET,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."brands" (
    "id" TEXT NOT NULL DEFAULT app.new_id('brand'),
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" CITEXT NOT NULL,
    "voice" TEXT,
    "audience" TEXT,
    "approved_claims" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blocked_terms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "locale_rules" JSONB NOT NULL DEFAULT '{}',
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "disclosure_defaults" JSONB NOT NULL DEFAULT '{}',
    "default_time_zone" TEXT,
    "default_short_link_on" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."business_profiles" (
    "id" TEXT NOT NULL DEFAULT app.new_id('bprof'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "product_name" TEXT,
    "product_url" TEXT,
    "product_url_verified_at" TIMESTAMPTZ(6),
    "description" TEXT,
    "category" TEXT,
    "markets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ideal_customer" TEXT,
    "objective" TEXT,
    "conversion_event" TEXT,
    "existing_channels" JSONB NOT NULL DEFAULT '[]',
    "proven_claims" JSONB NOT NULL DEFAULT '[]',
    "prohibited_claims" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "competitors" JSONB NOT NULL DEFAULT '[]',
    "weekly_capacity_hours" INTEGER,
    "constraints" TEXT,
    "completeness_score" INTEGER NOT NULL DEFAULT 0,
    "confirmed_at" TIMESTAMPTZ(6),
    "confirmed_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."brand_sources" (
    "id" TEXT NOT NULL DEFAULT app.new_id('bsrc'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "kind" "app"."brand_source_kind" NOT NULL,
    "label" TEXT NOT NULL,
    "source_url" TEXT,
    "storage_key" TEXT,
    "checksum" TEXT,
    "byte_size" INTEGER,
    "mime_type" TEXT,
    "consent_state" "app"."source_consent_state" NOT NULL DEFAULT 'declared',
    "extracted_text" TEXT,
    "retrieved_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "brand_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."glossary_terms" (
    "id" TEXT NOT NULL DEFAULT app.new_id('term'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "preferred_translation" TEXT,
    "prohibited_translations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "context" TEXT,
    "do_not_translate" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "glossary_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."campaigns" (
    "id" TEXT NOT NULL DEFAULT app.new_id('campaign'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "utm_defaults" JSONB NOT NULL DEFAULT '{}',
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "archived_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."content_items" (
    "id" TEXT NOT NULL DEFAULT app.new_id('content'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "campaign_id" TEXT,
    "posting_set_id" TEXT,
    "title" TEXT,
    "brief" TEXT,
    "state" "app"."publish_state" NOT NULL DEFAULT 'draft',
    "approval_policy" "app"."approval_policy" NOT NULL DEFAULT 'none',
    "current_version_id" TEXT,
    "approved_version_id" TEXT,
    "scheduled_at" TIMESTAMPTZ(6),
    "scheduled_time_zone" TEXT,
    "approved_at" TIMESTAMPTZ(6),
    "published_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "repeat_every_days" INTEGER,
    "repeat_until" TIMESTAMPTZ(6),
    "repeat_count" INTEGER,
    "repeat_of_item_id" TEXT,
    "surface" "app"."creation_surface" NOT NULL DEFAULT 'web',
    "creation_method" "app"."creation_method" NOT NULL DEFAULT 'human',
    "created_by_user_id" TEXT,
    "created_by_service_account_id" TEXT,
    "correlation_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."content_versions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('cver'),
    "workspace_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "content_hash" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "creation_method" "app"."creation_method" NOT NULL DEFAULT 'human',
    "ai_model" TEXT,
    "ai_prompt_version" TEXT,
    "source_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."post_variants" (
    "id" TEXT NOT NULL DEFAULT app.new_id('pv'),
    "workspace_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "destination_id" TEXT,
    "provider" "app"."provider_kind" NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "body" TEXT NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "media_asset_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mention_entity_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "signature_id" TEXT,
    "inherited_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overridden_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "state" "app"."publish_state" NOT NULL DEFAULT 'draft',
    "capability_snapshot_version" TEXT,
    "validation_issues" JSONB NOT NULL DEFAULT '[]',
    "estimated_cost_minor" INTEGER,
    "estimated_cost_currency" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "post_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."posting_sets" (
    "id" TEXT NOT NULL DEFAULT app.new_id('set'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "connection_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "target_defaults" JSONB NOT NULL DEFAULT '{}',
    "comment_skeleton" JSONB NOT NULL DEFAULT '[]',
    "signature_id" TEXT,
    "approval_policy" "app"."approval_policy" NOT NULL DEFAULT 'none',
    "slot_behavior" TEXT NOT NULL DEFAULT 'next_free_slot',
    "archived_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "posting_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."signatures" (
    "id" TEXT NOT NULL DEFAULT app.new_id('sig'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "providers" "app"."provider_kind"[] DEFAULT ARRAY[]::"app"."provider_kind"[],
    "auto_apply" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."provider_destinations" (
    "id" TEXT NOT NULL DEFAULT app.new_id('dest'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "provider" "app"."provider_kind" NOT NULL,
    "kind" "app"."destination_kind" NOT NULL,
    "external_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "permalink" TEXT,
    "can_publish" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "refreshed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stale_after" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."mention_entities" (
    "id" TEXT NOT NULL DEFAULT app.new_id('mention'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "provider" "app"."provider_kind" NOT NULL,
    "kind" "app"."mention_entity_kind" NOT NULL,
    "external_id" TEXT NOT NULL,
    "handle" TEXT,
    "display_label" TEXT NOT NULL,
    "avatar_url" TEXT,
    "resolved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "mention_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."approval_requests" (
    "id" TEXT NOT NULL DEFAULT app.new_id('approval'),
    "workspace_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "policy" "app"."approval_policy" NOT NULL,
    "state" "app"."approval_state" NOT NULL DEFAULT 'pending',
    "requested_by_user_id" TEXT,
    "requested_by_service_account_id" TEXT,
    "assigned_user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "note" TEXT,
    "due_at" TIMESTAMPTZ(6),
    "resolved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."approval_decisions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('apdecision'),
    "workspace_id" TEXT NOT NULL,
    "approval_request_id" TEXT NOT NULL,
    "decision" "app"."approval_decision_kind" NOT NULL,
    "decided_by_user_id" TEXT NOT NULL,
    "comment" TEXT,
    "reviewed_content_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."comment_thread_items" (
    "id" TEXT NOT NULL DEFAULT app.new_id('cmt'),
    "workspace_id" TEXT NOT NULL,
    "post_variant_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "media_asset_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delay_minutes" INTEGER NOT NULL DEFAULT 0,
    "author_connection_id" TEXT,
    "state" "app"."publish_state" NOT NULL DEFAULT 'draft',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "comment_thread_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."growth_plans" (
    "id" TEXT NOT NULL DEFAULT app.new_id('plan'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "business_profile_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "state" "app"."growth_plan_state" NOT NULL DEFAULT 'draft',
    "objective" TEXT,
    "schema_version" TEXT NOT NULL DEFAULT '1',
    "sections" JSONB NOT NULL DEFAULT '{}',
    "channel_priorities" JSONB NOT NULL DEFAULT '[]',
    "content_pillars" JSONB NOT NULL DEFAULT '[]',
    "cadence" JSONB NOT NULL DEFAULT '{}',
    "ugc_plan" JSONB NOT NULL DEFAULT '{}',
    "measurement_plan" JSONB NOT NULL DEFAULT '{}',
    "risks_and_unknowns" JSONB NOT NULL DEFAULT '[]',
    "ai_model" TEXT,
    "ai_prompt_version" TEXT,
    "evidence_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "superseded_by_plan_id" TEXT,
    "approved_at" TIMESTAMPTZ(6),
    "approved_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "growth_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."growth_opportunities" (
    "id" TEXT NOT NULL DEFAULT app.new_id('opp'),
    "kind" "app"."opportunity_kind" NOT NULL,
    "name" TEXT NOT NULL,
    "official_url" TEXT NOT NULL,
    "description" TEXT,
    "audience" TEXT,
    "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "submission_method" TEXT NOT NULL,
    "submission_rules" TEXT,
    "cost_minor" INTEGER NOT NULL DEFAULT 0,
    "cost_currency" TEXT NOT NULL DEFAULT 'USD',
    "disclosure_rules" TEXT,
    "self_promotion_allowed" BOOLEAN NOT NULL DEFAULT false,
    "source_note" TEXT,
    "state" "app"."catalog_state" NOT NULL DEFAULT 'draft',
    "last_verified_at" TIMESTAMPTZ(6),
    "next_review_at" TIMESTAMPTZ(6),
    "verified_by_user_id" TEXT,
    "change_log" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "growth_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."strategy_opportunity_matches" (
    "id" TEXT NOT NULL DEFAULT app.new_id('oppmatch'),
    "workspace_id" TEXT NOT NULL,
    "growth_plan_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "fit_explanation" TEXT NOT NULL,
    "suggested_asset" TEXT,
    "suggested_pitch" TEXT,
    "estimated_effort" TEXT,
    "evidence_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "decision" "app"."match_decision" NOT NULL DEFAULT 'proposed',
    "decided_by_user_id" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "outcome_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "strategy_opportunity_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."tool_catalog_entries" (
    "id" TEXT NOT NULL DEFAULT app.new_id('tool'),
    "name" TEXT NOT NULL,
    "official_url" TEXT NOT NULL,
    "category" "app"."tool_category" NOT NULL,
    "summary" TEXT NOT NULL,
    "use_cases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inputs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "outputs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price_model" TEXT NOT NULL,
    "price_note" TEXT,
    "rights_caveats" TEXT,
    "privacy_caveats" TEXT,
    "limitations" TEXT,
    "integrations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_affiliate" BOOLEAN NOT NULL DEFAULT false,
    "affiliate_disclosure" TEXT,
    "state" "app"."catalog_state" NOT NULL DEFAULT 'draft',
    "last_verified_at" TIMESTAMPTZ(6),
    "next_review_at" TIMESTAMPTZ(6),
    "verified_by_user_id" TEXT,
    "change_log" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tool_catalog_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."social_connections" (
    "id" TEXT NOT NULL DEFAULT app.new_id('conn'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT,
    "provider" "app"."provider_kind" NOT NULL,
    "external_account_id" TEXT NOT NULL,
    "account_type" "app"."external_account_type" NOT NULL,
    "display_name" TEXT NOT NULL,
    "handle" TEXT,
    "avatar_url" TEXT,
    "profile_url" TEXT,
    "status" "app"."connection_status" NOT NULL DEFAULT 'active',
    "status_reason" TEXT,
    "granted_scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "capabilities" JSONB NOT NULL DEFAULT '{}',
    "capability_version" TEXT,
    "capabilities_refreshed_at" TIMESTAMPTZ(6),
    "last_successful_action_at" TIMESTAMPTZ(6),
    "connected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnected_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "social_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."social_credentials" (
    "id" TEXT NOT NULL DEFAULT app.new_id('cred'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "access_token_ciphertext" BYTEA NOT NULL,
    "access_token_nonce" BYTEA NOT NULL,
    "refresh_token_ciphertext" BYTEA,
    "refresh_token_nonce" BYTEA,
    "algorithm" TEXT NOT NULL DEFAULT 'aes-256-gcm',
    "key_version" TEXT NOT NULL,
    "wrapped_data_key" BYTEA,
    "access_token_expires_at" TIMESTAMPTZ(6),
    "refresh_token_expires_at" TIMESTAMPTZ(6),
    "last_refreshed_at" TIMESTAMPTZ(6),
    "last_refresh_error" TEXT,
    "rotated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "social_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."oauth_transactions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('oauth'),
    "workspace_id" TEXT NOT NULL,
    "purpose" "private"."oauth_transaction_purpose" NOT NULL,
    "provider" "app"."provider_kind",
    "state_hash" TEXT NOT NULL,
    "code_challenge" TEXT,
    "code_challenge_method" TEXT,
    "redirect_uri" TEXT NOT NULL,
    "requested_scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "initiated_by_user_id" TEXT,
    "oauth_client_id" TEXT,
    "reconnect_connection_id" TEXT,
    "consumed_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."oauth_clients" (
    "id" TEXT NOT NULL DEFAULT app.new_id('app'),
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_type" "private"."oauth_client_type" NOT NULL,
    "secret_hash" TEXT,
    "secret_rotated_at" TIMESTAMPTZ(6),
    "redirect_uris" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowed_scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "homepage_url" TEXT,
    "privacy_policy_url" TEXT,
    "terms_url" TEXT,
    "logo_url" TEXT,
    "status" "private"."oauth_client_status" NOT NULL DEFAULT 'sandbox',
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."oauth_grants" (
    "id" TEXT NOT NULL DEFAULT app.new_id('grant'),
    "workspace_id" TEXT NOT NULL,
    "oauth_client_id" TEXT NOT NULL,
    "subject_user_id" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "brand_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "connection_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refresh_token_hash" TEXT,
    "refresh_token_rotated_at" TIMESTAMPTZ(6),
    "consented_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "revoked_by_user_id" TEXT,

    CONSTRAINT "oauth_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."outbox" (
    "id" TEXT NOT NULL DEFAULT app.new_id('outbox'),
    "workspace_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "dedupe_key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "available_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error_code" TEXT,
    "claimed_at" TIMESTAMPTZ(6),
    "dispatched_at" TIMESTAMPTZ(6),
    "dead_lettered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."outbox_dead_letter" (
    "id" TEXT NOT NULL DEFAULT app.new_id('outboxdl'),
    "workspace_id" TEXT NOT NULL,
    "outbox_event_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "dedupe_key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL,
    "error_code" TEXT NOT NULL,
    "failed_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_dead_letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."media_assets" (
    "id" TEXT NOT NULL DEFAULT app.new_id('media'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT,
    "kind" "app"."media_kind" NOT NULL,
    "storage_bucket" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "checksum_sha256" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,
    "frame_rate" DOUBLE PRECISION,
    "alt_text" TEXT,
    "alt_text_waived_at" TIMESTAMPTZ(6),
    "alt_text_waived_reason" TEXT,
    "alt_text_waived_by_name" TEXT,
    "rights" "app"."rights_declaration" NOT NULL DEFAULT 'unverified',
    "rights_note" TEXT,
    "origin_kind" TEXT NOT NULL DEFAULT 'upload',
    "origin_url" TEXT,
    "scan_state" "app"."media_scan_state" NOT NULL DEFAULT 'pending',
    "scan_note" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_by_user_id" TEXT,
    "deleted_at" TIMESTAMPTZ(6),
    "retention_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "storage_deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."media_derivatives" (
    "id" TEXT NOT NULL DEFAULT app.new_id('mder'),
    "workspace_id" TEXT NOT NULL,
    "media_asset_id" TEXT NOT NULL,
    "kind" "app"."derivative_kind" NOT NULL,
    "provider" "app"."provider_kind",
    "preset_key" TEXT NOT NULL,
    "storage_bucket" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "checksum_sha256" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_derivatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."publish_jobs" (
    "id" TEXT NOT NULL DEFAULT app.new_id('job'),
    "workspace_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "post_variant_id" TEXT,
    "comment_thread_item_id" TEXT,
    "connection_id" TEXT NOT NULL,
    "approval_request_id" TEXT,
    "approval_policy" "app"."approval_policy" NOT NULL DEFAULT 'none',
    "scheduled_for" TIMESTAMPTZ(6) NOT NULL,
    "scheduled_time_zone" TEXT NOT NULL,
    "state" "app"."publish_state" NOT NULL DEFAULT 'scheduled',
    "idempotency_key" TEXT NOT NULL,
    "temporal_workflow_id" TEXT,
    "temporal_run_id" TEXT,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMPTZ(6),
    "last_error_class" "app"."error_class",
    "last_error_code" TEXT,
    "surface" "app"."creation_surface" NOT NULL DEFAULT 'web',
    "dispatched_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "publish_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."publish_attempts" (
    "id" TEXT NOT NULL DEFAULT app.new_id('att'),
    "workspace_id" TEXT NOT NULL,
    "publish_job_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "outcome" "app"."attempt_outcome" NOT NULL DEFAULT 'pending',
    "error_class" "app"."error_class",
    "error_code" TEXT,
    "sanitized_response" JSONB NOT NULL DEFAULT '{}',
    "request_metadata" JSONB NOT NULL DEFAULT '{}',
    "provider_request_id" TEXT,
    "http_status" INTEGER,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),
    "retry_after_seconds" INTEGER,
    "cost_estimate_minor" INTEGER,
    "cost_actual_minor" INTEGER,
    "cost_currency" TEXT,
    "correlation_id" TEXT,

    CONSTRAINT "publish_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."publication_receipts" (
    "id" TEXT NOT NULL DEFAULT app.new_id('receipt'),
    "workspace_id" TEXT NOT NULL,
    "publish_job_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "provider" "app"."provider_kind" NOT NULL,
    "external_post_id" TEXT NOT NULL,
    "permalink" TEXT,
    "content_hash" TEXT NOT NULL,
    "media_checksums" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published_short_links" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published_at" TIMESTAMPTZ(6) NOT NULL,
    "dispatched_at" TIMESTAMPTZ(6),
    "scheduled_for" TIMESTAMPTZ(6),
    "scheduled_time_zone" TEXT,
    "surface" "app"."creation_surface" NOT NULL,
    "approved_by_user_id" TEXT,
    "approval_policy" "app"."approval_policy" NOT NULL DEFAULT 'none',
    "cost_actual_minor" INTEGER,
    "cost_currency" TEXT,
    "response_evidence" JSONB NOT NULL DEFAULT '{}',
    "deleted_externally_at" TIMESTAMPTZ(6),
    "last_analytics_sync_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."provider_limits" (
    "id" TEXT NOT NULL DEFAULT app.new_id('limit'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT,
    "provider" "app"."provider_kind" NOT NULL,
    "resource" TEXT NOT NULL,
    "window_seconds" INTEGER NOT NULL,
    "limit_value" INTEGER,
    "remaining" INTEGER,
    "resets_at" TIMESTAMPTZ(6),
    "policy_version" TEXT,
    "observed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."connection_incidents" (
    "id" TEXT NOT NULL DEFAULT app.new_id('incident'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "kind" "app"."incident_kind" NOT NULL,
    "state" "app"."incident_state" NOT NULL DEFAULT 'open',
    "remediation_key" TEXT NOT NULL,
    "detail" JSONB NOT NULL DEFAULT '{}',
    "detected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_at" TIMESTAMPTZ(6),
    "resolved_at" TIMESTAMPTZ(6),
    "resolved_by_user_id" TEXT,

    CONSTRAINT "connection_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."automation_rules" (
    "id" TEXT NOT NULL DEFAULT app.new_id('rule'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "app"."automation_rule_state" NOT NULL DEFAULT 'draft',
    "trigger" JSONB NOT NULL DEFAULT '{}',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "delay_seconds" INTEGER NOT NULL DEFAULT 0,
    "end_condition" JSONB NOT NULL DEFAULT '{}',
    "measurement_window_seconds" INTEGER,
    "cooldown_seconds" INTEGER,
    "max_executions" INTEGER,
    "execution_count" INTEGER NOT NULL DEFAULT 0,
    "run_once_per_source" BOOLEAN NOT NULL DEFAULT true,
    "skip_when_metric_stale" BOOLEAN NOT NULL DEFAULT true,
    "requires_approval" BOOLEAN NOT NULL DEFAULT true,
    "preauthorized_connection_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "last_run_at" TIMESTAMPTZ(6),
    "paused_reason" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."automation_rule_runs" (
    "id" TEXT NOT NULL DEFAULT app.new_id('rulerun'),
    "workspace_id" TEXT NOT NULL,
    "automation_rule_id" TEXT NOT NULL,
    "rule_version" INTEGER NOT NULL,
    "state" "app"."run_state" NOT NULL DEFAULT 'pending',
    "is_test" BOOLEAN NOT NULL DEFAULT false,
    "source_kind" TEXT NOT NULL,
    "source_id" TEXT,
    "trigger_payload" JSONB NOT NULL DEFAULT '{}',
    "evaluated_conditions" JSONB NOT NULL DEFAULT '[]',
    "performed_actions" JSONB NOT NULL DEFAULT '[]',
    "blocked_reason" TEXT,
    "error_class" "app"."error_class",
    "error_code" TEXT,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),
    "correlation_id" TEXT,

    CONSTRAINT "automation_rule_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."rss_feeds" (
    "id" TEXT NOT NULL DEFAULT app.new_id('rss'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "feed_url" TEXT NOT NULL,
    "health" "app"."feed_health" NOT NULL DEFAULT 'healthy',
    "connection_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publish_policy" TEXT NOT NULL DEFAULT 'draft',
    "template_body" TEXT,
    "use_ai_adaptation" BOOLEAN NOT NULL DEFAULT false,
    "mark_current_as_seen" BOOLEAN NOT NULL DEFAULT true,
    "poll_interval_seconds" INTEGER NOT NULL DEFAULT 900,
    "last_polled_at" TIMESTAMPTZ(6),
    "last_new_item_at" TIMESTAMPTZ(6),
    "last_error" TEXT,
    "paused_at" TIMESTAMPTZ(6),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "rss_feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."rss_feed_items" (
    "id" TEXT NOT NULL DEFAULT app.new_id('rssitem'),
    "workspace_id" TEXT NOT NULL,
    "rss_feed_id" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "link" TEXT,
    "title" TEXT,
    "summary" TEXT,
    "image_url" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "state" "app"."rss_item_state" NOT NULL DEFAULT 'seen',
    "content_item_id" TEXT,
    "error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rss_feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."webhook_endpoints" (
    "id" TEXT NOT NULL DEFAULT app.new_id('whep'),
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "state" "private"."webhook_endpoint_state" NOT NULL DEFAULT 'active',
    "secret_ciphertext" BYTEA NOT NULL,
    "secret_nonce" BYTEA NOT NULL,
    "key_version" TEXT NOT NULL,
    "secret_rotated_at" TIMESTAMPTZ(6),
    "subscribed_events" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "brand_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "connection_scope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "consecutive_failures" INTEGER NOT NULL DEFAULT 0,
    "disabled_reason" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."webhook_deliveries" (
    "id" TEXT NOT NULL DEFAULT app.new_id('whd'),
    "workspace_id" TEXT NOT NULL,
    "webhook_endpoint_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "state" "private"."webhook_delivery_state" NOT NULL DEFAULT 'pending',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "payload_hash" TEXT NOT NULL,
    "signature_version" TEXT NOT NULL DEFAULT 'v1',
    "response_status" INTEGER,
    "response_snippet" TEXT,
    "next_attempt_at" TIMESTAMPTZ(6),
    "delivered_at" TIMESTAMPTZ(6),
    "dead_lettered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."metric_definitions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('metric'),
    "provider" "app"."provider_kind" NOT NULL,
    "provider_field_name" TEXT NOT NULL,
    "provider_definition" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "unit" "app"."metric_unit" NOT NULL,
    "availability" "app"."metric_availability" NOT NULL DEFAULT 'available',
    "aggregation_rule" "app"."aggregation_rule" NOT NULL DEFAULT 'latest_snapshot',
    "derivation_restricted" BOOLEAN NOT NULL DEFAULT false,
    "denominator_note" TEXT,
    "applies_to_account" BOOLEAN NOT NULL DEFAULT false,
    "applies_to_post" BOOLEAN NOT NULL DEFAULT true,
    "documentation_url" TEXT,
    "last_verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."metric_observations" (
    "id" TEXT NOT NULL DEFAULT app.new_id('observation'),
    "workspace_id" TEXT NOT NULL,
    "metric_definition_id" TEXT NOT NULL,
    "receipt_id" TEXT,
    "connection_id" TEXT NOT NULL,
    "provider" "app"."provider_kind" NOT NULL,
    "external_post_id" TEXT,
    "observed_at" TIMESTAMPTZ(6) NOT NULL,
    "raw_value" DECIMAL(20,4),
    "normalized_value" DECIMAL(20,4),
    "availability" "app"."metric_availability" NOT NULL DEFAULT 'available',
    "unavailable_reason" TEXT,
    "source_response_hash" TEXT,
    "sync_run_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."analytics_sync_runs" (
    "id" TEXT NOT NULL DEFAULT app.new_id('sync'),
    "workspace_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "provider" "app"."provider_kind" NOT NULL,
    "state" "app"."run_state" NOT NULL DEFAULT 'pending',
    "scope" TEXT NOT NULL,
    "cursor" TEXT,
    "window_start" TIMESTAMPTZ(6),
    "window_end" TIMESTAMPTZ(6),
    "receipts_covered" INTEGER NOT NULL DEFAULT 0,
    "observations_written" INTEGER NOT NULL DEFAULT 0,
    "error_class" "app"."error_class",
    "error_code" TEXT,
    "provider_cost_minor" INTEGER,
    "cost_currency" TEXT,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),

    CONSTRAINT "analytics_sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."experiments" (
    "id" TEXT NOT NULL DEFAULT app.new_id('exp'),
    "workspace_id" TEXT NOT NULL,
    "campaign_id" TEXT,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "variants" JSONB NOT NULL DEFAULT '[]',
    "success_metric" TEXT NOT NULL,
    "window_start" TIMESTAMPTZ(6) NOT NULL,
    "window_end" TIMESTAMPTZ(6) NOT NULL,
    "state" "app"."experiment_state" NOT NULL DEFAULT 'planned',
    "caveats" TEXT,
    "conclusion" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."insights" (
    "id" TEXT NOT NULL DEFAULT app.new_id('insight'),
    "workspace_id" TEXT NOT NULL,
    "content_item_id" TEXT,
    "experiment_id" TEXT,
    "message_key" TEXT NOT NULL,
    "message_args" JSONB NOT NULL DEFAULT '{}',
    "evidence_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" TEXT NOT NULL DEFAULT 'low',
    "sample_size" INTEGER,
    "state" "app"."insight_state" NOT NULL DEFAULT 'new',
    "ai_model" TEXT,
    "ai_prompt_version" TEXT,
    "decided_by_user_id" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."short_links" (
    "id" TEXT NOT NULL DEFAULT app.new_id('lnk'),
    "workspace_id" TEXT NOT NULL,
    "brand_id" TEXT,
    "campaign_id" TEXT,
    "domain" TEXT,
    "slug" TEXT NOT NULL,
    "destination_url" TEXT NOT NULL,
    "utm_parameters" JSONB NOT NULL DEFAULT '{}',
    "state" "app"."short_link_state" NOT NULL DEFAULT 'active',
    "safety_scan" JSONB NOT NULL DEFAULT '{}',
    "safety_scanned_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "disabled_at" TIMESTAMPTZ(6),
    "destination_history" JSONB NOT NULL DEFAULT '[]',
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "short_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."short_link_clicks" (
    "id" TEXT NOT NULL DEFAULT app.new_id('click'),
    "workspace_id" TEXT NOT NULL,
    "short_link_id" TEXT NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "country_code" TEXT,
    "device_class" TEXT,
    "referrer_class" TEXT,
    "bot_class" "app"."bot_classification" NOT NULL DEFAULT 'unknown',
    "dedupe_key" TEXT NOT NULL,
    "dedupe_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "short_link_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."polar_customers" (
    "id" TEXT NOT NULL DEFAULT app.new_id('customer'),
    "workspace_id" TEXT NOT NULL,
    "polar_customer_id" TEXT NOT NULL,
    "billing_email" CITEXT NOT NULL,
    "portal_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "polar_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."subscriptions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('sub'),
    "workspace_id" TEXT NOT NULL,
    "polar_customer_id" TEXT NOT NULL,
    "polar_subscription_id" TEXT NOT NULL,
    "polar_product_id" TEXT NOT NULL,
    "status" "private"."subscription_status" NOT NULL,
    "interval" "private"."billing_interval" NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "trial_starts_at" TIMESTAMPTZ(6),
    "trial_ends_at" TIMESTAMPTZ(6),
    "current_period_start" TIMESTAMPTZ(6),
    "current_period_end" TIMESTAMPTZ(6),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "canceled_at" TIMESTAMPTZ(6),
    "past_due_since" TIMESTAMPTZ(6),
    "last_reconciled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."entitlements" (
    "id" TEXT NOT NULL DEFAULT app.new_id('entitlement'),
    "workspace_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "key" TEXT NOT NULL,
    "kind" "private"."entitlement_kind" NOT NULL,
    "boolean_value" BOOLEAN,
    "numeric_value" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'polar_webhook',
    "effective_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_until" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."usage_events" (
    "id" TEXT NOT NULL DEFAULT app.new_id('usage'),
    "workspace_id" TEXT NOT NULL,
    "meter_key" TEXT NOT NULL,
    "quantity" DECIMAL(20,6) NOT NULL,
    "unit" TEXT NOT NULL,
    "cost_minor" INTEGER,
    "cost_currency" TEXT,
    "provider" "app"."provider_kind",
    "reference_type" TEXT,
    "reference_id" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "reported_to_polar_at" TIMESTAMPTZ(6),
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."billing_webhook_inbox" (
    "id" TEXT NOT NULL DEFAULT app.new_id('billingevent'),
    "provider" TEXT NOT NULL DEFAULT 'polar',
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "signature_valid" BOOLEAN NOT NULL,
    "body_hash" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "state" "private"."inbox_processing_state" NOT NULL DEFAULT 'received',
    "processing_error" TEXT,
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),

    CONSTRAINT "billing_webhook_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."affiliate_partners" (
    "id" TEXT NOT NULL DEFAULT app.new_id('aff'),
    "workspace_id" TEXT NOT NULL,
    "contact_user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "referral_code" CITEXT NOT NULL,
    "state" "private"."affiliate_partner_state" NOT NULL DEFAULT 'applied',
    "commission_rate_bps" INTEGER NOT NULL DEFAULT 2000,
    "disclosure_accepted_at" TIMESTAMPTZ(6),
    "disclosure_version" TEXT,
    "payout_method" TEXT,
    "fraud_flags" JSONB NOT NULL DEFAULT '[]',
    "approved_at" TIMESTAMPTZ(6),
    "terminated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "affiliate_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."referral_attributions" (
    "id" TEXT NOT NULL DEFAULT app.new_id('referral'),
    "workspace_id" TEXT NOT NULL,
    "affiliate_partner_id" TEXT NOT NULL,
    "referral_code" CITEXT NOT NULL,
    "landing_url" TEXT,
    "referrer_class" TEXT,
    "attributed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "converted_at" TIMESTAMPTZ(6),
    "polar_order_id" TEXT,
    "fraud_review_state" TEXT NOT NULL DEFAULT 'pending',
    "fraud_review_note" TEXT,

    CONSTRAINT "referral_attributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."commission_ledger" (
    "id" TEXT NOT NULL DEFAULT app.new_id('commission'),
    "workspace_id" TEXT NOT NULL,
    "affiliate_partner_id" TEXT NOT NULL,
    "referral_attribution_id" TEXT NOT NULL,
    "payout_batch_id" TEXT,
    "polar_order_id" TEXT NOT NULL,
    "amount_minor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "state" "private"."commission_state" NOT NULL DEFAULT 'pending',
    "hold_until" TIMESTAMPTZ(6),
    "reversal_of_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commission_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."payout_batches" (
    "id" TEXT NOT NULL DEFAULT app.new_id('payout'),
    "reference" TEXT NOT NULL,
    "state" "private"."payout_batch_state" NOT NULL DEFAULT 'open',
    "period_start" TIMESTAMPTZ(6) NOT NULL,
    "period_end" TIMESTAMPTZ(6) NOT NULL,
    "total_minor" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exported_at" TIMESTAMPTZ(6),
    "paid_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."deletion_requests" (
    "id" TEXT NOT NULL DEFAULT app.new_id('deletion'),
    "workspace_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "subject_user_id" TEXT,
    "state" "app"."deletion_request_state" NOT NULL DEFAULT 'requested',
    "reason" TEXT,
    "execute_after" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "executed_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "steps" JSONB NOT NULL DEFAULT '[]',
    "failure_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "deletion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."data_exports" (
    "id" TEXT NOT NULL DEFAULT app.new_id('export'),
    "workspace_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'json',
    "state" "app"."data_export_state" NOT NULL DEFAULT 'requested',
    "storage_bucket" TEXT,
    "storage_key" TEXT,
    "byte_size" BIGINT,
    "checksum_sha256" TEXT,
    "downloaded_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "failure_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "data_exports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_subject_id_key" ON "app"."users"("auth_subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app"."users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "app"."users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_aliases_normalized_handle_key" ON "app"."user_aliases"("normalized_handle");

-- CreateIndex
CREATE INDEX "user_aliases_user_id_idx" ON "app"."user_aliases"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "app"."workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_owner_user_id_idx" ON "app"."workspaces"("owner_user_id");

-- CreateIndex
CREATE INDEX "workspaces_status_idx" ON "app"."workspaces"("status");

-- CreateIndex
CREATE INDEX "memberships_workspace_id_idx" ON "app"."memberships"("workspace_id");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "app"."memberships"("user_id");

-- CreateIndex
CREATE INDEX "memberships_workspace_id_role_state_idx" ON "app"."memberships"("workspace_id", "role", "state");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_workspace_id_user_id_key" ON "app"."memberships"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_hash_key" ON "private"."invitations"("token_hash");

-- CreateIndex
CREATE INDEX "invitations_workspace_id_idx" ON "private"."invitations"("workspace_id");

-- CreateIndex
CREATE INDEX "invitations_workspace_id_state_expires_at_idx" ON "private"."invitations"("workspace_id", "state", "expires_at");

-- CreateIndex
CREATE INDEX "invitations_email_state_idx" ON "private"."invitations"("email", "state");

-- CreateIndex
CREATE INDEX "role_permissions_workspace_id_idx" ON "app"."role_permissions"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_workspace_id_role_permission_key" ON "app"."role_permissions"("workspace_id", "role", "permission");

-- CreateIndex
CREATE INDEX "service_accounts_workspace_id_idx" ON "app"."service_accounts"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_accounts_workspace_id_name_key" ON "app"."service_accounts"("workspace_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_prefix_key" ON "private"."api_keys"("prefix");

-- CreateIndex
CREATE INDEX "api_keys_workspace_id_idx" ON "private"."api_keys"("workspace_id");

-- CreateIndex
CREATE INDEX "api_keys_service_account_id_idx" ON "private"."api_keys"("service_account_id");

-- CreateIndex
CREATE INDEX "audit_events_workspace_id_created_at_idx" ON "private"."audit_events"("workspace_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_events_workspace_id_target_type_target_id_idx" ON "private"."audit_events"("workspace_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "audit_events_workspace_id_actor_type_actor_id_created_at_idx" ON "private"."audit_events"("workspace_id", "actor_type", "actor_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_events_correlation_id_idx" ON "private"."audit_events"("correlation_id");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_state_idx" ON "private"."user_sessions"("user_id", "state");

-- CreateIndex
CREATE INDEX "user_sessions_workspace_id_idx" ON "private"."user_sessions"("workspace_id");

-- CreateIndex
CREATE INDEX "consents_workspace_id_idx" ON "app"."consents"("workspace_id");

-- CreateIndex
CREATE INDEX "consents_user_id_kind_idx" ON "app"."consents"("user_id", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "consents_user_id_kind_document_version_key" ON "app"."consents"("user_id", "kind", "document_version");

-- CreateIndex
CREATE INDEX "brands_workspace_id_idx" ON "app"."brands"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_workspace_id_slug_key" ON "app"."brands"("workspace_id", "slug");

-- CreateIndex
CREATE INDEX "business_profiles_workspace_id_idx" ON "app"."business_profiles"("workspace_id");

-- CreateIndex
CREATE INDEX "business_profiles_workspace_id_brand_id_confirmed_at_idx" ON "app"."business_profiles"("workspace_id", "brand_id", "confirmed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_brand_id_version_key" ON "app"."business_profiles"("brand_id", "version");

-- CreateIndex
CREATE INDEX "brand_sources_workspace_id_idx" ON "app"."brand_sources"("workspace_id");

-- CreateIndex
CREATE INDEX "brand_sources_workspace_id_brand_id_idx" ON "app"."brand_sources"("workspace_id", "brand_id");

-- CreateIndex
CREATE INDEX "glossary_terms_workspace_id_idx" ON "app"."glossary_terms"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_terms_brand_id_locale_term_key" ON "app"."glossary_terms"("brand_id", "locale", "term");

-- CreateIndex
CREATE INDEX "campaigns_workspace_id_idx" ON "app"."campaigns"("workspace_id");

-- CreateIndex
CREATE INDEX "campaigns_workspace_id_brand_id_idx" ON "app"."campaigns"("workspace_id", "brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_current_version_id_key" ON "app"."content_items"("current_version_id");

-- CreateIndex
CREATE INDEX "content_items_workspace_id_idx" ON "app"."content_items"("workspace_id");

-- CreateIndex
CREATE INDEX "content_items_workspace_id_scheduled_at_state_idx" ON "app"."content_items"("workspace_id", "scheduled_at", "state");

-- CreateIndex
CREATE INDEX "content_items_workspace_id_brand_id_state_idx" ON "app"."content_items"("workspace_id", "brand_id", "state");

-- CreateIndex
CREATE INDEX "content_items_workspace_id_campaign_id_idx" ON "app"."content_items"("workspace_id", "campaign_id");

-- CreateIndex
CREATE INDEX "content_items_repeat_of_item_id_idx" ON "app"."content_items"("repeat_of_item_id");

-- CreateIndex
CREATE INDEX "content_versions_workspace_id_idx" ON "app"."content_versions"("workspace_id");

-- CreateIndex
CREATE INDEX "content_versions_workspace_id_content_hash_idx" ON "app"."content_versions"("workspace_id", "content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_content_item_id_version_key" ON "app"."content_versions"("content_item_id", "version");

-- CreateIndex
CREATE INDEX "post_variants_workspace_id_idx" ON "app"."post_variants"("workspace_id");

-- CreateIndex
CREATE INDEX "post_variants_workspace_id_connection_id_state_idx" ON "app"."post_variants"("workspace_id", "connection_id", "state");

-- CreateIndex
CREATE INDEX "post_variants_content_item_id_idx" ON "app"."post_variants"("content_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_variants_content_version_id_connection_id_key" ON "app"."post_variants"("content_version_id", "connection_id");

-- CreateIndex
CREATE INDEX "posting_sets_workspace_id_idx" ON "app"."posting_sets"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "posting_sets_workspace_id_brand_id_name_key" ON "app"."posting_sets"("workspace_id", "brand_id", "name");

-- CreateIndex
CREATE INDEX "signatures_workspace_id_idx" ON "app"."signatures"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "signatures_workspace_id_brand_id_name_locale_key" ON "app"."signatures"("workspace_id", "brand_id", "name", "locale");

-- CreateIndex
CREATE INDEX "provider_destinations_workspace_id_idx" ON "app"."provider_destinations"("workspace_id");

-- CreateIndex
CREATE INDEX "provider_destinations_workspace_id_connection_id_kind_idx" ON "app"."provider_destinations"("workspace_id", "connection_id", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "provider_destinations_connection_id_kind_external_id_key" ON "app"."provider_destinations"("connection_id", "kind", "external_id");

-- CreateIndex
CREATE INDEX "mention_entities_workspace_id_idx" ON "app"."mention_entities"("workspace_id");

-- CreateIndex
CREATE INDEX "mention_entities_workspace_id_provider_handle_idx" ON "app"."mention_entities"("workspace_id", "provider", "handle");

-- CreateIndex
CREATE UNIQUE INDEX "mention_entities_connection_id_provider_external_id_key" ON "app"."mention_entities"("connection_id", "provider", "external_id");

-- CreateIndex
CREATE INDEX "approval_requests_workspace_id_idx" ON "app"."approval_requests"("workspace_id");

-- CreateIndex
CREATE INDEX "approval_requests_workspace_id_state_due_at_idx" ON "app"."approval_requests"("workspace_id", "state", "due_at");

-- CreateIndex
CREATE INDEX "approval_requests_content_item_id_idx" ON "app"."approval_requests"("content_item_id");

-- CreateIndex
CREATE INDEX "approval_decisions_workspace_id_idx" ON "app"."approval_decisions"("workspace_id");

-- CreateIndex
CREATE INDEX "approval_decisions_approval_request_id_created_at_idx" ON "app"."approval_decisions"("approval_request_id", "created_at");

-- CreateIndex
CREATE INDEX "comment_thread_items_workspace_id_idx" ON "app"."comment_thread_items"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_thread_items_post_variant_id_position_key" ON "app"."comment_thread_items"("post_variant_id", "position");

-- CreateIndex
CREATE INDEX "growth_plans_workspace_id_idx" ON "app"."growth_plans"("workspace_id");

-- CreateIndex
CREATE INDEX "growth_plans_workspace_id_state_idx" ON "app"."growth_plans"("workspace_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "growth_plans_brand_id_version_key" ON "app"."growth_plans"("brand_id", "version");

-- CreateIndex
CREATE INDEX "growth_opportunities_state_kind_idx" ON "app"."growth_opportunities"("state", "kind");

-- CreateIndex
CREATE INDEX "growth_opportunities_state_last_verified_at_idx" ON "app"."growth_opportunities"("state", "last_verified_at");

-- CreateIndex
CREATE UNIQUE INDEX "growth_opportunities_official_url_key" ON "app"."growth_opportunities"("official_url");

-- CreateIndex
CREATE INDEX "strategy_opportunity_matches_workspace_id_idx" ON "app"."strategy_opportunity_matches"("workspace_id");

-- CreateIndex
CREATE INDEX "strategy_opportunity_matches_workspace_id_decision_idx" ON "app"."strategy_opportunity_matches"("workspace_id", "decision");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_opportunity_matches_growth_plan_id_opportunity_id_key" ON "app"."strategy_opportunity_matches"("growth_plan_id", "opportunity_id");

-- CreateIndex
CREATE INDEX "tool_catalog_entries_state_category_idx" ON "app"."tool_catalog_entries"("state", "category");

-- CreateIndex
CREATE INDEX "tool_catalog_entries_state_last_verified_at_idx" ON "app"."tool_catalog_entries"("state", "last_verified_at");

-- CreateIndex
CREATE UNIQUE INDEX "tool_catalog_entries_official_url_key" ON "app"."tool_catalog_entries"("official_url");

-- CreateIndex
CREATE INDEX "social_connections_workspace_id_idx" ON "app"."social_connections"("workspace_id");

-- CreateIndex
CREATE INDEX "social_connections_workspace_id_status_idx" ON "app"."social_connections"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "social_connections_workspace_id_brand_id_provider_idx" ON "app"."social_connections"("workspace_id", "brand_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "uq_social_connections_provider_account_workspace" ON "app"."social_connections"("provider", "external_account_id", "workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_credentials_connection_id_key" ON "private"."social_credentials"("connection_id");

-- CreateIndex
CREATE INDEX "social_credentials_workspace_id_idx" ON "private"."social_credentials"("workspace_id");

-- CreateIndex
CREATE INDEX "social_credentials_access_token_expires_at_idx" ON "private"."social_credentials"("access_token_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_transactions_state_hash_key" ON "private"."oauth_transactions"("state_hash");

-- CreateIndex
CREATE INDEX "oauth_transactions_workspace_id_idx" ON "private"."oauth_transactions"("workspace_id");

-- CreateIndex
CREATE INDEX "oauth_transactions_expires_at_idx" ON "private"."oauth_transactions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "private"."oauth_clients"("client_id");

-- CreateIndex
CREATE INDEX "oauth_clients_workspace_id_idx" ON "private"."oauth_clients"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_grants_refresh_token_hash_key" ON "private"."oauth_grants"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "oauth_grants_workspace_id_idx" ON "private"."oauth_grants"("workspace_id");

-- CreateIndex
CREATE INDEX "oauth_grants_subject_user_id_idx" ON "private"."oauth_grants"("subject_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_grants_oauth_client_id_subject_user_id_workspace_id_key" ON "private"."oauth_grants"("oauth_client_id", "subject_user_id", "workspace_id");

-- CreateIndex
CREATE INDEX "outbox_available_at_id_idx" ON "private"."outbox"("available_at", "id");

-- CreateIndex
CREATE INDEX "outbox_workspace_id_idx" ON "private"."outbox"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_workspace_id_dedupe_key_key" ON "private"."outbox"("workspace_id", "dedupe_key");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_dead_letter_outbox_event_id_key" ON "private"."outbox_dead_letter"("outbox_event_id");

-- CreateIndex
CREATE INDEX "outbox_dead_letter_workspace_id_failed_at_idx" ON "private"."outbox_dead_letter"("workspace_id", "failed_at" DESC);

-- CreateIndex
CREATE INDEX "media_assets_workspace_id_idx" ON "app"."media_assets"("workspace_id");

-- CreateIndex
CREATE INDEX "media_assets_workspace_id_kind_created_at_idx" ON "app"."media_assets"("workspace_id", "kind", "created_at" DESC);

-- CreateIndex
CREATE INDEX "media_assets_retention_expires_at_storage_deleted_at_idx" ON "app"."media_assets"("retention_expires_at", "storage_deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_workspace_id_checksum_sha256_key" ON "app"."media_assets"("workspace_id", "checksum_sha256");

-- CreateIndex
CREATE INDEX "media_derivatives_workspace_id_idx" ON "app"."media_derivatives"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_derivatives_media_asset_id_preset_key_key" ON "app"."media_derivatives"("media_asset_id", "preset_key");

-- CreateIndex
CREATE UNIQUE INDEX "publish_jobs_temporal_workflow_id_key" ON "app"."publish_jobs"("temporal_workflow_id");

-- CreateIndex
CREATE INDEX "publish_jobs_workspace_id_idx" ON "app"."publish_jobs"("workspace_id");

-- CreateIndex
CREATE INDEX "publish_jobs_workspace_id_scheduled_for_state_idx" ON "app"."publish_jobs"("workspace_id", "scheduled_for", "state");

-- CreateIndex
CREATE INDEX "publish_jobs_state_next_attempt_at_idx" ON "app"."publish_jobs"("state", "next_attempt_at");

-- CreateIndex
CREATE INDEX "publish_jobs_workspace_id_connection_id_scheduled_for_idx" ON "app"."publish_jobs"("workspace_id", "connection_id", "scheduled_for");

-- CreateIndex
CREATE UNIQUE INDEX "uq_publish_jobs_workspace_idempotency_key" ON "app"."publish_jobs"("workspace_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "publish_attempts_workspace_id_idx" ON "app"."publish_attempts"("workspace_id");

-- CreateIndex
CREATE INDEX "publish_attempts_workspace_id_started_at_idx" ON "app"."publish_attempts"("workspace_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "publish_attempts_workspace_id_error_class_idx" ON "app"."publish_attempts"("workspace_id", "error_class");

-- CreateIndex
CREATE UNIQUE INDEX "publish_attempts_publish_job_id_attempt_number_key" ON "app"."publish_attempts"("publish_job_id", "attempt_number");

-- CreateIndex
CREATE UNIQUE INDEX "publication_receipts_publish_job_id_key" ON "app"."publication_receipts"("publish_job_id");

-- CreateIndex
CREATE INDEX "publication_receipts_workspace_id_idx" ON "app"."publication_receipts"("workspace_id");

-- CreateIndex
CREATE INDEX "publication_receipts_workspace_id_published_at_idx" ON "app"."publication_receipts"("workspace_id", "published_at" DESC);

-- CreateIndex
CREATE INDEX "publication_receipts_workspace_id_connection_id_published_a_idx" ON "app"."publication_receipts"("workspace_id", "connection_id", "published_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_publication_receipts_provider_external_post_id" ON "app"."publication_receipts"("provider", "external_post_id");

-- CreateIndex
CREATE INDEX "provider_limits_workspace_id_idx" ON "app"."provider_limits"("workspace_id");

-- CreateIndex
CREATE INDEX "provider_limits_workspace_id_provider_resource_observed_at_idx" ON "app"."provider_limits"("workspace_id", "provider", "resource", "observed_at" DESC);

-- CreateIndex
CREATE INDEX "connection_incidents_workspace_id_idx" ON "app"."connection_incidents"("workspace_id");

-- CreateIndex
CREATE INDEX "connection_incidents_workspace_id_state_detected_at_idx" ON "app"."connection_incidents"("workspace_id", "state", "detected_at" DESC);

-- CreateIndex
CREATE INDEX "automation_rules_workspace_id_idx" ON "app"."automation_rules"("workspace_id");

-- CreateIndex
CREATE INDEX "automation_rules_workspace_id_state_idx" ON "app"."automation_rules"("workspace_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "automation_rules_workspace_id_brand_id_name_key" ON "app"."automation_rules"("workspace_id", "brand_id", "name");

-- CreateIndex
CREATE INDEX "automation_rule_runs_workspace_id_idx" ON "app"."automation_rule_runs"("workspace_id");

-- CreateIndex
CREATE INDEX "automation_rule_runs_workspace_id_automation_rule_id_starte_idx" ON "app"."automation_rule_runs"("workspace_id", "automation_rule_id", "started_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "automation_rule_runs_automation_rule_id_source_kind_source__key" ON "app"."automation_rule_runs"("automation_rule_id", "source_kind", "source_id");

-- CreateIndex
CREATE INDEX "rss_feeds_workspace_id_idx" ON "app"."rss_feeds"("workspace_id");

-- CreateIndex
CREATE INDEX "rss_feeds_health_last_polled_at_idx" ON "app"."rss_feeds"("health", "last_polled_at");

-- CreateIndex
CREATE UNIQUE INDEX "rss_feeds_workspace_id_feed_url_key" ON "app"."rss_feeds"("workspace_id", "feed_url");

-- CreateIndex
CREATE INDEX "rss_feed_items_workspace_id_idx" ON "app"."rss_feed_items"("workspace_id");

-- CreateIndex
CREATE INDEX "rss_feed_items_workspace_id_rss_feed_id_created_at_idx" ON "app"."rss_feed_items"("workspace_id", "rss_feed_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "rss_feed_items_rss_feed_id_fingerprint_key" ON "app"."rss_feed_items"("rss_feed_id", "fingerprint");

-- CreateIndex
CREATE INDEX "webhook_endpoints_workspace_id_idx" ON "private"."webhook_endpoints"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_endpoints_workspace_id_name_key" ON "private"."webhook_endpoints"("workspace_id", "name");

-- CreateIndex
CREATE INDEX "webhook_deliveries_workspace_id_idx" ON "private"."webhook_deliveries"("workspace_id");

-- CreateIndex
CREATE INDEX "webhook_deliveries_state_next_attempt_at_idx" ON "private"."webhook_deliveries"("state", "next_attempt_at");

-- CreateIndex
CREATE INDEX "webhook_deliveries_workspace_id_created_at_idx" ON "private"."webhook_deliveries"("workspace_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_deliveries_webhook_endpoint_id_event_id_key" ON "private"."webhook_deliveries"("webhook_endpoint_id", "event_id");

-- CreateIndex
CREATE INDEX "metric_definitions_provider_normalized_name_idx" ON "app"."metric_definitions"("provider", "normalized_name");

-- CreateIndex
CREATE UNIQUE INDEX "metric_definitions_provider_provider_field_name_key" ON "app"."metric_definitions"("provider", "provider_field_name");

-- CreateIndex
CREATE INDEX "metric_observations_workspace_id_idx" ON "app"."metric_observations"("workspace_id");

-- CreateIndex
CREATE INDEX "metric_observations_receipt_id_observed_at_idx" ON "app"."metric_observations"("receipt_id", "observed_at" DESC);

-- CreateIndex
CREATE INDEX "metric_observations_workspace_id_connection_id_observed_at_idx" ON "app"."metric_observations"("workspace_id", "connection_id", "observed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "metric_observations_receipt_id_metric_definition_id_observe_key" ON "app"."metric_observations"("receipt_id", "metric_definition_id", "observed_at");

-- CreateIndex
CREATE INDEX "analytics_sync_runs_workspace_id_idx" ON "app"."analytics_sync_runs"("workspace_id");

-- CreateIndex
CREATE INDEX "analytics_sync_runs_workspace_id_connection_id_started_at_idx" ON "app"."analytics_sync_runs"("workspace_id", "connection_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "experiments_workspace_id_idx" ON "app"."experiments"("workspace_id");

-- CreateIndex
CREATE INDEX "experiments_workspace_id_state_window_start_idx" ON "app"."experiments"("workspace_id", "state", "window_start");

-- CreateIndex
CREATE INDEX "insights_workspace_id_idx" ON "app"."insights"("workspace_id");

-- CreateIndex
CREATE INDEX "insights_workspace_id_state_created_at_idx" ON "app"."insights"("workspace_id", "state", "created_at" DESC);

-- CreateIndex
CREATE INDEX "short_links_workspace_id_idx" ON "app"."short_links"("workspace_id");

-- CreateIndex
CREATE INDEX "short_links_workspace_id_state_created_at_idx" ON "app"."short_links"("workspace_id", "state", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_short_links_domain_slug" ON "app"."short_links"("domain", "slug");

-- CreateIndex
CREATE INDEX "short_link_clicks_workspace_id_idx" ON "app"."short_link_clicks"("workspace_id");

-- CreateIndex
CREATE INDEX "short_link_clicks_short_link_id_occurred_at_idx" ON "app"."short_link_clicks"("short_link_id", "occurred_at");

-- CreateIndex
CREATE INDEX "short_link_clicks_dedupe_expires_at_idx" ON "app"."short_link_clicks"("dedupe_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "short_link_clicks_short_link_id_dedupe_key_key" ON "app"."short_link_clicks"("short_link_id", "dedupe_key");

-- CreateIndex
CREATE UNIQUE INDEX "polar_customers_workspace_id_key" ON "private"."polar_customers"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "polar_customers_polar_customer_id_key" ON "private"."polar_customers"("polar_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_polar_subscription_id_key" ON "private"."subscriptions"("polar_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_workspace_id_idx" ON "private"."subscriptions"("workspace_id");

-- CreateIndex
CREATE INDEX "subscriptions_workspace_id_status_idx" ON "private"."subscriptions"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_status_trial_ends_at_idx" ON "private"."subscriptions"("status", "trial_ends_at");

-- CreateIndex
CREATE INDEX "entitlements_workspace_id_idx" ON "private"."entitlements"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "entitlements_workspace_id_key_key" ON "private"."entitlements"("workspace_id", "key");

-- CreateIndex
CREATE INDEX "usage_events_workspace_id_idx" ON "private"."usage_events"("workspace_id");

-- CreateIndex
CREATE INDEX "usage_events_workspace_id_meter_key_occurred_at_idx" ON "private"."usage_events"("workspace_id", "meter_key", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "usage_events_workspace_id_idempotency_key_key" ON "private"."usage_events"("workspace_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "billing_webhook_inbox_state_received_at_idx" ON "private"."billing_webhook_inbox"("state", "received_at");

-- CreateIndex
CREATE UNIQUE INDEX "billing_webhook_inbox_provider_event_id_key" ON "private"."billing_webhook_inbox"("provider", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_partners_referral_code_key" ON "private"."affiliate_partners"("referral_code");

-- CreateIndex
CREATE INDEX "affiliate_partners_workspace_id_idx" ON "private"."affiliate_partners"("workspace_id");

-- CreateIndex
CREATE INDEX "affiliate_partners_state_idx" ON "private"."affiliate_partners"("state");

-- CreateIndex
CREATE INDEX "referral_attributions_workspace_id_idx" ON "private"."referral_attributions"("workspace_id");

-- CreateIndex
CREATE INDEX "referral_attributions_affiliate_partner_id_attributed_at_idx" ON "private"."referral_attributions"("affiliate_partner_id", "attributed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "referral_attributions_workspace_id_affiliate_partner_id_key" ON "private"."referral_attributions"("workspace_id", "affiliate_partner_id");

-- CreateIndex
CREATE INDEX "commission_ledger_workspace_id_idx" ON "private"."commission_ledger"("workspace_id");

-- CreateIndex
CREATE INDEX "commission_ledger_affiliate_partner_id_state_idx" ON "private"."commission_ledger"("affiliate_partner_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "commission_ledger_polar_order_id_affiliate_partner_id_rever_key" ON "private"."commission_ledger"("polar_order_id", "affiliate_partner_id", "reversal_of_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_batches_reference_key" ON "private"."payout_batches"("reference");

-- CreateIndex
CREATE INDEX "payout_batches_state_period_end_idx" ON "private"."payout_batches"("state", "period_end");

-- CreateIndex
CREATE INDEX "deletion_requests_workspace_id_idx" ON "app"."deletion_requests"("workspace_id");

-- CreateIndex
CREATE INDEX "deletion_requests_state_execute_after_idx" ON "app"."deletion_requests"("state", "execute_after");

-- CreateIndex
CREATE INDEX "data_exports_workspace_id_idx" ON "app"."data_exports"("workspace_id");

-- CreateIndex
CREATE INDEX "data_exports_state_expires_at_idx" ON "app"."data_exports"("state", "expires_at");

-- AddForeignKey
ALTER TABLE "app"."user_aliases" ADD CONSTRAINT "user_aliases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."memberships" ADD CONSTRAINT "memberships_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."role_permissions" ADD CONSTRAINT "role_permissions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."service_accounts" ADD CONSTRAINT "service_accounts_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."api_keys" ADD CONSTRAINT "api_keys_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."api_keys" ADD CONSTRAINT "api_keys_service_account_id_fkey" FOREIGN KEY ("service_account_id") REFERENCES "app"."service_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."audit_events" ADD CONSTRAINT "audit_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."user_sessions" ADD CONSTRAINT "user_sessions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."consents" ADD CONSTRAINT "consents_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."brands" ADD CONSTRAINT "brands_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."business_profiles" ADD CONSTRAINT "business_profiles_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."business_profiles" ADD CONSTRAINT "business_profiles_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."brand_sources" ADD CONSTRAINT "brand_sources_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."brand_sources" ADD CONSTRAINT "brand_sources_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."glossary_terms" ADD CONSTRAINT "glossary_terms_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."glossary_terms" ADD CONSTRAINT "glossary_terms_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."campaigns" ADD CONSTRAINT "campaigns_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."campaigns" ADD CONSTRAINT "campaigns_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_items" ADD CONSTRAINT "content_items_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_items" ADD CONSTRAINT "content_items_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_items" ADD CONSTRAINT "content_items_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "app"."campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_items" ADD CONSTRAINT "content_items_posting_set_id_fkey" FOREIGN KEY ("posting_set_id") REFERENCES "app"."posting_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_items" ADD CONSTRAINT "content_items_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "app"."content_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_versions" ADD CONSTRAINT "content_versions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."content_versions" ADD CONSTRAINT "content_versions_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "app"."content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "app"."content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "app"."content_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "app"."provider_destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."post_variants" ADD CONSTRAINT "post_variants_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "app"."signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."posting_sets" ADD CONSTRAINT "posting_sets_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."posting_sets" ADD CONSTRAINT "posting_sets_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."posting_sets" ADD CONSTRAINT "posting_sets_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "app"."signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."signatures" ADD CONSTRAINT "signatures_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."signatures" ADD CONSTRAINT "signatures_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."provider_destinations" ADD CONSTRAINT "provider_destinations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."provider_destinations" ADD CONSTRAINT "provider_destinations_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."mention_entities" ADD CONSTRAINT "mention_entities_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."mention_entities" ADD CONSTRAINT "mention_entities_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."approval_requests" ADD CONSTRAINT "approval_requests_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."approval_requests" ADD CONSTRAINT "approval_requests_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "app"."content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."approval_requests" ADD CONSTRAINT "approval_requests_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "app"."content_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."approval_decisions" ADD CONSTRAINT "approval_decisions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."approval_decisions" ADD CONSTRAINT "approval_decisions_approval_request_id_fkey" FOREIGN KEY ("approval_request_id") REFERENCES "app"."approval_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."comment_thread_items" ADD CONSTRAINT "comment_thread_items_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."comment_thread_items" ADD CONSTRAINT "comment_thread_items_post_variant_id_fkey" FOREIGN KEY ("post_variant_id") REFERENCES "app"."post_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."growth_plans" ADD CONSTRAINT "growth_plans_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."growth_plans" ADD CONSTRAINT "growth_plans_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."growth_plans" ADD CONSTRAINT "growth_plans_business_profile_id_fkey" FOREIGN KEY ("business_profile_id") REFERENCES "app"."business_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."strategy_opportunity_matches" ADD CONSTRAINT "strategy_opportunity_matches_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."strategy_opportunity_matches" ADD CONSTRAINT "strategy_opportunity_matches_growth_plan_id_fkey" FOREIGN KEY ("growth_plan_id") REFERENCES "app"."growth_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."strategy_opportunity_matches" ADD CONSTRAINT "strategy_opportunity_matches_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "app"."growth_opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."social_connections" ADD CONSTRAINT "social_connections_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."social_connections" ADD CONSTRAINT "social_connections_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."social_credentials" ADD CONSTRAINT "social_credentials_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."social_credentials" ADD CONSTRAINT "social_credentials_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."oauth_transactions" ADD CONSTRAINT "oauth_transactions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."oauth_clients" ADD CONSTRAINT "oauth_clients_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."oauth_grants" ADD CONSTRAINT "oauth_grants_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."oauth_grants" ADD CONSTRAINT "oauth_grants_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "private"."oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."outbox" ADD CONSTRAINT "outbox_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."outbox_dead_letter" ADD CONSTRAINT "outbox_dead_letter_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."media_assets" ADD CONSTRAINT "media_assets_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."media_derivatives" ADD CONSTRAINT "media_derivatives_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."media_derivatives" ADD CONSTRAINT "media_derivatives_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "app"."media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "app"."content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "app"."content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_post_variant_id_fkey" FOREIGN KEY ("post_variant_id") REFERENCES "app"."post_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_comment_thread_item_id_fkey" FOREIGN KEY ("comment_thread_item_id") REFERENCES "app"."comment_thread_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_jobs" ADD CONSTRAINT "publish_jobs_approval_request_id_fkey" FOREIGN KEY ("approval_request_id") REFERENCES "app"."approval_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_attempts" ADD CONSTRAINT "publish_attempts_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_attempts" ADD CONSTRAINT "publish_attempts_publish_job_id_fkey" FOREIGN KEY ("publish_job_id") REFERENCES "app"."publish_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_attempts" ADD CONSTRAINT "publish_attempts_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "app"."content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publish_attempts" ADD CONSTRAINT "publish_attempts_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publication_receipts" ADD CONSTRAINT "publication_receipts_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publication_receipts" ADD CONSTRAINT "publication_receipts_publish_job_id_fkey" FOREIGN KEY ("publish_job_id") REFERENCES "app"."publish_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publication_receipts" ADD CONSTRAINT "publication_receipts_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "app"."content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."publication_receipts" ADD CONSTRAINT "publication_receipts_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."provider_limits" ADD CONSTRAINT "provider_limits_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."provider_limits" ADD CONSTRAINT "provider_limits_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."connection_incidents" ADD CONSTRAINT "connection_incidents_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."connection_incidents" ADD CONSTRAINT "connection_incidents_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."automation_rules" ADD CONSTRAINT "automation_rules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."automation_rules" ADD CONSTRAINT "automation_rules_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."automation_rule_runs" ADD CONSTRAINT "automation_rule_runs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."automation_rule_runs" ADD CONSTRAINT "automation_rule_runs_automation_rule_id_fkey" FOREIGN KEY ("automation_rule_id") REFERENCES "app"."automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."rss_feeds" ADD CONSTRAINT "rss_feeds_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."rss_feeds" ADD CONSTRAINT "rss_feeds_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."rss_feed_items" ADD CONSTRAINT "rss_feed_items_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."rss_feed_items" ADD CONSTRAINT "rss_feed_items_rss_feed_id_fkey" FOREIGN KEY ("rss_feed_id") REFERENCES "app"."rss_feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhook_endpoint_id_fkey" FOREIGN KEY ("webhook_endpoint_id") REFERENCES "private"."webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."metric_observations" ADD CONSTRAINT "metric_observations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."metric_observations" ADD CONSTRAINT "metric_observations_metric_definition_id_fkey" FOREIGN KEY ("metric_definition_id") REFERENCES "app"."metric_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."metric_observations" ADD CONSTRAINT "metric_observations_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "app"."publication_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."metric_observations" ADD CONSTRAINT "metric_observations_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."metric_observations" ADD CONSTRAINT "metric_observations_sync_run_id_fkey" FOREIGN KEY ("sync_run_id") REFERENCES "app"."analytics_sync_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."analytics_sync_runs" ADD CONSTRAINT "analytics_sync_runs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."analytics_sync_runs" ADD CONSTRAINT "analytics_sync_runs_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "app"."social_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."experiments" ADD CONSTRAINT "experiments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."experiments" ADD CONSTRAINT "experiments_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "app"."campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."insights" ADD CONSTRAINT "insights_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."insights" ADD CONSTRAINT "insights_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "app"."content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."insights" ADD CONSTRAINT "insights_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "app"."experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."short_links" ADD CONSTRAINT "short_links_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."short_links" ADD CONSTRAINT "short_links_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."short_links" ADD CONSTRAINT "short_links_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "app"."campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."short_link_clicks" ADD CONSTRAINT "short_link_clicks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."short_link_clicks" ADD CONSTRAINT "short_link_clicks_short_link_id_fkey" FOREIGN KEY ("short_link_id") REFERENCES "app"."short_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."polar_customers" ADD CONSTRAINT "polar_customers_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."subscriptions" ADD CONSTRAINT "subscriptions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."subscriptions" ADD CONSTRAINT "subscriptions_polar_customer_id_fkey" FOREIGN KEY ("polar_customer_id") REFERENCES "private"."polar_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."entitlements" ADD CONSTRAINT "entitlements_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."entitlements" ADD CONSTRAINT "entitlements_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "private"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."usage_events" ADD CONSTRAINT "usage_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."affiliate_partners" ADD CONSTRAINT "affiliate_partners_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."referral_attributions" ADD CONSTRAINT "referral_attributions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."referral_attributions" ADD CONSTRAINT "referral_attributions_affiliate_partner_id_fkey" FOREIGN KEY ("affiliate_partner_id") REFERENCES "private"."affiliate_partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."commission_ledger" ADD CONSTRAINT "commission_ledger_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."commission_ledger" ADD CONSTRAINT "commission_ledger_affiliate_partner_id_fkey" FOREIGN KEY ("affiliate_partner_id") REFERENCES "private"."affiliate_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."commission_ledger" ADD CONSTRAINT "commission_ledger_referral_attribution_id_fkey" FOREIGN KEY ("referral_attribution_id") REFERENCES "private"."referral_attributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."commission_ledger" ADD CONSTRAINT "commission_ledger_payout_batch_id_fkey" FOREIGN KEY ("payout_batch_id") REFERENCES "private"."payout_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."deletion_requests" ADD CONSTRAINT "deletion_requests_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."data_exports" ADD CONSTRAINT "data_exports_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "app"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
