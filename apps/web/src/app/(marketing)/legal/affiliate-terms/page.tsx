import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.affiliate.title',
  'web.legal.affiliate.summary',
  ROUTES.affiliateTerms,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'commission',
    titleKey: 'web.legal.affiliate.commission.title',
    bodyKeys: ['web.legal.affiliate.commission.body'],
  },
  {
    id: 'disclosure',
    titleKey: 'web.legal.affiliate.disclosure.title',
    bodyKeys: ['web.legal.affiliate.disclosure.body'],
  },
  {
    id: 'honesty',
    titleKey: 'web.legal.affiliate.honesty.title',
    bodyKeys: ['web.legal.affiliate.honesty.body'],
  },
  {
    id: 'prohibited',
    titleKey: 'web.legal.affiliate.prohibited.title',
    bulletKeys: [
      'web.legal.affiliate.prohibited.brandBidding',
      'web.legal.affiliate.prohibited.spam',
      'web.legal.affiliate.prohibited.cookieStuffing',
      'web.legal.affiliate.prohibited.claims',
      'web.legal.affiliate.prohibited.trademark',
    ],
  },
];

export default function AffiliateTermsPage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.affiliate.title"
      summaryKey="web.legal.affiliate.summary"
      counselPending={true}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.affiliates']}
    />
  );
}
