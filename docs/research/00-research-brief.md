# Social Publishing Platform: Research and Build Brief

Research date: 4 August 2026

This folder is the handoff for building a cleaner, safer, multilingual, agent-native alternative to Postiz. The working product name is intentionally left open.

## Executive decision

Build the product, but do not position it as "Postiz with a nicer UI." The defensible product is a trusted publishing control plane that turns a brief into platform-native content, obtains approval, publishes reliably, and learns from the result. It should work equally well from the web app, Claude, Codex, Hermes, Buzz, a CLI, or a customer's own workflow.

Recommended foundation:

- Next.js 16, React 19, TypeScript, Tailwind, Radix UI primitives, and a small custom design system.
- NestJS for the public API and connector orchestration.
- Supabase for Postgres, Auth, Storage, Row Level Security, and selected Realtime experiences.
- Temporal for durable scheduling, retries, multi-stage uploads, refresh-token workflows, and analytics collection.
- Redis for rate limiting, idempotency hot paths, short-lived locks, and caches.
- Polar as merchant of record for subscriptions, entitlements, customer portal, and usage billing.
- DeepSeek V4 Flash behind a provider-neutral AI gateway. Use the current model identifier `deepseek-v4-flash`, but keep it configurable.
- REST API, remote MCP server, CLI, webhooks, and small skills for Codex, Claude Code, and Hermes.

Supabase is the better choice than Neon for this particular product because authentication, object storage, tenant-level security, and realtime collaboration are first-class requirements. Neon remains an excellent alternative when the team wants only serverless Postgres and is prepared to assemble auth and storage separately.

## Recommended launch scope

The target connector set is X, LinkedIn, Instagram, Facebook Pages, YouTube, and TikTok. Platform approval can delay Instagram, Facebook, YouTube, and TikTok, so the operational fallback is to launch with approved connectors plus Threads and Bluesky rather than hold the entire product.

V1 must include:

- Workspace and role-based collaboration.
- Google, Facebook, email/password, email magic link, and secure username alias login.
- Social account connection and token-health monitoring.
- One excellent composer with per-platform variants and previews.
- A master draft with per-channel copy/media overrides, live platform character limits, native mention lookup, and connector-specific destinations such as communities, boards, groups, Pages, and publications where official APIs support them.
- Calendar, queue, drafts, approvals, publication receipts, and failure recovery.
- 30 content languages, with the first 12 product UI locales fully human-reviewed before expanding all UI strings to 30.
- DeepSeek-assisted writing, transcreation, accessibility, duplicate, spam, and platform-fit checks.
- A basic Growth Advisor that turns a verified business profile into a social strategy, repeatable posting plan, UGC suggestions, a reviewable launch/backlink opportunity list, and human-readable or structured JSON/YAML exports. It may create drafts/calendar proposals but never mass-submit, post, or manufacture backlinks without explicit approval.
- A curated Creative Tool Radar with official links, use-case fit, cost/rights caveats, affiliate disclosure, and `last verified` dates for fast-changing image, video, UGC, research, and automation tools.
- Media upload, library, crop, resize, compression, thumbnails, alt text, and platform validation. V1 does not generate AI images or AI videos.
- Explainable post analytics and feedback. Do not invent a universal opaque "viral score."
- REST, MCP, CLI, webhooks, scoped API keys, and an OAuth2 developer console for third-party apps.
- First-party tracked short links with click analytics, abuse protection, privacy controls, and optional branded domains.
- Polar subscriptions and usage metering. Start every paid subscription with a seven-day trial that collects a payment method at checkout, charges $0 at checkout, displays the exact conversion date, and automatically charges only if the user has not canceled.
- A useful public blog, workflow library, comparison section, and transparent benchmark methodology.

## One-plan pricing

Offer one public plan with no feature gates:

| Billing | Price | Effective monthly price |
| --- | ---: | ---: |
| Monthly | $29/month | $29 |
| Annual | $300/year | $25 |

