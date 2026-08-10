-- 0070_pause_posting_sets_and_target_memory.sql
--
-- Three product gaps, one migration. Tables and columns live in the reviewed
-- core schema (0004), as they have since 0050; this file carries the
-- invariants Prisma cannot express, the indexes, and the tenant policies.
--
-- 1. A hold on a publish job.
--
--    Pausing is not a publish state. `paused_at` plus `paused_reason` is a
--    hold, and the reason is the point: `user` is a person stopping the clock
--    from the calendar, `billing` is the entitlement path stopping it because
--    a workspace lost full access. The two must never collapse into one
--    another, because resuming the second is a payment matter. The CHECK below
--    keeps the pair complete and the vocabulary closed.
--
--    Nothing here can un-publish anything: a hold is only ever meaningful
--    before dispatch, which the application service enforces and which the
--    partial index reflects.
--
-- 2. Posting Sets.
--
--    A Set is read once, at apply time. Applying copies values into a draft;
--    editing the Set afterwards changes the next apply and nothing else. There
--    is deliberately no trigger propagating an edit onto existing content, and
--    the FK from content_items to posting_sets stays ON DELETE SET NULL for the
--    same reason: the draft outlives the Set that seeded it.
--
-- 3. Remembered targets.
--
--    Channel identifiers only, per person, per project, opt in. The policies
--    below are self-row: `user_id = app.current_user_id()`, the same shape
--    app.consents uses in 0020. One member of a project must not be able to
--    read which accounts another member last posted to, and a workspace
--    administrator has no business reading it either. It is a convenience,
--    not a record, so nobody inherits it.

-- ---------------------------------------------------------------------------
-- 1. Publish job holds
-- ---------------------------------------------------------------------------

