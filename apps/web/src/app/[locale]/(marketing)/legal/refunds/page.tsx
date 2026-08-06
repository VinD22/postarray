import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.legal.refunds.title',
    'web.legal.refunds.summary',
    ROUTES.refunds,
    locale,
  );
}

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'cancel',
    titleKey: 'web.legal.refunds.cancel.title',
    bodyKeys: ['web.legal.refunds.cancel.body'],
  },
  {
    id: 'refund',
    titleKey: 'web.legal.refunds.refund.title',
    bodyKeys: ['web.legal.refunds.refund.body'],
  },
  {
    id: 'usage',
    titleKey: 'web.legal.refunds.usage.title',
    bodyKeys: ['web.legal.refunds.usage.body'],
  },
  {
    id: 'failed',
    titleKey: 'web.legal.refunds.failed.title',
    bodyKeys: ['web.legal.refunds.failed.body'],
  },
  {
    id: 'data',
    titleKey: 'web.legal.refunds.data.title',
    bodyKeys: ['web.legal.refunds.data.body'],
  },
];

export default async function RefundPolicyPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      titleKey="web.legal.refunds.title"
      summaryKey="web.legal.refunds.summary"
      counselPending={true}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.legal']}
    />
  );
}
