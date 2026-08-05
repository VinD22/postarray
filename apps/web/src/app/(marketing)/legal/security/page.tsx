import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.security.title',
  'web.legal.security.summary',
  ROUTES.security,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'tokens',
    titleKey: 'web.legal.security.tokens.title',
    bodyKeys: ['web.legal.security.tokens.body'],
  },
  {
    id: 'tenancy',
    titleKey: 'web.legal.security.tenancy.title',
    bodyKeys: ['web.legal.security.tenancy.body'],
  },
  {
    id: 'publishing',
    titleKey: 'web.legal.security.publishing.title',
    bodyKeys: ['web.legal.security.publishing.body'],
  },
  {
    id: 'program',
    titleKey: 'web.legal.security.program.title',
    bulletKeys: [
      'web.legal.security.program.threatModel',
      'web.legal.security.program.pentest',
      'web.legal.security.program.access',
      'web.legal.security.program.supplyChain',
      'web.legal.security.program.logging',
      'web.legal.security.program.backups',
    ],
  },
  {
    id: 'disclosure',
    titleKey: 'web.legal.security.disclosure.title',
    bodyKeys: ['web.legal.security.disclosure.body', 'web.legal.security.disclosure.safeHarbor'],
  },
  {
    id: 'incidents',
    titleKey: 'web.legal.security.incidents.title',
    bodyKeys: ['web.legal.security.incidents.body'],
  },
];

export default function SecurityPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.security.title"
      summaryKey="web.legal.security.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.security']}
    />
  );
}
