# `@relay/mcp`

The remote Streamable HTTP MCP server. It is a **resource server** in front of
the same application services the web app, the REST API and the CLI use. It
contains no publishing logic and no second authorization system.

## Connecting a client

The endpoint is `https://mcp.postarray.com/mcp` in production. Every client
signs in with the person's Post Array account and asks them to approve access
on the consent screen; nothing secret goes into a config file.

- **Claude (web and desktop):** Settings, then Connectors, then Add custom
  connector, and paste the URL.
- **Claude Code:** `claude mcp add --transport http postarray https://mcp.postarray.com/mcp`,
  then `/mcp` to sign in.
- **Codex:** `[mcp_servers.postarray]` with `url = "https://mcp.postarray.com/mcp"`
  in `~/.codex/config.toml`, then `codex mcp login postarray`.

The flow a client runs, with no pasted URLs beyond the endpoint:

1. `POST /mcp` without a token answers 401 with
   `WWW-Authenticate: Bearer resource_metadata=".../.well-known/oauth-protected-resource/mcp", scope="..."`.
2. The protected resource metadata (served at that path-specific location and
   at the root one) names the API as the authorization server.
3. The client reads `/.well-known/oauth-authorization-server` on the API,
   registers itself at `registration_endpoint` (RFC 7591, public clients only),
   and runs the authorization code flow with PKCE S256 and
   `resource=<MCP_RESOURCE_URL>`.
4. A signed-out browser is sent to sign in and back; the consent screen tells
   the person the app named itself, and approving writes a durable grant.
5. The token is bound to `MCP_RESOURCE_URL`. This server introspects it with
   its own confidential client on each call (cached for 30 seconds).

## Configuration

| Variable | Read by | Meaning |
| --- | --- | --- |
| `MCP_RESOURCE_URL` | API and MCP | Canonical URL of this endpoint, path included (`https://mcp.postarray.com/mcp`). Tokens are bound to exactly this value. |
| `MCP_CLIENT_ID` | API and MCP | This server's confidential client. The only client that may introspect tokens it did not request, and only tokens bound to `MCP_RESOURCE_URL`. |
| `MCP_CLIENT_SECRET` | API and MCP | That client's secret. |
| `OAUTH_ISSUER_URL` / `API_URL` | MCP | Where `/oauth/introspect` lives. |
| `MCP_SANDBOX` | MCP | Development only: wire everything to the fake provider. |

The client must exist in the API's credential directory before this server can
verify anything. The API registers it at start-up whenever the three `MCP_*`
variables are set, and refuses to start if only some are. Rotating the secret
is "change it in both services and restart". The API's credential store is
Redis on the private network, so there is no separate step to run by hand; for
an API that is already running, `pnpm --filter @relay/api
oauth:register-mcp-client` does the same thing from its environment. Until the
client exists, every call answers 503 (`INTROSPECTION_CLIENT_REJECTED` in the
logs), not 401.

## Authorization

- Transport is Streamable HTTP over TLS, stateless. There are **no
  unauthenticated tools**, not even read tools. `GET` and `DELETE` on `/mcp`
  answer 405 with `Allow: POST`: there is no server stream and no session.
- CORS is open and preflight is answered before authentication. The server
  never reads a cookie, so an open origin grants nothing a page does not
  already hold; `WWW-Authenticate` and `Mcp-Session-Id` are exposed so a
  browser client can read the challenge.
- **Audience binding is mandatory.** A token is accepted only after its audience
  is compared, as an exact string, against this resource's identifier. This is
  the confused deputy defence and it is the most important check in the server.
  There is no prefix matching: a token for
  `https://mcp.relay.example.attacker.test` is refused.
- `Authorization: Bearer` only. A token in a query parameter is rejected before
  anything else happens, because query strings end up in access logs, referrer
  headers and browser history.
- An authorization server that cannot answer (5xx, 429, network failure, or our
  own client refused) is a **503 with `Retry-After`**, never a 401: a 401 would
  make the client discard a good token and send the person back through consent.
- **Every call is re-verified and re-authorized** against the granting user's
  scopes. An MCP connection is long lived and a grant can be revoked in the
  middle of it, so the server runs stateless: a fresh transport and a fresh
  protocol server per request.
- The server never trusts the agent host's confirmation. "The user clicked
  approve in their agent" is not an authorization fact this server can observe,
  so it is not one it acts on.

## Tools

