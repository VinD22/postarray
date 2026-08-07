# @relay/connectors

The connector layer: one versioned contract, one registry, one HTTP client, one
error taxonomy, one credential vault, and one fake provider that needs no keys.

A connector translates between our domain and exactly one provider. It owns no
business logic. Scheduling, approval, cadence, duplicate policy, receipts and
audit live in `packages/application`. A connector never imports
`@relay/application` or `@relay/database`, and it never retries on its own:
it classifies the failure and returns, and Temporal owns the retry policy.

## What is in here

| Module | Responsibility |
| --- | --- |
| `contract.ts` | `SocialConnector`, every input and output type, all zod validated |
| `registry.ts` | Registration, lookup, availability, and the per feature support matrix |
| `http.ts` | Timeouts, bounded retries with jitter, rate limit awareness, redaction |
| `ssrf.ts` | The SSRF safe fetch guard, exported on its own for media import and RSS |
| `errors.ts` | The six class taxonomy and one remediation per case |
| `sanitize.ts` | Provider payload and header sanitizing, used before any log or store |
| `oauth.ts` | Authorization code with PKCE, state, exact redirect matching, refresh, revoke |
| `vault.ts` | Envelope encryption, `decryptForRequest()`, key rotation and re-encryption |
| `idempotency.ts` | `ensureNotAlreadyPublished()`, the duplicate publication guard |
| `capability-diff.ts` | Approval drift: proceed, warn, require reapproval or block |
| `fake/` | A complete fake provider with switchable failure modes |
| `providers/` | The real adapters, one directory per provider |

## The five rules an adapter must not break

1. **Official APIs only.** No browser automation, no cookie replay, no scraping,
   no unofficial posting endpoints. A connector built any other way is deleted,
   not fixed.
2. **`unsupported` and `not_implemented` are different.** `unsupported` means the
   provider does not offer it. `not_implemented` means we have not built it. The
   registry keeps them apart and registration fails if a declaration disagrees
   with the methods that actually exist.
3. **`unavailable` is not `0`.** A metric we could not fetch is `unavailable`
   with a reason.
4. **Published means external evidence.** An external post ID, a provider status
   of complete, or a permalink. A `2xx` from a media container step is not
   published, and `publishStatusSchema` refuses to encode one as such.
5. **Every write is idempotent.** Use the provider's mechanism where one exists.
   Where it does not, call `ensureNotAlreadyPublished()` before repeating a
   create. This is mandatory, not an optimization.

## Adding a provider

Work inside `src/providers/<provider>/`. Nothing outside that directory should
need to change except the barrel in `src/providers/index.ts`.

### 1. Read the official documentation and record it

Open the provider's own API and policy documents, note the version and the
retrieval date, and add a row to `docs/research/06-source-register.md`. Every
number you are about to encode comes from there, never from a blog post and
never from another product's source.

### 2. Declare the identity honestly

```ts
identity(): ProviderIdentity {
  return {
    provider: 'example',
    displayName: 'Example',
    iconToken: 'provider.example',
    accountTypes: ['page'],
    contractVersion: CONNECTOR_CONTRACT_VERSION,
    connectorVersion: '0.1.0',
    label: 'beta',                       // `supported` needs a signed gate
    limitationKey: 'error.connection_review_pending.message',
    officialDocsUrl: '...',
    officialPolicyUrl: '...',
    engineeringOwner: 'Backend/Connectors 1',
    policyOwner: 'Policy Owner',
    lastPolicyReviewAt: '2026-08-04T00:00:00.000Z',
    nextPolicyReviewAt: '2026-11-02T00:00:00.000Z',
    features: { ...NOT_IMPLEMENTED_FEATURES, publish: 'supported' },
  };
}
```

Start from `NOT_IMPLEMENTED_FEATURES` and promote a feature only once it is
built and covered by a test. The registry throws at registration if you declare
`list_destinations: 'supported'` without a `listDestinations` method, and it
throws the other way too: a method you implemented cannot be declared
`unsupported`.

The three comment capabilities are separate fields. Most providers give one or
two. `comment_replies` is `not_implemented` on every connector in V1.

### 3. Build the capability snapshot from the account, not from a constant

`getCapabilities()` returns data, per connection, with an `observedAt`. Every
limit the product uses comes from there. A limit hard-coded in a React component
or an application service is a bug, and a lint rule looks for it.

### 4. Make every external call through the shared client

```ts
const response = await this.http.request({
  method: 'POST',
  url: '/v2/posts',
  body: { kind: 'json', value: payload },
  schema: createPostResponseSchema,   // parse, never cast
  operation: 'publish',
  idempotent: false,                  // a create is never idempotent by default
  auth: { handle: connection.accessToken },
});
```

`idempotent: true` means "repeating this call cannot create a second external
object". Only then does the client retry, and only for `TRANSIENT_PROVIDER`.

For any URL a user supplied, pass `guard: {}` so the SSRF check runs first, or
call `safeFetch()` directly.

### 5. Classify every failure

Register a refiner when the generic HTTP rules are not enough:

```ts
registerProviderErrorRefiner('example', (facts) => {
  if (facts.providerErrorCode === 'PAGE_ROLE_MISSING') {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'page_role_required' };
  }
  return undefined;
});
```

A refiner may only refine. Every remediation code already carries its message
key, its action key and its one click action, so the Action Center gets a
complete item without any extra wiring.

### 6. Never let a token escape

A credential arrives as a `SecretHandle` and is revealed only inside
`handle.use()`. `SecretValue` and `SecretHandle` both serialize to `[redacted]`,
so a token cannot reach a log, a trace, a Temporal history, a receipt or a
client payload by accident. Decryption happens inside a Temporal activity, never
inside a workflow.

