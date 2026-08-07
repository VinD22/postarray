-- 0020_rls_policies.sql
--
-- Tenant isolation in PostgreSQL. This is the third enforcement point, after
-- authentication at the edge and authorization in the application service, and
-- it is the only one that still holds when the other two have a bug.
--
-- Shape of the model
-- ------------------
-- * Every table below gets ENABLE ROW LEVEL SECURITY *and* FORCE. FORCE matters:
--   without it the table owner, which is exactly the role our migrations and our
--   pooled application connections use, would silently skip every policy.
--
-- * Policies are written `TO public` and gated on claims, not on database roles.
--   A connection with no `request.jwt.claims` sees nothing at all, whoever it
--   logged in as. That is the deny-by-default we want, and it is what makes
--   src/rls.test.ts meaningful rather than theatre.
--
-- * `app.is_service_role()` widens breadth for trusted server traffic. It never
--   bypasses tenancy: the service role has no BYPASSRLS attribute, so an
--   operator query still has to satisfy a policy that exists and is readable.
--
-- * Absence of a policy is a denial. Where a table has no UPDATE policy that is
--   deliberate and is stated in the per-table comment.
--
-- Grants
-- ------
-- `authenticated` receives SELECT on `app` tables only. Writes go through the
-- application service, which authorizes first and then connects as the service
-- role. `anon` receives nothing anywhere. `private` is service role only.
--
-- Adding a table
-- --------------
-- Add a row to the `policy_targets` list below. A table that is not listed gets
-- no policy, and because 0002 revoked default privileges it also gets no grant,
-- so the failure mode of forgetting is "nobody can read it", not a leak.
-- docs/security/rls-model.md walks through the checklist.

