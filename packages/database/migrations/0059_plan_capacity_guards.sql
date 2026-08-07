-- 0059_plan_capacity_guards.sql
-- The application gives the friendly refusal. This trigger is the final race
-- guard for two concurrent OAuth callbacks or a privileged integration writer.
-- Every connected state occupies a slot. Only an explicit disconnect releases
-- it. The advisory transaction lock serializes capacity changes per workspace.

CREATE OR REPLACE FUNCTION app.enforce_active_channel_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, app
AS $$
DECLARE
  occupied integer;
BEGIN
  IF NEW.status = 'disconnected' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status <> 'disconnected' THEN
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.workspace_id, 0));

  SELECT count(*)
  INTO occupied
  FROM app.social_connections
  WHERE workspace_id = NEW.workspace_id
    AND status <> 'disconnected'
    AND id <> NEW.id;

  IF occupied >= 10 THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'active channel limit reached',
      DETAIL = 'A workspace may hold at most 10 connected social channels.',
      HINT = 'Disconnect one channel before activating another.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS social_connections_active_channel_limit
  ON app.social_connections;

CREATE TRIGGER social_connections_active_channel_limit
BEFORE INSERT OR UPDATE OF status, workspace_id
ON app.social_connections
FOR EACH ROW
EXECUTE FUNCTION app.enforce_active_channel_limit();

COMMENT ON FUNCTION app.enforce_active_channel_limit() IS
  'Race-safe final guard for the 10 connected-channel workspace allowance.';
