-- 0082_media_analyses_same_workspace_asset.sql
--
-- 0080 tied `app.media_analyses.media_asset_id` to `app.media_assets (id)`
-- alone, so the database accepted an analysis in workspace A that pointed at
-- an asset owned by workspace B. Application traffic runs as service_role,
-- which RLS does not narrow, so nothing below the application layer refused
-- it. This replaces that key with a composite one: an analysis can only name
-- an asset of its own workspace.
--
-- A row that already crosses workspaces is not silently dropped: the
-- migration fails and names the count, so a human looks at it first.

DO $$
DECLARE
  crossing bigint;
BEGIN
  SELECT count(*) INTO crossing
    FROM app.media_analyses ma
    JOIN app.media_assets a ON a.id = ma.media_asset_id
   WHERE a.workspace_id <> ma.workspace_id;
  IF crossing > 0 THEN
    RAISE EXCEPTION '0082: % media_analyses row(s) reference an asset of another workspace', crossing;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_media_assets_workspace_id_id
  ON app.media_assets (workspace_id, id);

ALTER TABLE app.media_analyses
  DROP CONSTRAINT IF EXISTS media_analyses_media_asset_id_fkey,
  DROP CONSTRAINT IF EXISTS media_analyses_workspace_media_asset_fkey;

ALTER TABLE app.media_analyses
  ADD CONSTRAINT media_analyses_workspace_media_asset_fkey
  FOREIGN KEY (workspace_id, media_asset_id)
  REFERENCES app.media_assets (workspace_id, id)
  ON DELETE CASCADE;

DROP INDEX IF EXISTS app.media_analyses_media_asset_id_idx;
CREATE INDEX IF NOT EXISTS media_analyses_workspace_media_asset_idx
  ON app.media_analyses (workspace_id, media_asset_id);
