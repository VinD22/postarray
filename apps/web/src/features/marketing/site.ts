import type { MessageKey } from '@relay/i18n/translate';

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
export const MARKETING_ROUTES = Object.values(ROUTES).filter(
  (route) => route !== ROUTES.signIn && route !== ROUTES.signUp,
);

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
      { href: ROUTES.pricing, labelKey: 'nav.public.pricing' },
    ],
  },
  {
    titleKey: 'web.footer.company',
    links: [
      { href: ROUTES.creators, labelKey: 'nav.public.forCreators' },
      { href: ROUTES.agencies, labelKey: 'nav.public.forAgencies' },
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
