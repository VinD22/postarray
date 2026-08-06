import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Reveal, StaggerList } from '@/components/motion';
import { Container, Heading, Lede, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { Band } from '@/features/marketing/components/loud/band';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { Sticker } from '@/features/marketing/components/loud/sticker';
import { VsTable, type VsTableRow } from '@/features/marketing/components/loud/vs-table';
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
   * "Relay" column — the only column with real content behind it right now
   * (every `COMPARISON_TARGETS` entry still has `href: null`; see
   * `vs-table.tsx`'s own doc comment). A `true` cell states a real
   * commitment already published in `COMPARISON_AXES` above, not a claim
   * about any competitor.
   */
  const rulesRows: readonly VsTableRow[] = COMPARISON_AXES.map((key) => ({
    id: key,
    label: t.format(key),
    cells: { relay: true },
  }));

  return (
    <>
      <Band tone="paper">
        <Reveal className="max-w-[52rem]">
          <LoudDisplay as="h1" size="xl">
            {t.t('web.compare.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.compare.lede')}</Lede>
          <Sticker tone="pop" rotate={-3} className="mt-6">
            {t.t('web.compare.v2.honest')}
          </Sticker>
        </Reveal>
      </Band>

      <Section id="rules">
        <Heading className="max-w-[28ch]">{t.t('web.compare.rules.title')}</Heading>
        <div className="mt-8">
          <VsTable
            caption={t.t('web.compare.rules.title')}
            rowHeaderLabel={t.t('web.compare.rules.title')}
            columns={[{ id: 'relay', label: t.t('web.brand.name'), tone: 'cta' }]}
            rows={rulesRows}
            trueLabel={t.t('common.yes')}
            falseLabel={t.t('common.no')}
          />
        </div>
        <p className="mt-6">
          <TextLink href={ROUTES.methodology}>{t.t('nav.public.methodology')}</TextLink>
        </p>
      </Section>

      <Section id="pages">
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
      </Section>

      <Section id="planned">
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
          <StaggerList className="grid gap-3 sm:grid-cols-2">
            {planned.map((target) => (
              <div key={target.id} data-stagger-item>
                <PosterCard
                  tone="paper"
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <span className="text-body-md text-text-primary">{t.format(target.nameKey)}</span>
                  <Sticker tone="paper" rotate={0} className="shadow-none">
                    {t.t('web.compare.state.factCheckPending')}
                  </Sticker>
                </PosterCard>
              </div>
            ))}
          </StaggerList>
        </Split>
      </Section>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

      <CtaSlab
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />
    </>
  );
}
