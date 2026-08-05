# LinkedIn connector

**Verification date: 4 August 2026.** Sources below were read on that date and recorded in
`docs/research/06-source-register.md`. Re-verify all of it before implementation, and in
particular re-verify the API version header, which LinkedIn rotates on a published
schedule.

Engineering owner: Backend/Connectors 2. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| Posts API (create, delete, lifecycle) | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api |
| Images API (initialize upload, upload) | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api |
| Videos API (multipart upload, finalize) | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/videos-api |
| Documents API | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api |
| Organization access control (Page roles) | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control |
| Organization lookup and search | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-lookup-api |
| Social actions (likes, comments) | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/network-update-social-actions |
| Organization share statistics | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/share-statistics |
| Follower statistics | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/follower-statistics |
| Community Management app review | https://learn.microsoft.com/en-us/linkedin/marketing/community-management/overview |
| API versioning and the version header | https://learn.microsoft.com/en-us/linkedin/marketing/versioning |
| Rate limits | https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits |
| Sign In with LinkedIn (OpenID Connect) | https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2 |
| API terms of use | https://legal.linkedin.com/api-terms-of-use |

## The version header

`LINKEDIN_API_VERSION = '202603'` in `capabilities.ts`. **Reviewed 4 August 2026.** Every
request carries `LinkedIn-Version` and `X-Restli-Protocol-Version: 2.0.0`. A stale header
is a common and confusing failure, so a `426` (or a `400` naming the header) is classified
as an internal failure that pages the connector owner rather than as a customer problem.
There is exactly one place to change this value.

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `openid`, `profile` | Identify the connected member at connect time and show which account is connected. |
| `w_member_social` | Publish a post as the member. |
| `w_organization_social` | Publish a post as a Company Page the member administers. |
| `r_organization_social` | Read organization post statistics for the analytics screen. |
| `rw_organization_admin` | List the Pages the member holds an eligible role on, so the user can choose which to connect. |

## App review status

**Not started as of 4 August 2026.** Community Management app review is the longest lead
review of the six. It requires a verified company page and verified business identity, a
working website with a matching domain and email, published privacy policy and terms, a
reviewer demo and a scope-by-scope justification. Target submission: Week 3 (ends 30 August
2026).

Until it completes, the first comment capability is `requires_review` rather than
`supported`, driven by the `REVIEW_STATUS` table in `shared/verification.ts`. Flip the
table entry when approval lands; do not edit the adapter.

## Member post read back is restricted, and we say so

New applications do not receive read access to member post statistics. This is a LinkedIn
restriction on our application, not a gap in Relay, so:

- A member connection reports `analytics.support = 'requires_review'` and lists only
  `likes` and `comments`, which the social actions endpoint does return.
- Impressions, unique impressions, clicks and shares on a member post come back as
  `unavailable_permission` with a null value. They are never rendered as 0.
- The composer preview carries the `connectors.linkedin.member_analytics_restricted`
  warning key so the user knows before publishing, not after.
- Organization connections with `r_organization_social` get the full statistics set.

## Publishing flow

```
prepareMedia   images:    POST /rest/images?action=initializeUpload    -> PUT binary
               documents: POST /rest/documents?action=initializeUpload -> PUT binary
               videos:    POST /rest/videos?action=initializeUpload    -> PUT parts
                          -> POST /rest/videos?action=finalizeUpload
publish        POST /rest/posts                    -> post URN in the `x-restli-id` header
first comment  POST /rest/socialActions/{urn}/comments
getStatus      GET  /rest/posts/{urn}              -> confirms lifecycleState PUBLISHED
```

The created post URN arrives in a response header, not in the body. A create that returns
2xx without that header is a failure, not a success, because we have no external evidence.

Video is processed after finalize, so `prepareMedia` returns the video as `processing` and
`getStatus` confirms before the post goes out.

## Mentions are real entities

`searchMentions` resolves an organization to `urn:li:organization:{id}` and the composer
stores the URN, not the display string. That is what makes company tagging work. A member
who loses a Page role gets `page_role_required`, naming the Page and the role needed, not a
generic failure.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment | `requires_review` until Community Management access is approved, then `supported` | A comment on our own post. |
| 2 | Read a comment count | `supported` where the social actions summary is available | Organization posts are more reliable than member posts here. |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API expresses it under approved access. Out of V1 scope. |

## Rate limits

Application level and member level daily limits apply, and the exact numbers are visible
only in the LinkedIn Developer Portal for our specific application. The snapshot therefore
carries `rateLimit: null`, the adapter records every rate-limit response, and the connection
panel labels the ceiling "observed, not published by LinkedIn". No monetary cost per post.

## Open questions to re-verify before launch

1. Confirm the current `LinkedIn-Version` value and update the constant. It is `202603`
   today.
2. Confirm the maximum commentary length. The snapshot carries 3000 characters.
3. Confirm the multi image post maximum. The snapshot carries 20 images.
4. Confirm the image, video and document byte ceilings and the maximum video duration. The
   snapshot carries 10 MiB, 500 MiB, 100 MiB and 900 seconds as a planning baseline.
5. Confirm whether LinkedIn publishes an alt text length limit. The snapshot currently
   carries `null` rather than inventing one.
6. Confirm the video multipart finalize contract, specifically whether `uploadToken` is
   required and where the part identifiers come from.
7. Confirm whether the `DRAFT` lifecycle state is available to our app, which would let us
   promote `drafts` from `not_implemented`.
8. Confirm whether member post statistics remain closed to new applications. If that
   changes, member analytics moves from `requires_review` to `supported`.
