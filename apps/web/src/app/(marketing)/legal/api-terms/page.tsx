import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.apiTerms.title',
  'web.legal.apiTerms.summary',
  ROUTES.apiTerms,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'credentials',
    titleKey: 'web.legal.apiTerms.credentials.title',
    bodyKeys: ['web.legal.apiTerms.credentials.body'],
  },
  {
    id: 'scopes',
    titleKey: 'web.legal.apiTerms.scopes.title',
    bodyKeys: ['web.legal.apiTerms.scopes.body'],
  },
  {
    id: 'limits',
    titleKey: 'web.legal.apiTerms.limits.title',
    bodyKeys: ['web.legal.apiTerms.limits.body'],
  },
  {
    id: 'agents',
    titleKey: 'web.legal.apiTerms.agents.title',
    bodyKeys: ['web.legal.apiTerms.agents.body'],
  },
  {
    id: 'prohibited',
    titleKey: 'web.legal.apiTerms.prohibited.title',
    bodyKeys: ['web.legal.apiTerms.prohibited.body'],
  },
  {
    id: 'changes',
    titleKey: 'web.legal.apiTerms.changes.title',
    bodyKeys: ['web.legal.apiTerms.changes.body'],
  },
];

export default function ApiTermsPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.apiTerms.title"
      summaryKey="web.legal.apiTerms.summary"
      counselPending={true}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.legal']}
    />
  );
}
