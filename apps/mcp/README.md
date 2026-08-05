# `@relay/mcp`

The remote Streamable HTTP MCP server. It is a **resource server** in front of
the same application services the web app, the REST API and the CLI use. It
contains no publishing logic and no second authorization system.

## Authorization

- Transport is Streamable HTTP over TLS. There are **no unauthenticated tools**,
  not even read tools.
- OAuth against Relay's own issuer in `apps/api`. We publish
  `/.well-known/oauth-protected-resource` and return `WWW-Authenticate` with the
  metadata URL on a 401, so a compliant client can discover and recover.
- **Audience binding is mandatory.** A token is accepted only after its audience
  is compared, as an exact string, against this resource's identifier. This is
  the confused deputy defence and it is the most important check in the server.
  There is no prefix matching: a token for
  `https://mcp.relay.example.attacker.test` is refused.
- `Authorization: Bearer` only. A token in a query parameter is rejected before
  anything else happens, because query strings end up in access logs, referrer
  headers and browser history.
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
| `get_capabilities` | read | `accounts:read` | 0 |
| `get_calendar` | read | `drafts:read` | 0 |
| `preview_post` | read | `drafts:read` | 0 |
| `validate_post` | read | `drafts:read` | 0 |
| `get_post_status` | read | `drafts:read` | 0 |
| `get_analytics` | read | `analytics:read` | 0 |
| `get_growth_plan` | read | `growth:read` | 0 |
| `list_growth_opportunities` | read | `growth:read` | 0 |
| `draft_post` | reversible | `drafts:write` | 1 |
| `request_approval` | reversible | `drafts:write` | 1 |
| `generate_growth_plan` | reversible | `growth:write` | 1 |
| `create_campaign_from_plan` | reversible | `growth:write`, `drafts:write` | 1 |
| `schedule_post` | **consequential** | `posts:schedule` | 2 |
| `publish_post` | **consequential** | `posts:publish` | 3 |
| `cancel_post` | **consequential** | `posts:cancel` | 2 |

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
  returns a link on the Relay app domain. It publishes nothing. A person opens
  that link, in a session this server did not create, sees what will publish and
  where, and approves. The second call consumes the confirmation once. Changing
  the content afterwards changes the fingerprint, which invalidates it: that is
  the "content changed after approval" rule, enforced rather than described.
- **Account ids are resolved server side.** A tool argument is a Relay
  connection id the grant already permits. A raw provider handle is never
  accepted and never looked up with ambient authority.
- **Results are compact.** Bounded pages plus `relay://` resource links. A tool
  that could return ten thousand calendar entries returns ten and a cursor.
- **A missing metric is `unavailable_*`, never `0`.**
- **Every call is audited** with the app, the grant subject, the workspace, the
  scopes in use, the approval level and the resulting publication receipt.
  Denials are audited too: a refused publish attempt is what an operator most
  needs to see.
- Two kill switches, both effective within one request: per grant (the token's
  own `killed` flag, re-read on every verification) and per workspace.

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

No test opens a socket. The token verifier, the services, the confirmation
store, the kill switch and the clock are all injected.
