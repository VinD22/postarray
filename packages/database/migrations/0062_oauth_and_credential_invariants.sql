-- 0062_oauth_and_credential_invariants.sql
--
-- OAuth state and provider credentials are security boundaries. These checks
-- make malformed state, an impossible PKCE pairing, an expired-before-created
-- transaction and a cross-workspace credential relation impossible even when a
-- caller bypasses the application service.

ALTER TABLE private.oauth_transactions
  DROP CONSTRAINT IF EXISTS oauth_transactions_state_hash_format;

ALTER TABLE private.oauth_transactions
  ADD CONSTRAINT oauth_transactions_state_hash_format
  CHECK (state_hash ~ '^[0-9a-f]{64}$');

ALTER TABLE private.oauth_transactions
  DROP CONSTRAINT IF EXISTS oauth_transactions_pkce_pairing;

ALTER TABLE private.oauth_transactions
  ADD CONSTRAINT oauth_transactions_pkce_pairing
  CHECK (
    (code_challenge IS NULL AND code_challenge_method IS NULL)
    OR (
      code_challenge ~ '^[A-Za-z0-9_-]{43,128}$'
      AND code_challenge_method = 'S256'
    )
  );

ALTER TABLE private.oauth_transactions
  DROP CONSTRAINT IF EXISTS oauth_transactions_expiry_after_creation;

ALTER TABLE private.oauth_transactions
  ADD CONSTRAINT oauth_transactions_expiry_after_creation
  CHECK (expires_at > created_at);

ALTER TABLE private.oauth_transactions
  DROP CONSTRAINT IF EXISTS oauth_transactions_consumed_after_creation;

ALTER TABLE private.oauth_transactions
  ADD CONSTRAINT oauth_transactions_consumed_after_creation
  CHECK (consumed_at IS NULL OR consumed_at >= created_at);

CREATE UNIQUE INDEX IF NOT EXISTS uq_social_connections_workspace_id_id
  ON app.social_connections (workspace_id, id);

ALTER TABLE private.social_credentials
  DROP CONSTRAINT IF EXISTS social_credentials_workspace_connection_fkey;

ALTER TABLE private.social_credentials
  ADD CONSTRAINT social_credentials_workspace_connection_fkey
  FOREIGN KEY (workspace_id, connection_id)
  REFERENCES app.social_connections (workspace_id, id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

COMMENT ON CONSTRAINT social_credentials_workspace_connection_fkey
  ON private.social_credentials IS
  'A provider credential must belong to the same workspace as its social connection.';
