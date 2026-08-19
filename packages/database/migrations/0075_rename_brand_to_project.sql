-- 0075_rename_brand_to_project.sql
--
-- The workspace-owned publishing context has always been called "Project" in
-- CONTEXT.md, in the product UI, and in most of the copy that already lives in
-- this schema (see the trigger and entitlement key `enforce_active_project_limit`
-- adds in 0066, and the comments 0070 already writes in terms of "project").
-- The table, its foreign keys and several column names were the one place the
-- old internal codename, "Brand", never got updated. This migration finishes
-- the rename at the database layer to match `packages/database/prisma/schema.prisma`,
-- which now declares `model Project` mapped to `app.projects`.
--
-- Renaming a table or a column carries its indexes, constraints, RLS policies,
-- grants and view definitions along automatically: Postgres tracks all of
-- those by OID, not by the text of the name. What does *not* follow along on
-- its own is the literal *name* of an index, a constraint, a trigger, or a
-- policy that spells the old word out, and the body of a `SECURITY DEFINER`
-- function that names the table directly in a query rather than through its
-- trigger binding. Each of those is renamed or rewritten explicitly below.
--
-- Nothing here changes what a row means or how many of them exist. No data is
-- rewritten, and every existing `brand_...`-prefixed public id keeps working:
-- `packages/contracts/src/ids.ts` parses an id by its prefix and a prefix is
-- opaque once minted, so a `brand_` id minted before this migration and a
-- `project_` id minted after it are equally valid `Project` identifiers.

-- ---------------------------------------------------------------------------
-- 1. The enum backing `app.project_sources.kind`.
-- ---------------------------------------------------------------------------

ALTER TYPE app.brand_source_kind RENAME TO project_source_kind;

-- ---------------------------------------------------------------------------
-- 2. The two tables themselves, and the identifiers that belong to the table
--    rather than to any one column: the primary key, the workspace foreign
--    key, and the indexes that exist independently of `brand_id`.
-- ---------------------------------------------------------------------------

ALTER TABLE app.brands RENAME TO projects;
ALTER TABLE app.projects RENAME CONSTRAINT brands_pkey TO projects_pkey;
ALTER TABLE app.projects RENAME CONSTRAINT brands_workspace_id_fkey TO projects_workspace_id_fkey;
-- A row minted before this migration keeps its `brand_...` id forever; ids
-- are immutable once generated. Only the default for a row inserted after
-- this migration changes, so new projects mint a `project_...` id, matching
-- `dbgenerated("app.new_id('project')")` in schema.prisma.
ALTER TABLE app.projects ALTER COLUMN id SET DEFAULT app.new_id('project');
ALTER INDEX app.brands_workspace_id_idx RENAME TO projects_workspace_id_idx;
ALTER INDEX app.brands_workspace_id_slug_key RENAME TO projects_workspace_id_slug_key;
-- Added in 0063 to carry the composite foreign key from `oauth_transactions`
-- and `oauth_pending_discoveries`; both are repointed at the renamed index
-- below without needing to be dropped and recreated.
ALTER INDEX app.uq_brands_workspace_id_id RENAME TO uq_projects_workspace_id_id;

ALTER TABLE app.brand_sources RENAME TO project_sources;
ALTER TABLE app.project_sources RENAME CONSTRAINT brand_sources_pkey TO project_sources_pkey;
ALTER TABLE app.project_sources RENAME CONSTRAINT brand_sources_workspace_id_fkey TO project_sources_workspace_id_fkey;
ALTER INDEX app.brand_sources_workspace_id_idx RENAME TO project_sources_workspace_id_idx;

COMMENT ON COLUMN app.projects.remember_targets_enabled IS
  'Project opt in, default false. While false the application stores nothing at all; there is no row to leak.';

-- ---------------------------------------------------------------------------
-- 3. `brand_id`, on every table that carries it, plus the foreign key and any
--    index whose name spells the column out. A table with no such index (its
--    `brand_id` only ever appeared inside a `workspace_id`-led composite) is
--    listed with just the column and its foreign key.
-- ---------------------------------------------------------------------------

