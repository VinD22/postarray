-- 0053_media_declarations.sql
-- Preserve the human reason and attribution for an explicit alt-text waiver.
-- Rights declarations already have a durable enum and note field; these two
-- columns close the equivalent audit gap for accessibility decisions.

ALTER TABLE app.media_assets
  ADD COLUMN alt_text_waived_reason text,
  ADD COLUMN alt_text_waived_by_name text;

COMMENT ON COLUMN app.media_assets.alt_text_waived_reason IS
  'Human explanation recorded when alt text is explicitly waived.';

COMMENT ON COLUMN app.media_assets.alt_text_waived_by_name IS
  'Display-name snapshot of the actor who waived alt text. Internal actor IDs remain in audit events.';
