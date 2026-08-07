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

- [ ] Official documentation and policy URLs have been independently reviewed and dated.
- [ ] Production application or account review status has been recorded with evidence.
- [ ] A live canary account has completed connection, discovery, publish, status, refresh, revoke,
      and reconnect tests against the official service.
- [ ] A live canary text post has produced a verified immutable receipt and audit event.
- [ ] A live canary image post has verified blob upload, alt text, permalink, and status.
- [ ] Duplicate-publication chaos cases have proved zero duplicate creates across worker crash,
      provider timeout, duplicated webhook, revoked token at execution, and a DST transition.
- [ ] Sanitized live error fixtures cover every observed provider error.
- [ ] Engineering and policy owners have signed the production review and set the next review date.

## Gate decision

- [x] Bluesky may be composed by `createVerifiedConnectorRegistry` in development and test when
      the non-production allow-list permits it.
- [ ] Bluesky may be described as supported or enabled in production.
