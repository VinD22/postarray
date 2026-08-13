# Row level security model

Tenancy is enforced three times: at the edge when we authenticate, in the
application service when we authorize, and in PostgreSQL when we query. This
document covers the third one. It is the layer that still holds when the other
two have a bug, which is the only reason it is worth the effort.

Everything described here lives in `packages/database/migrations/`. The Prisma
schema creates tables; it does not create policy. An ORM cannot express a
security policy, and pretending otherwise is how a tenant boundary quietly stops
existing.

## The two-schema split

| Schema | Contents | Reachable by a browser |
| --- | --- | --- |
| `app` | Workspaces, brands, content, connections, publishing evidence, analytics, links, lifecycle | Yes, read-only, under RLS |
| `private` | Encrypted provider credentials, API key hashes, OAuth clients and grants, webhook signing secrets, billing, the audit log | No. `anon` and `authenticated` hold no privilege at all, not even `USAGE` on the schema |

The split exists because RLS is a per-table decision and per-table decisions get
forgotten. If credentials lived in `app` alongside drafts, one missing policy on
one table would be a token leak. In `private` a missing policy is not enough: the
role cannot see the schema, so there is nothing to have a policy about.

`migrations/0002_schemas.sql` also revokes default privileges in both schemas, so
a newly created table is granted to nobody until someone writes the grant by
hand. Supabase does not auto-expose new tables to the Data API and we rely on
that behaviour rather than treating it as a convenience.

Practical consequence for application code: **the browser never reads `private`.**
The billing screen, the connections screen and the developer console all fetch
through the API, which authorizes first and then queries as the service role.

## The helper functions

`migrations/0010_rls_helpers.sql` defines the vocabulary every policy is written
in. All of them are `STABLE` (evaluated once per statement rather than once per
row) and `SECURITY DEFINER` with `search_path` pinned to a fixed list. A
`SECURITY DEFINER` function with a mutable `search_path` is a privilege
escalation, so that pin is not decoration.

| Function | Returns |
| --- | --- |
| `app.jwt_claims()` | The request claims as `jsonb`, or `{}`. Never raises. |
| `app.current_user_id()` | The Relay user id, from the `relay_user_id` claim or resolved from the Supabase `sub`. `NULL` denies everything. |
| `app.is_service_role()` | True for trusted server-side traffic. |
| `app.current_workspace_ids()` | Active memberships in live workspaces, optionally narrowed by `relay_workspace_id`. |
| `app.has_workspace_role(ws, roles)` | Membership role check. |
| `app.is_workspace_member(ws)` | Shorthand for the common `SELECT` predicate. |
| `app.can_write(ws)` | owner, admin, manager, editor |
| `app.can_approve(ws)` | owner, admin, manager, approver |
| `app.can_administer(ws)` | owner, admin |

Two properties are worth stating explicitly.

**`relay_workspace_id` can only narrow.** It is intersected with real membership
inside `app.current_workspace_ids()`, never substituted for it. A server that
sets the wrong workspace id gets fewer rows, not somebody else's rows.

**The service role does not bypass RLS.** It has no `BYPASSRLS` attribute. It
satisfies policies that name it, which means the reach of an operator query is
still described in SQL a reviewer can read, and it means a server-side bug can
still be caught by a policy.

## The database roles

| Role | Holds | Used by |
| --- | --- | --- |
| `relay_app` | `SELECT, INSERT, UPDATE, DELETE` on every table in `app` and `private`, `EXECUTE` on the policy helpers, **no `BYPASSRLS`** | Every application connection: the Nest API, the worker, MCP, the CLI |
| `authenticated` | `SELECT` on `app` tables only, plus writes on `app.remembered_targets` | Reserved for a future Neon Data API surface. Nothing connects as it today |
| `anon` | Nothing, anywhere | Nothing |
| `service_role` | Same table grants as `relay_app` | The Supabase-shaped name the policies were written against. Kept so a Data API deployment stays possible |
| the migration owner | Everything, and `BYPASSRLS` on Neon | `pnpm db:migrate` only |

`relay_app` is created by `migrations/0073_relay_app_role.sql`, which also
asserts that it does not carry `BYPASSRLS` and that it holds CRUD on every
guarded table. Both assertions fail the migration rather than warning, because a
role that silently lost its grants would make every write policy unreachable
again and nothing else would notice.

That migration is the answer to a question the first live run of `src/rls.test.ts`
exposed, recorded in `docs/planning/25-rls-suite-findings.md`. Grants are checked
before policies. While the application wrote as a role with no write grant, every
claims-based write branch (`app.can_write`, `app.can_administer`,
`app.can_approve`) was unreachable and the role checks that mattered lived only
in `packages/application`. Giving the connecting role the grants — and no
bypass — makes those branches load bearing for writes as well as reads. Deleting
them instead would have been cheaper and would have left row level security as
theatre in a product that holds other people's publishing credentials.

