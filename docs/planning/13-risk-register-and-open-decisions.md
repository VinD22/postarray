# 13. Risk Register and Open Decisions

Owner: Founder (decisions), Technical Lead (technical risks), QA (schedule and operational
risks). Reviewed every Friday. A risk without a named owner and an early warning signal is
not managed, it is just written down.

Week numbers refer to `docs/planning/11-delivery-roadmap.md`. Week 1 begins Monday
10 August 2026.

Scales. Probability: L under 20%, M 20 to 50%, H above 50%. Impact: L recoverable within a
week, M costs two to four weeks or a feature, H threatens the launch date or the business.

---

## 1. Provider and platform risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-P1 | Meta business verification or app review is not complete by week 14, removing Instagram and Facebook Pages from launch | H | H | Applications submitted week 1. Threads and Bluesky fallbacks pre-built behind the same connector contract. Fallback decision point Thursday week 11 | No reviewer response within 21 days of submission; a request for information that names a missing legal page | Founder |
| R-P2 | YouTube API compliance audit not complete, so uploads remain private only | H | M | Ship private-only upload labelled honestly. Never market it as public publishing. Audit requested week 10 | Audit queue acknowledgement absent by week 13 | Founder |
| R-P3 | TikTok Direct Post audit not granted, so posts remain private and capped | H | M | Same pattern as R-P2. Consider holding the connector rather than shipping a confusing state | No audit decision by week 14 | Founder |
| R-P4 | LinkedIn Community Management access is refused or limited to member posting | M | M | Ship member posting; label organization publishing `not_implemented`. Resubmit with a stronger demo | Reviewer questions about which product surface uses each scope | Founder |
| R-P5 | X pricing changes, making pass-through economics or the cost estimator wrong | M | M | Prices read from configuration, not hard-coded. Estimator shows a range and a "prices set by X and may change" note. Reconcile actual usage weekly | Any change on the X developer console pricing page; a reconciliation gap above 1% | BE1 |
| R-P6 | A provider changes an API or policy mid-build, invalidating a connector | H | M | Source register with owner and recheck date. Monthly changelog review. Capability snapshots are versioned data, so a change is a data update, not a refactor | Deprecation notice, version header rejection, a sudden rise in `PERMANENT_PROVIDER` errors | BE1 |
| R-P7 | A provider revokes our application after launch because of a customer's behaviour | L | H | Anti-spam preflight, cadence budgets, duplicate detection, no automated engagement, per-workspace kill switch, fast enforcement path, documented AUP | A platform warning email; a spike in spam reports per 1,000 publications | Founder |
| R-P8 | Fewer than four connectors are production-capable at the gate review | M | H | Activate Bluesky in week 11 regardless. Consider launching without a video connector and saying so plainly | Two or more approvals still open at week 14 | Founder |

**Do not conflate two different states.** "The provider does not support this" is
`unsupported` and is permanent until they change. "We have not built this yet" is
`not_implemented` and is our backlog. Marketing, the capability matrix, the API and the UI
must use the same two words.

---

