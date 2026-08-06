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
    'web.legal.accessibility.title',
    'web.legal.accessibility.summary',
    ROUTES.accessibility,
    locale,
  );
}

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'standard',
    titleKey: 'web.legal.accessibility.standard.title',
    bodyKeys: ['web.legal.accessibility.standard.body'],
  },
  {
    id: 'measures',
    titleKey: 'web.legal.accessibility.measures.title',
    bulletKeys: [
      'web.legal.accessibility.measures.keyboard',
      'web.legal.accessibility.measures.contrast',
      'web.legal.accessibility.measures.colour',
      'web.legal.accessibility.measures.announcements',
      'web.legal.accessibility.measures.zoom',
      'web.legal.accessibility.measures.motion',
      'web.legal.accessibility.measures.targets',
    ],
  },
  {
    id: 'known',
    titleKey: 'web.legal.accessibility.known.title',
    bodyKeys: ['web.legal.accessibility.known.body'],
  },
  {
    id: 'feedback',
    titleKey: 'web.legal.accessibility.feedback.title',
    bodyKeys: ['web.legal.accessibility.feedback.body'],
  },
];

export default async function AccessibilityPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      titleKey="web.legal.accessibility.title"
      summaryKey="web.legal.accessibility.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.accessibility']}
    />
  );
}
