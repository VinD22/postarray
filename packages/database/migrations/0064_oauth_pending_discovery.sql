-- 0064_oauth_pending_discovery.sql
-- Table definition lives in 0004_core_schema.sql. This migration adds the
-- composite brand binding and envelope invariants Prisma cannot express alone.

ALTER TABLE private.oauth_pending_discoveries
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_brand_fkey;

ALTER TABLE private.oauth_pending_discoveries
  ADD CONSTRAINT oauth_pending_discoveries_brand_fkey
  FOREIGN KEY (workspace_id, brand_id)
  REFERENCES app.brands (workspace_id, id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE private.oauth_pending_discoveries
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_envelope_version,
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_grant_key_version,
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_nonce_len,
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_auth_tag_len,
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_expiry_after_creation,
  DROP CONSTRAINT IF EXISTS oauth_pending_discoveries_consumed_after_creation;

ALTER TABLE private.oauth_pending_discoveries
  ADD CONSTRAINT oauth_pending_discoveries_envelope_version
  CHECK (grant_envelope_version = 1),
  ADD CONSTRAINT oauth_pending_discoveries_grant_key_version
  CHECK (grant_key_version ~ '^[1-9][0-9]*$'),
  ADD CONSTRAINT oauth_pending_discoveries_nonce_len
  CHECK (octet_length(grant_nonce) = 12),
  ADD CONSTRAINT oauth_pending_discoveries_auth_tag_len
  CHECK (octet_length(grant_auth_tag) = 16),
  ADD CONSTRAINT oauth_pending_discoveries_expiry_after_creation
  CHECK (expires_at > created_at),
  ADD CONSTRAINT oauth_pending_discoveries_consumed_after_creation
  CHECK (consumed_at IS NULL OR consumed_at >= created_at);

COMMENT ON TABLE private.oauth_pending_discoveries IS
  'Two-phase OAuth: provider code exchanged once; user selects accounts before connections are created.';