## 2. Technical risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-T1 | Duplicate publication in production | M | H | DUP-1 to DUP-10 in CI, nightly randomized chaos, status query before any create retry, database-enforced idempotency, replay tests pinned to histories | Any DUP test flake; any production receipt collision; a customer report of a double post | TL |
| R-T2 | Cross-tenant data exposure | L | H | RLS on every tenant table, generated per-table tests, coverage gate, credential tables unreachable by browser roles, independent security review at G5 | An RLS test skipped or weakened in a pull request; a new table merged without a policy | TL |
| R-T3 | Social token leakage into logs, traces, Temporal histories or support views | M | H | Envelope encryption, decrypt only immediately before a provider call, redacting logger by default, a test that greps captured telemetry for a fixture token | Any log line containing a bearer-shaped string; a new logging call added outside `@relay/observability` | TL |
| R-T4 | Temporal non-determinism breaks in-flight workflows on deploy | M | H | Replay tests, `patched()` versioning, worker deployed before web, no rollback of a worker carrying a patched branch, 90-day history retention matching the maximum look-ahead | A replay test failing after a refactor; a workflow task failure spike after deploy | BE2 |
| R-T5 | Parallel agents produce contract drift and merge conflicts | H | M | Contract-first sequencing, disjoint package ownership, CODEOWNERS, dependency-boundary lint, Thursday integration checkpoint, contract freeze windows | Two open pull requests editing the same package; a locally invented type duplicating a contract type | TL |
| R-T6 | Junior implementers ship plausible but wrong provider behaviour | H | M | Simulator-first development, contract tests per error class, connector definition of done, the receipt as the proof of publication rather than a 2xx | A connector marked done without a dossier; a test that asserts only the happy path | BE1 |
| R-T7 | Media pipeline cost or failure under video load | M | M | Derivatives only when required, size and duration limits at upload, isolated worker, retryable upload with resumable sessions, storage adapter so R2 can replace Supabase Storage for egress | Storage egress cost per active workspace above the model; upload failure rate above 2% | BE1 |
| R-T8 | Supabase platform behaviour changes, for example Data API exposure or Node support | M | M | Explicit grants and RLS treated as the standard now. Node 22. Monthly Supabase changelog review in the source register | Changelog entry affecting auth, grants or client libraries | TL |
| R-T9 | Scheduler dispatch latency misses p95 under 60 seconds at load | M | M | Load test at 5,000 posts in one minute, worker autoscaling, no per-post polling, jitter only for analytics | p95 above 30 seconds in staging load runs | BE2 |
| R-T10 | Prompt injection causes an unintended external action | M | H | Untrusted-input delimiting, server-side ID resolution, deterministic post-processing, allowlisted tools, approval levels enforced server side, no secrets in context | Any eval red-team case failing; a model output containing an account ID we did not resolve | TL |
| R-T11 | AI evaluation quality is poor in several of the 30 content languages | M | M | Native reviewer pool, per-language thresholds, label a language `beta` or remove it rather than ship it silently | A language scoring below 3.5 in two consecutive eval runs | TL |

---

## 3. Security and privacy risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-S1 | OAuth redirect or state handling flaw allows account takeover of a connection | L | H | Exact redirect allowlist, PKCE, single-use short-lived state, dedicated security test suite, external review | A redirect matcher using `startsWith`; a callback handler added outside the shared module | TL |
| R-S2 | SSRF through RSS or media import reaches internal infrastructure | M | H | Scheme allowlist, DNS and IP checks before and after each redirect, redirect depth cap, size and time limits, egress restricted at the network level where possible | Any fetch call added outside the safe-fetch helper | BE2 |
| R-S3 | Short-link service used for phishing or open redirects, damaging domain reputation | M | H | Destination scanning, unsafe scheme and private-network blocks, expiry, emergency disable, abuse-report path, enumeration rate limits, isolated domain | Abuse reports; a spike in redirects to newly registered domains | BE2 |
| R-S4 | Independent security review finds a critical issue late | M | H | Book the reviewer in week 10 for a week 17 start. Run an internal review at the end of phase 2 so the external review is confirmation, not discovery | Internal review finding a high issue after week 14 | TL |
| R-S5 | A data deletion request is not honoured completely across Temporal, storage, providers and backups | M | H | SEC-014 and SEC-015 with a witnessed end-to-end exercise, documented retention classes, deletion propagation on restore | A deletion run leaving an orphaned workflow or object | BE2 |
| R-S6 | Secret committed to the repository | M | H | Pre-commit and CI secret scanning over the whole branch history, only `.env.example` placeholders, fixtures redacted at record time | Any scanner hit, including in a test fixture | TL |

---

