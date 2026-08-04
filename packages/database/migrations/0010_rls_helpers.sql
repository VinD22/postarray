-- 0010_rls_helpers.sql
--
-- The claim readers every policy is written against.
--
-- All of them are STABLE (one evaluation per statement, so a policy on a large
-- scan does not re-parse the JWT per row) and SECURITY DEFINER (a client role
-- has no privilege on `app.memberships`, yet a policy must be able to consult
-- it). `search_path` is pinned on every function: a SECURITY DEFINER function
-- with a mutable search_path is a privilege escalation waiting to happen.
--
-- Claim source. `request.jwt.claims` is set by the Supabase pooler for browser
-- traffic. Server-side connections set the same GUC per transaction through
-- `withRlsContext()` in src/tenancy/rls-context.ts, so one policy body covers
-- both paths and there is no "trusted connection" shortcut to forget about.

-- ---------------------------------------------------------------------------
-- Raw claims.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.jwt_claims()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  );
$$;

COMMENT ON FUNCTION app.jwt_claims() IS
  'Decoded request claims, or an empty object when the GUC is absent. Never raises.';

-- ---------------------------------------------------------------------------
-- Who is acting.
--
-- `relay_user_id` is our own user id, injected as a custom claim at token mint
-- time and set directly by server-side callers. When it is absent we fall back
-- to the Supabase subject and resolve it through app.users.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
DECLARE
  claims       jsonb := app.jwt_claims();
  direct_id    text  := claims ->> 'relay_user_id';
  auth_subject text  := claims ->> 'sub';
  resolved     uuid;
BEGIN
  IF direct_id IS NOT NULL AND direct_id <> '' THEN
    BEGIN
      RETURN direct_id::uuid;
    EXCEPTION WHEN invalid_text_representation THEN
      RETURN NULL;
    END;
  END IF;

  IF auth_subject IS NULL OR auth_subject = '' THEN
    RETURN NULL;
  END IF;

  BEGIN
    SELECT u.id INTO resolved
    FROM app.users u
    WHERE u.auth_subject_id = auth_subject::uuid
      AND u.status = 'active'::app.user_status;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN NULL;
  END;

  RETURN resolved;
END;
$$;

COMMENT ON FUNCTION app.current_user_id() IS
  'Relay user id for the current request, or NULL. NULL denies every tenant policy.';

-- ---------------------------------------------------------------------------
-- Service role detection.
--
-- The service role is still policy-constrained. This exists so a policy can say
-- "operators may read the global catalog" without granting BYPASSRLS anywhere.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT COALESCE(app.jwt_claims() ->> 'role', '') = 'service_role'
      OR pg_catalog.current_setting('role', true) = 'service_role';
$$;

COMMENT ON FUNCTION app.is_service_role() IS
  'True for trusted server-side traffic. Grants breadth, never a tenancy bypass.';

-- ---------------------------------------------------------------------------
-- Which workspaces the actor belongs to.
--
-- A server-side caller that has narrowed itself to a single workspace sets
-- `relay_workspace_id`; that intersects with real membership rather than
-- replacing it, so a wrong GUC cannot widen access.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.current_workspace_ids()
RETURNS uuid[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
DECLARE
  uid          uuid := app.current_user_id();
  claims       jsonb := app.jwt_claims();
  pinned_raw   text := claims ->> 'relay_workspace_id';
  pinned       uuid;
  workspace_ids uuid[];
BEGIN
  IF uid IS NULL THEN
    RETURN ARRAY[]::uuid[];
  END IF;

  SELECT COALESCE(array_agg(m.workspace_id), ARRAY[]::uuid[])
    INTO workspace_ids
  FROM app.memberships m
  JOIN app.workspaces w ON w.id = m.workspace_id
  WHERE m.user_id = uid
    AND m.state = 'active'::app.membership_state
    AND w.deleted_at IS NULL;

  IF pinned_raw IS NOT NULL AND pinned_raw <> '' THEN
    BEGIN
      pinned := pinned_raw::uuid;
    EXCEPTION WHEN invalid_text_representation THEN
      RETURN ARRAY[]::uuid[];
    END;

    IF pinned = ANY (workspace_ids) THEN
      RETURN ARRAY[pinned];
    END IF;

    RETURN ARRAY[]::uuid[];
  END IF;

  RETURN workspace_ids;
END;
$$;

COMMENT ON FUNCTION app.current_workspace_ids() IS
  'Active memberships for the current actor, optionally narrowed to a pinned workspace.';

-- ---------------------------------------------------------------------------
-- Role check.
--
-- `roles` is a text array so a policy reads as the sentence it enforces:
--   app.has_workspace_role(workspace_id, ARRAY['owner','admin'])
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.has_workspace_role(ws uuid, roles text[])
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
DECLARE
  uid uuid := app.current_user_id();
BEGIN
  IF ws IS NULL OR uid IS NULL OR roles IS NULL OR cardinality(roles) = 0 THEN
    RETURN false;
  END IF;

  IF NOT (ws = ANY (app.current_workspace_ids())) THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM app.memberships m
    WHERE m.workspace_id = ws
      AND m.user_id = uid
      AND m.state = 'active'::app.membership_state
      AND m.role::text = ANY (roles)
  );
END;
$$;

COMMENT ON FUNCTION app.has_workspace_role(uuid, text[]) IS
  'Membership role check. Requires an active membership in a live workspace.';

-- ---------------------------------------------------------------------------
-- Convenience predicates used by almost every policy.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.is_workspace_member(ws uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
  SELECT ws IS NOT NULL AND ws = ANY (app.current_workspace_ids());
$$;

-- Roles allowed to change content, connections and automation.
CREATE OR REPLACE FUNCTION app.can_write(ws uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
  SELECT app.has_workspace_role(ws, ARRAY['owner', 'admin', 'manager', 'editor']);
$$;

-- Roles allowed to decide an approval.
CREATE OR REPLACE FUNCTION app.can_approve(ws uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
  SELECT app.has_workspace_role(ws, ARRAY['owner', 'admin', 'manager', 'approver']);
$$;

-- Roles allowed to change membership, billing and workspace settings.
CREATE OR REPLACE FUNCTION app.can_administer(ws uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = app, pg_catalog, pg_temp
AS $$
  SELECT app.has_workspace_role(ws, ARRAY['owner', 'admin']);
$$;

-- ---------------------------------------------------------------------------
-- Execute grants. The functions are the only `app` objects a client role may
-- call, and they are read-only by construction.
-- ---------------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION app.jwt_claims()                       TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.current_user_id()                  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.is_service_role()                  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.current_workspace_ids()            TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.has_workspace_role(uuid, text[])   TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.is_workspace_member(uuid)          TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.can_write(uuid)                    TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.can_approve(uuid)                  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.can_administer(uuid)               TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION app.jwt_claims() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.current_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.is_service_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.current_workspace_ids() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.has_workspace_role(uuid, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.is_workspace_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.can_write(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.can_approve(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.can_administer(uuid) FROM PUBLIC;
