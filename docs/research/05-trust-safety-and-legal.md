# Trust, Safety, Platform Compliance, and Legal Handoff

This is a product and implementation checklist, not legal advice. The final documents and jurisdiction choices require qualified counsel before public launch.

## 1. Core operating policy

The product helps users publish content they are authorized to publish through official platform APIs. It does not help them evade platform limits, impersonate people, manipulate engagement, send unsolicited outreach, or hide material AI/commercial disclosures.

Safe defaults:

- Human approval for immediate public publishing initiated by an agent.
- Explicit opt-in for preapproved scheduling policies.
- Official APIs only.
- Least OAuth scopes.
- Conservative cadence and duplicate checks.
- Clear account identity, audience/privacy, content, media, timing, and cost before confirmation.
- Immutable audit trail and external publication receipt.
- Easy pause, revoke, export, and delete.

## 2. Acceptable Use Policy requirements

Prohibit use for:

- Spam, unsolicited bulk messages/replies/mentions, deceptive engagement bait, or repeated unwanted content.
- Automated directory/form submissions, bulk outreach, link schemes, paid/reciprocal links intended to manipulate search ranking, or community promotion that violates the destination's rules.
- Deceptive multi-account amplification, fake independent endorsements, coordinated engagement pods, or threshold rules designed primarily to manipulate ranking signals.
- Coordinated inauthentic behavior, engagement pods, fake reviews/ratings/install counts, automated likes/follows, or platform trend manipulation.
- Publishing duplicate or substantially similar content across many accounts when platform rules prohibit it.
- Impersonation, phishing, fraud, scams, malware, credential theft, or deceptive installation.
- Harassment, doxxing, sexual exploitation, non-consensual intimate media, hate/violent extremist content, or illegal goods/services.
- Political manipulation or automated political persuasion where prohibited; require enhanced review if political content is ever allowed.
- Copyright/trademark/publicity violations, unlicensed music/media, deepfakes without rights/disclosure, and undisclosed synthetic endorsements.
- Bypassing official APIs, rate limits, audits, account controls, or platform enforcement with browser automation/cookies/scraping.
- Publishing to app stores, the Chrome Web Store, or other restricted submission systems through unauthorized automated interfaces.
- Circumventing account bans or creating coordinated account farms.
- Training or evaluating models on third-party/user content without authorization.

Reserve the ability to rate-limit, pause, require verification, remove content under our control, revoke agent/API access, suspend, and terminate. Include a fair appeal and restoration process.

## 3. Anti-spam and cadence controls

### Deterministic preflight

- Exact and semantic duplicate fingerprint by workspace/account/platform/time window.
- Cross-account similarity warning/block based on provider rule and workspace policy.
- Mention, hashtag, URL/domain, and reply volume checks.
- Account-level and workspace-level cadence budgets.
- New-account/new-domain and bulk-action escalation.
- Repeated evergreen-post expiry and maximum repetitions.
- Link reputation/safe-browsing integration where lawful.
- Opt-out/consent record for any messaging feature added later.

### Product defaults

- No auto-like/follow/DM/comment/repost feature in V1.
- No automatic "engagement booster."
- No unsolicited automated replies.
- Reposting is an explicit user-authored campaign with limits, not an infinite loop.
- A single agent call cannot silently publish across all connected accounts.
- Workspace owner can set stricter caps than the plan limit.
- Risk controls cannot be weakened merely by upgrading a plan.

### Enforcement process

1. Detect and block/warn before external action when possible.
2. Preserve reason, rule version, evidence hash, and appeal path.
3. Escalate repeat/serious behavior to trust review.
4. Notify customer without revealing abuse-detection details that enable evasion.
5. Report/remove where legally/platform required.
6. Track false positives and reviewer consistency.

## 4. Agent safety model

Agent-generated content is untrusted until validated and approved under policy. The model is not an identity and cannot inherit the user's full permissions.

### Required controls

