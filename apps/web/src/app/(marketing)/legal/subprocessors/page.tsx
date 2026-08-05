import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { SubprocessorTable } from '@/features/marketing/components/legal-tables';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.subprocessors.title',
  'web.legal.subprocessors.summary',
  ROUTES.subprocessors,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'list',
    titleKey: 'web.legal.privacy.subprocessors.title',
    content: <SubprocessorTable />,
  },
  {
    id: 'notice',
    titleKey: 'web.legal.subprocessors.notice.title',
    bodyKeys: ['web.legal.subprocessors.notice.body'],
  },
  {
    id: 'platforms',
    titleKey: 'web.legal.subprocessors.platforms.title',
    bodyKeys: ['web.legal.subprocessors.platforms.body'],
  },
];

export default function SubprocessorsPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.subprocessors.title"
      summaryKey="web.legal.subprocessors.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.privacy']}
    />
  );
}
