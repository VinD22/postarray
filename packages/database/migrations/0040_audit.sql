-- 0040_audit.sql
--
-- The audit log is append only, and it is append only in the database rather
-- than by convention. A log that a compromised application role can rewrite is
-- not evidence of anything.
--
-- `private.audit_events` is created by the Prisma schema. This migration adds
-- the guarantees Prisma cannot express: an UPDATE/DELETE block that applies to
-- the table owner too, a retention-safe partial index, and the helper the
-- application uses to record a privileged read of credentials or customer data.

-- ---------------------------------------------------------------------------
-- 1. Block mutation.
--
-- The trigger fires for every role including the owner. TRUNCATE is covered by
-- its own statement-level trigger, because TRUNCATE does not fire row triggers.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.reject_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = private, pg_catalog, pg_temp
AS $$
BEGIN
  RAISE EXCEPTION
    'audit_events is append only: % is not permitted on this table', TG_OP
    USING ERRCODE = 'insufficient_privilege',
          HINT = 'Record a compensating event instead of editing history. Retention pruning uses private.prune_audit_events().';
END;
$$;

DROP TRIGGER IF EXISTS audit_events_append_only ON private.audit_events;
CREATE TRIGGER audit_events_append_only
  BEFORE UPDATE OR DELETE ON private.audit_events
  FOR EACH ROW
  EXECUTE FUNCTION private.reject_audit_mutation();

DROP TRIGGER IF EXISTS audit_events_no_truncate ON private.audit_events;
CREATE TRIGGER audit_events_no_truncate
  BEFORE TRUNCATE ON private.audit_events
  FOR EACH STATEMENT
  EXECUTE FUNCTION private.reject_audit_mutation();

COMMENT ON FUNCTION private.reject_audit_mutation() IS
  'Blocks UPDATE, DELETE and TRUNCATE on the audit log for every role, owner included.';

-- ---------------------------------------------------------------------------
-- 2. Retention.
--
-- Pruning still has to be possible, so it goes through one named SECURITY
-- DEFINER function that disables the guard for the duration of a single
-- bounded statement and records what it removed. Nothing else can do this.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.prune_audit_events(older_than timestamptz)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, app, pg_catalog, pg_temp
AS $$
DECLARE
  removed bigint;
BEGIN
  IF older_than > now() - interval '365 days' THEN
    RAISE EXCEPTION
      'audit retention floor is 365 days; refusing to prune events newer than %', older_than
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  ALTER TABLE private.audit_events DISABLE TRIGGER audit_events_append_only;

  DELETE FROM private.audit_events WHERE created_at < older_than;
  GET DIAGNOSTICS removed = ROW_COUNT;

  ALTER TABLE private.audit_events ENABLE TRIGGER audit_events_append_only;

  -- The caller records the operator-level audit line, because only it knows the
  -- actor. This function deliberately writes nothing back into the table it just
  -- pruned, so the guard is never disabled for longer than one DELETE.
  RAISE LOG 'audit retention pruned % rows older than %', removed, older_than;

  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION private.prune_audit_events(timestamptz) FROM PUBLIC;
COMMENT ON FUNCTION private.prune_audit_events(timestamptz) IS
  'The only sanctioned way to remove audit rows. Refuses anything newer than the 365 day retention floor and logs what it removed.';

-- ---------------------------------------------------------------------------
-- 3. Privileged reads.
--
-- Postgres cannot trigger on SELECT, so a privileged read is audited by the
-- code that performs it. This helper exists so every call site writes the same
-- shape and nobody has to remember the column list. It is used by the token
-- vault, the billing reader and support tooling.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.record_privileged_read(
  p_workspace_id  text,
  p_actor_type    app.actor_type,
  p_actor_id      text,
  p_surface       app.creation_surface,
  p_target_type   text,
  p_target_id     text,
  p_reason        text,
  p_correlation_id text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, app, pg_catalog, pg_temp
AS $$
DECLARE
  new_id text;
BEGIN
  IF p_reason IS NULL OR length(btrim(p_reason)) = 0 THEN
    RAISE EXCEPTION 'a privileged read must state a reason'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  INSERT INTO private.audit_events (
    workspace_id, actor_type, actor_id, surface, action,
    target_type, target_id, metadata, correlation_id
  ) VALUES (
    p_workspace_id, p_actor_type, p_actor_id, p_surface, 'privileged_read',
    p_target_type, p_target_id,
    jsonb_build_object('reason', p_reason),
    p_correlation_id
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION private.record_privileged_read(text, app.actor_type, text, app.creation_surface, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.record_privileged_read(text, app.actor_type, text, app.creation_surface, text, text, text, text) TO service_role;

COMMENT ON FUNCTION private.record_privileged_read(text, app.actor_type, text, app.creation_surface, text, text, text, text) IS
  'Records a read of credentials or customer data. A reason is mandatory, because an audit line nobody can interpret is not an audit line.';

-- ---------------------------------------------------------------------------
-- 4. Indexes for the queries the audit log actually serves.
-- ---------------------------------------------------------------------------

-- "What happened in this workspace recently" is the timeline view.
CREATE INDEX IF NOT EXISTS audit_events_workspace_created_at_desc_idx
  ON private.audit_events (workspace_id, created_at DESC);

-- "Everything this API key or OAuth app ever did" is the revocation review.
CREATE INDEX IF NOT EXISTS audit_events_actor_client_idx
  ON private.audit_events (actor_client_id, created_at DESC)
  WHERE actor_client_id IS NOT NULL;

-- Privileged reads are reviewed on their own cadence.
CREATE INDEX IF NOT EXISTS audit_events_privileged_read_idx
  ON private.audit_events (workspace_id, created_at DESC)
  WHERE action = 'privileged_read';
