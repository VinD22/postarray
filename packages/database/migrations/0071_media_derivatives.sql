-- 0071_media_derivatives.sql
--
-- The non-generative media derivative pipeline.
--
-- The table, the DerivativeKind enum and the unique constraint on
-- (media_asset_id, preset_key) have existed since the reviewed core schema in
-- 0004. Nothing created a row until now. This migration adds only the
-- invariants Prisma cannot express, so the guarantees the application makes are
-- also true of anything that reaches the database another way.
--
-- The four claims being enforced:
--
-- 1. **The preset key is a checksum, not a label.** It is the SHA-256 of the
--    canonical operation list, so the same edit always addresses the same row.
--    That is what makes the pre-existing unique constraint do the idempotency
--    work: asking twice returns the first result and reprocesses nothing. A key
--    that is not 64 lowercase hex characters did not come from that function.
--
-- 2. **A derivative lives under its tenant's prefix.** Storage keys are
--    workspace scoped everywhere else in this schema; a derivative is a stored
--    object like any other and gets the same rule.
--
-- 3. **A derivative is real or it is absent.** Zero bytes, a zero edge or a
--    missing checksum would describe a file that is not there. Missing renders
--    as unavailable, never as a placeholder, so the row simply must not exist.
--
-- 4. **A derivative is an image.** Video transcoding is out of scope for V1, so
--    the `transcode` enum value stays unused and the MIME type is constrained
--    to the formats the image pipeline can actually write.
--
-- There is no generative anything in this feature: no model column, no prompt
-- column, no provider of that kind, and the `provider` column here is the
-- existing platform enum used for platform-specific presets, not a vendor of
-- imagery. Relay does not generate images or video (`AGENTS.md`, hard rule 3).
--
-- Retention: `media_derivatives.media_asset_id` already cascades from
-- `media_assets`, so a deleted asset takes its derivatives with it. The
-- retention sweep in the application removes each derivative object before it
-- removes the source object, so a purge cannot orphan bytes in the bucket.

ALTER TABLE app.media_derivatives
  DROP CONSTRAINT IF EXISTS media_derivatives_preset_key_is_checksum,
  ADD CONSTRAINT media_derivatives_preset_key_is_checksum
    CHECK (preset_key ~ '^[0-9a-f]{64}$'),

  DROP CONSTRAINT IF EXISTS media_derivatives_checksum_is_sha256,
  ADD CONSTRAINT media_derivatives_checksum_is_sha256
    CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'),

  -- The object belongs to the tenant that owns the source asset.
  DROP CONSTRAINT IF EXISTS media_derivatives_storage_key_is_workspace_scoped,
  ADD CONSTRAINT media_derivatives_storage_key_is_workspace_scoped
    CHECK (storage_key LIKE workspace_id || '/%'),

  -- A row is a claim that bytes exist. An empty one would be a false claim.
  DROP CONSTRAINT IF EXISTS media_derivatives_has_bytes,
  ADD CONSTRAINT media_derivatives_has_bytes
    CHECK (byte_size > 0),

  DROP CONSTRAINT IF EXISTS media_derivatives_dimensions_positive,
  ADD CONSTRAINT media_derivatives_dimensions_positive
    CHECK (
      (width IS NULL OR width > 0)
      AND (height IS NULL OR height > 0)
    ),

  -- V1 writes images only. `transcode` stays an unused enum value rather than a
  -- half-built promise, and the MIME type says the same thing at the row level.
  DROP CONSTRAINT IF EXISTS media_derivatives_image_only_v1,
  ADD CONSTRAINT media_derivatives_image_only_v1
    CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),

  DROP CONSTRAINT IF EXISTS media_derivatives_kind_is_non_generative,
  ADD CONSTRAINT media_derivatives_kind_is_non_generative
    CHECK (
      kind IN (
        'crop'::app.derivative_kind,
        'resize'::app.derivative_kind,
        'thumbnail'::app.derivative_kind,
        'format_conversion'::app.derivative_kind,
        'compressed'::app.derivative_kind
      )
    );

-- The retention sweep reads every derivative of one expiring asset. The unique
-- index on (media_asset_id, preset_key) already serves that lookup; this one
-- serves the tenant-wide read the library and the export path perform.
CREATE INDEX IF NOT EXISTS "media_derivatives_workspace_asset_idx"
  ON "app"."media_derivatives" ("workspace_id", "media_asset_id");

COMMENT ON COLUMN app.media_derivatives.preset_key IS
  'SHA-256 of the canonical, pipeline-ordered operation list. Same edit, same key, so the unique constraint on (media_asset_id, preset_key) is the idempotency mechanism.';

COMMENT ON TABLE app.media_derivatives IS
  'Non-generative outputs of a source asset: crop, rotate, resize, format conversion and compression. The source row is immutable and is never overwritten. Nothing here invents pixels.';
