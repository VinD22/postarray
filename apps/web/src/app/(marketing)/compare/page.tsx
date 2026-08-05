import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Badge } from '@relay/design-system/primitives';

import { Container, Heading, List, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { COMPARISON_AXES, COMPARISON_TARGETS } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.compare.title',
  'web.meta.compare.description',
  ROUTES.compare,
);

export default function ComparePage(): ReactNode {
  const t = marketingTranslator();
  const published = COMPARISON_TARGETS.filter((target) => target.href !== null);
  const planned = COMPARISON_TARGETS.filter((target) => target.href === null);

  return (
    <>
      <PageIntro title={t.t('web.compare.title')} lede={t.t('web.compare.lede')} />

      <Section id="rules">
        <Split aside={<Heading>{t.t('web.compare.rules.title')}</Heading>}>
          <List items={COMPARISON_AXES.map((key) => t.format(key))} />
          <p className="mt-6">
            <TextLink href={ROUTES.methodology}>{t.t('nav.public.methodology')}</TextLink>
          </p>
        </Split>
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
          <ul className="border-border-default border-t">
            {planned.map((target) => (
              <li
                key={target.id}
                className="border-border-subtle flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-4"
              >
                <span className="text-body-lg text-text-primary">{t.format(target.nameKey)}</span>
                <Badge>{t.t('web.compare.state.factCheckPending')}</Badge>
              </li>
            ))}
          </ul>
        </Split>
      </Section>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice />
        </div>
      </Container>
    </>
  );
}
