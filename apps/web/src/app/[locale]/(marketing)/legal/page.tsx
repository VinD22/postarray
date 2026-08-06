import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Badge } from '@relay/design-system/primitives';

import { Reveal } from '@/components/motion';
import { Lede, Meta, Section } from '@/features/marketing/components/layout';
import { Band } from '@/features/marketing/components/loud/band';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { RowLink } from '@/features/marketing/components/links';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { LEGAL_DOCUMENTS, ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.legal.title', 'web.meta.legal.description', ROUTES.legal, locale);
}

export default async function LegalIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <Band tone="paper">
        <Reveal className="max-w-[46rem]">
          <LoudDisplay as="h1" size="lg">
            {t.t('web.legal.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.legal.lede')}</Lede>
        </Reveal>
      </Band>

      <Section id="documents">
        <ul className="border-border-bold border-t-2">
          {LEGAL_DOCUMENTS.map((doc) => (
            <RowLink
              key={doc.href}
              href={doc.href}
              title={t.format(doc.labelKey)}
              description={t.format(doc.summaryKey)}
              meta={
                <span className="flex flex-wrap items-center gap-3">
                  <Meta>
                    {t.t('web.legal.index.updated', { date: formatDate(doc.reviewed, locale) })}
                  </Meta>
                  {doc.counselPending ? (
                    <Badge>{t.t('web.legal.counselPending.title')}</Badge>
                  ) : null}
                </span>
              }
            />
          ))}
        </ul>
      </Section>
    </>
  );
}