ALTER TABLE app.publish_jobs
  DROP CONSTRAINT IF EXISTS publish_jobs_paused_by_user_id_fkey,
  ADD CONSTRAINT publish_jobs_paused_by_user_id_fkey
    FOREIGN KEY (paused_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS publish_jobs_pause_pair_complete,
  ADD CONSTRAINT publish_jobs_pause_pair_complete
    CHECK ((paused_at IS NULL) = (paused_reason IS NULL)),
  DROP CONSTRAINT IF EXISTS publish_jobs_pause_reason_supported,
  ADD CONSTRAINT publish_jobs_pause_reason_supported
    CHECK (paused_reason IS NULL OR paused_reason IN ('user', 'billing')),
  -- A hold on something that already reached a platform would be a lie. The
  -- application refuses it; this refuses it again.
  DROP CONSTRAINT IF EXISTS publish_jobs_pause_not_after_dispatch,
  ADD CONSTRAINT publish_jobs_pause_not_after_dispatch
    CHECK (
      paused_at IS NULL
      OR state NOT IN (
        'preparing_media'::app.publish_state,
        'dispatching'::app.publish_state,
        'provider_processing'::app.publish_state,
        'published'::app.publish_state,
        'partially_published'::app.publish_state,
        'deleted_externally'::app.publish_state
      )
    ),
  -- A system hold has no person attached. A person's hold always does.
  DROP CONSTRAINT IF EXISTS publish_jobs_user_pause_has_person,
  ADD CONSTRAINT publish_jobs_user_pause_has_person
    CHECK (paused_reason IS DISTINCT FROM 'user' OR paused_by_user_id IS NOT NULL);

COMMENT ON COLUMN app.publish_jobs.paused_reason IS
  'user or billing. Never merge the two: one is resumed by a person, the other by a payment.';
COMMENT ON COLUMN app.publish_jobs.paused_at IS
  'A hold on work that has not happened. It never retracts an external post.';

-- The calendar and the action centre both ask "what is on hold in this
-- workspace, and who stopped it". Partial, because almost nothing is on hold.
DROP INDEX IF EXISTS app.publish_jobs_paused_idx;
CREATE INDEX publish_jobs_paused_idx
  ON app.publish_jobs (workspace_id, paused_reason, scheduled_for)
  WHERE paused_at IS NOT NULL;

COMMENT ON INDEX app.publish_jobs_paused_idx IS
  'Held jobs by reason. Partial: a held job is the exception, not the norm.';

-- ---------------------------------------------------------------------------
-- 2. Posting Sets
-- ---------------------------------------------------------------------------

ALTER TABLE app.posting_sets
  DROP CONSTRAINT IF EXISTS posting_sets_created_by_user_id_fkey,
  ADD CONSTRAINT posting_sets_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS posting_sets_name_present,
  ADD CONSTRAINT posting_sets_name_present
    CHECK (length(btrim(name)) > 0),
  DROP CONSTRAINT IF EXISTS posting_sets_slot_behavior_supported,
  ADD CONSTRAINT posting_sets_slot_behavior_supported
    CHECK (slot_behavior IN ('next_free_slot', 'pick_time', 'draft_only')),
  DROP CONSTRAINT IF EXISTS posting_sets_target_defaults_is_array,
  ADD CONSTRAINT posting_sets_target_defaults_is_array
    CHECK (jsonb_typeof(target_defaults) = 'array'),
  DROP CONSTRAINT IF EXISTS posting_sets_comment_skeleton_is_array,
  ADD CONSTRAINT posting_sets_comment_skeleton_is_array
    CHECK (jsonb_typeof(comment_skeleton) = 'array'),
  DROP CONSTRAINT IF EXISTS posting_sets_target_count_bounded,
  ADD CONSTRAINT posting_sets_target_count_bounded
    CHECK (coalesce(array_length(connection_ids, 1), 0) <= 200);

COMMENT ON COLUMN app.posting_sets.target_defaults IS
  'Per-platform starting values, copied into a draft at apply time. Editing them never rewrites a draft that already exists.';

-- A name is reusable once the Set carrying it is archived, which the unique
-- index in 0004 cannot express because it spans archived rows too.
DROP INDEX IF EXISTS app.posting_sets_live_name_key;
CREATE UNIQUE INDEX posting_sets_live_name_key
  ON app.posting_sets (workspace_id, brand_id, lower(btrim(name)))
  WHERE archived_at IS NULL;

COMMENT ON INDEX app.posting_sets_live_name_key IS
  'One live Set per name per project. Archiving frees the name.';

-- The management screen lists live Sets for one project, newest first.
DROP INDEX IF EXISTS app.posting_sets_live_idx;
CREATE INDEX posting_sets_live_idx
  ON app.posting_sets (workspace_id, brand_id, created_at DESC)
  WHERE archived_at IS NULL;

-- Tenant policies for app.posting_sets already exist, applied in 0020 with the
-- member/writer/writer/writer profile. They are correct for a Set, so this
-- migration deliberately does not restate them: the management service archives
-- rather than deletes, and re-declaring a policy here would make 0020 stop
-- being the place to read them.

-- ---------------------------------------------------------------------------
-- 3. Remembered targets
-- ---------------------------------------------------------------------------

-- A CHECK constraint cannot contain a subquery, so the per-element test lives
-- in an IMMUTABLE function. Written in SQL rather than plpgsql so the planner
-- can inline it, and STRICT so a NULL array is nobody's business here.
CREATE OR REPLACE FUNCTION app.is_connection_id_array(ids text[])
RETURNS boolean
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = pg_catalog
AS $$
  SELECT coalesce(
    bool_and(candidate ~ '^conn_[0-9abcdefghjkmnpqrstvwxyz]{26}$'),
    true
  )
  FROM unnest(ids) AS candidate;
$$;

COMMENT ON FUNCTION app.is_connection_id_array(text[]) IS
  'True when every element is a Relay channel identifier. Used to keep app.remembered_targets to identifiers and nothing else.';

ALTER TABLE app.remembered_targets
  -- Identifiers only. A caption, a URL or a JSON blob smuggled into this array
  -- would fail here, which is the point: the column shape is the promise.
  DROP CONSTRAINT IF EXISTS remembered_targets_ids_only,
  ADD CONSTRAINT remembered_targets_ids_only
    CHECK (
      coalesce(array_length(connection_ids, 1), 0) <= 200
      AND app.is_connection_id_array(connection_ids)
    );

COMMENT ON TABLE app.remembered_targets IS
  'One member''s last channel selection in one project. Channel identifiers only: never a caption, a schedule, a privacy setting, an approval state or any campaign content.';
COMMENT ON COLUMN app.remembered_targets.connection_ids IS
  'Channel identifiers in last-selected order. Re-checked against live channel health before any of them is offered again.';

DROP INDEX IF EXISTS app.remembered_targets_member_key;
CREATE UNIQUE INDEX remembered_targets_member_key
  ON app.remembered_targets (workspace_id, brand_id, user_id);

COMMENT ON INDEX app.remembered_targets_member_key IS
  'One memory per person per project. The write is an upsert on this key.';

-- Self-row policies, the shape app.consents uses. Deliberately not
-- `apply_tenant_policies`: workspace membership is necessary here but it is not
-- sufficient. A teammate, an approver and an administrator all fail these.
ALTER TABLE app.remembered_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.remembered_targets FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS remembered_targets_select ON app.remembered_targets;
CREATE POLICY remembered_targets_select ON app.remembered_targets
  FOR SELECT TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY remembered_targets_select ON app.remembered_targets IS
  'A person reads their own remembered selection and nobody else''s, not even an administrator of the same workspace.';

DROP POLICY IF EXISTS remembered_targets_insert ON app.remembered_targets;
CREATE POLICY remembered_targets_insert ON app.remembered_targets
  FOR INSERT TO public
  WITH CHECK (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY remembered_targets_insert ON app.remembered_targets IS
  'A selection is remembered for the acting person only.';

DROP POLICY IF EXISTS remembered_targets_update ON app.remembered_targets;
CREATE POLICY remembered_targets_update ON app.remembered_targets
  FOR UPDATE TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  )
  WITH CHECK (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY remembered_targets_update ON app.remembered_targets IS
  'Remembering a newer selection is an update by the same person.';

DROP POLICY IF EXISTS remembered_targets_delete ON app.remembered_targets;
CREATE POLICY remembered_targets_delete ON app.remembered_targets
  FOR DELETE TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY remembered_targets_delete ON app.remembered_targets IS
  'Turning the memory off, or clearing it, deletes the acting person''s own row. Forgetting must always be available.';

GRANT SELECT, INSERT, UPDATE, DELETE ON app.remembered_targets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.remembered_targets TO service_role;

COMMENT ON COLUMN app.brands.remember_targets_enabled IS
  'Project opt in, default false. While false the application stores nothing at all; there is no row to leak.';
