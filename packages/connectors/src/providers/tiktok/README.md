# TikTok connector

**Verification date: 4 August 2026.** Sources below were read on that date and recorded in
`docs/research/06-source-register.md`. Re-verify before implementation.

Engineering owner: Backend/Connectors 2. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| Content Posting API: get started | https://developers.tiktok.com/doc/content-posting-api-get-started |
| Direct Post reference | https://developers.tiktok.com/doc/content-posting-api-reference-direct-post |
| Query creator info | https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info |
| Get post status | https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status |
| Media transfer guide (chunked upload, pull from URL) | https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide |
| Content sharing guidelines | https://developers.tiktok.com/doc/content-sharing-guidelines |
| Developer terms and guidelines | https://developers.tiktok.com/doc/tiktok-api-developer-guidelines |
| Login Kit | https://developers.tiktok.com/doc/login-kit-web |
| URL ownership verification | https://developers.tiktok.com/doc/content-posting-api-get-started#url_ownership_verification |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `user.info.basic` | Identify the connected creator account at connect time. |
| `user.info.profile` | Show the creator's username and avatar in the consent UI, which the review requires. |
| `video.publish` | Direct Post. This is the authorization that gates production posting. |
| `video.upload` | Transfer the video file when we are not pulling from a verified domain. |

## App review status

**Unaudited as of 4 August 2026.** Content Posting API and Direct Post approval plus
`video.publish` authorization are required for production posting. Target submission:
Week 6 (ends 20 September 2026).

The review is largely a review of the consent UI, so the consent UI is built first. The
reviewer must see: the creator info display, the privacy selection with no default, the
comment, duet and stitch toggles reflecting what the creator permits, the commercial content
declaration, the editable caption and preview, explicit consent, and the absence of any
added watermark.

**In unaudited mode posts are private and per-account and per-user caps apply. We do not
market this as production publishing.** `isUnaudited()` reads the review status table, and
while it is true the only privacy option offered is `SELF_ONLY`, a different choice fails
validation with `TIKTOK_UNAUDITED_PRIVATE_ONLY`, and every draft carries the
`TIKTOK_POSTS_ARE_PRIVATE` warning.

## The seven hard requirements, and where each is enforced

| Requirement | Where |
| --- | --- |
| Fetch creator info immediately before compose or publish confirmation, never at connect time | `getCapabilities` fetches it, and `publish` fetches it again at dispatch. |
| Never default the privacy selection | `privacy.mustBeExplicit` is true, `tikTokPrivacyOptions` never sets `isDefault`, and an unset privacy is a validation error. |
| Comment, duet and stitch require an explicit user choice | `TIKTOK_INTERACTION_CHOICE_REQUIRED` for each unset toggle. An unset value is never read as "off". |
| Commercial content and music rights declarations | `TIKTOK_COMMERCIAL_DECLARATION_REQUIRED`, `TIKTOK_COMMERCIAL_KIND_REQUIRED`, `TIKTOK_MUSIC_RIGHTS_CONFIRMATION_REQUIRED`. |
| Preview with an editable caption and explicit consent | `TIKTOK_CONSENT_REQUIRED`, set by the composer only after the user saw the real preview. |
| No added watermark or logo | There is no code path in this adapter that composites anything onto a video. Media is transferred byte for byte. |
| A media upload alone is not success | `publish` always reads the status endpoint and reports `processing` unless the status is `PUBLISH_COMPLETE` **and** a `publicaly_available_post_id` is present. |

## Creator info is fetched again at dispatch

A TikTok post scheduled far in advance re-fetches creator info at dispatch. If the
previously chosen privacy option is no longer in `privacy_level_options`, the publish stops
with `CONNECTION_ACTION_REQUIRED` and the `choose_privacy_option` remediation: "Choose who
can see this TikTok post. TikTok does not allow us to choose for you." We never silently
substitute a different privacy setting. The same applies when the creator has since disabled
comments and the draft asked for comments on.

## Pull from URL and verified domains

`VERIFIED_PULL_DOMAINS` is empty until a domain is verified with TikTok. Until then every
publish uses `FILE_UPLOAD` and transfers the bytes. Publishing with an unverified pull
domain is impossible by construction: `isVerifiedPullDomain` gates the source choice, and
reaching a pull with an unverified domain would be our configuration error, not a customer
problem.

## Publishing flow

```
1. creator_info/query/   fetched fresh, before compose and again at dispatch
2. the composer renders the real options, with no default privacy
3. video/init/           post_info + source_info (PULL_FROM_URL or FILE_UPLOAD)
4. PUT chunks            only for FILE_UPLOAD
5. status/fetch/         polled until PUBLISH_COMPLETE with a post id, or FAILED
6. receipt records the post id where the API returned one
```

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment | `unsupported` | The Content Posting API gives our app no way to comment on the post it created. This is a provider limitation, so the composer hides the field for TikTok targets rather than showing a failing option. |
| 2 | Read a comment count | `requires_review` | Available through a display or insights product where approved. **Re-verify before implementation.** |
| 3 | Fetch and reply to individual comments | `unsupported` for our app scope in V1 | Not offered to us. |

The creator may also have comments disabled entirely, which creator info reports.

## Analytics

We are not approved for a TikTok insights product, so `fetchMetrics` returns no observations
and `analytics.support` is `requires_review`. The user-facing reason is "TikTok has not
approved this app for insights", which is honest and actionable. We do not render zeros.

## Rate limits

Per-app and per-user caps apply and are tighter in unaudited mode. TikTok does not publish
a number for our app, so the snapshot carries `rateLimit: null` and observed caps are
recorded and shown. A `spam_risk_*` code classifies as `TRANSIENT_PROVIDER` with the reset
window and an explicit note that approval will lift it.

## Open questions to re-verify before launch

1. Confirm the Direct Post approval status. Everything about the privacy options depends on
   it.
2. Confirm the caption limit (2200) and whether photo posts are approved for our app, which
   would move `image` and `carousel` from `requires_review`.
3. Confirm the chunk size rules for `FILE_UPLOAD`, currently 10 MiB, and the minimum and
   maximum chunk counts.
4. Verify at least one owned domain for pull from URL and populate `VERIFIED_PULL_DOMAINS`.
5. Confirm the exact commercial content field names (`brand_content_toggle`,
   `brand_organic_toggle`) and whether a music rights field exists on the request or is a
   consent UI obligation only.
6. Confirm whether a display or insights product is available to us, which would move
   `analytics` from `requires_review` and give us capability 2.
7. Confirm the unaudited per-account and per-user caps so the connection panel can show a
   real number rather than an observation.
8. Confirm the terminal status values and whether `SEND_TO_USER_INBOX` should ever be
   offered as a draft path.
