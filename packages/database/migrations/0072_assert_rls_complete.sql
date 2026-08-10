-- 0072_assert_rls_complete.sql
--
-- The final word on tenancy: every table in `app` and `private` has row level
-- security enabled and forced, with no exceptions.
--
-- 0020_rls_policies.sql runs the same assertion, but it has to allow a deferral
-- list. All table DDL lives in 0004_core_schema.sql by convention, so a table
-- whose policies are written in a later numbered migration already exists when
-- 0020 runs and would fail an unconditional check there.
--
-- This migration is deliberately last and passes no deferrals. A table that
-- slipped through, or a name left on 0020's deferral list after its policies
-- landed, fails here. Keep this file last: a new migration that adds a table
-- belongs before it.
--
-- This is not a substitute for the cross-workspace test suite in
-- src/rls.test.ts, which proves the policies say the right thing. This proves
-- only that no table is unguarded.

SELECT private.assert_rls_complete();
