-- 0030_constraints.sql
--
-- Invariants the ORM cannot hold.
--
-- Everything here protects a promise the product makes to a user: the thing you
-- approved is the thing that published, and the receipt of what published is
-- not editable afterwards.

-- ---------------------------------------------------------------------------
-- 1. A publish that requires approval cannot be scheduled before it is approved.
--
-- The column-level part is a real CHECK: a job whose policy is anything other
-- than `none` must point at an approval request. The cross-row part, that the
-- request is actually resolved and resolved no later than the execution
-- instant, needs another table and therefore a constraint trigger.
-- ---------------------------------------------------------------------------

ALTER TABLE app.publish_jobs
  DROP CONSTRAINT IF EXISTS publish_jobs_approval_required_has_request;

ALTER TABLE app.publish_jobs
  ADD CONSTRAINT publish_jobs_approval_required_has_request
  CHECK (
    approval_policy = 'none'::app.approval_policy
    OR approval_request_id IS NOT NULL
  );

COMMENT ON CONSTRAINT publish_jobs_approval_required_has_request ON app.publish_jobs IS
  'A job under any approval policy other than none must reference the approval request that authorized it.';

CREATE OR REPLACE FUNCTION app.enforce_approval_before_schedule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = app, pg_catalog, pg_temp
AS $$
DECLARE
  req_state       app.approval_state;
  req_resolved_at timestamptz;
  req_workspace   uuid;
  req_version     uuid;
BEGIN
  IF NEW.approval_policy = 'none'::app.approval_policy THEN
    RETURN NEW;
  END IF;

  SELECT r.state, r.resolved_at, r.workspace_id, r.content_version_id
    INTO req_state, req_resolved_at, req_workspace, req_version
  FROM app.approval_requests r
  WHERE r.id = NEW.approval_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'publish_job %: approval policy % requires an existing approval request',
      NEW.id, NEW.approval_policy
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  -- Tenancy is checked here too. A foreign key alone would happily let a job in
  -- one workspace point at an approval granted in another.
  IF req_workspace <> NEW.workspace_id THEN
    RAISE EXCEPTION
      'publish_job %: approval request belongs to a different workspace',
      NEW.id
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  -- The approval must be for the exact immutable version being published.
  IF req_version <> NEW.content_version_id THEN
    RAISE EXCEPTION
      'publish_job %: approval was granted for a different content version, reapproval is required',
      NEW.id
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  IF req_state <> 'approved'::app.approval_state OR req_resolved_at IS NULL THEN
    RAISE EXCEPTION
      'publish_job %: approval request is % and has not been resolved',
      NEW.id, req_state
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  IF NEW.scheduled_for < req_resolved_at THEN
    RAISE EXCEPTION
      'publish_job %: scheduled_for % precedes approval at %',
      NEW.id, NEW.scheduled_for, req_resolved_at
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS publish_jobs_approval_before_schedule ON app.publish_jobs;
CREATE TRIGGER publish_jobs_approval_before_schedule
  BEFORE INSERT OR UPDATE OF scheduled_for, approval_policy, approval_request_id, content_version_id
  ON app.publish_jobs
  FOR EACH ROW
  EXECUTE FUNCTION app.enforce_approval_before_schedule();

COMMENT ON FUNCTION app.enforce_approval_before_schedule() IS
  'Rejects a scheduled publish whose approval is missing, granted for another version or another tenant, or granted after the execution instant.';

-- ---------------------------------------------------------------------------
-- 2. Content versions are immutable.
--
-- Every publish attempt and every receipt references a content version, and the
-- receipt records its hash. If a version could be edited, an approved post could
-- be changed after the fact and the audit trail would be fiction.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.reject_content_version_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = app, pg_catalog, pg_temp
AS $$
BEGIN
  RAISE EXCEPTION
    'content_versions is append only: version % of content item % cannot be modified, create a new version instead',
    OLD.version, OLD.content_item_id
    USING ERRCODE = 'integrity_constraint_violation';
END;
$$;

-- UPDATE only. DELETE is handled by RLS, which has no DELETE policy on this
-- table, so no role can remove a version directly. Referential cascades from a
-- deleted content item or a deleted workspace are exempt from RLS and must stay
-- exempt, otherwise the account-deletion workflow could never finish. Guarding
-- DELETE here as well would block exactly that legitimate path.
DROP TRIGGER IF EXISTS content_versions_immutable ON app.content_versions;
CREATE TRIGGER content_versions_immutable
  BEFORE UPDATE ON app.content_versions
  FOR EACH ROW
  EXECUTE FUNCTION app.reject_content_version_mutation();

COMMENT ON FUNCTION app.reject_content_version_mutation() IS
  'Content versions are append only. Editing means creating the next version, which is what forces reapproval.';

