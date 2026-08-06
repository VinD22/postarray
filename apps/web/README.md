# @relay/web

The Relay web surface: the product shell, authentication, onboarding and Home.

Next.js 16 (App Router, React Server Components by default), React 19,
TypeScript in strict mode, Tailwind CSS v4 driven entirely by the tokens in
`@relay/design-system`.

## Running it

```bash
pnpm install
pnpm --filter @relay/web dev
```

Open <http://localhost:3000>.

**With no API running, the app serves seeded demo data** and shows a persistent
"Demo data" notice in the shell. That is deliberate: the whole product is
reviewable on day one, and it is never possible to mistake an example workspace
for a real one. Point `NEXT_PUBLIC_RELAY_API_URL` at the API and restart to use
live data. See `.env.example`.

## Environment

`NEXT_PUBLIC_SITE_ORIGIN` is the public canonical origin for this web
deployment. It supplies canonical URLs, structured data, `hreflang`
alternates, and the sitemap. Set it to the exact HTTPS origin for each deployed
environment, without a trailing slash. For local development it is
`http://localhost:3000`.

```bash
pnpm --filter @relay/web typecheck
pnpm --filter @relay/web lint
pnpm --filter @relay/web test
```

## What lives where

```text
src/
  app/
    layout.tsx        html, fonts, theme bootstrap, providers
    globals.css       the only app stylesheet
    error.tsx         typed error boundary, renders a real remediation
    (auth)/           sign in, sign up, magic link, password reset
    (app)/            the signed-in area: shell + Home
    (onboarding)/     first run, six steps
  components/
    shell/            navigation, command palette, Action center, menus
    home/             the Home sections
    auth/             the sign in and sign up forms
    onboarding/       the six steps
  lib/
    api/              the typed client, hooks, fixtures
    auth/             server session resolution, client session context
    i18n/             locale negotiation, providers, bound formatters
    utils/
```

## The API client

Every screen imports one object:

```ts
import { api, ApiError, newIdempotencyKey } from '@/lib/api';
import { useConnections } from '@/lib/api/hooks';
```

`src/lib/api` mirrors the backend service contract one to one. Nothing in the
app calls `fetch` directly, which is what makes the following true everywhere
by construction:

- **The session travels automatically.** In the browser it is an httpOnly
  cookie; server components forward the incoming cookie header.
- **Every request carries a correlation id**, so a support conversation names
  one reference instead of a screenshot.
- **Every create, schedule, publish and cancel requires an `Idempotency-Key`.**
  A missing key throws before the request leaves the process. Generate it once
  when the user commits to the action, with `newIdempotencyKey`, not once per
  network attempt: retrying with the same key is the entire point.
- **`problem+json` becomes a typed `ApiError`** carrying the RelayError code,
  the catalog message key and sanitized details, so a component renders
  `error.<code>.message` plus `error.<code>.action` and nobody ever sees
  "Something went wrong".
- **401 refreshes once and replays** the exact request, idempotency key
  included. **403 never refreshes**, because a refreshed session has the same
  permissions: it is a role or scope problem and is reported as one.

### Reads and writes

Reads use TanStack Query v5 through `@/lib/api/hooks`. Cache keys start with
the workspace id, so switching workspace cannot leave another tenant's rows on
screen for even one frame.

Writes are mutations and never retry automatically. An optimistic update is
used **only** where a rollback is genuinely safe (snoozing an Action center
row). Nothing that publishes, schedules, cancels or approves is optimistic:
the truth about an external side effect lives on the server.

## Copy

Every user-visible string comes from `@relay/i18n`. There is no English literal
in a component. Shell, Home, auth and onboarding keys that the shared catalogs
did not already cover live in
`packages/i18n/src/messages/en/web-shell.ts`.

```tsx
'use client';
import { useTranslations, useFormatters } from '@/lib/i18n';

const t = useTranslations();
const format = useFormatters();   // already bound to the workspace time zone
```

Server components use `@/lib/i18n/server`:

```tsx
const intl = await getRequestIntl();
intl.t.format('home.title');
```

V1 ships English only. The routing, the negotiation and the provider structure
are already locale aware, so adding a language is a catalog file plus a status
change in `@relay/i18n`, with no route or component changes. Layout uses
logical properties throughout (`ps-*`, `border-e`, `text-start`) and no text
container has a fixed width, so RTL is a `dir` attribute and a 40 percent
longer translation still wraps.

## The shell

Six fixed destinations: Home, Calendar, Automation, Analytics, Library,
Connections. **Compose is a persistent primary action, not a seventh
destination**, because composing is something you start from anywhere. **AI is
deliberately not a destination**: AI actions are verbs inside the composer, the
calendar and analytics.

The shell also holds the workspace switcher, the command palette (`Cmd/Ctrl+K`,
real actions only), the Action center, help (in the same position on every
screen, WCAG 2.2 SC 3.2.6), the account menu, the skip link, the aria-live
announcer region and the offline banner.

Below 768px the rail becomes a compact bottom bar: Home, Calendar, Compose
(raised, centre), Analytics, More.

## The Action center

One queue for the eleven situations that need a human: connection expiring,
connection action required, draft failing provider validation, approval
overdue, schedule conflict, provider outage, root published with a thread item
failed, analytics stale, RSS feed invalid, webhook delivery failing, and usage
balance needed.

Every row names the affected account and ends in exactly one verb. The mapping
lives in `src/components/shell/action-center-catalog.ts` and is covered by a
test that fails if a kind loses its sentence, loses its verb, or gains a vague
one.

## The states every screen implements

Loading, empty, error, partial success, offline, permission denied, rate
limited, provider outage. Not one of them is a follow-up ticket. They come from
`@relay/design-system/patterns`; nothing here re-implements a button, a dialog,
a status pill, an empty state, an error state or a metric display.

A missing metric renders `Unavailable` with a reason through `MetricValue`. It
is never a fabricated `0`.

## Accessibility

WCAG 2.2 AA is a merge requirement.

- Full keyboard operation, logical focus order, one visible 2px focus ring.
- No drag-only interaction anywhere.
- Status never carried by colour alone: every state has an icon and a word.
- 44px targets on coarse pointers; 24px minimum everywhere.
- 200 percent zoom and 320px reflow with no horizontal page scroll. Wide
  content scrolls inside its own container.
- Live regions: polite for save state, validation, upload progress and
  schedule confirmation; assertive only for a publish or sign-in failure.
- `scroll-margin-block` on every focusable element so the sticky header never
  covers focus (SC 2.4.11).

Verified at 360, 390, 768, 1024, 1280, 1440 and 1920px.

## Things that must never appear here

No AI image or video generation affordance in any state, including disabled or
feature-flagged. No fabricated metric, logo, testimonial or screenshot. No em
dash in product copy. No hype words. "Not built yet" and "the provider does not
support this" are different sentences and stay different.
