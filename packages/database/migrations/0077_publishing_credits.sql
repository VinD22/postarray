-- 0077_publishing_credits.sql
--
-- The free plan, and the ceiling the largest paid tier now reaches.
--
-- There is no seven day trial any more. A workspace signs up, connects its
-- accounts, composes and schedules with the whole product, and spends one
-- credit each time a post is actually published. When the balance reaches zero
-- the next publish is refused and nothing else is: connections stay live,
-- drafts stay editable, schedules stay visible, analytics keep arriving for
-- what already went out. The refusal is the only thing that happens.
--
-- ## Why this is not an entitlement row
--
-- `private.entitlements` is derived state. Every row in it is a function of a
-- verified subscription, rewritten wholesale whenever Polar tells us something,
-- and `buildProjectAllowanceGrant` will happily replace one. A credit balance
-- is the opposite: it is mutable, it is spent one at a time by ordinary product
-- traffic, and a reconciliation that overwrote it would silently refund or
-- confiscate posts. So it lives in its own table, and the entitlement snapshot
-- reads it rather than owning it.
--
-- ## Why a balance *and* a ledger
--
-- The balance is the race-safe number the publish path spends against, under
-- the same advisory-lock-free `UPDATE ... WHERE balance > 0` pattern that makes
-- a concurrent double publish impossible to over-spend. The ledger is why the
-- balance is what it is: an opening grant, a spend against a named content
-- item, a manual referral or affiliate award typed by an operator. Support
-- questions about credits are answered from the ledger, and a balance with no
-- explanation is not something we want to have to reconstruct from logs.
--
-- Both tables are workspace-owned, so both are RLS enabled, forced and policied
-- here, and the completeness assertion from 0072 is repeated at the end, as
-- 0073 through 0076 each do for the same reason.

