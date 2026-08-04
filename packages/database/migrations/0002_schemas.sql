-- 0002_schemas.sql
--
-- The two-schema split.
--
--   app      Tenant data that a browser may read through the Data API, always
--            through row level security. Read-mostly from the client; every
--            write of consequence still goes through the application service.
--
--   private  Credentials, billing, OAuth and audit. Never exposed. `anon` and
--            `authenticated` hold no privilege here at all, so a policy mistake
--            on one table cannot leak a token: the role cannot even see the
--            schema.
--
-- Supabase does not auto-expose new tables to the Data API and we rely on that.
-- Nothing in this file grants a blanket privilege on future objects to a client
-- role. Table-level GRANTs for `app` are issued explicitly in
-- `0020_rls_policies.sql`, next to the policy that constrains them.

CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS private;

COMMENT ON SCHEMA app IS
  'Tenant data reachable by browser clients under row level security.';
COMMENT ON SCHEMA private IS
  'Credentials, billing, OAuth and audit. Service role only. Never exposed.';

-- ---------------------------------------------------------------------------
-- Roles.
--
-- Supabase provides anon / authenticated / service_role. A plain Postgres
-- container does not, so create them if missing. NOLOGIN: they are assumed by
-- the connection pooler or by SET ROLE, never logged into directly.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    -- BYPASSRLS is deliberately NOT granted. The service role is constrained by
    -- explicit policies too, so a bug in a server-side query cannot silently
    -- cross a tenant boundary. See docs/security/rls-model.md.
    CREATE ROLE service_role NOLOGIN NOINHERIT;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- `app`: usage only. No privileges on tables are granted here.
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA app TO anon, authenticated, service_role;

-- Future tables in `app` get nothing by default. Every grant is written by hand
-- beside its policy, so adding a table cannot accidentally publish it.
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA app REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

REVOKE ALL ON ALL TABLES IN SCHEMA app FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA app FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- `private`: revoke everything from every client role, including USAGE.
-- ---------------------------------------------------------------------------

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA private FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA private FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON SEQUENCES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA private REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

GRANT USAGE ON SCHEMA private TO service_role;

-- ---------------------------------------------------------------------------
-- `public` is not part of the product surface. Keep it empty and closed.
-- ---------------------------------------------------------------------------

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
