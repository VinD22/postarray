# 06. Product UX and Design System

> **Superseded in part.** `packages/design-system/README.md` is authoritative
> for palette, radii, elevation and motion tiers. The shipped system is
> editorial: warm paper, near-black ink, hairline rules, a deep terracotta
> accent, plus marigold (`--accent-warm-*`) and ultramarine (`--accent-cool-*`)
> for the marketing scene vocabulary. Elevation is soft and tonal; dark is a
> warm near-black, designed rather than inverted.
>
> An earlier version of this note described a different redesign (electric
> blue, a sunshine CTA, a blush accent, 2px ink outlines, hard offset shadows,
> an inky navy-black dark theme). None of that shipped; it is recorded here
> only so a reader who remembers it knows it was replaced rather than lost.
>
> The hard constraints in this document (WCAG 2.2 AA as a merge gate, logical
> properties only, no `dark:` variants, no hardcoded English, lucide-react
> icons only, honest copy) all survive unchanged, as does its information
> architecture. Section 2's merge gate is still enforced, with the one
> documented correction recorded in that section.

**Status:** authoritative for design. Referenced by `AGENTS.md`.
**Owner:** Design Lead. **Co-owners:** Product Lead (IA and copy), Web Lead (tokens and components).
**Compiled:** 4 August 2026. Derived from `docs/research/03-product-ux-and-localization.md`,
`docs/research/07-feature-parity-and-product-behavior.md` and `docs/research/02-development-handoff.md`.
Provider-dependent claims cite `docs/research/06-source-register.md` (compiled 4 August 2026) and are
marked **re-verify before implementation** where the provider controls the answer.

Read this before opening Figma or writing a component. It is written so a junior developer can
implement a screen without asking what a state should do.

---

## 1. Experience principle

Post Array is a publishing desk, not an AI console. At every step the user must be able to answer, without
clicking anything:

1. What exactly will be posted.
2. Where, to which named account.
3. Which version each account receives.
4. When, in which time zone.
5. Who approved it.
6. What it may cost.
7. What succeeded, what failed, what needs a human now.

AI is a verb inside the workflow ("Adapt for LinkedIn"), never a destination in the navigation.

### 1.1 Voice rules that bind design

- Direct, calm, specific. "Instagram needs a professional account", not "Authentication failed".
- Numbers before adjectives. "X estimates $0.20 API usage for this link post", not "1 credit".
- Banned words in product copy: revolutionary, magical, effortless, viral, autonomous, game-changing,
  seamless, unleash.
- **No em dashes in product-visible copy.** Use a period, comma, colon or parentheses.
- All strings come from `packages/i18n` with stable intent-based keys. No literal English in a component.

---

## 2. What this product must NOT look like

This section is a merge gate. A pull request that introduces any of the following is rejected on sight,
no design debate required.

| Forbidden | Why | Do instead |
| --- | --- | --- |
| Purple or blue neon gradients | Reads as generic AI SaaS template, undermines a trust product | Warm neutral canvas, one controlled accent |
| Glowing orbs, blurred light blobs, aurora backgrounds | Decoration that carries no information | Flat surfaces, fine borders |
| Glassmorphism, frosted panels, backdrop blur | Contrast failures in both themes, illegible over content | Opaque tonal surfaces |
| Grid or dot-matrix page backgrounds | Visual noise behind dense operational data | Plain canvas |
| A row of three identical feature cards | Says nothing, hides hierarchy | Ordered prose, a table, or one worked example |
| Gradient headline text | Fails contrast, unreadable at 200% zoom | Solid `--fg-strong` |
| Fake dashboard screenshots, invented metrics, invented logos | Fraudulent, and illegal in some markets | Seeded realistic data or an honest empty state |
| A decorative "score" widget (virality score, health ring, growth gauge) | Black-box numbers users cannot audit | Named metric, denominator, provider, freshness |
| A card for something that reads better as a row or a sentence | Card sprawl destroys scanability | Rows, tables, timelines, sentences |
| Pill-shaped status overload and deeply rounded table containers | Turns a queue into confetti | One 4px status dot plus a text label, 6px table radius |
| Chart draw-in, and any animation that delays a number a reader is waiting for | Delays reading, misleads on freshness | Render the final value immediately |
| Astronaut, robot, brain or wizard imagery | Positions AI as the product | Screenshots of the real product |
| Modal that interrupts composing | Loses work | Inline panel, or a sheet that preserves the draft |

Marketing pages get more breathing room and one editorial serif for headlines. They do not get any of
the above either.

**Count-up numbers are no longer banned** (corrected here because they shipped: `<CountUp>` renders the
home page's surfaces figure and the pricing page's price numeral). The blanket ban was aimed at the real
failure, which is a reader waiting on an animation to learn a fact, and that failure is now prevented by
four conditions rather than by prohibition. A count-up is allowed only when all four hold:

1. It tweens a numeric **proxy** and formats each frame exactly as the static value would, so the number
   is never rebuilt as a string and never shows a value that is not a real intermediate.
2. Under `prefers-reduced-motion`, and with no JS at all, it renders the finished value immediately.
   `<CountUp>` branches on `useMotionOk()`; the server HTML already carries the final number.
3. It never animates a number whose meaning depends on freshness or availability. An unavailable metric
   renders `analytics.value.unavailable` with its reason and does not animate at all, ever.
4. In-app it runs **once**, on a screen's first successful data load, never on a filter change, a refetch
   or a re-render. `ComparisonTable`'s `animateCounts` is the pattern.

Anything outside those four conditions is still the banned thing.

---

## 3. Information architecture

### 3.1 Product navigation (fixed, six items)

```
Home        Calendar        Automation        Analytics        Library        Connections
```

`Compose` is a persistent primary action in the shell header (and a bottom-sheet FAB below 768px). It is
not a navigation destination, because composing is a thing you start from anywhere, not a place you go.

**AI is deliberately not a top-level destination.** AI actions live where the user drafts, localizes,
reviews and interprets. The Growth Advisor lives inside Home and campaign setup. Tool Radar lives under
Resources and appears contextually when a plan needs an external creative workflow.

Shell furniture: workspace and brand switcher (left of nav), command palette (`Cmd/Ctrl+K`), Action
Center bell with an unread count, help, account menu.

Settings is a single destination with tabs, reached from the account menu:
Members and roles, Brands, Agents and API, Developer apps, Webhooks, Billing, Referrals, Localization,
Security, Data controls.

### 3.2 Why these six

| Item | The question it answers |
| --- | --- |
| Home | What needs me today? |
| Calendar | What is going out and when? |
| Automation | What runs without me, and what could it do at most? |
| Analytics | What happened, and what should I test next? |
| Library | Where is my media, Sets, Signatures, and past content? |
| Connections | Which accounts are healthy, and what can each one do? |

Anything that does not answer one of those six questions belongs in Settings or in the Action Center.

### 3.3 Public site navigation