### 7. Run the shared contract suite unmodified

`src/contract.test.ts` runs against the fake provider and every adapter listed in
`src/contract.harness.ts` (`CONTRACT_HARNESS_PROVIDERS`). That harness does not
change the production or development verified allow-lists in `@relay/config`.
If your adapter needs the suite changed, the contract is wrong: raise it, do not
override it locally.

Add your own tests for the scenarios in
`docs/planning/05-social-connectors.md` section 5.3: happy path, 429 with and
without a reset hint, 500 then success, timeout after the provider accepted the
create, container stuck, container error, token expired mid flow, permission
revoked between approval and dispatch, capability changed between approval and
dispatch, duplicate rejection, malformed body, a provider that echoes the bearer
token, a 30 second response, and partial success. The fake provider can produce
all of them through `setFailureMode()`, so you have a reference implementation.

No test may touch a live provider network.

## Definition of done

`docs/connectors/definition-of-done.md` is the gate, not a guideline. Copy it to
`docs/connectors/<provider>/definition-of-done.md` when the connector starts,
fill it in as work completes, and have a reviewer who is not the engineering
owner verify each item by opening the stated evidence.

Until every mandatory item is checked and both owners have signed, the connector
ships as `beta` with the exact limitation shown to the user before they connect,
in the composer and on the public capability page. It may not be called
"supported" in the product, on the website, in documentation, in a sales
conversation, in a changelog or in a social post.

The gate covers, in short:

1. Production auth and review status, with least privilege scopes.
2. Connection lifecycle: discover, reconnect, disconnect, pause, refresh at 75%
   of lifetime, vault storage with AAD binding, no token in Temporal history.
3. Capability contract and exact validation, including the three comment
   capabilities declared separately and truthfully.
4. Publishing: real end to end publish, status confirmation, idempotency, the
   duplicate publication chaos tests, honest partial success, media preparation
   idempotent on `(asset, connection, variant)`.
5. An immutable receipt with external ID, permalink or an honest `unavailable`.
6. Error handling: every observed error classified, every classification mapped
   to a remediation with user facing copy and no provider payload.
7. Analytics with definitions and freshness, never a fabricated zero.
8. Rate limits, quota and cost, with a visible estimate for a metered provider.
9. Anti-spam and policy controls, including required disclosures.
10. Tests: fixtures, simulator, the shared contract suite unmodified, a canary.
11. A runbook, a status page component and a generated capability page entry.
12. A named engineering owner, a named policy owner and a next review date.

A connector whose review date has passed drops back to `beta` automatically:
`ConnectorRegistry.describe()` computes `effectiveLabel` from
`nextPolicyReviewAt`, so an expired review changes the product, not just a
spreadsheet.

## The fake provider

```ts
const connector = createFakeConnector({ clock, instant: true });
connector.setFailureMode('timeout_after_accept', 1);
```

It implements every method with realistic limits, deterministic identifiers from
a seed, and these switchable failure modes: `rate_limit`, `expired_token`,
`permission_revoked`, `content_rejected`, `transient_5xx`, `slow_media`,
`container_stuck`, `duplicate_detected`, `partial_thread_failure`,
`malformed_response`, `capability_downgrade` and `timeout_after_accept`.

Its capability snapshot deliberately contains one `unsupported` content kind
(`long_video`), one `not_implemented` content kind (`document`), a metered cost
that is ten times higher when the post contains a URL, and a character limit a
normal draft can exceed. That is what makes the composer, the validator, the
cost estimator, the Action Center and the capability page exercisable with zero
credentials.

`src/fake/fixtures.ts` provides ready made drafts, connections, media and
requests for seeds, tests and the local development loop.

## Reconciling an adapter written against an earlier draft

`src/providers/CONTRACT-ASSUMPTIONS.md` records the surface the first provider
adapters were written against, before this core landed. Most of it is here
verbatim, added on top of the mandated contract rather than instead of it:

| Assumed | Where it lives now |
| --- | --- |
| `HttpClient`, `HttpRequest`, `HttpResponse` | `http.ts`, plus `createHttpClient()` and `ProviderHttpClient.asHttpClient()`. `request` still resolves for every status and throws only on a transport failure |
| `providerFailure`, `ensureOk`, `parseProviderBody`, `REMEDIATION` | `errors.ts` |
| `refreshOAuth2Token`, `OAuth2RefreshInput` | `oauth.ts` |
| `ConnectorVault`, `CredentialRef` | `vault.ts` |
| `ConnectorDeps`, `ConnectorConfig`, `Clock`, `ConnectorLogger`, `ConnectorRegistry` | `contract.ts` |
| `OAuthScopeDefinition`, `ProviderMedia`, `PublishItemResult`, `PreviewEntityRange` | `contract.ts`, as aliases of `ScopeRequest`, `ProviderMediaRef`, `PublishedItem`, `PreviewEntity` |

Three names are genuinely different, because the mandated contract in
`docs/research/02-development-handoff.md` section 7 defines them differently:

- `OAuthGrant` is `OAuthGrantInput`, and its `accessToken` is a `SecretHandle`
  rather than a string. A token never crosses a boundary as a plain string.
- `ProviderConnection` is `ConnectionRef`. It carries `accessToken` (a handle)
  and `grantedScopes` rather than `credentialRef` and `scopes`.
- `PublishRequest` and `PublishStatus` carry `contentFingerprint`,
  `capabilityVersion` and `providerJobId` instead of `resume` and `pollToken`.

Those three are the mechanical edit `CONTRACT-ASSUMPTIONS.md` anticipated, and
`src/providers/shared/contract-shape.ts` is the single file that has to change.
