# Connector Definition of Done — X

Copied from the repository-wide [`docs/connectors/definition-of-done.md`](../definition-of-done.md)
per its own "How to use this document" instructions. **This is still a gate, not a guideline.**

**Review basis for this pass (2026-08-19):** an automated, code-only review. Every checked item
below cites a specific test file and test name that was run during this review
(`pnpm --filter @relay/connectors test`, 35 files / 500 tests, all passing) or a specific line of
code, per the instructions this review was done under. **This review is not a substitute for the
independent human re-verification step 3 of "How to use this document" requires** — "the owner
said so" is not verification, and neither is "an AI agent said so." Every item that needs a live
account, a provider's own review status, or a human signature is left unchecked with a note on
exactly what evidence would satisfy it. No item below was pre-checked; every checked box was
verified by running the cited test in this session.

## Connector under review

| Field | Value |
| --- | --- |
| Provider | X (formerly Twitter), via the official X API v2 |
| Connector version | `1.0.0` (`identity().connectorVersion`, `packages/connectors/src/providers/x/connector.ts`) |
| Contract version implemented | `1.0.0` (`CONNECTOR_CONTRACT_VERSION`, `packages/connectors/src/contract.ts`) |
| Engineering owner | _(unfilled — see section 12: `identity()` records `'Backend/Connectors 1'`, a team label, not a named individual)_ |
| Policy owner | _(unfilled — see section 12: `identity()` records `'Policy Owner'`, a placeholder, not a named individual)_ |
| Review date | _(unfilled — human sign-off only)_ |
| Next review date | _(unfilled — human sign-off only)_ |
| Current label being requested | `beta` |

---

## 1. Production authentication and review status

None of these seven items can be satisfied by code. Every one needs a live X Developer Portal
application, a human decision, or both.

- [ ] The provider's official API documentation URL and official policy URL are recorded in the
      connector runbook with a retrieval date and the API or policy version.
      _Needs:_ no `docs/connectors/x/runbook.md` exists (see section 11). `README.md` in the
      connector package lists documentation URLs with a self-recorded "Verification date: 4 August
      2026," but that date was recorded by the implementer, not confirmed by an independent
      reviewer re-opening each URL.
- [ ] Production application status is recorded and is one of: approved; approved with a named
      limitation; or pending with a date. Evidence: a link or screenshot in the runbook.
      _Needs:_ `README.md` states app review is "Not started as of 4 August 2026," target Week 2.
      A human must confirm current status and attach evidence.
- [ ] If approval is **not** complete, the exact limitation is displayed to the user **before**
      they start the OAuth flow, in the composer, and on the public capability page.
      _Needs:_ this is an `apps/web` rendering concern outside `packages/connectors`; a reviewer
      must click through all three surfaces.
- [ ] The scopes we request are the minimum for shipped features. Every requested scope maps to a
      named screen in the product. No scope is requested for a future feature.
      _Needs:_ `authorization()` in `connector.ts` (lines ~432-463) already names a screen
      (`usedBy`) for every one of the five requested scopes, and reading the rest of the file
      confirms each is genuinely exercised (`tweet.write` in `createPost`, `tweet.read` in
      `findRecentMatchingPost`, `users.read` in `discoverAccounts`, `media.write` in `uploadOne`,
      `offline.access` implied by `refreshCredential`). That proves internal consistency, but not
      that the scopes actually configured on the live X Developer Portal application match this
      list — that is a live-config fact code cannot see. A reviewer must confirm the two match.
- [ ] Login OAuth and publisher OAuth use separate applications and separate credentials.
      _Needs:_ `packages/config/src/schema.ts` and `.env.example` declare exactly one
      `X_CLIENT_ID`/`X_CLIENT_SECRET` pair, used only by `providers.x` (the publishing connector).
      No separate "Sign in with X" login application was found anywhere in `apps/`. If X is only
      ever used as a publishing connector and never as an account login method, this item may not
      apply — but that is a product decision, not something code can decide.
- [ ] Terms, Privacy Policy, Acceptable Use Policy, AI Policy, data deletion instructions and a
      support contact are published and satisfy this provider's review requirements.
      _Needs:_ outside `packages/connectors` entirely.
- [ ] Account type and feature limitations appear before OAuth and again in the composer.
      _Needs:_ `apps/web` UI concern.

## 2. Connection lifecycle

