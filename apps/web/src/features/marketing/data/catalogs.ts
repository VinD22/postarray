import type { MessageKey } from '@relay/i18n/translate';

import { ROUTES } from '../site';

/**
 * The editorial catalogs behind the resources pages.
 *
 * Three of them are deliberately empty: the changelog, the comparison set, the
 * tool radar and the opportunity catalog. Each has an editorial standard a
 * record must meet before it can appear, and none of those standards can be
 * met by writing plausible sounding entries here. The pages render an honest
 * empty state and describe the standard instead.
 */

/* -------------------------------------------------------------------------- */
/* Changelog                                                                   */
/* -------------------------------------------------------------------------- */

export type ChangelogKind =
  'shipped' | 'changed' | 'fixed' | 'connector' | 'correction' | 'security';

export const CHANGELOG_KIND_LABEL_KEY: Readonly<Record<ChangelogKind, MessageKey>> = {
  shipped: 'web.changelog.kind.shipped',
  changed: 'web.changelog.kind.changed',
  fixed: 'web.changelog.kind.fixed',
  connector: 'web.changelog.kind.connector',
  correction: 'web.changelog.kind.correction',
  security: 'web.changelog.kind.security',
};

export interface ChangelogEntry {
  readonly id: string;
  readonly date: string;
  readonly kind: ChangelogKind;
  readonly title: string;
  readonly body: string;
  readonly href?: string;
}

/** Fills from real releases. The first entry is the first shipped thing. */
export const CHANGELOG: readonly ChangelogEntry[] = [];

/* -------------------------------------------------------------------------- */
/* Comparisons                                                                 */
/* -------------------------------------------------------------------------- */

export interface ComparisonTarget {
  readonly id: string;
  readonly nameKey: MessageKey;
  /** Set once the page publishes. Null while the fact check is in progress. */
  readonly href: string | null;
}

export const COMPARISON_TARGETS: readonly ComparisonTarget[] = [
  { id: 'postiz', nameKey: 'web.compare.product.postiz', href: null },
  { id: 'buffer', nameKey: 'web.compare.product.buffer', href: null },
  { id: 'hootsuite', nameKey: 'web.compare.product.hootsuite', href: null },
  { id: 'later', nameKey: 'web.compare.product.later', href: null },
  { id: 'metricool', nameKey: 'web.compare.product.metricool', href: null },
  { id: 'publer', nameKey: 'web.compare.product.publer', href: null },
  { id: 'socialbee', nameKey: 'web.compare.product.socialbee', href: null },
  { id: 'typefully', nameKey: 'web.compare.product.typefully', href: null },
  { id: 'publishing-apis', nameKey: 'web.compare.product.publishingApis', href: null },
];

export const COMPARISON_AXES: readonly MessageKey[] = [
  'web.compare.rules.bestFor',
  'web.compare.rules.dated',
  'web.compare.rules.distinction',
  'web.compare.rules.axes',
  'web.compare.rules.correction',
];

/* -------------------------------------------------------------------------- */
/* Creative tool radar                                                         */
/* -------------------------------------------------------------------------- */

export interface RadarCategory {
  readonly id: string;
  readonly nameKey: MessageKey;
}

export const RADAR_CATEGORIES: readonly RadarCategory[] = [
  { id: 'video', nameKey: 'web.toolRadar.category.video' },
  { id: 'image', nameKey: 'web.toolRadar.category.image' },
  { id: 'audio', nameKey: 'web.toolRadar.category.audio' },
  { id: 'ugc', nameKey: 'web.toolRadar.category.ugc' },
  { id: 'clipping', nameKey: 'web.toolRadar.category.clipping' },
  { id: 'design', nameKey: 'web.toolRadar.category.design' },
  { id: 'research', nameKey: 'web.toolRadar.category.research' },
  { id: 'workflow', nameKey: 'web.toolRadar.category.workflow' },
];

export interface RadarRecord {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly officialUrl: string;
  readonly useCase: string;
  readonly limitations: string;
  readonly pricingModel: string;
  readonly rightsCaveat: string;
  readonly affiliate: boolean;
  readonly lastVerified: string;
  readonly nextReview: string;
}

