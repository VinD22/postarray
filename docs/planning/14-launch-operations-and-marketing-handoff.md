# 14. Launch Operations and Marketing Handoff

Owner: Founder. Operational co-owner: QA / Platform Operations.
Sources: `docs/research/04-marketing-and-growth.md`,
`docs/research/05-trust-safety-and-legal.md`,
`docs/research/07-feature-parity-and-product-behavior.md`,
`docs/research/06-source-register.md` (compiled 4 August 2026).

This is the non-engineering half of the launch. It is written so that a person who has not
read the research can execute it. Week numbers refer to
`docs/planning/11-delivery-roadmap.md`; week 1 begins Monday 10 August 2026.

**Everything in this document obeys the same canon as the product.** One plan at $29 monthly
or $300 annually, $25/month effective on annual, save $48/year, 13.8%. Never "20% off". No
feature tiers. 30 active channels. Unlimited team members. Seven-day Polar trial on both
intervals with a payment method collected, $0 due today, the exact conversion date and
amount shown, a Polar reminder and self-service cancellation. No `$2 hold` claim. No AI
image generation and no AI video generation in V1. English interface, 30 content languages.
No em dashes in customer-facing copy.

---

## 1. Provider approvals: the operational track

Owner: Founder. Starts week 1, before any product code exists.

**Per-provider dossier** at `docs/connectors/<provider>/dossier.md`, created in week 1:

| Field | Content |
| --- | --- |
| Application date and reference | |
| Requested scopes | One line per scope naming the exact product surface that uses it |
| Reviewer contact and thread | |
| Current status | not started, submitted, information requested, approved, rejected |
| Next action and date | Never blank |
| Policy URLs and last review date | From the source register |
| Engineering owner and policy owner | Two named roles |
| Definition of done state | Per `docs/connectors/definition-of-done.md` |

**Review asset pack** (prepare once in weeks 2 to 4, reuse for every provider):

1. Public product URL with no dead links, no placeholder legal text and no unfinished screens.
2. Terms, Privacy Policy, Acceptable Use Policy, AI Policy, data deletion instructions and a
   support contact, all live and reachable from the footer.
3. Verified company domain and a domain-based email address.
4. Screen recording showing, in one take: OAuth consent, choosing which account to connect,
   the composer, explicit user consent before publishing, privacy and audience controls, the
   preview, the publish, the receipt, the analytics view, disconnect, and data deletion.
5. A reviewer account with safe seeded data and a written walkthrough script.
6. A scope-by-scope justification document.

**Rules.** Never request a scope for a feature not in V1. Never show a screen that does not
exist. Never describe a connector as official or supported before approval. If a reviewer
asks for something we do not do, say so plainly rather than promising it.

**Weekly approval board.** Every Thursday, in the integration checkpoint: one line per
provider with status, days since last reviewer contact, and next action. Escalate at 21 days
of silence.

---

## 2. Legal and policy pages

Owner: Founder with counsel. Drafts week 2, counsel engaged by week 12, published by week 18.
All seven are a launch gate (G7).

| Page | Must cover | Live by |
| --- | --- | --- |
| Terms of Service | Entity, service description, user content ownership and the limited licence we need, user warranties for rights and platform compliance, no guarantee of connector availability, AI output limitations, plan and taxes with Polar as merchant of record, renewals, usage charges, refunds, cancellation, failed payment, downgrade and what happens to scheduled posts after suspension, AUP incorporation and appeals, liability, termination and export window, governing law, separate API and MCP terms | Week 18 |
| Privacy Policy | Data inventory including social tokens and agent activity, purposes and legal bases, subprocessors (Supabase, Temporal, Polar, DeepSeek, hosting, storage, email, error monitoring, product analytics), international transfers, retention per class, user rights, social data deletion and token revocation, AI processing and the no-training-by-default policy, cookies, minimum age, contact | Week 18 |
| Acceptable Use Policy | The prohibited-use list in `docs/research/05` section 2, enforcement, and a fair appeal process | Week 18 |
| AI Use and Generated Content Policy | Which features use DeepSeek, what is sent, retention and training posture, that customer content is not used to train our models by default, how to disable optional AI features, limitations and review responsibility, disclosure obligations, and why V1 does not generate images or video | Week 18 |
| Refund and cancellation policy | Aligned to the Polar checkout, the trial, D-6 in document 13, and mandatory consumer rights | Week 16, before any paid checkout |
| Subprocessor list | Named subprocessors, purpose, region, change-notice commitment | Week 18 |
| Data export and deletion instructions | Including how to remove data held by each connected social provider | Week 18 |

