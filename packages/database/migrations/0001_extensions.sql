-- 0001_extensions.sql
--
-- Extensions Relay depends on. Installed into `extensions` when that schema
-- already exists (Supabase creates it), otherwise into `public`, so the same
-- file runs on a bare Postgres 16 container and on Supabase.
--
-- pgcrypto: entropy for sortable prefixed ids and digest() for hashing in
--           migrations.
-- citext:   case-insensitive email, slug and handle columns so uniqueness is
--           decided the same way a human would decide it.

DO $$
DECLARE
  target_schema text;
BEGIN
  SELECT CASE
           WHEN EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'extensions')
             THEN 'extensions'
           ELSE 'public'
         END
    INTO target_schema;

  EXECUTE format('CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA %I', target_schema);
  EXECUTE format('CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA %I', target_schema);
END
$$;

-- Make the extension schema resolvable for every session on this database so
-- pgcrypto functions resolve without qualification.
DO $$
DECLARE
  current_db text := current_database();
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'extensions') THEN
    EXECUTE format(
      'ALTER DATABASE %I SET search_path = "$user", public, extensions',
      current_db
    );
  END IF;
END
$$;