/** Populated by an editor from vendor documentation. Never by a model. */
export const RADAR_RECORDS: readonly RadarRecord[] = [];

export const RADAR_REQUIREMENTS: readonly MessageKey[] = [
  'web.toolRadar.record.url',
  'web.toolRadar.record.useCase',
  'web.toolRadar.record.pricing',
  'web.toolRadar.record.rights',
  'web.toolRadar.record.disclosure',
  'web.toolRadar.record.verified',
];

/* -------------------------------------------------------------------------- */
/* Promotion opportunities                                                     */
/* -------------------------------------------------------------------------- */

export interface OpportunityCategory {
  readonly id: string;
  readonly nameKey: MessageKey;
}

export const OPPORTUNITY_CATEGORIES: readonly OpportunityCategory[] = [
  { id: 'launch', nameKey: 'web.opportunities.category.launch' },
  { id: 'review', nameKey: 'web.opportunities.category.review' },
  { id: 'marketplace', nameKey: 'web.opportunities.category.marketplace' },
  { id: 'community', nameKey: 'web.opportunities.category.community' },
  { id: 'partner', nameKey: 'web.opportunities.category.partner' },
  { id: 'editorial', nameKey: 'web.opportunities.category.editorial' },
  { id: 'openSource', nameKey: 'web.opportunities.category.openSource' },
];

export interface OpportunityRecord {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly officialUrl: string;
  readonly audience: string;
  readonly submissionRules: string;
  readonly effort: string;
  readonly cost: string;
  readonly disclosureRequired: boolean;
  readonly lastVerified: string;
}

export const OPPORTUNITY_RECORDS: readonly OpportunityRecord[] = [];

export const OPPORTUNITY_RULES: readonly MessageKey[] = [
  'web.opportunities.rules.curated',
  'web.opportunities.rules.noAutomation',
  'web.opportunities.rules.noGuarantee',
  'web.opportunities.rules.stale',
];

/* -------------------------------------------------------------------------- */
/* Documentation shell                                                         */
/* -------------------------------------------------------------------------- */

export interface DocSection {
  readonly id: string;
  readonly titleKey: MessageKey;
  readonly bodyKey: MessageKey;
  /** Null while the section is written against an API that is not shipped. */
  readonly href: string | null;
}

export const DOC_SECTIONS: readonly DocSection[] = [
  {
    id: 'start',
    titleKey: 'web.docs.section.start.title',
    bodyKey: 'web.docs.section.start.body',
    href: null,
  },
  {
    id: 'api',
    titleKey: 'web.docs.section.api.title',
    bodyKey: 'web.docs.section.api.body',
    href: null,
  },
  {
    id: 'mcp',
    titleKey: 'web.docs.section.mcp.title',
    bodyKey: 'web.docs.section.mcp.body',
    href: null,
  },
  {
    id: 'cli',
    titleKey: 'web.docs.section.cli.title',
    bodyKey: 'web.docs.section.cli.body',
    href: null,
  },
  {
    id: 'webhooks',
    titleKey: 'web.docs.section.webhooks.title',
    bodyKey: 'web.docs.section.webhooks.body',
    href: null,
  },
  {
    id: 'connectors',
    titleKey: 'web.docs.section.connectors.title',
    bodyKey: 'web.docs.section.connectors.body',
    href: ROUTES.capabilities,
  },
  {
    id: 'errors',
    titleKey: 'web.docs.section.errors.title',
    bodyKey: 'web.docs.section.errors.body',
    href: null,
  },
];

export const DOC_PRINCIPLES: readonly MessageKey[] = [
  'web.docs.principles.idempotency',
  'web.docs.principles.errors',
  'web.docs.principles.versioning',
  'web.docs.principles.scopes',
];

/* -------------------------------------------------------------------------- */
/* Subprocessors and retention                                                 */
/* -------------------------------------------------------------------------- */