-- ---------------------------------------------------------------------------
-- 1. Why a credit moved.
--
-- An enum, not free text. Each value is a decision someone made about money,
-- and a column that can hold anything eventually holds a sentence somebody
-- typed at 2am.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'post_credit_reason' AND n.nspname = 'private'
  ) THEN
    CREATE TYPE private.post_credit_reason AS ENUM (
      -- The standing grant every new workspace opens with.
      'signup_grant',
      -- One published post. The only reason that ever spends.
      'publication',
      -- Paid out by hand for a referral or an affiliate arrangement.
      'referral_grant',
      -- Anything else an operator decides, always with a note.
      'operator_grant'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 2. The balance.
--
-- One row per workspace, created on first read or first spend. The check
-- constraint is the last word: no code path, privileged or otherwise, can
-- drive a workspace negative, so "did we let someone publish for free" is a
-- question the schema answers rather than a code review.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS app.post_credit_balances (
  id text PRIMARY KEY DEFAULT app.new_id('credit'),
  workspace_id text NOT NULL UNIQUE REFERENCES app.workspaces (id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 3,
  updated_at timestamptz(6) NOT NULL DEFAULT now(),
  CONSTRAINT post_credit_balances_non_negative CHECK (balance >= 0),
  -- Mirrors MAX_POST_CREDIT_BALANCE in @relay/contracts. A hand-typed referral
  -- award is bounded here too, because the operator UI is not the only thing
  -- that can write this row.
  CONSTRAINT post_credit_balances_bounded CHECK (balance <= 1000)
);

COMMENT ON TABLE app.post_credit_balances IS
  'Publishing credits remaining on the free plan. Spent on publication, never on scheduling.';

-- ---------------------------------------------------------------------------
-- 3. The ledger.
--
-- Append only. `content_item_id` is set for a spend and null for a grant, and
-- it is intentionally not a foreign key with a cascade: deleting a draft must
-- never erase the record that publishing it cost a credit.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS app.post_credit_ledger (
  id text PRIMARY KEY DEFAULT app.new_id('credit'),
  workspace_id text NOT NULL REFERENCES app.workspaces (id) ON DELETE CASCADE,
  -- Negative spends, positive grants. Never zero: a zero row is a bug that
  -- wants to look like an event.
  delta integer NOT NULL,
  reason private.post_credit_reason NOT NULL,
  balance_after integer NOT NULL,
  content_item_id text,
  -- Who decided. Null for the automatic signup grant.
  actor_id text,
  note text,
  created_at timestamptz(6) NOT NULL DEFAULT now(),
  CONSTRAINT post_credit_ledger_delta_non_zero CHECK (delta <> 0),
  CONSTRAINT post_credit_ledger_balance_non_negative CHECK (balance_after >= 0),
  CONSTRAINT post_credit_ledger_spend_shape CHECK (
    (reason = 'publication' AND delta < 0) OR (reason <> 'publication' AND delta > 0)
  )
);

CREATE INDEX IF NOT EXISTS post_credit_ledger_workspace_created_idx
  ON app.post_credit_ledger (workspace_id, created_at DESC);

COMMENT ON TABLE app.post_credit_ledger IS
  'Why a workspace has the credit balance it has: grants, referral awards and one row per published post.';

-- ---------------------------------------------------------------------------
-- 4. Tenancy. Both tables are workspace-owned, so both get the standard
--    policies rather than a deferral.
--
--    The ledger is readable by the workspace and writable by nobody through a
--    tenant role: a spend is recorded by the publish path under the privileged
--    role in the same transaction as the balance update, and a grant is an
--    operator action. A member being able to write their own credit history is
--    the one shape this table must not have.
-- ---------------------------------------------------------------------------

ALTER TABLE app.post_credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.post_credit_balances FORCE ROW LEVEL SECURITY;
ALTER TABLE app.post_credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.post_credit_ledger FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS post_credit_balances_select ON app.post_credit_balances;
CREATE POLICY post_credit_balances_select ON app.post_credit_balances
  FOR SELECT TO public
  USING (app.is_service_role() OR app.is_workspace_member(workspace_id));
COMMENT ON POLICY post_credit_balances_select ON app.post_credit_balances IS
  'Any member may see what the workspace has left. Nobody may write it through a tenant role.';

DROP POLICY IF EXISTS post_credit_balances_write ON app.post_credit_balances;
CREATE POLICY post_credit_balances_write ON app.post_credit_balances
  FOR ALL TO public
  USING (app.is_service_role())
  WITH CHECK (app.is_service_role());
COMMENT ON POLICY post_credit_balances_write ON app.post_credit_balances IS
  'Spending and granting are privileged. A member who could write this row could publish for free.';

DROP POLICY IF EXISTS post_credit_ledger_select ON app.post_credit_ledger;
CREATE POLICY post_credit_ledger_select ON app.post_credit_ledger
  FOR SELECT TO public
  USING (app.is_service_role() OR app.is_workspace_member(workspace_id));
COMMENT ON POLICY post_credit_ledger_select ON app.post_credit_ledger IS
  'The workspace can read why its balance is what it is.';

DROP POLICY IF EXISTS post_credit_ledger_write ON app.post_credit_ledger;
CREATE POLICY post_credit_ledger_write ON app.post_credit_ledger
  FOR ALL TO public
  USING (app.is_service_role())
  WITH CHECK (app.is_service_role());
COMMENT ON POLICY post_credit_ledger_write ON app.post_credit_ledger IS
  'Append only, and only by the privileged role that spends or grants.';

-- ---------------------------------------------------------------------------
-- 5. Spending, atomically.
--
-- One statement decides whether the workspace could afford the post and records
-- that it did. `UPDATE ... WHERE balance > 0` is the whole race guard: two
-- concurrent publishes serialize on the row, the loser sees zero rows updated
-- and is refused. There is no read-then-write window for a duplicate dispatch
-- to slip through, which matters because the publish path is explicitly built
-- to survive a worker crash and retry.
--
-- Returns the balance left, or NULL when the workspace could not afford it.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.spend_post_credit(
  p_workspace_id text,
  p_content_item_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, app, private
AS $$
DECLARE
  remaining integer;
BEGIN
  -- A paid workspace is never charged a credit, and the decision is made here,
  -- in the same function as the spend, rather than by the caller: a caller that
  -- had to ask "is this workspace paid" first would reintroduce exactly the
  -- read-then-write window this function exists to close.
  IF EXISTS (
    SELECT 1
    FROM private.entitlements
    WHERE workspace_id = p_workspace_id
      AND key = 'publishing.enabled'
      AND boolean_value IS TRUE
      AND effective_from <= now()
      AND (effective_until IS NULL OR effective_until > now())
  ) THEN
    SELECT balance INTO remaining
    FROM app.post_credit_balances
    WHERE workspace_id = p_workspace_id;
    RETURN COALESCE(remaining, 0);
  END IF;

  UPDATE app.post_credit_balances
  SET balance = balance - 1,
      updated_at = now()
  WHERE workspace_id = p_workspace_id
    AND balance > 0
  RETURNING balance INTO remaining;

  IF remaining IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO app.post_credit_ledger (workspace_id, delta, reason, balance_after, content_item_id)
  VALUES (p_workspace_id, -1, 'publication', remaining, p_content_item_id);

  RETURN remaining;
END;
$$;

COMMENT ON FUNCTION app.spend_post_credit(text, text) IS
  'Atomically spends one publishing credit and records why, unless the workspace has a verified paid entitlement. Returns the remaining balance, or NULL when a free workspace has none.';

-- ---------------------------------------------------------------------------
-- 6. The opening grant.
--
-- Written when the workspace is created rather than lazily on first publish, so
-- the balance a person is shown before they have posted anything is a row we
-- can point at rather than a default we assume.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.grant_signup_post_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, app, private
AS $$
BEGIN
  INSERT INTO app.post_credit_balances (workspace_id, balance)
  VALUES (NEW.id, 3)
  ON CONFLICT (workspace_id) DO NOTHING;

  INSERT INTO app.post_credit_ledger (workspace_id, delta, reason, balance_after)
  VALUES (NEW.id, 3, 'signup_grant', 3);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workspaces_grant_signup_post_credits ON app.workspaces;

CREATE TRIGGER workspaces_grant_signup_post_credits
AFTER INSERT
ON app.workspaces
FOR EACH ROW
EXECUTE FUNCTION app.grant_signup_post_credits();

-- Workspaces that predate this migration open on the same grant. Nobody who
-- signed up before today is worse off than somebody who signs up tomorrow.
INSERT INTO app.post_credit_balances (workspace_id, balance)
SELECT id, 3 FROM app.workspaces
ON CONFLICT (workspace_id) DO NOTHING;

INSERT INTO app.post_credit_ledger (workspace_id, delta, reason, balance_after, note)
SELECT id, 3, 'signup_grant', 3, 'Backfilled by 0077_publishing_credits.'
FROM app.workspaces
WHERE NOT EXISTS (
  SELECT 1 FROM app.post_credit_ledger WHERE workspace_id = app.workspaces.id
);

-- ---------------------------------------------------------------------------
-- 7. The project ceiling moves from 20 to 25.
--
-- The largest tier saturates the authorization ceiling exactly, so that no
-- surface can claim "unlimited" and no entitlement can exceed what the database
-- will allow. Studio now sells 25 projects, so the trigger has to learn the
-- same number; the function is otherwise identical to the one 0075 installed.
-- ---------------------------------------------------------------------------

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

  SELECT LEAST(25, GREATEST(1, COALESCE(MAX(numeric_value), 3)))
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

COMMENT ON FUNCTION app.enforce_active_project_limit() IS
  'Race-safe guard for the entitlement-driven active project allowance, capped at 25.';

-- ---------------------------------------------------------------------------
-- 8. Completeness, re-asserted. 0072 is meant to be the last word on RLS and
--    it passes no deferrals, so every migration that adds a tenant table says
--    so again here.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  offender text;
BEGIN
  SELECT string_agg(format('%I.%I', schemaname, tablename), ', ')
  INTO offender
  FROM pg_tables
  WHERE schemaname = 'app'
    AND tablename IN ('post_credit_balances', 'post_credit_ledger')
    AND NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = pg_tables.schemaname
        AND c.relname = pg_tables.tablename
        AND c.relrowsecurity
        AND c.relforcerowsecurity
    );

  IF offender IS NOT NULL THEN
    RAISE EXCEPTION 'row level security missing on %', offender;
  END IF;
END
$$;
