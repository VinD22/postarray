# Source Register

Research date: 4 August 2026. Primary/official sources are preferred. Founder statements and third-party revenue data are labeled rather than presented as platform guarantees.

## Postiz product, pricing, and business

Clean-room boundary: do not use the Postiz repository, package manifests, deployment files, schemas, or implementation source as research inputs. Competitor research is limited to public product behavior, user-supplied observations, official product documentation, and public business statements.

| Source | Type | Used for |
| --- | --- | --- |
| [Postiz pricing](https://postiz.com/pricing) | Official product page | Current plans, channel counts, AI allowances, trial, features, self-hosting, app-approval comments, platform list |
| [Postiz homepage and embedded demo](https://postiz.com/) | Official product page | Agentic/normal scheduling positioning, major app surfaces, workflow integrations, automation and analytics messaging |
| [Postiz demo video](https://www.youtube.com/watch?v=BdsCVvEYgHU) | Official linked demo | Public demonstration entry point linked by Postiz |
| Eight user-supplied Postiz screenshots and timestamped walkthrough summary, reviewed 4 August 2026 | First-party product observation supplied for this brief | Signup, pricing/trial checkout, channel/team FAQ, developer OAuth app, global/per-channel composer, delayed comments, agent navigation and selected-channel behavior; screenshots are evidence, not reusable design assets |
| [Postiz enterprise/white-label](https://postiz.com/enterprise) | Official product page | Embedded scheduling offer and current capacity tiers/availability |
| [Postiz MCP introduction](https://docs.postiz.com/mcp/introduction) | Official docs | MCP clients, tool count, agent scheduling capabilities |
| [Postiz provider overview](https://docs.postiz.com/providers/overview) | Official docs | Provider architecture and documented connectors |
| [Postiz terms](https://postiz.com/terms-of-service) | Official legal page | Competitor policy context only; not a template |
| [TrustMRR Postiz profile](https://trustmrr.com/startup/postiz) | Third-party, Stripe-verified display | MRR, active subscriptions, all-time revenue, founder, date updated |

## Founder strategy and supporting history

| Source | Type | Used for |
| --- | --- | --- |
| [How I reached $20K MRR with my social media scheduler](https://www.reddit.com/r/SaaS/comments/1r3vr6w/how_i_reached_20k_mrr_with_my_social_media/) | Founder-authored Reddit post | Churn disclosure, open-source acquisition, underserved channels, n8n partnerships, directories, outreach, agent waves, embedded strategy |
| [Scaling Postiz from 0 to 100K MRR](https://www.linkedin.com/posts/nevo-david_mrr-journey-activity-7458738241517785088-oHl2) | Founder-authored LinkedIn post | Growth stages, Redis-to-Temporal move, agent/OpenClaw distribution, outcome positioning, article strategy |
| [Product Hunt Postiz product page](https://www.producthunt.com/products/postiz) | Product directory/history | Launch history; recheck canonical page at time of marketing use |
| [Revenue jumped when he sold to AI agents](https://podcasts.apple.com/us/podcast/revenue-jumped-when-he-sold-to-ai-agents/id1844721500?i=1000754686713) | Founder interview listing | Shift toward agent buyers and infrastructure positioning |
| [Postiz agentic marketing stack article](https://postiz.com/blog/agentic-marketing-stack-claude-code-postiz) | Official company content | Current outcome-based agent content strategy |
| [Postiz AI video clipping workflow](https://postiz.com/blog/ai-video-clipping-agent-postiz-stack) | Official company content | API/MCP/CLI as shared publishing surface and media workflow messaging |

Founder-reported traffic, impressions, MRR stages, and conversion results are useful strategic evidence but are not independently audited unless the row specifically references TrustMRR.

## Supabase and Neon

| Source | Type | Used for |
| --- | --- | --- |
| [Supabase Auth overview](https://supabase.com/docs/guides/auth) | Official docs | Password, magic link/OTP, social, SSO capabilities |
| [Supabase social login](https://supabase.com/docs/guides/auth/social-login) | Official docs | Supported OAuth login providers and provider-token caveat |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | Official docs | RLS requirements and policy patterns |
| [Supabase Storage](https://supabase.com/docs/guides/storage) | Official docs | Managed object storage capability |
| [Supabase Queues](https://supabase.com/docs/guides/queues) | Official docs | Postgres-native durable queue option and limits of our recommended use |
| [Supabase Cron](https://supabase.com/docs/guides/cron) | Official docs | Scheduled database jobs; contrasted with Temporal for publishing workflows |
| [Supabase changelog](https://supabase.com/changelog) | Official current changelog | Node support, Data API grants/exposure, OAuth changes, current platform changes |
| [Neon pricing](https://neon.com/pricing) | Official product page | Current serverless Postgres, autoscaling, branching, auth/MAU and price positioning |
| [Neon branching](https://neon.com/docs/introduction/branching) | Official docs | Database branch strength |

## Polar billing

| Source | Type | Used for |
| --- | --- | --- |
| [Polar Merchant of Record](https://polar.sh/docs/merchant-of-record/introduction) | Official docs | MoR responsibilities and tax handling |
| [Polar fees](https://polar.sh/docs/merchant-of-record/fees) | Official docs | Current percentage/fixed and international-card fees |
| [Polar subscriptions](https://polar.sh/docs/features/subscriptions/introduction) | Official docs | Subscription products and lifecycle |
| [Polar trials](https://polar.sh/docs/features/subscriptions/trials) | Official docs | Payment method collected up front, deferred first charge, automatic conversion, trial reminders, cancellation and repeat-trial abuse prevention |
| [Polar webhook events](https://polar.sh/docs/integrate/webhooks/events) | Official docs | Subscription/order lifecycle and verified event handling |
| [Polar customer portal](https://polar.sh/docs/features/customer-portal/introduction) | Official docs | Hosted billing-management surface |
| [Polar usage-based billing](https://polar.sh/docs/features/usage-based-billing/introduction) | Official docs | Usage meters/events/overages |
| [Polar with Next.js](https://polar.sh/docs/guides/nextjs) | Official docs | Checkout and webhook integration pattern |

## DeepSeek

| Source | Type | Used for |
| --- | --- | --- |
| [DeepSeek API changelog](https://api-docs.deepseek.com/updates/) | Official docs | V4 Flash/Pro release, model identifiers, legacy model retirement |
| [DeepSeek model list](https://api-docs.deepseek.com/api/list-models) | Official docs | `deepseek-v4-flash` and `deepseek-v4-pro` identifiers |
| [DeepSeek models and pricing](https://api-docs.deepseek.com/quick_start/pricing) | Official docs | Current context, features, and token pricing; recheck before financial decisions |
| [DeepSeek V4 release](https://api-docs.deepseek.com/news/news260424/) | Official announcement | V4 capability and API compatibility claims |

## X

| Source | Type | Used for |
| --- | --- | --- |
| [X API pay-per-use pricing](https://docs.x.com/x-api/getting-started/pricing) | Official docs | Current read/create/URL-create/webhook prices |
| [Create a post](https://docs.x.com/x-api/posts/create-post) | Official docs | OAuth modes, create fields, and rate-limit guidance |
| [X automation rules](https://help.x.com/en/rules-and-policies/x-automation) | Official policy | Consent, duplicate content, replies, opt-out, spam/manipulation restrictions |
| [X developer guidelines](https://docs.x.com/developer-guidelines) | Official policy/docs | Official API use and developer behavior |

## LinkedIn

| Source | Type | Used for |
| --- | --- | --- |
| [LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03) | Official Microsoft/LinkedIn docs | Supported post/media types, permissions, version headers |
| [Community Management app review](https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review?view=li-lms-2026-01) | Official docs | Business verification, demo and review requirements |
| [Community Management overview](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview?view=li-lms-2026-02) | Official docs | Current product access and member-read restrictions |
| [LinkedIn rate limits](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits) | Official docs | Application/member limits and Developer Portal visibility |

## Meta: Instagram, Facebook, and Threads

Meta documentation was intermittently rate-limited during research. Reopen and save the exact live versions before implementation/review.

| Source | Type | Used for |
| --- | --- | --- |
| [Instagram content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) | Official docs | Professional-account publishing flow and media containers |
| [Official Meta Instagram Postman collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) | Official Meta collection | Supported account/content constraints and examples |
| [Facebook Pages API posts](https://developers.facebook.com/docs/pages-api/posts/) | Official docs | Page publishing |
| [Official Meta Facebook Postman workspace](https://www.postman.com/meta/facebook/overview) | Official Meta collection | Facebook API request reference |
| [Official Meta Threads Postman collection](https://www.postman.com/meta/threads/documentation/dht3nzz/threads-api) | Official Meta collection | Threads OAuth, containers, content types, insights |
| [Meta business verification](https://developers.facebook.com/docs/development/release/business-verification/) | Official docs | App/business review context |

## YouTube/Google

| Source | Type | Used for |
| --- | --- | --- |
| [YouTube Data API getting started](https://developers.google.com/youtube/v3/getting-started) | Official docs | API, OAuth, quota fundamentals |
| [YouTube videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) | Official docs | Upload scope, private-only unaudited projects, current quota/call details |
| [YouTube API Services policies](https://developers.google.com/youtube/terms/developer-policies) | Official policy | Audit, privacy, revocation/deletion, quota sharding and data restrictions |
| [YouTube spam/deceptive-practices policy](https://support.google.com/youtube/answer/2801973) | Official policy | Repetitive/mass-produced/spam content restrictions |
| [YouTube altered/synthetic content disclosure](https://support.google.com/youtube/answer/14328491) | Official help/policy | AI/synthetic disclosure requirements |

## TikTok

| Source | Type | Used for |
| --- | --- | --- |
| [Content Posting API: get started](https://developers.tiktok.com/doc/content-posting-api-get-started/) | Official docs | Login Kit, scope, app approval requirements |
| [TikTok Content Sharing guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/) | Official policy/docs | Unaudited restrictions, user caps, creator-info/consent/privacy UI, commercial/music declarations, watermarks, verified URL domains |
| [TikTok developer guidelines](https://developers.tiktok.com/doc/our-guidelines-developer-guidelines/) | Official policy | Review and platform behavior |

## Codex, Claude, MCP, Hermes, Buzz, NotebookLM, and Higgsfield

| Source | Type | Used for |
| --- | --- | --- |
| [OpenAI: MCP integrations](https://learn.chatgpt.com/docs/extend/mcp.md) | Official OpenAI docs | Codex/ChatGPT MCP transport/auth configuration context |
| [OpenAI: build an MCP server](https://developers.openai.com/plugins/concepts/mcp-server) | Official OpenAI docs | Production MCP design and OAuth guidance |
| [OpenAI: plan your tools](https://developers.openai.com/plugins/plan/tools) | Official OpenAI docs | Tool granularity, side effects, descriptions and safe design |
| [OpenAI: skills](https://developers.openai.com/plugins/concepts/skills) | Official OpenAI docs | Skill distribution/workflow guidance |
| [Claude MCP overview](https://docs.claude.com/en/docs/mcp) | Official Anthropic docs | Claude MCP surfaces |
| [Claude Code MCP setup](https://docs.anthropic.com/en/docs/claude-code/mcp) | Official Anthropic docs | stdio/SSE/HTTP transports, OAuth, scopes and CLI setup |
| [Hermes Agent repository](https://github.com/NousResearch/hermes-agent) | Official open-source project | MCP integration, skills, cron, gateway, OpenClaw migration and MIT license |
| [Block Buzz repository](https://github.com/block/buzz) | Official open-source project | Agent-first CLI, ACP harness, workflow/webhook, signed event, approval roadmap and Apache-2.0 license |
| [Gemini Notebook Enterprise API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks) | Official Google Cloud docs, pre-GA | Current create/get/list/delete/share notebook management API and lack of documented general chat/query endpoint |
| [NotebookLM help](https://support.google.com/notebooklm/answer/16164461) | Official Google help | Consumer/workspace product context |
| [Higgsfield official TypeScript SDK](https://github.com/higgsfield-ai/higgsfield-js) | Official open-source SDK | Programmatic creative-provider adapter feasibility |
| [Higgsfield CLI/MCP](https://higgsfield.ai/cli) | Official product page | Agent surfaces and supported clients |

## Chrome Web Store

| Source | Type | Used for |
| --- | --- | --- |
| [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies) | Official policy | Safety, honesty, privacy, quality, technical requirements |
| [Detailed Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies/policies) | Official policy | Bots not featured, confirmation before messaging, single purpose, spam, listings, remote-code constraints |
| [Chrome Web Store user data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq) | Official policy guidance | Limited use, privacy policy, minimum permissions |
| [Chrome Web Store Developer Agreement](https://developer.chrome.com/docs/webstore/program-policies/terms) | Official agreement | No unauthorized access/circumvention and developer obligations |

## Growth-opportunity and creative-tool catalogs

The owner will add candidate opportunity/tool links later. Do not let the model fill the absence with plausible-looking URLs. Each record must pass editorial verification before it can be recommended:

- Canonical official URL and organization/product owner.
- Opportunity/tool category, audience, geographic/language fit and supported workflow.
- Current submission/community/self-promotion rules or tool documentation.
- Pricing/fees and whether a listing, placement or recommendation is sponsored/affiliate.
- Rights, privacy, retention and commercial-use caveats for creative tools.
- Reviewer, retrieved date, source snapshot/hash where permitted, last verified, next review and retired/replaced state.

High-impact/fast-changing tool records should be reviewed weekly and all active records monthly. Opportunity records are rechecked before showing a submission brief and immediately after a rejection/rule change. Customer-visible AI output cites only active verified catalog IDs and displays the verification date.

## Recheck schedule

- Before each connector starts: official API, permissions, pricing, rate limits, review, content policy.
- Before public beta: every row above plus Postiz/competitor pricing and capabilities.
- Monthly after launch: platform API/policy changelogs and DeepSeek/Polar pricing.
- Quarterly: competitor plans, revenue claims, directory/community rules, legal/subprocessor documents.
- Immediately: any provider rejection, enforcement notice, SDK deprecation, or unexplained publish/analytics change.

Use a tracked source record in the product repository with URL, retrieved date, policy/API version, owner, affected code/features, and next review date.
