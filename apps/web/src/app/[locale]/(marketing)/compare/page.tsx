import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { StaggerList } from '@/components/motion';
import {
  ClosingCta,
  EditorialCard,
  EditorialDisplay,
  EditorialSection,
  EditorialVsTable,
  Eyebrow,
  type EditorialVsTableRow,
} from '@/features/marketing/components/editorial';
import { Container, Heading, Lede, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice } from '@/features/marketing/components/page-parts';
import { COMPARISON_AXES, COMPARISON_TARGETS } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.compare.title',
    'web.meta.compare.description',
    ROUTES.compare,
    locale,
  );
}

export default async function ComparePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);
  const published = COMPARISON_TARGETS.filter((target) => target.href !== null);
  const planned = COMPARISON_TARGETS.filter((target) => target.href === null);

  /**
   * Every axis this site's own comparison methodology commits to, as one
   * column for this product — the only column with real content behind it
   * right now (every `COMPARISON_TARGETS` entry still has `href: null`; see
   * `EditorialVsTable`'s own doc comment). A `true` cell states a real
   * commitment already published in `COMPARISON_AXES`, not a claim about any
   * competitor.
   */
  const rulesRows: readonly EditorialVsTableRow[] = COMPARISON_AXES.map((key) => ({
    id: key,
    label: t.format(key),
    cells: { relay: true },
  }));

  return (
    <>
      <EditorialSection reveal={false} containerClassName="py-24 md:py-32">
        <div className="max-w-[52rem]">
          <Eyebrow className="mb-6">{t.t('web.compare.v2.honest')}</Eyebrow>
          <EditorialDisplay as="h1" size="md" reveal>
            {t.t('web.compare.title')}
          </EditorialDisplay>
          <Lede className="mt-8">{t.t('web.compare.lede')}</Lede>
        </div>
      </EditorialSection>

      <EditorialSection rule id="rules" reveal={false}>
        <Heading className="max-w-[28ch]">{t.t('web.compare.rules.title')}</Heading>
        <div className="mt-10">
          <EditorialVsTable
            caption={t.t('web.compare.rules.title')}
            rowHeaderLabel={t.t('web.compare.rules.title')}
            columns={[{ id: 'relay', label: t.t('web.brand.name'), tone: 'own' }]}
            rows={rulesRows}
            trueLabel={t.t('common.yes')}
            falseLabel={t.t('common.no')}
          />
        </div>
        <p className="mt-8">
          <TextLink href={ROUTES.methodology}>{t.t('nav.public.methodology')}</TextLink>
        </p>
      </EditorialSection>

      <EditorialSection rule id="pages">
        {published.length === 0 ? (
          <EmptyState
            title={t.t('web.compare.empty')}
            description={t.t('web.compare.emptyBody')}
            example={t.t('web.methodology.comparison.distinction')}
          />
        ) : (
          <ul className="border-border-default border-t">
            {published.map((target) => (
              <RowLink
                key={target.id}
                href={target.href ?? ROUTES.compare}
                title={t.format(target.nameKey)}
              />
            ))}
          </ul>
        )}
      </EditorialSection>

      <EditorialSection rule id="planned" reveal={false}>
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.compare.planned.title')}</Heading>
              <p className="text-body-lg text-text-secondary max-w-[62ch] leading-[1.65]">
                {t.t('web.compare.planned.body')}
              </p>
            </div>
          }
        >
          <StaggerList stagger={0.07} className="grid gap-3 sm:grid-cols-2">
            {planned.map((target) => (
              <div key={target.id} data-stagger-item>
                {/* The fact-check state was a second rotated sticker inside a
                    poster card. It is a real state, so it survives as an
                    eyebrow; the rotation and the outline do not. */}
                <EditorialCard
                  interactive={false}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <span className="text-body-md text-text-primary">{t.format(target.nameKey)}</span>
                  <Eyebrow tone="muted">{t.t('web.compare.state.factCheckPending')}</Eyebrow>
                </EditorialCard>
              </div>
            ))}
          </StaggerList>
        </Split>
      </EditorialSection>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

      <ClosingCta
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />
    </>
  );
}
