# Instagram connector

**Verification date: 4 August 2026.** Meta documentation changes frequently and was
intermittently rate limited during research. Reopen and save the exact live versions before
implementation and before any review submission.

Engineering owner: Backend/Connectors 1. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| Content publishing (container, status, publish) | https://developers.facebook.com/docs/instagram-platform/content-publishing |
| IG User reference | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user |
| IG Media reference | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media |
| IG Media insights | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/insights |
| IG User insights | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/insights |
| Content publishing limit | https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit |
| Reels publishing | https://developers.facebook.com/docs/instagram-platform/content-publishing#reels-posts |
| Permissions reference | https://developers.facebook.com/docs/permissions |
| App review | https://developers.facebook.com/docs/app-review |
| Business verification | https://www.facebook.com/business/help/2058515294227817 |
| Platform terms | https://developers.facebook.com/terms |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `instagram_basic` | Read the connected professional account's identity and media. |
| `instagram_content_publish` | Create the media container and publish it. |
| `instagram_manage_insights` | Read media and account insights for the analytics screen. |
| `instagram_manage_comments` | Post the first comment on our own published media. |
| `pages_show_list` | List the Pages the user administers so we can reach the linked Instagram account. |
| `pages_read_engagement` | Confirm the user's role on the Page that owns the Instagram account. |
| `business_management` | Resolve the business that owns the Page during account discovery. |

## App review status

**Not started as of 4 August 2026.** Meta app review for each permission plus business
verification. The reviewer must complete OAuth, account selection, composer, consent,
preview, publish, analytics, disconnect and deletion, with screen recordings. Target
submission: Week 4 (ends 6 September 2026), in one pass covering both the Instagram and the
Facebook Pages permission sets.

## Professional accounts only

Consumer accounts cannot publish through the API. `discoverAccounts` walks Pages, then the
linked Instagram account on each Page, and reads `account_type`. A `PERSONAL` account is
returned with `connectable: false` and the
`connectors.instagram.professional_account_required` reason, so the connect flow says
"Instagram needs a professional account. Switch your account to Business or Creator in the
Instagram app, then connect again." before OAuth completes, not after a publish fails.

## Publishing flow, and what published means

```
create container   POST /{ig-user-id}/media          -> container id   (NOT a publication)
poll status        GET  /{container-id}?fields=status_code
publish            POST /{ig-user-id}/media_publish  -> media id       (the publication)
read permalink     GET  /{media-id}?fields=permalink
```

Carousels create one child container per item, then a parent container referencing the
children, then publish the parent.

Correctness rules the adapter enforces:

- A container create returns `state: 'processing'` with the container id in `resume`. The
  campaign shows "Provider processing" and no receipt is written.
- Only `media_publish` produces an external post id.
- A retry reuses `resume.containerId`. It never creates a second container.
- If `resume.mediaId` is present the adapter checks status first and adopts the existing
  publication. We never republish a container.
- `findRecentInstagramMedia` recovers the media id after a crash between publish and
  receipt.

## Stories and Reels

Reels are published as a `REELS` media container and validated against a 9:16 frame.
Stories are narrower: availability depends on the account and on the current API surface,
so a Stories draft fails validation with `awaiting_provider_approval` rather than being
attempted. This matches open decision 3 in `docs/planning/05-social-connectors.md` section
9: Stories are out of V1.

## Mentions

A caption mention is plain text that Instagram resolves when it renders. There is no entity
id to store, so `mentions.resolvesToExternalId` is false and `searchMentions` is not
implemented, which the capability page renders as unsupported for a native tag. Tagging a
user inside an image is a separate API feature and is `not_implemented` in V1.

## Deletion

The Instagram Graph API does not offer media deletion, so `deletePost` is absent and
`deletion.support` is `unsupported`. Deleting in Relay never implies deleting on Instagram
and the receipt records both facts separately.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment | `supported` with `instagram_manage_comments` | A comment on our own published media, after publish succeeds. |
| 2 | Read a comment count | `supported` | `comments_count` on the media object. |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API offers moderation under approved permissions. Out of V1 scope. |

## Analytics actually returned

Media scope: `views`, `reach`, `likes`, `comments`, `saved`, `shares`. Reels, feed images
and carousels do not return the same subset, so a field the media type did not return is
`unavailable_provider` with a null value and the UI shows the provider field name and
definition next to every number. Account scope: `reach` and `profile_views`;
`follower_count` is requested and reported as unavailable when Meta does not return it.

## Rate limits

Instagram applies a content publishing limit of 50 published posts per rolling 24 hours per
account, which the snapshot carries as a real `rateLimit`. Per-app and per-account Graph
limits apply on top and are recorded as observations.

## Open questions to re-verify before launch

1. Confirm the Graph API version. `GRAPH_VERSION` is `v26.0` in `../graph.js`, reviewed
   4 August 2026.
2. Confirm that `alt_text` is accepted on an image container. If it is not, alt text moves
   from `supported` to `unsupported` for Instagram and the composer must say so.
3. Confirm the caption limit (2200), the carousel bounds (2 to 10) and the mention cap (20).
4. Confirm the current image and video byte ceilings, the maximum Reels duration and the
   accepted codecs and containers.
5. Confirm the insight metric names. Meta renamed `impressions` to `views` for media, and
   the mapping table must match whatever is live.
6. Confirm whether Stories publishing is available to our app after review, and whether it
   requires a separate permission.
7. Confirm the `collaborators` field and its eligibility rules before exposing it in the
   composer.
8. Confirm the content publishing limit remains 50 per 24 hours.