The plan includes every shipped feature, unlimited team members, API/MCP/CLI/webhooks, customer groups, approvals, text AI, automation, analytics, and up to 30 active social channels. Publishing is unlimited for normal human/business use, subject to platform policies, abuse protection, and documented fair use.

Both billing intervals include a seven-day full-product trial through Polar. Collect the payment method when the trial starts, show `$0 due today`, show the exact first-charge date and amount, send the pre-conversion reminder, and keep cancellation self-service in Settings. Market the annual option as `$25/month billed annually` or `Save $48/year`; it is a 13.8% saving, not 20%.

X is the important exception. X currently charges per API resource and charges materially more for posts containing URLs. Managed X usage must be billed transparently at pass-through cost or through a separately purchased usage balance. Never conceal this inside an "unlimited" promise. There is no AI image/video generation charge because those generators are not part of V1.

V1 intentionally does not generate images or video. A scheduler rarely knows enough about a customer's visual identity, licensed assets, people/likeness permissions, product truth, or campaign context to generate safe brand-ready media automatically. Specialized creative models also change quickly in quality, price, rights and workflow. Our product should remain the durable planning, approval, publishing and measurement layer: recommend the best currently verified tools, accept their finished assets, preserve provenance and let the customer control creative direction.

## The files

- [01-postiz-research.md](./01-postiz-research.md): product, stack, channels, revenue, founder strategy, business model, limitations, and lessons.
- [02-development-handoff.md](./02-development-handoff.md): architecture, data model, APIs, connector contracts, security, scheduling, analytics, AI, billing, testing, and roadmap.
- [03-product-ux-and-localization.md](./03-product-ux-and-localization.md): information architecture, core flows, design system, accessibility, responsive behavior, and 30-language implementation.
- [04-marketing-and-growth.md](./04-marketing-and-growth.md): positioning, ICP, content and UGC engine, distribution, launch, partnerships, comparisons, metrics, and a 180-day plan.
- [05-trust-safety-and-legal.md](./05-trust-safety-and-legal.md): platform rules, anti-spam controls, AI-agent safeguards, privacy/security, and the required policy suite.
- [06-source-register.md](./06-source-register.md): dated primary and supporting sources used in the research.
- [07-feature-parity-and-product-behavior.md](./07-feature-parity-and-product-behavior.md): exact Postiz feature parity, observed product workflow, our one-plan entitlements, and feature acceptance criteria.

## Instructions to the developer

1. The owner will add every production key later. Commit only `.env.example` files with placeholders. Never put credentials, OAuth secrets, signing keys, or tokens in source control.
2. Expected placeholders include Supabase, Redis, Temporal, Polar, DeepSeek, encryption/KMS, email, storage, monitoring, and every social provider. The app must boot in a safe local mode when optional providers are absent.
3. Use the loaded design skills before implementing public pages. The interface must feel intentionally designed, not like an AI-generated dashboard template. Follow [03-product-ux-and-localization.md](./03-product-ux-and-localization.md).
4. Do not copy Postiz source code. Its public repository is AGPL-3.0. This brief is a clean-room product and architecture study based on public behavior, public documentation, and high-level stack inspection.
5. Build one connector contract and add platforms behind it. Do not scatter platform-specific conditionals through controllers or React components.
6. Human review, exact previews, idempotency, audit logs, and truthful failure states are product features, not cleanup work.
7. No browser automation, cookie replay, scraping, or unofficial posting endpoints to bypass official APIs or review processes.

## Go/no-go gates

Before public launch, require:

- At least four approved, production-capable connectors, including one video platform.
- 99.5% successful execution for valid scheduled posts in a 14-day controlled beta, excluding upstream platform outages and user-invalidated tokens.
- No duplicate publication in retry and failover tests.
- A complete deletion/export path for account and social data.
- Independent security review of OAuth, RLS, token encryption, webhooks, MCP authorization, and tenant isolation.
- Human-reviewed English plus the initial 11 UI locales; generated content quality evaluated in all 30 content languages.
- Published Terms, Privacy Policy, Acceptable Use Policy, AI Policy, refund rules, subprocessors, and platform-data deletion instructions reviewed by qualified counsel.
