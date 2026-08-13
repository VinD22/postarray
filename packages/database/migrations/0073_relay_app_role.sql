-- 0073_relay_app_role.sql
--
-- The application's own database role, and the answer to the design question
-- raised by docs/planning/25-rls-suite-findings.md.
--
-- The question
-- ------------
-- 0020_rls_policies.sql grants `SELECT` to `authenticated` and full CRUD to
-- `service_role`. Grants are checked *before* policies, so a write issued by a
-- connection whose role is `authenticated` fails on the grant and the
-- claims-based write branches (`app.can_write`, `app.can_administer`,
-- `app.can_approve`) are never evaluated. Two readings were possible: either
-- those branches are vestigial and role enforcement really lives in
-- `packages/application`, or the connecting role was simply wrong.
--
-- The answer
-- ----------
-- The connecting role was wrong. The application connects as `relay_app`: a
-- dedicated role that holds full CRUD on every table the policies guard and
-- that does **not** carry `BYPASSRLS`. The claims-based policies stay load
-- bearing for reads *and* writes.
--
-- This works without touching a single policy body, because every branch in
-- 0020 is written against **claims**, not against database roles.
-- `app.is_service_role()` and `app.is_workspace_member()` read
-- `request.jwt.claims`, which `packages/database/src/tenancy/rls-context.ts`
-- sets per transaction with `is_local = true`. The moment the connecting role
-- has the write grants and cannot bypass RLS, those branches become reachable
-- and start deciding outcomes.
--
-- Deleting the write branches instead would have been the cheaper edit and the
-- wrong one. This product holds other people's publishing credentials. Defence
-- in depth against an application scoping bug is precisely what
-- `src/rls.test.ts` exists to prove, and a policy body that cannot be reached
-- proves nothing.
--
-- `authenticated` keeps its SELECT-only grants untouched. It is reserved for a
-- future Neon Data API surface, where a browser session reads directly and
-- every write still travels through the application service.
--
-- No password and no LOGIN attribute is set here: credentials never live in
-- source (AGENTS.md, hard rule 2). An operator grants LOGIN and a password out
-- of band and points `DATABASE_URL` at it. Until then the role is reachable
-- with `SET ROLE`, which is how `src/rls.test.ts` exercises it.

-- ---------------------------------------------------------------------------
-- The role.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'relay_app') THEN
    -- BYPASSRLS is left at its default of off and is *asserted* at the end of
    -- this file rather than re-stated with ALTER ROLE. PostgreSQL lets only a
    -- superuser touch the BYPASSRLS attribute at all, including turning it off,
    -- and the migration owner on Neon is not a superuser. An assertion that
    -- fails the migrate is the enforcement.
    CREATE ROLE relay_app NOLOGIN NOINHERIT;
  END IF;
END
$$;

-- The migration owner needs membership to be able to `SET ROLE relay_app`,
-- which is what the RLS suite does to run a case as the application would.
DO $$
BEGIN
  EXECUTE format('GRANT relay_app TO %I', current_user);
EXCEPTION
  WHEN insufficient_privilege OR duplicate_object THEN
    -- Already a member, or an environment where the owner cannot self-grant.
    NULL;
END
$$;

-- ---------------------------------------------------------------------------
-- Grants.
--
-- Mirrored from `service_role` rather than re-listed, so the two can never
-- drift: 0020 is the single place that decides which tables exist under RLS,
-- and adding a table there gives `relay_app` the same reach on the next run of
-- this file. Sequences are included because a few tables use identity columns.
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA app, private TO relay_app;

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT n.nspname AS schema_name, c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('r', 'p')
      AND n.nspname IN ('app', 'private')
    ORDER BY 1, 2
  LOOP
    EXECUTE format(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON %I.%I TO relay_app',
      t.schema_name, t.table_name
    );
  END LOOP;
END
$$;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO relay_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA private TO relay_app;