Product, Integrations, For creators, For agencies, For developers, Pricing, Resources, Sign in,
Start free. Resources holds guides, workflow templates, customer stories (only with written consent and
a link to evidence), platform status and capabilities, comparisons with a published methodology,
documentation, changelog and blog.

---

## 4. Screen inventory

`P` = product surface, `S` = settings tab, `M` = marketing. "Wireframed" means section 5 contains a
textual wireframe.

| # | Screen | Area | Wireframed | Primary states beyond loading/empty/error |
| --- | --- | --- | --- | --- |
| 1 | Home | P | yes (5.1) | trial banner, action-required count, advisor entry |
| 2 | Composer | P | yes (5.2) | saved, offline, conflict, override, validation, cost |
| 3 | Calendar and Queue | P | yes (5.3) | drag confirm, DST warning, partial published |
| 4 | Post detail and publication receipt | P | yes (5.4) | partial, retry scheduled, deleted externally |
| 5 | Action Center | P | yes (5.5) | snoozed, resolved, escalated |
| 6 | Connections list and detail | P | yes (5.6) | action required, review restricted, paused |
| 7 | Analytics overview and post detail | P | yes (5.7) | unavailable metric, stale, insufficient sample |
| 8 | Tracked links | P | no | bot-filtered, disabled link |
| 9 | Automation Rules list and editor | P | yes (5.8) | draft, test mode, paused, killed |
| 10 | RSS sources | P | no | feed invalid, stalled, deduped |
| 11 | Library: media, Sets, Signatures | P | no | rights declaration missing, alt text missing |
| 12 | Growth Advisor: intake, plan, exports | P | yes (5.11) | assumptions, stale catalog, empty catalog |
| 13 | Tool Radar | P | yes (5.12) | fewer than five results, stale record |
| 14 | Agents and API settings | S | yes (5.9) | one-time credential, killed agent, dry run |
| 15 | Developer apps | S | yes (5.10) | secret shown once, grants, sandbox |
| 16 | Billing and trial | S | yes (5.13) | trialing, active, past due, read-only, canceled |
| 17 | Members and roles | S | no | invite pending, last owner protection |
| 18 | Brands | S | no | glossary, disclosure defaults |
| 19 | Webhooks | S | no | failing, disabled on persistent failure |
| 20 | Referrals | S | no | hold, refunded, paid |
| 21 | Localization | S | no | English only in V1, beta locale labels |
| 22 | Security | S | no | MFA required, sessions, grants revoke |
| 23 | Data controls | S | no | export in progress, deletion scheduled |
| 24 | Onboarding flow | P | no | checkout returned but webhook not yet verified |
| 25 | Pricing page | M | no | one plan, two intervals |
| 26 | Capability matrix (public) | M | no | supported / not built / provider does not support |
| 27 | Status page | M | no | partial outage by connector |

---

## 5. Textual wireframes

Conventions: `[ ]` button, `( )` radio, `[x]` checkbox, `▸` disclosure, `•` status dot, `…` truncation.
Every wireframe shows the desktop 1280px layout unless stated.

### 5.1 Home

```
┌ Post Array  [Acme ▾][Brand: Acme EU ▾]      ⌕ Search        [+ Compose]   🔔 3   ? ▾   AV ▾ ┐
├───────────────────────────────────────────────────────────────────────────────────────┤
│ Home  Calendar  Automation  Analytics  Library  Connections                           │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ Trial: 4 days left. Converts 11 Aug 2026 to $29.00 per month.  [Manage or cancel]      │
│                                                                                       │
│ Needs you now                                                        3 items          │
│ • LinkedIn (Acme EU) token expires in 2 days.                        [Reconnect]      │
│ • "Launch thread" comment 2 of 3 failed on X. Root post is live.     [Open receipt]   │
│ • Approval requested by Dana, due today 17:00 CET.                   [Review]         │
│                                                                      [Action Center →]│
│                                                                                       │
│ Next 24 hours                                                                         │
│ 09:30 CET  X · @acme        Launch thread (3 parts)      Scheduled                    │
│ 12:00 CET  LinkedIn · Acme  Case study                   Approval requested           │
│ 18:00 CET  Instagram · acme Reel, 0:42                   Preparing media              │
│                                                                      [Calendar →]     │
│                                                                                       │
│ Growth Advisor                                                                        │
│ Your plan v3 was approved 28 Jul. Week 2 of 4 has 5 briefs not yet drafted.            │
│ [Open plan]  [Create drafts from week 2]                                              │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

Rules: no charts on Home. No "welcome back" hero. The trial banner disappears the moment the
subscription is `active`. If there are zero action items the block reads "Nothing needs you right now."
and does not render an illustration.

### 5.2 Composer

Desktop split, three columns, 1280px and above. The account rail is the spine of this screen.

```
┌ Compose                                     Saved 12:04 · autosave on      [Close] ┐
├────────────┬──────────────────────────────────────────────┬────────────────────────┤
│ TARGETS    │ EDITOR: Master draft                         │ PREVIEW: X · @acme     │
│            │                                              │                        │
│ Sets ▾     │ ┌──────────────────────────────────────────┐ │ ┌────────────────────┐ │
│ [Launch EU]│ │ We shipped scheduled first comments for  │ │ │ Acme @acme         │ │
│            │ │ every connector that officially supports │ │ │ We shipped sched…  │ │
│ • X @acme  │ │ them. Details: {link}                    │ │ │ relay.to/a7Kq2     │ │
│   inherits │ └──────────────────────────────────────────┘ │ │ 09:30 · 6 Aug      │ │
│   248/280  │ Media (master): 1 image, alt text set        │ └────────────────────┘ │
│            │                                              │ ▸ Comment 1 (+2 min)   │
│ • LinkedIn │ Link controls                                │ ▸ Comment 2 (+5 min)   │
│   OVERRIDE │ ( ) Keep original                            │                        │
│   1102/3000│ (•) Track with short link  relay.to/a7Kq2    │ VALIDATION             │
│            │ [ ] Branded domain: go.acme.com (verified)   │ • X: ok                │
│ • Instagram│ UTM: source=x  medium=social  campaign=q3     │ • LinkedIn: ok         │
│   ISSUE    │                                              │ • Instagram: needs 4:5 │
│   alt text │ Sequence                                     │   or 1:1 image         │
│   missing  │ 1. Root post                                 │   [Fix crop]           │
│            │ 2. Comment  +2 min   author @acme            │                        │
│ • YouTube  │ 3. Comment  +5 min   author @acmedev         │ COST AND APPROVAL      │
│   NOT      │ [+ Add comment or thread item]               │ X: 1 create with a URL │
│   SELECTED │                                              │ estimated $0.200       │
│            │ Repeat: off  [Set cadence]                   │ Total estimated $0.200 │
│ [+ Add]    │ Signature: EU legal footer ▾                 │ Approver: Dana (req.)  │
│            │                                              │                        │
│            │ [Reset this target to master]                │ [Save draft]           │
│            │                                              │ [Request approval]     │
│            │                                              │ [Schedule…] [Publish]  │
└────────────┴──────────────────────────────────────────────┴────────────────────────┘
```

Target rail states, one 4px dot plus a word, never colour alone:

| State | Dot | Label | Meaning |
| --- | --- | --- | --- |
| Inherits | neutral | `inherits` | Target uses the master draft unchanged |
| Overridden | accent | `override` | This target has an explicit divergence |
| Issue | warning | `issue` | Validation warning, still schedulable |
| Error | destructive | `blocked` | Deterministic validation failure, cannot schedule |
| Approval | accent outline | `needs approval` | Policy requires a decision |
| Not built | neutral outline | `not built yet` | Post Array has not implemented this capability |
| Unsupported | neutral outline | `provider does not support` | The provider has no such API |

The last two rows are different sentences and must never be merged into "unavailable".

### 5.3 Calendar and queue

```
┌ Calendar   [Day][Week•][Month][List]    Brand ▾ Account ▾ Platform ▾ Status ▾ Locale ▾ ┐
│ Time zone: Europe/Berlin (workspace)                              [+ Compose]         │
├───────────────────────────────────────────────────────────────────────────────────────┤
│        Mon 3        Tue 4        Wed 5        Thu 6        Fri 7                       │
│ 09:00  X  Launch…                LI Case…                                              │
│        Scheduled                 Approval                                              │
│ 12:00               IG Reel                            X  Thread                       │
│                     Preparing                          Partially published             │
│ 18:00                            YT Upload                                             │
│                                  Failed · action required                              │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ 2 items need action.  [Open Action Center]                                             │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