Also required before launch: cookie policy and consent manager where required, DPA template
with transfer terms, DMCA or local notice-and-takedown process, security page and responsible
disclosure policy, accessibility statement, API and MCP developer policy, community and UGC
guidelines, affiliate terms. Do not publish a service level agreement.

Do not copy any competitor's terms. Draft for the actual entity with counsel.

---

## 3. Support setup

Owner: Founder until the first support hire.

- **Channels at launch**: in-app support widget, `support@` email, and a public documentation
  site with search. A community is optional and should not be promised until it is operated.
- **Hours and target**: published hours in one named time zone, one business day first
  response target. No 24/7 claim and no SLA until staffing supports it (decision D-9).
- **Diagnostic correlation ID**: every in-app support message includes the correlation ID
  after the user consents. Support tooling never shows post content by default and never
  shows tokens at all. Privileged reads of customer data are audited.
- **Triage bar**: P0 (data loss, duplicate publication, cross-tenant exposure, token
  exposure, wrong charge) is an incident, paged, 24-hour fix. P1 (a blocked core flow, a
  publish failure with no remediation path) 3 business days. P2 and P3 scheduled.
- **Macros to write before beta** (each links to a real remediation screen, never a generic
  apology): connection expired, Instagram needs a professional account, LinkedIn Page role
  missing, YouTube uploads are private until our API audit completes, TikTok privacy choice
  required, X usage charges explained, trial conversion date and amount, cancellation
  confirmation, partial publication explained, analytics unavailable versus zero, data
  export request, deletion request.
- **Escalation**: support to on-call engineer to TL to founder. Documented in
  `docs/runbooks/support-escalation.md` before beta.
- **Metric**: support tickets per 100 active workspaces, tracked weekly. A rise in a single
  category is a product bug, not a support-capacity problem.

---

## 4. Status page and incident communications

Owner: QA.

- **Components**: web app, REST API, MCP, CLI releases, short links, scheduling and
  publishing, analytics sync, and one component per connector. A connector in provider
  review shows an honest "in review" state rather than green.
- **Data source**: the canary suite (every 30 minutes against real canary accounts) plus
  internal error-rate alerts. A component turns yellow on the first canary failure and red
  on two consecutive failures.
- **Severities**: SEV1 cross-tenant exposure, token exposure, duplicate publication in
  production, wrong charge, or total publishing outage. SEV2 one connector down or a broken
  core flow. SEV3 degraded non-critical function.
- **Communication timing**: SEV1 public post within 30 minutes of detection with an update
  every 60 minutes. SEV2 within 60 minutes with an update every 2 hours. SEV3 on the status
  page only.
- **Content rules**: say what is affected, what a customer should do, what they should not
  do, and when the next update comes. Do not speculate about cause. Do not say a scheduled
  post was lost unless it was. Never blame a provider before the provider's own status page
  or a supportable error pattern confirms it.
- **Postmortems**: SEV1 and SEV2 get a written public postmortem within 5 business days in
  `docs/runbooks/incidents/`, including what a customer would have seen and what changed.
- **Maintenance notices**: 48 hours ahead for anything affecting publishing.

---

## 5. Documentation

Owner: Founder with BE1. Live by week 18.

| Section | Contents |
| --- | --- |
| Quickstart | Sign up, connect an account, publish a first post, read the receipt. Target 10 minutes |
| Connectors | One page per connector: account types, what is supported, what is `not_implemented`, what is `unsupported` by the provider, required permissions, known limits, analytics fields with definitions, and the last policy review date |
| Composer and approvals | Master draft and overrides, previews, limits, mentions, destinations, Sets, Signatures, comments and threads, repeats |
| Scheduling and receipts | Time zones and DST, the state model, partial publication, retries, the action center |
| API | OpenAPI reference, idempotency, pagination, scopes, sandbox, TypeScript and Python clients, error taxonomy |
| MCP | Endpoint, OAuth, tool list with side effects and required approval, approval levels 0 to 3 |
| CLI | Commands, `--json` output contract, exit codes |
| Webhooks | Event list, signing, retries, redelivery, disable on persistent failure |
| Automations and RSS | Rule sentence builder, what is prohibited and why, test mode, kill switch |
| Growth Advisor | What it does, what it will not do, catalog verification, export formats |
| Billing | The plan, the trial, X pass-through, fair use, refunds, cancellation |
| Security and privacy | Architecture summary, subprocessors, data export and deletion, responsible disclosure |
| Changelog and roadmap | Written in user language |

