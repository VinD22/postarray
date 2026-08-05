import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Badge } from '@relay/design-system/primitives';

import { Heading, List, Section, Split, Subheading } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { DOC_PRINCIPLES, DOC_SECTIONS } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.docs.title',
  'web.meta.docs.description',
  ROUTES.docs,
);

export default function DocsPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.docs.title')} lede={t.t('web.docs.lede')} />

      <Section id="sections">
        <ul className="border-border-default border-t">
          {DOC_SECTIONS.map((section) => (
            <li
              key={section.id}
              className="border-border-subtle grid gap-x-12 gap-y-2 border-b py-7 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <Subheading as="h2">
                  {section.href ? (
                    <TextLink href={section.href}>{t.format(section.titleKey)}</TextLink>
                  ) : (
                    t.format(section.titleKey)
                  )}
                </Subheading>
              </div>
              <div className="min-w-0 space-y-2 lg:col-span-7 lg:col-start-6">
                <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
                  {t.format(section.bodyKey)}
                </p>
                {section.href ? null : (
                  <p className="flex flex-wrap items-center gap-2">
                    <Badge>{t.t('web.docs.pending')}</Badge>
                    <span className="text-body-md text-text-tertiary max-w-[60ch] leading-[1.6]">
                      {t.t('web.docs.pendingBody')}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="guarantees">
        <Split aside={<Heading>{t.t('web.docs.principles.title')}</Heading>}>
          <List items={DOC_PRINCIPLES.map((key) => t.format(key))} />
          <p className="mt-6">
            <TextLink href={ROUTES.apiTerms}>{t.t('web.legal.apiTerms.title')}</TextLink>
          </p>
        </Split>
      </Section>
    </>
  );
}
