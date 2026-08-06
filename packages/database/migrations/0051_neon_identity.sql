-- 0051_neon_identity.sql
-- Neon Auth is based on Better Auth, whose user identifiers are opaque strings
-- rather than UUIDs. Relay user and workspace ids remain UUIDs.

ALTER TABLE app.users
  ALTER COLUMN auth_subject_id TYPE text
  USING auth_subject_id::text;

COMMENT ON COLUMN app.users.auth_subject_id IS
  'Opaque Neon Auth / Better Auth user id. Never parsed or exposed as a Relay id.';

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

  SELECT u.id INTO resolved
  FROM app.users u
  WHERE u.auth_subject_id = auth_subject
    AND u.status = 'active'::app.user_status;

  RETURN resolved;
END;
$$;

COMMENT ON FUNCTION app.current_user_id() IS
  'Relay user id resolved from a direct Relay claim or opaque Neon Auth subject. NULL denies tenant policies.';
