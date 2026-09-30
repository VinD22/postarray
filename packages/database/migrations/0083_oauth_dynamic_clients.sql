-- 0083_oauth_dynamic_clients.sql
--
-- Dynamic client registration (RFC 7591) for public MCP clients such as
-- Claude. A dynamically registered client asserts its own name and belongs to
-- no workspace: it is created before any person has signed in, and it only
-- ever acts through a grant a signed-in person approves in their own
-- workspace. The grant row (`private.oauth_grants`) stays workspace owned and
-- keeps its foreign key to this table, which is why the client needs a row at
-- all.
--
-- A managed client (created from Settings, Developer apps) keeps its owning
-- workspace and creator. The check below makes the two shapes exclusive, so a
-- dynamic client can never carry a secret and a managed one can never lose its
-- owner.

ALTER TABLE private.oauth_clients
  ALTER COLUMN workspace_id DROP NOT NULL;

ALTER TABLE private.oauth_clients
  ALTER COLUMN created_by_user_id DROP NOT NULL;

ALTER TABLE private.oauth_clients
  ADD COLUMN IF NOT EXISTS registration TEXT NOT NULL DEFAULT 'managed';

ALTER TABLE private.oauth_clients
  ADD CONSTRAINT oauth_clients_registration_kind
  CHECK (registration IN ('managed', 'dynamic'));

ALTER TABLE private.oauth_clients
  ADD CONSTRAINT oauth_clients_registration_shape
  CHECK (
    (registration = 'managed' AND workspace_id IS NOT NULL AND created_by_user_id IS NOT NULL)
    OR (
      registration = 'dynamic'
      AND workspace_id IS NULL
      AND created_by_user_id IS NULL
      AND client_type = 'public'
      AND secret_hash IS NULL
    )
  );

COMMENT ON COLUMN private.oauth_clients.registration IS
  'managed: created by a workspace member. dynamic: self-registered public client (RFC 7591); its name is self-asserted.';
