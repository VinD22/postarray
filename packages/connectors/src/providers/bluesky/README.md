# Bluesky connector

**Verification date: 4 August 2026.** Status: launch fallback, and the preferred one,
because it has no approval dependency and can therefore ship on a predictable date
(`docs/planning/05-social-connectors.md` section 6.1).

Engineering owner: Backend/Connectors 2. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| HTTP reference index | https://docs.bsky.app/docs/category/http-reference |
| `com.atproto.server.createSession` | https://docs.bsky.app/docs/api/com-atproto-server-create-session |
| `com.atproto.server.refreshSession` | https://docs.bsky.app/docs/api/com-atproto-server-refresh-session |
| `com.atproto.server.getSession` | https://docs.bsky.app/docs/api/com-atproto-server-get-session |
| `com.atproto.repo.createRecord` | https://docs.bsky.app/docs/api/com-atproto-repo-create-record |
| `com.atproto.repo.deleteRecord` | https://docs.bsky.app/docs/api/com-atproto-repo-delete-record |
| `com.atproto.repo.uploadBlob` | https://docs.bsky.app/docs/api/com-atproto-repo-upload-blob |
| `app.bsky.feed.getPostThread` | https://docs.bsky.app/docs/api/app-bsky-feed-get-post-thread |
| `app.bsky.actor.getProfile` | https://docs.bsky.app/docs/api/app-bsky-actor-get-profile |
| `app.bsky.actor.searchActorsTypeahead` | https://docs.bsky.app/docs/api/app-bsky-actor-search-actors-typeahead |
| Post record lexicon and rich text facets | https://docs.bsky.app/docs/advanced-guides/posts |
| Rate limits | https://docs.bsky.app/docs/advanced-guides/rate-limits |
| App passwords | https://bsky.app/settings/app-passwords |
| Terms of service | https://bsky.social/about/support/tos |

**Open item for the source register:** this row currently lacks a pinned official URL for
the OAuth path. Record the exact URL and its retrieval date when the connector starts.

## Authentication

Use the official AT Protocol OAuth path if it is generally available at implementation
time. Until then the connector uses an app password, and that is a deliberate, documented
choice rather than a shortcut:

- An app password is a **first-class secret in the token vault**, with the same envelope
  encryption and the same handling rules as any OAuth token.
- The connect UI explains what an app password is, that it is not the account password, and
  exactly how to revoke it.
- **We never ask a user for their main account password**, and we never treat a
  decentralized identity as a password export.

`refreshCredential` uses `com.atproto.server.refreshSession` with the refresh JWT as the
bearer, which is not a standard OAuth form grant. The AT Protocol does not return an
expiry, so we refresh proactively rather than inventing a lifetime.

The service URL is per connection (`metadata.serviceUrl`), defaulting to
`BLUESKY_SERVICE_URL`, because the AT Protocol is federated and a user's PDS may not be
`bsky.social`.

## App review

**None required**, which is precisely why Bluesky is a useful fallback: it can ship without
waiting on anyone.

## Publishing flow

```
prepareMedia   POST /xrpc/com.atproto.repo.uploadBlob   -> blob ref
publish        POST /xrpc/com.atproto.repo.createRecord -> AT URI + CID (the publication)
thread parts   createRecord with reply.root and reply.parent
getStatus      GET  /xrpc/app.bsky.feed.getPostThread
delete         POST /xrpc/com.atproto.repo.deleteRecord
```

The external post id is the AT URI. The public permalink is derived from the handle and the
record key. A reply references **both** the root and the parent, which is what the lexicon
requires and what makes a thread a thread rather than a chain of orphans.

Delayed thread parts come back as `processing`. The connector never sleeps.

## Alt text is required, not suggested

Accessible alt text is a strong community norm on Bluesky, so `BLUESKY_REQUIRE_ALT_TEXT` is
true and a missing alt text is a validation **error** with an explicit waive action. A
waived image publishes with an empty `alt`, which is the protocol's own way of saying "no
description", rather than the field being silently dropped.

## Facets index into UTF-8 bytes

Rich text facets index into the UTF-8 byte offsets of the post text, not into JavaScript
string indices. A post containing a single emoji shifts every subsequent link and mention if
this is done wrong, so `facets.ts` converts explicitly and has a test that asserts the two
differ. A mention facet is emitted only for a DID we actually resolved: an unresolved
`@handle` publishes as plain text and the composer labels it as such.

## Two limits, not one

Bluesky enforces 300 graphemes **and** 3000 bytes. The grapheme limit is the visible one and
lives in `text.maxLength`; the byte ceiling is checked separately in `validateDraft` with
`BLUESKY_BYTE_LIMIT_EXCEEDED`, because a post of 290 emoji is under the grapheme limit and
over the byte limit.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment or thread part | `supported` | Reply records. |
| 2 | Read a comment count | `supported` | `replyCount` from the post thread view. Fetched carefully and within the protocol's rate limits. |
| 3 | Fetch and reply to individual comments | `not_implemented` | Technically expressible. Out of V1 scope. |

## Analytics

`likeCount`, `replyCount`, `repostCount` and `quoteCount` from the post thread view, plus
`postsCount` on the profile. These are **public engagement counts, not platform-reported
insights**, and the UI labels them that way. The AT Protocol offers no impression or reach
figure, so those normalized names are absent rather than estimated.

## Rate limits

Bluesky documents a create budget in points: 5000 points per hour, and a create costs 3
points. The snapshot expresses that as 1666 creates per hour so the connection panel shows a
real number rather than an observation. A `RateLimitExceeded` classifies as
`TRANSIENT_PROVIDER`.

## Open questions to re-verify before launch

1. Confirm whether the official OAuth path is generally available, and pin its documentation
   URL in the source register. This is open decision 7 in
   `docs/planning/05-social-connectors.md` section 9.
2. Confirm the image byte ceiling (1 MiB) and the maximum image count (4).
3. Confirm the video embed limits: byte ceiling (50 MiB), duration (180 seconds) and
   accepted containers.
4. Confirm the alt text length ceiling, currently 2000.
5. Confirm the current rate limit points table and the per-day ceiling.
6. Confirm the self label values we should offer, if any.
7. Confirm whether `quoteCount` is the right source for the `saves` normalized name, or
   whether it should be reported as a distinct metric once the analytics vocabulary grows.
