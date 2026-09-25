-- 0079_webhook_delivery_payload.sql
--
-- Outbound webhooks stored only a hash of what they were going to send.
--
-- `WebhookService.emit` recorded `payload_hash` and nothing else, so the
-- delivery activity had no body to sign. It could reconstruct exactly one
-- payload, the connection test, by rebuilding the known test shape and
-- comparing hashes; every real event therefore failed with
-- CAPABILITY_NOT_IMPLEMENTED. Customers could create an endpoint, fire a test
-- successfully, and never receive a single `post.published`.
--
-- The body is now stored beside the hash. The hash stays: it is what makes a
-- redelivery provably the same bytes as the first attempt.
--
-- Nullable on purpose. Rows written before this migration have no body and
-- keep failing exactly as they do today rather than being invented after the
-- fact.

ALTER TABLE private.webhook_deliveries
  ADD COLUMN IF NOT EXISTS payload jsonb;

COMMENT ON COLUMN private.webhook_deliveries.payload IS
  'The signed request body. Null for rows created before 0079, which cannot be delivered.';

-- The (webhook_endpoint_id, event_id) unique constraint already exists, which
-- is what makes a repeated dispatch of the same outbox row create no second
-- delivery.

SELECT private.assert_rls_complete();