-- The policy helpers. 0010 revoked EXECUTE from PUBLIC and granted it to the
-- three Supabase-shaped roles by name, so without this every policy body raises
-- "permission denied for function is_service_role" before it can decide
-- anything. Mirrored from `service_role` for the same anti-drift reason as the
-- table grants above.
DO $$
DECLARE
  f record;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('app', 'private')
      AND p.prokind = 'f'
      AND has_function_privilege('service_role', p.oid, 'EXECUTE')
    ORDER BY 1
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO relay_app', f.signature);
  END LOOP;
END
$$;

-- A table added by a later migration is granted beside its policy, exactly as
-- 0020 requires for the other roles. Default privileges stay revoked so that
-- forgetting means "relay_app cannot read it", never "everyone can".

-- ---------------------------------------------------------------------------
-- Assertions. A migration that quietly did nothing is worse than one that
-- failed, so both halves of the decision are checked here.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  bypasses boolean;
  ungranted text[];
BEGIN
  SELECT rolbypassrls INTO bypasses FROM pg_roles WHERE rolname = 'relay_app';
  IF bypasses IS DISTINCT FROM false THEN
    RAISE EXCEPTION
      'relay_app carries BYPASSRLS. Every policy in 0020_rls_policies.sql would be skipped.';
  END IF;

  SELECT array_agg(format('%s.%s', n.nspname, c.relname) ORDER BY n.nspname, c.relname)
    INTO ungranted
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r', 'p')
    AND n.nspname IN ('app', 'private')
    AND NOT (
      has_table_privilege('relay_app', c.oid, 'SELECT')
      AND has_table_privilege('relay_app', c.oid, 'INSERT')
      AND has_table_privilege('relay_app', c.oid, 'UPDATE')
      AND has_table_privilege('relay_app', c.oid, 'DELETE')
    );

  IF ungranted IS NOT NULL THEN
    RAISE EXCEPTION
      'relay_app is missing CRUD on: %. Its policies would be unreachable on those tables.',
      array_to_string(ungranted, ', ');
  END IF;

  IF NOT has_function_privilege('relay_app', 'app.is_service_role()', 'EXECUTE')
     OR NOT has_function_privilege('relay_app', 'app.can_write(text)', 'EXECUTE') THEN
    RAISE EXCEPTION
      'relay_app cannot execute the policy helpers. Every policy body would raise instead of deciding.';
  END IF;
END
$$;

-- `authenticated` must still be read-only. If a future edit hands it a write
-- grant, the Data API surface stops being read-only and nobody notices.
--
-- One documented exception. `app.remembered_targets` (0070) is a person's own
-- record of which accounts they last posted to. Its four policies are self-row
-- (`user_id = app.current_user_id() AND app.is_workspace_member(workspace_id)`),
-- so a browser session can only ever write its own row in a workspace it belongs
-- to, and forgetting has to stay available without a round trip through the API.
-- A new name may join this list only with the same kind of justification beside
-- it: a self-row policy and a reason the write cannot travel through the
-- application service.
DO $$
DECLARE
  writable text[];
  browser_writable constant text[] := ARRAY['app.remembered_targets'];
BEGIN
  SELECT array_agg(format('%s.%s', n.nspname, c.relname) ORDER BY n.nspname, c.relname)
    INTO writable
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r', 'p')
    AND n.nspname IN ('app', 'private')
    AND format('%s.%s', n.nspname, c.relname) <> ALL (browser_writable)
    AND (
      has_table_privilege('authenticated', c.oid, 'INSERT')
      OR has_table_privilege('authenticated', c.oid, 'UPDATE')
      OR has_table_privilege('authenticated', c.oid, 'DELETE')
    );

  IF writable IS NOT NULL THEN
    RAISE EXCEPTION
      'authenticated holds a write grant on: %. The Data API surface is read-only.',
      array_to_string(writable, ', ');
  END IF;
END
$$;

-- 0072_assert_rls_complete.sql runs before this file and is meant to be the last
-- word on completeness. This migration adds no table, but it does change who can
-- reach them, so the assertion is repeated here rather than assumed.
SELECT private.assert_rls_complete();