- OAuth/API credential identifies a scoped service account, not an omnipotent workspace session.
- Separate read, draft, approval-request, schedule, immediate-publish, cancel, analytics, and billing scopes.
- Per-agent account/brand/locale/domain/time/cadence/look-ahead restrictions.
- Idempotency key for every write.
- Preview and validation available before any consequential tool.
- Immediate publish and high-risk actions require explicit human confirmation by default.
- Bulk, new domain, new account, sensitive category, paid endorsement, privacy change, or content changed after approval always escalates.
- Tool responses clearly state side effects and external state.
- Server reauthorizes every call; never trust the agent host's UI confirmation alone.
- Audit actor, client, skill/tool version, input hash, decision, and receipt.
- Emergency kill switch per agent and workspace.

### Prompt injection defense

- Treat webpages, source files, comments, messages, and connector responses as untrusted data.
- Never place secrets in model context.
- Delimit external text and state that it cannot change authorization/tool policy.
- Use allowlisted tools and structured arguments.
- Resolve account IDs server-side and require explicit authorized IDs.
- Revalidate output deterministically; model approval is not security approval.
- Block data exfiltration through posts, URLs, media metadata, webhook destinations, or error messages.

## 5. Platform-specific operating rules

Rules change. Each connector needs an owner, current policy URL, last-reviewed date, and change alert.

### X

- Use official X API only.
- Obtain express consent for automated actions beyond the OAuth connection and clearly describe what will happen.
- Provide opt-out/revoke and maintain records.
- Do not publish duplicate/substantially similar posts across accounts, manipulate trends, post unsolicited automated replies, or evade limits.
- Account for pay-per-use API costs and current rate limits.
- Support current AI/content disclosure fields such as `made_with_ai` when applicable and document user responsibility.
- Do not promise source labels or capabilities outside the approved API/app configuration.

### LinkedIn

- Request only products/scopes used in the shipped product.
- Maintain verified company identity, working website/domain/email, privacy/terms, and reviewer demo.
- Respect member and application daily limits even though exact limits may be shown only in Developer Portal.
- Use current LinkedIn version headers.
- Do not promise member-post analytics that depend on read access closed to new applications.
- Organization publishing and analytics require the correct Page role and approved community access.

### Meta: Instagram, Facebook, Threads

- Publish only to supported account types. Instagram publishing targets professional business/creator accounts, not consumer accounts; Story availability can be narrower.
- Facebook target is Pages, not personal-profile automation.
- Implement the official container/create/status/publish sequence and confirm final state.
- Obtain Meta app review/business verification and show why each permission is used.
- Handle token/role/page/account changes, deletion requests, and data-use checks.
- Recheck Meta's live docs because official pages and versions change frequently.

### YouTube

- Use Google OAuth and minimum required scopes.
- An unaudited project may upload videos only as private. Complete API compliance audit before promising public upload.
- Provide user control, revocation, deletion, privacy policy, and required disclosures.
- Delete stored authorized data within required timelines after revocation/deletion unless a lawful exception applies; current policy includes a 30-day obligation in relevant cases.
- Do not quota-shard across projects or scrape/derive forbidden metrics.
- Do not enable high-volume repetitive, mass-produced, or misleading synthetic content prohibited by YouTube spam policy.
- Prompt for altered/synthetic-content disclosures where required.

### TikTok

- Obtain Content Posting API/Direct Post approval and `video.publish` authorization.
- In unaudited mode, posts are private and account/user caps apply. Do not market this as production publishing.
- At publish time fetch and show current creator info and available privacy options.
- Do not default the privacy selection. Comment, duet, and stitch settings require user choice under current guidelines.
- Show commercial-content declarations and music-rights confirmation where applicable.
- Provide a preview and editable caption/title/hashtags with explicit consent.
- Do not add our promotional watermark/logo.
- For URL-pull uploads, use verified owned domains.
- Poll/status/webhook the final publication; a media upload alone is not success.

### Chrome Web Store and browser extensions

Chrome's policies do not categorically ban all AI functionality, but they impose critical restrictions:

- Bots are not eligible for featuring under current policy.
- Extensions may not send messages on a user's behalf without letting the user confirm the content and intended recipients.
- A single narrow purpose, minimum permissions, accurate listing/privacy disclosure, and meaningful in-extension utility are required.
- Remote hosted code/undisclosed behavior and deceptive installation/ratings are prohibited.
- The Web Store itself may be accessed only through interfaces Google provides unless separately allowed.

Therefore, an optional extension should only capture/share the current page or asset into our composer with explicit user action. It must not automate Web Store submissions or unofficially post to social sites by controlling browser UI. The core product must not depend on an extension.

## 6. AI content policy

Publish a user-facing AI Policy that explains:

- Which features use DeepSeek or other model/media providers.
- What content and metadata is sent to each provider.
- Whether providers retain data or train on it, based on the actual contract/settings.
- That customer content is not used to train our models by default.
- How users can disable optional AI features where practical.
- AI limitations, responsibility for review, and no guarantee of reach/performance.
- Disclosure obligations for synthetic/altered media and endorsements.
- The content provenance stored with generated assets.

Product controls:

- AI-assisted/generated label in internal history.
- User-visible disclosure reminder by platform/media type.
- Claims/evidence review and hallucination warning.
- Impersonation/public-figure and non-consensual intimate-media blocks.
- Rights and likeness attestation for generated media.
- Native reviewer status for translated/transcreated content.
- No autonomous publishing by default.
- Growth-strategy output distinguishes confirmed business facts, user-provided claims, assumptions and suggestions. It does not guarantee reach, customers, coverage, backlinks or search ranking.
- Opportunity recommendations come only from curated records with official URL, source, rules and verification date. Stale/unknown entries are labeled or suppressed; model-generated URLs are never shown as verified opportunities.
- Converting a strategy into drafts or calendar proposals remains reversible. Directory submissions, community posts and outreach require explicit case-by-case user action and are not bulk-automated in V1.
- Tool recommendations display last-verified date, material limitations, rights/privacy caveats and affiliate/sponsorship disclosure. Commercial relationships cannot determine ranking.
- UGC recommendations require authentic participants/content, consent and usage rights, truthful incentives and endorsement disclosure. Never fabricate testimonials, creator identities or customer experiences.

### Why media generation is excluded from V1

Public product copy should explain the boundary positively and accurately:

- The app has not yet collected enough verified visual-brand, product, asset-rights, likeness and campaign context to promise brand-ready output.
- Media model capabilities, licensing, pricing, retention and safety behavior change rapidly, so tool recommendations must be dated and revisited.
- In-app generation would require additional consent, rights, disclosure, provenance, safety evaluation and cost controls.
- Users keep creative control by choosing a specialist tool and importing approved assets. The app retains provided provenance and handles adaptation, approval, publishing and measurement.

Do not imply that external tools are automatically safe or rights-cleared; show their current documented caveats and require the user's normal asset-rights declaration.

## 7. Required public legal documents

### Terms of Service

Cover:

- Entity, contact, age/capacity, account security.
- Service description and beta/availability limitations.
- User content ownership and limited license needed to host/process/publish.
- User warranties for content, rights, accounts, consent, and platform compliance.
- Third-party platforms and APIs; no guarantee of continued connector availability.
- AI output limitations and review responsibility.
- Plans, taxes/Merchant of Record, renewals, usage/overages, refunds, cancellation, failed payment, downgrade, and scheduled-post behavior after suspension.
- Acceptable Use incorporation, enforcement, appeals.
- IP ownership, feedback license, trademark use.
- Confidentiality for business plans if offered.
- Disclaimers, liability cap, indemnity, force majeure.
- Termination, export/deletion window, survival.
- Governing law, dispute mechanism, notices, changes.
- Separate terms for API/MCP/embedded and service accounts.

Do not copy Postiz's terms. Draft for the actual company/jurisdiction with counsel.

### Privacy Policy

Inventory and explain:

- Account/profile, social connections/tokens, content/media, schedules, analytics, billing references, device/log data, support, cookies, and agent/API activity.
- Purposes and legal bases.
- Social platform, Supabase, Temporal, Polar, DeepSeek, hosting/storage, email, analytics/error-monitoring, and support subprocessors.
- International transfers and safeguards.
- Retention per data class.
- User rights and request process.
- Social data deletion and token revocation.
- Security summary without dangerous detail.
- AI processing and training policy.
- Cookies/marketing choices.
- Children/minimum age.
- Contact, DPO/representative where required, changes.

