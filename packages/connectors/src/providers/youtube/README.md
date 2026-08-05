# YouTube connector

**Verification date: 4 August 2026.** Sources below were read on that date and recorded in
`docs/research/06-source-register.md`. Re-verify before implementation.

Engineering owner: Backend/Connectors 2. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| Data API getting started | https://developers.google.com/youtube/v3/getting-started |
| `videos.insert` | https://developers.google.com/youtube/v3/docs/videos/insert |
| `videos.list` | https://developers.google.com/youtube/v3/docs/videos/list |
| `videos.delete` | https://developers.google.com/youtube/v3/docs/videos/delete |
| `channels.list` | https://developers.google.com/youtube/v3/docs/channels/list |
| `thumbnails.set` | https://developers.google.com/youtube/v3/docs/thumbnails/set |
| `commentThreads.insert` | https://developers.google.com/youtube/v3/docs/commentThreads/insert |
| Resumable upload protocol | https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol |
| Quota costs | https://developers.google.com/youtube/v3/determine_quota_cost |
| API Services terms | https://developers.google.com/youtube/terms/api-services-terms-of-service |
| Developer policies | https://developers.google.com/youtube/terms/developer-policies |
| Spam and deceptive practices policy | https://support.google.com/youtube/answer/2801973 |
| Altered or synthetic content disclosure | https://support.google.com/youtube/answer/14328491 |
| Google OAuth 2.0 for web server apps | https://developers.google.com/identity/protocols/oauth2/web-server |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `youtube.upload` | Upload the video and set its metadata and privacy status. |
| `youtube.readonly` | Read the channel at connect time, confirm the upload finished processing, and read video and channel statistics. |
| `youtube.force-ssl` | Post the first comment on our own video. |

We do not request the YouTube Analytics scopes in V1, so watch time and average view
duration are absent from the capability snapshot rather than estimated.

## The unaudited constraint, which is a product decision

**An unaudited Google Cloud project may upload videos only as private.** This is a provider
rule, so it is encoded as a capability constraint:

- `youTubePrivacyOptions()` returns only `private` while `REVIEW_STATUS.youtube` is not
  `approved`.
- `validateDraft` fails a public or unlisted choice with `YOUTUBE_PRIVACY_NOT_AVAILABLE` and
  the `awaiting_provider_approval` remediation.
- Every private upload raises a `YOUTUBE_UPLOADS_ARE_PRIVATE` warning, so the user sees it
  in the composer and in the schedule confirmation rather than discovering it afterwards.
- The connect screen, the composer and the public capability page all state: "YouTube
  uploads publish as private until Google completes our API audit. You can change the video
  to public in YouTube Studio."
- YouTube is labelled beta and is not marketed as supported until the audit completes.

Flip `REVIEW_STATUS.youtube` in `../shared/verification.ts` when the audit passes. The
adapter needs no change.

## App review and audit status

**Unaudited as of 4 August 2026.** Requires a Google Cloud project separate from the login
project, OAuth consent screen verification, and the YouTube API Services compliance audit.
The audit needs our privacy policy, our data handling description, evidence of user control
and revocation, and evidence that we delete stored authorized data within the required
timeline after revocation or deletion (current policy includes a 30 day obligation in
relevant cases). The deletion job must be built and demonstrable **before** the audit.
Target submission: Week 4 (ends 6 September 2026). The audit is the longest tail here.

We use one Google Cloud project. Quota sharding across projects is prohibited.

## Publishing flow: resumable upload

```
prepareMedia   POST /upload/youtube/v3/videos?uploadType=resumable  -> session URI (Location)
               PUT  {session URI} with Content-Range, 8 MiB chunks
               308 means resume incomplete: read Range, continue from the next byte
               the final 2xx returns the video resource
publish        GET  /youtube/v3/videos?part=status,processingDetails -> confirms processing
               POST /upload/youtube/v3/thumbnails/set  (only where the channel is eligible)
               POST /youtube/v3/commentThreads         (first comment)
getStatus      GET  /youtube/v3/videos                 -> uploadStatus / processingStatus
```

The session URI and the confirmed byte offset are stored in the prepared media metadata,
which is why a worker crash mid upload resumes rather than restarting. A video whose
`uploadStatus` is not `processed` is reported as `processing`, never as published. A
`failed` or `rejected` upload is `PERMANENT_PROVIDER` with YouTube's stated reason.

A failed thumbnail is logged and does not fail the publish: the video is already live and
thumbnail eligibility is a channel property, not a content error.

## Quota

The Data API uses a daily quota of 10000 units and `videos.insert` costs 1600 units, so the
snapshot expresses the limit as 6 uploads per day. Read calls consume the same quota, so
this is a ceiling rather than a promise. Quota exhaustion classifies as
`TRANSIENT_PROVIDER` with the `quota_exhausted` remediation and the next window, so
scheduled uploads become "Retry scheduled", never "Failed".

## Shorts

A Short is an ordinary upload that meets the Shorts criteria. We do not claim a separate
Shorts API because there is not one. A `short_video` draft longer than 180 seconds raises a
`YOUTUBE_NOT_A_SHORT` warning rather than an error, because YouTube decides.

## Content policy

Do not enable high volume repetitive, mass produced or misleading synthetic content. Our
repeat and Automation Rule limits exist partly for this reason. A draft marked AI assisted
must carry the altered content declaration, which validation enforces and the content
version stores. We present provider fields with provider definitions and do not compute a
composite score from them, because YouTube restricts how API data may be combined.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment | `supported` with `youtube.force-ssl` and comments enabled | Uses `commentThreads.insert`. Validation blocks it when the uploader disabled comments, so it fails in the composer rather than after the video is live. |
| 2 | Read a comment count | `supported` | `commentCount` in video statistics, when the channel has not disabled comments. |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API supports listing and replying. Out of V1 scope. |

## Analytics actually returned

Video scope: `viewCount`, `likeCount`, `commentCount`, `favoriteCount`. Channel scope:
`viewCount`, `videoCount`. A channel that hid its like count simply omits the field, and the
observation is `unavailable_provider` with a null value, never 0.

## Open questions to re-verify before launch

1. Confirm the audit status. Everything about the privacy options depends on it.
2. Confirm the current quota cost of `videos.insert` (1600 units) and the daily allowance.
3. Confirm the maximum upload size (128 GiB) and the verified and unverified duration
   ceilings (12 hours and 15 minutes).
4. Confirm whether the altered or synthetic content declaration has an API field we should
   set on `videos.insert`. It is `not_implemented` today and collected only in Relay.
5. Confirm the Shorts criteria, currently 180 seconds, before the warning copy ships.
6. Confirm the thumbnail eligibility signal on the channel resource so
   `customThumbnailAllowed` is read rather than assumed.
7. Confirm the data deletion obligation window after revocation, currently 30 days in
   relevant cases, and that the deletion job satisfies it before the audit.
8. Decide whether to request the YouTube Analytics scopes, which would add watch time and
   average view duration.
