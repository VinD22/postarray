-- 0063_credential_envelope_v1.sql
--
-- Complete the provider credential envelope without making old rows look
-- decryptable. Rows written by the original schema are retained as
-- envelope_version = 0 and are rejected by the application mapper. New rows
-- are envelope_version = 1 and carry an independent AES-256-GCM envelope for
-- each token. The AAD is stored as JSON so a copied ciphertext cannot be
-- silently rebound to another workspace or connection.

ALTER TABLE private.social_credentials
  ADD COLUMN IF NOT EXISTS access_token_auth_tag bytea,
  ADD COLUMN IF NOT EXISTS refresh_token_auth_tag bytea,
  ADD COLUMN IF NOT EXISTS refresh_token_wrapped_data_key bytea,
  ADD COLUMN IF NOT EXISTS access_token_aad_context jsonb,
  ADD COLUMN IF NOT EXISTS refresh_token_aad_context jsonb,
  ADD COLUMN IF NOT EXISTS envelope_version integer NOT NULL DEFAULT 0;

-- Bind a social OAuth attempt to the selected brand as well as its workspace.
-- The callback never gets to choose this value, and the composite foreign key
-- makes a cross-workspace brand reference impossible at the database layer.
ALTER TABLE private.oauth_transactions
  ADD COLUMN IF NOT EXISTS brand_id text;

CREATE UNIQUE INDEX IF NOT EXISTS uq_brands_workspace_id_id
  ON app.brands (workspace_id, id);

ALTER TABLE private.oauth_transactions
  DROP CONSTRAINT IF EXISTS oauth_transactions_workspace_brand_fkey;

ALTER TABLE private.oauth_transactions
  ADD CONSTRAINT oauth_transactions_workspace_brand_fkey
  FOREIGN KEY (workspace_id, brand_id)
  REFERENCES app.brands (workspace_id, id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE private.social_credentials
  ALTER COLUMN algorithm SET DEFAULT 'AES-256-GCM';

ALTER TABLE private.social_credentials
  DROP CONSTRAINT IF EXISTS social_credentials_envelope_version,
  DROP CONSTRAINT IF EXISTS social_credentials_envelope_shape;

ALTER TABLE private.social_credentials
  ADD CONSTRAINT social_credentials_envelope_version
  CHECK (envelope_version IN (0, 1));

ALTER TABLE private.social_credentials
  ADD CONSTRAINT social_credentials_envelope_shape
  CHECK (
    envelope_version = 0
    OR (
      envelope_version = 1
      AND algorithm = 'AES-256-GCM'
      AND key_version ~ '^[1-9][0-9]*$'
      AND octet_length(access_token_nonce) = 12
      AND access_token_auth_tag IS NOT NULL
      AND octet_length(access_token_auth_tag) = 16
      AND wrapped_data_key IS NOT NULL
      AND octet_length(wrapped_data_key) > 0
      AND access_token_aad_context IS NOT NULL
      AND (
        (
          refresh_token_ciphertext IS NULL
          AND refresh_token_nonce IS NULL
          AND refresh_token_auth_tag IS NULL
          AND refresh_token_wrapped_data_key IS NULL
          AND refresh_token_aad_context IS NULL
        )
        OR (
          refresh_token_ciphertext IS NOT NULL
          AND refresh_token_nonce IS NOT NULL
          AND octet_length(refresh_token_nonce) = 12
          AND refresh_token_auth_tag IS NOT NULL
          AND octet_length(refresh_token_auth_tag) = 16
          AND refresh_token_wrapped_data_key IS NOT NULL
          AND octet_length(refresh_token_wrapped_data_key) > 0
          AND refresh_token_aad_context IS NOT NULL
        )
      )
    )
  );

COMMENT ON COLUMN private.social_credentials.envelope_version IS
  '0 is a legacy row that must be reconnected; 1 is the authenticated vault envelope.';

COMMENT ON COLUMN private.social_credentials.access_token_aad_context IS
  'JSON AAD context: workspace_id, connection_id, provider and credential_kind. No secret material.';

COMMENT ON COLUMN private.social_credentials.refresh_token_aad_context IS
  'JSON AAD context: workspace_id, connection_id, provider and credential_kind. No secret material.';

COMMENT ON COLUMN private.oauth_transactions.brand_id IS
  'Optional brand selected before OAuth. The composite foreign key binds it to the transaction workspace.';
