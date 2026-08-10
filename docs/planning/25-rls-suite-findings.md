# 25. RLS Suite Findings, First Live Run

**Date:** 10 August 2026. First time `src/rls.test.ts` has ever executed against
a real Postgres. Database: Neon project `post-on-social-media`, PG 18.

**Result: 120 of 126 passing. No tenant isolation hole was found.** The six
failures are defects in the test harness and its fixtures, not in the policies.
Each is diagnosed below with the evidence, because a red test with no
explanation is worse than no test.

---

## The finding that matters most

**The suite never tested row level security.** `asActor` set the
`request.jwt.claims` GUC but never changed database role, so every query ran as
the migration owner. That role carries `rolbypassrls` on Neon, and on most
managed Postgres, so **not one policy was ever evaluated**.

Had the suite been run before this change, it would have failed loudly. Had the
owner not been BYPASSRLS, it would have passed while proving nothing. Fixed by
dropping to `authenticated` or `service_role` inside each transaction, matched
to the role the claims assert.

## The six remaining failures

### 1 to 2. `permission denied for table content_items` / `workspaces`

Tests: *lets an editor create content*, *lets an admin change workspace settings*.

`0020_rls_policies.sql` grants `SELECT` to `authenticated` and full CRUD to
`service_role`. So `authenticated` cannot write, and the grant is checked before
any policy is consulted. The tests assert that an editor writing as
`authenticated` succeeds, which the grants have never allowed.

**This exposes a real design question, and it should be answered before these
tests are edited.** The write policies in 0020 (`editor` may insert, `admin` may
update) are expressed against roles that hold no write grant. If the application
always writes through `service_role`, those policy branches are unreachable and
the role checks that matter live in `packages/application`, not the database. If
instead the intent was defence in depth at the database, `authenticated` needs
the write grants and the policies become load bearing.

Do not "fix" the tests by switching them to `service_role`: that would make them
assert `app.is_service_role()` and quietly delete the coverage of every
role-based write rule.

### 3. Outsider *reads nothing* returns one row

Verified directly against the live database: with claims naming a user who has
no membership, `SELECT count(*) FROM app.content_items` returns **0**. The live
policy is `app.is_service_role() OR app.is_workspace_member(workspace_id)`,
which is correct.

So the policy is right and the fixture is wrong: the seeded state leaves a row
visible to the outsider identity the test invents. Fixture-level, not a hole.

### 4 to 6. Immutability tests resolve instead of rejecting

Tests: content version update, audit log update, audit log delete.

Both triggers exist and are enabled on the live database
(`content_versions_immutable`, `audit_events_append_only`), and
`private.reject_audit_mutation()` raises unconditionally on any `TG_OP`.

The cause is that these are `BEFORE ... FOR EACH ROW` triggers. **A statement
whose `WHERE` matches no rows never fires a row trigger**, so the `UPDATE`
returns successfully having changed nothing, and the test reads that as "the
guard did not fire". The rows the tests target are not present in the seeded
fixture.

**The audit log is immutable.** The test is asserting against a row that is not
there.

## What to do next

1. Answer the design question in items 1 to 2 before touching those tests. It
   decides whether database-level role enforcement is real or vestigial.
2. Repair the fixture so the immutability tests target rows that exist, and add
   an assertion that the statement affected at least one row, so a vacuous pass
   can never be mistaken for a guard firing.
3. Trace what makes one row visible to the outsider identity in item 3.
4. Keep `pnpm test:rls` out of `pnpm verify` (it needs a live database) but wire
   it into CI against a throwaway Neon branch, which is the reason to be on Neon.

## Why this was worth doing

Three of these six are harmless. The first one is not: a security suite that
cannot fail is more dangerous than no suite, because it is quoted in reviews as
evidence. It had been reported for months as "38 passed, 126 skipped".