Drag to reschedule opens a confirmation, never an instant silent write:

```
┌ Move this post? ────────────────────────────────────────────┐
│ X · @acme · "Launch thread"                                 │
│ From  Thu 6 Aug 2026, 09:30 CEST (07:30 UTC)                │
│ To    Sun 25 Oct 2026, 09:30 CET (08:30 UTC)                │
│ Note: clocks change on 25 Oct. The local hour is preserved.  │
│ Cadence check: 3 posts already scheduled to @acme that day.  │
│ [Cancel]                                     [Move post]    │
└─────────────────────────────────────────────────────────────┘
```

Keyboard alternative is mandatory: focus a post, `Shift+Arrow` moves by slot, `Enter` opens the same
confirmation. There is no drag-only operation anywhere in the product.

List view is the default at 768px and below and is available at all widths. It is a table with columns
Time, Account, Content, Status, Approver, and one row action menu.

### 5.4 Publication receipt

This is the differentiating screen. It is immutable and printable.

```
┌ Receipt · X · @acme · "Launch thread"                     [Download JSON] [Share] ┐
│ Status: Partially published                                                       │
│ Root published. Comment 2 of 3 failed permanently.                                │
├───────────────────────────────────────────────────────────────────────────────────┤
│ 04 Aug 09:12  Approval granted by Dana Ito (policy: 2 approvers, brand Acme EU)    │
│ 04 Aug 09:12  Scheduled for 06 Aug 09:30 CEST (07:30 UTC). Surface: web.           │
│ 06 Aug 09:29  Credentials revalidated. Capability snapshot v14 matched approval.   │
│ 06 Aug 09:29  Media prepared. 1 image, 1080x1350, sha256 4f19…c2, derivative v2.   │
│ 06 Aug 09:30  Dispatched. Idempotency key pub_01J…9. Attempt 1.                    │
│ 06 Aug 09:30  Provider accepted. External ID 1834…221.                             │
│               Permalink https://x.com/acme/status/1834…221                         │
│               Metered: 1 post create containing a URL. Estimated $0.200.            │
│ 06 Aug 09:32  Comment 1 published. External ID 1834…905.                            │
│ 06 Aug 09:35  Comment 2 attempt 1 failed. TRANSIENT_PROVIDER 503. Retry in 60s.     │
│ 06 Aug 09:36  Comment 2 attempt 2 failed. CONTENT_INVALID: duplicate content.       │
│               No further retries. [Edit and republish comment 2]                    │
│ 06 Aug 10:30  Analytics first sync. Impressions 1,204. Freshness 58 min.            │
├───────────────────────────────────────────────────────────────────────────────────┤
│ Content version 8c31…a7 (immutable)  ·  Created via web by Ana Ruiz                │
│ Actual metered cost reconciled 07 Aug: $0.200                                      │
└───────────────────────────────────────────────────────────────────────────────────┘
```

Rules:

- The overall campaign is `Partially published` when any target succeeded and any target failed. Never
  roll back a successful external post and never label the campaign failed.
- A failed comment never marks the root post failed.
- Provider responses are sanitized. No token, no raw payload, no internal ID.
- "Published" requires an external ID or explicit provider evidence, never a 2xx from a media container
  step (`docs/research/02-development-handoff.md` section 9).

### 5.5 Action Center

One queue, grouped by urgency, each row ending in one specific verb.

```
┌ Action Center      [All•][Connections][Publishing][Automation][Billing]   [Snoozed] ┐
│ Now                                                                                 │
│ ! LinkedIn · Acme EU token expires in 2 days.               [Reconnect] [Snooze 1d] │
│ ! Comment 2 of 3 failed on X, root is live.                 [Open receipt]          │
│ Soon                                                                                │
│ • Approval due today 17:00 CET, requested by Dana.          [Review]                │
│ • Instagram analytics stale for 9 hours. Provider delay.    [View status]           │
│ Watching                                                                            │
│ • RSS "Acme blog" no new item for 14 days.                  [Check feed]            │
│ • Webhook prod-hooks failed 3 of last 20 deliveries.        [Inspect deliveries]    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Every Action Center item type maps to exactly one remediation route. The full catalogue is the list in
`docs/research/07-feature-parity-and-product-behavior.md`, "Action center".

### 5.6 Connections

```
┌ Connections                                    [+ Connect account]   28 of 30 active ┐
├───────────────────────────────────────────────────────────────────────────────────────┤
│ • X · @acme                Personal   Connected 12 Jun by Ana                          │
│   Publish, threads, metrics. Metered per operation.                                    │
│   Token healthy. Last publish 06 Aug 09:30. Last analytics 06 Aug 10:30.               │
│   [Inspect permissions] [Pause] [Disconnect]                                           │
│                                                                                        │
│ ! LinkedIn · Acme EU       Organization  Connected 3 Mar by Dana                       │
│   Publish, organization analytics. Member read: provider restricts this.                │
│   Token expires 06 Aug 2026. Reconnect to avoid a failed publish.                       │
│   [Reconnect] [Inspect permissions] [Pause] [Disconnect]                                │
│                                                                                        │
│ • YouTube · Acme Channel   Channel      Connected 1 Aug by Ana                          │
│   Upload. Project is unaudited: uploads publish as private until Google completes the   │
│   audit. Analytics: not built yet.                                                      │
│   [Read what this means] [Inspect permissions] [Pause] [Disconnect]                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

