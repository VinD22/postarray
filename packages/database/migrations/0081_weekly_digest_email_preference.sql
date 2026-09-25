-- 0081_weekly_digest_email_preference.sql
--
-- The weekly summary email, as a per-workspace preference.
--
-- The digest itself is always built and always shown in the app. This column
-- only decides whether the stored, non-narrative rows of a finished week are
-- also mailed. Default on, matching `digest.settings.description`. An owner or
-- admin changes it in Settings, and the change is audited by the application.
--
-- No new table, so RLS coverage is unchanged: `app.workspaces` is already
-- enabled, forced and policied.

ALTER TABLE app.workspaces
  ADD COLUMN IF NOT EXISTS weekly_digest_email_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN app.workspaces.weekly_digest_email_enabled IS
  'When false the weekly digest is still built and shown in the app, but no summary email is sent.';
