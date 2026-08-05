import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.terms.title',
  'web.legal.terms.summary',
  ROUTES.terms,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'service',
    titleKey: 'web.legal.terms.service.title',
    bodyKeys: ['web.legal.terms.service.body'],
  },
  {
    id: 'content',
    titleKey: 'web.legal.terms.content.title',
    bodyKeys: ['web.legal.terms.content.body'],
  },
  {
    id: 'warranties',
    titleKey: 'web.legal.terms.warranties.title',
    bodyKeys: ['web.legal.terms.warranties.body'],
  },
  {
    id: 'platforms',
    titleKey: 'web.legal.terms.platforms.title',
    bodyKeys: ['web.legal.terms.platforms.body'],
  },
  { id: 'ai', titleKey: 'web.legal.terms.ai.title', bodyKeys: ['web.legal.terms.ai.body'] },
  {
    id: 'billing',
    titleKey: 'web.legal.terms.billing.title',
    bodyKeys: ['web.legal.terms.billing.body'],
  },
  {
    id: 'suspension',
    titleKey: 'web.legal.terms.suspension.title',
    bodyKeys: ['web.legal.terms.suspension.body'],
  },
  { id: 'aup', titleKey: 'web.legal.terms.aup.title', bodyKeys: ['web.legal.terms.aup.body'] },
  {
    id: 'developer',
    titleKey: 'web.legal.terms.developer.title',
    bodyKeys: ['web.legal.terms.developer.body'],
  },
  {
    id: 'termination',
    titleKey: 'web.legal.terms.termination.title',
    bodyKeys: ['web.legal.terms.termination.body'],
  },
];

export default function TermsPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.terms.title"
      summaryKey="web.legal.terms.summary"
      counselPending
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.legal']}
    />
  );
}
