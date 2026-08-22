/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relay',
  'web.brand.tagline': 'The multilingual publishing control plane for people and agents.',
  'web.skipToContent': 'Skip to the main content',
  'web.nav.label': 'Site navigation',
  'web.nav.openMenu': 'Menu',
  'web.nav.closeMenu': 'Close the menu',
  'web.nav.footerLabel': 'Footer navigation',

  'web.cta.startTrial': 'Start your free trial',
  'web.cta.seePricing': 'See the price',
  'web.cta.seeCapabilities': 'Read the capability matrix',
  'web.cta.readDocs': 'Read the documentation',
  // One trial story, stated the same way everywhere it appears: it starts the
  // day you sign up and beginning it takes no card. `web.pricing.beside.*`,
  // `web.pricing.prelaunch.*`, `web.pricing.v2.closing.body` and
  // `web.home.v2.sticker.trial` all repeat exactly this, because three pages
  // disagreeing about when a trial starts is a defect, not a wording choice.
  'web.cta.trialFootnote':
    'Relay costs $25 a month, or $250 a year, which is two months free. The seven day trial starts today and beginning it takes no card. Connector availability is shown account by account as each platform completes its review.',

  'web.label.lastReviewed': 'Last reviewed {date}',
  'web.label.nextReview': 'Next review {date}',
  'web.label.researchDate': 'Researched {date}',
  'web.label.officialSource': 'Official source',
  'web.label.onThisPage': 'On this page',
  'web.label.provider': 'Platform',
  'web.label.capability': 'Capability',

  'web.notFound.title': 'There is no page at this address',
  'web.notFound.body':
    'The link may be out of date, or we retired the page. Pages that stop being accurate are retired rather than left up, and the changelog records it when that happens.',
  'web.notFound.action': 'Go to the home page',

  'web.correction.title': 'Found something wrong on this page',
  'web.correction.body':
    'Platform rules change and we get things wrong. Send the URL and what is inaccurate and we will correct the page or retire it.',
  'web.correction.email': 'corrections@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, the multilingual publishing control plane',
  'web.meta.home.description':
    'Turn one sourced idea into platform-native content, approve it once, publish it reliably through official platform APIs, and learn what to improve next.',
  'web.meta.product.title': 'How Relay works',
  'web.meta.product.description':
    'A walk through of the publishing desk: compose once, adapt per platform, validate against the real limits, approve, schedule, publish, and keep the receipt.',
  'web.meta.integrations.title': 'Platforms Relay publishes to',
  'web.meta.integrations.description':
    'Which platforms Relay connects to, what each connection can do today, and what the platform itself does not allow.',
  'web.meta.capabilities.title': 'Connector capability matrix',
  'web.meta.capabilities.description':
    'A per platform, per capability table generated from our connector definitions, separating what we have built from what the platform does not offer.',
  'web.meta.creators.title': 'Relay for creators',
  'web.meta.creators.description':
    'For solo creators publishing the same idea in several formats and languages without rewriting it five times.',
  'web.meta.agencies.title': 'Relay for agencies',
  'web.meta.agencies.description':
    'Client separation, approvals, shareable review links, receipts and reporting for teams that publish on behalf of other people.',
  'web.meta.developers.title': 'Relay for developers',
  'web.meta.developers.description':
    'One backend behind the web app, the REST API, a remote MCP server, the CLI and signed webhooks. Same approval rules on every surface.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'Relay costs $25 a month, or $250 a year with two months free, and a seven day trial that takes no card. Every feature is included at every price, including the remote MCP server an agent connects to.',
  'web.meta.resources.title': 'Resources',
  'web.meta.resources.description':
    'Status, changelog, documentation, methodology, comparisons, the tool radar and the opportunity catalog.',
  'web.meta.status.title': 'Status',
  'web.meta.status.description':
    'Current state of every Relay surface and every connector, plus the incident history.',
  'web.meta.changelog.title': 'Changelog',
  'web.meta.changelog.description':
    'What shipped, what changed for connectors, and what was corrected.',
  'web.meta.docs.title': 'Documentation',
  'web.meta.docs.description':
    'REST API, MCP server, CLI and webhook documentation for building on Relay.',
  'web.meta.methodology.title': 'Methodology',
  'web.meta.methodology.description':
    'How we research platform claims, how we date them, how we compare other products, and how we correct mistakes.',
  'web.meta.compare.title': 'Comparisons',
  'web.meta.compare.description':
    'Honest, dated comparisons with other publishing tools, including who each one is best for.',
  'web.meta.toolRadar.title': 'Creative tool radar',
  'web.meta.toolRadar.description':
    'A dated, editorially reviewed catalog of specialist creative tools, with limitations, rights caveats and commercial disclosure.',
  'web.meta.opportunities.title': 'Promotion opportunities',
  'web.meta.opportunities.description':
    'A curated catalog of places a product can be listed, launched or discussed, with each destination own submission rules.',
  'web.meta.legal.title': 'Legal and policies',
  'web.meta.legal.description':
    'Terms, privacy, acceptable use, AI use, cookies, subprocessors, refunds, copyright, security, accessibility, developer terms and affiliate terms.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Turn one sourced idea into platform-native content, approve it once, publish it reliably, and learn what to improve next.',
  'web.home.lede':
    'Relay is a publishing desk for people who are accountable for what goes out. You write once, adapt per platform, see the real limits before you schedule, get the approval you need, publish through official platform APIs, and keep a receipt for every post.',
  'web.home.summaryLine':
    'One plan, and every feature is in it, including the remote MCP server an agent connects to. What a plan buys is active project capacity. The seven day trial needs no card.',

  // Five, because the scene under this heading renders five rows
  // (`EXAMPLE_ROWS` on the home page). It said "ten" while showing five, which
  // the page itself disproved on the way past.
  'web.home.example.title': 'One idea, five platform-native versions',
  'web.home.example.body':
    'The composer starts with a master version. Selecting one account opens an override for that account only, with its own live limits and its own preview. Nothing you write for LinkedIn changes what X receives.',
  'web.home.example.column.account': 'Account',
  'web.home.example.column.variant': 'What this account receives',
  'web.home.example.column.check': 'Checked before scheduling',
  'web.home.example.caption':
    'An illustrative composition. The limits and settings shown come from the connector definition for each platform, not from an estimate.',
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant': 'Master text, shortened, plus a two post thread',
  'web.home.example.x.check': 'Character count, thread order, estimated API cost for a link post',
  'web.home.example.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.home.example.linkedin.variant': 'Longer master text with the document attached',
  'web.home.example.linkedin.check': 'Organization role, post length, document type',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'The same image selected, with a caption rewritten for the feed',
  'web.home.example.instagram.check': 'Professional account type, aspect ratio, alt text present',
  'web.home.example.youtube.account': 'YouTube, Northbound',
  'web.home.example.youtube.variant':
    'The same clip as a Short, with its own title and description',
  'web.home.example.youtube.check': 'Upload scope, audit state, privacy the upload will land in',
  'web.home.example.bluesky.account': 'Bluesky, northbound.example',
  'web.home.example.bluesky.variant': 'Master text with the link card',
  'web.home.example.bluesky.check': 'Character count, link card resolution, alt text present',

  'web.home.pillars.title': 'What Relay is built to be good at',
  'web.home.pillars.confidence.title': 'Publish with confidence',
  'web.home.pillars.confidence.body':
    'A true preview per account, deterministic policy and platform checks before anything is queued, the approval your workspace requires, an immutable receipt with the external post ID, and a health state for every connection.',
  'web.home.pillars.confidence.proof':
    'Every external write carries an idempotency key, so a worker crash after the platform accepted a post does not create a second one.',
  'web.home.pillars.adapt.title': 'Adapt rather than duplicate',
  'web.home.pillars.adapt.body':
    'Per platform variants that you can override one account at a time, and transcreation rather than literal translation, with a project glossary and a named reviewer per language.',
  'web.home.pillars.adapt.proof':
    'The interface is available in selected languages. Content adaptation covers 30 content languages and every one of them is reviewable before it publishes.',
  'web.home.pillars.loop.title': 'Close the loop',
  'web.home.pillars.loop.body':
    'Analytics that name the metric, the platform that reported it, the denominator and when it was last refreshed. Where a platform does not report something, Relay says so instead of showing a zero.',
  'web.home.pillars.loop.proof':
    'A post is compared against your own median rather than against a score nobody can audit.',
  'web.home.pillars.anywhere.title': 'Work from where you already are',
  'web.home.pillars.anywhere.body':
    'The web app, a REST API, a remote MCP server, a CLI and signed webhooks call the same application services, the same authorization rules and the same validators.',
  'web.home.pillars.anywhere.proof':
    'An agent cannot bypass an approval policy by using a different surface, because the policy is enforced in the service, not in the interface.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 10 active channels and an owner plus 5 teammates. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'What Relay does not do',
  'web.home.honest.lede':
    'These are boundaries, not a roadmap tease. If one of them changes, it changes on the changelog first.',
  'web.home.honest.noMedia':
    'No AI image generation and no AI video generation. Relay adapts, approves, publishes and measures the media you bring.',
  'web.home.honest.noAutomationOfEngagement':
    'No automatic likes, follows, reposts, unsolicited replies or direct messages. No engagement pods and no fabricated engagement.',
  'web.home.honest.noUnofficial':
    'No browser automation, no cookie replay, no scraping and no unofficial posting endpoints. Official platform APIs only.',
  'web.home.honest.noPromises':
    'No promise about reach, ranking or engagement. Relay can tell you what happened and what to test next. It cannot tell you what an audience will do.',
  'web.home.honest.noUnattendedPublishing':
    'No unattended publishing by default. An agent can draft, validate and request approval. A human decides before anything becomes public, unless you deliberately opt a specific policy out.',

  'web.home.surfaces.title': 'Five surfaces, one backend',
  'web.home.surfaces.body':
    'The same use cases, the same tenancy checks, the same validators and the same publishing workflows. A surface is a way in, never a shortcut past a rule.',
  'web.home.surfaces.web': 'Web app',
  'web.home.surfaces.webBody':
    'Composer, calendar, approvals, analytics, connections and settings.',
  'web.home.surfaces.api': 'REST API',
  'web.home.surfaces.apiBody':
    'Scoped keys, idempotency keys on every write, cursor pagination, typed errors.',
  'web.home.surfaces.mcp': 'Remote MCP server',
  'web.home.surfaces.mcpBody':
    'Streamable HTTP, OAuth, per tool scopes and a preview before every consequential call.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stable machine readable output for scripts and continuous integration.',
  'web.home.surfaces.webhooks': 'Signed webhooks',
  'web.home.surfaces.webhooksBody':
    'Publish results, approval decisions and connection health, with redelivery.',

  'web.home.closing.title': 'Start with one account and one post',
  'web.home.closing.body':
    'Connect one account, draft one post, watch the validation run, schedule it and read the receipt. That is the whole product in about ten minutes.',

  /*
   * Home v2 (WP-1, loud system). Additive only: every key above this block
   * still renders somewhere on the page. B5 English-fallback exemption for
   * this whole prefix is recorded in `beta-fallbacks.ts`, matching the
   * existing precedent for `web.home.summaryLine` and
   * `web.home.pillars.economics.*` above.
   */
  'web.home.v2.heroTemplate': 'Native, on-brand posts for {platform}.',
  'web.home.v2.sticker.trial': 'Seven day free trial. No card required.',
  'web.home.v2.sticker.official': 'Official APIs only',
  'web.home.v2.marqueeCaption': 'Official APIs only.',
  'web.home.v2.surfacesStat': 'Surfaces on one shared backend',
  'web.home.v2.pricingTeaser.title': 'What it costs',
  'web.home.v2.variantScene.masterLabel': 'Master draft',
  'web.home.v2.variantScene.progress': '{revealed} of {total}',

  /*
   * The rebuilt hero and the agent section.
   *
   * Two notes for whoever edits these next.
   *
   * 1. Nothing above is deleted. `web.home.promise` and `web.home.lede` are
   *    the long-form promise the hero used to set at display size; they are
   *    still translated in other locales and still render on the page, below
   *    the fold, where a paragraph is what a reader actually wants. The hero
   *    now leads with `hero.headline`, which is six words.
   * 2. They live under `web.home.v2.` rather than a new `web.agents.`
   *    namespace on purpose. `web.home.v2.` already carries the B5
   *    English-fallback exemption in `beta-fallbacks.ts`; a fresh namespace
   *    would need a new entry in that file, which belongs to the translation
   *    owner, and until they added it every beta locale would fail the
   *    catalog parity gate.
   */
  'web.home.v2.hero.providersLabel': 'Networks Relay publishes to',
  'web.home.v2.hero.headline': 'Post everywhere from your AI agent.',
  'web.home.v2.hero.subhead':
    'Connect Claude Code, Codex, Hermes or any MCP client to the Relay MCP server and it can draft, check platform limits and schedule posts. Not using an agent? The web app, a REST API, a CLI and signed webhooks do the same work.',
  'web.home.v2.hero.agentsCta': 'See what an agent can do',

  'web.home.v2.agents.title': 'Your agent gets tools, not a text box',
  'web.home.v2.agents.lede':
    'The MCP server is a resource server in front of the same application services the web app uses. It holds no publishing logic and no second permission system, so an agent cannot reach anything you have not granted it, and it cannot route around an approval by using a different surface.',
  'web.home.v2.agents.connect.title': 'Connecting is one config block',
  'web.home.v2.agents.connect.step.credential.title': 'Point the client at the endpoint',
  'web.home.v2.agents.connect.step.credential.body':
    'Create a credential in Relay, then paste the workspace MCP endpoint into your client. The credential is read from an environment variable rather than written into the file, because a config committed to a repository is the most common way one leaks.',
  'web.home.v2.agents.connect.step.authorize.title': 'The client authorizes over OAuth',
  'web.home.v2.agents.connect.step.authorize.body':
    'Relay compares the token audience against this server as an exact string, never a prefix, and re-verifies the grant on every call. A revoked grant stops working in the middle of a long lived agent session.',
  'web.home.v2.agents.connect.step.work.title': 'The agent reads your accounts, then works',
  'web.home.v2.agents.connect.step.work.body':
    'It lists the accounts you connected, reads the live platform limits for each one, and drafts against those rather than against a guess. Account ids are resolved on the server, so a raw handle is never accepted.',
  'web.home.v2.agents.connect.clients': 'Reviewed setups ship for these clients',
  'web.home.v2.agents.connect.clientsNote':
    'Any MCP client that speaks Streamable HTTP over TLS can connect. There are no unauthenticated tools, not even read ones.',
  'web.home.v2.agents.connect.snippetCaption':
    'The Claude Code block, with your own endpoint in place of the example.',
  'web.home.v2.agents.tools.title': '{count} tools, split by blast radius',
  'web.home.v2.agents.tools.body':
    'Every tool declares its risk, its scopes and its approval level as data, and the description a client shows is generated from that declaration. A tool whose description disagrees with what is enforced is worse than no description, so the two cannot disagree.',
  'web.home.v2.agents.tier.count': '{count, plural, one {# tool} other {# tools}}',
  'web.home.v2.agents.tier.read.label': 'Read',
  'web.home.v2.agents.tier.read.rule':
    'Nothing changes. Each one answers with a bounded page and a link, so a calendar of ten thousand entries comes back as ten and a cursor instead of filling the context window.',
  'web.home.v2.agents.tier.reversible.label': 'Reversible',
  'web.home.v2.agents.tier.reversible.rule':
    'Changes something inside Relay and publishes nothing. A draft sits in the workspace until a person, or a grant you gave for scheduling, moves it forward.',
  'web.home.v2.agents.tier.consequential.label': 'Consequential',
  'web.home.v2.agents.tier.consequential.rule':
    'Reaches a platform. Each one requires an idempotency key, rejected rather than defaulted, so an agent retrying in a loop cannot post the same thing twice.',
  'web.home.v2.agents.confirm.title': 'Publishing right now needs a person',
  'web.home.v2.agents.confirm.body':
    'Asking an agent to publish immediately does not publish. Relay mints a pending confirmation bound to the workspace, the grant, the post and a fingerprint of the exact accounts, and hands back a link on the Relay domain. You open it in your own session, see what will go out and where, and approve. Change the post afterwards and the fingerprint changes with it, which voids the approval.',
  'web.home.v2.agents.docsCta': 'Read the agent documentation',

  /*
   * The louder home page: an oversized two line hero, a reach figure derived
   * from the launch cohort, and the bento band that replaced three separate
   * sections (the connector grid, the surfaces list and the variant scene).
   *
   * Two things whoever edits these next needs to know.
   *
   * 1. `hero.headlineAccent` is a WHOLE SENTENCE, not a fragment of
   *    `hero.headline`. It is the one phrase on the page set in the vermilion
   *    action accent, and it is a separate key precisely so no translator is
   *    ever asked to reorder around a coloured span. Nothing concatenates the
   *    two: they are two lines of one heading, each complete on its own, and
   *    either one read alone is still a sentence.
   * 2. `hero.reachLabel` names what the figure beside it counts, and the
   *    figure itself is `CORE_PROVIDER_IDS.length`, never a number typed into
   *    this file. `hero.reachNote` is what keeps the figure honest: cohort
   *    membership is intent, and availability is still per account per review,
   *    which is exactly what `web.cta.trialFootnote` already says.
   */
  'web.home.v2.hero.headlineAccent': 'One draft, every network.',
  'web.home.v2.hero.reachLabel': 'Networks in the launch cohort',
  'web.home.v2.hero.reachNote':
    'Availability is shown account by account as each platform completes its review.',
  'web.home.v2.bento.networks.title': 'Where a post can go',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'The publishing desk',
  'web.product.lede':
    'Seven questions must be answerable at every step without clicking anything: what is being posted, where, which version each account receives, when and in which time zone, who approved it, what it may cost, and what happened.',

  'web.product.step.source.title': 'Source',
  'web.product.step.source.body':
    'Start from a brief, a file you upload, an RSS item or a request from an agent. Uploaded media keeps the provenance you gave it, including where it came from and who holds the rights. Importing a file from a URL is not built yet.',
  'web.product.step.compose.title': 'Compose once, then override',
  'web.product.step.compose.body':
    'A master version drives every target. Selecting one account opens an override for that account only: its own text, media selection, settings, live limit counter and preview. Resetting an override restores the master in one action and shows you the difference first. In-app media editing is not built yet.',
  'web.product.step.validate.title': 'Validate before anything is queued',
  'web.product.step.validate.body':
    'Validation is deterministic and runs on the server. It checks the platform limits from the versioned capability snapshot, the account type, alt text, media rights, duplicate and cadence rules, mention and destination resolution, and the estimated platform usage cost. Every issue names the target it belongs to and how to fix it.',
  'web.product.step.approve.title': 'Approve once',
  'web.product.step.approve.body':
    'Approval is a workspace policy, not a habit. A reviewer sees every target, every variant, the time zone, the privacy state and the estimated cost on one screen, and it works on a phone. Content changed after approval requires approval again.',
  'web.product.step.schedule.title': 'Schedule in a real time zone',
  'web.product.step.schedule.body':
    'Every scheduled post stores an instant and an IANA time zone, never a naive local time. Daylight saving transitions are shown before you confirm, not discovered afterwards.',
  'web.product.step.publish.title': 'Publish and keep the receipt',
  'web.product.step.publish.body':
    'Each target is dispatched with an idempotency key. A target that fails does not roll back a target that succeeded, and that state has its own name: partially published. Each result produces an immutable receipt with the external post ID, the request identifier, the attempt history and the exact error if there was one.',
  'web.product.step.learn.title': 'Learn',
  'web.product.step.learn.body':
    'Metrics are normalized, named, attributed to the platform that reported them and stamped with a freshness time. A metric a platform does not report is marked unavailable with the reason. It is never rendered as a zero.',

  'web.product.shot.caption':
    'Screenshots on this page are captured from the running product. Until a surface is complete enough to photograph honestly, we describe it in words instead of drawing a picture of it.',
  'web.product.shot.pending': 'Screenshot pending capture',
  'web.product.shot.pendingReason':
    'This surface is still being built. We will publish a real capture rather than an illustration.',

  'web.product.states.title': 'The states nobody likes to design',
  'web.product.states.body':
    'A publishing tool is judged on the bad day, not the good one. Every one of these has a designed screen, a plain sentence and a next action.',
  'web.product.states.partial':
    'Partially published: which targets are live, which failed and why.',
  'web.product.states.revoked': 'A revoked token found at dispatch time, with the reconnect path.',
  'web.product.states.rateLimited':
    'A platform rate limit, with when it resets and what is queued behind it.',
  'web.product.states.duplicate':
    'A duplicate or cadence block, with the rule that fired and the appeal path.',
  'web.product.states.offline': 'Offline while composing: nothing you wrote is lost.',
  'web.product.states.permission': 'An action your role does not allow, naming the role that does.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Platforms',
  'web.integrations.lede':
    'Relay connects through official platform APIs. Each connector has a named owner, a recorded policy URL and a review date. A connector is not listed as supported until it passes the connector definition of done.',
  'web.integrations.reviewNotice.title':
    'No connector is described as official before the platform approves it',
  'web.integrations.reviewNotice.body':
    'Several platforms require an app review before an application may publish on behalf of a customer. Where that review is outstanding, the connector says so and describes exactly what is restricted until it passes.',
  'web.integrations.accountTypes': 'Account types this connector can publish to',
  'web.integrations.restriction': 'Restriction you should know before connecting',
  'web.integrations.cost': 'Platform usage cost',
  'web.integrations.viewMatrix': 'See every capability for this platform',

  'web.capabilities.title': 'Connector capability matrix',
  'web.capabilities.lede':
    'Generated from the same connector definitions the product reads, then reviewed by a person before publication. Marketing cannot promise something an adapter cannot do.',
  'web.capabilities.legend.title': 'How to read this table',
  'web.capabilities.legend.body':
    'Four states, and the difference between the middle two matters. Not built yet is our backlog. Not offered by the platform is a fact about the platform that no tool can work around.',
  'web.capabilities.tableCaption':
    'Capabilities by platform. Each cell names its state in words as well as by colour.',
  'web.capabilities.snapshot': 'Connector definitions version {version}, reviewed {date}',
  'web.capabilities.sourceNote':
    'Every platform claim in this table links to the official documentation it came from and the date we last read it.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'For creators',
  'web.creators.lede':
    'You publish the same idea in several formats, sometimes in more than one language, and you are the whole team. Relay keeps the text variants, media selection and platform checks together.',
  'web.creators.job.adapt.title': 'Write it once, ship five native versions',
  'web.creators.job.adapt.body':
    'The master version carries the idea. Each account gets its own length, media selection, settings and tone, and you can see the variants side by side before you commit.',
  'web.creators.job.languages.title': 'Publish in another language without guessing',
  'web.creators.job.languages.body':
    'Transcreation keeps the intent rather than the words, uses your project glossary, and marks whether a native reviewer has read it. Nothing publishes in a language you cannot vouch for unless you say so.',
  'web.creators.job.rights.title': 'Keep your rights record with the file',
  'web.creators.job.rights.body':
    'Media carries where it came from, who holds the rights and whether it was created with a generative tool. Platforms increasingly ask. Relay stores your answer with the asset instead of asking you again.',
  'web.creators.job.cost.title': 'Know the cost before you post',
  'web.creators.job.cost.body':
    'X charges per operation and charges more for a post containing a URL. Relay estimates that before you confirm, so a link heavy week is a decision rather than an invoice surprise.',
  'web.creators.notFor.title': 'What this is not',
  'web.creators.notFor.body':
    'Relay does not generate images or video, does not run engagement automation, and does not predict how a post will perform. If those are the tools you want, other products do them and we would rather you know now.',

  'web.agencies.title': 'For agencies',
  'web.agencies.lede':
    'You publish on behalf of other people, which makes attribution, approval and evidence part of the job rather than a nicety.',
  'web.agencies.job.separation.title': 'Client separation that holds up',
  'web.agencies.job.separation.body':
    'Every workspace is isolated at the database level as well as in the application. A query that crosses a workspace boundary fails in Postgres, not only in a code path someone could forget.',
  'web.agencies.job.approval.title': 'Approvals a client can actually use',
  'web.agencies.job.approval.body':
    'A reviewer sees every target, every variant, the schedule with its time zone and the estimated cost on a single screen, and the screen works on a phone. Approval decisions are recorded with who, when and what they saw.',
  'web.agencies.job.receipts.title': 'Evidence for the awkward conversation',
  'web.agencies.job.receipts.body':
    'Every publication produces an immutable receipt with the external post ID and the full attempt history. When a client asks whether something went out at nine, the answer has a timestamp and a platform identifier attached.',
  'web.agencies.job.roles.title': 'Roles that match how the work is split',
  'web.agencies.job.roles.body':
    'Owner, admin, editor, approver, analyst and viewer, scoped per project and per account. Each workspace includes the owner and up to 5 teammates. Every action is attributed to the person who completed it.',
  'web.agencies.limits.title': 'The boundary, stated plainly',
  'web.agencies.limits.body':
    'One plan covers 10 active social channels. A channel is one social account, Page, profile, group or publication connection. Disconnect a channel before adding another when all 10 are active.',

  'web.developers.title': 'For developers',
  'web.developers.lede':
    'Publishing is the part of a workflow where a mistake is public and permanent. Relay gives you one backend, typed errors, idempotency on every write and an approval model that an agent cannot talk its way around.',
  'web.developers.surface.api.title': 'REST API',
  'web.developers.surface.api.body':
    'Scoped API keys, an idempotency key required on every write, cursor pagination, and a typed error envelope carrying a stable code, a message key and sanitized details. No provider payload is ever reflected back to you raw.',
  'web.developers.surface.mcp.title': 'Remote MCP server',
  'web.developers.surface.mcp.body':
    'Streamable HTTP with OAuth. Tools are granular and each one declares its side effects. Reading, drafting, requesting approval, scheduling and publishing are separate scopes, so a model that can draft cannot publish.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Every command supports machine readable output with a stable shape, so a script can parse it and a continuous integration job can fail on it.',
  'web.developers.surface.webhooks.title': 'Signed webhooks',
  'web.developers.surface.webhooks.body':
    'Publish results, approval decisions, connection health and validation outcomes, signed, replay resistant and redeliverable from the dashboard.',
  'web.developers.safety.title': 'The agent safety model',
  'web.developers.safety.body':
    'A scoped API key is not a copy of a browser session. The server reauthorizes every call, records the actor and never trusts an agent host to approve its own action. Dedicated service accounts are not built yet.',
  'web.developers.safety.injection':
    'Web pages, feeds, comments and platform responses are treated as untrusted data. Model output is revalidated deterministically, because a model saying a post is fine is not a security decision.',
  'web.developers.safety.killSwitch':
    'Revoke an API key to stop future calls. Pause a social connection to stop new work for that account. A workspace-wide kill switch is not built yet.',
  'web.developers.openSource.title': 'Open pieces',
  'web.developers.openSource.body':
    'The connector contract, the CLI, schema examples, MCP tool definitions and the provider simulator are the parts you need to build against Relay without a sandbox account. Where a repository is not published yet, this page says so rather than linking to nothing.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  // No amounts in this sentence, on purpose. The page has exactly one place
  // where a price is stated, and it is the plan card, where every figure is
  // formatted from the tier module's integer minor units. A price written into
  // prose is a price that survives a reprice and starts lying: this sentence
  // used to say "$29 a month or $300 a year" and was doing exactly that.
  'web.pricing.lede':
    'There are no feature tiers. Every feature is included at every price, including the MCP server an agent connects to, and the seven day free trial starts without a card.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$250 charged once a year.',
  'web.pricing.monthlyDetail': '$25 charged every month.',
  // The annual saving is stated in whole dollars. Never a percentage: the real
  // discount on 29 and 300 is not a round number and the billing copy
  // compliance test rejects percentage framing. Mirrors
  // `BASE_TIER_PRESENTATION.annualFraming` in packages/billing/src/products.ts.
  'web.pricing.annualFraming': 'Save $50 a year. That is 2 months free.',
  'web.pricing.prelaunch.primaryNote':
    'Your seven day trial starts today. No card is collected to begin it, and you choose monthly or annual when it ends.',
  'web.pricing.prelaunch.secondaryNote':
    'Cancel at any time from Settings during the trial and you are charged nothing. Connector availability is shown account by account as each platform completes its review.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Taxes and merchant terms are shown at checkout before you confirm.',

  'web.pricing.beside.title': 'The paid terms',
  'web.pricing.beside.channels':
    '10 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'One owner and up to 5 teammates in each workspace. There is no separate per-seat charge within that limit.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial starts today and runs for seven days with every shipped feature. Beginning it takes no card. Polar shows the exact first charge amount and date before you confirm a subscription.',
  'web.pricing.beside.conversion':
    'An uncanceled trial converts on day seven to the interval you chose. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings without contacting support. Cancel during the trial and no charge is attempted.',
  'web.pricing.beside.data':
    'Post text, receipts and audit history remain under the data policy. Uploaded files are permanently deleted 30 days after upload. Workspace export is available as structured JSON; CSV and media archives are not available yet.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I reach 10 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. A new connection is not activated until you disconnect one of the 10 active channels.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /*
   * Pricing v2 (WP-2, loud system). Additive only: every key above this
   * block still renders somewhere on the page. B5 English-fallback
   * exemption for this whole prefix is recorded in `beta-fallbacks.ts`,
   * matching the existing precedent for `web.pricing.*` above and
   * `web.home.v2.*` on the landing page.
   */
  // The hero's two-line headline. The lead line names what actually varies
  // between the three prices; the accent line is `billing.plan.single`
  // reused verbatim rather than restated, because that sentence is already
  // the reviewed "no feature tiers" claim and a second wording of it would be
  // a second claim to keep in sync with the first.
  'web.pricing.v2.hero.headline': 'What changes between prices is capacity, not capability.',
  'web.pricing.v2.closing.title': 'Start publishing on one plan',
  // Was a waiting-list sentence ("joining now reserves your place ... the trial
  // starts on the day checkout opens, not today"). It contradicted the note
  // beside the button on the same page, so it now tells the one story.
  'web.pricing.v2.closing.body':
    'Signing up starts the seven day trial today and collects no card. Which connectors are available is shown for your account, platform by platform, as each review completes.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Resources',
  'web.resources.lede':
    'Operational truth about the product, and the research behind anything we claim about a platform.',
  'web.resources.status.body':
    'Current state of every surface and every connector, with incident history.',
  'web.resources.changelog.body':
    'What shipped, what changed for a connector, and what we corrected.',
  'web.resources.docs.body': 'REST API, MCP, CLI and webhook documentation.',
  'web.resources.methodology.body':
    'How we research, date, source and correct every platform claim.',
  'web.resources.compare.body': 'Dated comparisons with other tools, including who each one suits.',
  'web.resources.capabilities.body':
    'Per platform, per capability, generated from the connector definitions.',
  'web.resources.toolRadar.body':
    'Specialist creative tools, dated, with limitations and disclosure.',
  'web.resources.opportunities.body':
    'Curated places to launch, list or contribute, with each destination rules.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Guides and workflows',
  'web.resources.guides.empty': 'No guide has been published yet',
  'web.resources.guides.emptyBody':
    'The editorial standard requires original product data, a reproducible workflow, primary platform sources with a verification date, and a named human editor. The first guides publish when they meet it.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Status',
  'web.status.lede':
    'The state of every Relay surface and every connector. Connector state covers our adapter and the platform API it depends on.',
  'web.status.updated': 'Statuses are set by hand. Last updated {time}.',
  'web.status.surfaces.title': 'Surfaces',
  'web.status.connectors.title': 'Connectors',
  'web.status.level.operational': 'Operating normally',
  'web.status.level.degraded': 'Degraded',
  'web.status.level.partial': 'Partial outage',
  'web.status.level.outage': 'Outage',
  'web.status.level.maintenance': 'Planned maintenance',
  'web.status.level.notLive': 'Not live yet',
  'web.status.notLiveBody':
    'This connector is built but is not carrying customer traffic yet, so there is nothing to report on.',
  'web.status.incidents.title': 'Incident history',
  'web.status.incidents.empty': 'No incident has been recorded',
  'web.status.incidents.emptyBody':
    'This page starts empty on purpose. We publish every incident that affected publishing, including the ones caused by our own mistakes, with the timeline and what changed afterwards.',
  'web.status.incident.started': 'Started {time}',
  'web.status.incident.resolved': 'Resolved {time}',
  'web.status.incident.impact': 'Impact',
  'web.status.incident.cause': 'Cause',
  'web.status.incident.followUp': 'What changed afterwards',
  'web.status.subscribe.title': 'Get told when something breaks',
  'web.status.subscribe.body':
    'Connection health, publish failures and platform incidents are delivered as signed webhooks to your own endpoint. There is no separate status mailing list yet.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Changelog',
  'web.changelog.lede':
    'Product changes, connector changes and corrections. A capability change that affects what you can publish appears here before it appears anywhere else on this site.',
  'web.changelog.kind.shipped': 'Shipped',
  'web.changelog.kind.changed': 'Changed',
  'web.changelog.kind.fixed': 'Fixed',
  'web.changelog.kind.connector': 'Connector',
  'web.changelog.kind.correction': 'Correction',
  'web.changelog.kind.security': 'Security',
  'web.changelog.empty': 'Nothing has shipped publicly yet',
  'web.changelog.emptyBody':
    'Relay is in build. The first entry here is the first thing a customer can use, not a milestone about ourselves.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentation',
  'web.docs.lede':
    'One backend, four ways in. Each section documents the same use cases, so a concept you learn in the REST API is the same concept in MCP and in the CLI.',
  'web.docs.section.start.title': 'Getting started',
  'web.docs.section.start.body':
    'Authentication, workspaces, projects, and your first published post.',
  'web.docs.section.api.title': 'REST API',
  'web.docs.section.api.body': 'Resources, pagination, idempotency, error codes and rate limits.',
  'web.docs.section.mcp.title': 'MCP server',
  'web.docs.section.mcp.body': 'Transport, OAuth, tool catalog, scopes and the approval handshake.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body': 'Install, authenticate, and the machine readable output contract.',
  'web.docs.section.webhooks.title': 'Webhooks',
  'web.docs.section.webhooks.body':
    'Event catalog, signature verification, retries and redelivery.',
  'web.docs.section.connectors.title': 'Connectors',
  'web.docs.section.connectors.body':
    'Per platform requirements, account types, limits and known restrictions.',
  'web.docs.section.errors.title': 'Error reference',
  'web.docs.section.errors.body': 'Every error code, what causes it, and what to do about it.',
  'web.docs.pending': 'Not published yet',
  'web.docs.pendingBody':
    'This section is written against the shipped API and publishes with it. We would rather show you nothing than documentation for an endpoint that might change.',
  'web.docs.principles.title': 'What you can rely on',
  'web.docs.principles.idempotency':
    'Every write takes an idempotency key. Replaying a request with the same key returns the original result rather than creating a second post.',
  'web.docs.principles.errors':
    'Every error carries a stable code, a message key and sanitized details. Codes do not change meaning between versions.',
  'web.docs.principles.versioning':
    'Breaking changes get a new version and an announced deprecation window. Additive changes do not.',
  'web.docs.principles.scopes':
    'Reading, drafting, requesting approval, scheduling and publishing are separate scopes. A credential gets the smallest set that does its job.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Methodology',
  'web.methodology.lede':
    'How anything on this site gets to be called true, and what happens when it turns out not to be.',
  'web.methodology.claims.title': 'Platform claims',
  'web.methodology.claims.body':
    'Every claim about what a platform allows comes from that platform own documentation or policy page. We record the URL, the date it was read, the API version where one applies, and the person who owns rechecking it. A claim without those four things does not go on the site.',
  'web.methodology.recheck.title': 'When we recheck',
  'web.methodology.recheck.beforeConnector':
    'Before a connector starts, and again before it carries customer traffic.',
  'web.methodology.recheck.monthly': 'Every month for platform changelogs and vendor pricing.',
  'web.methodology.recheck.quarterly':
    'Every quarter for competitor plans, community rules and legal documents.',
  'web.methodology.recheck.immediate':
    'Immediately after any platform rejection, enforcement notice, deprecation, or an unexplained change in publishing or analytics behaviour.',
  'web.methodology.comparison.title': 'Comparisons',
  'web.methodology.comparison.bestFor':
    'Every comparison states who each product is best for, including when that is not us.',
  'web.methodology.comparison.dated':
    'Every comparison carries the research date and links the primary pricing and capability sources.',
  'web.methodology.comparison.distinction':
    'A missing capability is labelled either as something we have not built or as something the platform does not allow. These are different sentences and we never merge them.',
  'web.methodology.comparison.noLogos':
    'We do not use another company customer logos, quotes or interface screenshots, and we do not claim an endorsement we do not have.',
  'web.methodology.benchmarks.title': 'Benchmarks and product data',
  'web.methodology.benchmarks.body':
    'Any number drawn from customer activity states its sample, its exclusions, its metric definition and its privacy threshold, and is aggregated so no workspace can be identified. If a sample is too small to publish safely, we say that instead of publishing it anyway.',
  'web.methodology.ai.title': 'AI in our own content',
  'web.methodology.ai.body':
    'A model may research, outline, translate, check and format. A named person owns every claim, edits the piece and keeps it current. We do not publish unreviewed generated articles, and we do not generate the screenshots.',
  'web.methodology.corrections.title': 'Corrections',
  'web.methodology.corrections.body':
    'When a page is wrong we correct it in place, add a dated correction note, and list the correction on the changelog. When a page is too stale to fix we retire it rather than leaving it up.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Comparisons',
  'web.compare.lede':
    'These pages are useful even if you pick the other product. That is the standard they have to meet before they publish.',
  'web.compare.rules.title': 'The rules these pages follow',
  'web.compare.rules.bestFor':
    'Each page states who the other product is best for, in its own section, first.',
  'web.compare.rules.dated': 'Each claim is dated and links the primary source it came from.',
  'web.compare.rules.distinction':
    'We separate what we have not built from what a platform does not allow.',
  'web.compare.rules.axes':
    'Every page compares the same things: account allowance, posting limits, team and approval, API, MCP and CLI access, content languages, analytics, video handling, embedded use, self hosting, support, and the platform API cost you pay on top.',
  'web.compare.rules.correction': 'Every page carries a correction contact and a review date.',
  'web.compare.planned.title': 'Planned pages',
  'web.compare.planned.body':
    'These publish once the current pricing and capability check is complete. A comparison written from memory is worse than no comparison.',
  'web.compare.empty': 'No comparison has been published yet',
  'web.compare.emptyBody':
    'Each page needs a fresh fact check against the other product own pricing and documentation. They publish one at a time as that work finishes.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Creative tool radar',
  'web.toolRadar.lede':
    'Relay does not generate images or video. It does help you decide which specialist tool to use and bring the finished asset in with its rights record intact.',
  'web.toolRadar.record.title': 'What every record has to carry',
  'web.toolRadar.record.url': 'The official URL and the organization that owns the product.',
  'web.toolRadar.record.useCase':
    'The workflow it is being recommended for, and its documented limitations.',
  'web.toolRadar.record.pricing': 'Its pricing model and the date we checked it.',
  'web.toolRadar.record.rights':
    'Its rights, licensing, retention and privacy caveats, in the vendor own words.',
  'web.toolRadar.record.disclosure':
    'Whether we have any commercial relationship with it. Ranking never depends on that.',
  'web.toolRadar.record.verified':
    'A last verified date, and a visible warning once a record is past its review window.',
  'web.toolRadar.category.title': 'Categories',
  'web.toolRadar.empty': 'The catalog is not populated yet',
  'web.toolRadar.emptyBody':
    'Records are written by a person from the vendor own documentation. We will not fill this page with model generated links that look plausible.',
  'web.toolRadar.noAffiliateYet':
    'There is no affiliate relationship with any tool listed here today.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Promotion opportunities',
  'web.opportunities.lede':
    'A curated catalog of places where a product can be launched, listed, discussed or contributed, with the rules each destination sets for itself.',
  'web.opportunities.rules.title': 'How this catalog behaves',
  'web.opportunities.rules.curated':
    'Every entry is a reviewed record with an official URL, the current submission rules and a verification date. Nothing is discovered by a model and presented as verified.',
  'web.opportunities.rules.noAutomation':
    'Relay never submits a form, scrapes a contact, sends bulk email or posts to a community for you. You do the submission.',
  'web.opportunities.rules.noGuarantee':
    'A listing is not a ranking promise and a link is not a growth strategy. We show fit, audience, effort, cost and disclosure requirements so you can decide whether it is worth your afternoon.',
  'web.opportunities.rules.stale':
    'A record past its review date is labelled or hidden rather than shown as current.',
  'web.opportunities.category.title': 'Categories',
  'web.opportunities.empty': 'The catalog is not populated yet',
  'web.opportunities.emptyBody':
    'Each destination rules have to be read and recorded by a person before it can be recommended. Categories are listed above so you can see the shape of what is coming.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.contact.prelaunch':
    'Contact channels will be published here before general availability. No legal or support inbox is operating during this preview.',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a project, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your project glossary.',
  'web.legal.ai.features.feedback':
    'Content feedback in the composer. Generated four week growth plans are not available in prelaunch.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the project context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes': 'A personal or business X account you control.',
  'web.marketing.provider.x.restriction':
    'Automated posting requires the account holder express consent, which Relay records. Duplicate or substantially similar posts across accounts are not permitted, and unsolicited automated replies are not built.',
  'web.marketing.provider.x.cost':
    'X charges for each API operation and charges more for a post containing a URL. Relay estimates the cost before you confirm and passes it through without a markup.',

  'web.marketing.provider.linkedin.accountTypes':
    'A member profile, or an organization Page where you hold the right role.',
  'web.marketing.provider.linkedin.restriction':
    'Publishing on behalf of an organization needs an approved Community Management product and a verified business identity. Member post analytics depend on a read permission LinkedIn has closed to new applications, so Relay will not offer it.',
  'web.marketing.provider.linkedin.cost':
    'No per operation charge. Application and member daily limits apply.',

  'web.marketing.provider.instagram.accountTypes':
    'A professional Instagram account, business or creator.',
  'web.marketing.provider.instagram.restriction':
    'Instagram content publishing is available for professional accounts only. A consumer account cannot be published to by any application, including this one. Publishing uses the official container and publish sequence, and Relay confirms the final state rather than reporting the upload as success.',
  'web.marketing.provider.instagram.cost':
    'No per operation charge. Meta app review and business verification are required.',

  'web.marketing.provider.facebook.accountTypes': 'A Facebook Page you administer.',
  'web.marketing.provider.facebook.restriction':
    'The publishing target is a Page. Automating a personal profile is not offered by the API and Relay does not attempt it.',
  'web.marketing.provider.facebook.cost':
    'No per operation charge. Meta app review and business verification are required.',

  'web.marketing.provider.youtube.accountTypes':
    'A YouTube channel connected through your Google account.',
  'web.marketing.provider.youtube.restriction':
    'A project that has not passed the Google API compliance audit can upload only as private. Relay will not describe public uploading as available until that audit passes, and the connection screen states which state your uploads will land in.',
  'web.marketing.provider.youtube.cost':
    'No per operation charge. A daily quota applies and cannot be shared across projects.',

  'web.marketing.provider.tiktok.accountTypes': 'A TikTok account with Direct Post authorization.',
  'web.marketing.provider.tiktok.restriction':
    'Until the Content Posting API audit passes, posts are private and per account caps apply. At publish time Relay fetches the current creator information, shows the available privacy options without preselecting one, and asks for the comment, duet and stitch settings and the commercial content declaration.',
  'web.marketing.provider.tiktok.cost':
    'No per operation charge. Unaudited mode applies daily posting caps.',

  'web.marketing.provider.threads.accountTypes':
    'A Threads profile linked to a professional Instagram account.',
  'web.marketing.provider.threads.restriction':
    'Publishing follows the Meta container and publish sequence. Capabilities are being verified against the official collection before anything here is called supported.',
  'web.marketing.provider.threads.cost': 'No per operation charge.',

  'web.marketing.provider.bluesky.accountTypes': 'A Bluesky account on any hosting provider.',
  'web.marketing.provider.bluesky.restriction':
    'An open protocol with no application review step. Rate limits and record size limits still apply and are enforced before dispatch.',
  'web.marketing.provider.bluesky.cost': 'No per operation charge.',

  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'A Mastodon account on any instance.',
  'web.marketing.provider.mastodon.restriction':
    'An open protocol with no application review step. The character limit is set by each instance, and per instance rate limits apply and are enforced before dispatch.',
  'web.marketing.provider.mastodon.cost': 'No per operation charge.',

  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'A Telegram bot you control, posting into a channel or group.',
  'web.marketing.provider.telegram.restriction':
    'A bot can only post where it has been added. The bot token is an application credential and the target chat is chosen per connection.',
  'web.marketing.provider.telegram.cost': 'No per operation charge.',

  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'A Reddit account authorized for posting.',
  'web.marketing.provider.reddit.restriction':
    'Writing to Reddit requires an approved application. Posts are self or link posts into subreddits you may post to; no automated comments or votes are built.',
  'web.marketing.provider.reddit.cost': 'No per operation charge.',

  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'A WordPress site with an application password.',
  'web.marketing.provider.wordpress.restriction':
    'Posts publish through the site REST API as the connected user. Image and video upload are not built yet.',
  'web.marketing.provider.wordpress.cost': 'No per operation charge.',

  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'A Medium author profile connected through OAuth.',
  'web.marketing.provider.medium.restriction':
    'Posts publish as public stories in Markdown. The integration API has no delete endpoint, so deletion is not offered.',
  'web.marketing.provider.medium.cost': 'No per operation charge.',

  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'A Dev.to profile connected through its API key.',
  'web.marketing.provider.devto.restriction':
    'Articles publish as public Markdown posts. Image upload and engagement analytics are not built yet.',
  'web.marketing.provider.devto.cost': 'No per operation charge.',

  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'A Pinterest business account connected through OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'A pin requires an image and a board you own. Writing to Pinterest requires app review and the board list is read at connect time.',
  'web.marketing.provider.pinterest.cost': 'No per operation charge.',

  'web.marketing.provider.google_business_profile.label': 'Google Business Profile',
  'web.marketing.provider.google_business_profile.accountTypes':
    'One verified business location, connected through Google OAuth.',
  'web.marketing.provider.google_business_profile.restriction':
    'A local post carries text or a single image, a call to action and a language tag, and goes to one connected location. No adapter is built yet, so nothing publishes here today.',
  'web.marketing.provider.google_business_profile.cost': 'No per operation charge.',

  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'A Discord bot you control, posting into text channels.',
  'web.marketing.provider.discord.restriction':
    'The bot can only post into channels it can see. Text messages are supported; file attachments are not built yet.',
  'web.marketing.provider.discord.cost': 'No per operation charge.',

  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'A Slack workspace connected through an OAuth app.',
  'web.marketing.provider.slack.restriction':
    'Messages post into public and private channels the app is in. File uploads and engagement analytics are not built yet.',
  'web.marketing.provider.slack.cost': 'No per operation charge.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Supported',
  'web.capabilities.short.unsupported': 'Platform does not offer it',
  'web.capabilities.short.not_implemented': 'Not built yet',
  'web.capabilities.short.requires_review': 'Needs platform review',
  'web.capabilities.notesTitle': 'Notes and sources',
  'web.capabilities.noteRef': 'Note {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# capability supported} other {# capabilities supported}}, {requiresReview, plural, one {# waiting on a platform review} other {# waiting on a platform review}}, {notImplemented, plural, one {# not built yet} other {# not built yet}}, {unsupported, plural, one {# the platform does not offer} other {# the platform does not offer}}.',
  'web.capabilities.buildState.title': 'No connector is carrying customer traffic yet',
  'web.capabilities.buildState.body':
    'Relay is in build. This table reflects the connector definitions as they stand today, which is why most cells read as not built yet. A cell only becomes supported after that connector passes its definition of done, including contract tests against the recorded platform fixtures. The cells that say a platform does not offer something, or gates it behind a review, are facts about the platform and are already final.',
  'web.capabilities.note.instagramProfessional':
    'Professional accounts only. A consumer account cannot be published to by any application.',
  'web.capabilities.note.facebookPagesOnly':
    'Pages only. The API does not publish to a personal profile.',
  'web.capabilities.note.youtubeAudit':
    'Until the Google API compliance audit passes, uploads land as private.',
  'web.capabilities.note.tiktokAudit':
    'Until the Content Posting API audit passes, posts are private and capped.',
  'web.capabilities.note.tiktokPrivacy':
    'The privacy option is fetched at publish time and must be chosen by a person.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Member post analytics need a read permission LinkedIn has closed to new applications.',
  'web.capabilities.note.linkedinOrgAccess':
    'Requires an approved Community Management product and a verified business.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn is the only connected platform with a document post type.',
  'web.capabilities.note.metaReview': 'Requires Meta app review and business verification.',
  'web.capabilities.note.xConsent':
    'Requires recorded consent from the account holder for automated posting.',
  'web.capabilities.note.xDisclosure':
    'The platform provides a made with AI field, which Relay sets from your declaration.',
  'web.capabilities.note.noDestinations':
    'This platform has no destination concept such as a Page, board or community.',
  'web.capabilities.note.noThreads': 'This platform has no native multi post sequence.',
  'web.capabilities.note.noDocuments': 'This platform has no document post type.',
  'web.capabilities.note.videoOnly': 'This platform accepts video uploads only.',
  'web.capabilities.note.noAltText':
    'This platform does not accept alt text through its publishing API.',
  'web.capabilities.note.noPrivacyChoice':
    'This platform does not offer a per post privacy option through its API.',
  'web.capabilities.note.noThumbnail':
    'This platform does not accept a custom thumbnail through its API.',
  'web.capabilities.note.inBuild': 'The platform offers this. Relay has not shipped it yet.',
  'web.capabilities.note.noCarousel': 'The platform does not offer a swipeable carousel product.',
  'web.capabilities.note.noVideo': 'This post type accepts text or a single image, never video.',
  'web.capabilities.note.noDisclosure':
    'The platform has no disclosure field for AI or commercial content.',
  'web.capabilities.note.noAnalytics':
    'The platform exposes no engagement metrics through its official API.',
  'web.capabilities.note.redditReview':
    'Writing to Reddit requires an approved data API application.',
  'web.capabilities.note.redditMedia': 'Image and video posts are not built yet for Reddit.',
  'web.capabilities.note.mediumImages': 'The integration API does not accept image attachments.',
  'web.capabilities.note.mediumNoDelete': 'The integration API has no delete endpoint.',
  'web.capabilities.note.devtoImages':
    'The API accepts article bodies only; image upload is not built yet.',
  'web.capabilities.note.pinterestNeedsImage':
    'A pin requires an image; text only pins do not exist.',
  'web.capabilities.note.pinterestReview': 'Writing to Pinterest requires approved app access.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Web app',
  'web.status.surface.api': 'REST API',
  'web.status.surface.mcp': 'MCP server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Webhook delivery',
  'web.status.surface.publishing': 'Publishing workers',
  'web.status.surface.media': 'Media processing',
  'web.status.surface.analytics': 'Analytics collection',
  'web.status.surface.links': 'Short link redirects',
  'web.status.surface.checkout': 'Checkout and billing',
  'web.status.preLaunch.title': 'Relay is not generally available yet',
  'web.status.preLaunch.body':
    'This page is live before the product is, so that the reporting habit exists from the first customer rather than being added after the first outage. Surfaces still in build are marked as such instead of being shown as healthy.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Later',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Publer',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Typefully',
  'web.compare.product.publishingApis': 'Developer publishing APIs',
  'web.compare.state.factCheckPending': 'Fact check in progress',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Video generation and editing',
  'web.toolRadar.category.image': 'Image generation and editing',
  'web.toolRadar.category.audio': 'Audio, voice and music',
  'web.toolRadar.category.ugc': 'Avatar and creator style video',
  'web.toolRadar.category.clipping': 'Long video to short clips',
  'web.toolRadar.category.design': 'Design and layout',
  'web.toolRadar.category.research': 'Research and source gathering',
  'web.toolRadar.category.workflow': 'Workflow automation',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Product launch and startup directories',
  'web.opportunities.category.review': 'Software and review directories',
  'web.opportunities.category.marketplace': 'Integration and automation marketplaces',
  'web.opportunities.category.community': 'Community showcase threads that permit submissions',
  'web.opportunities.category.partner': 'Partner ecosystems and integration directories',
  'web.opportunities.category.editorial': 'Guest tutorials, podcasts and newsletters',
  'web.opportunities.category.openSource': 'Open source lists and documentation resources',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the project context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Draft text and uploaded media',
  'web.legal.retention.drafts.period':
    'Draft text stays while the account is active. Each uploaded file is permanently deleted from our storage 30 days after upload.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Product',
  'web.footer.company': 'Company',
  'web.footer.resources': 'Resources',
  'web.footer.legal': 'Legal',
  'web.footer.developers': 'Developers',
  'web.footer.statement':
    'Relay publishes through official platform APIs only. Connector availability depends on approvals that the platforms control, and every capability claim on this site is dated and sourced.',
  'web.footer.noAffiliation':
    'Platform names and marks belong to their owners. Their use here identifies a connector and does not imply endorsement or partnership.',
  'web.footer.copyright': 'Relay {year}',

  /* ---------------------------------------------------------------------- */
  /* WP-3 (loud system) — remaining marketing pages. Additive only: every    */
  /* key above this block still renders somewhere on its page. New keys are */
  /* appended here rather than inlined into their page's own section so a   */
  /* concurrent edit to this file never has to merge inside this block.     */
  /* B5 English-fallback exemption for each key is recorded individually in */
  /* `beta-fallbacks.ts`, matching the `web.home.v2.*` precedent above.     */
  /* ---------------------------------------------------------------------- */

  /**
   * Reused by every WP-3 page whose closing band has no page-specific copy,
   * which is thirteen pages, so it is the sentence most likely to contradict
   * the pricing page. It carries the same trial story as
   * `web.cta.trialFootnote`: starts today, no card.
   */
  'web.marketing.v2.closing.title': 'Run it on your own accounts',
  'web.marketing.v2.closing.body':
    'The seven day trial starts today and takes no card. Connector availability is shown account by account as each platform completes its review.',

  // Three, matching `DEMO_ROWS` on the product page. It now sits directly
  // above `EditorialVariantScene`, the section that actually has three rows;
  // it used to sit above the seven-step sequence instead, which is a
  // different count this heading would have disproved.
  'web.product.v2.demo.title': 'One brief, three platform-native drafts',
  'web.product.v2.demo.body':
    'The same scene from the home page, scoped to what the compose step actually produces.',

  // The product page's hero and the heading over its seven-step sequence
  // (WP-3 loud pass, editorial-marketing follow-up). New strings; recorded as
  // reviewed-English-only keys in `beta-fallbacks.ts` alongside the rest of
  // this namespace's v2 additions.
  'web.product.v2.hero.headline': 'This is the publishing desk, not a text box.',
  'web.product.v2.hero.headlineAccent':
    'Source once, then adapt, approve and publish per platform.',
  // `STEPS` on the page is seven items long; this heading states that count
  // rather than a synonym for it, on the same principle `demo.title` above
  // states three.
  'web.product.v2.sequence.title': 'The same seven steps, every time.',
  'web.product.v2.sequence.stepsStat': 'Steps from source to receipt',

  'web.integrations.v2.marqueeCaption':
    'Every connector on this page, publishing through its official API.',
  // The integrations hero and its stats cell (same pass as the product page
  // keys above). `platformsStat` and `capabilitiesStat` label counts derived
  // from `CONNECTORS.length` and `CAPABILITY_COLUMNS.length` in
  // `data/connectors.ts`, never typed here.
  'web.integrations.v2.hero.headline': 'Every platform, one official connection.',
  'web.integrations.v2.hero.headlineAccent': 'No scraping, no cookie replay, ever.',
  'web.integrations.v2.platformsStat': 'Platforms in the launch cohort',
  'web.integrations.v2.capabilitiesStat': 'Capabilities tracked per platform',

  /** The compare index's single honest claim: no invented competitor numbers. */
  'web.compare.v2.honest': 'No fabricated numbers',

  'web.creators.v2.phone.caption': 'One brief, adapted to the platform it lands on.',

  'web.agencies.v2.channelsLabel': 'Active social channels, one plan',
  'web.agencies.v2.membersSticker': 'Owner plus 5 teammates',

  'web.developers.v2.terminal.title': 'Two commands, machine readable',

  'web.notFound.v2.line': 'No link on this site points here on purpose.',

  /* ---------------------------------------------------------------------- */
  /* Track B phase 3 — the scene vocabulary and the three-tier presentation. */
  /* Appended, for the same merge reason as the block above.                 */
  /* ---------------------------------------------------------------------- */

  /** The tier grid. Delta framing, because every feature is on every tier. */
  'web.pricing.tierGrid.heading': 'Three sizes of the same product',
  'web.pricing.tierGrid.startHere': 'Start here',
  'web.pricing.tierGrid.baseDelta':
    'Every feature Relay has, on {count, plural, one {# active project} other {# active projects}}.',
  'web.pricing.tierGrid.stepDelta':
    'Everything in {tier}, plus {added, plural, one {# more active project} other {# more active projects}}.',
  'web.pricing.tierGrid.notPurchasable':
    'Not on sale yet. Standard is the only tier you can buy today.',
  'web.pricing.tierGrid.notOpenYet': 'Opening soon. Start on Standard and move up any time.',
  'web.pricing.tierGrid.intervalGroup': 'Billing interval for every tier',

  /**
   * The home connector sticker. It states a count and names the page where a
   * reader can check it, and the count is passed in from the cohort constant
   * rather than typed into the sentence.
   *
   * Seven keys that sat here are gone: the surfaces sticker
   * (`web.home.b3.sticker.surfaces*`), the shared multi-beat position
   * indicator (`web.scene.position`), the pinned home variant scene's eyebrow
   * (`web.home.b3.variantScene.eyebrow`) and the product page's three pinned
   * beat labels (`web.product.b3.beats.*`). Every one of them belonged to a
   * pinned scene that was removed; none was referenced by any component, and a
   * catalog entry nothing renders is a claim nobody is checking.
   */
  'web.home.b3.sticker.connectorsFact':
    '{count, plural, one {# connector} other {# connectors}}, official APIs only',
  'web.home.b3.sticker.connectorsSource': 'Integrations',

  /* ---------------------------------------------------------------------- */
  /* Pricing v3 — one plan, one interval control, one checklist.             */
  /* Appended, for the same merge reason as the blocks above. Additive: the  */
  /* `web.pricing.tierGrid.*` keys above are still the anchor label and the  */
  /* delta sentence, and nothing here replaces a key that another catalog is */
  /* mid-translation on.                                                     */
  /* ---------------------------------------------------------------------- */

  'web.pricing.plan.heading': 'Pay monthly or yearly',
  'web.pricing.plan.lede':
    'The same plan either way. What it buys is active project capacity, and that is the only number on this page that ever changes.',

  /*
   * The interval control and the two faces of one price.
   *
   * The rule this block exists to hold: a yearly plan is quoted as a yearly
   * amount, and the reader is shown at most two numbers plus one badge. The
   * headline is the charge. The supporting line is what the same plan costs
   * month to month, which is the only figure worth comparing it against. The
   * badge states the discount once. Nothing divides an annual price by twelve,
   * because $250 over twelve months is $20.83 and a headline price carrying
   * cents is the presentation this page was rebuilt to get rid of.
   *
   * "2 months free" is arithmetic, not a slogan: a year is priced at ten times
   * a month on every tier, so twelve months cost what ten cost. The number is
   * derived in `features/billing/tiers.ts` and is never written into this
   * sentence, so a reprice that stops the ladder dividing cleanly drops the
   * badge rather than shipping a claim that is no longer true.
   */
  'web.pricing.interval.group': 'How you want to pay',
  'web.pricing.interval.monthly': 'Monthly',
  'web.pricing.interval.yearly': 'Yearly',
  'web.pricing.interval.perMonth': 'per month',
  'web.pricing.interval.perYear': 'per year',
  'web.pricing.interval.monthlySupport': 'Charged every month. Cancel from Settings at any time.',
  'web.pricing.interval.yearlySupport':
    'Charged once a year. Month to month, the same plan is {amount} a month.',
  'web.pricing.interval.freeMonths': '{count, plural, one {# month free} other {# months free}}',

  'web.pricing.checklist.title': 'Included at both prices',
  'web.pricing.plan.trialNote':
    'The seven day trial starts the day you sign up and takes no card. You choose monthly or yearly when it ends, and Polar shows the exact amount and date before you confirm.',
  'web.pricing.plan.taxNote':
    'Prices are in US dollars. Taxes and merchant terms are shown at checkout before you confirm.',
  'web.pricing.plan.capacityTitle': 'More capacity than one plan covers',
  'web.pricing.plan.capacityNote':
    'Larger project capacity is decided and priced. It appears on this page as soon as its checkout opens, and the changelog is where that gets announced.',
} as const;
