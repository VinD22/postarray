-- 0074_seo_keyword_targets.sql
--
-- Re-pullable DataForSEO keyword research, so a search-volume figure quoted in
-- a planning document or an article's targeting comment is a re-pullable row
-- rather than a number typed once and left to rot.
--
-- Not tenant data. No workspace owns a keyword; this is operator research the
-- growth and content workflows read, the same shape as `growth_opportunities`
-- and `tool_catalog_entries` but without a public-facing surface, so it lives
-- in `private` rather than `app` and is service role only, following the
-- `billing_webhook_inbox` pattern in 0020_rls_policies.sql.
--
-- This is a new table added after the reviewed core schema (0004) and after
-- 0072_assert_rls_complete.sql, which is meant to be the last word on
-- completeness and passes no deferrals. RLS is enabled, forced and policied in
-- this same file, and the assertion is repeated at the end, exactly as
-- 0073_relay_app_role.sql does for the same reason.

CREATE TABLE private.seo_keyword_targets (
  id               text        NOT NULL DEFAULT app.new_id('kwtarget'),
  keyword          text        NOT NULL,
  -- BCP-47 interface locale the keyword was pulled for, e.g. 'en', 'pt-BR'.
  -- Not validated against packages/i18n's registry here: research may exist
  -- for a market before the interface ships that locale.
  locale           text        NOT NULL,
  location_name    text        NOT NULL,
  search_volume    integer,
  keyword_difficulty integer,
  cpc_minor_units  integer,
  competition_level text,
  main_intent      text,
  -- Site-relative path this keyword is targeted at, e.g. '/blog/best-time-to-post'.
  -- Nullable: a keyword can be tracked before a page exists to target it.
  target_route     text,
  source           text        NOT NULL DEFAULT 'dataforseo',
  pulled_on        date        NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT seo_keyword_targets_pkey PRIMARY KEY (id),
  CONSTRAINT seo_keyword_targets_keyword_not_blank CHECK (length(btrim(keyword)) > 0),
  CONSTRAINT seo_keyword_targets_locale_not_blank CHECK (length(btrim(locale)) > 0),
  CONSTRAINT seo_keyword_targets_search_volume_nonnegative
    CHECK (search_volume IS NULL OR search_volume >= 0),
  CONSTRAINT seo_keyword_targets_difficulty_bounded
    CHECK (keyword_difficulty IS NULL OR (keyword_difficulty >= 0 AND keyword_difficulty <= 100)),
  CONSTRAINT seo_keyword_targets_cpc_nonnegative
    CHECK (cpc_minor_units IS NULL OR cpc_minor_units >= 0),
  CONSTRAINT seo_keyword_targets_competition_level_supported
    CHECK (competition_level IS NULL OR competition_level IN ('LOW', 'MEDIUM', 'HIGH')),
  CONSTRAINT seo_keyword_targets_main_intent_supported
    CHECK (main_intent IS NULL
      OR main_intent IN ('informational', 'navigational', 'commercial', 'transactional'))
);

-- One row per keyword, per locale, per market pulled. A re-pull overwrites the
-- prior figure for the same triple rather than accumulating stale duplicates.
CREATE UNIQUE INDEX seo_keyword_targets_keyword_locale_location_key
  ON private.seo_keyword_targets (keyword, locale, location_name);

CREATE INDEX seo_keyword_targets_target_route_idx
  ON private.seo_keyword_targets (target_route)
  WHERE target_route IS NOT NULL;

COMMENT ON TABLE private.seo_keyword_targets IS
  'Re-pullable DataForSEO keyword research, so a volume or difficulty figure quoted in planning docs and article targeting can be checked and refreshed rather than trusted from memory.';
COMMENT ON COLUMN private.seo_keyword_targets.cpc_minor_units IS
  'USD minor units (cents), matching the money convention elsewhere in this schema. NULL when DataForSEO reported no CPC.';
COMMENT ON COLUMN private.seo_keyword_targets.pulled_on IS
  'The date the figures were retrieved, not when the row was inserted. Re-pulling the same keyword updates this even if created_at stays put.';

-- ---------------------------------------------------------------------------
-- Row level security. Not tenant scoped: apply_tenant_policies expects a
-- workspace column, so the policies are written directly, matching
-- private.billing_webhook_inbox exactly.
-- ---------------------------------------------------------------------------

ALTER TABLE private.seo_keyword_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.seo_keyword_targets FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seo_keyword_targets_select ON private.seo_keyword_targets;
CREATE POLICY seo_keyword_targets_select ON private.seo_keyword_targets
  FOR SELECT TO public USING (app.is_service_role());
DROP POLICY IF EXISTS seo_keyword_targets_insert ON private.seo_keyword_targets;
CREATE POLICY seo_keyword_targets_insert ON private.seo_keyword_targets
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS seo_keyword_targets_update ON private.seo_keyword_targets;
CREATE POLICY seo_keyword_targets_update ON private.seo_keyword_targets
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS seo_keyword_targets_delete ON private.seo_keyword_targets;
CREATE POLICY seo_keyword_targets_delete ON private.seo_keyword_targets
  FOR DELETE TO public USING (app.is_service_role());
COMMENT ON POLICY seo_keyword_targets_select ON private.seo_keyword_targets IS
  'Operator research, not a tenant record and not exposed to any signed-in user.';

REVOKE ALL ON private.seo_keyword_targets FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON private.seo_keyword_targets TO service_role;

-- 0072_assert_rls_complete.sql runs before this file and is meant to be the
-- last word on completeness. This migration adds a table, so the assertion is
-- repeated here rather than assumed, matching 0073_relay_app_role.sql.
SELECT private.assert_rls_complete();
