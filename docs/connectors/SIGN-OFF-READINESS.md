# Connector sign-off readiness

Plain-language status summary, not a definition-of-done document itself. It exists to tell a
human, at a glance, how far each connector's `docs/connectors/<provider>/definition-of-done.md`
got from code alone, and exactly what is still missing. Written 2026-08-19 from a code-only
review: every "done" claim below traces to a test that was run during that review, or to a
specific line of code; nothing here was verified against a live provider account.

## Bluesky

**14 of 23 items checked.** (Unchanged by this review — Bluesky's dossier was already at 14/23;
this review examined the 9 unchecked items and confirmed none of them can be satisfied by code,
adding a note to each instead of checking any.)

Remaining, in plain language:
- Nobody has independently re-confirmed Bluesky's documentation and policy links against the live
  site (the "4 August 2026" date on file was recorded by the person who built the connector, not
  checked by anyone else).
- Nobody has recorded Bluesky's current app-review status with evidence (Bluesky needs none today,
  but that is a policy fact someone has to go verify and date, not a code fact).
- No real Bluesky account has ever been connected, posted to, or disconnected through this code —
  every test runs against fabricated, offline responses.
- No real text post or image post has produced a real receipt.
- The chaos tests that prove "we never double-post" exist and pass, but they run against a fake
  test provider, not the real Bluesky connector — Bluesky also has no code today that checks
  whether a post already exists before retrying a failed create, unlike X.
- The error responses this connector is tested against are all invented, not captured from the
  real Bluesky API.
- Nobody has signed off.

**OAuth credentials:** Bluesky needs none. `packages/connectors/src/providers/index.ts` declares
`bluesky: []` in `PROVIDER_REQUIRED_ENV` — it authenticates per user connection with an app
password rather than an application-level OAuth client, so there is nothing to add to
`.env.example` for it (and nothing is missing there).

## X

**18 of 76 items checked**, using the full repository-wide template
(`docs/connectors/definition-of-done.md`) for the first time, copied fresh for this review.

Remaining, in plain language — the largest, most consequential groups:
- Everything about actually being approved to publish on X: no application has been submitted, no
  documentation link has been independently re-checked, no live account has ever connected,
  posted, or disconnected through this code.
- Nobody has decided or recorded whether X needs its own separate "log in with X" application
  distinct from the publishing one; today only one X application config exists.
- Reconnecting, pausing, and disconnecting a real X connection are implemented but have no test
  proving they work — in particular, nothing calls the code that revokes a token or refreshes one
  near expiry.
- The public-facing receipt, audit trail, and Action Center UI are unverified from this connector's
  code (they live in other packages).
- Two real product gaps, not just missing paperwork: X image and video posts do not require or
  offer to skip alt text (it is silently optional, contradicting the accessibility rule this gate
  is supposed to enforce), and nothing in this connector re-uploads-safely on a retry — every retry
  re-uploads media from scratch.
- No runbook file exists for X, so several ownership and documentation items have nothing to point
  to.
- The two named-human items (engineering owner, policy owner) currently hold team labels
  ("Backend/Connectors 1", "Policy Owner"), not real names.

What the code genuinely does prove well for X, worth calling out: it never re-creates a post it
already made (it checks first), a failed reply never takes down an already-published root post,
every error a real API session could return classifies into a known bucket instead of crashing,
no token or secret can leak into a user-facing message, and the per-post cost estimate (including
the more expensive price for a post containing a link) is exact and tested.

**OAuth credentials:** `X_CLIENT_ID` and `X_CLIENT_SECRET` are both declared in `.env.example` and
required by `packages/connectors/src/providers/index.ts` (`PROVIDER_REQUIRED_ENV.x`). Declared,
not verified real — this review did not and must not open the real `.env` file.

## LinkedIn

**15 of 76 items checked**, using the full repository-wide template, copied fresh for this
review.

Remaining, in plain language — the largest, most consequential groups:
- Everything about actually being approved to publish on LinkedIn: the Community Management app
  review (LinkedIn's longest one) has not started, no live account has ever connected, posted, or
  disconnected through this code.
- A real, specific open question that should be resolved before this connector is trusted with
  retries: the code says LinkedIn has no idempotency mechanism, but also sends a header a code
  comment calls "LinkedIn's own idempotency control," and never checks whether a post already
  exists before retrying a failed create. Those two things cannot both be true as written, and
  nobody has tested which one is.
- Reconnecting, pausing, and disconnecting a real LinkedIn connection are implemented but have no
  test proving they work — nothing calls the code that revokes a token or refreshes one.
- Two real product gaps, the same ones found for X: LinkedIn image posts do not require or offer
  to skip alt text (silently optional), and nothing re-uploads-safely on a retry — every retry
  re-uploads images, documents, and video from scratch.
- No runbook file exists for LinkedIn, so several ownership and documentation items have nothing
  to point to.
- The two named-human items currently hold team labels ("Backend/Connectors 2", "Policy Owner"),
  not real names.

What the code genuinely does prove well for LinkedIn, worth calling out: a member without the
right Page role gets told exactly that instead of a generic error, a member post's restricted
analytics are honestly reported as unavailable rather than shown as zero, and no token or secret
can leak into a user-facing message.

**OAuth credentials:** `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` are both declared in
`.env.example` and required by `packages/connectors/src/providers/index.ts`
(`PROVIDER_REQUIRED_ENV.linkedin`). Declared, not verified real — this review did not and must not
open the real `.env` file.

## The one sentence that matters

No connector here — Bluesky, X, or LinkedIn — may be labelled `supported` anywhere in the
product, the website, documentation, a sales conversation, a changelog, or a social post until a
named engineering owner and a separate named reviewer, neither of whom is this review, complete
every remaining item above against a real, live provider account and sign the block at the end of
that connector's `definition-of-done.md`, exactly as `docs/connectors/definition-of-done.md`
itself requires.
