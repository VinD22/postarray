# Experience programme: what is built, what is not, and what to watch

Written 2026-09-03, at the end of the first implementation session against
`docs/planning/28-experience-master-plan.md`. This is the handoff: read it
before picking up any remaining phase, because several things in the plan
turned out to be wrong and are corrected here rather than there.

## Phase 0 is complete

Every launch blocker in the plan is fixed and on `development`.

| Blocker | Fix |
| --- | --- |
| Uploaded images could never publish | Scan pipeline. Assets leave `pending` through `mediaScanWorkflow`; the first adapter validates format, not malware, and says so in its own doc comment |
| Outbound webhooks and notifications silently dead | Outbox split by kind into two dispatchers; delivery bodies stored rather than only hashed; contract header names; replay tool |
| A non-production deploy swallowed every scheduled post | `POSTARRAY_RUNTIME_PROFILE` plus a local-database check gates the non-durable scheduler; `/readyz` fails when a process comes up degraded |
| CI never ran on `development` | Push trigger fixed; `turbo.json` globalEnv completed |
| 42 accessibility audits were auditing error pages | Playwright demo-mode variable renamed to the one the app reads, with a smoke test that fails if they diverge again |
| The publish path had no workspace scoping | Connector execution activities run inside `withWorkspaceContext`, one context per contiguous block, never spanning a provider call |

## Corrections to the plan and to the repository's own documents

- **`AGENTS.md` said the primary button is ink.** It is vermilion, one per
  screen. The design-system README is authoritative and was already right.
- **`AGENTS.md` said tenancy is enforced three times.** Three layers exist, but
  application traffic runs as `service_role` and every policy is
  `is_service_role() OR membership`, so for those queries the membership branch
  never decides. Write repository code as if row level security were not there.
- **Google Business Profile was left in the launch cohort deliberately.** The
  audit flagged it as advertised with no adapter. It is not offered for
  connection: `listAvailableProviders` filters the cohort by
  `connectors.has(provider)`. Its marketing page renders `adapterPresent:
  false` as unavailable, which is a designed behaviour with seven tests. Removing
  it deletes the only instance of that behaviour and makes the product less
  honest, not more.
- **Two of the four segmented controls are tabs, not radiogroups.** Connections
  and the growth plan render real tab panels and own an `aria-controls`
  relationship. They keep `Tabs` and share only the thumb.
- **The calendar chip link was described backwards.** The chip linked to the
  post correctly; the dead `#receipt` anchor was in the calendar table and the
  entry sheet.

## Three silent data-loss bugs that were already shipping

Found while fixing the variant persistence the plan described. All three are
fixed, but they are recorded because each one destroyed a person's work with no
error anywhere, and because the shape of the mistake will recur.

1. **Reopening a draft dropped most of the master, not just the variants.**
   `api.content.get` returns a narrowed list view, and the composer cast it to
   `MasterDraft`. Links, thread items, the schedule, disclosure flags and the
   campaign id were all absent, and the next autosave wrote that emptiness back
   over the stored draft. A cast at a boundary produced silent data loss,
   exactly as AGENTS.md's parse-do-not-cast rule predicts.
2. **Selecting a channel was only saved if a keystroke happened to follow it.**
   `target/add` never bumped the revision the autosave watches, so a person who
   picked their accounts and walked away had picked nothing.
3. **Any save carrying a destination was rejected.** The composer built a
   destination id as `dest_${externalId}`, but the column is a foreign key to
   `provider_destinations.id`. The search now carries the stored row id, and a
   destination with no row stays local rather than inventing one.

## Three constraints the realtime design got wrong

Recorded because each would be rediscovered the hard way by anyone extending
the event stream.

1. **`EventSource` cannot be used.** It cannot set a request header, and every
   route pins its tenant with `x-relay-workspace-id`. Anyone in two workspaces
   would have received a 404 for the workspace. The web client reads the
   response body with `fetch` instead, which also sends `Last-Event-ID` on
   every reconnect rather than only when the browser chooses to.
2. **Express `compression()` silently swallows a stream.** It is mounted
   globally. The events response sets `cache-control: no-cache, no-transform`,
   and `no-transform` is the directive compression honours. Without it frames
   sit in the compressor until its window fills, which for a few hundred bytes
   of JSON never happens.
3. **MCP tools do not call HTTP.** They go through `RelayServicePort` against
   the application services. Events live in Redis and are not part of
   `Services`, so the composition root supplies a reader on its own connection
   and the sandbox supplies none.

Also fixed along the way: the CLI was sending `x-postarray-workspace-id`, a
header no route reads. Any credential bound to more than one workspace could
never pin one, and every such call returned a missing workspace.

