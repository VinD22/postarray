# `@relay/links`

The short-link redirect service. It answers `GET /:slug` with a 302 and does
nothing else of consequence.

## Why it is its own app on its own registrable domain

1. **Session safety.** This service accepts attacker-controlled paths and emits
   redirects to third-party sites. If it shared a registrable domain with the
   product, a cookie scoped to `.<domain>` would be sent here and any reflection
   bug would become a session exfiltration path. On its own domain there is no
   cookie to leak. `main.ts` refuses to start if the redirect host equals the
   app host.
2. **Reputation isolation.** Redirect domains get flagged by safe browsing and
   email filters when a customer abuses one. That must never take the product or
   the API offline.
3. **Blast radius.** The redirect path holds no tenant credential, opens no
   session and writes nothing on the hot path.
4. **Scale.** Redirects are the highest-RPS, lowest-value-per-request traffic in
   the system, so they are limited and scaled on their own.

## Behaviour

| Route | Behaviour |
| --- | --- |
| `GET /:slug` | Cached lookup, safety gate, `302`. Click appended to a buffer. |
| `GET /healthz` | Health document plus the current kill-switch snapshot. |
| `GET /robots.txt` | `Disallow: /`. |
| `POST /_abuse` | Unauthenticated, rate limited, machine shaped abuse report. |

Unknown, disabled, expired, abuse-flagged and unsafe-destination slugs all
render the **same** notice page with the **same** `404`. The reason is logged;
it is never rendered. That is deliberate: an enumerating attacker must not be
able to tell "no such slug" from "this slug exists and is switched off".

## Destination safety

`checkDestination` runs twice: once in the application service when a link is
created, and again here before every redirect. Checking once is not checking,
because a scanner verdict, a tampered row or a newly nested redirect all change
the answer after the fact.

It rejects: schemes outside the allowlist (so no `javascript:`, `data:`,
`file:`), credentials in the authority (`https://bank.example@evil.test`),
loopback and private and link-local and CGNAT targets in both IPv4 and IPv6
including the `::ffff:` mapped form, cloud metadata hosts, internal DNS
suffixes, bare single-label hosts, unexpected ports, destinations pointing back
at this service, and nested redirect parameters whose target is itself unsafe or
deeper than the allowed chain depth.

## Privacy of click data

A click row is: coarse timestamp (truncated to the hour), country from the edge
header, device class, referrer class, bot class, a keyed dedupe hash and the
retention bound for that hash.

There is no IP column and no user agent column, by construction. The address is
read once inside `buildDedupeKey`, coarsened (last IPv4 octet dropped, IPv6 cut
to three groups), HMAC'd with a server-side key bound to the link and the time
window, and discarded. `dedupeExpiresAt` bounds retention of even that hash.

Never put personal data in a slug or a query string. Slugs are validated against
a fixed pattern and are not sequential.

## Kill switches

- **Per link and per workspace**: the `state` column, effective within the
  lookup cache TTL (30 seconds in production).
- **Global**: `SHORT_LINK_KILL_SWITCH=1`, re-read on `SIGHUP`, effective on the
  next request.
- `MutableKillSwitch.apply` lets an operator process flip all three from Redis
  without a deploy.

## Configuration

`loadConfigFor('links')` requires `SHORT_LINK_BASE_URL` and `DATABASE_URL`.
`SHORT_LINK_HASH_KEY` is required by the dedupe path. `PORT` defaults to 8081.

## Testing

```sh
pnpm --filter @relay/links test
```

No test opens a socket to anything. The store, the click sink, the kill switch
and the clock are all ports with in-memory implementations.