### Other required pages/agreements

- Acceptable Use Policy and anti-spam rules.
- AI Use and Generated Content Policy.
- Cookie Policy and consent manager where required.
- Data Processing Addendum with SCCs/transfer terms as needed.
- Subprocessor list with change notice.
- Refund/cancellation policy aligned with Polar checkout and consumer law.
- Copyright/DMCA or local equivalent notice-and-takedown process.
- Security page and responsible disclosure policy.
- Data export/deletion and social-provider deletion instructions.
- API/MCP/Embedded Terms, rate limits, and developer policy.
- Community/UGC guidelines for comments, templates, and author content.
- Affiliate/creator terms and disclosure rules.
- Service Level Agreement only for tiers the company can operate.
- Accessibility statement.

## 8. Privacy and data lifecycle

### Data minimization

- Request only provider scopes required for currently enabled features.
- Do not ingest entire social histories merely to show analytics.
- Do not retain raw provider payloads indefinitely.
- Separate content/metrics from credentials and billing.
- Redact post content from general logs and customer-support tools.
- Make optional brand-memory sources opt-in and removable.

### Suggested retention schedule for counsel/security review

| Data | Proposed behavior |
| --- | --- |
| Active social credentials | encrypted while connection is active; revoke/delete promptly on disconnect |
| OAuth transaction state | minutes, then delete |
| Drafts/media | while account active or user-set retention; trash grace period |
| Publication receipts/audit | plan/legal retention, with content minimization and tenant export |
| Raw provider responses | shortest period needed for debugging/compliance, then minimize/delete |
| Analytics observations | plan retention and provider terms |
| Security logs | fixed period such as 30-180 days based on risk |
| Billing records | statutory/Polar/accounting retention |
| Deleted account | immediately revoke/cancel; complete deletion within published window, subject to legal backups/records |
| Backups | encrypted, access-controlled, expire on documented rotation; deletion propagates on restore process |

### User controls

- Download data in portable JSON/CSV plus media archive.
- Revoke one social connection without deleting workspace.
- Delete brand, content, media, or whole account.
- Cancel scheduled jobs before deletion.
- See active sessions, API keys, agents, webhooks, and social permissions.
- Disable/delete brand memory and optional AI history.
- Consent preferences versioned and auditable.

## 9. Security and incident obligations

Minimum program before paid launch:

- Threat model for OAuth, multi-tenancy, publishing, MCP, media, billing, and analytics.
- Independent penetration/security review focused on token leakage and cross-tenant access.
- RLS and authorization tests in CI.
- KMS envelope encryption and rotation for social tokens.
- Secrets management, least production access, MFA, device/session inventory.
- Dependency/container scanning, patch SLAs, signed build provenance where practical.
- Centralized redacted logging and anomaly alerting.
- Encrypted backups and tested restoration.
- Incident-response plan with severity, decision-makers, provider/user/regulator notification, evidence preservation, and postmortem.
- Responsible disclosure contact and safe harbor language reviewed by counsel.
- Vendor risk register and data-processing agreements.

## 10. Billing and consumer fairness

