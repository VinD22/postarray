# PostBridge Public Product Research

Research date: 10 August 2026. This is a clean-room, public-behaviour research note for planning only. It does not authorize copying PostBridge code, designs, copy, terms, or technical implementation. Every externally verifiable claim below is tied to a first-party source in the citation ledger. The user-supplied video summary is separately labeled as an observation.

## Research result at a glance

PostBridge publicly documents a compact social cross-posting product with one composer and platform/account overrides, scheduled, instant, draft and queue-based posting, media upload, basic post analytics, an API, and ten named publishing targets. Its public support material also documents several platform-native controls: Instagram Reel covers and trial reels, Instagram/Facebook Stories, YouTube titles/descriptions/thumbnails and synthetic-media disclosure, TikTok drafts and AI-content labeling, X first comments, Pinterest boards/title/link, LinkedIn document titles, Threads placement, and Google Business CTA/language fields. [PB-API]

The strongest safe product decision is feature *parity in user outcomes*, implemented through Relay's existing tenancy, authorization, validators, RLS, Temporal workflows, approval and immutable-receipt rules. Do not replicate PostBridge’s presentation, user-visible text, technical schema, or unsafe suggestions in its help articles. In particular, Relay must retain its no-duplicate-publication controls, never advise users how to evade platform duplicate detection, and must report unavailable provider data as `unavailable`, not `0`. [PB-DUPLICATES]

## Verified public feature inventory

### Core publishing workflow

| Capability | What the public sources establish | Planning consequence for Relay | Evidence |
| --- | --- | --- | --- |
| Connect accounts | Connections use the platforms’ OAuth login/consent flows; PostBridge says it does not receive social-password credentials and access can be revoked. | One normalized connection model with OAuth/PKCE where supported, encrypted provider credentials, scope recording, health/re-auth state, workspace authorization, audit events and revocation. | [PB-OAUTH] |
| One-to-many composition | Content is created once and sent to selected connected accounts. Public API documentation describes default content, platform overrides and account overrides, with the most specific override winning. | A canonical campaign/master version plus independently editable target variants. Show inheritance/override state, run capability validation per target and do not silently discard incompatible fields. | [PB-CROSSPOST], [PB-API] |
| Schedule, publish now and drafts | The API accepts an ISO scheduled time; no time means immediate publishing; `is_draft` prevents processing until updated. | Store ISO instant plus IANA time zone, schedule in Temporal, preserve idempotency keys, and make a user confirm DST-sensitive local times. | [PB-API] |
| Queue scheduling | The API documents a next-available queue-slot option, including a supplied or saved time zone. | Implement a workspace/project posting queue with explicit slot rules, preview, pause, audit and DST behavior. This is a separate schedule mode from a fixed date/time. | [PB-API] |
| Media lifecycle | API upload uses a media record and short-lived signed upload URL. Its public API says unused media expires after 24 hours and media is deleted after publish or scheduled-post deletion. | Use private object storage, antivirus/media validation, lifecycle rules, durable media references and deletion receipts. Relay must decide its own retention policy and make it visible. | [PB-API] |
| Post state visibility | The API exposes `posted`, `scheduled`, `processing`, and `failed` states plus per-target result information. | Relay’s richer campaign/target state model must retain per-target receipts, provider URL/ID, error category and retry history. A multi-target outcome must be allowed to be partial success. | [PB-API] |
| Basic analytics | PostBridge’s API has post analytics endpoints and documents sync for TikTok, YouTube and Instagram. | Normalize metric definitions and freshness. Do not imply analytics for every connector; label unsupported or unimplemented metrics clearly. | [PB-API] |
| Developer API | PostBridge documents Bearer API keys, social-account lookup, signed media upload, post CRUD and analytics. Its support article says this is a paid add-on. | Relay’s REST API, MCP and CLI must call the same application services as the web app, with workspace scope, OAuth/token grants, idempotency and approval enforcement. | [PB-API], [PB-API-ADDON] |
| Affiliate programme | The support centre documents an affiliate portal and referral tracking/marketing materials. | A future referral system needs its own terms, consent/disclosure, fraud and refund-hold rules, and an immutable attribution/commission ledger. It is not a publishing-core prerequisite. | [PB-AFFILIATE] |

### Named publishing targets

The official API reference lists: X/Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Bluesky, Threads and Google Business. It states Google Business V1 is text or one image to one connected location. [PB-API]

