-- 0052_media_retention.sql
-- Uploaded bytes live for thirty days from upload. Text, receipts and audit
-- records are unaffected. Object deletion is retried until storage_deleted_at
-- is set, so a transient object-store error cannot silently orphan bytes.

ALTER TABLE app.media_assets
  ADD COLUMN IF NOT EXISTS retention_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS storage_deleted_at timestamptz;

UPDATE app.media_assets
SET retention_expires_at = created_at + interval '30 days'
WHERE retention_expires_at IS NULL;

ALTER TABLE app.media_assets
  ALTER COLUMN retention_expires_at SET NOT NULL;

CREATE INDEX media_assets_retention_cleanup_idx
  ON app.media_assets (retention_expires_at, storage_deleted_at);

COMMENT ON COLUMN app.media_assets.retention_expires_at IS
  'Object bytes are deleted after this instant. Metadata and publication receipts remain.';

COMMENT ON COLUMN app.media_assets.storage_deleted_at IS
  'Set only after object storage confirms deletion. NULL keeps the cleanup job retryable.';