Documentation rule: every provider-dependent statement carries a source link and a
last-verified date, and says whether a gap is ours or the provider's.

---

## 6. Onboarding

Owner: FE1 with DES. Target: **time to first verified publication under 10 minutes** for a
simple text account.

The sequence, with no feature tour:

1. Sign up. Accept versioned Terms and Privacy. Workspace name is collected but is not the
   only field and is not a login method.
2. One question: what do you want to publish this week? Three choices that set sensible
   defaults, plus skip.
3. Connect one account. Show what each requested permission is for before the OAuth
   redirect. If the provider will reject the account type, say so before the redirect, not
   after.
4. Compose. The master draft is prefilled with a short starter only if the user chose a
   template. Live limits and a true preview appear immediately.
5. Schedule or publish. Show the exact time, time zone and account list before confirming.
6. Receipt. Explain what the external ID and permalink mean, and when analytics will first
   appear.
7. Only then: an optional three-item checklist (invite a teammate, connect a second account,
   set an approval policy).

If a provider is unavailable or the user is not ready to connect, the seeded `fake` provider
lets them complete the whole loop and see a receipt. That path must be labelled clearly as a
demo and must never produce a claim of a real publication.

---

## 7. Trial lifecycle

Owner: Founder with FE2. Every message below must agree with what Polar sends. Where Polar
sends a required billing notice, our message adds context and never obscures or contradicts
it.

| Moment | Message | Must contain |
| --- | --- | --- |
| At checkout, before confirming | Checkout handoff screen | `$0 due today`, exact first-charge date, exact amount, interval, cancellation path, 30 active channels, fair-use boundary, separately metered X usage, and that AI image and AI video generation are not included or sold |
| Immediately after checkout | Confirmation email and in-app banner | `$0 charged`, the interval selected, the exact first charge date and amount, and a direct link to cancel |
| Day 0 | Activation nudge | One next action: connect an account, or finish the draft that is open |
| Day 2 | Progress or rescue | Either the user's first receipt and when analytics will appear, or a link back to the unfinished composer with content preserved |
| Day 4 | Polar sends its pre-conversion reminder | Our optional message adds a value summary. It must not restate the billing terms incorrectly and must not delay or replace the Polar notice |
| Day 6 | Final trial status | Exact amount and date, what was achieved, export link, and `Manage or cancel` |
| Day 7, converted | Payment receipt and continuity message | Amount charged, next renewal date, portal link |
| Day 7, cancelled | Cancellation confirmation | Plain statement that no charge will be attempted, what happens to data, and how to return |
| Day 7, payment failed | Remediation | `past due` state, what still works, the grace period, and how to fix the payment method. Content is not deleted and no new external actions are dispatched beyond the documented policy |

Cancellation is self-service in Settings, never requires contacting support, and produces a
durable confirmation. Polar's repeat-trial abuse prevention is enabled, with a support path
for legitimate edge cases.

Measure activation quality, conversion, refund and chargeback rate, and retained publishing.
Do not measure cards collected.

---

## 8. Beta recruitment

Owner: Founder. Closed alpha week 11, controlled beta week 16.

- **Closed alpha**: 8 to 12 users from the founder's own network, weighted to the
  agent-native technical creator ICP because they tolerate rough edges and give precise
  feedback. Direct channel, daily triage.
- **Controlled beta**: 25 design partners, roughly 10 agent-native technical creators, 8
  multilingual creators or lean brands, 7 small agencies. Recruit from week 10 through the
  waitlist, founder build notes, targeted outreach and the office hours described in
  section 10. Never buy a list and never cold-email at volume.
- **Written beta agreement** covering: data handling, feedback use, that connectors may be
  labelled beta, that the product is pre-launch, and that customer-story consent is separate
  from product access and is revocable for future use.
- **What partners get**: the full product, direct access to the founder, priority bug
  handling, and 50% off the first year if they convert. Not free forever, because free
  feedback does not validate willingness to pay.
- **What we get**: at least one real published campaign per week, a weekly 15-minute call
  for the first month, and an exit interview.
