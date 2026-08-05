# Facebook Pages connector

**Verification date: 4 August 2026.** Meta documentation changes frequently and was
intermittently rate limited during research. Reopen and save the exact live versions before
implementation and before any review submission.

Engineering owner: Backend/Connectors 1. Policy owner: Policy Owner.

## Pages only

Personal profile automation is not a target and is not offered. `identity().accountTypes`
is `['page']`, `discoverAccounts` returns only Pages, and a draft whose connection is not a
Page fails validation with `FACEBOOK_PAGE_REQUIRED`. There is no code path in this adapter
that can post to a personal profile.

## Official documentation used

| Topic | URL |
| --- | --- |
| Pages API: posts | https://developers.facebook.com/docs/pages-api/posts |
| Page feed reference | https://developers.facebook.com/docs/graph-api/reference/page/feed |
| Page photos reference | https://developers.facebook.com/docs/graph-api/reference/page/photos |
| Page videos reference | https://developers.facebook.com/docs/graph-api/reference/page/videos |
| Post insights | https://developers.facebook.com/docs/graph-api/reference/post/insights |
| Page insights | https://developers.facebook.com/docs/graph-api/reference/page/insights |
| Page access tokens | https://developers.facebook.com/docs/pages-api/getting-started |
| Permissions reference | https://developers.facebook.com/docs/permissions |
| App review | https://developers.facebook.com/docs/app-review |
| Business verification | https://www.facebook.com/business/help/2058515294227817 |
| Platform terms | https://developers.facebook.com/terms |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `pages_show_list` | List the Pages the user administers so they can choose which to connect. |
| `pages_manage_posts` | Create, publish and delete the Page post. |
| `pages_read_engagement` | Read the post back and confirm publication, and read like, comment and share counts. |
| `pages_manage_engagement` | Post the first comment on our own Page post. |
| `read_insights` | Read Page and post insights for the analytics screen. |
| `business_management` | Resolve the business that owns the Page during account discovery. |

## App review status

**Not started as of 4 August 2026.** Facebook Pages shares one Meta app and one review pass
with Instagram. Plan the submission to cover both permission sets together and be explicit
about which product surface uses which permission. Target submission: Week 4 (ends
6 September 2026).

## Page tokens and role changes

Page access tokens are long lived but a Page role change revokes them, so token health has
to track roles and not only expiry. `discoverAccounts` records the `tasks` Meta returned in
the account metadata. A Page whose tasks no longer include `CREATE_CONTENT` or `MANAGE` is
`connectable: false` with `connectors.facebook.page_role_required`, and at publish time a
`190` classifies as a connection action with a reconnect path.

A Page unpublished or restricted by Meta is `PERMANENT_PROVIDER` with an honest explanation
and Meta's own stated reason, sanitized and truncated. We cannot fix that for the customer.

## Publishing flow

```
text / link post   POST /{page-id}/feed  {message, link}          -> composite post id
photo post         POST /{page-id}/photos {url, published:false}  -> unpublished photo id
                   POST /{page-id}/feed  {message, attached_media}
video post         POST /{page-id}/videos {file_url, published:false}
                   POST /{video-id}      {published:true, description}
permalink          GET  /{post-id}?fields=permalink_url
first comment      POST /{post-id}/comments
```

Video is processed asynchronously, so `getStatus` reports `processing` until
`status.video_status` is `ready`. A processing video is never reported as published.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment | `supported` with `pages_manage_engagement` | A comment on our own Page post. |
| 2 | Read a comment count | `supported` | From the comments summary on the post object. |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API supports it under approved permissions. Out of V1 scope. |

## Analytics actually returned

Post scope: `post_impressions`, `post_impressions_unique`, `post_clicks`,
`post_video_views` from insights, plus like, comment and share counts read from the post
object's summaries. Page scope: `page_impressions`, `page_impressions_unique`,
`page_fan_adds_unique`, `page_views_total`.

Field availability varies by post type, by granted permission and by Page size for some
aggregate metrics. A withheld metric is `unavailable_provider` (or `unavailable_permission`
on a 403) with a null value and the provider's reason. It is never rendered as 0.

## Groups and mentions

Group posting is available only where the official API permits it for our app, so
`destinations` carries `group` as `not_implemented`: a gap of ours, not a provider
limitation. Page mentions inside a message use a provider specific inline syntax we have not
built, so `mentions.support` is `not_implemented` and a typed `@name` publishes as plain
text, which the composer labels.

## Open questions to re-verify before launch

1. Confirm the Graph API version. `GRAPH_VERSION` is `v26.0` in `../graph.js`.
2. Confirm the message ceiling (63206) and the `attached_media` maximum (10).
3. Confirm the current photo and video byte ceilings and the maximum video duration.
4. Confirm that `alt_text_custom` is the accepted alt text field on an unpublished photo.
5. Confirm the post and Page insight metric names. Meta deprecates and renames these on a
   published schedule and several `post_*` metrics have changed in recent versions.
6. Confirm whether the Facebook Reels publishing surface is worth building in V1, which
   would move `short_video` from `not_implemented`.
7. Confirm whether group posting is available to our reviewed app.
8. Confirm the per-app and per-Page rate limits and whether Meta exposes the remaining
   budget in a header we can surface in the connection panel.
