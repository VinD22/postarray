import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Heading, Lede, Section, Split } from '@/features/marketing/components/layout';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { RESOURCE_LINKS, ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.resources.title',
    'web.meta.resources.description',
    ROUTES.resources,
    locale,
  );
}

export default async function ResourcesPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.resources.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.resources.lede')}</Lede>
        </div>
      </EditorialSection>

      <Section id="index">
        <ul className="border-border-bold border-t-2">
          {RESOURCE_LINKS.map((link) => (
            <RowLink
              key={link.href}
              href={link.href}
              title={t.format(link.labelKey)}
              description={link.descriptionKey ? t.format(link.descriptionKey) : undefined}
            />
          ))}
          <RowLink
            href={ROUTES.legal}
            title={t.t('web.legal.title')}
            description={t.t('web.resources.legal.body')}
          />
        </ul>
      </Section>

      <Section id="guides">
        <Split aside={<Heading>{t.t('web.resources.guides.title')}</Heading>}>
          <EmptyState
            title={t.t('web.resources.guides.empty')}
            description={t.t('web.resources.guides.emptyBody')}
            example={t.t('web.methodology.claims.body')}
            action={
              <TextLink href={ROUTES.methodology} className="text-body-md">
                {t.t('nav.public.methodology')}
              </TextLink>
            }
          />
        </Split>
      </Section>

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
