# Postiz Deep Research

Research date: 4 August 2026. Prices, API rules, product features, and revenue change frequently. Recheck the source register before making financial or launch commitments.

## Bottom line

Postiz is no longer merely a social calendar. Its strongest current position is "agentic social publishing infrastructure": a hosted and self-hostable scheduler with more than 30 channels, a public API, webhooks, MCP, CLI, AI generation, analytics, and an embedded/white-label offer. Its growth came from open source, underserved connectors, workflow ecosystems, fast participation in agent trends, founder-led distribution, UGC partnerships, and outcome-focused articles.

The opportunity is real, but cloning features and undercutting price is insufficient. The bigger openings are reliability, platform-safe automation, multilingual transcreation, explainable feedback, clearer UX, safer agent approvals, transparent metering, and a polished embedded platform.

## Verified snapshot

TrustMRR reports Stripe-verified MRR of $182,430, 5,387 active subscriptions, and $857,737 in all-time revenue as of 4 August 2026. The user's "$200K per month" statement is directionally close, but it is not the current verified figure. TrustMRR says Postiz was founded in July 2024 and identifies Nevo David as founder.

Current hosted pricing:

| Plan | Price | Channels | Notable commercial promise |
| --- | ---: | ---: | --- |
| Standard | $29/month | 5 | unlimited posts, API, webhooks, AI copilot, 3 AI videos |
| Team | $39/month | 10 | unlimited members, 100 AI images, 10 AI videos |
| Pro | $49/month | 30 | unlimited members, 300 AI images, 30 AI videos |
| Ultimate | $99/month | 100 | unlimited members, 500 AI images, 60 AI videos |

There is a seven-day hosted trial and a free self-hosted route. In the observed hosted checkout, Postiz collects a card up front, shows `$0` due at checkout, displays the future conversion date and supports cancellation from settings. Its checkout copy also mentions a temporary authorization hold; that is Postiz/payment-processor-specific and should not be assumed for Polar. The pricing page also promotes scheduled comments, repeats, delays, posting sets, signatures, RSS posting, analytics, customer groups, internal/global "plugs," and a Smart Agent.

The official walkthrough and supplied screenshots clarify additional behavior: one global draft can fan out to selected accounts; each channel can override copy, media and formatting; live platform limits and native previews are visible; LinkedIn company mentions and X community destinations are supported in the demonstrated flow; ordered first comments/thread parts can have individual delays; Sets can preserve target groups/defaults; engagement thresholds can trigger reposts or CTA comments; links can be shortened and clicks measured; and the Agent can clarify a request before placing normal scheduled drafts. A developer modal also exposes OAuth app registration so third-party products can obtain user-authorized credentials across API, MCP and CLI surfaces.

Postiz's enterprise page advertises white-label/headless scheduling tiers from $200 for 200 channels to $8,000 for 20,000 channels, but currently says applications are not being accepted. That indicates demand for embedded infrastructure and leaves room for an alternative that is available, documented, and usage-based.

## Platform coverage

The public product pages and official documentation advertise providers including:

- Mainstream: X, LinkedIn profiles and Pages, Instagram, Facebook Pages, YouTube, TikTok, Threads, Pinterest, Reddit.
- Open/decentralized: Bluesky, Mastodon/custom Mastodon, Nostr, Farcaster/Warpcast, Lemmy.
- Communities and chat: Discord, Slack, Telegram, Skool, Whop, MeWe.
- Publishing/CMS: WordPress, Medium, Dev.to, Hashnode, Tumblr, Listmonk.
- Regional/creator: VK, Kick, Twitch, Dribbble, Google Business Profile, and other smaller providers.

The number of icons is not the same as depth. For every competitor comparison, test these independently: content types, account types, preview accuracy, drafts versus direct publish, first comment/thread support, analytics fields, historical window, token refresh, rate limits, and production approval.

## Product surfaces

Postiz exposes the same core workflow through several surfaces:

- Visual web composer and calendar.
- Public REST API and webhooks.
- MCP server for Claude, ChatGPT/Codex-compatible clients, Cursor, and other MCP clients.
- Agent-focused CLI.
- RSS and automation integrations.
- Self-hosted open-source application.
- White-label/embedded social scheduling.

Its MCP documentation currently exposes eight tools and can list integrations, discover provider schemas, schedule posts, and generate media. The public messaging emphasizes keeping a human in the loop. That is a good baseline, though our design should use finer scopes and explicit risk-based approvals.

## Independent architecture lesson

Nevo David publicly described moving from a Redis queue to Temporal as one of the best technical decisions in Postiz's growth. This is consistent with the domain: scheduled social publishing needs persistent timers, retries, idempotency, human pauses, refresh-token recovery, platform-specific media processing, and long-running analytics collection. A basic cron table is not enough for the reliable product we want.

## License and clean-room warning

Postiz is AGPL-3.0. Post Array must not inspect, copy, adapt, translate, or otherwise derive implementation details from its source. Product behavior may be studied only through public product surfaces, user-supplied observations, official Postiz documentation, and official social-provider documentation. Post Array's architecture, data model, interface contracts, and code must remain independently designed. Have counsel review any proposal to incorporate AGPL components.

## Business model

Postiz has several reinforcing revenue and acquisition layers:

