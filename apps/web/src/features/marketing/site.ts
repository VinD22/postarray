import type { MessageKey } from '@relay/i18n/translate';

import { COMPARISON_SLUGS, comparisonPath } from '@/features/comparisons/slugs';
import { PLATFORM_SLUGS } from '@/features/platforms/registry';
import { USE_CASE_PAGES } from '@/features/platforms/use-cases';

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
  /** The free tools index. Each tool below is its own indexable page. */
  tools: '/tools',
  toolPostPreflight: '/tools/post-preflight',
  toolUtmBuilder: '/tools/utm-builder',
  toolYouTubeTitle: '/tools/youtube-title-length',
  toolTimeZonePlanner: '/tools/time-zone-planner',
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

/**
 * The platform and use case children, derived rather than listed.
 *
 * Adding a platform to the launch cohort regenerates the limits dataset, which
 * adds a page here, which adds a sitemap entry. There is no second list to
 * forget.
 */
export const SCHEDULE_PLATFORM_ROUTES: readonly string[] = PLATFORM_SLUGS.map(schedulePlatformPath);

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

/** Public origin. Deployments validate this separately; local builds stay reproducible. */
function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (configured !== undefined && configured.trim() !== '') return configured;
  return 'http://localhost:3000';
}

export const SITE_ORIGIN = resolveSiteOrigin();
