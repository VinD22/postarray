-- 0066_project_capacity_guard.sql
-- The application gives the friendly refusal. This trigger is the race-safe
-- final guard for concurrent project creation and privileged integration writes.

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
      FROM app.brands
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
  FROM app.brands
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

DROP TRIGGER IF EXISTS brands_active_project_limit ON app.brands;

CREATE TRIGGER brands_active_project_limit
BEFORE INSERT OR UPDATE OF archived_at, workspace_id
ON app.brands
FOR EACH ROW
EXECUTE FUNCTION app.enforce_active_project_limit();

COMMENT ON FUNCTION app.enforce_active_project_limit() IS
  'Race-safe guard for the entitlement-driven active project allowance, capped at 20.';