-- ---------------------------------------------------------------------------
-- Policy generator.
--
-- One statement per operation per table, with a stable name and a COMMENT that
-- states the rule. Reviewing `\dp app.*` after this migration shows the same
-- four policies per table that a hand-written file would, without 230 copies of
-- the same four lines drifting apart from each other.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.rls_expr(profile text, ws_column text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT CASE profile
    -- Any active member of the owning workspace.
    WHEN 'member'   THEN format('app.is_service_role() OR app.is_workspace_member(%I)', ws_column)
    -- owner, admin, manager, editor.
    WHEN 'writer'   THEN format('app.is_service_role() OR app.can_write(%I)', ws_column)
    -- owner, admin.
    WHEN 'admin'    THEN format('app.is_service_role() OR app.can_administer(%I)', ws_column)
    -- owner, admin, manager, approver.
    WHEN 'approver' THEN format('app.is_service_role() OR app.can_approve(%I)', ws_column)
    -- Trusted server-side traffic only.
    WHEN 'service'  THEN 'app.is_service_role()'
  END;
$$;

CREATE OR REPLACE FUNCTION private.apply_tenant_policies(
  target_schema text,
  target_table  text,
  ws_column     text,
  sel_profile   text,
  ins_profile   text,
  upd_profile   text,
  del_profile   text,
  rationale     text
)
RETURNS void
LANGUAGE plpgsql
SET search_path = private, pg_catalog, pg_temp
AS $$
DECLARE
  qualified text := format('%I.%I', target_schema, target_table);
  expr      text;
BEGIN
  EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', qualified);
  EXECUTE format('ALTER TABLE %s FORCE ROW LEVEL SECURITY', qualified);

  -- Start from a clean slate so re-running the migration is safe.
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', target_table || '_select', qualified);
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', target_table || '_insert', qualified);
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', target_table || '_update', qualified);
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', target_table || '_delete', qualified);

  IF sel_profile <> 'none' THEN
    expr := private.rls_expr(sel_profile, ws_column);
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR SELECT TO public USING (%s)',
      target_table || '_select', qualified, expr
    );
    EXECUTE format(
      'COMMENT ON POLICY %I ON %s IS %L',
      target_table || '_select', qualified,
      format('SELECT allowed for profile "%s". %s', sel_profile, rationale)
    );
  END IF;

  IF ins_profile <> 'none' THEN
    expr := private.rls_expr(ins_profile, ws_column);
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR INSERT TO public WITH CHECK (%s)',
      target_table || '_insert', qualified, expr
    );
    EXECUTE format(
      'COMMENT ON POLICY %I ON %s IS %L',
      target_table || '_insert', qualified,
      format('INSERT allowed for profile "%s". A row may only be created inside a workspace the actor already belongs to.', ins_profile)
    );
  END IF;

  IF upd_profile <> 'none' THEN
    expr := private.rls_expr(upd_profile, ws_column);
    -- USING and WITH CHECK carry the same expression, so a row cannot be moved
    -- into another workspace by an actor who could legitimately edit it here.
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR UPDATE TO public USING (%s) WITH CHECK (%s)',
      target_table || '_update', qualified, expr, expr
    );
    EXECUTE format(
      'COMMENT ON POLICY %I ON %s IS %L',
      target_table || '_update', qualified,
      format('UPDATE allowed for profile "%s". USING and WITH CHECK match, so workspace_id cannot be rewritten to escape the tenant.', upd_profile)
    );
  END IF;

  IF del_profile <> 'none' THEN
    expr := private.rls_expr(del_profile, ws_column);
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR DELETE TO public USING (%s)',
      target_table || '_delete', qualified, expr
    );
    EXECUTE format(
      'COMMENT ON POLICY %I ON %s IS %L',
      target_table || '_delete', qualified,
      format('DELETE allowed for profile "%s".', del_profile)
    );
  END IF;

  -- Grants. `app` is readable by a signed-in browser session; `private` is not
  -- reachable by any client role, which is why it holds the credentials.
  IF target_schema = 'app' AND sel_profile <> 'none' THEN
    EXECUTE format('GRANT SELECT ON %s TO authenticated', qualified);
  END IF;
  IF target_schema = 'app' THEN
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %s TO service_role', qualified);
  ELSE
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %s TO service_role', qualified);
    EXECUTE format('REVOKE ALL ON %s FROM anon, authenticated', qualified);
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Every tenant table, with the profile chosen per operation.
--
--   sel / ins / upd / del  = member | writer | admin | approver | service | none
--
-- "service" means the change has to travel through the application service,
-- which is where idempotency, capability revalidation, approval policy and the
-- audit append live. A browser session holding a Data API token cannot schedule
-- a post or write a receipt, and that is the point.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT * FROM (VALUES
      -- schema,   table,                           ws column,      sel,      ins,        upd,        del,        rationale
      ('app',     'memberships',                    'workspace_id', 'member', 'admin',    'admin',    'admin',    'A member may see who else is in the workspace; only owner or admin may change membership.'),
      ('app',     'role_permissions',               'workspace_id', 'member', 'admin',    'admin',    'admin',    'Permission grants are visible to the team and editable by administrators only.'),
      ('app',     'service_accounts',               'workspace_id', 'member', 'admin',    'admin',    'admin',    'Automation identities are administrative objects.'),
      ('app',     'brands',                         'workspace_id', 'member', 'writer',   'writer',   'admin',    'Brand configuration is editorial; deleting a brand is administrative.'),
      ('app',     'business_profiles',              'workspace_id', 'member', 'writer',   'writer',   'admin',    'Growth intake is editorial. Confirmed facts are versioned rather than overwritten.'),
      ('app',     'brand_sources',                  'workspace_id', 'member', 'writer',   'writer',   'writer',   'Uploaded and linked source material for a brand.'),
      ('app',     'glossary_terms',                 'workspace_id', 'member', 'writer',   'writer',   'writer',   'Locale glossary used by transcreation.'),
      ('app',     'campaigns',                      'workspace_id', 'member', 'writer',   'writer',   'writer',   'Campaign grouping and UTM defaults.'),
      ('app',     'content_items',                  'workspace_id', 'member', 'writer',   'writer',   'writer',   'The canonical draft. Analysts and viewers read the calendar but never edit it.'),
      ('app',     'content_versions',               'workspace_id', 'member', 'writer',   'none',     'none',     'Immutable. INSERT only: there is deliberately no UPDATE or DELETE policy, and 0030 adds a trigger so a future policy mistake still cannot rewrite an approved version.'),
      ('app',     'post_variants',                  'workspace_id', 'member', 'writer',   'writer',   'writer',   'Per-target copy, media and settings.'),
      ('app',     'posting_sets',                   'workspace_id', 'member', 'writer',   'writer',   'writer',   'Reusable target groups.'),
      ('app',     'signatures',                     'workspace_id', 'member', 'writer',   'writer',   'writer',   'Reusable closing text, hashtags and disclosures.'),
      ('app',     'provider_destinations',          'workspace_id', 'member', 'service',  'service',  'service',  'Written only by connector discovery. A user picks a destination; a user never invents one.'),
      ('app',     'mention_entities',               'workspace_id', 'member', 'service',  'service',  'service',  'Written only by provider resolution, so a display string can never be stored as a native tag.'),
      ('app',     'approval_requests',              'workspace_id', 'member', 'writer',   'approver', 'admin',    'An editor asks for approval; only an approver may resolve the request.'),
      ('app',     'approval_decisions',             'workspace_id', 'member', 'approver', 'none',     'none',     'A decision is a fact. It is appended by an approver and never edited or removed.'),
      ('app',     'comment_thread_items',           'workspace_id', 'member', 'writer',   'writer',   'writer',   'First comments and thread segments.'),
      ('app',     'growth_plans',                   'workspace_id', 'member', 'writer',   'writer',   'admin',    'A plan revision is a new version; an approved plan is never silently rewritten.'),
      ('app',     'strategy_opportunity_matches',   'workspace_id', 'member', 'writer',   'writer',   'writer',   'Suggestions the user accepts or dismisses.'),
      ('app',     'social_connections',             'workspace_id', 'member', 'admin',    'admin',    'admin',    'Connecting or disconnecting an external identity is an administrative act.'),
      ('app',     'media_assets',                   'workspace_id', 'member', 'writer',   'writer',   'writer',   'Uploaded and imported media.'),
      ('app',     'media_derivatives',              'workspace_id', 'member', 'service',  'service',  'service',  'Generated by the media worker from a source asset.'),
      ('app',     'publish_jobs',                   'workspace_id', 'member', 'service',  'service',  'service',  'Scheduling must pass through the application service so idempotency, approval policy and entitlement checks cannot be skipped.'),
      ('app',     'publish_attempts',               'workspace_id', 'member', 'service',  'service',  'none',     'Attempt history is evidence. Workers append it; nobody deletes it.'),
      ('app',     'publication_receipts',           'workspace_id', 'member', 'service',  'service',  'none',     'Immutable evidence that an external post exists. 0030 restricts even the service UPDATE to analytics bookkeeping columns.'),
      ('app',     'provider_limits',                'workspace_id', 'member', 'service',  'service',  'service',  'Observed provider quota, written by connectors.'),
      ('app',     'connection_incidents',           'workspace_id', 'member', 'service',  'service',  'service',  'Action-centre items raised by the system and resolved through it.'),
      ('app',     'automation_rules',               'workspace_id', 'member', 'writer',   'writer',   'admin',    'Rules are authored by editors; the policy engine re-checks every action at save and at run.'),
      ('app',     'automation_rule_runs',           'workspace_id', 'member', 'service',  'service',  'none',     'Run history is evidence.'),
      ('app',     'rss_feeds',                      'workspace_id', 'member', 'writer',   'writer',   'writer',   'Feed configuration.'),
      ('app',     'rss_feed_items',                 'workspace_id', 'member', 'service',  'service',  'service',  'Written by the poller. Fingerprints here are what stop a republish.'),
      ('app',     'metric_observations',            'workspace_id', 'member', 'service',  'service',  'service',  'Provider values, written only by analytics sync.'),
      ('app',     'analytics_sync_runs',            'workspace_id', 'member', 'service',  'service',  'service',  'Coverage and cursor bookkeeping.'),
      ('app',     'experiments',                    'workspace_id', 'member', 'writer',   'writer',   'writer',   'Tagged before publishing so analysis is not entirely post hoc.'),
      ('app',     'insights',                       'workspace_id', 'member', 'writer',   'writer',   'writer',   'Observations a user accepts or dismisses.'),
      ('app',     'short_links',                    'workspace_id', 'member', 'writer',   'writer',   'admin',    'Changing a destination is an audited action, so deletion is administrative.'),
      ('app',     'short_link_clicks',              'workspace_id', 'member', 'service',  'none',     'service',  'Written by the redirect service. No UPDATE policy: a click is not editable. DELETE exists for retention pruning.'),
      ('app',     'deletion_requests',              'workspace_id', 'member', 'admin',    'admin',    'none',     'A deletion request is a durable record of intent and is never removed.'),
      ('app',     'data_exports',                   'workspace_id', 'member', 'admin',    'admin',    'admin',    'Export jobs and their expiring artefacts.'),

      -- private: no client role holds any privilege here, and the policies say
      -- the same thing again in case a grant is ever added by mistake.
      ('private', 'api_keys',                       'workspace_id', 'service', 'service', 'service',  'service',  'Hashed secrets. Server side only.'),
      ('private', 'audit_events',                   'workspace_id', 'service', 'service', 'none',     'none',     'Append only. No UPDATE and no DELETE policy exists, and 0040 adds a trigger so the owner cannot do it either.'),
      ('private', 'user_sessions',                  'workspace_id', 'service', 'service', 'service',  'service',  'Session metadata for device review and revocation.'),
      ('private', 'social_credentials',             'workspace_id', 'service', 'service', 'service',  'service',  'Encrypted provider tokens. The single most sensitive table in the system.'),
      ('private', 'oauth_transactions',             'workspace_id', 'service', 'service', 'service',  'service',  'Short lived state and PKCE material.'),
      ('private', 'oauth_pending_discoveries',      'workspace_id', 'service', 'service', 'service',  'service',  'Encrypted OAuth grant awaiting explicit account selection. No plaintext tokens.'),
      ('private', 'oauth_clients',                  'workspace_id', 'service', 'service', 'service',  'service',  'Third-party developer applications.'),
      ('private', 'oauth_grants',                   'workspace_id', 'service', 'service', 'service',  'service',  'User consent records for developer applications.'),
      ('private', 'agent_confirmations',            'workspace_id', 'service', 'service', 'service',  'service',  'Single-use MCP publication confirmations. The application verifies the exact OAuth grant, content fingerprint, approver and idempotency key.'),
      ('private', 'webhook_endpoints',              'workspace_id', 'service', 'service', 'service',  'service',  'Holds a signing secret.'),
      ('private', 'webhook_deliveries',             'workspace_id', 'service', 'service', 'service',  'service',  'Delivery log and dead-letter queue.'),
      ('private', 'polar_customers',                'workspace_id', 'service', 'service', 'service',  'service',  'Billing identity.'),
      ('private', 'subscriptions',                  'workspace_id', 'service', 'service', 'service',  'service',  'Entitlement is driven from verified Polar state, never from a browser.'),
      ('private', 'entitlements',                   'workspace_id', 'service', 'service', 'service',  'service',  'Mirrored plan limits.'),
      ('private', 'usage_events',                   'workspace_id', 'service', 'service', 'service',  'service',  'Metered provider and AI usage.'),
      ('private', 'affiliate_partners',             'workspace_id', 'service', 'service', 'service',  'service',  'Referral programme participants.'),
      ('private', 'referral_attributions',          'workspace_id', 'service', 'service', 'service',  'service',  'Attribution with fraud review state.'),
      ('private', 'commission_ledger',              'workspace_id', 'service', 'service', 'none',     'none',     'Ledger. A correction is a new offsetting row, never an edit.')
    ) AS v(target_schema, target_table, ws_column, sel, ins, upd, del, rationale)
  LOOP
    PERFORM private.apply_tenant_policies(
      t.target_schema, t.target_table, t.ws_column,
      t.sel, t.ins, t.upd, t.del, t.rationale
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Tables that do not follow the workspace_id pattern. Written out in full.
-- ---------------------------------------------------------------------------

-- app.users ------------------------------------------------------------------
ALTER TABLE app.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.users FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select ON app.users;
CREATE POLICY users_select ON app.users
  FOR SELECT TO public
  USING (
    app.is_service_role()
    OR id = app.current_user_id()
    -- A teammate is visible because the product attributes every action to a
    -- person. Visibility is limited to people who share an active workspace.
    OR EXISTS (
      SELECT 1
      FROM app.memberships m
      WHERE m.user_id = app.users.id
        AND m.state = 'active'::app.membership_state
        AND m.workspace_id = ANY (app.current_workspace_ids())
    )
  );
COMMENT ON POLICY users_select ON app.users IS
  'A person sees themselves and the teammates they actually share a workspace with. Never the whole user table.';

DROP POLICY IF EXISTS users_insert ON app.users;
CREATE POLICY users_insert ON app.users
  FOR INSERT TO public
  WITH CHECK (app.is_service_role());
COMMENT ON POLICY users_insert ON app.users IS
  'Provisioning happens server side after Supabase Auth confirms the identity.';

DROP POLICY IF EXISTS users_update ON app.users;
CREATE POLICY users_update ON app.users
  FOR UPDATE TO public
  USING (app.is_service_role() OR id = app.current_user_id())
  WITH CHECK (app.is_service_role() OR id = app.current_user_id());
COMMENT ON POLICY users_update ON app.users IS
  'A person may edit only their own profile row.';

DROP POLICY IF EXISTS users_delete ON app.users;
CREATE POLICY users_delete ON app.users
  FOR DELETE TO public
  USING (app.is_service_role());
COMMENT ON POLICY users_delete ON app.users IS
  'Deletion runs through the lifecycle workflow, which also revokes providers and cancels workflows.';

GRANT SELECT ON app.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.users TO service_role;

-- app.user_aliases -----------------------------------------------------------
ALTER TABLE app.user_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_aliases FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_aliases_select ON app.user_aliases;
CREATE POLICY user_aliases_select ON app.user_aliases
  FOR SELECT TO public
  USING (app.is_service_role() OR user_id = app.current_user_id());
COMMENT ON POLICY user_aliases_select ON app.user_aliases IS
  'Only the owner sees their aliases. Alias lookup during sign-in is a server-only endpoint that answers identically for existing and non-existing handles, so account discovery is not possible.';

DROP POLICY IF EXISTS user_aliases_insert ON app.user_aliases;
CREATE POLICY user_aliases_insert ON app.user_aliases
  FOR INSERT TO public WITH CHECK (app.is_service_role());
COMMENT ON POLICY user_aliases_insert ON app.user_aliases IS
  'Claiming a handle is rate limited and reserved-name checked server side.';

DROP POLICY IF EXISTS user_aliases_update ON app.user_aliases;
CREATE POLICY user_aliases_update ON app.user_aliases
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
COMMENT ON POLICY user_aliases_update ON app.user_aliases IS
  'Server side only, so normalization and reservation rules always run.';

DROP POLICY IF EXISTS user_aliases_delete ON app.user_aliases;
CREATE POLICY user_aliases_delete ON app.user_aliases
  FOR DELETE TO public USING (app.is_service_role() OR user_id = app.current_user_id());
COMMENT ON POLICY user_aliases_delete ON app.user_aliases IS
  'A person may release their own handle.';

GRANT SELECT ON app.user_aliases TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.user_aliases TO service_role;

-- app.workspaces -------------------------------------------------------------
ALTER TABLE app.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.workspaces FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspaces_select ON app.workspaces;
CREATE POLICY workspaces_select ON app.workspaces
  FOR SELECT TO public
  USING (app.is_service_role() OR app.is_workspace_member(id));
COMMENT ON POLICY workspaces_select ON app.workspaces IS
  'A workspace is visible only to its active members.';

DROP POLICY IF EXISTS workspaces_insert ON app.workspaces;
CREATE POLICY workspaces_insert ON app.workspaces
  FOR INSERT TO public WITH CHECK (app.is_service_role());
COMMENT ON POLICY workspaces_insert ON app.workspaces IS
  'Creation is server side because it also writes the owner membership and the billing customer in one transaction.';

DROP POLICY IF EXISTS workspaces_update ON app.workspaces;
CREATE POLICY workspaces_update ON app.workspaces
  FOR UPDATE TO public
  USING (app.is_service_role() OR app.can_administer(id))
  WITH CHECK (app.is_service_role() OR app.can_administer(id));
COMMENT ON POLICY workspaces_update ON app.workspaces IS
  'Owner or admin may edit workspace settings.';

DROP POLICY IF EXISTS workspaces_delete ON app.workspaces;
CREATE POLICY workspaces_delete ON app.workspaces
  FOR DELETE TO public USING (app.is_service_role());
COMMENT ON POLICY workspaces_delete ON app.workspaces IS
  'Deletion runs through the lifecycle workflow, never as a direct statement.';

GRANT SELECT ON app.workspaces TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.workspaces TO service_role;

-- app.consents ---------------------------------------------------------------
ALTER TABLE app.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.consents FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS consents_select ON app.consents;
CREATE POLICY consents_select ON app.consents
  FOR SELECT TO public
  USING (
    app.is_service_role()
    OR user_id = app.current_user_id()
    OR (workspace_id IS NOT NULL AND app.can_administer(workspace_id))
  );
COMMENT ON POLICY consents_select ON app.consents IS
  'A person sees their own consent history; an administrator sees workspace-scoped consents for their tenant only.';

DROP POLICY IF EXISTS consents_insert ON app.consents;
CREATE POLICY consents_insert ON app.consents
  FOR INSERT TO public
  WITH CHECK (app.is_service_role() OR user_id = app.current_user_id());
COMMENT ON POLICY consents_insert ON app.consents IS
  'Consent is recorded for the acting person only, with the document version they saw.';

DROP POLICY IF EXISTS consents_update ON app.consents;
CREATE POLICY consents_update ON app.consents
  FOR UPDATE TO public
  USING (app.is_service_role() OR user_id = app.current_user_id())
  WITH CHECK (app.is_service_role() OR user_id = app.current_user_id());
COMMENT ON POLICY consents_update ON app.consents IS
  'Withdrawal is an update by the same person. History is preserved by document version.';

-- No DELETE policy: a consent record is evidence and is never removed.
GRANT SELECT ON app.consents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.consents TO service_role;

-- app.growth_opportunities ---------------------------------------------------
ALTER TABLE app.growth_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.growth_opportunities FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS growth_opportunities_select ON app.growth_opportunities;
CREATE POLICY growth_opportunities_select ON app.growth_opportunities
  FOR SELECT TO public
  USING (app.is_service_role() OR (state = 'active'::app.catalog_state AND app.current_user_id() IS NOT NULL));
COMMENT ON POLICY growth_opportunities_select ON app.growth_opportunities IS
  'Signed-in users see verified active catalog records only. Draft, stale and retired entries stay with the operator, so an unverified URL can never surface as a recommendation.';

DROP POLICY IF EXISTS growth_opportunities_insert ON app.growth_opportunities;
CREATE POLICY growth_opportunities_insert ON app.growth_opportunities
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS growth_opportunities_update ON app.growth_opportunities;
CREATE POLICY growth_opportunities_update ON app.growth_opportunities
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS growth_opportunities_delete ON app.growth_opportunities;
CREATE POLICY growth_opportunities_delete ON app.growth_opportunities
  FOR DELETE TO public USING (app.is_service_role());
COMMENT ON POLICY growth_opportunities_insert ON app.growth_opportunities IS
  'Catalog curation is an operator workflow with URL and rule verification.';

GRANT SELECT ON app.growth_opportunities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.growth_opportunities TO service_role;

-- app.tool_catalog_entries ---------------------------------------------------
ALTER TABLE app.tool_catalog_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.tool_catalog_entries FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tool_catalog_entries_select ON app.tool_catalog_entries;
CREATE POLICY tool_catalog_entries_select ON app.tool_catalog_entries
  FOR SELECT TO public
  USING (app.is_service_role() OR (state = 'active'::app.catalog_state AND app.current_user_id() IS NOT NULL));
COMMENT ON POLICY tool_catalog_entries_select ON app.tool_catalog_entries IS
  'The Creative Tool Radar may only recommend active verified entries, and shows last_verified_at rather than guessing.';

DROP POLICY IF EXISTS tool_catalog_entries_insert ON app.tool_catalog_entries;
CREATE POLICY tool_catalog_entries_insert ON app.tool_catalog_entries
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS tool_catalog_entries_update ON app.tool_catalog_entries;
CREATE POLICY tool_catalog_entries_update ON app.tool_catalog_entries
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS tool_catalog_entries_delete ON app.tool_catalog_entries;
CREATE POLICY tool_catalog_entries_delete ON app.tool_catalog_entries
  FOR DELETE TO public USING (app.is_service_role());

GRANT SELECT ON app.tool_catalog_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.tool_catalog_entries TO service_role;

-- app.metric_definitions -----------------------------------------------------
ALTER TABLE app.metric_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.metric_definitions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS metric_definitions_select ON app.metric_definitions;
CREATE POLICY metric_definitions_select ON app.metric_definitions
  FOR SELECT TO public
  USING (app.is_service_role() OR app.current_user_id() IS NOT NULL);
COMMENT ON POLICY metric_definitions_select ON app.metric_definitions IS
  'Provider field names and definitions are reference data. Every signed-in user can read them, which is what lets the UI show what a number actually means.';

DROP POLICY IF EXISTS metric_definitions_insert ON app.metric_definitions;
CREATE POLICY metric_definitions_insert ON app.metric_definitions
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS metric_definitions_update ON app.metric_definitions;
CREATE POLICY metric_definitions_update ON app.metric_definitions
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS metric_definitions_delete ON app.metric_definitions;
CREATE POLICY metric_definitions_delete ON app.metric_definitions
  FOR DELETE TO public USING (app.is_service_role());

GRANT SELECT ON app.metric_definitions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.metric_definitions TO service_role;

-- private.billing_webhook_inbox ----------------------------------------------
ALTER TABLE private.billing_webhook_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.billing_webhook_inbox FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS billing_webhook_inbox_select ON private.billing_webhook_inbox;
CREATE POLICY billing_webhook_inbox_select ON private.billing_webhook_inbox
  FOR SELECT TO public USING (app.is_service_role());
DROP POLICY IF EXISTS billing_webhook_inbox_insert ON private.billing_webhook_inbox;
CREATE POLICY billing_webhook_inbox_insert ON private.billing_webhook_inbox
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS billing_webhook_inbox_update ON private.billing_webhook_inbox;
CREATE POLICY billing_webhook_inbox_update ON private.billing_webhook_inbox
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
COMMENT ON POLICY billing_webhook_inbox_select ON private.billing_webhook_inbox IS
  'Not tenant scoped: an inbound event is only attributed to a workspace after its signature is verified and its body parsed.';

-- No DELETE policy: the inbox is the reconciliation record.
REVOKE ALL ON private.billing_webhook_inbox FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON private.billing_webhook_inbox TO service_role;

-- private.payout_batches -----------------------------------------------------
ALTER TABLE private.payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.payout_batches FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payout_batches_select ON private.payout_batches;
CREATE POLICY payout_batches_select ON private.payout_batches
  FOR SELECT TO public USING (app.is_service_role());
DROP POLICY IF EXISTS payout_batches_insert ON private.payout_batches;
CREATE POLICY payout_batches_insert ON private.payout_batches
  FOR INSERT TO public WITH CHECK (app.is_service_role());
DROP POLICY IF EXISTS payout_batches_update ON private.payout_batches;
CREATE POLICY payout_batches_update ON private.payout_batches
  FOR UPDATE TO public USING (app.is_service_role()) WITH CHECK (app.is_service_role());
COMMENT ON POLICY payout_batches_select ON private.payout_batches IS
  'Operator level, spanning partners. Never tenant readable.';

REVOKE ALL ON private.payout_batches FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON private.payout_batches TO service_role;

-- ---------------------------------------------------------------------------
-- Assertion: no table in `app` or `private` may exist without RLS enabled.
-- The migration fails loudly rather than shipping a table nobody protected.
-- `_relay_migrations` is the ledger written by src/migrate.ts and is exempt.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  unprotected text;
BEGIN
  SELECT string_agg(format('%s.%s', n.nspname, c.relname), ', ' ORDER BY n.nspname, c.relname)
    INTO unprotected
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname IN ('app', 'private')
    AND c.relkind = 'r'
    AND c.relname <> '_relay_migrations'
    AND (NOT c.relrowsecurity OR NOT c.relforcerowsecurity);

  IF unprotected IS NOT NULL THEN
    RAISE EXCEPTION
      'Row level security missing or not forced on: %. Add the table to 0020_rls_policies.sql.',
      unprotected;
  END IF;
END
$$;