export interface Subprocessor {
  readonly id: string;
  readonly nameKey: MessageKey;
  readonly purposeKey: MessageKey;
  readonly dataKey: MessageKey;
  /** Null until the hosting region is confirmed with counsel. */
  readonly region: string | null;
  /** True when the vendor itself has not been selected yet. */
  readonly vendorPending: boolean;
}

export const SUBPROCESSORS: readonly Subprocessor[] = [
  {
    id: 'supabase',
    nameKey: 'web.legal.subprocessors.supabase.label',
    purposeKey: 'web.legal.subprocessors.supabase.purpose',
    dataKey: 'web.legal.subprocessors.supabase.data',
    region: null,
    vendorPending: false,
  },
  {
    id: 'temporal',
    nameKey: 'web.legal.subprocessors.temporal.label',
    purposeKey: 'web.legal.subprocessors.temporal.purpose',
    dataKey: 'web.legal.subprocessors.temporal.data',
    region: null,
    vendorPending: false,
  },
  {
    id: 'polar',
    nameKey: 'web.legal.subprocessors.polar.label',
    purposeKey: 'web.legal.subprocessors.polar.purpose',
    dataKey: 'web.legal.subprocessors.polar.data',
    region: null,
    vendorPending: false,
  },
  {
    id: 'deepseek',
    nameKey: 'web.legal.subprocessors.deepseek.label',
    purposeKey: 'web.legal.subprocessors.deepseek.purpose',
    dataKey: 'web.legal.subprocessors.deepseek.data',
    region: null,
    vendorPending: false,
  },
  {
    id: 'hosting',
    nameKey: 'web.legal.subprocessors.hosting.label',
    purposeKey: 'web.legal.subprocessors.hosting.purpose',
    dataKey: 'web.legal.subprocessors.hosting.data',
    region: null,
    vendorPending: true,
  },
  {
    id: 'email',
    nameKey: 'web.legal.subprocessors.email.label',
    purposeKey: 'web.legal.subprocessors.email.purpose',
    dataKey: 'web.legal.subprocessors.email.data',
    region: null,
    vendorPending: true,
  },
  {
    id: 'monitoring',
    nameKey: 'web.legal.subprocessors.monitoring.label',
    purposeKey: 'web.legal.subprocessors.monitoring.purpose',
    dataKey: 'web.legal.subprocessors.monitoring.data',
    region: null,
    vendorPending: true,
  },
];

export interface RetentionRow {
  readonly id: string;
  readonly dataKey: MessageKey;
  readonly periodKey: MessageKey;
}

export const RETENTION_SCHEDULE: readonly RetentionRow[] = [
  {
    id: 'credentials',
    dataKey: 'web.legal.retention.credentials.label',
    periodKey: 'web.legal.retention.credentials.period',
  },
  {
    id: 'oauthState',
    dataKey: 'web.legal.retention.oauthState.label',
    periodKey: 'web.legal.retention.oauthState.period',
  },
  {
    id: 'drafts',
    dataKey: 'web.legal.retention.drafts.label',
    periodKey: 'web.legal.retention.drafts.period',
  },
  {
    id: 'receipts',
    dataKey: 'web.legal.retention.receipts.label',
    periodKey: 'web.legal.retention.receipts.period',
  },
  {
    id: 'rawProvider',
    dataKey: 'web.legal.retention.rawProvider.label',
    periodKey: 'web.legal.retention.rawProvider.period',
  },
  {
    id: 'metrics',
    dataKey: 'web.legal.retention.metrics.label',
    periodKey: 'web.legal.retention.metrics.period',
  },
  {
    id: 'securityLogs',
    dataKey: 'web.legal.retention.securityLogs.label',
    periodKey: 'web.legal.retention.securityLogs.period',
  },
  {
    id: 'billing',
    dataKey: 'web.legal.retention.billing.label',
    periodKey: 'web.legal.retention.billing.period',
  },
  {
    id: 'deletedAccount',
    dataKey: 'web.legal.retention.deletedAccount.label',
    periodKey: 'web.legal.retention.deletedAccount.period',
  },
  {
    id: 'backups',
    dataKey: 'web.legal.retention.backups.label',
    periodKey: 'web.legal.retention.backups.period',
  },
];
