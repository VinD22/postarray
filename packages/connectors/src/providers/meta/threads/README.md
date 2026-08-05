# Threads connector

**Verification date: 4 August 2026.** Status: launch fallback. Built only if a target
connector is still awaiting production review at the Phase 2 exit gate
(`docs/planning/05-social-connectors.md` section 6.1). Meta documentation changes frequently
and was intermittently rate limited during research; reopen and save the live versions
before implementation.

Engineering owner: Backend/Connectors 1. Policy owner: Policy Owner.

## Official documentation used

| Topic | URL |
| --- | --- |
| Threads API overview | https://developers.facebook.com/docs/threads |
| Get started and authorization | https://developers.facebook.com/docs/threads/get-started |
| Create posts (container lifecycle) | https://developers.facebook.com/docs/threads/create-posts |
| Reply management | https://developers.facebook.com/docs/threads/reply-management |
| Insights | https://developers.facebook.com/docs/threads/insights |
| Long lived tokens | https://developers.facebook.com/docs/threads/get-started/long-lived-tokens |
| Platform terms | https://developers.facebook.com/terms |

## Required scopes

| Scope | Why the shipped product needs it |
| --- | --- |
| `threads_basic` | Identify the connected account and read back the post we created. |
| `threads_content_publish` | Create the container and publish it. |
| `threads_manage_replies` | Publish the reply that continues a thread and the first comment. |
| `threads_manage_insights` | Read post and account insights for the analytics screen. |

Threads authorizes on its own host (`threads.net`) with its own permission set, separate
from the Instagram and Facebook Pages permissions, even though it sits in the same Meta app.

## App review status

**Not started as of 4 August 2026.** Covered by the Meta app review track and blocked on
Meta business verification. Target submission: with the Meta pass.

## Publishing flow

```
create container   POST /{user-id}/threads          -> container id   (NOT a publication)
poll status        GET  /{container-id}?fields=status,error_message
publish            POST /{user-id}/threads_publish  -> media id       (the publication)
read permalink     GET  /{media-id}?fields=permalink
```

Carousels create one child container per item, then a parent container referencing the
children, then publish the parent. A thread part is a `TEXT` container carrying
`reply_to_id` pointing at the previous part.

Note the difference from Instagram: Threads reports container progress in a `status` field,
not in `status_code`. That is why the status read lives in this adapter rather than in the
shared container module.

Crash recovery rules are identical to Instagram: a stored container id is reused, never
recreated; a stored media id is adopted rather than republished; `findRecentThreadsPost`
answers "did the post actually get created?" after a timeout.

Delayed thread parts come back as `processing`. The connector never sleeps.

## Reply control

Threads controls who may reply rather than who may see a post, and it has a safe default, so
`privacy.mustBeExplicit` is false and `everyone` is the default option. This is genuinely
different from TikTok, where a privacy selection must never be defaulted.

## The three comment capabilities

| # | Capability | State | Note |
| --- | --- | --- | --- |
| 1 | Schedule a first comment or thread part | `supported` | A reply container pointing at our own root post. |
| 2 | Read a comment count | `supported` where Threads insights are granted | The `replies` insight. **Re-verify before implementation.** |
| 3 | Fetch and reply to individual comments | `not_implemented` | The API exposes reply management under permission. Out of V1 scope. |

## Analytics actually returned

Post scope: `views`, `likes`, `replies`, `reposts`, `shares`. Account scope: `views` and
`followers_count`. A metric Threads did not return is `unavailable_provider`, and a missing
insights permission is `unavailable_permission`. Neither is ever shown as 0.

## Deletion

The Threads API does not offer post deletion for our app, so `deletePost` is absent and
`deletion.support` is `unsupported`.

## Open questions to re-verify before launch

1. Confirm the Threads Graph version. `THREADS_GRAPH_VERSION` is `v1.0` in `../graph.js`.
2. Confirm the text limit (500) and the carousel bounds (2 to 20).
3. Confirm the image and video byte ceilings and the maximum video duration (300 seconds is
   a planning baseline).
4. Confirm the exact insight metric names and whether `replies` is the comment count.
5. Confirm the long lived token refresh grant (`th_refresh_token`) and its lifetime.
6. Confirm whether `alt_text` is accepted on an image container.
7. Confirm whether post deletion is available to our app, which would move `deletion` from
   `unsupported`.
8. Confirm the per-app and per-account publishing limits so the connection panel can show a
   real budget rather than an observation.