## 4. Legal and compliance risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-L1 | Public policy documents are not counsel-reviewed by the gate review, blocking G7 | M | H | Draft all seven in week 2, counsel engaged by week 12, review in weeks 15 to 18 | No counsel engaged by week 12 | Founder |
| R-L2 | Consumer-law exposure on trial conversion disclosure | M | H | `$0 due today`, exact date and amount beside the start-trial action, Polar reminder, self-service cancellation, evidence of the checkout disclosure version retained. Never claim a `$2 hold` | Any support ticket saying "I did not know I would be charged" | Founder |
| R-L3 | Clean-room contamination claim, given Postiz is AGPL-3.0 | L | H | Written clean-room policy in week 1, no code copied adapted or consulted, provenance statement in the README, source register recording that behaviour was derived from public product observation and official provider documentation | Any pull request referencing a competitor source file | TL |
| R-L4 | GDPR or DPDP obligations triggered before a lawful basis and transfer mechanism are documented | M | M | Conservative defaults now, decision D-4 below, DPA template and subprocessor list before paid launch | A design partner requesting a DPA that we cannot produce | Founder |
| R-L5 | Affiliate or UGC program creates undisclosed endorsement exposure | L | M | Disclosure required in every partner agreement, ranking independent of commission, no incentive conditional on a positive review | A partner publishing without disclosure | Founder |
| R-L6 | Comparison pages create trademark or false-claim exposure | M | M | Dated, sourced, factual claims only. Correction contact and update schedule. No competitor logos or copied UI | A takedown or correction request | Founder |

---

## 5. Product risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-D1 | The absence of AI image and video generation is read as a missing feature | H | M | Explain it as a focus choice in product copy, the Creative Tool Radar makes imported assets the fast path, and the reasoning page is linked from the composer | Two or more of ten sales conversations naming it as the reason not to buy | Founder |
| R-D2 | The composer's master-and-override model confuses users | M | H | Explicit override state per target, reset to master with confirmation, no silent fan-out of incompatible fields, usability testing in weeks 5 and 16 | Users editing each target from scratch instead of using the master, seen in session recordings | DES |
| R-D3 | Growth Advisor ships with an empty opportunity catalog and looks broken | H | M | An honest empty state is required and is better than an invented recommendation. Seed 30 verified records before beta. Cap results at 10 opportunities and 5 tools | Fewer than 20 active verified catalog records at week 15 | Founder |
| R-D4 | Scope creep from the parity matrix in `docs/research/07` | H | M | The matrix is the ceiling, not a wish list. Anything not in the matrix requires a written founder decision. The small-team plan already documents what is cut | A pull request implementing something with no task ID | TL |
| R-D5 | Time to first verified publication exceeds 10 minutes, killing trial conversion | M | H | Onboarding task WEB-017, funnel instrumentation from week 11, a fake-provider path that lets a user see the full loop before connecting a real account | Median above 15 minutes in the alpha cohort | FE1 |
| R-D6 | Analytics look empty because providers return little for new accounts | H | M | Show `Unavailable` with the provider definition and the reason, never `0`. Set expectations during connection | Support tickets about "missing analytics" in the first week of beta | FE2 |

---

## 6. Financial risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-F1 | Gross margin falls below 75% excluding pass-through X usage | M | H | Track Polar fees, DeepSeek tokens, storage and egress, support minutes per workspace. Adjust the disclosed fair-use or channel boundary rather than creating hidden tiers | Margin below 80% on any monthly cohort | Founder |
| R-F2 | X pass-through billing under-recovers or surprises customers | M | M | Estimate before the action, reconcile after, spend alerts and caps, a plain explanation beside checkout | Reconciliation gap above 1%; a chargeback citing API charges | BE2 |
| R-F3 | AI cost per workspace exceeds the model because of long-context use | M | M | Cost budgets per feature, token accounting in evals, `deepseek-v4-flash` as the default rather than a larger model | p95 tokens per request above the budget for two weeks | TL |
| R-F4 | Trial abuse produces cost without revenue | M | M | Polar repeat-trial prevention, product-side rate and risk controls, no card fingerprinting by us | Trial-to-paid conversion falling while trial starts rise | Founder |
| R-F5 | Runway is consumed by a 20-week build before revenue | M | H | Charge from the paid beta at day 61 to 90 rather than waiting for the full launch. The small-team plan exists precisely for this case | Fewer than 12 weeks of runway at the phase 3 exit | Founder |

