-- 0065_webhook_signing_secret_envelope.sql
--
-- Complete the outbound webhook signing-secret envelope. Rows written before
-- this migration remain envelope_version = 0 and must be rotated before
-- delivery. New rows are envelope_version = 1 with the same AES-256-GCM shape
-- as provider credentials. AAD is stored as JSON so a copied ciphertext cannot
-- be rebound to another workspace or endpoint.

ALTER TABLE private.webhook_endpoints
  ADD COLUMN IF NOT EXISTS secret_auth_tag bytea,
  ADD COLUMN IF NOT EXISTS secret_wrapped_data_key bytea,
  ADD COLUMN IF NOT EXISTS secret_aad_context jsonb,
  ADD COLUMN IF NOT EXISTS secret_envelope_version integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS algorithm text NOT NULL DEFAULT 'AES-256-GCM',
  ADD COLUMN IF NOT EXISTS previous_secret_ciphertext bytea,
  ADD COLUMN IF NOT EXISTS previous_secret_nonce bytea,
  ADD COLUMN IF NOT EXISTS previous_secret_auth_tag bytea,
  ADD COLUMN IF NOT EXISTS previous_secret_wrapped_data_key bytea,
  ADD COLUMN IF NOT EXISTS previous_secret_key_version text,
  ADD COLUMN IF NOT EXISTS previous_secret_aad_context jsonb,
  ADD COLUMN IF NOT EXISTS previous_secret_envelope_version integer,
  ADD COLUMN IF NOT EXISTS previous_secret_expires_at timestamptz(6);

ALTER TABLE private.webhook_endpoints
  DROP CONSTRAINT IF EXISTS webhook_endpoints_secret_envelope_version,
  DROP CONSTRAINT IF EXISTS webhook_endpoints_secret_envelope_shape,
  DROP CONSTRAINT IF EXISTS webhook_endpoints_previous_secret_envelope_shape;

ALTER TABLE private.webhook_endpoints
  ADD CONSTRAINT webhook_endpoints_secret_envelope_version
  CHECK (secret_envelope_version IN (0, 1));

ALTER TABLE private.webhook_endpoints
  ADD CONSTRAINT webhook_endpoints_secret_envelope_shape
  CHECK (
    secret_envelope_version = 0
    OR (
      secret_envelope_version = 1
      AND algorithm = 'AES-256-GCM'
      AND key_version ~ '^[1-9][0-9]*$|^local-v[0-9]+$|^local-dev-v[0-9]+$'
      AND octet_length(secret_nonce) = 12
      AND secret_auth_tag IS NOT NULL
      AND octet_length(secret_auth_tag) = 16
      AND secret_wrapped_data_key IS NOT NULL
      AND octet_length(secret_wrapped_data_key) > 0
      AND secret_aad_context IS NOT NULL
    )
  );

ALTER TABLE private.webhook_endpoints
  ADD CONSTRAINT webhook_endpoints_previous_secret_envelope_shape
  CHECK (
    previous_secret_envelope_version IS NULL
    OR (
      previous_secret_envelope_version = 1
      AND previous_secret_ciphertext IS NOT NULL
      AND previous_secret_nonce IS NOT NULL
      AND octet_length(previous_secret_nonce) = 12
      AND previous_secret_auth_tag IS NOT NULL
      AND octet_length(previous_secret_auth_tag) = 16
      AND previous_secret_wrapped_data_key IS NOT NULL
      AND octet_length(previous_secret_wrapped_data_key) > 0
      AND previous_secret_aad_context IS NOT NULL
      AND previous_secret_expires_at IS NOT NULL
    )
  );

COMMENT ON COLUMN private.webhook_endpoints.secret_envelope_version IS
  '0 is a legacy row that must be rotated; 1 is the authenticated vault envelope.';

COMMENT ON COLUMN private.webhook_endpoints.previous_secret_expires_at IS
  'During rotation, signatures may verify with either secret until this instant.';