| Target | Publicly documented PostBridge-specific behavior worth matching in outcome | Relay implementation boundary |
| --- | --- | --- |
| X/Twitter | Caption/media override; first-comment/reply option. The API documentation says links in the main caption are stripped to avoid the provider’s URL cost, while links are allowed in the first comment. | Do not silently strip customer content. Model provider cost/constraint preflight and ask for an explicit action. Use official X APIs only and present first-comment publishing as a separate idempotent side effect. |
| Instagram | Caption/media override; custom Reel cover; Story placement; trial-Reel fields and people tags. Stories need exactly one item and no caption/carousel/cover. | Separate media/type/placement validators and an account-capability check. Trial Reel availability is provider/account dependent and must be `unsupported` or `not_implemented` until officially verified. |
| Facebook | Caption/media override and Page Story placement; Stories need exactly one image/video with no caption or carousel. | Distinguish Page identity from personal profile and validate one-item Story constraints before scheduling. |
| LinkedIn | Caption/media override and a document title for PDF posts. | Implement only after the required provider permissions/review pass; preserve exact organization/member identity and media constraints. |
| TikTok | Caption/media/title override; cover timestamp; save-to-draft mode; a creator-supplied AI-content label. PostBridge says a Business account is required to connect. | Verify current TikTok approval, audit and consent requirements against official TikTok documentation immediately before building. Never infer Business-account eligibility from the competitor alone. |
| YouTube | Caption/media/title override; synthetic-media disclosure; regular-video thumbnail behavior. Its support material says Shorts cannot be linked to long-form video through the API. | Model title, description, privacy, thumbnail and disclosure fields separately. Provider limitations belong in the capability matrix and UI, never as fabricated controls. |
| Pinterest | Caption/media override, board IDs, link, title and video-cover timestamp. | Require a selected board and preflight title/link/media requirements using current official provider docs. |
| Bluesky | Caption/media override; support centre has a dedicated video-posting article. | Build against the provider’s current official API; test video/media constraints and preserve records per target. |
| Threads | Caption/media override and a documented location setting (`reels` or `timeline`). | Ship only after current Meta permissions and current post-placement capabilities are verified. |
| Google Business Profile | Caption/media override, CTA action/URL and BCP-47 language field; one location per connection, text or one image in the documented V1. | This is the clearest immediate bridge to localized publishing. Localize content/metadata per market, but use one controlled locale field from a validated language list. |

The exact fields in the table are public product behaviour, not an endorsement of the competitor’s underlying API contract. Relay must define independent contracts in `packages/contracts` and maintain provider capability records per connector. [PB-API]

### Other documented limits and policy-sensitive behaviour

- PostBridge says a user may connect multiple accounts, but that the number varies by plan. Its support article lists 5, 15 and unlimited-account plans and a 100 uploads/posts-per-hour rate limit. Those exact commercial limits are not a Relay recommendation. [PB-ACCOUNT-LIMITS]
- Its public documentation is internally inconsistent: the account-capabilities article says same-platform accounts can post simultaneously, while its posting-limits article says one account per platform per post. Treat neither as a specification. Relay must apply the current official provider policy, a content/target risk check and its own abuse controls, and must never recommend filename, metadata or file edits as a way to evade provider duplicate/spam controls. [PB-ACCOUNT-LIMITS], [PB-DUPLICATES]
- PostBridge documents MP4/MOV video and JPG/PNG image handling, 3–300 second video length, max 8 MB per image and up to 35 images. Relay should set and expose its own connector-aware limits rather than inheriting these figures. [PB-MEDIA-LIMITS]
- Its current support navigation has dedicated articles for carousel posts, video covers, YouTube Shorts/titles, TikTok drafts, trial Reels, Threads/X thread limitations and Bluesky video posting. Retrieved article content establishes that its X/Threads scheduler does not create multi-post threads, and that a YouTube Short cannot be linked to a long-form video through its product because the provider API lacks that function. Those are explicit capability boundaries, not omissions to hide in Relay’s interface. [PB-HELP-CENTRE], [PB-NO-THREADS], [PB-SHORT-LINK]

## User-supplied demo observation

The supplied YouTube URL is an official Jack Friks video, **“how to use post bridge! (social media scheduler demo)”**, 147 seconds long and published 30 January 2026. [PB-YOUTUBE]

The user’s timestamped summary should be treated as a product observation to validate during hands-on QA, not as an external source claim. It describes account selection and “remember for next time,” custom covers, per-platform captions, date/time scheduling, calendar/weekly/filter views, and a bulk-upload tool. The first four align with public documentation or public API reference; calendar/weekly views and bulk upload need a logged-in product inspection or a public first-party source before they become a parity commitment.

## Pricing, legal, content and marketing research

### Pricing and account packaging