`Inspect permissions` opens the capability panel generated from the versioned connector capability
snapshot. It lists, per capability: `supported`, `not built yet`, `provider does not support`, plus the
scope that grants it and the date of the snapshot. The public capability matrix on the marketing site is
generated from the same data and reviewed by a human before publication, so marketing cannot promise
what an adapter cannot do.

YouTube unaudited behaviour: `https://developers.google.com/youtube/v3/docs/videos/insert`, verified
4 August 2026, **re-verify before implementation**.

### 5.7 Analytics

Start with a question, not a chart wall.

```
┌ Analytics    Brand ▾  Accounts ▾  7d [30d•] 90d  Compare to previous 30d [x]  ┐
├───────────────────────────────────────────────────────────────────────────────┤
│ Which posts moved away from your own baseline?                                │
│                                                                               │
│ Post                     Account     Impressions   vs median of last 10        │
│ "Launch thread"          X @acme        12,400      +58%   n=10  ▸ evidence    │
│ "Case study"             LI Acme EU      3,110      -12%   n=10  ▸ evidence    │
│ "Reel: setup in 60s"     IG acme       Unavailable  Instagram has not returned │
│                                        this metric for this media type.        │
│                                        [Why]                                   │
│                                                                               │
│ Comparability note: image posts and video posts are not directly comparable.   │
│                                                                               │
│ Experiments                                                                    │
│ "First comment at 5 min vs 30 min" completed 02 Aug. Comments +21%.            │
│ This is an association, not proof of cause. [Open experiment]                  │
│                                                                               │
│ Freshness: X 58 min · LinkedIn 3 h · Instagram 9 h (provider delay) [Status]   │
└───────────────────────────────────────────────────────────────────────────────┘
```

Rules:

- Every normalized metric has a tooltip with provider field name, provider definition, denominator, unit
  and observation time. The tooltip is never the only place the definition exists; the metric detail
  drawer repeats it.
- Missing data renders the word `Unavailable` plus the reason. Never `0`, never a dash.
- No single cross-platform leaderboard unless the user explicitly picks one clearly defined normalized
  metric, and the header then names it.
- Awareness, consumption, interaction and conversion are separate groups.
- Tracked link clicks are a separate view labelled "first-party redirect measurement" and are never
  merged with a provider's native link-click metric.

### 5.8 Automation Rules

The editor is a readable sentence, not a node graph.

```
┌ Rule: "Blog to social"                          Draft · not running   [Test] [Save] ┐
├─────────────────────────────────────────────────────────────────────────────────────┤
│ When  [a new item appears in RSS "Acme blog" ▾]                                     │
│ If    [locale is en] and [item is not a duplicate of the last 30 days] [+ condition]│
│ Then  [create a draft from template "Blog announce" ▾]                              │
│       [adapt the text for each target ▾]                                            │
│       [request approval from Brand approvers ▾]                             [+ act] │
│ After [no delay ▾]                                                                  │
│ Until [I turn this off ▾]                                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Before you turn this on                                                             │
│ Accounts affected: X @acme, LinkedIn Acme EU.                                       │
│ Maximum external actions: 2 per feed item, at most 14 per week.                     │
│ Approvals: every post waits for a human. Nothing publishes automatically.            │
│ Provider restrictions: none for these actions.                                       │
│ Estimated metered cost: up to $0.40 per item if the item link is included.           │
│ If a run fails: the rule pauses after 3 consecutive failures and files an action.    │
│ [Run a test with the last feed item]   [Turn on]                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Recent runs   ▸ 03 Aug 09:02 created 2 drafts   ▸ 01 Aug 09:02 skipped, duplicate    │
│ Version history: v4 current, v3 by Dana 28 Jul  [Compare]        [Pause] [Kill]      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Additional rules:

- Advanced users can toggle to a structured JSON view that is the exact API representation. Round-trip
  editing between the two must be lossless.
- An action that a provider does not permit is not rendered as a disabled option with a tooltip; it is
  absent from the picker for that provider, and a line under the picker states why.
- Engagement-threshold triggers require a measurement window, an expiry, a cooldown and a maximum
  execution count. Defaults: run once per source post, do not execute if the metric is unavailable or
  stale. See X automation policy, `https://help.x.com/en/rules-and-policies/x-automation`, verified
  4 August 2026, **re-verify before implementation**.
- Cross-account follow-up is off by default and requires explicit preauthorization naming both accounts.
- Auto-like, auto-follow, unsolicited replies and DMs, and engagement pods do not exist as options.
  A request for one, from any surface including the agent, is rejected with a plain explanation.

### 5.9 Agents and API settings

```
┌ Settings · Agents and API                                    [+ New service account] ┐
├──────────────────────────────────────────────────────────────────────────────────────┤
│ "Content agent" · created 12 Jul by Ana · last used 2 min ago                         │
│ Scope:   brands Acme EU · accounts X @acme, LinkedIn Acme EU                          │
│ Rights:  accounts:read drafts:write posts:schedule analytics:read                     │
│ Limits:  max 6 posts per day · locales en, de · domains acme.com                      │
│          look-ahead 14 days · quiet hours 22:00-07:00 Europe/Berlin                   │
│ Approval level: 2 (may schedule inside the limits above, may not publish now)         │
│ [Edit] [Rotate credential] [Kill switch]                                              │
│                                                                                       │
│ Recent activity                                                                       │
│ 12:03 draft_post      ok        draft_01J…  X @acme                                   │
│ 12:03 schedule_post   ok        job_01J…    07 Aug 09:00 CEST                         │
│ 11:58 publish_post    DENIED    approval level 2 does not allow immediate publish     │
│                                                                                       │
│ Connect this agent                                                                    │
│ [Claude Code] [Codex] [Hermes] [Buzz workflow] [CLI] [Generic MCP]                    │
│ Remote MCP endpoint  https://mcp.relay.example/mcp     [Copy]                          │
│                                                                                       │
│ [Open dry-run playground]  Runs against seeded data. Nothing leaves the workspace.     │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

The credential is shown exactly once, in a panel that states it will not be shown again, with a copy
button and a "I have stored this" confirm. Denied attempts are first-class rows, not hidden in a log,
because a denied attempt is how a user discovers a misconfigured agent.

The agent conversation surface (inside Compose, not a separate destination) begins by asking which
accounts, asks only material clarifying questions, then produces normal editable drafts with normal
previews. It never places incomplete content on the calendar and never publishes outside the
workspace approval policy. Agent-created drafts carry an attribution chip ("Drafted by Content agent")
and are otherwise visually identical to human drafts, with identical editing affordances.

### 5.10 Developer apps

```
┌ Settings · Developer apps                                            [+ Create app] ┐
├─────────────────────────────────────────────────────────────────────────────────────┤
│ "Acme Publisher" · confidential client · live                                        │
│ Client ID  app_01J8…                                        [Copy]                   │
│ Client secret  shown once at creation.                      [Rotate]                 │
│ Redirect URIs  https://acme.com/oauth/callback (exact match)                          │
│ Homepage / Privacy / Terms  all set and reachable                                     │
│ Scopes offered  accounts:read drafts:write posts:schedule analytics:read              │
│ [Preview consent screen]                                                              │
│                                                                                       │
│ Active grants  14  ▸ inspect       Sandbox credentials ▸                              │
│ Recent calls (redacted)  ▸          Webhook deliveries ▸                               │
│ Rate limit  1,000 / hour, 12% used                                                    │
│ [Disable app] [Delete app]                                                            │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

