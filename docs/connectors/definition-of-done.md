# Connector Definition of Done

**This is a gate, not a guideline.** Until every mandatory item below is checked and the sign-off
block at the end is complete, the connector may not be described as "supported" in the product, on
the website, in documentation, in a sales conversation, in a changelog entry or in a social post.

Basis: `docs/research/02-development-handoff.md` section 17 ("Connector definition of done") and
`docs/research/05-trust-safety-and-legal.md` section 12 ("Approval checklist before enabling a
connector"). Detail and rationale: `docs/planning/05-social-connectors.md`.

## How to use this document

1. Copy this file to `docs/connectors/<provider>/definition-of-done.md` when a connector starts.
2. The engineering owner fills it in as work completes. Do not pre-check items.
3. A reviewer who is **not** the engineering owner independently verifies every checked item by
   running the stated evidence command or opening the stated artifact. "The owner said so" is not
   verification.
4. Both named owners sign the block at the end with a real date.
5. Set the next review date. A connector whose review date has passed reverts to `beta` on the
   public capability page automatically until it is reviewed again.

## Label vocabulary (get this right or the whole gate is pointless)

| Label | Meaning | May we say "supported"? |
| --- | --- | --- |
| `supported` | Every mandatory item below is checked and signed | Yes |
| `beta` | Working, but at least one mandatory item is open, or the provider approval is incomplete, and the exact limitation is shown before the user connects | No. Say "beta" and name the limitation |
| `not_implemented` | The provider offers this; we have not built it | No |
| `unsupported` | The provider does not offer this | No, and never imply it is coming |
| `requires_permission` | The provider offers it; this connection lacks the scope, role or approval | No, and show the exact remediation |

---

## Connector under review

| Field | Value |
| --- | --- |
| Provider | |
| Connector version | |
| Contract version implemented | |
| Engineering owner | |
| Policy owner | |
| Review date | |
| Next review date | |
| Current label being requested | `supported` / `beta` |

---

## 1. Production authentication and review status

- [ ] The provider's official API documentation URL and official policy URL are recorded in the
      connector runbook with a retrieval date and the API or policy version.
- [ ] Production application status is recorded and is one of: approved; approved with a named
      limitation; or pending with a date. Evidence: a link or screenshot in the runbook.
- [ ] If approval is **not** complete, the exact limitation is displayed to the user **before**
      they start the OAuth flow, in the composer, and on the public capability page. Reviewer must
      see all three.
- [ ] The scopes we request are the minimum for shipped features. Every requested scope maps to a
      named screen in the product. No scope is requested for a future feature.
- [ ] Login OAuth and publisher OAuth use separate applications and separate credentials
      (`docs/planning/04-auth-oauth-and-security.md` section 6).
- [ ] Terms, Privacy Policy, Acceptable Use Policy, AI Policy, data deletion instructions and a
      support contact are published and satisfy this provider's review requirements.
- [ ] Account type and feature limitations appear before OAuth and again in the composer.

## 2. Connection lifecycle

- [ ] `discoverAccounts` returns every eligible external identity and the user chooses explicitly.
      Nothing is auto-connected.
- [ ] Connecting the same external account twice in one workspace is prevented by the
      `(provider, external_account_id, workspace_id)` uniqueness constraint, with a clear message.
- [ ] Reconnect preserves history: content, receipts and analytics survive a reconnect and are not
      orphaned.
- [ ] Disconnect calls the provider revoke endpoint where one exists, deletes our stored credential
      regardless of the provider call's outcome, and cancels or explicitly surfaces any scheduled
      jobs that depended on it.
- [ ] Pause is available and stops dispatch without deleting the connection.
- [ ] Token refresh runs at 75% of lifetime, stores the rotated refresh token atomically with the
      access token, and a refresh failure raises `connection.action_required`.
- [ ] Credentials are stored through the envelope-encrypted vault with AAD binding
      (`04-auth-oauth-and-security.md` section 11). Evidence: a test asserting a ciphertext moved
      to another connection row fails to decrypt.
- [ ] No token appears in any Temporal workflow history. Evidence: the automated history scan test.

## 3. Capability contract and validation

- [ ] `getCapabilities` returns a schema-valid `CapabilitySnapshot` including every field, with
      correct use of `supported`, `unsupported`, `not_implemented` and `requires_permission`.
- [ ] The three comment capabilities are declared **separately and truthfully**:
      schedule a first comment; read a comment count; fetch and reply to individual comments.
      Reviewer confirms each against the provider's official documentation, not against a guess.
- [ ] No limit used by the product is hard-coded outside `packages/connectors`. Evidence: the lint
      rule passes.
- [ ] The snapshot version is stored on the approved content version, and dispatch revalidates
      against a fresh snapshot.
- [ ] A capability that changed between approval and dispatch stops the publish with
      `USER_ACTION_REQUIRED` naming the capability. Evidence: simulator scenario passes.
- [ ] `validateDraft` produces a typed issue with a stable code, a user-safe message key and the
      exact field for every limit in the snapshot. Evidence: one test per limit.
- [ ] The composer counter, the API validation response and the MCP `validate_post` tool all return
      the same issues for the same draft. Evidence: a cross-surface test.
- [ ] Where the provider requires a user decision (for example a TikTok privacy selection), an
      unset value is a validation **error**, and there is no default.

## 4. Publishing

- [ ] At least one production content type publishes end to end against the provider's real API
      from the canary account.
- [ ] Status confirmation is implemented: `getStatus` returns `processing`, `published`, `failed`
      or `unknown`, and a container or upload acceptance is never reported as published.
- [ ] Idempotency: the provider's idempotency mechanism is used where one exists. Where it does
      not, `getStatus` or an external-ID query runs **before** any retry of a create.
- [ ] Duplicate-publication chaos tests pass: worker crash after the provider accepted, provider
      timeout, duplicated webhook, revoked token at execution, DST transition. All assert zero
      duplicate creates.
- [ ] Partial success is handled honestly: a failed thread part or first comment leaves the root
      published, sets `Partially published`, and never rolls back a successful external post.
- [ ] Cancel, pause and reschedule work as explicit workflow signals.
- [ ] Media preparation is idempotent on `(asset, connection, variant)`; a retry does not re-upload.
- [ ] Where the provider pulls media from a URL, the URL is on a verified owned domain and is
      short-lived.
- [ ] No Post Array watermark, logo or promotional marking is added to any published content.

## 5. Publication receipt

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

- [ ] Every provider error observed in fixtures and in the simulator classifies into exactly one of
      `USER_ACTION_REQUIRED`, `CONTENT_INVALID`, `TRANSIENT_PROVIDER`, `PERMANENT_PROVIDER`,
      `INTERNAL`, `UNKNOWN`.
- [ ] Only known-safe transient operations retry. Nothing else retries automatically.
- [ ] Every classified error maps to a remediation code with user-facing copy and, where possible,
      a one-click action. Evidence: the remediation wiring test.
- [ ] User-facing copy names the affected account and action, preserves the user's content,
      explains what happens next, and contains no em dashes and no provider payload.
- [ ] No provider payload, token, internal ID or another tenant's data can appear in a user-facing
      message. Evidence: the sanitizer test, including the "provider echoes the bearer token"
      simulator scenario.
- [ ] Remediation appears in the Action Center, not only as a toast.

## 7. Analytics

- [ ] Every metric field we display is documented with the provider's field name, the provider's
      definition, the unit, the aggregation rule and the availability condition, in
      `metric_definitions`.
- [ ] Data freshness (last successful sync) is displayed everywhere a number is displayed.
- [ ] A metric the provider does not return is `unavailable` with a reason. It is never `0` and
      never estimated without a visible label and methodology.
- [ ] Where the provider restricts deriving or combining data (YouTube in particular), we do not
      compute composite values from API data.
- [ ] Where analytics are genuinely not available for this connector, the connector declares
      `unsupported` or `requires_permission` explicitly rather than shipping an empty screen.
- [ ] Post-level and account-level windows offered in the UI match what the provider actually
      returns for this account type.

## 8. Rate limits, quota and cost

- [ ] Observed rate limits and quota are recorded in `provider_limits` with reset hints.
- [ ] Backoff uses exponential delay with jitter and respects any provider reset hint.
- [ ] Remaining budget or quota is visible in the connection panel where the provider exposes it,
      labelled "observed" when the provider does not publish the number.
- [ ] For metered providers, a cost estimate is shown in the composer, in the schedule confirmation
      and in any bulk or Automation Rule preview, and the actual reconciled cost appears on the
      receipt. Usage events are emitted to Polar.
- [ ] For X specifically: the estimate distinguishes a plain post create from a post create
      containing a URL, and link-heavy bulk jobs produce a prominent warning. No copy anywhere
      promises unlimited posting for a metered provider.
- [ ] Quota exhaustion produces `Retry scheduled` with an honest next-window time, not `Failed`.

## 9. Anti-spam and policy controls

- [ ] The shared deterministic preflight runs for this connector: duplicate fingerprint,
      cross-account similarity, mention, hashtag and link-domain counts, cadence budgets,
      new-account and new-domain escalation, repeat limits.
- [ ] This provider's specific operating rules from `docs/research/05-trust-safety-and-legal.md`
      section 5 are implemented and listed in the runbook, each with an implementation reference.
- [ ] Required disclosures are implemented: AI or altered-content declaration, commercial content
      declaration and music rights confirmation, wherever this provider requires them.
- [ ] Automation Rules cannot select an action this provider does not permit. The disallowed option
      is absent from the builder, not present and failing.
- [ ] No automated likes, follows, unsolicited replies or DMs exist for this connector.
- [ ] Alt text is required or explicitly waived for image posts wherever the platform supports it.

## 10. Testing

- [ ] Recorded, redacted fixtures exist with capture date and API version, and contain no secret.
- [ ] A provider simulator exists and can produce every scenario in
      `docs/planning/05-social-connectors.md` section 5.3.
- [ ] The shared connector contract suite passes **unmodified** against both fixtures and the
      simulator.
- [ ] No test in this connector touches a live provider network.
- [ ] A canary account exists, publishes on the agreed cadence, reads back, fetches metrics and
      cleans up, and a canary failure opens an incident and marks the connector degraded.
- [ ] Temporal replay tests pass for every workflow this connector participates in.
- [ ] End-to-end browser test covers connect, compose, approve, schedule, publish, fail, recover and
      disconnect for this connector.

## 11. Documentation and operations

- [ ] A connector runbook exists at `docs/connectors/<provider>/runbook.md` containing: official
      API and policy URLs with dates, the scope-by-scope justification, the approval status and
      history, known limitations, the top five failure modes with their remediation, the canary
      procedure, the rate-limit and quota profile, and the escalation contact at the provider if
      one exists.
- [ ] A status page component exists for this connector and is wired to real health signals, not to
      a manual toggle alone.
- [ ] The public capability page entry is generated from the versioned connector metadata and has
      been manually reviewed before publication.
- [ ] Customer-facing documentation explains what this connector can and cannot do, using the label
      vocabulary above.
- [ ] The marketing capability matrix is updated in the same change, and no marketing copy claims
      anything not checked in this document.

## 12. Ownership and review

- [ ] A named engineering owner is assigned and recorded in `identity()`.
- [ ] A named policy owner is assigned and recorded in `identity()`.
- [ ] The last policy review date is recorded in `identity()` and in the runbook front matter.
- [ ] A next review date is set. Default cadence: every 90 days, and immediately on any provider
      rejection, enforcement notice, SDK deprecation, or unexplained publishing or analytics change.
- [ ] A source-register row exists for every provider claim this connector relies on, with URL,
      retrieved date, version, owner and next review date.

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