-- app.project_sources: the self-referencing pointer at its parent project,
-- not to be confused with the table rename above.
ALTER TABLE app.project_sources RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.project_sources RENAME CONSTRAINT brand_sources_brand_id_fkey TO project_sources_project_id_fkey;
ALTER INDEX app.brand_sources_workspace_id_brand_id_idx RENAME TO project_sources_workspace_id_project_id_idx;

ALTER TABLE app.business_profiles RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.business_profiles RENAME CONSTRAINT business_profiles_brand_id_fkey TO business_profiles_project_id_fkey;
ALTER INDEX app.business_profiles_workspace_id_brand_id_confirmed_at_idx RENAME TO business_profiles_workspace_id_project_id_confirmed_at_idx;
ALTER INDEX app.business_profiles_brand_id_version_key RENAME TO business_profiles_project_id_version_key;

ALTER TABLE app.glossary_terms RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.glossary_terms RENAME CONSTRAINT glossary_terms_brand_id_fkey TO glossary_terms_project_id_fkey;
ALTER INDEX app.glossary_terms_brand_id_locale_term_key RENAME TO glossary_terms_project_id_locale_term_key;

ALTER TABLE app.campaigns RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.campaigns RENAME CONSTRAINT campaigns_brand_id_fkey TO campaigns_project_id_fkey;
ALTER INDEX app.campaigns_workspace_id_brand_id_idx RENAME TO campaigns_workspace_id_project_id_idx;

ALTER TABLE app.content_items RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.content_items RENAME CONSTRAINT content_items_brand_id_fkey TO content_items_project_id_fkey;
ALTER INDEX app.content_items_workspace_id_brand_id_state_idx RENAME TO content_items_workspace_id_project_id_state_idx;

ALTER TABLE app.posting_sets RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.posting_sets RENAME CONSTRAINT posting_sets_brand_id_fkey TO posting_sets_project_id_fkey;
-- 0004's original unique index. 0070 layered a partial unique index
-- (`posting_sets_live_name_key`) on top for archived-name reuse rather than
-- replacing this one, so it is renamed rather than assumed gone.
ALTER INDEX IF EXISTS app.posting_sets_workspace_id_brand_id_name_key RENAME TO posting_sets_workspace_id_project_id_name_key;

ALTER TABLE app.signatures RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.signatures RENAME CONSTRAINT signatures_brand_id_fkey TO signatures_project_id_fkey;
ALTER INDEX app.signatures_workspace_id_brand_id_name_locale_key RENAME TO signatures_workspace_id_project_id_name_locale_key;

ALTER TABLE app.growth_plans RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.growth_plans RENAME CONSTRAINT growth_plans_brand_id_fkey TO growth_plans_project_id_fkey;
ALTER INDEX app.growth_plans_brand_id_version_key RENAME TO growth_plans_project_id_version_key;

ALTER TABLE app.social_connections RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.social_connections RENAME CONSTRAINT social_connections_brand_id_fkey TO social_connections_project_id_fkey;
ALTER INDEX app.social_connections_workspace_id_brand_id_provider_idx RENAME TO social_connections_workspace_id_project_id_provider_idx;

ALTER TABLE app.queue_rules RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.queue_rules RENAME CONSTRAINT queue_rules_brand_id_fkey TO queue_rules_project_id_fkey;
ALTER INDEX app.queue_rules_workspace_id_brand_id_enabled_priority_idx RENAME TO queue_rules_workspace_id_project_id_enabled_priority_idx;
ALTER INDEX app.queue_rules_workspace_id_brand_id_name_key RENAME TO queue_rules_workspace_id_project_id_name_key;

ALTER TABLE app.queue_slot_reservations RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.queue_slot_reservations RENAME CONSTRAINT queue_slot_reservations_brand_id_fkey TO queue_slot_reservations_project_id_fkey;
ALTER INDEX app.queue_slot_reservations_workspace_id_brand_id_scheduled_for_idx RENAME TO queue_slot_reservations_workspace_id_project_id_scheduled_for_idx;

ALTER TABLE app.automation_rules RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.automation_rules RENAME CONSTRAINT automation_rules_brand_id_fkey TO automation_rules_project_id_fkey;
ALTER INDEX app.automation_rules_workspace_id_brand_id_name_key RENAME TO automation_rules_workspace_id_project_id_name_key;