The consent screen preview shows the end-user view: app identity, target workspace, the specific brands
and accounts, and read versus consequential permissions in two separate groups. Billing and connection
administration can never be bundled into a general "full access" scope. End users revoke any grant from
Settings, Security, without affecting unrelated connections.

### 5.11 Growth Advisor

Entry is from Home. Five tabs, no dashboard.

```
┌ Growth Advisor · Plan v3 · approved 28 Jul by Ana         [Export ▾] [Refresh plan] ┐
│ [Strategy•] [Four-week plan] [UGC] [Opportunities] [Tool Radar]                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Business snapshot                                                                     │
│ Confirmed by you: B2B scheduling tool, EU and US, English and German, sign-up is the  │
│ conversion event, 4 posts per week capacity.                                          │
│ Assumptions we made (not facts): your buyers are ops leads at 10-50 person teams.      │
│ [Confirm] [Correct]                                                                   │
│ Missing: no approved customer proof on file. Claims below avoid customer results.      │
│                                                                                       │
│ Objective   Sign-ups from social, 30 per month, measured by UTM campaign q3-social.    │
│ Channels    1. LinkedIn (buyer present, document posts perform for this format)        │
│             2. X (developer audience, cheap text creates, URL creates cost more)       │
│             3. YouTube (long tail, high effort) [Deprioritized: capacity 4 per week]   │
│ Pillars     Reliability proof · Migration stories · Multilingual publishing ·          │
│             Behind the build                                                           │
│ Cadence     4 per week: 2 LinkedIn, 2 X. One experiment per two weeks.                 │
│ CTA library 6 phrasings ▸                                                              │
│ Measurement Compare to your own trailing 10 comparable posts. No external benchmark.    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Four-week plan is a table of 16 rows (week, day, channel, pillar, format, brief, CTA, measurement tag),
not 28 decorative cards. Each row has `Accept as draft`, `Add as calendar proposal`, `Edit`,
`Dismiss with reason`, `Explain`.

Opportunities tab is a table only. Columns: opportunity, type, official URL, audience, fit, requirements,
self-promotion rules, cost, effort, last verified. Actions: `Open`, `Prepare submission`,
`Create pitch draft`, `Mark submitted`. There is no bulk-submit control anywhere, at any width, on any
surface. If the catalog returns nothing for this business, the tab shows: "We have no verified
opportunities that fit this business yet. We will not invent one." That empty state is correct
behaviour, not a bug.

### 5.12 Tool Radar

```
┌ Resources · Tool Radar          Workflow: [short-form video ▾]      5 of 5 shown ┐
├──────────────────────────────────────────────────────────────────────────────────┤
│ Toolname                                            Last verified 21 Jul 2026     │
│ Best for      Cutting a long recording into vertical clips with captions.          │
│ Why it fits   Your plan needs 2 short videos per week and you have webinar audio.  │
│ Limitations   English captions only. No brand-kit import.                           │
│ Skills needed Basic video editing. About 30 minutes per clip.                       │
│ Handoff       Export MP4 1080x1920, import to Post Array Library, alt text added here.   │
│ Rights        Check their commercial-use terms before client work.                   │
│ Price checked 21 Jul 2026. [Open official site]                                      │
│ Disclosure    We may earn a commission if you subscribe through this link. This does │
│               not affect ranking or whether the tool is listed.                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Never more than five results. If only two active verified records fit, show two and say so. A record
past its review date renders a `Stale` label and is excluded from AI-generated plans.

### 5.13 Billing and trial

