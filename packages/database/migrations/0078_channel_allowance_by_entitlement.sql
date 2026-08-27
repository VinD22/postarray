-- 0078_channel_allowance_by_entitlement.sql
--
-- The channel guard learns to read the entitlement it was always meant to.
--
-- 0059 hard-coded ten connected channels per workspace. That was right when
-- ten was both the floor and the ceiling; it became wrong the day a tier
-- bought project capacity, because channels are derived from projects (ten per
-- project, one per launch platform) and a Growth workspace that paid for ten
-- projects was still refused its eleventh connection by a literal in a
-- trigger. The guard now reads `channels.active.max` exactly the way the
-- project guard reads `projects.active.max`: entitlement when present, the
-- ten-channel floor when absent, clamped to the 250 ceiling the largest tier
-- reaches exactly (25 projects x 10 channels).
--
-- The floor stays ten for a free workspace on purpose: connecting accounts is
-- how a person finds out the product works for them at all, and the free plan
-- meters published posts, not connections.

CREATE OR REPLACE FUNCTION app.enforce_active_channel_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, app, private
AS $$
DECLARE
  occupied integer;
  allowed integer;
BEGIN
  IF NEW.status = 'disconnected' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status <> 'disconnected' THEN
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.workspace_id, 0));

  SELECT LEAST(250, GREATEST(10, COALESCE(MAX(numeric_value), 10)))
  INTO allowed
  FROM private.entitlements
  WHERE workspace_id = NEW.workspace_id
    AND key = 'channels.active.max'
    AND effective_from <= now()
    AND (effective_until IS NULL OR effective_until > now());

  SELECT count(*)
  INTO occupied
  FROM app.social_connections
  WHERE workspace_id = NEW.workspace_id
    AND status <> 'disconnected'
    AND id <> NEW.id;

  IF occupied >= allowed THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'active channel limit reached',
      DETAIL = format('This workspace may hold at most %s connected social channels.', allowed),
      HINT = 'Disconnect a channel, or increase the channels.active.max entitlement.';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION app.enforce_active_channel_limit() IS
  'Race-safe guard for the entitlement-driven connected-channel allowance: floor 10, ceiling 250.';
