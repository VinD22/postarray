# Experience and release review, 19 September 2026

The request treats 100 clients as a navigation stress case, not a capacity or
pricing change. Existing Standard, Growth and Studio prices, limits and Polar
configuration are unchanged. The user reports that Polar is already set up.

## Implemented

- Searchable project/workspace switcher with keyboard selection, current-context
  indicators, account counts, time zones, bounded scrolling and an empty result state.
- Project switching in the command palette. Keyboard selection scrolls into view;
  long result lists no longer stagger their appearance one row at a time.
- One context-switch path for both entry points. It rejects selections outside
  the authorized session, cancels and clears queries before changing cookies,
  resets the project when changing workspace and reloads Home to discard old
  form state and tenant-specific detail URLs. Server authorization remains authoritative.
- Searchable, vertically scrollable project settings on desktop and mobile.
  Create/save refreshes the shell. Capacity is not shown as zero while loading
  or when the request fails. Settings read the authorized shell workspace before
  issuing requests instead of first querying under an empty workspace key.
- Home retains a stable calendar range between ordinary renders, avoiding a new
  query key on each render, then advances it on a five-minute cadence and when a
  tab becomes active. Loading counts do not masquerade as zero. Actual numbers
  render immediately, and failed requests do not announce a fabricated daily summary.
- The selected billing tier travels through the web adapter, REST validation,
  application service and runtime to Polar, with the tier included in its audit
  event. Older callers retain the base-tier default. Prices come from the
  existing billing configuration; clients cannot supply a price.
- New subscription checkout has an explicit monthly/annual choice. Existing
  subscriptions use the Polar portal rather than starting another checkout when
  an interval control changes. Portal navigation works without a delayed popup.
- Robots exclusions match private route boundaries. Public article slugs beginning
  with a private route name remain crawlable. Canonicals, sitemap, hreflang and
  structured-data tests remain part of the suite.
- The decorative Three.js publishing scene gains bounded pointer perspective,
  pause/resume controls, live theme updates and a live reduced-motion gate.
  It retains lazy loading, hardware checks and a static fallback, and stops its
  frame loop offscreen or in a hidden tab. Non-action journey decoration uses the
  navigation accent instead of competing with the primary action color.

New English UI keys use the existing catalog system. The nine new shell/motion
keys are explicitly recorded as English fallback debt for beta locales; this is
not a claim of reviewed translation coverage. Existing English-first billing
and settings namespaces retain their fallback behavior.

## Integration and payment boundaries

This is a source review and local test pass, not a certification that every
provider has approved the production app. No live publishing, payment, refund,
account reconfiguration or external message was performed.

`packages/runtime/src/verified-connectors.ts` registers only built-in providers
allowed by the environment's verified-provider list. The repository's
`docs/connectors/SIGN-OFF-READINESS.md` records incomplete sign-off evidence.
That document is historical evidence, not a live provider-dashboard check.
Keep support claims tied to the completed definition of done and actual current
provider approvals. Local simulator tests cannot establish those approvals.

Official documents checked on 19 September 2026:

| Source | Release implication |
| --- | --- |
| [Polar acceptable use policy](https://polar.sh/legal/acceptable-use-policy) | SaaS is an accepted product category; marketing tools require closer review. Unsolicited marketing and fabricated social proof are prohibited. Existing product setup is not, by itself, evidence of a specific policy decision. Retain the actual approval record for this product; no new approval flow was added. |
| [TikTok content sharing guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) | Audit status affects public posting. Check the required creator-info, privacy, disclosure and consent UX against the approved app. Do not add unwanted promotional branding to uploads. |
| [YouTube video resource documentation](https://developers.google.com/youtube/v3/docs/videos) | Uploads from affected unverified API projects are private until an audit clears the restriction. A working upload test does not prove public-publishing eligibility. |
| [LinkedIn increasing access](https://learn.microsoft.com/linkedin/marketing/increasing-access) | Development access and production access differ. Preserve evidence of the required review and access tier. |
| [X automation rules](https://help.x.com/en/rules-and-policies/x-automation) | Do not automate likes, hide replies, or duplicate-account activity. Authentic scheduling still needs user authorization and applicable API access. |

Meta's first-party publishing documentation could not be retrieved reliably in
this pass. No new Meta policy conclusion is claimed. Existing professional-account
requirements and permission disclosure remain in the connect flow.

## Verification scope and remaining evidence

Behavioral regression coverage includes searching a 100-client session, keyboard
selection, cache/cookie isolation, checkout tier propagation, route-boundary crawl
rules, loading metrics and WebGL pause/reduced-motion transitions. Repository
verification includes provider simulator, billing lifecycle/webhook, tenancy,
application, API and worker tests. Final local verification:

- `pnpm verify`: 73 of 73 tasks passed. The web package ran 170 test files and
  1,463 tests.
- `pnpm --filter @relay/web test:e2e`: 53 of 53 Chromium scenarios passed,
  including light and dark accessibility scans, reduced motion, expanded copy,
  RTL and calendar pointer/keyboard rescheduling.
- `git diff --check`: passed.

Before claiming complete launch readiness, retain production-specific evidence:
provider approval and authorized live publish/retry/revoke sign-offs, real Polar
product/portal/webhook reconciliation, database-backed RLS checks on deployed
migrations, production build/performance measurements and Search Console crawl
results. No search ranking or blanket legal compliance can be guaranteed by a
local change set.
