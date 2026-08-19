import type { MessageKey } from '@relay/i18n/translate';

import { COMPARISON_SLUGS, comparisonPath } from '@/features/comparisons/slugs';
import { PLATFORM_SLUGS } from '@/features/platforms/registry';
import { USE_CASE_PAGES } from '@/features/platforms/use-cases';
import { SPEC_PAIRS, SPEC_PLATFORM_SLUGS } from '@/features/specs/registry';
import { CHARACTER_COUNTER_SLUGS } from '@/features/tools/character-counter';

/**
 * The public site map, in one place.
 *
 * Every route the marketing surface owns is declared here with the catalog key
 * that names it, so the header, the footer, the resources index and the
 * sitemap cannot drift apart, and so a renamed page is one edit.
 */

export interface SiteLink {
  readonly href: string;
  readonly labelKey: MessageKey;
  /** Optional one line description, used by index pages, never by the header. */
  readonly descriptionKey?: MessageKey;
}

export const ROUTES = {
  home: '/',
  product: '/product',
  demo: '/demo',
  integrations: '/integrations',
  capabilities: '/integrations/capabilities',
  creators: '/for-creators',
  agencies: '/for-agencies',
  developers: '/for-developers',
  pricing: '/pricing',
  resources: '/resources',
  status: '/status',
  changelog: '/changelog',
  docs: '/docs',
  methodology: '/methodology',
  compare: '/compare',
  toolRadar: '/tool-radar',
  opportunities: '/opportunities',
  /** The blog index. Individual articles are `/blog/<slug>`, driven by the
   *  registry in `features/blog`, and appear in the sitemap from there. */
  blog: '/blog',
  /** The per platform scheduler index. One child page per cohort platform,
   *  driven by the generated dataset in `features/platforms`. */
  schedule: '/schedule',
  /** The use case index. Three children, driven by `features/platforms`. */
  useCases: '/use-cases',
  /** The generated post specs cluster. `/specs/<platform>/<constraint>`, one
   *  page per value the publishing-limits dataset actually carries. */
  specs: '/specs',
  /** The free tools index. Each tool below is its own indexable page. */
  tools: '/tools',
  toolPostPreflight: '/tools/post-preflight',
  toolUtmBuilder: '/tools/utm-builder',
  toolYouTubeTitle: '/tools/youtube-title-length',
  toolTimeZonePlanner: '/tools/time-zone-planner',
  toolEngagementRate: '/tools/engagement-rate',
  /** The consolidated media limits table. One page, every platform. */
  toolImageSizes: '/tools/social-media-image-sizes',
  toolThreadSplitter: '/tools/thread-splitter',
  toolHashtagCounter: '/tools/hashtag-counter',
  toolCaseConverter: '/tools/case-converter',
  toolInvisibleCharacter: '/tools/invisible-character',
  toolVideoScriptTimer: '/tools/video-script-timer',
  legal: '/legal',
  terms: '/legal/terms',
  privacy: '/legal/privacy',
  acceptableUse: '/legal/acceptable-use',
  aiUse: '/legal/ai-use',
  cookies: '/legal/cookies',
  subprocessors: '/legal/subprocessors',
  refunds: '/legal/refunds',
  dmca: '/legal/dmca',
  security: '/legal/security',
  accessibility: '/legal/accessibility',
  apiTerms: '/legal/api-terms',
  affiliateTerms: '/legal/affiliate-terms',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

/**
 * Every indexable route owned by the marketing surface.
 *
 * Sign-in and sign-up share the public origin but belong to the auth surface,
 * which is intentionally noindexed. Keeping this derived from `ROUTES` makes
 * the sitemap follow the source-of-truth route map as pages are added.
 */
/** `/schedule/instagram`, and so on for every platform in the cohort. */
export function schedulePlatformPath(slug: string): string {
  return `${ROUTES.schedule}/${slug}`;
}

/** `/use-cases/approval-workflows`, and so on. */
export function toUseCasePath(slug: string): string {
  return `${ROUTES.useCases}/${slug}`;
}

/** `/specs/instagram`, for a platform the limits dataset actually has values for. */
export function specsPlatformPath(slug: string): string {
  return `${ROUTES.specs}/${slug}`;
}

/** `/specs/instagram/image-size`, for one recorded value. */
export function specsConstraintPath(platformSlug: string, constraintSlug: string): string {
  return `${ROUTES.specs}/${platformSlug}/${constraintSlug}`;
}

/**
 * `/tools/character-counter/instagram`, for a platform the limits dataset
 * carries a body text ceiling for.
 *
 * The base segment has no page of its own on purpose. The tools index is the
 * hub for this cluster, and a second index listing the same nine pages would
 * be a duplicate of it.
 */
export function characterCounterPath(slug: string): string {
  return `${ROUTES.tools}/character-counter/${slug}`;
}

/**
 * The platform and use case children, derived rather than listed.
 *
 * Adding a platform to the launch cohort regenerates the limits dataset, which
 * adds a page here, which adds a sitemap entry. There is no second list to
 * forget.
 */
export const SCHEDULE_PLATFORM_ROUTES: readonly string[] = PLATFORM_SLUGS.map(schedulePlatformPath);

/**
 * The specs cluster, derived the same way and for the same reason.
 *
 * `features/specs/registry` decides which pages exist by asking the generated
 * dataset for a value, so a platform or a constraint with nothing recorded
 * never reaches the sitemap. Regenerating the dataset is the only way to add
 * or remove an entry here.
 */
export const SPEC_PLATFORM_ROUTES: readonly string[] = SPEC_PLATFORM_SLUGS.map(specsPlatformPath);

export const SPEC_CONSTRAINT_ROUTES: readonly string[] = SPEC_PAIRS.map((pair) =>
  specsConstraintPath(pair.platform, pair.constraint),
);

/**
 * One character counter per platform with a recorded body text ceiling.
 *
 * Derived the same way and for the same reason as the specs cluster:
 * `features/tools/character-counter` asks the generated dataset for a ceiling,
 * so a platform with none never reaches the sitemap and never gets a page that
 * would have nothing to count against.
 */
export const CHARACTER_COUNTER_ROUTES: readonly string[] =
  CHARACTER_COUNTER_SLUGS.map(characterCounterPath);

/**
 * One indexable page per published comparison.
 *
 * Derived from `features/comparisons/slugs.ts`, which imports nothing, so the
 * sitemap follows the registry without this module reaching into comparison
 * content and without an import cycle back through `ROUTES`.
 */
export const COMPARISON_PAGE_ROUTES: readonly string[] = COMPARISON_SLUGS.map(comparisonPath);

export const USE_CASE_LINKS: readonly SiteLink[] = USE_CASE_PAGES.map((page) => ({
  href: toUseCasePath(page.slug),
  labelKey: page.titleKey,
  descriptionKey: page.ledeKey,
}));

export const MARKETING_ROUTES = [
  ...Object.values(ROUTES).filter((route) => route !== ROUTES.signIn && route !== ROUTES.signUp),
  ...SCHEDULE_PLATFORM_ROUTES,
  ...USE_CASE_LINKS.map((link) => link.href),
  ...COMPARISON_PAGE_ROUTES,
  ...SPEC_PLATFORM_ROUTES,
  ...SPEC_CONSTRAINT_ROUTES,
  ...CHARACTER_COUNTER_ROUTES,
];

/** The seven navigation items, in the order the IA specifies. */
export const PRIMARY_NAV: readonly SiteLink[] = [
  { href: ROUTES.product, labelKey: 'nav.public.product' },
  { href: ROUTES.integrations, labelKey: 'nav.public.integrations' },
  { href: ROUTES.creators, labelKey: 'nav.public.forCreators' },
  { href: ROUTES.agencies, labelKey: 'nav.public.forAgencies' },
  { href: ROUTES.developers, labelKey: 'nav.public.forDevelopers' },
  { href: ROUTES.pricing, labelKey: 'nav.public.pricing' },
  { href: ROUTES.resources, labelKey: 'nav.public.resources' },
];

export const RESOURCE_LINKS: readonly SiteLink[] = [
  {
    href: ROUTES.status,
    labelKey: 'nav.public.status',
    descriptionKey: 'web.resources.status.body',
  },
  {
    href: ROUTES.changelog,
    labelKey: 'nav.public.changelog',
    descriptionKey: 'web.resources.changelog.body',
  },
  {
    href: ROUTES.docs,
    labelKey: 'nav.public.docs',
    descriptionKey: 'web.resources.docs.body',
  },
  {
    href: ROUTES.capabilities,
    labelKey: 'nav.public.capabilities',
    descriptionKey: 'web.resources.capabilities.body',
  },
  {
    href: ROUTES.methodology,
    labelKey: 'nav.public.methodology',
    descriptionKey: 'web.resources.methodology.body',
  },
  {
    href: ROUTES.compare,
    labelKey: 'nav.public.comparisons',
    descriptionKey: 'web.resources.compare.body',
  },
  {
    href: ROUTES.toolRadar,
    labelKey: 'web.meta.toolRadar.title',
    descriptionKey: 'web.resources.toolRadar.body',
  },
  {
    href: ROUTES.opportunities,
    labelKey: 'web.meta.opportunities.title',
    descriptionKey: 'web.resources.opportunities.body',
  },
  {
    href: ROUTES.tools,
    labelKey: 'web.tools.index.title',
    descriptionKey: 'web.tools.index.summary',
  },
  {
    href: ROUTES.specs,
    labelKey: 'web.specs.index.title',
    descriptionKey: 'web.specs.index.lede',
  },
];

/**
 * The free tools, in the order the index presents them.
 *
 * Declared here rather than in the tools feature so the index page, the footer
 * and the sitemap read one list. Adding a tool is a route, an entry here and a
 * page; nothing else has to be remembered.
 */
export const TOOL_LINKS: readonly SiteLink[] = [
  {
    href: ROUTES.toolPostPreflight,
    labelKey: 'web.tools.preflight.name',
    descriptionKey: 'web.tools.preflight.summary',
  },
  {
    href: ROUTES.toolUtmBuilder,
    labelKey: 'web.tools.utm.name',
    descriptionKey: 'web.tools.utm.summary',
  },
  {
    href: ROUTES.toolYouTubeTitle,
    labelKey: 'web.tools.youtubeTitle.name',
    descriptionKey: 'web.tools.youtubeTitle.summary',
  },
  {
    href: ROUTES.toolTimeZonePlanner,
    labelKey: 'web.tools.timeZone.name',
    descriptionKey: 'web.tools.timeZone.summary',
  },
  {
    href: ROUTES.toolEngagementRate,
    labelKey: 'web.tools.engagementRate.name',
    descriptionKey: 'web.tools.engagementRate.summary',
  },
  {
    href: ROUTES.toolImageSizes,
    labelKey: 'web.toolDirectory.media.name',
    descriptionKey: 'web.toolDirectory.media.summary',
  },
  {
    href: ROUTES.toolThreadSplitter,
    labelKey: 'web.toolDirectory.threadSplitter.name',
    descriptionKey: 'web.toolDirectory.threadSplitter.summary',
  },
  {
    href: ROUTES.toolHashtagCounter,
    labelKey: 'web.toolDirectory.hashtagCounter.name',
    descriptionKey: 'web.toolDirectory.hashtagCounter.summary',
  },
  {
    href: ROUTES.toolCaseConverter,
    labelKey: 'web.toolDirectory.caseConverter.name',
    descriptionKey: 'web.toolDirectory.caseConverter.summary',
  },
  {
    href: ROUTES.toolInvisibleCharacter,
    labelKey: 'web.toolDirectory.invisibleCharacter.name',
    descriptionKey: 'web.toolDirectory.invisibleCharacter.summary',
  },
  {
    href: ROUTES.toolVideoScriptTimer,
    labelKey: 'web.toolDirectory.videoScriptTimer.name',
    descriptionKey: 'web.toolDirectory.videoScriptTimer.summary',
  },
];

/**
 * The legal suite. `counselPending` marks a document whose binding wording has
 * to be drafted by a lawyer for the final entity and jurisdiction. The page
 * still carries the substantive, already true product behaviour.
 */
export interface LegalDocument extends SiteLink {
  readonly summaryKey: MessageKey;
  readonly counselPending: boolean;
  /** ISO date the substantive content was last reviewed by the product team. */
  readonly reviewed: string;
}

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  {
    href: ROUTES.terms,
    labelKey: 'web.legal.terms.title',
    summaryKey: 'web.legal.terms.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.privacy,
    labelKey: 'web.legal.privacy.title',
    summaryKey: 'web.legal.privacy.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.acceptableUse,
    labelKey: 'web.legal.aup.title',
    summaryKey: 'web.legal.aup.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.aiUse,
    labelKey: 'web.legal.ai.title',
    summaryKey: 'web.legal.ai.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.cookies,
    labelKey: 'web.legal.cookies.title',
    summaryKey: 'web.legal.cookies.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.subprocessors,
    labelKey: 'web.legal.subprocessors.title',
    summaryKey: 'web.legal.subprocessors.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.refunds,
    labelKey: 'web.legal.refunds.title',
    summaryKey: 'web.legal.refunds.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.dmca,
    labelKey: 'web.legal.dmca.title',
    summaryKey: 'web.legal.dmca.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.security,
    labelKey: 'web.legal.security.title',
    summaryKey: 'web.legal.security.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.accessibility,
    labelKey: 'web.legal.accessibility.title',
    summaryKey: 'web.legal.accessibility.summary',
    counselPending: false,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.apiTerms,
    labelKey: 'web.legal.apiTerms.title',
    summaryKey: 'web.legal.apiTerms.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
  {
    href: ROUTES.affiliateTerms,
    labelKey: 'web.legal.affiliate.title',
    summaryKey: 'web.legal.affiliate.summary',
    counselPending: true,
    reviewed: '2026-08-04',
  },
];

export const FOOTER_COLUMNS: readonly {
  readonly titleKey: MessageKey;
  readonly links: readonly SiteLink[];
}[] = [
  {
    titleKey: 'web.footer.product',
    links: [
      { href: ROUTES.product, labelKey: 'nav.public.product' },
      { href: ROUTES.integrations, labelKey: 'nav.public.integrations' },
      { href: ROUTES.capabilities, labelKey: 'nav.public.capabilities' },
      { href: ROUTES.schedule, labelKey: 'web.schedule.index.title' },
      { href: ROUTES.specs, labelKey: 'web.specs.index.title' },
      { href: ROUTES.pricing, labelKey: 'nav.public.pricing' },
    ],
  },
  {
    titleKey: 'web.footer.company',
    links: [
      { href: ROUTES.creators, labelKey: 'nav.public.forCreators' },
      { href: ROUTES.agencies, labelKey: 'nav.public.forAgencies' },
      { href: ROUTES.useCases, labelKey: 'web.useCases.index.title' },
      { href: ROUTES.methodology, labelKey: 'nav.public.methodology' },
      { href: ROUTES.compare, labelKey: 'nav.public.comparisons' },
    ],
  },
  {
    titleKey: 'web.footer.developers',
    links: [
      { href: ROUTES.developers, labelKey: 'nav.public.forDevelopers' },
      { href: ROUTES.docs, labelKey: 'nav.public.docs' },
      { href: ROUTES.apiTerms, labelKey: 'web.legal.apiTerms.title' },
      { href: ROUTES.status, labelKey: 'nav.public.status' },
    ],
  },
  {
    titleKey: 'web.footer.resources',
    links: [
      { href: ROUTES.changelog, labelKey: 'nav.public.changelog' },
      { href: ROUTES.toolRadar, labelKey: 'web.meta.toolRadar.title' },
      { href: ROUTES.opportunities, labelKey: 'web.meta.opportunities.title' },
      { href: ROUTES.tools, labelKey: 'web.tools.index.title' },
      { href: ROUTES.resources, labelKey: 'nav.public.resources' },
    ],
  },
  {
    titleKey: 'web.footer.legal',
    links: [
      { href: ROUTES.terms, labelKey: 'nav.public.terms' },
      { href: ROUTES.privacy, labelKey: 'nav.public.privacy' },
      { href: ROUTES.acceptableUse, labelKey: 'nav.public.acceptableUse' },
      { href: ROUTES.security, labelKey: 'nav.public.security' },
      { href: ROUTES.legal, labelKey: 'web.legal.title' },
    ],
  },
];

export const LOCAL_SITE_ORIGIN = 'http://localhost:3000';

/** Only the two variables the origin depends on, so the check is testable. */
export interface SiteOriginEnv {
  readonly NEXT_PUBLIC_SITE_ORIGIN?: string | undefined;
  readonly NODE_ENV?: string | undefined;
}

/**
 * The public origin every canonical URL, hreflang alternate and sitemap entry
 * is built from.
 *
 * A missing value used to fall back to localhost everywhere, which is harmless
 * on a laptop and silently corrupting in production: a deploy with the variable
 * unset ships `http://localhost:3000` canonicals, telling search engines that
 * the real pages are duplicates of a host nobody can reach. There is no way to
 * notice that from inside the running app, so a production build that cannot
 * name its own origin fails here at module load instead.
 *
 * Development and test keep the localhost fallback, so a local build stays
 * reproducible without a `.env` file.
 */
export function resolveSiteOrigin(env: SiteOriginEnv = process.env): string {
  const configured = env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ?? '';
  const usable = configured !== '' && !configured.includes('localhost');
  if (env.NODE_ENV === 'production' && !usable) {
    throw new Error(
      'NEXT_PUBLIC_SITE_ORIGIN must be set to the public HTTPS origin for a production build. ' +
        `Received ${configured === '' ? 'no value' : `"${configured}"`}. ` +
        'A localhost canonical, hreflang or sitemap URL must never ship.',
    );
  }
  return configured === '' ? LOCAL_SITE_ORIGIN : configured;
}

export const SITE_ORIGIN = resolveSiteOrigin();
