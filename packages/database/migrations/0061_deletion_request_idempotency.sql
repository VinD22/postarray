-- A KV idempotency record makes normal retries pleasant. This durable key is
-- the race guard when Redis is cold or a process dies after the row commit.
ALTER TABLE "app"."deletion_requests"
  ADD COLUMN IF NOT EXISTS "idempotency_key" text;

CREATE UNIQUE INDEX IF NOT EXISTS "deletion_requests_workspace_id_idempotency_key_key"
  ON "app"."deletion_requests" ("workspace_id", "idempotency_key");
