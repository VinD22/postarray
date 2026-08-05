# `relay` CLI

An agent-friendly command line for the same application services the web app,
the API and the MCP server use. It bypasses no approval, no tenancy check, no
idempotency guarantee and no policy control, because it does not contain any
publishing logic: it calls `/v1`.

## Install and log in

```sh
relay config set apiUrl https://api.relay.example
relay auth login                       # device flow, works over SSH
relay auth login --flow authorization-code
relay auth whoami
```

`auth login` prints the verification URL and the user code to **stderr**, so
`--json` output on stdout stays clean. It never prints a token.

## Every command

| Command | Risk | Notes |
| --- | --- | --- |
| `auth login \| logout \| whoami` | read | logout revokes at the issuer, then forgets locally |
| `accounts list \| capabilities <id>` | read | `unsupported` and `not_implemented` stay distinct |
| `posts validate --content-item <id>` | read | deterministic preflight, non-zero exit when it will not publish |
| `posts validate <file> --idempotency-key` | reversible | creates the draft first, then validates it. Publishes nothing |
| `posts preview --content-item --target` | read | exact platform variant |
| `posts list` | read | |
| `posts status <job-id>` | read | |
| `posts schedule <file> --idempotency-key` | **consequential** | |
| `posts publish --confirm --idempotency-key` | **consequential** | |
| `posts cancel <job-id> --idempotency-key` | **consequential** | |
| `calendar list --from --to` | read | |
| `receipts get <id>` | read | |
| `analytics post <receipt-id>` | read | unavailable metrics are labelled, never `0` |
| `analytics account <connection-id>` | read | |
| `growth plan get <id>` | read | |
| `growth plan export <id> --format markdown\|json\|yaml` | read | body printed verbatim |
| `rules list \| test <id>` | read | a test run performs no external action |
| `links create <url> --idempotency-key` | reversible | |
| `links stats <link-id>` | read | first-party redirect series, not provider clicks |
| `config set \| get \| unset` | read | settings only, never credentials |

## `--json`

Available on every command. The envelope shape is a contract:

```json
{
  "ok": true,
  "apiVersion": "v1",
  "command": "accounts list",
  "correlationId": "…",
  "data": {},
  "error": null,
  "plannedExternalActions": []
}
```

On failure, `ok` is `false`, `data` is `null` and `error` is the RFC 9457
problem document the API produced, with its stable `code` and `messageKey`. A
script never has to parse prose.

## Exit codes

`0` is success, `2` is a usage error, and everything else maps to the
`RelayError` code from `@relay/contracts`. The table is in
`src/exit-codes.ts` and is covered by a test that fails if a new error code is
added without deciding what automation should do about it.

Families are grouped so a wrapper can branch without enumerating:
`10-14` authentication and authorization, `20-23` existence and conflict,
`30-35` content and media, `40-42` approval and policy, `50-52` capability and
connection, `60-64` limits and billing, `70-72` provider, `80-81` assistant,
`90` internal.

## Tokens

- **Never** passed on the command line. There is no `--token` flag, and the CLI
  refuses to run if it sees one: `ps` shows another user's arguments on most
  systems and the shell writes them to history.
- Read from `RELAY_TOKEN` or from `~/.config/relay/credentials.json`, which is
  written `0600` inside a `0700` directory. A credential file that anyone else
  can read is refused, not quietly tightened.
- Never printed. `whoami` shows the subject, workspace, scopes, approval level
  and expiry.

## `--dry-run`

Available on every consequential command. It calls read-only endpoints and
prints one row per thing that would exist on a platform afterwards: the root
post for each target plus each thread item and first comment, with the account,
the time and zone, whether approval or human confirmation gates it, and the
estimated provider cost.

```sh
relay posts schedule launch.json --dry-run
relay posts schedule launch.json --dry-run --json | jq '.plannedExternalActions'
```

A dry run issues only `GET` requests: the connection list and each target's
capability snapshot, which is where the cost estimate comes from. No draft is
created, no idempotency key is required, and a test asserts that no non-`GET`
request leaves the process.

Validation runs against the real content model, so it needs a draft to exist.
That is why `posts schedule` validates after creating the draft and before
scheduling it, and why `--dry-run` reports the plan rather than the validation
result.

## Consequential guarantees

- `schedule`, `publish`, `cancel` and `links create` require
  `--idempotency-key`. Repeating a request with the same key returns the
  original result instead of publishing twice.
- `publish` additionally requires `--confirm`. Immediate publication needs an
  explicit human decision.
- The server enforces all of this again. Nothing here is the only line of
  defence, and none of it can be avoided by not using the CLI.

## The draft file

`posts validate`, `posts schedule` and `posts publish --file` read a small JSON
document (`src/draft.ts`, `version: 1`):

```json
{
  "version": 1,
  "brandId": "brand_…",
  "body": "What we shipped this week.",
  "contentKind": "text",
  "locale": "en",
  "links": [{ "originalUrl": "https://acme.example/changelog", "tracked": true }],
  "threadItems": [{ "kind": "comment", "body": "Full notes in the link.", "delaySeconds": 60 }],
  "targets": [
    { "connectionId": "conn_…" },
    { "connectionId": "conn_…", "body": "A shorter version for this account." }
  ],
  "schedule": { "instant": "2026-08-10T09:00:00.000Z", "ianaTimeZone": "Europe/Berlin" }
}
```

A target with no `body` inherits the master. A target with one overrides it, and
that override never leaks into another target. `brandId` is required, in the
file or as `--brand-id`: a draft always belongs to a brand, and guessing one
would put content under the wrong voice, claims and disclosure defaults.

## Testing

```sh
pnpm --filter @relay/cli test
```

No test opens a socket. The config store, the credential store, the HTTP client
and the clock are all injected.