---

## 7. Schedule and team risks

| ID | Risk | P | I | Mitigation | Early warning signal | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-X1 | The 14-day beta reliability window starts late, moving the launch | M | H | The window must start by the Monday of week 16. It is the single date to protect. Beta partners recruited from week 10 | Fewer than 15 partners committed by week 14 | QA |
| R-X2 | Launch lands in the last week of December when nobody is staffed | H | M | Gate review in week 19, launch decision explicit, recommended default is 5 January 2027 | Any slip past week 18 | Founder |
| R-X3 | A key person is unavailable for two or more weeks | M | M | No package has exactly one person who understands it. Pair on the vault, Temporal and RLS specifically. Written runbooks | A bus factor of one on the risk board | TL |
| R-X4 | Estimates are junior-optimistic and the plan silently slips | H | M | Estimates carry a 1.3 multiplier for unfamiliar packages. Phase exits are written decisions, not "roughly done". Weekly burn-up against the sprint plan | Two consecutive sprints delivering under 70% of committed tasks | TL |
| R-X5 | Design and copy become the bottleneck because every screen needs seven states | M | M | DSN-004 batches state design. Copy is written in `packages/i18n` alongside the component, not after | A screen shipped without an error or partial-success state | DES |

---

## 8. Open founder decisions

Each has a recommended default that the team will implement if no decision arrives by the
deadline. A default that is implemented is recorded as a decision, not as a gap.

### 8.1 Blockers: work stops or is wasted without an answer

| ID | Decision | Deadline | Recommended default | Why it blocks |
| --- | --- | --- | --- | --- |
| D-B1 | Legal entity and governing jurisdiction (legal question 1) | End of week 4, 6 September 2026 | Incorporate in the founder's home jurisdiction unless a tax or investor reason says otherwise. Do not delay the product for a Delaware or Estonian structure decision | Provider applications, Polar onboarding, Terms and the DPA all name an entity. Meta and LinkedIn business verification cannot complete without it |
| D-B2 | Product name and domain (codename is "Post Array") | End of week 6, 20 September 2026 | Keep `Post Array` only if the trademark and the `.com` are genuinely obtainable in the software and SaaS classes. "Post Array" is heavily used in developer tooling, so the default is to choose a distinct coined name by week 6 and register it. All user-visible copy already lives in `packages/i18n`, so a rename is a catalog edit plus package scope rename, roughly two days if done before week 8 and roughly two weeks if done after marketing content exists | Provider applications, legal pages, the status page, marketing content and the short-link domain all embed the name. Renaming after week 12 is expensive |
| D-B3 | Short-link default domain | End of week 5, 13 September 2026 | Register a short second domain now, isolated from the app session domain. Do not use a subdomain of the product domain, because a link-abuse incident would damage the app's reputation and cookies | LNK-001 cannot ship without it and DNS propagation plus reputation warm-up take weeks |
| D-B4 | Initial customer geographies (legal question 2) | End of week 8, 4 October 2026 | Sell worldwide except where sanctions apply, and treat EU, UK and India users as in scope from day one. Building for the strictest regime now is cheaper than retrofitting | Determines the privacy notice, the consent manager, transfer mechanism and data hosting region |
| D-B5 | Data hosting region and transfer mechanism (legal question 4) | End of week 8, 4 October 2026 | Primary region in the EU, with standard contractual clauses for transfers and a documented subprocessor list. Revisit if the first ten customers are all US-based | Changing the Supabase region after data exists is a migration, not a setting |
| D-B6 | Whether four connectors including a video platform is a hard launch gate | End of week 14, 15 November 2026 | Keep four connectors as a hard gate. Make the video connector a soft gate: launch without video if YouTube or TikTok audits are outstanding, and say so plainly on the pricing and connector pages. Do not claim video support | Determines whether the launch date belongs to us or to a provider review queue |

