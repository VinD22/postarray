-- 0054_transactional_outbox.sql
-- Commit domain changes and durable workflow intent atomically. Dispatch is
-- at least once; Temporal workflow ids and signals remain idempotent.

CREATE TABLE private.outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN (
    'start_publish',
    'cancel_publish',
    'reschedule_publish',
    'start_rule_run'
  )),
  dedupe_key text NOT NULL,
  payload jsonb NOT NULL,
  available_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error_code text,
  claimed_at timestamptz,
  dispatched_at timestamptz,
  dead_lettered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, dedupe_key)
);

CREATE INDEX outbox_available_idx
  ON private.outbox (available_at, id)
  WHERE dispatched_at IS NULL AND dead_lettered_at IS NULL;

CREATE INDEX outbox_workspace_idx ON private.outbox (workspace_id);

CREATE TABLE private.outbox_dead_letter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  outbox_event_id uuid NOT NULL UNIQUE REFERENCES private.outbox(id) ON DELETE RESTRICT,
  kind text NOT NULL,
  dedupe_key text NOT NULL,
  payload jsonb NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0),
  error_code text NOT NULL,
  failed_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX outbox_dead_letter_workspace_failed_idx
  ON private.outbox_dead_letter (workspace_id, failed_at DESC);

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