ALTER TABLE app.rss_feeds RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.rss_feeds RENAME CONSTRAINT rss_feeds_brand_id_fkey TO rss_feeds_project_id_fkey;

ALTER TABLE app.short_links RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.short_links RENAME CONSTRAINT short_links_brand_id_fkey TO short_links_project_id_fkey;

ALTER TABLE app.bulk_import_jobs RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.bulk_import_jobs RENAME CONSTRAINT bulk_import_jobs_brand_id_fkey TO bulk_import_jobs_project_id_fkey;
ALTER INDEX app.bulk_import_jobs_workspace_brand_state_idx RENAME TO bulk_import_jobs_workspace_project_state_idx;

-- Self-row table (0070). No brand-named index: `remembered_targets_member_key`
-- already carries no entity name, only the columns it covers.
ALTER TABLE app.remembered_targets RENAME COLUMN brand_id TO project_id;
ALTER TABLE app.remembered_targets RENAME CONSTRAINT remembered_targets_brand_id_fkey TO remembered_targets_project_id_fkey;

-- app.media_assets: the one table where `brand_id` was never wired to a
-- foreign key or a named index in the first place (see 0004). Renamed for the
-- same consistency, nothing else to carry along.
ALTER TABLE app.media_assets RENAME COLUMN brand_id TO project_id;

-- private schema: both composite foreign keys point at the renamed
-- `uq_projects_workspace_id_id` index from step 2; Postgres already updated
-- their target when that index and the `projects` table were renamed, so only
-- the local column and the constraint's own name need to change here.
ALTER TABLE private.oauth_transactions RENAME COLUMN brand_id TO project_id;
ALTER TABLE private.oauth_transactions RENAME CONSTRAINT oauth_transactions_workspace_brand_fkey TO oauth_transactions_workspace_project_fkey;
COMMENT ON COLUMN private.oauth_transactions.project_id IS
  'Optional project selected before OAuth. The composite foreign key binds it to the transaction workspace.';

ALTER TABLE private.oauth_pending_discoveries RENAME COLUMN brand_id TO project_id;
ALTER TABLE private.oauth_pending_discoveries RENAME CONSTRAINT oauth_pending_discoveries_brand_fkey TO oauth_pending_discoveries_project_fkey;

-- ---------------------------------------------------------------------------
-- 4. `brand_scope`: the "which projects this actor is limited to" array,
--    empty meaning unrestricted. Four tables, none with a name-bearing index.
-- ---------------------------------------------------------------------------

ALTER TABLE app.memberships RENAME COLUMN brand_scope TO project_scope;
ALTER TABLE app.service_accounts RENAME COLUMN brand_scope TO project_scope;
ALTER TABLE private.oauth_grants RENAME COLUMN brand_scope TO project_scope;
ALTER TABLE private.webhook_endpoints RENAME COLUMN brand_scope TO project_scope;

-- ---------------------------------------------------------------------------
-- 5. Trigger and function bodies that name a renamed table or column directly
--    in a query, rather than reaching it through the trigger binding. A
--    rename does not follow these the way it follows a constraint or an
--    index, because from Postgres's point of view they are just text inside a
--    function body until it runs.
-- ---------------------------------------------------------------------------

-- 0066: the race-safe active-project-count guard. Its own name, its error
-- messages and the entitlement key it reads (`projects.active.max`) already
-- said "project"; only its two queries against `app.brands` were stale.
CREATE OR REPLACE FUNCTION app.enforce_active_project_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, app, private
AS $$
DECLARE
  occupied integer;
  allowed integer;