- **The reliability window**: the 14-day measurement window for gate G2 starts by the Monday
  of week 16 and needs at least 1,000 valid scheduled posts across at least 4 connectors.
  Recruit enough partners with enough real volume to reach that number, or the window
  extends and the launch moves.

---

## 9. Product launch

Owner: Founder. Gate review week 19. Launch week 20 or 5 January 2027 (recommended default).

**Pre-launch checklist**

1. All seven go/no-go gates in `docs/planning/10-testing-quality-and-release.md` section 17
   signed.
2. The launch acceptance checklist in `docs/research/07` passes line by line with linked
   evidence.
3. Pricing page has exactly two choices, no comparison table, no third plan, and the canon
   check passes on the production build.
4. Status page live with every component, including honest "in review" connector states.
5. Support inbox monitored, macros written, escalation documented.
6. Documentation complete, changelog started, roadmap published.
7. One real production purchase completed by the founder on each interval, then refunded,
   with the full trial and cancellation path exercised.
8. Canary suite green for 14 consecutive days.

**Launch sequence**

- Day minus 7: brief the design partners, ask (do not require) for a launch-day comment, and
  give them nothing to say that is not true.
- Day 0: publish the launch post on the blog first, then X, LinkedIn and the relevant
  communities, each with a native version rather than identical text. Publish the pricing
  page and the connector capability page at the same moment.
- Day 0: Product Hunt only if onboarding and provider reliability are ready. One meaningful
  launch per major product story, real maker participation, no vote manipulation, no
  incentives tied to sentiment.
- Day 1 to 3: Show HN or a GitHub story only if the open connector SDK, CLI and test
  fixtures are genuinely usable and the team can answer implementation questions live.
- Day 3: publish the first monthly reliability and connector report, even though the numbers
  are small. This starts the habit that makes the next twelve credible.
- Week 2: three case studies with baseline, workflow, timeframe, actual metrics, consent and
  stated limitations.

**What not to say, ever**: go viral with one click, set and forget autonomous social media,
guaranteed engagement, post anywhere with no limits, AI replaces your social team, "supports
30 languages" without distinguishing interface from content, or "official integration"
before the provider approves it.

---

## 10. Content and comparison pages

Owner: Founder with a named human editor for every piece.

**Editorial standard.** Every substantial article carries at least two of: original product
data with an explained sample and privacy threshold, a reproducible workflow or template,
screenshots or video from a real account or demo, primary-source platform citations with a
last-verified date, a named practitioner interview, a before-and-after example reviewed by a
native speaker, or a clear statement of limitations and what did not work. AI may research,
outline, transcreate, check and format. A named human owns the claim and updates it.

**Architecture**: `/guides/platforms/`, `/workflows/`, `/languages/`, `/benchmarks/`,
`/stories/`, `/compare/`, `/tools/`, `/tool-radar/`, `/opportunities/`, `/changelog/`,
`/status/`, `/docs/`, `/methodology/`.

**First ten pieces, in order, weeks 14 to 20:**

1. X API posting cost calculator and 2026 pricing guide (also the first free tool).
2. Why an X link post costs differently from a text post.
3. Building a reliable social publishing API: retries without duplicate posts.
4. Claude Code to social post: safe MCP approval patterns.
5. How to schedule a reviewed social campaign from Codex.
6. Why unaudited YouTube API uploads are private.
7. TikTok Direct Post audit checklist and consent UX.
8. Translation versus transcreation for social campaigns.
9. Median baseline versus viral score: a more honest feedback system.
10. Postiz alternative for multilingual agent workflows.

The remaining twenty pieces from `docs/research/04` section 7 follow across the first 90 days
at a cadence the editor can actually sustain. Two excellent pieces a week beats six thin ones.

**Free tools** (each must be genuinely useful standalone and must save a brief or draft that
continues into the product): X URL-post cost estimator, social media size validator, posting
policy preflight, multilingual hook comparison, experiment planner.

**Comparison pages** for Postiz, Buffer, Hootsuite, Later, Metricool, Publer, SocialBee,
Typefully and developer publishing APIs, published only after a current fact check. Each must
state who each product is best for, date the research, link primary pricing and capability
sources, compare account count, post limits, team and approval, API and MCP, languages,
analytics, video, embedded, self-hosting, support and estimated external API costs, and
distinguish "we do not support this" from "the provider does not allow this". Include a
migration checklist, a correction contact and an update schedule. Never use a competitor's
customer logos, testimonials, screenshots, illustrations, article structure or UI. An
"alternative to" page must remain useful even if the reader chooses the competitor.

