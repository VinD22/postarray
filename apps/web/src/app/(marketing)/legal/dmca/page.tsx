import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.dmca.title',
  'web.legal.dmca.summary',
  ROUTES.dmca,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'scope',
    titleKey: 'web.legal.dmca.scope.title',
    bodyKeys: ['web.legal.dmca.scope.body'],
  },
  {
    id: 'notice',
    titleKey: 'web.legal.dmca.notice.title',
    bulletKeys: [
      'web.legal.dmca.notice.identify',
      'web.legal.dmca.notice.contact',
      'web.legal.dmca.notice.goodFaith',
      'web.legal.dmca.notice.accuracy',
      'web.legal.dmca.notice.signature',
    ],
  },
  {
    id: 'counter',
    titleKey: 'web.legal.dmca.counter.title',
    bodyKeys: ['web.legal.dmca.counter.body'],
  },
  {
    id: 'repeat',
    titleKey: 'web.legal.dmca.repeat.title',
    bodyKeys: ['web.legal.dmca.repeat.body'],
  },
];

export default function CopyrightPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.dmca.title"
      summaryKey="web.legal.dmca.summary"
      counselPending={true}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.copyright']}
    />
  );
}