The public support centre currently documents account-count boundaries of Starter 5, Creator 15 and Pro unlimited, and says the API add-on is $5/month in addition to an active subscription. [PB-ACCOUNT-LIMITS], [PB-API-ADDON]

The main PostBridge pricing page could not be retrieved in this research pass because the site returned a Vercel challenge. Therefore, do not treat any third-party price table, historical video price, trial length, plan feature or “free tier” claim as current pricing. Relay’s desired commercial model, including its base-plan project allowance, is a product decision and must be defined independently with dated pricing copy.

### Terms, privacy and security

PostBridge’s Help Centre states it uses OAuth rather than passwords, supports disconnection/revocation and uses official provider OAuth APIs. It also says its servers are US based. [PB-OAUTH], [PB-SERVERS]

Current PostBridge Terms of Service and Privacy Policy were **not verified**: neither a canonical first-party legal URL nor its legal text was retrievable/indexed in the sources checked. Do not model Relay’s legal documents from competitor wording. Relay needs original, counsel-reviewed Terms, Privacy Notice, Data Processing Addendum, acceptable-use/publishing policy, subprocessor list, retention/deletion schedule, cookie notice and accessibility statement.

### SEO, AEO and blog presence

No current first-party PostBridge blog index, current SEO keyword set, AEO playbook, or free-tools index was verified from accessible public sources. The main marketing domain was protected by a bot challenge and the public Help Centre is product support rather than a marketing/blog corpus. This means the instruction to reuse its “same SEO keywords” cannot be performed responsibly from this evidence.

Build Relay’s acquisition program from owned, original content rather than copied keywords or competitor copy:

1. Create a keyword-source register: Google Search Console, paid/owned keyword research, customer interview language, search-intent evidence, locale, page owner, last verified date and cannibalization decision.
2. Publish original, localized, answer-first product pages, comparison methodology, connector guides, API/MCP/CLI examples, provider-limit explainers, templates and genuinely useful calculators/checkers. Do not create thin translated doorway pages.
3. Give every public page a localized canonical/alternate strategy, structured data only where it accurately represents the page, author/reviewer and update date, source citations for changing provider facts, and measurable conversion events.
4. Treat the 15-locale rollout as: core product/English content and semantic message keys first; then locale-specific translation, terminology review, hreflang/canonical QA, pseudo-locale/RTL testing, localized metadata and localized structured-data QA. Never claim a locale is supported until content and product UX are actually available.
5. Maintain an editorial calendar and change-monitoring process; recheck provider and pricing claims before every publication. “AI SEO” is not a substitute for first-hand expertise, evidence, editorial accountability, accessibility or useful tools.

### Founder and public marketing statements

The official demo identifies its channel owner as Jack Friks. A searchable interview transcript attributes the product’s origin to Friks’ own need to cross-post mobile-app marketing content and his preference for a simple tool; it is useful contextual material but is not an official PostBridge product guarantee. [PB-YOUTUBE], [PB-FOUNDER-INTERVIEW]

One direct public `@jackfriks` X announcement dated 28 February 2026 says PostBridge MCP is live and mentions scheduling through Claude. This establishes a founder-announced MCP capability only. It is not evidence of an SEO/AEO strategy, pricing, product completeness or performance result. No broad X timeline/corpus was reliably retrievable, and Jack Friks’ formal CEO title was not verified. Capture exact public post URLs, timestamps and text only when a statement is needed for an attribution. [PB-FOUNDER-X]

## Verification gaps before implementation lock

| Gap | Why it matters | Required evidence / owner |
| --- | --- | --- |
| Current PostBridge main-site price, trial and plan entitlements | Avoid building against historical pricing or a competitor’s transient packaging. | Product owner: manual browser capture of current pricing page, date/time, billing interval and checkout disclosures. |
| All public free tools | No accessible first-party index was found. | Growth owner: record canonical URLs, purpose, input/output, auth, indexing state and screenshot. Do not assume there are any. |
| Legal/terms/privacy wording | Legal obligations cannot be inferred from support articles. | Legal owner: retrieve current canonical first-party documents only for competitive comparison, then author original Relay policies. |
| Current logged-in UI features | Calendar views, “remember targets,” bulk upload and Content Studio detail are not fully established by accessible docs. | Product QA: authorised, non-destructive walkthrough with a checklist and screen/state inventory. |
| Exact platform capability/permission limits | Competitor docs can lag providers and can be incomplete. | Connector owner: revalidate each feature with the official provider API/policy, app-review requirements and recorded test fixtures before implementation. |
| Founder X/YouTube marketing corpus | Needed only if the marketing plan claims a founder tactic or quote. | Growth owner: capture direct public posts/videos and label first-party versus commentary. |