**Weekly cadence**: Monday platform or policy update, Tuesday founder build lesson and
changelog, Wednesday customer or workflow demo, Thursday multilingual or analytics
experiment, Friday community answers and content maintenance.

---

## 11. UGC and creator program

Owner: Founder. Starts week 16, scales after launch.

- Recruit 20 small credible educators across agent workflows, localization, creator video and
  agency operations. Quality over count: five real partners beat fifty shallow ones.
- **Pay for work, not praise.** A tutorial contract requires disclosure and does not require
  a positive conclusion. Never buy reviews, votes, ratings, installs or undisclosed
  endorsements, and never offer an incentive conditional on positive sentiment.
- Give each partner a sandbox workspace, verified examples, technical support and a tracking
  link.
- Monthly workflow bounties for reproducible templates, with rights and licensing stated in
  writing.
- Customer story consent is separate from product access, is specific about timeframe and
  method, requires approval of the final wording, and is revocable for future use.

**This is distinct from the in-product UGC planning feature**, which stays deliberately basic
in V1: one campaign goal, a participant profile, five prompt angles, a short brief template, a
rights, consent and disclosure checklist, approval criteria, a distribution plan and
measurement. It does not discover or contact creators, negotiate contracts, synthesize
testimonials or generate avatar or video assets.

---

## 12. Affiliate launch

Owner: Founder with BE2. Program opens 30 days after public launch, not before.

- Default terms (decision D-10): 20% recurring for 12 months, 45-day hold against refunds and
  chargebacks, immutable commission ledger, fraud review before payout.
- Disclosure is mandatory in every partner placement. Ranking, recommendations and the
  Creative Tool Radar are never influenced by commission, and that independence is stated
  publicly.
- Start with five partners drawn from the UGC program, review performance and quality at 60
  days, then expand toward 15 to 20.
- Attribution runs through Polar-compatible tracking plus our own ledger. Every referral row
  records the disclosure acceptance, the referral source, the eligible Polar order, the hold
  and refund state and any fraud flag.
- Prohibited: brand-bidding on our own terms without permission, coupon-site stuffing,
  unattributed comparison spam, or any placement that presents a related account as an
  independent endorser.

---

## 13. Creative Tool Radar maintenance

Owner: Founder, or a named editor once volume justifies it. Ongoing from week 15.

- Every record needs: canonical official URL, product owner, use case, inputs and outputs,
  material limitations, pricing model with the date checked, rights, privacy and retention
  caveats, supported integrations, affiliate status, reviewer, retrieved date, last verified,
  next review and a retired or replaced state.
- **Cadence**: high-impact and fast-changing records reviewed weekly, the full active catalog
  monthly.
- Show `last verified` and, where appropriate, `may have changed`. Never imply permanent
  accuracy.
- A maximum of five contextual results is shown to a user, ever. Never a long directory.
- Publish only material tool changes and update the affected workflow guides. Let users
  follow a workflow category and opt into a monthly digest or material-change alerts.
- Stale records are labelled or suppressed. The model never invents a URL, and the
  deterministic post-processor rejects any URL not resolvable to an active catalog ID.
- Ranking is independent of affiliate commission and every commercial relationship is
  disclosed at the point of recommendation.

---

## 14. Opportunity catalog maintenance

Owner: Founder. Seed at least 30 verified records before beta (week 15), or the feature ships
with an honest empty state.

- Candidate types: product-launch and startup directories, software and review directories,
  integration and automation marketplaces, community resource or showcase threads that
  explicitly permit submissions, partner ecosystems, guest tutorials, case studies, podcasts,
  newsletters, expert roundups, and open-source resource lists whose contribution rules permit
  the project.
- Every record: official URL, organization, category, audience, geographic and language fit,
  current submission and self-promotion rules, cost, whether placement is sponsored, reviewer,
  retrieved date, last verified, next review, and an active or retired state.
- Lifecycle states: draft, reviewed, active, stale, retired. Only `active` records are
  customer visible. Every state change writes an audit record.
- Records are rechecked before a submission brief is shown, and immediately after a rejection
  or a rule change.
- **Boundaries, enforced in product and in copy**: we never auto-submit a form, create an
  account, scrape or email a contact, post into a community, buy or exchange links, bypass
  moderation, or promise search ranking, reach or backlinks. The user owns the final
  submission. Backlinks are a possible by-product of a relevant placement, never a target.
