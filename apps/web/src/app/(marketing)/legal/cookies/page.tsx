import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.cookies.title',
  'web.legal.cookies.summary',
  ROUTES.cookies,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'essential',
    titleKey: 'web.legal.cookies.essential.title',
    bodyKeys: ['web.legal.cookies.essential.body'],
  },
  {
    id: 'analytics',
    titleKey: 'web.legal.cookies.analytics.title',
    bodyKeys: ['web.legal.cookies.analytics.body'],
  },
  {
    id: 'marketing',
    titleKey: 'web.legal.cookies.marketing.title',
    bodyKeys: ['web.legal.cookies.marketing.body'],
  },
  {
    id: 'short-links',
    titleKey: 'web.legal.cookies.shortLinks.title',
    bodyKeys: ['web.legal.cookies.shortLinks.body'],
  },
  {
    id: 'control',
    titleKey: 'web.legal.cookies.control.title',
    bodyKeys: ['web.legal.cookies.control.body'],
  },
];

export default function CookiePolicyPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.cookies.title"
      summaryKey="web.legal.cookies.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.privacy']}
    />
  );
}