1. Hosted subscriptions priced mainly by connected channels.
2. Self-hosted open source as trust, distribution, contribution, and developer acquisition.
3. AI images/videos and agent features bundled into paid tiers.
4. API, webhook, MCP, CLI, and workflow integrations that make it infrastructure rather than a periodically opened dashboard.
5. Paid help with self-hosting and difficult social-app approval.
6. White-label/embedded capacity sold to other SaaS businesses.
7. Content and partner ecosystems that demonstrate outcomes rather than promote scheduling alone.

The subscription weakness is also public: at about $20K MRR the founder disclosed roughly 17% churn. When people stop publishing, they stop paying. Workflow and embedded use cases reduce this because the product becomes a recurring part of another system.

## Founder-led marketing playbook

Nevo David has described the progression publicly across Reddit, LinkedIn, podcasts, and product content.

### 0 to roughly $3K MRR: open source as distribution

- Invested in a strong GitHub README, public issues, documentation, and contributor friendliness.
- Distributed into self-hosting communities such as Reddit's self-hosted audience and Lemmy.
- Benefited from contributors, testers, articles, backlinks, and GitHub discovery rather than only direct developer revenue.

### Roughly $3K to $10K MRR: underserved networks and workflows

- Added connectors for communities ignored by mainstream schedulers, including web3, Reddit, education/community products, and decentralized networks.
- Recognized that n8n videos and templates sold a result while Postiz served as the final publish step.
- Built official workflow nodes and supported Make/Zapier-style automation.
- Partnered with owners of workflow communities and gave lifetime access in return for genuine tutorials/templates.

### Roughly $10K to $20K MRR: SEO, directories, attribution, and media

- Listed in relevant directories, GitHub "awesome" lists, TrustMRR, Product Hunt, and automation marketplaces.
- Produced free tools, tutorials, and high-frequency blog content.
- Used attribution products to learn which pages and tools led to purchases.
- Founder says influencer attempts on X/TikTok were expensive and did not convert well at that stage.
- Product Hunt launch history includes a number-one weekly result in November 2024.

### Agent wave: MCP, OpenClaw, skills, and outcomes

- Shipped MCP, CLI, and skills quickly when agent ecosystems accelerated.
- Listed into agent directories and marketplaces and created educational agent workflows.
- A partner article describing how to make money using the workflow reportedly reached millions of views and drove daily MRR growth.
- Shifted positioning from "many-network scheduler" to outcomes such as getting views with an automated content system.
- Used long-form X articles and paid collaborations with smaller accounts to increase reach.

### What should not be copied blindly

- High-volume AI SEO can damage trust. The founder himself has referred to some output as sloppy. Our editorial standard must require evidence, original examples, and named human review.
- Scraped lead lists, warmed alternate domains, and aggressive outreach create privacy, deliverability, and brand risk. Use consent-based partnerships and targeted, compliant outreach.
- Lifetime deals are useful selectively but can create permanent support liabilities. Prefer time-bounded founding pricing.
- Coordinated engagement or automatic repost/comment "plugs" can violate platform manipulation rules. We should not ship engagement farming.
- Chasing every hype cycle can create connector sprawl and reliability debt. Adopt emerging platforms through a connector scorecard, not instinct alone.

## What Postiz does well

- Strong breadth of connectors and self-hosting story.
- Agent, API, CLI, and workflow surfaces beyond the dashboard.
- Fast response to emerging ecosystems.
- A durable scheduler architecture using Temporal.
- Outcome-oriented case studies and ecosystem partnerships.
- Attractive channel-per-dollar ratios at higher tiers.
- Transparent founder-led growth that compounds brand discovery.

## Where we can be better

1. **Trustworthy automation:** previews, platform policy checks, cadence limits, approval policies, signed publication receipts, and no engagement manipulation.
2. **Connector quality over icon count:** publish capability matrices, incident history, token health, and status by feature.
3. **Multilingual depth:** UI localization, platform-native transcreation, brand glossaries, regional variants, RTL, and language-specific analytics.
4. **Outcome feedback:** compare experiments, explain metric definitions, identify observed patterns, and recommend the next test without pretending correlation is causation.
5. **Agent governance:** scoped service accounts, dry runs, drafts, configurable approvals, idempotency, audit logs, and bulk-action thresholds.
6. **Cleaner UX:** one composer, progressive disclosure, keyboard support, visible time zones, calm failure recovery, and clear account/variant relationships.
7. **Transparent economics:** standard publishing allowances plus clearly metered X/AI-media costs instead of ambiguous unlimited claims.
8. **Content provenance:** source-backed drafts, claim checks, AI disclosure reminders, accessibility checks, and consent-based brand memory.
9. **Open ecosystem without giving away the entire product:** open-source the connector SDK, MCP schemas, examples, and CLI while keeping the managed control plane proprietary initially.
10. **Available embedded product:** documented SDK/components, sandbox accounts, usage billing, tenant isolation, and an actual onboarding path.
11. **Strategy before scheduling:** a basic Growth Advisor that turns verified business context into channel priorities, content pillars, a sustainable four-week plan, UGC brief and measurable experiments—not merely more generated captions.
12. **Curated discovery, not backlink spam:** verified promotion opportunities and regularly reviewed creative-tool recommendations with dates, rules, caveats and disclosure; no invented URLs, automated directory submissions or guaranteed rankings.

## Strategic conclusion

Postiz validated demand and proved that a small company can win in a crowded category by changing the distribution and interface. The best route is not to out-Postiz Postiz on raw connector count immediately. Win the first 1,000 paying customers on safe agent publishing, multilingual quality, reliability, and a genuinely easier workflow. Then compound through the same infrastructure surfaces that reduce churn: API, MCP, CLI, workflows, and embedded scheduling.
