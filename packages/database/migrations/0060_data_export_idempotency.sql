-- A KV idempotency record makes normal retries pleasant. This durable key is
-- the race guard when Redis is cold or a process dies after the row commit.
ALTER TABLE "app"."data_exports"
  ADD COLUMN IF NOT EXISTS "idempotency_key" text;

CREATE UNIQUE INDEX IF NOT EXISTS "data_exports_workspace_id_idempotency_key_key"
  ON "app"."data_exports" ("workspace_id", "idempotency_key");