## What the analytics work could not honestly build

The overview screen was specified with columns the API does not serve. Recorded
so the gap is a decision rather than an omission somebody quietly fills in.

- **No followers, reach or engagement rate.** The plan asks for a per-channel
  table carrying those three, from a `channels` field on the overview response.
  That field does not exist and neither do the numbers. An engagement rate
  computed here would be a figure the screen invented, so the table shows posts
  measured, the ranked metric where it is legitimately addable, the unavailable
  count and freshness. The columns follow when the backend ships the field.
- **No 28-day preset.** `AnalyticsRange['preset']` accepts `7d`, `30d`, `90d`
  and `custom`, and the server echoes the same enum, so the 28 the plan asked
  for would fail the client's own response parse. Shipped as 7, 30, 90, custom.
- **`ExperimentView` declared five fields the API has never returned.** The
  experiments screen now says per-variant readings are not reported, rather
  than rendering an empty list that reads as "no variants".
- **The custom range uses two native date inputs** behind a `TODO(web)`,
  because the `DateTimeField` primitive in FE section B9 is not built yet.

## Signed-in editorial ledger pass (2026-09-05)

Home and the shared application shell now carry the same editorial system as the public product. Home
shows the three highest-priority decisions, turns the next 24 hours into a responsive timeline, limits
recent receipts to three concise evidence rows, and shows only connections that need attention. Shared
page headers, navigation scale and app gutters now apply the same hierarchy across signed-in routes.
The pass also fixed duplicate analytics error detail, added a real demo analytics response and set the
locale layout metadata base from the canonical site origin. The free signup and optional paid-plan trial
remain separate, truthful states.

## Known issues, in priority order

1. **The character counter excludes signature text that will publish.**
   `validate-draft.ts` and `summarizeTargets` count `values.body` alone, while
   the preview correctly renders body plus signature. Nobody can hit this today
   because the composer gateway serves an empty signature list, so it is latent.
   It becomes a real "we said you were within the limit and the platform
   truncated you" bug the moment signatures ship. Fix the counter and the
   preview together; `previews/build-preview-model.test.ts` pins the current
   agreement deliberately.
2. **No preview collapse thresholds are sourced.** Every `collapse` rule in
   `previews/presentation-rules.ts` is null. Several platforms truncate long
   captions in their own clients but none publishes the threshold in developer
   documentation. `collapseText` and the "See more" control are built and
   tested; one sourced number turns each on. Do not guess one.
3. **Video posters do not exist.** `GET /v1/media/{id}/read-urls` always returns
   `poster: null` because the derivative pipeline generates no video stills. The
   preview renders an honest placeholder and will start working with no client
   change once the pipeline produces them.
4. **Signatures have no read endpoint.** The posting-sets screen passes an empty
   list with a `TODO(owner)`; `SetForm` renders signatures and nothing serves
   them.
5. **Two tests are flaky under parallel load**, not broken:
   `features/marketing/components/editorial/tier-grid.test.tsx` and
   `features/marketing/locale-metadata-sweep.test.ts`. Both pass alone and at a
   raised timeout. A failure in either is worth re-running before investigating.
6. **`packages/runtime/src/resend-mailer.test.ts`** times out at five seconds
   under load for the same reason.

## Traps that cost time in this session

- **Adding one English key fails 26 i18n tests.** Every new key is a missing
  key in all 25 locale catalogs until it is registered in
  `BETA_ENGLISH_FALLBACK_KEYS` in `packages/i18n/src/messages/beta-fallbacks.ts`.
  Namespaces listed in `LOCALE_FILLED_PREFIXES`, including `queue.` and `set.`,
  cannot be registered at all; new copy there goes under a `web.` prefix, which
  is what `web.receipt.*` already does.
- **RLS claims are validated as real identifiers.** A fixture workspace id of
  `ws_1` is rejected once a code path opens a workspace context. Use
  `newIdFor('workspace')`.
- **A Prisma double needs `$transaction` and `$executeRaw`** as soon as the code
  under test opens a workspace context, and it must hand back the finished
  double rather than the base one, or a model added by an override is invisible
  inside the transaction body.
- **Never put a Next navigation hook in `components/link.tsx`.** It is rendered
  by many tests that mount without an App Router, and doing so breaks them in
  bulk with failures that look unrelated.

## What is not built

Phases 2 and 3 of the master plan are only partly started. Notably absent:
notifications (model, writer, preferences, emails), client reports, the setup
guide and coachmarks, contextual help, the service worker, error reporting,
hydration boundaries, Google sign-in, and the recurring and evergreen work.
Section 3.6 of the plan remains explicitly optional.
