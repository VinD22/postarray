-- 0067_google_business_profile_provider.sql
--
-- Register Google Business Profile as a known provider kind.
--
-- This adds a label to app.provider_kind and nothing else. It grants no
-- capability: there is no adapter, the connector registry reports the provider
-- as not implemented, and the reviewed production allow-list in @relay/config
-- stays empty. Knowing a name is not the same as claiming support.
--
-- The runner applies each file inside its own transaction (see
-- packages/database/src/migrate.ts). Since PostgreSQL 12, ALTER TYPE ... ADD
-- VALUE is permitted inside a transaction block provided the new label is not
-- read back in that same transaction, which is why this file adds the label and
-- stops. Any use of the label belongs in a later migration.
--
-- IF NOT EXISTS makes the statement idempotent, so a replay against a database
-- that already carries the label is a no-op rather than a failure.

ALTER TYPE "app"."provider_kind" ADD VALUE IF NOT EXISTS 'google_business_profile';
