-- 0076_onboarding_states.sql
--
-- First-run progress, per person, per workspace.
--
-- Until now the first sixty seconds of the product had no system of record.
-- `GET /v1/onboarding` did not exist, and the session view hard-coded
-- `onboardingComplete: true`, so nothing about a person's first run survived a
-- refresh and nobody was ever routed into the sequence in the first place.
--
-- Onboarding belongs to a *member*, not to a workspace. Two people who join the
-- same workspace each walk their own first run, and one of them finishing must
-- not silently mark the other done. So the natural key is
-- (workspace_id, user_id), exactly like `app.remembered_targets` (0070) and
-- `app.consents` (0004), and the policies below are the same self-row shape
-- those two use: workspace membership is necessary here but it is not
-- sufficient. A teammate, an approver and an administrator all fail them.
--
-- What this table deliberately does not hold: whether onboarding is *finished*
-- as a derived fact. `completed_at` records that a person reached the receipt,
-- and that is an event. The application service decides completion by combining
-- this row with real signals (an active project plus a live connection), so a
-- workspace that predates this table is never sent back to step one merely
-- because the table is younger than the account.
--
-- This is a new table added after 0072_assert_rls_complete.sql, which is meant
-- to be the last word on completeness and passes no deferrals. RLS is enabled,
-- forced and policied in this same file, and the assertion is repeated at the
-- end, exactly as 0073, 0074 and 0075 do for the same reason.

-- ---------------------------------------------------------------------------
-- 1. The use case vocabulary.
--
-- An enum rather than free text: this value only ever personalises first-run
-- copy, and a column that can hold anything is a column that will eventually
-- hold a sentence somebody typed. It carries no entitlement, no limit and no
-- pricing decision, and nothing downstream branches on it for capability.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'app' AND t.typname = 'onboarding_use_case'
  ) THEN
    CREATE TYPE app.onboarding_use_case AS ENUM ('creator', 'team', 'agency', 'developer');
  END IF;
END
$$;

COMMENT ON TYPE app.onboarding_use_case IS
  'What the person said they are here to do. Personalises first-run copy only: no entitlement, limit or price reads this.';

-- ---------------------------------------------------------------------------
-- 2. The table.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS app.onboarding_states (
  id                    text        NOT NULL DEFAULT app.new_id('onboarding'),
  workspace_id          text        NOT NULL,
  user_id               text        NOT NULL,
  use_case              app.onboarding_use_case,
  -- Step ids from the first-run sequence, in the order they were finished. A
  -- plain array rather than one boolean column per step, because the sequence
  -- is product copy and changes more often than this schema should.
  completed_steps       text[]      NOT NULL DEFAULT '{}',
  checkout_confirmed_at timestamptz,
  completed_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT onboarding_states_pkey PRIMARY KEY (id),
  CONSTRAINT onboarding_states_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES app.workspaces (id) ON DELETE CASCADE,
  CONSTRAINT onboarding_states_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES app.users (id) ON DELETE CASCADE,
  -- Bounded, and step ids only. A caption, a URL or a JSON blob smuggled into
  -- this array would fail here, which is the point: the column shape is the
  -- promise. Twelve is comfortably more than the six steps that exist.
  --
  -- The pattern is applied to the array's own text rendering rather than to
  -- each element, because a CHECK constraint may not contain a subquery and
  -- `unnest` is one. `{plan,workspace,use-case}` passes; anything carrying a
  -- space, a quote, a slash or a brace does not, and a quoted element is
  -- exactly how Postgres renders those.
  CONSTRAINT onboarding_states_steps_bounded
    CHECK (
      coalesce(array_length(completed_steps, 1), 0) <= 12
      AND completed_steps::text ~ '^\{[a-z0-9,-]*\}$'
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS onboarding_states_member_key
  ON app.onboarding_states (workspace_id, user_id);
CREATE INDEX IF NOT EXISTS onboarding_states_workspace_id_idx
  ON app.onboarding_states (workspace_id);
CREATE INDEX IF NOT EXISTS onboarding_states_user_id_idx
  ON app.onboarding_states (user_id);

COMMENT ON TABLE app.onboarding_states IS
  'One person''s first-run progress in one workspace. The explicit record of what they did; completion itself is decided by the application service, which also reads real signals so an established workspace is never sent back to step one.';
COMMENT ON INDEX app.onboarding_states_member_key IS
  'One first run per person per workspace. The write is an upsert on this key.';
COMMENT ON COLUMN app.onboarding_states.completed_steps IS
  'Step ids in the order they were finished. Never a label, a caption or anything a person typed.';
COMMENT ON COLUMN app.onboarding_states.checkout_confirmed_at IS
  'Set when the person returns from checkout, not when they open the step.';
COMMENT ON COLUMN app.onboarding_states.completed_at IS
  'Set once, when the person reaches the receipt. Never cleared by a later edit, so finishing is not something a refresh can undo.';

-- ---------------------------------------------------------------------------
-- 3. Row level security.
--
-- Self-row policies, the shape app.consents and app.remembered_targets use.
-- Deliberately not `apply_tenant_policies`: workspace membership is necessary
-- here but it is not sufficient. Somebody else's first-run progress is not an
-- administrative record, and nothing in the product needs to read it.
-- ---------------------------------------------------------------------------

ALTER TABLE app.onboarding_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.onboarding_states FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS onboarding_states_select ON app.onboarding_states;
CREATE POLICY onboarding_states_select ON app.onboarding_states
  FOR SELECT TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY onboarding_states_select ON app.onboarding_states IS
  'A person reads their own first-run progress and nobody else''s, not even an administrator of the same workspace.';

DROP POLICY IF EXISTS onboarding_states_insert ON app.onboarding_states;
CREATE POLICY onboarding_states_insert ON app.onboarding_states
  FOR INSERT TO public
  WITH CHECK (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY onboarding_states_insert ON app.onboarding_states IS
  'Progress is recorded for the acting person only.';

DROP POLICY IF EXISTS onboarding_states_update ON app.onboarding_states;
CREATE POLICY onboarding_states_update ON app.onboarding_states
  FOR UPDATE TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  )
  WITH CHECK (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY onboarding_states_update ON app.onboarding_states IS
  'Finishing a later step is an update by the same person.';

DROP POLICY IF EXISTS onboarding_states_delete ON app.onboarding_states;
CREATE POLICY onboarding_states_delete ON app.onboarding_states
  FOR DELETE TO public
  USING (
    app.is_service_role()
    OR (user_id = app.current_user_id() AND app.is_workspace_member(workspace_id))
  );
COMMENT ON POLICY onboarding_states_delete ON app.onboarding_states IS
  'Deleting the account or leaving the workspace removes the row; a person may also discard their own progress.';

REVOKE ALL ON app.onboarding_states FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.onboarding_states TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.onboarding_states TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.onboarding_states TO relay_app;

-- 0072_assert_rls_complete.sql runs before this file and is meant to be the
-- last word on completeness. This migration adds a table, so the assertion is
-- repeated here rather than assumed, matching 0073, 0074 and 0075.
SELECT private.assert_rls_complete();
