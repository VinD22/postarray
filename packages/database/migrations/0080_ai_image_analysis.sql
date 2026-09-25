-- 0080_ai_image_analysis.sql
--
-- Image analysis, opt-in per workspace. Analysis only: a model describes an
-- image the workspace already owns so code can draft alt text and check crops,
-- readability and consent reminders. Nothing here generates, edits or extends
-- an image, and there is no column that could hold a generated one.
--
-- 1. `app.workspaces.ai_image_analysis_enabled`, default false. An owner or
--    admin turns it on in Settings. Until then no pixel leaves the product.
-- 2. `app.media_analyses`, one stored analysis per (workspace, asset checksum,
--    prompt version). The checksum rather than the asset id is the cache key,
--    so re-uploading the same file does not pay for a second call, and a new
--    prompt version is a new row rather than an overwrite.
--
-- This is a new table added after 0072_assert_rls_complete.sql, which is meant
-- to be the last word on completeness. RLS is enabled, forced and policied in
-- this same file, and the assertion is repeated at the end, exactly as 0073 to
-- 0077 do for the same reason.

-- ---------------------------------------------------------------------------
-- 1. The workspace setting.
-- ---------------------------------------------------------------------------

ALTER TABLE app.workspaces
  ADD COLUMN IF NOT EXISTS ai_image_analysis_enabled boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN app.workspaces.ai_image_analysis_enabled IS
  'Opt-in. When false no image is ever sent to an AI provider. Analysis only, never generation. Changed by an owner or admin.';

-- ---------------------------------------------------------------------------
-- 2. Stored analyses.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS app.media_analyses (
  id                    text        NOT NULL DEFAULT app.new_id('manalysis'),
  workspace_id          text        NOT NULL,
  media_asset_id        text        NOT NULL,
  asset_checksum_sha256 text        NOT NULL,
  prompt_id             text        NOT NULL DEFAULT 'media-understanding',
  prompt_version        text        NOT NULL,
  provider              text        NOT NULL,
  model                 text        NOT NULL,
  -- The schema-validated model output. Validated again on read: a row is data,
  -- and a prompt version change must never make an old row look current.
  result                jsonb       NOT NULL,
  input_tokens          integer     NOT NULL DEFAULT 0,
  output_tokens         integer     NOT NULL DEFAULT 0,
  cost_micros           bigint      NOT NULL DEFAULT 0,
  created_by_user_id    text,
  created_at            timestamptz(6) NOT NULL DEFAULT now(),

  CONSTRAINT media_analyses_pkey PRIMARY KEY (id),
  CONSTRAINT media_analyses_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES app.workspaces (id) ON DELETE CASCADE,
  CONSTRAINT media_analyses_media_asset_id_fkey
    FOREIGN KEY (media_asset_id) REFERENCES app.media_assets (id) ON DELETE CASCADE,
  CONSTRAINT media_analyses_checksum_shape
    CHECK (length(asset_checksum_sha256) BETWEEN 16 AND 128),
  CONSTRAINT media_analyses_prompt_version_shape
    CHECK (prompt_version ~ '^\d{4}-\d{2}-\d{2}\.\d+$'),
  CONSTRAINT media_analyses_result_is_object
    CHECK (jsonb_typeof(result) = 'object'),
  CONSTRAINT media_analyses_usage_nonnegative
    CHECK (input_tokens >= 0 AND output_tokens >= 0 AND cost_micros >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS media_analyses_cache_key
  ON app.media_analyses (workspace_id, asset_checksum_sha256, prompt_version);
CREATE INDEX IF NOT EXISTS media_analyses_workspace_id_idx
  ON app.media_analyses (workspace_id);
CREATE INDEX IF NOT EXISTS media_analyses_media_asset_id_idx
  ON app.media_analyses (media_asset_id);

COMMENT ON TABLE app.media_analyses IS
  'What a model saw in one user-owned image, cached per checksum and prompt version. Analysis only; no generated media is ever stored.';

-- ---------------------------------------------------------------------------
-- 3. Row level security. Standard tenant shape: any member reads, a writer
--    records an analysis, nobody edits one (a new prompt version is a new row),
--    and a writer may discard one.
-- ---------------------------------------------------------------------------

SELECT private.apply_tenant_policies(
  'app', 'media_analyses', 'workspace_id',
  'member', 'writer', 'none', 'writer',
  'Image analysis belongs to the workspace that owns the image. Rows are immutable once written.'
);

REVOKE ALL ON app.media_analyses FROM anon;
GRANT SELECT, INSERT, DELETE ON app.media_analyses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.media_analyses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.media_analyses TO relay_app;

SELECT private.assert_rls_complete();
