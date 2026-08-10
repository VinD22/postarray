-- Persist workspace localization choices used by every surface. The defaults
-- preserve the behaviour of existing tenants while making missing preference
-- data explicit rather than reconstructing it in the browser.

ALTER TABLE app.workspaces
  ADD COLUMN IF NOT EXISTS content_locales TEXT[] NOT NULL DEFAULT ARRAY['en']::TEXT[],
  ADD COLUMN IF NOT EXISTS markets TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS week_start INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS hour_cycle TEXT NOT NULL DEFAULT 'h23';

ALTER TABLE app.workspaces
  ADD CONSTRAINT workspaces_content_locales_not_empty
    CHECK (cardinality(content_locales) > 0),
  ADD CONSTRAINT workspaces_week_start_valid
    CHECK (week_start IN (0, 1, 6)),
  ADD CONSTRAINT workspaces_hour_cycle_valid
    CHECK (hour_cycle IN ('h12', 'h23'));