### 8.2 Proceed on default: the team implements the default and the founder can change it later

| ID | Decision | Deadline | Recommended default |
| --- | --- | --- | --- |
| D-1 | Minimum age and excluded markets (legal question 3) | Week 10, 18 October 2026 | 16 in the EEA and UK, 13 elsewhere where lawful, with a plain statement that the product is for business use. No education or minor market targeting |
| D-2 | Political, regulated-industry, adult and crypto marketing (legal question 5) | Week 10, 18 October 2026 | Prohibit adult content and political advertising in V1. Allow regulated industries and crypto only under the standard AUP with no special claims support. This is reversible and it keeps provider reviews simpler |
| D-3 | Default retention for content, analytics and audit, and whether customers can configure it (legal question 6) | Week 12, 1 November 2026 | Drafts and media while the account is active plus a 30-day trash grace period. Raw provider responses 30 days. Security logs 90 days. Analytics observations 24 months. Receipts and audit 24 months with content minimization. Customer-configurable retention is a V1.1 feature |
| D-4 | Self-hosted edition and its licence (legal question 7) | Week 16, 29 November 2026 | No self-hosted edition in V1. Publish an open connector SDK, CLI and test fixtures instead, which gives the developer credibility without the support burden or the licence question |
| D-5 | Controller or processor allocation for embedded customers (legal question 8) | Week 16, 29 November 2026 | Embedded is out of V1 scope. When it arrives, the embedded customer is the controller and we are the processor, with platform-consent responsibility on the customer. Write this into the API terms now so it does not need renegotiating |
| D-6 | Refund, trial and grace-period rules (legal question 9) | Week 12, 1 November 2026 | 14-day refund on the first payment of either interval, no questions asked. Pro-rata refund on annual only where consumer law requires it. Seven-day grace on a failed payment, then read-only with all data preserved and no social account disconnected. Publish this beside checkout |
| D-7 | Compliance roadmap: SOC 2, ISO 27001, GDPR, CCPA, DPDP (legal question 10) | Week 18, 13 December 2026 | GDPR and UK GDPR readiness at launch because D-B4 puts EU users in scope. CCPA readiness at launch. DPDP readiness within 90 days of launch. SOC 2 Type 1 only when a paying customer asks in writing, which is unlikely before the first embedded deal. Do not start SOC 2 pre-launch |
| D-8 | Whether to offer a permanently free tier or a developer sandbox | Week 12, 1 November 2026 | No free tier. Offer a limited sandbox for API and MCP schema testing with no live publishing, as described in the marketing plan. The seven-day trial is the free experience |
| D-9 | Support hours and response commitment | Week 16, 29 November 2026 | Email and in-app support, one business day target, published hours in a single time zone, no SLA claim and no 24/7 claim until staffing supports it |
| D-10 | Affiliate commission rate and hold period | Week 18, 13 December 2026 | 20% recurring for 12 months, 45-day hold against refunds and chargebacks, disclosure required, ranking never influenced by commission. Start with five partners, not fifty |
| D-11 | Whether Threads, Bluesky or both are activated as fallbacks | Week 11, 22 October 2026 | Activate Bluesky regardless because it has no approval gate and costs about one person-week. Activate Threads only if Meta review is still open |
| D-12 | Which interface locales follow English, and when | Week 20, 26 December 2026 | Ship V1 in English only. Add the first three interface locales in V1.1 based on where paying customers actually are, not on a list chosen in advance. The catalog and pseudo-locale work is already done, so each locale is a catalog file plus a config entry |
| D-13 | Whether the codename appears in package scopes after a rename | Week 6, 20 September 2026 | Rename `@relay/*` scopes at the same time as D-B2. It is a mechanical change and leaving two names in the codebase confuses every future contributor |
| D-14 | Pricing experiment policy | Week 18, 13 December 2026 | Launch at $29 and $300 and hold for at least 90 days. Landing-page price testing is by audience segment, never hidden individual price discrimination. Any change grandfathers existing customers |