```
┌ Settings · Billing                                                                  ┐
│ Plan: Post Array, all features. 30 active channels. Unlimited team members.               │
│ Status: Trial. 4 days remaining.                                                     │
│ Converts on 11 August 2026 to $29.00 per month.                                      │
│ Payment method is held by Polar and charged $0.00 today.                              │
│ Cancel before 11 August 2026 and you will not be charged.                             │
│ [Manage payment, invoices and cancellation in the Polar portal]                       │
│                                                                                       │
│ Switch interval                                                                       │
│ ( ) $29 per month                                                                     │
│ (•) $300 per year, which is $25 per month billed annually. Save $48 per year.         │
│                                                                                       │
│ Metered provider usage (billed at cost, not included in the plan)                     │
│ X API this period                    $1.42                                            │
│   38 post creates            $0.015 each        $0.57                                  │
│   4 post creates with a URL  $0.200 each        $0.80                                  │
│   reconciliation adjustment                     $0.05                                  │
│ Prices published by X. Verified 4 August 2026. [Read how this is billed]               │
│ Spend alert at [$25.00] per month   [x] Pause metered actions at the alert             │
│                                                                                       │
│ Invoices and receipts are issued by Polar. [Open portal]                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Copy rules for this screen: never say "20% off". Never claim a temporary hold of any amount, including
"$2". Cancellation is one link to the Polar portal plus a plain confirmation, with no retention maze, no
"are you sure you want to lose everything", no discount ambush.

---

## 6. Composer behaviour specification

This is the hardest screen in the product. Implement it in this order.

### 6.1 Master draft and overrides

1. A `content_item` has one **master draft** stored as a `content_version`. Every selected target starts
   `inherits`.
2. `Global edit` writes to the master. Compatible fields fan out into every target that still inherits
   that field. A field is compatible when every selected target's capability snapshot accepts it.
3. Incompatible fields are never silently dropped. The global edit panel lists them:
   "Instagram does not accept a link in the caption. This link will stay in the master and in X and
   LinkedIn. Instagram gets the caption without it." The user accepts or edits before the change lands.
4. Opening a target and editing creates an **explicit override** on the edited field only, at field
   granularity: `body`, `media`, `alt_text`, `destination`, `privacy`, `sequence`, `signature`, `link`.
   Overriding `body` on LinkedIn does not detach LinkedIn's media from the master.
5. `Reset to master` is per field and per target, with a confirmation naming what will be discarded.
   It is never a bulk silent reset.
6. Edits to one target can never mutate another target. This is covered by a required unit test:
   `composer.override.isolation.test.ts`.

### 6.2 Live limits

- Character and media limits come from the versioned capability snapshot for that specific connection,
  not from a hard-coded constant, because limits differ by account type.
- The counter renders next to the field it constrains and in the target rail. Format: `248/280`. At 90%
  it turns warning. Over the limit it turns destructive and the target becomes `blocked`.
- Media limits validate count, MIME, byte size, dimensions, aspect ratio and duration, each with its own
  message naming the actual and the allowed value.
- Deterministic validation runs on change (debounced 300ms), again at schedule, and again immediately
  before dispatch. The snapshot version used at approval is stored on the receipt.

### 6.3 Native mentions and destinations

- Typing `@` opens a provider-backed search. Results resolve to a provider external ID stored in
  `mention_entities`. A result that cannot be resolved is not selectable.
- If the provider does not offer mention search for this connection, the field states
  "X does not offer mention lookup for this account type. Typing a handle publishes it as plain text,
  which is not a native tag." The product never converts display text into a fake native tag.
- Destination pickers (X community, Facebook Page or group, LinkedIn organization, Pinterest board,
  YouTube channel and privacy, Reddit community) appear only for connections whose capability snapshot
  reports them, and store the provider external ID. Sources for per-provider destination support:
  `docs/research/06-source-register.md`, verified 4 August 2026, **re-verify before implementation**.

### 6.4 Sequence: threads and comments

- One ordered list: root plus items 2..n. Each item has its own author account (where the provider
  permits a different account), copy, media, delay, validation and status.
- Delay presets 1, 2, 5, 10, 15, 30, 60, 120 minutes plus a custom value. The confirmation sheet shows
  the computed absolute time for every item in local time and UTC.
- Partial failure semantics are visible before scheduling: "If comment 2 fails, the root post stays
  published and comment 3 does not run. You will get an action item."
- Repeat requires a cadence plus an end date or an occurrence count. Every occurrence gets its own
  receipt. Editing offers `this occurrence` or `this and future occurrences`, never a silent series
  rewrite.

### 6.5 Links

Three controls, always visible when a URL is detected in any target:
`Keep original`, `Track with short link`, `Edit UTM`. Branded domain is a dropdown limited to
DNS-verified domains. The exact public short URL that will publish appears in every target preview and
is frozen into the content version at approval.

### 6.6 Autosave, offline, conflict

| State | Header text | Behaviour |
| --- | --- | --- |
| Saving | `Saving…` | Debounced 800ms after last keystroke |
| Saved | `Saved 12:04` | Timestamp in workspace time zone |
| Offline | `Offline. Your changes are kept on this device.` | Editing allowed. Schedule and Publish disabled with the reason inline, not as a toast |
| Conflict | `Dana edited this draft 30 seconds ago.` | Show both versions side by side, user picks per field. Never auto-merge |
| Version pinned | `Approved version. Editing requires re-approval.` | Editing creates a new version and clears the approval, stated before the first keystroke lands |

### 6.7 AI inside the composer

AI actions are verbs in a small menu on the editor toolbar: "Make more concise", "Adapt for LinkedIn",
"Transcreate to Japanese", "Check claims", "Write alt text". Every result is a diff with
`Accept` / `Reject` per hunk. There is no silent replacement, no auto-apply, no streaming text that
overwrites the user's cursor position. Sources and generated claims stay inspectable through an
`Evidence` disclosure. There is no image or video generation entry point of any kind.

---

## 7. Design tokens

Tokens live in `packages/design-system/tokens`. Components consume tokens, never raw values. Both themes
are designed, not inverted.

### 7.1 Colour

Warm neutral canvas, one accent, two semantic exceptions. Values are sRGB hex with the intended contrast
role. Verify every pair with the automated contrast test in CI.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg-canvas` | `#FBFAF8` | `#141311` | Page background |
| `--bg-surface` | `#FFFFFF` | `#1C1A18` | Cards, panels, table body |
| `--bg-sunken` | `#F3F1ED` | `#100F0E` | Inset areas, code, rails |
| `--bg-hover` | `#EFEDE8` | `#252320` | Row hover |
| `--border-subtle` | `#E6E2DB` | `#2C2926` | Table and panel dividers |
| `--border-strong` | `#CFC9BF` | `#403C37` | Input borders, focused containers |
| `--fg-strong` | `#1A1815` | `#F5F3EF` | Headings, primary text (>= 12:1) |
| `--fg-default` | `#3A3630` | `#DAD5CC` | Body text (>= 7:1) |
| `--fg-muted` | `#6B655C` | `#A29B90` | Secondary text (>= 4.5:1) |
| `--accent` | `#14624F` | `#4FBF9B` | Primary action, selected state |
| `--accent-fg` | `#FFFFFF` | `#0B1A16` | Text on accent |
| `--accent-soft` | `#E4F0EB` | `#17332B` | Selected row, accent chip |
| `--warning` | `#8A5300` | `#E2A63C` | Issue, degraded, stale |
| `--warning-soft` | `#FBF1DF` | `#33260F` | Warning band |
| `--destructive` | `#A0302A` | `#F0817A` | Failure, delete, over limit |
| `--destructive-soft` | `#FBEBE9` | `#361715` | Destructive band |
| `--focus-ring` | `#14624F` | `#7FD6BA` | 2px ring, 2px offset |

No third accent. No per-platform brand colour used as UI chrome; platform logos appear as small
monochrome marks with the platform name in text next to them, so status never depends on brand colour.

Status colour is always paired with a word and a shape:

| Status | Shape | Word |
| --- | --- | --- |
| Scheduled | hollow dot | `Scheduled` |
| Publishing | half dot | `Dispatching` |
| Published | filled dot | `Published` |
| Partially published | split dot | `Partially published` |
| Action required | triangle | `Action required` |
| Failed | square | `Failed` |

### 7.2 Typography

| Token | Value | Use |
| --- | --- | --- |
| `--font-ui` | Inter variable, system-ui fallback stack | All product UI |
| `--font-editorial` | A transitional serif (decision below) | Marketing headlines and pull quotes only |
| `--font-mono` | JetBrains Mono, ui-monospace | IDs, hashes, JSON, CLI |

Scale, 1.200 minor third from a 15px product base. Line heights are unitless.

| Token | Size / line height | Weight | Use |
| --- | --- | --- | --- |
| `--text-2xs` | 11px / 1.45 | 500 | Table meta, counters |
| `--text-xs` | 12px / 1.5 | 400 | Helper text, tooltips |
| `--text-sm` | 13px / 1.55 | 400 | Dense table body |
| `--text-base` | 15px / 1.6 | 400 | Body, inputs, editor |
| `--text-md` | 17px / 1.5 | 500 | Section headings |
| `--text-lg` | 20px / 1.4 | 600 | Screen titles |
| `--text-xl` | 26px / 1.3 | 600 | Empty-state and marketing sub-heads |
| `--text-2xl` | 34px / 1.2 | 650 | Marketing headline |

Rules: never below 12px for anything a user must read. Never all-caps for translated strings (many
locales have no case). Tabular figures (`font-variant-numeric: tabular-nums`) on every number in a table,
counter or receipt. Never rely on font weight alone to convey state.

### 7.3 Spacing, radius, elevation

