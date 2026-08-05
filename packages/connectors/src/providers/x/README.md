# X connector

**Verification date: 4 August 2026.** Every number, price and scope below was read from the
official sources listed here on that date and recorded in
`docs/research/06-source-register.md`. Re-verify all of it before implementation, because X
changes prices, tiers and entitlements without notice.

Engineering owner: Backend/Connectors 1. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| API overview and versioning | https://docs.x.com/x-api |
| Create a post | https://docs.x.com/x-api/posts/creation-of-a-post |
| Delete a post | https://docs.x.com/x-api/posts/post-delete-by-post-id |
| Post lookup and metrics | https://docs.x.com/x-api/posts/post-lookup-by-post-id |
| User timeline (duplicate preflight) | https://docs.x.com/x-api/posts/user-posts-timeline-by-user-id |
| User lookup (`/2/users/me`) | https://docs.x.com/x-api/users/user-lookup-me |
| Media upload (initialize, append, finalize) | https://docs.x.com/x-api/media/media-upload |
| Media metadata (alt text) | https://docs.x.com/x-api/media/metadata-create |
| OAuth 2.0 with PKCE | https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code |
| Pay-per-use pricing | https://docs.x.com/x-api/introduction (pricing section) |
| Automation rules | https://help.x.com/en/rules-and-policies/x-automation |
| Developer policy | https://developer.x.com/en/developer-terms/policy |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `tweet.read` | Read back the post we created to confirm publication, read post metrics, and run the duplicate preflight before any retry. |
| `tweet.write` | Create the post, the thread parts and the first comment. |
| `users.read` | Identify the connected account at connect time and read account level metrics. |
| `media.write` | Upload images and video the user attached. |
| `offline.access` | Refresh the access token so a scheduled post does not fail because the user was not present. |

Nothing beyond this list is requested. A permission for a feature we have not shipped is a
review rejection.

## App review status

**Not started as of 4 August 2026.** X access is a paid developer tier plus an app
configuration that describes our product, our use of each endpoint and our automation
disclosure. Target submission: Week 2 (ends 23 August 2026), owner Connectors Lead.

Until the tier and configuration are in place:

- `long_video` is `requires_review` in the capability snapshot, not `supported`.
- Community posting through `listDestinations` is `requires_review`, and the method throws
  `CAPABILITY_NOT_IMPLEMENTED` so the capability page renders it as a gap of ours, not as a
  provider limitation.

## The cost model, which is the defining feature of this connector

X charges per operation, and a create containing a URL costs materially more than a plain
create. As of 4 August 2026 the published prices are:

| Operation | Price |
| --- | --- |
| Post create | $0.015 |
| Post create containing a URL | $0.200 |

`cost.ts` holds these in micro-USD, because $0.015 is not a whole number of cents. The
campaign estimate sums the exact micro amounts for the root post plus every thread part and
first comment, and rounds to whole minor units exactly once at the end. Twenty plain posts
estimate at $0.30, not at $0.40.

The capability snapshot's `perCreateMinor` is 2, which is $0.015 rounded to the nearest
cent for the coarse capability badge. The authoritative figure everywhere a user sees money
(composer, schedule confirmation, bulk preview, receipt) is `estimateCost(draft).minorUnits`,
which `validateDraft` returns as `estimatedCostMinor`.

A campaign with five or more URL-bearing operations raises an `X_LINK_HEAVY_CAMPAIGN`
warning so nobody schedules a twenty post link campaign without seeing the number first.
The product never writes "unlimited X posting" anywhere.

## Duplicate and substantially similar content

X prohibits publishing duplicate or substantially similar posts across accounts. Two
separate controls implement this:

1. **Provider rejection mapping.** A create rejected for duplicate content is classified as
   `CONTENT_INVALID` with the `duplicate_content` remediation. It is never retried, because
   a retry would be both a policy violation and a billing event.
2. **Retry preflight.** X offers no idempotency token for post creation. Before repeating a
   create the adapter queries the account's posts from the last 30 minutes and adopts a
   post whose normalized text matches. If that query fails, the adapter fails rather than
   creating a post it cannot prove is absent. `shared/text.ts` exposes the similarity
   function the application layer uses for the cross-account check.

## Publishing flow

```
prepareMedia   initialize -> append (4 MiB chunks) -> finalize -> metadata (alt text)
publish        POST /2/tweets with text and media_ids            -> external post id
thread parts   POST /2/tweets with reply.in_reply_to_tweet_id    -> external post id each
getStatus      GET  /2/tweets/{id}                               -> confirms publication
```

Delays between thread parts are the worker's concern. The connector never sleeps: a part
with a non-zero delay comes back as `processing` with a `resume` payload, and the worker
calls `publish` again with that part's order in `resume.dueOrders`.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment or thread part | `supported` | A reply to our own post. |
| 2 | Read a comment count | `supported` | `reply_count` in post metrics, subject to paid read access. |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API can express it. Per-read metering makes an inbox expensive and it is out of V1 scope. |

## Analytics actually returned

Post scope: `impression_count`, `like_count`, `reply_count`, `retweet_count`,
`bookmark_count` from `public_metrics`, plus `url_link_clicks` from `non_public_metrics`
where the tier returns it. Account scope: `tweet_count` only.

Field availability depends on the paid tier. A field the tier did not return is
`unavailable_provider`, and a 401 or 403 is `unavailable_permission`. Neither is ever
rendered as 0. We do not derive a follower delta or an engagement rate that X did not
return.

## Rate limits

X rate limits are tier dependent and are not published for our specific application, so the
capability snapshot reports `rateLimit: null` and the adapter records observed limits at
runtime. A 429 classifies as `TRANSIENT_PROVIDER` and the user is told the next attempt
time. Backoff is Temporal's job, not the connector's.

## Open questions to re-verify before launch

1. Confirm the current pay-per-use prices in the developer console. The $0.015 and $0.200
   figures date from 4 August 2026 and the console is authoritative.
2. Confirm whether community posting is available at our purchased access tier
   (open decision 1, `docs/planning/05-social-connectors.md` section 9). If it is, promote
   `listDestinations` from throwing to a real implementation and change the destination
   support from `requires_review` to `supported`.
3. Confirm the v2 media upload path (`/2/media/upload/initialize`, `/append`, `/finalize`)
   and the maximum chunk size. The v1.1 chunked upload endpoints are being retired and the
   adapter must be on whichever path is current at implementation time.
4. Confirm the exact image and video byte ceilings and the maximum video duration for our
   tier. The snapshot currently carries 5 MiB per image, 15 MiB per GIF, 512 MiB per video
   and 140 seconds, which is a planning baseline.
5. Confirm the current AI and content disclosure field (`made_with_ai` or its successor)
   and decide whether V1 collects the declaration. It is `not_implemented` today.
6. Confirm which post metric fields the purchased tier actually returns, and update
   `metrics.ts` so we never advertise a field we cannot read.
7. Confirm the maximum number of parts in a self-reply thread. The snapshot carries 25.