- Polar is Merchant of Record for sales tax/VAT, but our app remains responsible for truthful plan/usage presentation and service delivery.
- Public SaaS pricing is one plan: $29 monthly or $300 annually. Every shipped software feature is included in both billing intervals.
- State the 30-active-channel allowance, fair-use/anti-spam boundary, and separately metered X/provider usage directly beside the purchase action.
- State clearly that AI image and AI video generation are not included or sold in V1.
- Show total recurring price, billing interval, included allowances, variable-charge formula, and trial conversion before checkout.
- For the seven-day trial, obtain affirmative agreement to the recurring monthly or annual price, collect the payment method through Polar, show `$0 due today`, and show the exact first-charge date/amount immediately beside the start-trial action.
- Use Polar's pre-conversion reminder and retain evidence of the checkout disclosure/version. Trial cancellation must be self-service before conversion and clearly confirm that no charge will be attempted.
- Do not advertise a temporary card authorization amount such as `$2` unless Polar documents it for our actual live checkout and the statement remains true for the buyer's payment method and region.
- Obtain explicit consent for usage billing and configurable spend alerts/caps.
- Deliver receipts/invoices through Polar and surface portal access in the app.
- Cancellation must be easy and effective by the stated date.
- Publish refund rules while complying with mandatory consumer rights.
- Do not make deletion contingent on paying an invoice, except retaining lawful billing records.
- Never disconnect accounts or delete content silently on downgrade. Use read-only/over-limit states and clear options.

## 10A. Short links and click privacy

- A short-link domain is security infrastructure. Scan destinations, block unsafe schemes/private-network targets, prevent open redirects, support emergency disable, rate-limit enumeration and maintain an abuse-report channel.
- Disclose that clicking a tracked link creates first-party analytics. Minimize location/device/referrer data, classify bots, truncate or discard IP addresses promptly, and never place sensitive personal data in slugs or query parameters.
- Provide a brand/workspace opt-out and retention setting. Respect consent/cookie requirements for any non-essential tracking added beyond the redirect's security and aggregate measurement.
- Destination edits, domain verification and data exports are permissioned and audited. Historical reports must show the destination that was active at the relevant time.

## 10B. Cross-account and engagement-triggered actions

- Both source and target accounts must be connected, owned/authorized, explicitly selected and within the same approved workspace policy.
- Do not make a related company/employee account appear to be an independent customer or endorser. Require disclosure where the relationship would be material.
- Threshold reposts and CTA comments run at most once per source post by default, expire, observe cooldown/cadence controls and are rejected when the official API or provider policy does not permit the action.
- Cross-account follow-up, repost and comment actions are off by default, previewed before activation, attributable in the audit log and stoppable through a global kill switch.

## 11. Content, UGC, and endorsements

- UGC authors grant only necessary publication/license rights and retain ownership.
- Moderate illegal/abusive/IP-infringing content and provide report/appeal.
- Sponsored tutorials and affiliate links require conspicuous disclosure.
- Customer claims require written consent, exact timeframe, method, and approval of final wording.
- Do not offer incentives conditional on positive reviews or manipulate Product Hunt/store ratings.
- Comparison pages use factual, dated, sourced claims and a correction process.
- Benchmarks require sample criteria, exclusions, metric definitions, privacy thresholds, and no re-identification.

## 12. Approval checklist before enabling a connector

- Official API and policy URLs recorded with last review date.
- Production application approved or truthful beta/private limitation displayed.
- Scopes and user explanation match shipped features.
- Terms/Privacy/data deletion pages satisfy the provider review.
- Account type and feature limitations appear before OAuth and compose.
- Consent, privacy/audience, commercial/AI disclosures implemented.
- Rate/cost limits and anti-spam rules implemented.
- Disconnect/revoke/delete tested.
- Error remediation and status page implemented.
- Marketing capability matrix updated.
- Named engineering and policy owner assigned.

## 13. Legal/compliance questions the founder must decide

1. Incorporation entity and governing jurisdiction.
2. Initial customer geographies and whether EU/UK/US/India consumer users are targeted.
3. Minimum age and whether any education/minor market is excluded.
4. Data hosting regions and international-transfer mechanism.
5. Whether political, regulated-industry, adult, or crypto marketing is allowed, restricted, or prohibited.
6. Default content/analytics/audit retention and customer-configurable periods.
7. Whether the company will offer a self-hosted edition and under what license/support.
8. Whether embedded customers are controller/processor and the allocation of platform-consent responsibilities.
9. Refund/trial/grace-period rules.
10. Security/compliance roadmap such as SOC 2, ISO 27001, GDPR/UK GDPR, CCPA/CPRA, and India's DPDP Act based on actual markets.

Do not delay technical privacy/security work while these are decided. Use the most conservative proposed defaults and document the open decision.
