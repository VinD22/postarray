-- 0068_queue_rules.sql
--
-- Queue rules and slot reservations.
--
-- Tables, ordinary indexes and workspace foreign keys live in the reviewed core
-- schema (0004). This migration adds the invariants Prisma cannot express and
-- the tenant policies, exactly as 0050 and 0054 did for invitations and the
-- outbox.
--
-- Three invariants are worth reading twice:
--
--   1. `maximum_per_day` is NULL for "no ceiling" and 0 for "never". A CHECK
--      keeps it non-negative, and nothing in this database or in the
--      application is allowed to read 0 as unlimited.
--   2. A live reservation owns its instant. The partial unique index refuses a
--      second proposed or accepted reservation on the same project and instant,
--      so two people racing the composer cannot both be told the slot is theirs.
--      Released and expired rows are excluded, which is what lets the slot be
--      offered again once nobody is holding it.
--   3. `rule_snapshot` is frozen evidence. A trigger refuses any UPDATE that
--      changes it, the instant or the zone. A reservation may change state and
--      pick up its content item and publish job; it may never be rewritten to
--      say a different rule chose a different time.

-- ---------------------------------------------------------------------------
-- Queue rules
-- ---------------------------------------------------------------------------

ALTER TABLE app.queue_rules
  DROP CONSTRAINT IF EXISTS queue_rules_created_by_user_id_fkey,
  ADD CONSTRAINT queue_rules_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS queue_rules_gap_nonnegative,
  ADD CONSTRAINT queue_rules_gap_nonnegative
    CHECK (minimum_gap_minutes >= 0 AND minimum_gap_minutes <= 43200),
  DROP CONSTRAINT IF EXISTS queue_rules_maximum_per_day_nonnegative,
  ADD CONSTRAINT queue_rules_maximum_per_day_nonnegative
    CHECK (maximum_per_day IS NULL OR (maximum_per_day >= 0 AND maximum_per_day <= 500)),
  DROP CONSTRAINT IF EXISTS queue_rules_priority_bounded,
  ADD CONSTRAINT queue_rules_priority_bounded
    CHECK (priority >= 0 AND priority <= 1000),
  DROP CONSTRAINT IF EXISTS queue_rules_windows_is_array,
  ADD CONSTRAINT queue_rules_windows_is_array
    CHECK (jsonb_typeof(windows) = 'array'),
  DROP CONSTRAINT IF EXISTS queue_rules_blackouts_is_array,
  ADD CONSTRAINT queue_rules_blackouts_is_array
    CHECK (jsonb_typeof(blackouts) = 'array'),
  DROP CONSTRAINT IF EXISTS queue_rules_time_zone_present,
  ADD CONSTRAINT queue_rules_time_zone_present
    CHECK (length(iana_time_zone) > 0);

COMMENT ON COLUMN app.queue_rules.maximum_per_day IS
  'NULL is no ceiling. Zero is zero. Never read 0 as unlimited.';
COMMENT ON COLUMN app.queue_rules.iana_time_zone IS
  'The zone the windows, the daily rollover and the blackout dates are read in.';

-- ---------------------------------------------------------------------------
-- Slot reservations
-- ---------------------------------------------------------------------------

ALTER TABLE app.queue_slot_reservations
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_created_by_user_id_fkey,
  ADD CONSTRAINT queue_slot_reservations_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_content_item_id_fkey,
  ADD CONSTRAINT queue_slot_reservations_content_item_id_fkey
    FOREIGN KEY (content_item_id) REFERENCES app.content_items(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_state_supported,
  ADD CONSTRAINT queue_slot_reservations_state_supported
    CHECK (state IN ('proposed', 'accepted', 'released', 'expired')),
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_snapshot_is_object,
  ADD CONSTRAINT queue_slot_reservations_snapshot_is_object
    CHECK (jsonb_typeof(rule_snapshot) = 'object'),
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_snapshot_carries_reasons,
  ADD CONSTRAINT queue_slot_reservations_snapshot_carries_reasons
    CHECK (jsonb_typeof(rule_snapshot -> 'reasons') = 'array'),
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_local_time_shape,
  ADD CONSTRAINT queue_slot_reservations_local_time_shape
    CHECK (local_date_time ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$'),
  DROP CONSTRAINT IF EXISTS queue_slot_reservations_accepted_has_content,
  ADD CONSTRAINT queue_slot_reservations_accepted_has_content
    CHECK (state <> 'accepted' OR content_item_id IS NOT NULL);

-- A live reservation owns its instant for the project. Released and expired
-- rows are excluded so the slot becomes offerable again when nobody holds it.
DROP INDEX IF EXISTS app.queue_slot_reservations_live_instant_key;
CREATE UNIQUE INDEX queue_slot_reservations_live_instant_key
  ON app.queue_slot_reservations (workspace_id, brand_id, scheduled_for)
  WHERE state IN ('proposed', 'accepted');

COMMENT ON INDEX app.queue_slot_reservations_live_instant_key IS
  'Two people racing the composer cannot both be told the same instant is theirs.';

-- ---------------------------------------------------------------------------
-- The frozen snapshot.
--
-- This is the point of the whole design. Changing or deleting a queue rule
-- tomorrow must not move an instant a person already reserved, and the
-- reservation must still be able to explain itself in an audit years later.
-- The application never rewrites these columns; this trigger is what makes that
-- a guarantee rather than a convention.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app.freeze_queue_slot_evidence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, app
AS $$
BEGIN
  IF NEW.rule_snapshot IS DISTINCT FROM OLD.rule_snapshot
    OR NEW.scheduled_for IS DISTINCT FROM OLD.scheduled_for
    OR NEW.scheduled_time_zone IS DISTINCT FROM OLD.scheduled_time_zone
    OR NEW.local_date_time IS DISTINCT FROM OLD.local_date_time
    OR NEW.brand_id IS DISTINCT FROM OLD.brand_id
    OR NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN
    RAISE EXCEPTION USING
      ERRCODE = 'check_violation',
      MESSAGE = 'queue slot evidence is immutable',
      DETAIL = 'The instant, its zone and the frozen rule snapshot cannot be rewritten.',
      HINT = 'Release this reservation and propose a new slot instead.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS queue_slot_reservations_freeze_evidence ON app.queue_slot_reservations;

CREATE TRIGGER queue_slot_reservations_freeze_evidence
BEFORE UPDATE ON app.queue_slot_reservations
FOR EACH ROW
EXECUTE FUNCTION app.freeze_queue_slot_evidence();

COMMENT ON FUNCTION app.freeze_queue_slot_evidence() IS
  'A reserved slot keeps the instant and the rule copy it was created with, whatever happens to the live rule.';

-- ---------------------------------------------------------------------------
-- Tenant policies. Same row format as 0020_rls_policies.sql:
--
--   schema, table, ws column, sel, ins, upd, del, rationale
-- ---------------------------------------------------------------------------

SELECT private.apply_tenant_policies(
  'app', 'queue_rules', 'workspace_id',
  'member', 'writer', 'writer', 'admin',
  'Queue rules are editorial configuration; deleting one is administrative because reservations reference it.'
);

SELECT private.apply_tenant_policies(
  'app', 'queue_slot_reservations', 'workspace_id',
  'member', 'service', 'service', 'service',
  'A reservation is evidence produced by the application service, which is where authorization, idempotency and the audit append live. A browser session cannot mint or move one.'
);