- Maximum ten ranked opportunities per plan.

---

## 15. Metrics dashboard

Owner: QA builds it, Founder reads it weekly.

**North star: weekly verified publications that satisfy the workspace approval policy and
produce a valid external receipt.** Not scheduled posts, not drafts, not attempts. A
publication counts only when an external ID or explicit provider evidence exists. Pair it
with retention and quality metrics so that volume never rewards spam.

**Funnel**

| Metric | Target at launch |
| --- | --- |
| Visitor to signup, by intent and page | tracked, no target in month 1 |
| Signup to first connected account | 60% |
| Connected account to first validated draft | 70% |
| Draft to approved, scheduled and verified publication | 60% |
| Time to first verified publication | under 10 minutes for a simple text account |
| Second-week verified publication rate | 50% |
| 30 and 90-day workspace and revenue retention | tracked from launch |

**Product quality**

Valid publish execution success by connector (target 99.5% under the declared exclusions),
duplicate publication count (target zero, alert on any), median remediation time, analytics
coverage and freshness, approval turnaround, AI suggestion acceptance and edit rate by
locale, support tickets per 100 active workspaces.

**Business**

MRR, net revenue retention, logo churn, refund and chargeback rate, gross margin including
Polar fees, provider APIs, AI, storage and egress and support (hold above 75% excluding
explicitly passed-through X usage), CAC and payback by channel and ICP, activated paid
workspaces and assisted revenue per content piece or partner.

**Guardrails, reviewed weekly with an owner for any breach**

Platform warnings, enforcement actions and revoked applications; spam and abuse reports per
1,000 publications; bulk, duplicate and cadence blocks triggered; user-data deletion
completion time; AI disclosure and accessibility completion rates; partner disclosure
compliance and fraudulent referrals.

**Distribution ledger.** One row per channel or placement with audience, cost, rules, URL,
visits, signups, activated workspaces, paid conversions and assisted revenue. Optimize for
activated retained workspaces and verified publications, not impressions or backlinks.

---

## 16. First 90 days after launch

**Days 1 to 30: stabilize and listen**

- On-call rotation active. Any SEV1 gets a public postmortem.
- Weekly reliability report published, even when the numbers are small.
- 20 customer conversations. Categorize every churn reason: posting stopped, missing
  connector or feature, reliability, price, AI quality, support, seasonality, business closed.
- Close the connector gaps that provider approvals opened during the launch window. If a
  video connector was still in review at launch, publish the current state weekly rather than
  leaving a vague "coming soon".
- Ship the first three of the thirty content pieces that were not staged before launch.
- Do not add features. The month after launch belongs to reliability and onboarding.

**Days 31 to 60: activation and proof**

- Fix the two largest funnel drop-offs identified in month 1, measured before and after.
- Publish three case studies with baseline, workflow, timeframe, actual metrics, consent and
  limitations.
- Open the affiliate program with five partners.
- Launch the n8n node or template, which is the highest-leverage workflow surface.
- Run weekly office hours for agent workflows and multilingual content.
- First quarterly-quality benchmark or report begins research.

**Days 61 to 90: compound the two channels that work**

- Double down on the two channels producing activated paid workspaces, not raw traffic. Stop
  the others rather than maintaining them at half effort.
- Add the next connector by the connector scorecard, chosen by paying-customer demand rather
  than by the loudest request.
- Decide the first three additional interface locales (decision D-12) based on where paying
  customers actually are.
- Begin the embedded design-partner conversation with three to five SaaS companies, as
  discovery only. Do not promise an embedded product.
- Publish the first definitive report or benchmark with methodology, sample criteria,
  exclusions, metric definitions and a privacy threshold.
- Review pricing with 90 days of real margin data. Any change grandfathers existing
  customers.

**Standing rules for the first 90 days**

- Every provider claim has an owner and a recheck date. Monthly platform and pricing
  changelog review, quarterly competitor and legal review, immediate review on any provider
  rejection, enforcement notice, SDK deprecation or unexplained publish or analytics change
  (`docs/research/06-source-register.md`, compiled 4 August 2026).
- Every performance claim states its timeframe, sample and method, and carries customer
  consent.
- Every AI-assisted piece of content has a named human editor.
- Maintain a correction log, a content update schedule and a sunset process for stale pages.
- Never describe an integration as official before the provider approves it.