- [x] `discoverAccounts` returns every eligible external identity and the user chooses explicitly.
      Nothing is auto-connected.
      _Evidence:_ `packages/connectors/src/providers/x/connector.test.ts`, describe `X discovery
      and destinations`, tests `discovers exactly one user account and never auto-connects it` and
      `marks an account without the write scope ineligible rather than hiding it` (both currently
      passing). `discoverAccounts` in `connector.ts` is a pure read (one `GET /2/users/me` call) —
      it performs no connection-creating side effect, only returns `ExternalAccount[]` for the
      caller to present. Whether the composer/connections UI actually renders that array as an
      explicit picker rather than auto-connecting the first result is an `apps/web` concern this
      test does not reach, but the connector itself cannot and does not auto-connect anything.
- [ ] Connecting the same external account twice in one workspace is prevented by the
      `(provider, external_account_id, workspace_id)` uniqueness constraint, with a clear message.
      _Needs:_ this is a `packages/database` schema/constraint concern, not connector code. A
      migration test or an integration test against a real Postgres instance would prove it; none
      was found in `packages/connectors`.
- [ ] Reconnect preserves history: content, receipts and analytics survive a reconnect and are not
      orphaned.
      _Needs:_ `packages/application` / `apps/api` concern, outside this connector's code.
- [ ] Disconnect calls the provider revoke endpoint where one exists, deletes our stored credential
      regardless of the provider call's outcome, and cancels or explicitly surfaces any scheduled
      jobs that depended on it.
      _Needs:_ `connector.ts` `revoke()` does call `POST /2/oauth2/revoke` and does log-and-continue
      rather than throw on a provider failure (matching the "delete our credential regardless"
      intent), but no test in `x/connector.test.ts` or elsewhere calls `connector.revoke()` at all.
      This is unproven, not just unchecked for a documentation reason.
- [ ] Pause is available and stops dispatch without deleting the connection.
      _Needs:_ worker/application concern, outside this connector's code.
- [ ] Token refresh runs at 75% of lifetime, stores the rotated refresh token atomically with the
      access token, and a refresh failure raises `connection.action_required`.
      _Needs:_ the 75% scheduling math is generic and proven —
      `packages/connectors/src/oauth.test.ts`, describe `refreshDueAt`, test `lands at the
      configured fraction of the lifetime` (passing) — and `authorization()` in `connector.ts`
      declares `refreshAtLifetimeFraction: 0.75`, so the number that formula receives is correct.
      But no test calls `connector.refreshCredential()` for X at all, so atomic storage of the
      rotated pair and the failure-escalation path are unproven for this connector specifically.
- [x] Credentials are stored through the envelope-encrypted vault with AAD binding
      (`04-auth-oauth-and-security.md` section 11). Evidence: a test asserting a ciphertext moved
      to another connection row fails to decrypt.
      _Evidence:_ `packages/connectors/src/vault.test.ts`, describe `CredentialVault`, test
      `refuses a ciphertext moved to another connection row` (passing) — this is the exact evidence
      the item names. The vault is provider-agnostic: its AAD includes `provider`, `connectionId`
      and `credentialKind` uniformly for every connector, X included, so this evidence applies
      directly rather than by analogy.
- [ ] No token appears in any Temporal workflow history. Evidence: the automated history scan test.
      _Needs:_ no test with this description was found anywhere in the repository (searched
      `apps/worker/src` and `packages/` for "history scan" / "workflow history" token-redaction
      tests). This evidence does not yet exist for any connector, X included.

## 3. Capability contract and validation

- [x] `getCapabilities` returns a schema-valid `CapabilitySnapshot` including every field, with
      correct use of `supported`, `unsupported`, `not_implemented` and `requires_permission`.
      _Evidence:_ `packages/connectors/src/contract.test.ts`, the shared `describe.each` block
      `$provider connector satisfies the contract` for `provider: 'x'`, test `returns a schema
      valid capability snapshot` (passing), backed by `buildXCapabilities` in `capabilities.ts`
      degrading fields honestly per granted scope (tested in `X capability snapshot` →
      `degrades to requires_review when the write scope was not granted`).
      **Terminology note for the reviewer:** the actual `CapabilitySupport` enum in
      `packages/contracts/src/enums.ts` is `['supported', 'unsupported', 'not_implemented',
      'requires_review']` — there is no `requires_permission` value anywhere in the type system.
      X's capability snapshot uses `requires_review` everywhere this item's prose says
      `requires_permission` (e.g. `contentKinds.long_video`, `destinations[0].support`,
      `mentions.support`). This looks like a naming drift between this gate document and the
      implemented contract that a human should reconcile (rename one or the other), not a
      functional gap — the four-state honesty the item is really asking for is present.