## Citation ledger

All links retrieved 10 August 2026 unless noted. First-party PostBridge, its hosted Help Centre, official API reference, and YouTube video metadata are primary sources. The interview is explicitly labeled contextual/secondary.

| ID | Source | Type | Claims used |
| --- | --- | --- | --- |
| PB-API | [PostBridge API reference](https://api.post-bridge.com/reference) | Official API documentation | API keys, upload flow, post/analytics operations, status model, platform list, overrides, per-platform settings, queue and documented media lifecycle. |
| PB-API-ADDON | [API overview, access and pricing](https://support.post-bridge.com/api/post-bridge-api-overview-access-and-pricing) | Official Help Centre | Active subscription requirement and stated $5/month API add-on. |
| PB-HELP-CENTRE | [PostBridge Help Centre](https://support.post-bridge.com/) | Official Help Centre | Current public collection/article inventory. |
| PB-OAUTH | [How PostBridge connects social accounts](https://support.post-bridge.com/faq/how-post-bridge-connects-to-your-social-media-accounts) | Official Help Centre | OAuth, no-password claim, connection/revocation flow and official APIs claim. |
| PB-CROSSPOST | [How PostBridge handles cross-posting](https://support.post-bridge.com/social-media-connections/how-post-bridge-handles-cross-posting-to-multiple-platforms) | Official Help Centre | One uploaded video distributed to connected accounts; uploaded-through-product limitation. |
| PB-ACCOUNT-LIMITS | [Account connection limits and capabilities](https://support.post-bridge.com/social-media-connections/social-media-account-connection-limits-and-capabilities) | Official Help Centre | 5/15/unlimited account claims and 100 uploads per hour. |
| PB-DUPLICATES | [Platform posting limitations and duplicate content](https://support.post-bridge.com/social-media-scheduling/social-media-platform-posting-limitations-multiple-accounts-and-duplicate-content) | Official Help Centre | One account per platform per post and the competitor’s stated rationale. |
| PB-MEDIA-LIMITS | [Platform limits and restrictions](https://support.post-bridge.com/media-limits-and-processing/post-bridge-platform-limits-and-restrictions) | Official Help Centre | Documented media formats, counts, durations and upload limits. |
| PB-YOUTUBE | [“how to use post bridge! (social media scheduler demo)”](https://www.youtube.com/watch?v=FR5e4r_QYfA) | Official YouTube video by `jack friks` | Video title, creator, 147-second duration and publish date. |
| PB-AFFILIATE | [PostBridge Affiliate Program](https://support.post-bridge.com/external-integrations/post-bridge-affiliate-program) | Official Help Centre | Public affiliate programme, portal and referral-description claims. |
| PB-SERVERS | [Where are PostBridge servers located?](https://support.post-bridge.com/faq/where-are-post-bridge-servers-located) | Official Help Centre | Company claim that infrastructure is US based. |
| PB-FOUNDER-INTERVIEW | [The Bootstrapped Founder interview transcript with Jack Friks](https://tbf.fm/episodes/396-jack-friks-building-tools-that-empower-without-overwhelming/transcript) | Founder interview hosted by a third party | Context only: founder-described origin and simplicity preference. Not used for product guarantees. |
| PB-FOUNDER-X | [Jack Friks’ MCP announcement](https://x.com/jackfriks/status/2027844525146657237) | Direct public founder statement | 28 February 2026 MCP announcement and Claude scheduling claim. Not used as an SEO, pricing or feature-completeness claim. |
| PB-NO-THREADS | [Thread scheduling limitation](https://support.post-bridge.com/social-media-scheduling/thread-scheduling-on-x-twitter-and-instagram-threads-current-limitations) | Official Help Centre | Product states X/Twitter and Instagram Threads are single-post only, not multi-post thread scheduling. |
| PB-SHORT-LINK | [Can I link YouTube Shorts to long-form videos?](https://support.post-bridge.com/social-media-scheduling/can-i-link-youtube-shorts-to-long-form-videos) | Official Help Centre | Product says this link cannot be created through its product because the YouTube API lacks the function. |

## Retrieval notes

- The main `https://www.post-bridge.com/` and pricing endpoints returned a Vercel security challenge to automated retrieval. No attempt was made to bypass it.
- Several Help Centre article bodies intermittently timed out, although the article titles remained visible in the official collection index. This note distinguishes inventory evidence from retrieved article-body evidence.
- The public API reference is a product documentation source. It was used only to observe public behaviour and no source code, private API calls, credentials, application internals, or competitor implementation techniques were used.
