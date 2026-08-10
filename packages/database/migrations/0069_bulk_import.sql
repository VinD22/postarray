-- 0069_bulk_import.sql
--
-- Bulk CSV import: invariants and tenant policies.
--
-- Table DDL lives in the reviewed core schema (0004), as it does for every
-- other table. This migration adds what Prisma cannot express and what a
-- reviewer needs to be able to read in one place.
--
-- Four invariants are the point of the feature:
--
--   1. Uploading the same file twice resolves to the same job. A unique index
--      on (workspace_id, manifest_checksum) is what makes that a guarantee
--      rather than a race the application usually wins.
--   2. A row is idempotent inside its job. (bulk_import_job_id,
--      external_row_key) is unique, so re-applying a job finds the row that
--      already produced a draft instead of producing a second one.
--   3. Applying is a deliberate, separate act. A job may only carry an
--      apply mode and an applied instant together, and the mode is one of two
--      named values. There is no third mode that publishes.
--   4. Errors are evidence. `issues` is always a JSON array of sanitized ICU
--      objects and `payload` is always an object or absent, so nothing can
--      quietly store a provider response or a stack trace where a person will
--      read it.

-- ---------------------------------------------------------------------------
-- Import jobs
-- ---------------------------------------------------------------------------

ALTER TABLE app.bulk_import_jobs
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_requested_by_user_id_fkey,
  ADD CONSTRAINT bulk_import_jobs_requested_by_user_id_fkey
    FOREIGN KEY (requested_by_user_id) REFERENCES app.users(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_applied_by_user_id_fkey,
  ADD CONSTRAINT bulk_import_jobs_applied_by_user_id_fkey
    FOREIGN KEY (applied_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_state_supported,
  ADD CONSTRAINT bulk_import_jobs_state_supported
    CHECK (state IN ('uploaded', 'validating', 'validated', 'applying', 'applied', 'failed')),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_apply_mode_supported,
  ADD CONSTRAINT bulk_import_jobs_apply_mode_supported
    CHECK (apply_mode IS NULL OR apply_mode IN ('drafts', 'scheduled')),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_apply_is_deliberate,
  ADD CONSTRAINT bulk_import_jobs_apply_is_deliberate
    CHECK ((apply_mode IS NULL) = (applied_at IS NULL)),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_checksum_shape,
  ADD CONSTRAINT bulk_import_jobs_checksum_shape
    CHECK (manifest_checksum ~ '^[0-9a-f]{64}$'),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_error_report_checksum_shape,
  ADD CONSTRAINT bulk_import_jobs_error_report_checksum_shape
    CHECK (error_report_checksum IS NULL OR error_report_checksum ~ '^[0-9a-f]{64}$'),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_parser_version_present,
  ADD CONSTRAINT bulk_import_jobs_parser_version_present
    CHECK (length(parser_version) > 0),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_filename_present,
  ADD CONSTRAINT bulk_import_jobs_filename_present
    CHECK (length(filename) > 0 AND length(filename) <= 255),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_byte_size_nonnegative,
  ADD CONSTRAINT bulk_import_jobs_byte_size_nonnegative
    CHECK (byte_size >= 0),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_counts_nonnegative,
  ADD CONSTRAINT bulk_import_jobs_counts_nonnegative
    CHECK (
      (row_count IS NULL OR row_count >= 0)
      AND (valid_row_count IS NULL OR valid_row_count >= 0)
      AND (invalid_row_count IS NULL OR invalid_row_count >= 0)
      AND (applied_row_count IS NULL OR applied_row_count >= 0)
      AND (failed_row_count IS NULL OR failed_row_count >= 0)
      AND (skipped_row_count IS NULL OR skipped_row_count >= 0)
    ),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_options_is_object,
  ADD CONSTRAINT bulk_import_jobs_options_is_object
    CHECK (jsonb_typeof(options) = 'object'),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_columns_report_is_object,
  ADD CONSTRAINT bulk_import_jobs_columns_report_is_object
    CHECK (jsonb_typeof(columns_report) = 'object'),
  DROP CONSTRAINT IF EXISTS bulk_import_jobs_manifest_issues_is_array,
  ADD CONSTRAINT bulk_import_jobs_manifest_issues_is_array
    CHECK (jsonb_typeof(manifest_issues) = 'array');

-- The same bytes uploaded twice are the same job. Without this, two tabs and
-- one impatient person are two sets of drafts.
DROP INDEX IF EXISTS app.bulk_import_jobs_workspace_manifest_key;
CREATE UNIQUE INDEX bulk_import_jobs_workspace_manifest_key
  ON app.bulk_import_jobs (workspace_id, manifest_checksum);

DROP INDEX IF EXISTS app.bulk_import_jobs_workspace_idempotency_key;
CREATE UNIQUE INDEX bulk_import_jobs_workspace_idempotency_key
  ON app.bulk_import_jobs (workspace_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

DROP INDEX IF EXISTS app.bulk_import_jobs_workspace_id_idx;
CREATE INDEX bulk_import_jobs_workspace_id_idx
  ON app.bulk_import_jobs (workspace_id);

DROP INDEX IF EXISTS app.bulk_import_jobs_workspace_brand_state_idx;
CREATE INDEX bulk_import_jobs_workspace_brand_state_idx
  ON app.bulk_import_jobs (workspace_id, brand_id, state);

COMMENT ON COLUMN app.bulk_import_jobs.apply_mode IS
  'NULL until a person applies. Drafts or scheduled. There is no mode that publishes.';
COMMENT ON COLUMN app.bulk_import_jobs.row_count IS
  'NULL means not counted yet. Zero means the file had no rows. They are different answers.';
COMMENT ON INDEX app.bulk_import_jobs_workspace_manifest_key IS
  'The same manifest uploaded twice resolves to the first job instead of duplicating its rows.';

-- ---------------------------------------------------------------------------
-- Import rows
-- ---------------------------------------------------------------------------

ALTER TABLE app.bulk_import_rows
  DROP CONSTRAINT IF EXISTS bulk_import_rows_content_item_id_fkey,
  ADD CONSTRAINT bulk_import_rows_content_item_id_fkey
    FOREIGN KEY (content_item_id) REFERENCES app.content_items(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS bulk_import_rows_publish_job_id_fkey,
  ADD CONSTRAINT bulk_import_rows_publish_job_id_fkey
    FOREIGN KEY (publish_job_id) REFERENCES app.publish_jobs(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS bulk_import_rows_state_supported,
  ADD CONSTRAINT bulk_import_rows_state_supported
    CHECK (state IN ('pending', 'valid', 'invalid', 'applied', 'skipped', 'failed')),
  DROP CONSTRAINT IF EXISTS bulk_import_rows_line_number_positive,
  ADD CONSTRAINT bulk_import_rows_line_number_positive
    CHECK (line_number > 0),
  DROP CONSTRAINT IF EXISTS bulk_import_rows_key_present,
  ADD CONSTRAINT bulk_import_rows_key_present
    CHECK (length(external_row_key) > 0 AND length(external_row_key) <= 200),
  DROP CONSTRAINT IF EXISTS bulk_import_rows_issues_is_array,
  ADD CONSTRAINT bulk_import_rows_issues_is_array
    CHECK (jsonb_typeof(issues) = 'array'),
  DROP CONSTRAINT IF EXISTS bulk_import_rows_payload_is_object,
  ADD CONSTRAINT bulk_import_rows_payload_is_object
    CHECK (payload IS NULL OR jsonb_typeof(payload) = 'object'),
  DROP CONSTRAINT IF EXISTS bulk_import_rows_validation_is_object,
  ADD CONSTRAINT bulk_import_rows_validation_is_object
    CHECK (validation IS NULL OR jsonb_typeof(validation) = 'object'),
  -- An applied row must be able to show what it produced. A row that claims to
  -- have been applied with nothing to point at is the failure mode this whole
  -- feature exists to avoid.
  DROP CONSTRAINT IF EXISTS bulk_import_rows_applied_has_evidence,
  ADD CONSTRAINT bulk_import_rows_applied_has_evidence
    CHECK (state <> 'applied' OR (content_item_id IS NOT NULL AND applied_at IS NOT NULL));

-- The per-row idempotency boundary. Re-applying a job is safe because of this.
DROP INDEX IF EXISTS app.bulk_import_rows_job_external_key;
CREATE UNIQUE INDEX bulk_import_rows_job_external_key
  ON app.bulk_import_rows (bulk_import_job_id, external_row_key);

DROP INDEX IF EXISTS app.bulk_import_rows_workspace_id_idx;
CREATE INDEX bulk_import_rows_workspace_id_idx
  ON app.bulk_import_rows (workspace_id);

DROP INDEX IF EXISTS app.bulk_import_rows_job_state_idx;
CREATE INDEX bulk_import_rows_job_state_idx
  ON app.bulk_import_rows (bulk_import_job_id, state);

COMMENT ON INDEX app.bulk_import_rows_job_external_key IS
  'One row key, one outcome. Re-applying a job finds the existing draft instead of creating a second.';

-- ---------------------------------------------------------------------------
-- The evidence a row carries is append-only in the ways that matter.
--
-- A row may move forward through its states and pick up the draft and publish
-- job it produced. It may never be rewritten to point at a different draft,
-- because that would silently reassign a spreadsheet line to someone else's
-- post, and it may never change the line or the key it was created with.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.freeze_bulk_import_row_evidence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, app
AS $$
BEGIN
  IF NEW.workspace_id IS DISTINCT FROM OLD.workspace_id
    OR NEW.bulk_import_job_id IS DISTINCT FROM OLD.bulk_import_job_id
    OR NEW.external_row_key IS DISTINCT FROM OLD.external_row_key
    OR NEW.line_number IS DISTINCT FROM OLD.line_number THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'bulk import row identity is immutable',
      DETAIL = 'The job, the row key and the line a row was read from cannot be rewritten.',
      HINT = 'Upload a corrected manifest instead of editing a row in place.';
  END IF;

  IF OLD.content_item_id IS NOT NULL AND NEW.content_item_id IS DISTINCT FROM OLD.content_item_id THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'bulk import row already points at a draft',
      DETAIL = 'A row keeps the draft it created, so re-applying can never reassign it.',
      HINT = 'Delete the draft if it is unwanted. The row records what it produced.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bulk_import_rows_freeze_evidence ON app.bulk_import_rows;

CREATE TRIGGER bulk_import_rows_freeze_evidence
BEFORE UPDATE ON app.bulk_import_rows
FOR EACH ROW
EXECUTE FUNCTION app.freeze_bulk_import_row_evidence();

COMMENT ON FUNCTION app.freeze_bulk_import_row_evidence() IS
  'A manifest line keeps the draft it produced, whatever a later apply attempt does.';

-- ---------------------------------------------------------------------------
-- Tenant policies. Same row format as 0020_rls_policies.sql:
--
--   schema, table, ws column, sel, ins, upd, del, rationale
--
-- Both tables are written only by the application service, which is where
-- authorization, the checksum lookup, the per-row idempotency and the audit
-- append live. A browser session reads its own workspace's jobs and rows and
-- creates neither, because a job created outside the service would carry no
-- parse result and no evidence of who asked for it.
-- ---------------------------------------------------------------------------

SELECT private.apply_tenant_policies(
  'app', 'bulk_import_jobs', 'workspace_id',
  'member', 'service', 'service', 'admin',
  'An import job is evidence of an upload and of an apply decision. The service mints it; an administrator may delete one along with its rows.'
);

SELECT private.apply_tenant_policies(
  'app', 'bulk_import_rows', 'workspace_id',
  'member', 'service', 'service', 'admin',
  'A row records what one manifest line became. Only the application service writes one, so the draft it points at is always something the service actually created.'
);
