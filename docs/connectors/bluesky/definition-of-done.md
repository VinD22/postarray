# Bluesky Connector Definition of Done

This dossier applies the repository-wide [connector definition of done](../definition-of-done.md)
to the Phase 2A simulator gate. Checked items are supported by deterministic, offline evidence.
Live-provider and production-operational evidence remains unchecked, so Bluesky is not on the
production verified-connector allow-list.

## Connector under review

| Field | Value |
| --- | --- |
| Provider | Bluesky via the official AT Protocol XRPC API |
| Connector version | `0.1.0` |
| Contract version | Exported `CONNECTOR_CONTRACT_VERSION` |
| Current label | `beta` in development and test only |
| Production status | Not verified |

## Simulator and contract evidence

- [x] The shared connector contract suite runs unchanged for both `fake` and `bluesky`.
      Evidence: `pnpm --filter @relay/connectors test`.
- [x] Account discovery returns a schema-valid Bluesky identity from the recorded session shape.
- [x] Capability, validation, preview, media preparation, publish, status, and metrics results pass
      their shared boundary schemas.
- [x] Authentication/session creation has a fabricated fixture and requires no live network.
- [x] Publish returns a fabricated `at://` URI, CID, commit, and validation status.
- [x] Refresh rotates both access and refresh session credentials in the simulator fixture.
- [x] Revoke calls the AT Protocol session deletion surface in the simulator fixture.
- [x] Expired and revoked credentials use the provider-specific XRPC error envelopes.
- [x] Duplicate rejection uses the provider-specific `InvalidRequest` response fixture.
- [x] Rate-limit responses expose the AT Protocol reset timestamp rather than a fabricated
      `Retry-After` value.
- [x] Returned capability and preview values are checked for credential leakage.
- [x] Development and test capability detection enables Bluesky only through the explicit
      simulator-verified allow-list.
- [x] The production verified-connector allow-list remains empty.

## Live and production evidence

Reviewed 2026-08-19 against the current code and test suite (`pnpm --filter @relay/connectors
test`, 500/500 passing, including `providers/bluesky/connector.test.ts` and
`providers/bluesky/app-password.test.ts`). None of the nine items below can be satisfied by
code alone; each note says exactly what live or human evidence is still missing. Nothing here is
checked without a test I ran myself or a specific line of code that proves it, per the review
instructions, and none of these nine clear that bar today.

- [ ] Official documentation and policy URLs have been independently reviewed and dated.
      _Evidence needed:_ `README.md` and `connector.ts` cite a "4 August 2026" verification date
      recorded by the implementer, not confirmed by a second reviewer. A named reviewer who is not
      the engineering owner (and not an AI agent) must open each URL in `README.md` and
      `docs/research/06-source-register.md`, confirm it still matches the implementation, and
      record their own retrieval date.
- [ ] Production application or account review status has been recorded with evidence.
      _Evidence needed:_ `README.md` states "None required," which is a claim about Bluesky's
      current policy, not a code fact. A human must confirm the AT Protocol developer policy still
      requires no application review and record a source link and date.
- [ ] A live canary account has completed connection, discovery, publish, status, refresh, revoke,
      and reconnect tests against the official service.
      _Evidence needed:_ a real `bsky.social` (or federated PDS) canary account run end to end
      against the live API, with logs. No test in this repo calls the live network
      (`AGENTS.md` "Testing"), so this cannot come from the existing suite.
- [ ] A live canary text post has produced a verified immutable receipt and audit event.
      _Evidence needed:_ the canary account's real text post, plus the resulting
      `publication_receipt` row and audit event inspected in a non-production database.
- [ ] A live canary image post has verified blob upload, alt text, permalink, and status.
      _Evidence needed:_ the canary account publishing a real image with alt text; confirm the
      blob upload, that the permalink resolves, and that `getStatus` reports `published`.
- [ ] Duplicate-publication chaos cases have proved zero duplicate creates across worker crash,
      provider timeout, duplicated webhook, revoked token at execution, and a DST transition.
      _Evidence needed:_ the generic chaos suite exists and currently passes in full
      (`apps/worker/src/chaos/duplicate-publication.test.ts`, all cases green as of this review),
      but every case there runs against the `fake` provider and a simulated activity gateway, not
      `createBlueskyConnector`. Bluesky declares `provider_idempotency: 'unsupported'`
      (`connector.ts` `identity()`), yet, unlike X's `findRecentMatchingPost` preflight
      (`providers/x/connector.ts`), nothing in `bluesky/connector.ts` queries for an existing post
      before a retry, and no test in `bluesky/connector.test.ts` exercises that path. Needed: a
      chaos scenario parametrized with the real Bluesky connector (or a live canary run through the
      same five scenarios), and, if Bluesky is meant to rely on a pre-create probe the way X does,
      the code and a test proving it.
- [ ] Sanitized live error fixtures cover every observed provider error.
      _Evidence needed:_ the XRPC error envelopes already checked above are fabricated simulator
      fixtures, not errors "observed" from the live service. Real (redacted) error responses
      captured from the live API are needed for every error class the connector maps to.
- [ ] Engineering and policy owners have signed the production review and set the next review date.
      _Evidence needed:_ a named engineering owner and a separate named policy owner, each signing
      a dated entry, once the items above are complete. No code or AI review satisfies this.

## Gate decision

- [x] Bluesky may be composed by `createVerifiedConnectorRegistry` in development and test when
      the non-production allow-list permits it.
- [ ] Bluesky may be described as supported or enabled in production.
      _Evidence needed:_ this is a summary conclusion, not an independent fact. It can only flip
      once every item above, and the sign-off block in the repository-wide
      `docs/connectors/definition-of-done.md`, is complete and signed. All eight items above are
      currently open, so this stays unchecked.