### 8.3 Decisions already made and closed. Do not reopen without a written rationale.

- One public plan at $29 monthly or $300 annually. No feature tiers. 30 active channels.
  Unlimited team members.
- Seven-day Polar trial on both intervals, payment method collected, $0 due today, exact
  conversion date and amount shown, self-service cancellation, no `$2 hold` claim.
- Entitlements from verified Polar webhook state plus reconciliation only.
- No AI image generation and no AI video generation in V1, in any form.
- Official provider APIs only. No browser automation, cookie replay, scraping, unofficial
  posting endpoints, automated likes or follows, spam replies, fabricated engagement,
  fabricated UGC, manufactured backlinks or bulk directory submission.
- Clean room with respect to Postiz, which is AGPL-3.0.
- V1 interface is English only, built so that adding a locale is a catalog file plus a
  config entry. 30 content languages are supported for content.
- Stack: Next.js 16, React 19, TypeScript, NestJS 11, Supabase, Temporal, Redis or Valkey,
  Polar, DeepSeek `deepseek-v4-flash` behind a provider-neutral gateway, pnpm and Turborepo.

---

## 9. Volatile claims requiring re-verification before implementation

Every row below is sourced from `docs/research/06-source-register.md`, compiled
**4 August 2026**. Each must be re-verified against the primary source before the code that
depends on it is written, and again before public launch.

| Claim | Source | Re-verify by |
| --- | --- | --- |
| X charges $0.015 per post create and $0.200 per post create containing a URL | X API pay-per-use pricing, https://docs.x.com/x-api/getting-started/pricing | Before CON-003, and monthly after launch |
| Polar collects a payment method at trial start, defers the charge, sends a pre-conversion reminder, and offers repeat-trial abuse prevention | Polar trials, https://polar.sh/docs/features/subscriptions/trials | Before BIL-001 |
| Polar fee levels for a new organization | Polar fees, https://polar.sh/docs/merchant-of-record/fees | Before the margin model is finalized, week 14 |
| `deepseek-v4-flash` is a current identifier and legacy identifiers were retired 24 July 2026 | DeepSeek API changelog, https://api-docs.deepseek.com/updates/ | Before AIG-001 |
| Instagram publishing requires professional accounts and a container flow | Instagram content publishing, https://developers.facebook.com/docs/instagram-platform/content-publishing/ | Before CON-008. Meta docs were rate-limited during research, so open and save the live version |
| Unaudited YouTube API projects may upload only as private | YouTube videos.insert, https://developers.google.com/youtube/v3/docs/videos/insert | Before CON-010 |
| Unaudited TikTok posts are private with account caps, and creator info plus privacy choice must be shown | TikTok Content Sharing guidelines, https://developers.tiktok.com/doc/content-sharing-guidelines/ | Before CON-011 |
| LinkedIn member read access is restricted for new applications | Community Management overview, https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview | Before CON-005 and before any analytics claim |
| Supabase requires explicit grants and does not auto-expose new tables to the Data API | Supabase changelog, https://supabase.com/changelog | Before SEC-002, and monthly |

Recheck cadence, from the source register: before each connector starts, before public beta,
monthly after launch for platform and pricing changelogs, quarterly for competitor and legal
documents, and immediately on any provider rejection, enforcement notice, SDK deprecation or
unexplained publish or analytics change.
