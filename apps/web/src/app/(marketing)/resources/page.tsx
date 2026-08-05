import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Heading, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { RESOURCE_LINKS, ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.resources.title',
  'web.meta.resources.description',
  ROUTES.resources,
);

export default function ResourcesPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.resources.title')} lede={t.t('web.resources.lede')} />

      <Section id="index">
        <ul className="border-t border-border-default">
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
    </>
  );
}
