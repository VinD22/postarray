import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Badge } from '@relay/design-system/primitives';

import { Meta, Section } from '@/features/marketing/components/layout';
import { RowLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { LEGAL_DOCUMENTS, ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.legal.title',
  'web.meta.legal.description',
  ROUTES.legal,
);

export default function LegalIndexPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.legal.title')} lede={t.t('web.legal.lede')} />

      <Section id="documents">
        <ul className="border-t border-border-default">
          {LEGAL_DOCUMENTS.map((doc) => (
            <RowLink
              key={doc.href}
              href={doc.href}
              title={t.format(doc.labelKey)}
              description={t.format(doc.summaryKey)}
              meta={
                <span className="flex flex-wrap items-center gap-3">
                  <Meta>{t.t('web.legal.index.updated', { date: formatDate(doc.reviewed) })}</Meta>
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
