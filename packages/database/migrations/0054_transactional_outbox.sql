-- 0054_transactional_outbox.sql
-- Commit domain changes and durable workflow intent atomically. Dispatch is
-- at least once; Temporal workflow ids and signals remain idempotent. Tables,
-- ordinary indexes and workspace foreign keys live in the core schema.

ALTER TABLE private.outbox
  DROP CONSTRAINT IF EXISTS outbox_kind_supported,
  ADD CONSTRAINT outbox_kind_supported CHECK (kind IN (
    'start_publish',
    'cancel_publish',
    'reschedule_publish',
    'start_rule_run'
  )),
  DROP CONSTRAINT IF EXISTS outbox_attempts_nonnegative,
  ADD CONSTRAINT outbox_attempts_nonnegative CHECK (attempts >= 0);

CREATE INDEX IF NOT EXISTS outbox_available_idx
  ON private.outbox (available_at, id)
  WHERE dispatched_at IS NULL AND dead_lettered_at IS NULL;

ALTER TABLE private.outbox_dead_letter
  DROP CONSTRAINT IF EXISTS outbox_dead_letter_event_fkey,
  ADD CONSTRAINT outbox_dead_letter_event_fkey
    FOREIGN KEY (outbox_event_id) REFERENCES private.outbox(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS outbox_dead_letter_attempts_positive,
  ADD CONSTRAINT outbox_dead_letter_attempts_positive CHECK (attempts > 0);

SELECT private.apply_tenant_policies(
  'private', 'outbox', 'workspace_id',
  'service', 'service', 'service', 'service',
  'Server-side transactional handoff to Temporal. Clients never receive outbox payloads.'
);

SELECT private.apply_tenant_policies(
  'private', 'outbox_dead_letter', 'workspace_id',
  'service', 'service', 'none', 'none',
  'Immutable evidence for workflow intents that exhausted the dispatch budget.'
);