BEGIN
  IF NEW.archived_at IS NOT NULL THEN
    IF TG_OP = 'UPDATE' AND OLD.archived_at IS NULL THEN
      PERFORM pg_advisory_xact_lock(hashtextextended(NEW.workspace_id || ':projects', 0));
      SELECT count(*)
      INTO occupied
      FROM app.projects
      WHERE workspace_id = NEW.workspace_id
        AND archived_at IS NULL
        AND id <> NEW.id;
      IF occupied = 0 THEN
        RAISE EXCEPTION USING
          ERRCODE = 'check_violation',
          MESSAGE = 'last active project cannot be archived',
          DETAIL = 'A workspace must retain at least one active project.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
    AND OLD.archived_at IS NULL
    AND OLD.workspace_id = NEW.workspace_id THEN
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.workspace_id || ':projects', 0));

  SELECT LEAST(20, GREATEST(1, COALESCE(MAX(numeric_value), 3)))
  INTO allowed
  FROM private.entitlements
  WHERE workspace_id = NEW.workspace_id
    AND key = 'projects.active.max'
    AND effective_from <= now()
    AND (effective_until IS NULL OR effective_until > now());

  SELECT count(*)
  INTO occupied
  FROM app.projects
  WHERE workspace_id = NEW.workspace_id
    AND archived_at IS NULL
    AND id <> NEW.id;

  IF occupied >= allowed THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'active project limit reached',
      DETAIL = format('This workspace may hold at most %s active projects.', allowed),
      HINT = 'Archive a project or increase the projects.active.max entitlement.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS brands_active_project_limit ON app.projects;
DROP TRIGGER IF EXISTS projects_active_project_limit ON app.projects;

CREATE TRIGGER projects_active_project_limit
BEFORE INSERT OR UPDATE OF archived_at, workspace_id
ON app.projects
FOR EACH ROW
EXECUTE FUNCTION app.enforce_active_project_limit();

-- 0068: the immutability guard for a reserved queue slot. Only its check of
-- `brand_id` needed to move to `project_id`; the trigger name and binding are
-- unaffected by the column rename.
CREATE OR REPLACE FUNCTION app.freeze_queue_slot_evidence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, app
AS $$
BEGIN
  IF NEW.rule_snapshot IS DISTINCT FROM OLD.rule_snapshot
    OR NEW.scheduled_for IS DISTINCT FROM OLD.scheduled_for
    OR NEW.scheduled_time_zone IS DISTINCT FROM OLD.scheduled_time_zone
    OR NEW.local_date_time IS DISTINCT FROM OLD.local_date_time
    OR NEW.project_id IS DISTINCT FROM OLD.project_id
    OR NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'queue slot evidence is immutable',
      DETAIL = 'The instant, its zone and the frozen rule snapshot cannot be rewritten.',
      HINT = 'Release this reservation and propose a new slot instead.';
  END IF;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Row level security on the two renamed tables.
--
-- `private.apply_tenant_policies` (0020) names each policy from the table it
-- is given, so the four policies created for 'brands' and 'brand_sources' are
-- still literally named `brands_select`, `brand_sources_insert`, and so on,
-- now sitting on `app.projects` and `app.project_sources`. Their bodies never
-- mentioned `brand_id`, only `workspace_id`, so they still decide the right
-- thing; only their names are stale. They are dropped by their old names and
-- reapplied by the same function so the table, its policy names, and its
-- grants go back to matching the convention every other table follows.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS brands_select ON app.projects;
DROP POLICY IF EXISTS brands_insert ON app.projects;
DROP POLICY IF EXISTS brands_update ON app.projects;
DROP POLICY IF EXISTS brands_delete ON app.projects;

DROP POLICY IF EXISTS brand_sources_select ON app.project_sources;
DROP POLICY IF EXISTS brand_sources_insert ON app.project_sources;
DROP POLICY IF EXISTS brand_sources_update ON app.project_sources;
DROP POLICY IF EXISTS brand_sources_delete ON app.project_sources;

SELECT private.apply_tenant_policies(
  'app', 'projects', 'workspace_id',
  'member', 'writer', 'writer', 'admin',
  'Project configuration is editorial; deleting a project is administrative.'
);

SELECT private.apply_tenant_policies(
  'app', 'project_sources', 'workspace_id',
  'member', 'writer', 'writer', 'writer',
  'Uploaded and linked source material for a project.'
);

-- `relay_app` (0073) and every other role's grants were made per table OID,
-- not per name, so they already carry over; nothing to regrant here.

-- 0072_assert_rls_complete.sql is meant to be the last word on completeness
-- and passes no deferrals. This migration renames tables and columns but
-- creates none, so row security coverage cannot have changed; the assertion
-- is still repeated here, exactly as 0073 and 0074 do, because a rename that
-- silently dropped a policy this file depends on is exactly the kind of
-- mistake it exists to catch.
SELECT private.assert_rls_complete();