**`authenticated` stays read-only** with exactly one documented exception,
`app.remembered_targets`, whose four policies are self-row: a browser session can
only write its own memory row inside a workspace it belongs to, and forgetting
must not require a round trip through the API. 0073 asserts that no other table
grows a write grant for `authenticated`.

## Where the claims come from

**Every surface sets `request.jwt.claims` itself.** There is no pooler doing it
for anyone. This document used to say that browser traffic arrives through the
Supabase pooler with the GUC already set; that is false on Neon, which is where
this runs, and a stale claim in a security document is worse than a missing one.

The web app, the Nest API, the worker, MCP and the CLI all hold direct
connections and all go through `withWorkspaceContext` / `withRlsContext`:

```ts
import { withWorkspaceContext } from '@relay/database';

await withWorkspaceContext(prisma, { workspaceId, userId }, async (db) => {
  return db.contentItem.findMany({ where: { state: 'scheduled' } });
});
```

`withRlsContext` sets the GUC with `is_local = true`, so it lives exactly as long
as the transaction and cannot leak onto the next checkout of a pooled
connection. One policy body therefore covers browser and server traffic, and
there is no "trusted connection" path to forget about.

`withWorkspace` additionally injects the `workspace_id` filter into every query.
That is a lint, not the boundary: it makes the intended tenant visible in the
call site and in code review. The database is what actually stops the query.

A connection that sets no claims sees nothing at all: every policy denies on
empty claims, so the failure mode of forgetting is a query that returns zero
rows, not one that returns somebody else's. If a Neon Data API surface is added
later it will set the GUC from the bearer token on the way in, and the policy
bodies will not change, because they were never written against a database
role.

## The policy pattern

Every tenant table gets the same four policies, generated from an explicit
per-table profile list in `migrations/0020_rls_policies.sql`:

```sql
CREATE POLICY <table>_select ON <schema>.<table>
  FOR SELECT TO public USING (<read predicate>);

CREATE POLICY <table>_insert ON <schema>.<table>
  FOR INSERT TO public WITH CHECK (<write predicate>);

CREATE POLICY <table>_update ON <schema>.<table>
  FOR UPDATE TO public USING (<write predicate>) WITH CHECK (<write predicate>);

CREATE POLICY <table>_delete ON <schema>.<table>
  FOR DELETE TO public USING (<write predicate>);
```

Four decisions are baked into that shape.

**`ENABLE` and `FORCE`.** Without `FORCE`, the table owner skips every policy,
and the table owner is exactly the role our migrations and our pooled
application connections use. The final block of `0020` fails the migration if any
table in `app` or `private` is missing either flag.

**`TO public`, gated on claims rather than on database roles.** A connection with
no claims sees nothing, whoever it logged in as. That is the deny-by-default
behaviour, and it is what makes `src/rls.test.ts` a real test rather than
theatre.

**`USING` and `WITH CHECK` carry the same predicate on `UPDATE`.** Otherwise an
editor who may legitimately edit a row could rewrite its `workspace_id` and move
it into another tenant.

**Absence of a policy is a denial.** Several tables deliberately have no `UPDATE`
or no `DELETE` policy: `content_versions`, `approval_decisions`,
`publication_receipts`, `publish_attempts`, `automation_rule_runs`,
`commission_ledger`, `consents` and `audit_events`. Each one says so in its
per-table comment, visible in the database with `\dp`.

The per-operation profiles are:

| Profile | Who |
| --- | --- |
| `member` | any active member of the owning workspace |
| `writer` | owner, admin, manager, editor |
| `approver` | owner, admin, manager, approver |
| `admin` | owner, admin |
| `service` | trusted server-side traffic only |

`service` on a write is a statement about the product, not about convenience. It
appears on `publish_jobs`, `publication_receipts`, `provider_destinations`,
`mention_entities`, `metric_observations` and the rest of the evidence tables
because those changes have to travel through the application service, where
idempotency, capability revalidation, approval policy and entitlement checks
live. A browser session holding a Data API token cannot schedule a post or write
a receipt.

## Immutability

Three tables are append-only in the database, not by convention.

`app.content_versions` rejects `UPDATE` through a trigger. Every publish attempt
and every receipt references a version and records its hash, so an editable
version would make the audit trail fiction. Editing means creating the next
version, which is what forces reapproval.

