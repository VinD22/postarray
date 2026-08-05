# Meta shared layer

**Verification date: 4 August 2026.**

This directory holds what Instagram, Facebook Pages and Threads genuinely share, and
nothing else. Each surface has its own subdirectory with its own permission set, account
rules, capability snapshot and README:

- `instagram/` professional accounts only, container lifecycle, Reels, no deletion.
- `facebook/` Pages only, direct create, deletion supported.
- `threads/` launch fallback, container lifecycle with a `status` field of its own.

## What is shared

| Module | What it holds |
| --- | --- |
| `graph.ts` | The Graph version constant, the base URLs, the error envelope, the page and container schemas, the numeric error code to remediation mapping, and the client that puts the bearer token in a header rather than in a query string. |
| `oauth.ts` | The three authorization definitions and the long lived token exchange. Meta does not issue a refresh token for the Facebook family, so a refresh is an exchange of the current token. Threads uses its own documented refresh grant. |
| `container.ts` | The container lifecycle rules: a container create is not a publication, a retry reuses the stored container, and a container that is still building reports `processing`. |

## Versions, reviewed 4 August 2026

| Constant | Value | Note |
| --- | --- | --- |
| `GRAPH_VERSION` | `v26.0` | Facebook family. Meta ships roughly three versions a year and deprecates on a published schedule. |
| `THREADS_GRAPH_VERSION` | `v1.0` | Threads versions independently. |

Both are single constants so a version bump is one edit, not a search across three
adapters.

## Error codes mapped to remediations

| Meta code | Meaning | Remediation |
| --- | --- | --- |
| 190 | Token invalid, expired or revoked by a role change | `reconnect_account` |
| 10, 200 to 299 | Permission not granted for this action | `grant_additional_permission` |
| 4, 17, 32, 613 | Application, user or Page rate limit | `provider_rate_limited` |
| 100 with subcode 2207050 | Media could not be processed | `media_invalid` |
| 368 | Account or Page restricted by Meta | `provider_rejected_content` |

Only the numeric codes drive control flow. Meta's message text is localized and is used
only as a sanitized, truncated explanation shown next to the remediation.

## App review

Instagram and Facebook Pages share one app and one review pass, submitted together and
explicit about which product surface uses which permission. Threads is a separate
permission set on the same review track. Business verification blocks all three. Target
submission: Week 4 (ends 6 September 2026).

## Open question for the whole family

Meta documentation was intermittently rate limited during research (source register).
Reopen and save the exact live versions of every page linked from the three subdirectory
READMEs before implementation and before any review submission.