- [ ] The three comment capabilities are declared **separately and truthfully**:
      schedule a first comment; read a comment count; fetch and reply to individual comments.
      Reviewer confirms each against the provider's official documentation, not against a guess.
      _Needs:_ the three are declared distinctly in `identity()` (`first_comment: 'supported'`,
      `comment_count: 'supported'`, `comment_replies: 'not_implemented'`) and in `README.md`'s "The
      three comment capabilities" table, but the item explicitly requires a reviewer who is not the
      implementer to independently re-confirm each against X's current official docs — code cannot
      supply that.
- [ ] No limit used by the product is hard-coded outside `packages/connectors`. Evidence: the lint
      rule passes.
      _Needs:_ no such lint rule was found anywhere in the repository (searched for ESLint config
      and rule files under this name). This evidence does not exist yet for any connector.
- [ ] The snapshot version is stored on the approved content version, and dispatch revalidates
      against a fresh snapshot.
      _Needs:_ `packages/application` / content-version concern, outside this connector's code.
- [ ] A capability that changed between approval and dispatch stops the publish with
      `USER_ACTION_REQUIRED` naming the capability. Evidence: simulator scenario passes.
      _Needs:_ the generic mechanism exists and passes —
      `packages/connectors/src/capability-diff.test.ts`, describe `diffCapabilities`, test
      `requires reapproval when a capability the content uses regressed`, and describe
      `capabilityDriftError`, test `names the changed capability and the remediation` (both
      passing) — but it is provider-agnostic (built from a fake snapshot, not X's), and the
      observed outcome names are `CAPABILITY_UNSUPPORTED` / `CONNECTION_ACTION_REQUIRED` as
      `RelayError` codes and `validation_needed` / `action_required` as workflow states (seen in
      `apps/worker/src/chaos/duplicate-publication.test.ts`), not literally the six-class
      `USER_ACTION_REQUIRED` string this item names. A reviewer should confirm the naming maps the
      way this item assumes before checking it off.
- [ ] `validateDraft` produces a typed issue with a stable code, a user-safe message key and the
      exact field for every limit in the snapshot. Evidence: one test per limit.
      _Needs:_ several individual limits do have a dedicated test —
      `x/connector.test.ts` `X validateDraft` → `reports the exact overflow for a post past the
      limit` (`TEXT_TOO_LONG`) and `rejects an animated GIF combined with another image`
      (`GIF_MUST_BE_ONLY_MEDIA`) — but "one test per limit" is a claim about every field in the
      capability snapshot (image count, video duration, byte ceilings per media kind, and more),
      and no such exhaustive set exists for X.
- [ ] The composer counter, the API validation response and the MCP `validate_post` tool all return
      the same issues for the same draft. Evidence: a cross-surface test.
      _Needs:_ `apps/web`, `apps/api`, `apps/mcp` concern, outside `packages/connectors`.
- [ ] Where the provider requires a user decision (for example a TikTok privacy selection), an
      unset value is a validation **error**, and there is no default.
      _Needs:_ X has no privacy selector at all (`privacy: NO_PRIVACY_CHOICE` in
      `capabilities.ts`), so this item's precondition may simply not arise for X. Confirming that
      is a policy judgment, not a code fact, so this is left unchecked rather than marked N/A.

## 4. Publishing

- [ ] At least one production content type publishes end to end against the provider's real API
      from the canary account.
      _Needs:_ live canary account, cannot be produced by code.
- [ ] Status confirmation is implemented: `getStatus` returns `processing`, `published`, `failed`
      or `unknown`, and a container or upload acceptance is never reported as published.
      _Needs:_ `getStatus` in `connector.ts` implements all four states (see the 404→`failed`,
      200→`published`, and no-id→`unknown` branches), and the generic contract suite exercises it
      with schema validation (`contract.test.ts`, `$provider connector satisfies the contract` for
      `x`, test `returns a schema valid publish result and status`). But `x/connector.test.ts`
      itself only directly tests the `unknown` branch (`refuses to report a status without a post
      id to poll`); the `failed` (404) and processing-vs-published distinctions are not exercised
      by a dedicated X test the way they are for Bluesky (`reports a deleted post as failed rather
      than unknown`). Partial coverage, not full.
- [x] Idempotency: the provider's idempotency mechanism is used where one exists. Where it does
      not, `getStatus` or an external-ID query runs **before** any retry of a create.
      _Evidence:_ X has no provider idempotency token (`provider_idempotency: 'unsupported'` in
      `identity()`). `connector.ts` `publish()` calls `findRecentMatchingPost` — a query for a
      matching post in the last 30 minutes — **before** every create, exactly as this item
      requires. Proven directly: `x/connector.test.ts`, describe `X publish`, test `adopts an
      existing post instead of creating a duplicate` (passing; asserts zero `POST` calls were made
      when a matching post was already found).
- [ ] Duplicate-publication chaos tests pass: worker crash after the provider accepted, provider
      timeout, duplicated webhook, revoked token at execution, DST transition. All assert zero
      duplicate creates.
      _Needs:_ the full chaos suite exists and passes
      (`apps/worker/src/chaos/duplicate-publication.test.ts`, every case green as of this review),
      but every case runs against the `fake` provider and a simulated activity gateway, not
      `createXConnector`. No chaos scenario is parametrized with the real X connector wired in, so
      this cannot be checked for X specifically yet, despite the generic mechanism (and X's own
      `findRecentMatchingPost` preflight, checked above) both being sound.
- [x] Partial success is handled honestly: a failed thread part or first comment leaves the root
      published, sets `Partially published`, and never rolls back a successful external post.
      _Evidence:_ `x/connector.test.ts`, describe `X publish`, test `keeps the root published when
      a thread part fails` (passing) — asserts `result.status === 'partial'`, the root item is
      still present with its real external post id, and the failure carries
      `remediationCode: 'comment_failed_root_published'`.
- [ ] Cancel, pause and reschedule work as explicit workflow signals.
      _Needs:_ worker/workflow concern; the generic chaos suite covers cancel/reschedule signals
      against the `fake` provider only, not parametrized per connector.
- [ ] Media preparation is idempotent on `(asset, connection, variant)`; a retry does not re-upload.
      _Needs:_ concrete gap, not just missing evidence: `providers/x/connector.ts` line 360 sets
      `reusedFromPreviousAttempt: false` unconditionally on every `PreparedMedia` result — the
      field is never derived from an actual dedup check. No reuse-detection logic exists in this
      connector today.
- [ ] Where the provider pulls media from a URL, the URL is on a verified owned domain and is
      short-lived.
      _Needs:_ asset/storage-service concern, outside `packages/connectors`.
- [ ] No Post Array watermark, logo or promotional marking is added to any published content.
      _Needs:_ no test asserts this, and proving a negative across the whole media pipeline (not
      just this connector) is broader than one file or one test can settle.

## 5. Publication receipt

All three items are `packages/application` / database concerns, not connector code, and are left
unchecked. The one piece of supporting (not sufficient) evidence found:
`apps/worker/src/chaos/duplicate-publication.test.ts`, describe `chaos: duplicated provider
webhook`, test `writes exactly one receipt when the write is reached twice` proves the shared
receipt-write path is idempotent, but it does not touch X, and it does not prove the full field
list this section requires.

- [ ] Every successful publish writes an immutable receipt containing: provider, account, external
      post ID, permalink where available, content and media version plus checksum, scheduled local
      time and IANA time zone, actual dispatch and publish instants, creation surface (web, API,
      MCP, CLI, RSS, automation rule), the human or policy approval, provider cost estimate and
      actual charge where applicable, attempt history with sanitized responses, each delayed comment
      or thread item, and the latest analytics sync time.
- [ ] Where the provider returns no permalink, the receipt says `unavailable` with the reason. It
      does not fabricate a URL.
- [ ] An audit event accompanies every receipt and names the actor.

## 6. Error handling and remediation

- [x] Every provider error observed in fixtures and in the simulator classifies into exactly one of
      `USER_ACTION_REQUIRED`, `CONTENT_INVALID`, `TRANSIENT_PROVIDER`, `PERMANENT_PROVIDER`,
      `INTERNAL`, `UNKNOWN`.
      _Evidence:_ this holds by construction — `classifyProviderError` always returns one of the
      six classes (`packages/connectors/src/errors.ts`, `classifiedProviderErrorSchema` constrains
      the field), proven generically in `errors.test.ts`, describe `the taxonomy`, test `has
      exactly the six classes from the handoff` (passing). Demonstrated against X's own fixtures
      specifically: `x/connector.test.ts` `classifies a duplicate rejection as content invalid, not
      a retryable failure` (X's real 403 duplicate-content shape → `CONTENT_INVALID`) and `keeps
      the root published when a thread part fails` (X's 429 shape → `TRANSIENT_PROVIDER`, via
      `X_RATE_LIMIT_ERROR_FIXTURE`).
- [x] Only known-safe transient operations retry. Nothing else retries automatically.
      _Evidence:_ `errors.test.ts`, describe `classifyProviderError`, test `never marks a publish
      retryable, even when the class is transient` (passing). By design,
      `SIDE_EFFECTING_OPERATIONS` (`errors.ts`) includes `'other'`, and `asProviderOperation`
      defaults any operation name it does not recognise to `'other'` — so X's actual operation
      strings (`x.create_root`, `x.create_reply`, etc., none of which are in the safe
      `PROVIDER_OPERATIONS` allowlist) are non-retryable by default, not by omission.
- [x] Every classified error maps to a remediation code with user-facing copy and, where possible,
      a one-click action. Evidence: the remediation wiring test.
      _Evidence:_ `errors.test.ts`, describe `remediation wiring`, test `gives every remediation
      code a message, an action and a state` (passing) — exactly the evidence this item names.
      This proves every `REMEDIATION_CODES` entry has a `messageKey`, an `actionKey`, an
      `errorCode` and `showsInActionCenter: true`. It does **not** prove that
      `packages/i18n` actually defines translated copy for every one of those keys — that is a
      separate, unverified check.
- [ ] User-facing copy names the affected account and action, preserves the user's content,
      explains what happens next, and contains no em dashes and no provider payload.
      _Needs:_ `packages/i18n` catalog review, outside `packages/connectors`.
- [x] No provider payload, token, internal ID or another tenant's data can appear in a user-facing
      message. Evidence: the sanitizer test, including the "provider echoes the bearer token"
      simulator scenario.
      _Evidence:_ exactly this scenario is tested — `packages/connectors/src/sanitize.test.ts`,
      describe `sanitizeText`, test `removes a bearer token echoed back by a provider` (passing),
      and `errors.test.ts`, describe `classifyProviderError`, test `strips a token the provider
      echoed into the error body` (passing). Both match "Provider echoes a bearer token in an error
      body" in `docs/planning/05-social-connectors.md` section 5.3 verbatim. The sanitizer is
      applied uniformly by `classifyProviderError`, which every connector's error path (including
      X's `providerFailure`/`ensureOk` calls) routes through.
- [ ] Remediation appears in the Action Center, not only as a toast.
      _Needs:_ the `showsInActionCenter: true` data flag exists on every remediation descriptor
      (see above), but no test confirms the Action Center UI (`apps/web`) actually renders from it.
      Data contract proven; UI rendering unverified.

## 7. Analytics

- [ ] Every metric field we display is documented with the provider's field name, the provider's
      definition, the unit, the aggregation rule and the availability condition, in
      `metric_definitions`.
      _Needs:_ no `metric_definitions` artifact (table, file, or registry) was found anywhere in
      the repository. `metrics.ts` documents field mappings in comments and a `MetricFieldMapping`
      structure (`providerField`, `normalizedName`, `unit`, `denominator`), which is close in
      spirit but is not the named `metric_definitions` artifact this item requires, and has no
      "definition" prose field or "aggregation rule" field.
- [ ] Data freshness (last successful sync) is displayed everywhere a number is displayed.
      _Needs:_ `apps/web` UI concern.
- [x] A metric the provider does not return is `unavailable` with a reason. It is never `0` and
      never estimated without a visible label and methodology.
      _Evidence:_ `x/connector.test.ts`, describe `X metrics`, tests `reports a field the access
      tier withheld as unavailable, never as zero` (`availability: 'unavailable_provider'`) and
      `reports permission failures as unavailable_permission` (both passing). `fetchMetrics` in
      `connector.ts` routes every non-2xx response through `mapMetrics` with an explicit
      `missingAvailability` reason rather than defaulting to zero.
- [x] Where the provider restricts deriving or combining data (YouTube in particular), we do not
      compute composite values from API data.
      _Evidence:_ `providers/x/metrics.ts` maps every field 1:1 (`providerField` →
      `normalizedName`, no arithmetic), and `fetchMetrics` in `connector.ts` passes
      `parsed.data.public_metrics` / `non_public_metrics` straight into `mapMetrics` with no
      derived computation. This item names YouTube specifically as the sharpest case, but the same
      discipline (no composite values) holds for X by inspection of the only two places metric
      values are produced.
- [x] Where analytics are genuinely not available for this connector, the connector declares
      `unsupported` or `requires_permission` explicitly rather than shipping an empty screen.
      _Evidence:_ `capabilities.ts`, `buildXCapabilities`: `analytics.support` is explicitly
      `canRead ? 'supported' : 'requires_review'`, never silently blank. (Same `requires_review` /
      `requires_permission` naming note as section 3 applies here.)
- [ ] Post-level and account-level windows offered in the UI match what the provider actually
      returns for this account type.
      _Needs:_ `apps/web` UI concern.

## 8. Rate limits, quota and cost

- [ ] Observed rate limits and quota are recorded in `provider_limits` with reset hints.
      _Needs:_ `provider_limits` is a database table (`packages/application` / `packages/database`
      concern). Supporting evidence only: `readRateLimitHeaders` in `http.ts` parses reset hints
      generically and is tested (`http.test.ts`, describe `readRateLimitHeaders`), but persistence
      to the named table is unverified here.
- [x] Backoff uses exponential delay with jitter and respects any provider reset hint.
      _Evidence:_ `packages/connectors/src/http.test.ts`, describe `ProviderHttpClient`, test
      `bounds the backoff and honours a provider reset hint` (passing) — asserts full-jitter
      exponential backoff bounded at 30 seconds and an exact 5-second wait when the provider hints
      5. Every connector, X included, issues requests through this same `ProviderHttpClient`, so
      the guarantee is not X-specific but applies to it directly and uniformly.
- [ ] Remaining budget or quota is visible in the connection panel where the provider exposes it,
      labelled "observed" when the provider does not publish the number.
      _Needs:_ `apps/web` UI concern.
- [ ] For metered providers, a cost estimate is shown in the composer, in the schedule confirmation
      and in any bulk or Automation Rule preview, and the actual reconciled cost appears on the
      receipt. Usage events are emitted to Polar.
      _Needs:_ the cost model itself is proven at the connector layer (see the X-specific item
      below and `cost.test.ts`), and `validateDraft`/`publish` both return the estimate
      (`estimatedCostMinor`, `costMinor`). But whether it is actually rendered in the composer,
      schedule confirmation and bulk preview, and whether usage events reach `packages/billing`
      (Polar), are outside `packages/connectors` and unverified here.
- [x] For X specifically: the estimate distinguishes a plain post create from a post create
      containing a URL, and link-heavy bulk jobs produce a prominent warning. No copy anywhere
      promises unlimited posting for a metered provider.
      _Evidence:_ `providers/x/cost.ts` prices `X_MICRO_PER_CREATE` ($0.015) separately from
      `X_MICRO_PER_URL_CREATE` ($0.200); proven in `cost.test.ts` (`prices a post containing a URL
      at the materially higher URL rate`) and `connector.test.ts` (`charges the higher URL create
      price for every operation that carries a link`, asserting an exact `costMinor: 22` for a
      mixed thread). The link-heavy warning is proven in `cost.test.ts`
      (`flags a link heavy campaign so the warning reaches the composer`) and wired into
      `validateDraft` as the `X_LINK_HEAVY_CAMPAIGN` warning issue. A repository-wide search for
      "unlimited" in `packages/i18n` found no X-related or posting-related match (only unrelated
      "unlimited team members / drafts" billing-plan copy), which is supporting but not conclusive
      evidence — a grep is not a test. Whether the warning actually reaches the composer/bulk UI is
      outside `packages/connectors`.
- [ ] Quota exhaustion produces `Retry scheduled` with an honest next-window time, not `Failed`.
      _Needs:_ 429 classification with `retryAfterSeconds` is proven at the connector/error layer
      (section 6), but the actual `Retry scheduled` surface state is a worker/UI concern.

## 9. Anti-spam and policy controls

- [ ] The shared deterministic preflight runs for this connector: duplicate fingerprint,
      cross-account similarity, mention, hashtag and link-domain counts, cadence budgets,
      new-account and new-domain escalation, repeat limits.
      _Needs:_ this preflight, if it exists, lives in `packages/application`, not
      `packages/connectors/src/providers/x`. Not found or verified in this review's scope.
- [ ] This provider's specific operating rules from `docs/research/05-trust-safety-and-legal.md`
      section 5 are implemented and listed in the runbook, each with an implementation reference.
      _Needs:_ no `docs/connectors/x/runbook.md` exists (section 11).
- [ ] Required disclosures are implemented: AI or altered-content declaration, commercial content
      declaration and music rights confirmation, wherever this provider requires them.
      _Needs:_ concrete gap, not just missing evidence: `capabilities.ts` declares
      `disclosure.aiLabel: 'not_implemented'` and `commercialContent: 'unsupported'` — the X API
      exposes an AI-disclosure field per the code comment, but the collection flow has not been
      built.
- [ ] Automation Rules cannot select an action this provider does not permit. The disallowed option
      is absent from the builder, not present and failing.
      _Needs:_ `apps/web` Automation Rule builder concern.
- [x] No automated likes, follows, unsolicited replies or DMs exist for this connector.
      _Evidence:_ structural — the `SocialConnector` interface
      (`packages/connectors/src/providers/shared/contract-shape.ts`) exposes no like, follow, or
      DM method at all, and `identity().features` in `connector.ts` never turns any such feature on
      (it only ever spreads `NOT_IMPLEMENTED_FEATURES` and sets the specific publishing-related
      features this connector implements). There is no code path through which an automated like,
      follow, or DM could occur.
- [ ] Alt text is required or explicitly waived for image posts wherever the platform supports it.
      _Needs:_ concrete gap: `validateDraft` in `connector.ts` calls `validateDraftShape(draft,
      snapshot, { unit: 'weighted', allowMixedMedia: false })` without overriding
      `requireAltText`, so it uses the shared default of `false`
      (`providers/shared/validate.ts` line 26). A missing alt text on an X image post is only ever
      a `warning`, never a blocking `error`, and there is no explicit "waive" affordance the way
      Bluesky has (`altTextWaived`). This satisfies neither half of the item ("required" or
      "explicitly waived") — it is silently optional today.

## 10. Testing

- [x] Recorded, redacted fixtures exist with capture date and API version, and contain no secret.
      _Evidence:_ `packages/connectors/src/providers/x/__fixtures__/index.ts`, header comment:
      "Every id, handle and URL below is fabricated. Nothing token shaped appears in this file,
      which is enforced by the repository secret scan. Shapes follow the official X API v2
      documentation retrieved 4 August 2026." Capture date, API version reference, and no-secret
      claim are all present in the file itself.
- [ ] A provider simulator exists and can produce every scenario in
      `docs/planning/05-social-connectors.md` section 5.3.
      _Needs:_ a simulator exists (`providers/shared/testing.ts`, explicitly documented as "the
      'provider simulator' the test strategy asks for") and its `ScriptedRoute` mechanism (status
      code, body, `once`, `transportError`) can technically produce any of the 14 scenarios that
      section lists. But not all 14 have an actual X-parametrized test today: confirmed present for
      X are happy path, duplicate content rejection, and partial success (root published / comment
      rejected); a 429-with-reset-hint scenario is tested generically but not through X's own
      routes; container polling, mid-flow token expiry, and capability-drift-at-dispatch scenarios
      were not found wired to X specifically. Partial, not full, coverage.
- [x] The shared connector contract suite passes **unmodified** against both fixtures and the
      simulator.
      _Evidence:_ `packages/connectors/src/contract.test.ts`, `describe.each(buildConnectorContractCases())`
      includes `provider: 'x'` (`contract.harness.ts`, `CONTRACT_HARNESS_PROVIDERS`), and every
      one of its nine generic assertions passed when the full suite was run in this review
      (`pnpm --filter @relay/connectors test`, 500/500 passing). The suite is identical for every
      provider in the harness — X does not get a special case.
- [x] No test in this connector touches a live provider network.
      _Evidence:_ `providers/shared/testing.ts` states explicitly: "There is no network here and
      there never will be: every route is answered from a scripted table." The full 500-test suite
      (35 files) ran in 2.45 seconds, consistent with zero real network I/O. `AGENTS.md`'s
      "Testing" section makes this a repository-wide rule, and no `fetch`/real-HTTP call was found
      in `x/connector.test.ts` or `cost.test.ts`.
- [ ] A canary account exists, publishes on the agreed cadence, reads back, fetches metrics and
      cleans up, and a canary failure opens an incident and marks the connector degraded.
      _Needs:_ live account, cannot be produced by code.
- [ ] Temporal replay tests pass for every workflow this connector participates in.
      _Needs:_ `apps/worker/src/testing/replay.test.ts` exists and presumably passes (part of the
      broader worker suite, not re-run in this connectors-scoped review), but it is not
      parametrized per connector; it cannot be cited as X-specific evidence without re-checking
      that file's scope, which was outside this review's boundary
      (`packages/connectors/src/providers/x/`).
- [ ] End-to-end browser test covers connect, compose, approve, schedule, publish, fail, recover and
      disconnect for this connector.
      _Needs:_ no such test was found in this review's scope.

## 11. Documentation and operations

- [ ] A connector runbook exists at `docs/connectors/<provider>/runbook.md` containing: official
      API and policy URLs with dates, the scope-by-scope justification, the approval status and
      history, known limitations, the top five failure modes with their remediation, the canary
      procedure, the rate-limit and quota profile, and the escalation contact at the provider if
      one exists.
      _Needs:_ `docs/connectors/x/runbook.md` does not exist. `packages/connectors/src/providers/x/README.md`
      covers some of the same ground (docs table, scopes table, cost model, rate limits) but is not
      the file this item names, and does not cover failure modes, canary procedure, or an
      escalation contact.
- [ ] A status page component exists for this connector and is wired to real health signals, not to
      a manual toggle alone.
      _Needs:_ `apps/web` concern, not found in this review's scope.
- [ ] The public capability page entry is generated from the versioned connector metadata and has
      been manually reviewed before publication.
      _Needs:_ the generation half is real and tested —
      `packages/connectors/src/marketing-limits-grid.test.ts` and `marketing-capability-grid.test.ts`
      compare the committed `apps/web/src/features/marketing/data/publishing-limits.ts` against
      what the live connector registry (including X) actually reports, and this passed as part of
      the full suite run. The "manually reviewed before publication" half is a human step this
      cannot prove.
- [ ] Customer-facing documentation explains what this connector can and cannot do, using the label
      vocabulary above.
      _Needs:_ outside `packages/connectors`; not checked in this review.
- [ ] The marketing capability matrix is updated in the same change, and no marketing copy claims
      anything not checked in this document.
      _Needs:_ human/product review step.

## 12. Ownership and review

- [ ] A named engineering owner is assigned and recorded in `identity()`.
      _Needs:_ `identity()` in `connector.ts` records `engineeringOwner: 'Backend/Connectors 1'` —
      a team/pod label, not a named individual. This does not literally satisfy "named."
- [ ] A named policy owner is assigned and recorded in `identity()`.
      _Needs:_ `identity()` records `policyOwner: 'Policy Owner'` — a placeholder string, not a
      name.
- [ ] The last policy review date is recorded in `identity()` and in the runbook front matter.
      _Needs:_ half satisfied: `identity()` records `lastPolicyReviewAt:
      '2026-08-04T00:00:00.000Z'` (from `SOURCE_VERIFIED_ON`). The other half fails: no runbook
      exists (section 11), so there is no front matter to record it in.
- [ ] A next review date is set. Default cadence: every 90 days, and immediately on any provider
      rejection, enforcement notice, SDK deprecation, or unexplained publishing or analytics change.
      _Needs:_ a date is set — `identity()` records `nextPolicyReviewAt: '2027-02-04T00:00:00.000Z'`
      — but that is six months (184 days) after `lastPolicyReviewAt` (2026-08-04), not the 90-day
      default cadence this item specifies. Worth flagging for the reviewer to either correct the
      constant or record a dated exception.
- [ ] A source-register row exists for every provider claim this connector relies on, with URL,
      retrieved date, version, owner and next review date.
      _Needs:_ `docs/research/06-source-register.md` has an "## X" section with four URLs, but its
      table only has `Source | Type | Used for` columns — no retrieved-date, version, owner, or
      next-review-date column is populated for any row, despite the document's own "Recheck
      schedule" section describing that as the required shape.

---

## Reviewer notes

Record anything that was checked with a caveat, anything deliberately deferred, and the evidence
you actually opened. A reviewer who checked boxes without opening artifacts has produced no value.

```
Item:
Finding:
Decision (accept / fix before sign-off / accept with a dated exception):
```

---

## Sign-off

The connector may be labelled `supported` only when both signatures are present, the label
requested at the top is `supported`, and no mandatory item above is unchecked.

If any mandatory item is unchecked, the connector ships as `beta` with the specific limitation
displayed to users before they connect. Write the limitation here verbatim, in product voice, with
no em dashes:

```
Displayed limitation (beta only):
```

| Role | Name | Signature or commit SHA | Date |
| --- | --- | --- | --- |
| Engineering owner | | | |
| Policy owner | | | |
| Independent reviewer | | | |

**Next review date:** ____________________

**Exceptions accepted** (each needs an owner, a reason and an expiry date; an expired exception
returns the connector to `beta` automatically):

| Item | Reason | Accepted by | Expires |
| --- | --- | --- | --- |
| | | | |