4px base scale: `0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
Product density: 8px vertical rhythm inside panels, 12px between fields, 24px between sections.
Marketing density: 32/48/64.

Radius: `--radius-control: 6px` (inputs, buttons, chips), `--radius-panel: 10px` (cards, sheets,
popovers), `--radius-media: 14px` (marketing imagery only), `--radius-full` for avatars only.

Elevation: three levels, all tonal plus a 1px border. No coloured shadows, no glow.
`--shadow-1: 0 1px 2px rgba(20,18,15,.06)` for raised rows.
`--shadow-2: 0 4px 12px rgba(20,18,15,.10)` for popovers.
`--shadow-3: 0 12px 32px rgba(20,18,15,.16)` for modals and sheets.
In dark mode shadows are halved in opacity and elevation is carried by `--bg-surface` steps.

### 7.4 Motion

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 120ms, `cubic-bezier(.2,0,.2,1)` | Hover, focus, checkbox |
| `--motion-base` | 160ms | Popover, dropdown, tab change |
| `--motion-slow` | 200ms | Sheet, drawer, modal |

**In-app, nothing animates longer than 200ms**, and none of it animates data: no chart draw-in, no
skeleton shimmer that outlives the request, no working screen that scroll-scrubs. Under
`@media (prefers-reduced-motion: reduce)` all durations become 0ms and transforms are removed; opacity
changes may remain.

The banned list here used to read "no parallax, no scroll-triggered reveals, no count-up numbers". Those
three are now permitted on the **marketing surface** under §7.4.1, and count-up is permitted in-app under
the four conditions in §2. The 200ms ceiling is unchanged for every product control.

### 7.4.1 The scene vocabulary (marketing tier)

Marketing gets a second, expressive tier: 400-900ms, GSAP, and a small governed set of devices. GSAP
lives only in `apps/web/src/lib/motion`; the wrappers are in `apps/web/src/components/motion` and
`apps/web/src/features/marketing/components/scene`, and every one of them branches on `useMotionOk()`
and renders the finished static state when motion is off. **No component may author hidden initial state
in server HTML** — the server response is the finished page, which is what a crawler, a no-JS client and
a reduced-motion visitor get.

| Device | What it is | Reduced motion |
| --- | --- | --- |
| `ScrollScene` | Pinned, scroll-scrubbed scene with named beats and an interpolated background between two documented tokens | Renders the beats as ordinary stacked sections |
| `ParallaxLayer` | Scrubbed `yPercent` on a wrapper, `depth` clamped to ±0.3. Only valid inside a `ScrollScene` | Returns children unwrapped, no element at all |
| `SceneSequencer` | Auto-advancing looping tour on one timeline. Auto-pauses off-screen, on `visibilitychange` and on `focusin`; requires `controlLabels` (WCAG 2.2.2) | Server HTML is the whole walkthrough as a labelled `<ol>` |
| `ColorBand` | Full-width band tinted in one of the three accent families (`warm` marigold, `cool` ultramarine, `neutral` sunken paper). Publishes `data-scene-accent` so the custom cursor can adopt the family | Static |
| `GradientWash` | Decorative duotone edge painted behind a band's content, `aria-hidden` and pointer-transparent. Stops are always two `--color-*` tokens inside one accent family; the `top`/`bottom` placements fade to transparent before the content column, so running copy never sits on the ramp | Static |
| `Sticker` | A chip carrying one fact, tilted by a static inline transform clamped to ±3°. `fact` and `source` are both required, so a decorative sticker with nothing to say does not compile | Identical: the rotation is server HTML, not an animation |
| `TourIndicator` | Shared "where am I" dot row for multi-beat scenes. Presentational only; the active beat is marked by a wider filled dot **and** by `positionLabel` as visible text, never by colour alone | Handled by the global 1ms override, no JS branch |
| `Marquee` | Duplicated `aria-hidden` track; direction resolves against `dir` | Degrades to a single static row |
| `CelebrationBurst` | Deterministic radial burst | Renders nothing: celebration is additive, so absence is correct |
| `LiveBadge` | Dot plus a required label, CSS-driven | Handled by the global 1ms override, no JS branch |

**Per-page budgets.** The vocabulary is governed by
`apps/web/src/features/marketing/components/scene/scene-budget.test.ts`, which is a source census over
every `page.tsx` under the marketing route tree. That file, not this document, is the enforcement point;
the numbers are repeated here so a reviewer knows them before opening a pull request.

| Device | Vocabulary ceiling (no page may ever exceed) | Default page budget |
| --- | --- | --- |
| `ScrollScene` | 1 | 1 |
| `ColorBand` | 2 | 1 |
| `Marquee` | 1 | 0 |
| `SceneSequencer` | 1 | 1 |

**Only those four devices are counted.** `GradientWash`, `Sticker`, `TourIndicator`, `ParallaxLayer`,
`CelebrationBurst` and `LiveBadge` have no per-page ceiling today, and this document should not be read
as claiming they do. The budget meters the devices whose cost is *per page* — a pin competes with
another pin for the same scroll distance, a second tinted band pushes a page toward reading as a colour
swatch, a second auto-advancing tour removes the focal point. The rest are constrained by construction
instead, which is a weaker guarantee but a real one: `ParallaxLayer` is separately asserted to appear
only inside a `ScrollScene`, `Sticker` cannot compile without a `fact` and a `source`, `GradientWash`
carries no text and draws only from documented tokens inside one accent family, and `TourIndicator`
reports progress without ever offering a control. If one of them is later sprayed the way the v1
vocabulary was, the fix is to add it to `SceneBudget` in `scene-budget.test.ts` — the gate grows, it
does not get argued down.

Two documented overrides exist: the home page gets a second `ColorBand` and the single `Marquee` (it is a
demonstration rather than a document, and the connector list is genuinely too long to read at once), and
the product page gets a second `ColorBand` to mark the boundary between its two halves. Adding a third
override is a design decision a reviewer may refuse. Raising a ceiling is a redesign, not a budget edit.

The reason a budget exists at all: this product had a loud visual system once and deleted it, because it
was sprayed rather than spent. `features/marketing/components/editorial/inverted-band.test.ts` still
holds the empty allow-list that keeps the old vocabulary dead. The budget is what makes this attempt a
different attempt.

### 7.5 Iconography

One icon set (Lucide or equivalent), 16px and 20px, 1.5px stroke, currentColor. Every icon-only control
has an accessible name and a tooltip. Platform marks are a separate monochrome set and are never the
only identifier of an account.

---

## 8. State design (every screen, every time)

A screen is not done until all applicable states exist in code and in the visual regression suite.

| State | Requirement |
| --- | --- |
| Loading | Layout-preserving skeleton. If the status is knowable, state it ("Fetching LinkedIn analytics") instead of a spinner. Never a full-page spinner after first paint |
| Empty | One sentence of value, one primary action, a realistic example. No illustration of a robot |
| Error | Name the affected account and action, preserve user content, say what happens next, offer retry only when retry is safe |
| Partial success | Show what succeeded with evidence and what failed with a reason. Never a single red banner |
| Offline | Drafts stay safe locally. Scheduling and publishing disabled with the reason inline |
| Permission denied | Name the required role or scope and who in this workspace can grant it |
| Rate or cost limited | Show current usage, the cause, the reset time, and a lower-cost alternative |
| Provider outage | Isolate the affected connector, link to the status page, do not gray out unrelated connectors |
| Not built yet | "Post Array has not built this yet" plus the roadmap link |
| Provider does not support | "X does not offer this through its API" plus the source link and verification date |
| Translation incomplete | Fall back to English for that string. Never a raw key, never a broken interpolation, never mixed placeholders |

---

## 9. Accessibility, WCAG 2.2 AA

AA conformance is a merge requirement. The relevant 2.2 additions are called out explicitly.

- **Keyboard**: every operation reachable and operable. No drag-only interaction; calendar rescheduling
  has the `Shift+Arrow` path described in 5.3.
- **2.4.11 Focus Not Obscured**: sticky headers, the composer summary bar and the cookie banner must not
  cover the focused element. Use `scroll-margin-block` on all focusable elements inside scroll regions.
- **2.5.7 Dragging Movements**: satisfied by the keyboard reschedule and the row action menu.
- **2.5.8 Target Size**: minimum 24x24 CSS px for all pointer targets, 44x44 on touch layouts.
- **3.2.6 Consistent Help**: the help entry point sits in the same shell position on every screen.
- **3.3.7 Redundant Entry**: onboarding never asks twice for the same value; time zone and locale carry
  forward.
- **3.3.8 Accessible Authentication**: no cognitive-function test. Paste is allowed in every field
  including OTP.
- Contrast verified in both themes by automated test, including disabled states and the focus ring.
- Status never relies on colour alone (see 7.1 shapes table).
- Form labels are real `<label>` elements. Errors use `aria-describedby` and are announced.
- Live regions: `polite` for save state, validation changes and upload progress; `assertive` only for a
  publish failure.
- Tooltips never carry information that exists nowhere else.
- Calendar has a table and list alternative with the same data.
- 200% zoom and 320px reflow with no horizontal page scroll. Data grids may scroll horizontally inside
  their own container and must offer a row-detail alternative.
- Media previews have accessible names. Alt text is a first-class field with a visible "waive with
  reason" path, never a silent skip.

---

## 10. Responsive specification

Test at exactly these widths. Each has a named layout, not a squeeze of the previous one.

| Width | Shell | Composer | Calendar | Tables |
| --- | --- | --- | --- | --- |
| 360 | Bottom bar: Home, Calendar, Compose (center, raised), Analytics, More. Top bar holds workspace and Action Center | Step sequence: Targets, Write, Per target, Review. Persistent summary bar shows targets, issues, time, estimated cost, primary action | Agenda list, day grouped | Row summary plus detail sheet. Never horizontal clipping |
| 390 | Same as 360, 8px more gutter | Same | Same | Same |
| 768 | Left icon rail (collapsed labels), top bar full | Two panes: editor plus preview. Targets become a horizontal scroller with the same state dots | Week view available, list default | Two visible columns plus detail |
| 1024 | Left rail with labels | Three panes, preview collapsible | Week default | Four columns plus detail |
| 1280 | Full shell as wireframed | Full three-column split (5.2) | Week default, month available | Full table |
| 1440 | Same, content max-width 1360 | Same, editor gets the extra width | Same | Same |
| 1920 | Content max-width 1440, centered, canvas gutters | Same. Do not stretch line length past 78 characters in the editor | Same | Same |

Additional rules: approval and the publication receipt must be fully functional at 360px, because
approvers are often away from a desk. The composer summary bar is `position: sticky` at the bottom on
small screens and must not obscure focus (see 9, 2.4.11). Text containers never take a fixed width; use
logical properties throughout (`padding-inline-start`, `margin-block-end`) so RTL works without a second
stylesheet.

---

## 11. Open design decisions

Every item has an owner, a deadline and a default that ships if no decision is made by the deadline.

| # | Question | Owner | Deadline | Recommended default if undecided |
| --- | --- | --- | --- | --- |
| D1 | Editorial serif for marketing headlines | Design Lead | 21 Aug 2026 | Source Serif 4, self-hosted, subset to Latin. Product UI stays Inter |
| D2 | Calendar library: FullCalendar vs custom grid | Web Lead | 28 Aug 2026 | Custom CSS grid for week and month. FullCalendar's interaction model fights the keyboard and RTL requirements |
| D3 | Rich text engine confirmation (Tiptap) | Web Lead | 21 Aug 2026 | Tiptap, with a plain-text serializer per connector so no editor markup can reach a provider |
| D4 | Does Home show a 7-day published count | Product Lead | 4 Sep 2026 | No. Home stays a queue of actions. Counts live in Analytics |
| D5 | Dark mode default | Design Lead | 4 Sep 2026 | Follow system, with an explicit three-way toggle in the account menu |
| D6 | Agent chat placement: composer panel vs full surface | Product Lead | 18 Sep 2026 | Composer right-panel tab. AI does not get a destination |
| D7 | Density toggle (comfortable vs compact) | Design Lead | 2 Oct 2026 | Ship one density (compact product, roomy marketing). Revisit after 25 design partners |
| D8 | Per-platform brand colour in calendar chips | Design Lead | 4 Sep 2026 | No colour, monochrome mark plus text. Colour is reserved for status |
| D9 | Locale picker visibility in V1 English-only UI | Product Lead | 16 Oct 2026 | Show it, list English as the only interface language, and name content languages separately so the distinction is never blurred |

---

## 12. Design acceptance checklist

Merge blocks on any unchecked line.

**Truth**
- [ ] No invented metric, logo, testimonial or screenshot anywhere, including marketing.
- [ ] "Not built yet" and "provider does not support" render as different sentences.
- [ ] Missing data reads `Unavailable` with a reason, never `0`.
- [ ] Every provider-dependent claim in UI copy links to a source and shows a verification date.
- [ ] No AI image or video generation affordance exists in any state, including disabled or feature-flagged.

**Workflow**
- [ ] A first-time user connects an account and schedules a post without a tutorial video.
- [ ] From the confirmation sheet alone, a reviewer can name every target, variant, time zone, privacy
      state, approver and estimated cost.
- [ ] No path creates an external post without the configured approval.
- [ ] An agent-created draft is attributable and equally editable.
- [ ] A partial failure never shows as either full success or full failure.
- [ ] No failed state loses user content.

**Craft**
- [ ] Nothing from the section 2 forbidden table appears.
- [ ] Every screen has loading, empty, error, partial, offline, permission-denied, rate-limited and
      provider-outage states implemented and captured in visual regression.
- [ ] Light and dark are separately designed and both pass automated contrast.
- [ ] Layouts verified at 360, 390, 768, 1024, 1280, 1440 and 1920px, plus RTL pseudo-locale and a
      30-50% text expansion pseudo-locale.
- [ ] Keyboard-only pass completed for composer, calendar, approval and receipt.
- [ ] Screen-reader pass completed for save state, validation, upload progress, schedule confirmation and
      publish result.
- [ ] `prefers-reduced-motion` removes every nonessential transition.
- [ ] No product-visible string contains an em dash.
- [ ] No literal user-facing English outside `packages/i18n`.