`app.publication_receipts` rejects `UPDATE` except to `last_analytics_sync_at` and
`deleted_externally_at`, and `deleted_externally_at` is set once. The trigger
compares the whole row rather than listing forbidden columns, so a column added
later is frozen by default.

`private.audit_events` rejects `UPDATE`, `DELETE` and `TRUNCATE` for every role
including the owner. Retention pruning goes through
`private.prune_audit_events(older_than)`, which refuses anything inside the 365
day floor, disables the guard for exactly one bounded `DELETE`, and re-enables
it.

The triggers and the missing policies are two different layers, and
`src/rls.test.ts` asserts them separately. Under row level security an `UPDATE`
on `app.content_versions` or `private.audit_events` matches no rows at all,
because neither table has an `UPDATE` policy. That means the statement succeeds
having changed nothing, and — because these are `BEFORE ... FOR EACH ROW`
triggers — the trigger never fires. A test that only ran under RLS would
therefore pass whether the trigger existed or not. The immutability cases run
with row level security bypassed and assert that the target row exists first, so
the guard is the thing being tested and a zero-row statement can never
impersonate one.

`DELETE` on these tables is denied by the absence of a policy rather than by the
triggers. That distinction matters: referential cascades are exempt from RLS but
not from triggers, so guarding `DELETE` in a trigger would block the
account-deletion workflow from ever finishing. The audit log is the exception in
the other direction: its foreign key to `workspaces` is `RESTRICT`, so deleting a
workspace cannot erase the record of what happened in it. A workspace is soft
deleted through `deleted_at` and hard deleted only after retention has passed.

## How service-role access is audited

PostgreSQL cannot fire a trigger on `SELECT`, so a privileged read is audited by
the code performing it. `private.record_privileged_read(...)` is the sanctioned
path and it requires a reason string; an audit line nobody can interpret is not
an audit line. It is used by the token vault, the billing reader and support
tooling, and `audit_events_privileged_read_idx` exists so those reads can be
reviewed on their own cadence.

Writes are covered by `appendAuditEvent` from `@relay/database/audit`, called in
the same transaction as the change it describes so a rolled back mutation cannot
leave a claim that it happened. `before` and `after` are hashed rather than
stored, which proves a value changed without copying a customer's draft or email
into the log.

Every action records the same identity fields whether it arrived from the web
app, an OAuth application, MCP, the CLI or an API key. `actor_client_id` carries
the developer application, which is what makes "show me everything this app ever
did" answerable at revocation time.

## Adding a table safely

The failure mode of forgetting a step here is "nobody can read the table", not a
leak. That is deliberate, and it is why the checklist is short.

1. **Add `workspaceId String @map("workspace_id") @db.Uuid` and `@@index([workspaceId])`**
   to the Prisma model, plus the compound index for the query you actually
   intend to run. Choose the schema with `@@schema("app")` or
   `@@schema("private")`; if it holds a secret, a token, billing data or audit
   data, it is `private`.

2. **Register it in `packages/database/src/tenancy/model-registry.ts`**, in
   `TENANT_MODELS` or `GLOBAL_MODELS`. The registry is hand-written rather than
   derived from the Prisma DMMF precisely so that a new model has to be
   classified by a person. `withWorkspace` throws on an unregistered model.

3. **Add a row to the `policy_targets` list in `0020_rls_policies.sql`** with a
   profile per operation and a one-sentence rationale. The rationale becomes a
   `COMMENT ON POLICY`, so the reason is readable in the database and not only in
   git history. Use `none` where an operation should be denied, and say why.

4. **Add the invariants that are not tenancy** to `0030_constraints.sql`:
   money paired with a currency, an enum-shaped free-text column, an immutability
   trigger.

5. **Extend `packages/database/src/rls.test.ts`.** Every tenant table needs a
   test that attempts a cross-workspace read and a cross-workspace write and
   asserts both fail. The `describe.each(ROLES)` block is the place; a new table
   usually needs one added case rather than a new block.

6. **Run `pnpm db:reset`.** The assertion at the end of `0020` fails the
   migration if any table in `app` or `private` lacks `ENABLE` plus `FORCE`, so a
   forgotten step three stops the build rather than shipping.

A table that is genuinely global (a curated catalog, reference data) skips steps
one and three's tenant profile but still needs an explicit policy: look at
`app.growth_opportunities`, which is readable by signed-in users only while
`state = 'active'`, so an unverified URL cannot surface as a recommendation.

## What this does not cover

RLS protects rows. It does not protect against an application service that
authorizes the wrong user, a token that should have been revoked, or a
capability check skipped before a provider call. Those are the first and second
enforcement points, and they have their own tests. "The user is logged in" is
never a policy at any layer.
