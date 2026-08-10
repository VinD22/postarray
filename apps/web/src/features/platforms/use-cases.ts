import type { MessageKey } from '@relay/i18n/translate';

/**
 * The three project-led use case pages.
 *
 * Three routes rather than three sections on one page, because each answers a
 * different search and each has its own honest "what is actually built"
 * paragraph. The shape is identical on purpose: a problem, three design
 * points, and what exists today. A page that cannot fill all five slots does
 * not get written.
 *
 * Like the platform pages, this module does not import the site map. The site
 * map reads these slugs to register the routes.
 */

export interface UseCasePage {
  readonly slug: string;
  readonly metaTitleKey: MessageKey;
  readonly metaDescriptionKey: MessageKey;
  readonly titleKey: MessageKey;
  readonly ledeKey: MessageKey;
  readonly problemKey: MessageKey;
  /** Exactly three. A fourth belongs on the product page, not here. */
  readonly approachKeys: readonly [MessageKey, MessageKey, MessageKey];
  /** The paragraph that says what is built and what is not. Never optional. */
  readonly todayKey: MessageKey;
}

export const USE_CASE_PAGES: readonly UseCasePage[] = [
  {
    slug: 'multiple-clients',
    metaTitleKey: 'web.meta.useCase.clients.title',
    metaDescriptionKey: 'web.meta.useCase.clients.description',
    titleKey: 'web.useCases.clients.title',
    ledeKey: 'web.useCases.clients.lede',
    problemKey: 'web.useCases.clients.problem',
    approachKeys: [
      'web.useCases.clients.approach1',
      'web.useCases.clients.approach2',
      'web.useCases.clients.approach3',
    ],
    todayKey: 'web.useCases.clients.today',
  },
  {
    slug: 'approval-workflows',
    metaTitleKey: 'web.meta.useCase.approvals.title',
    metaDescriptionKey: 'web.meta.useCase.approvals.description',
    titleKey: 'web.useCases.approvals.title',
    ledeKey: 'web.useCases.approvals.lede',
    problemKey: 'web.useCases.approvals.problem',
    approachKeys: [
      'web.useCases.approvals.approach1',
      'web.useCases.approvals.approach2',
      'web.useCases.approvals.approach3',
    ],
    todayKey: 'web.useCases.approvals.today',
  },
  {
    slug: 'cross-platform-publishing',
    metaTitleKey: 'web.meta.useCase.crossPlatform.title',
    metaDescriptionKey: 'web.meta.useCase.crossPlatform.description',
    titleKey: 'web.useCases.crossPlatform.title',
    ledeKey: 'web.useCases.crossPlatform.lede',
    problemKey: 'web.useCases.crossPlatform.problem',
    approachKeys: [
      'web.useCases.crossPlatform.approach1',
      'web.useCases.crossPlatform.approach2',
      'web.useCases.crossPlatform.approach3',
    ],
    todayKey: 'web.useCases.crossPlatform.today',
  },
];

export const USE_CASE_SLUGS: readonly string[] = USE_CASE_PAGES.map((page) => page.slug);

const BY_SLUG = new Map(USE_CASE_PAGES.map((page) => [page.slug, page]));

export function findUseCasePage(slug: string): UseCasePage | undefined {
  return BY_SLUG.get(slug);
}