| Tool | Risk | Scopes | Approval |
| --- | --- | --- | --- |
| `list_accounts` | read | `accounts:read` | 0 |
| `list_projects` | read | `drafts:read` | 0 |
| `get_capabilities` | read | `accounts:read` | 0 |
| `get_calendar` | read | `drafts:read` | 0 |
| `preview_post` | read | `drafts:read` | 0 |
| `validate_post` | read | `drafts:read` | 0 |
| `get_post_status` | read | `drafts:read` | 0 |
| `get_analytics` | read | `analytics:read` | 0 |
| `get_growth_plan` | read | `growth:read` | 0 |
| `list_growth_opportunities` | read | `growth:read` | 0 |
| `list_recent_events` | read | `accounts:read` | 0 |
| `get_media` | read | `media:read` | 0 |
| `list_media` | read | `media:read` | 0 |
| `list_recent_receipts` | read | `analytics:read` | 0 |
| `get_receipt` | read | `analytics:read` | 0 |
| `preview_commit` | read | `drafts:read` | 0 |
| `suggest_copy` | read | `drafts:read` | 0 |
| `review_draft` | read | `drafts:read` | 0 |
| `suggest_posting_time` | read | `analytics:read` | 0 |
| `draft_post` | reversible | `drafts:write` | 1 |
| `request_approval` | reversible | `drafts:write` | 1 |
| `generate_growth_plan` | reversible | `growth:write` | 1 |
| `create_campaign_from_plan` | reversible | `growth:write`, `drafts:write` | 1 |
| `import_media` | reversible | `media:write` | 1 |
| `schedule_post` | **consequential** | `posts:schedule` | 2 |
| `publish_post` | **consequential** | `posts:publish` | 3 |
| `cancel_post` | **consequential** | `posts:cancel` | 2 |

The scopes advertised in the metadata and in a 401 challenge are derived from
this table, so a new tool's scope can be requested the day it ships.

Titles shown in a client (for example Claude's approval prompt) come from the
product catalog (`developer.connect.tool.*`). Every argument carries a
description (`src/tools/field-descriptions.ts`), and `initialize` returns short
instructions that point the model at `list_projects` before `draft_post`.
A refusal carries its stable `code`, its `messageKey` and a plain English
`message`.

There is no `publish_everywhere` and no tool whose blast radius is invisible
from its name and arguments.

Each tool's description is **generated from its declaration**, so it cannot
disagree with what is enforced: risk, side effect, required scopes, approval
level, whether an idempotency key is required and whether a person must
confirm. A test asserts this.

## The non-negotiable rules

- **Every consequential tool requires an `idempotency_key`**, rejected rather
  than defaulted. `create_campaign_from_plan` requires one too: a retrying agent
  in a loop produces duplicate drafts across a whole workspace.
- **Immediate publish requires a human.** `publish_post` without a
  `confirmation_id` mints a pending confirmation bound to the workspace, the
  grant, the content item and a fingerprint of the exact target accounts, and
  returns a link on the Post Array app domain. It publishes nothing. A person opens
  that link, in a session this server did not create, sees what will publish and
  where, and approves. The second call consumes the confirmation once. Changing
  the content afterwards changes the fingerprint, which invalidates it: that is
  the "content changed after approval" rule, enforced rather than described.
- **Account ids are resolved server side.** A tool argument is a Post Array
  connection id the grant already permits. A raw provider handle is never
  accepted and never looked up with ambient authority.
- **Results are compact.** Bounded pages with ids the next tool accepts. A tool
  that could return ten thousand calendar entries returns ten and a cursor. No
  `resource_link` items are sent, because this server offers no `resources`
  capability to resolve them.
- **A missing metric is `unavailable_*`, never `0`.**
- **Every call is audited** with the app, the grant subject, the workspace, the
  scopes in use, the approval level and the resulting publication receipt.
  Denials are audited too: a refused publish attempt is what an operator most
  needs to see.
- Two kill switches, both effective within one request: per grant (a grant
  revoked in Settings is refused by the application layer, which re-reads the
  grant row on every call; introspection also carries a `killed` flag) and per
  workspace.

## Sandbox mode

`MCP_SANDBOX=1` wires every service to the in-memory `fake` provider. An agent
can run the whole tool set, including the consequential ones, and see receipts,
without a single request reaching a real platform.

The rules are **not** relaxed. Sandbox still requires the scope, still requires
the idempotency key, and `publish_post` still requires a human confirmation. A
sandbox that is easier than production teaches an agent the wrong habits and
hides the failures worth finding early. It refuses to start when `NODE_ENV` is
production.

## Skills

`skills/` holds a small reviewed skill for Claude Code, Codex and Hermes. They
document the workflow and call this server. They contain no secret, no token and
no platform workaround, and no instruction for routing around a refusal: if a
tool says a person must confirm, the skill says so and stops. A test asserts the
skills name every tool that exists and contain no credential-shaped string.

## Wiring

`src/ports.ts` declares the exact slice of `packages/application` this server
uses. `src/wiring.ts` is a single pass-through adapter from `Services` to that
port, and it must stay logic free: the moment it makes a decision, the MCP
surface stops being the same surface as the API and the CLI.

## Testing

```sh
pnpm --filter @relay/mcp test
```

The token verifier, the services, the confirmation store, the kill switch and
the clock are all injected. `src/http.test.ts` is the one test that listens, on
a loopback port, to exercise the real HTTP surface. The whole OAuth dance
against the real API (registration, sign-in redirect, consent, token with
`resource`, introspection, a tool call over HTTP) is
`apps/api/src/oauth-provider/mcp-connect.e2e.test.ts`.