-- ---------------------------------------------------------------------------
-- 3. Publication receipts are immutable evidence.
--
-- Two columns are bookkeeping rather than evidence and may move forward:
--   last_analytics_sync_at   set by the analytics worker
--   deleted_externally_at    set once when the provider reports the post gone
-- Everything else is frozen, including the content hash and the permalink.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.reject_receipt_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = app, pg_catalog, pg_temp
AS $$
BEGIN
  IF ROW(
       NEW.workspace_id, NEW.publish_job_id, NEW.content_version_id, NEW.connection_id,
       NEW.provider, NEW.external_post_id, NEW.permalink, NEW.content_hash,
       NEW.media_checksums, NEW.published_short_links, NEW.published_at,
       NEW.dispatched_at, NEW.scheduled_for, NEW.scheduled_time_zone, NEW.surface,
       NEW.approved_by_user_id, NEW.approval_policy, NEW.cost_actual_minor,
       NEW.cost_currency, NEW.response_evidence, NEW.created_at
     ) IS DISTINCT FROM ROW(
       OLD.workspace_id, OLD.publish_job_id, OLD.content_version_id, OLD.connection_id,
       OLD.provider, OLD.external_post_id, OLD.permalink, OLD.content_hash,
       OLD.media_checksums, OLD.published_short_links, OLD.published_at,
       OLD.dispatched_at, OLD.scheduled_for, OLD.scheduled_time_zone, OLD.surface,
       OLD.approved_by_user_id, OLD.approval_policy, OLD.cost_actual_minor,
       OLD.cost_currency, OLD.response_evidence, OLD.created_at
     )
  THEN
    RAISE EXCEPTION
      'publication_receipts is immutable: only last_analytics_sync_at and deleted_externally_at may change'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  IF OLD.deleted_externally_at IS NOT NULL
     AND NEW.deleted_externally_at IS DISTINCT FROM OLD.deleted_externally_at THEN
    RAISE EXCEPTION
      'publication_receipts: deleted_externally_at is set once and never rewritten'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;

  RETURN NEW;
END;
$$;

-- UPDATE only, for the same reason as content_versions: DELETE is denied by the
-- absence of a DELETE policy, and referential cascades from account deletion
-- must remain able to complete.
DROP TRIGGER IF EXISTS publication_receipts_immutable ON app.publication_receipts;
CREATE TRIGGER publication_receipts_immutable
  BEFORE UPDATE ON app.publication_receipts
  FOR EACH ROW
  EXECUTE FUNCTION app.reject_receipt_mutation();

COMMENT ON FUNCTION app.reject_receipt_mutation() IS
  'A receipt is evidence that an external post exists. Only analytics bookkeeping columns may move.';

-- ---------------------------------------------------------------------------
-- 4. Smaller invariants that are cheap to state and expensive to discover late.
-- ---------------------------------------------------------------------------

-- A publish that has reached `published` must have produced a receipt. Enforced
-- as a deferred check at commit so the worker can write the two rows in either
-- order inside one transaction.
CREATE OR REPLACE FUNCTION app.enforce_published_has_receipt()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = app, pg_catalog, pg_temp
AS $$
BEGIN
  IF NEW.state = 'published'::app.publish_state
     AND NOT EXISTS (SELECT 1 FROM app.publication_receipts r WHERE r.publish_job_id = NEW.id) THEN
    RAISE EXCEPTION
      'publish_job % is marked published without a receipt: an external ID or provider evidence is required',
      NEW.id
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS publish_jobs_published_has_receipt ON app.publish_jobs;
CREATE CONSTRAINT TRIGGER publish_jobs_published_has_receipt
  AFTER INSERT OR UPDATE ON app.publish_jobs
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION app.enforce_published_has_receipt();

COMMENT ON FUNCTION app.enforce_published_has_receipt() IS
  'Published means evidence exists. A 2xx from a media container step is not a publication.';

-- Repeat cadence is a fixed set of user-facing choices.
ALTER TABLE app.content_items DROP CONSTRAINT IF EXISTS content_items_repeat_every_days_allowed;
ALTER TABLE app.content_items
  ADD CONSTRAINT content_items_repeat_every_days_allowed
  CHECK (repeat_every_days IS NULL OR repeat_every_days IN (1, 2, 3, 4, 5, 6, 7, 14, 30));

-- Money is integer minor units with a currency, or neither.
ALTER TABLE app.publish_attempts DROP CONSTRAINT IF EXISTS publish_attempts_cost_currency_pairing;
ALTER TABLE app.publish_attempts
  ADD CONSTRAINT publish_attempts_cost_currency_pairing
  CHECK (
    (cost_actual_minor IS NULL AND cost_estimate_minor IS NULL) OR cost_currency IS NOT NULL
  );

-- A metric observation either has a value or an explicit reason it does not.
-- Missing data is `unavailable`, never zero.
ALTER TABLE app.metric_observations DROP CONSTRAINT IF EXISTS metric_observations_unavailable_has_reason;
ALTER TABLE app.metric_observations
  ADD CONSTRAINT metric_observations_unavailable_has_reason
  CHECK (
    (availability = 'available'::app.metric_availability AND raw_value IS NOT NULL)
    OR (availability <> 'available'::app.metric_availability AND raw_value IS NULL)
  );

COMMENT ON CONSTRAINT metric_observations_unavailable_has_reason ON app.metric_observations IS
  'An unavailable metric is stored with a null value and a stated availability. It is never written as zero.';

-- A comment or thread segment delay is non-negative and bounded.
ALTER TABLE app.comment_thread_items DROP CONSTRAINT IF EXISTS comment_thread_items_delay_range;
ALTER TABLE app.comment_thread_items
  ADD CONSTRAINT comment_thread_items_delay_range
  CHECK (delay_minutes >= 0 AND delay_minutes <= 10080);

-- A short link must not point at itself or carry an empty destination.
ALTER TABLE app.short_links DROP CONSTRAINT IF EXISTS short_links_destination_present;
ALTER TABLE app.short_links
  ADD CONSTRAINT short_links_destination_present
  CHECK (length(btrim(destination_url)) > 0 AND destination_url ~* '^https?://');

COMMENT ON CONSTRAINT short_links_destination_present ON app.short_links IS
  'Only HTTP and HTTPS destinations. Scheme, private-network and open-redirect checks run in the redirect service as well.';
