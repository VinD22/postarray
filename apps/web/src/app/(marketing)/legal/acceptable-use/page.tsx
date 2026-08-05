import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.aup.title',
  'web.legal.aup.summary',
  ROUTES.acceptableUse,
);

const SECTIONS: readonly LegalSectionSpec[] = [
  {
    id: 'prohibited',
    titleKey: 'web.legal.aup.prohibited.title',
    bulletKeys: [
      'web.legal.aup.prohibited.spam',
      'web.legal.aup.prohibited.linkSchemes',
      'web.legal.aup.prohibited.inauthentic',
      'web.legal.aup.prohibited.duplicate',
      'web.legal.aup.prohibited.impersonation',
      'web.legal.aup.prohibited.harm',
      'web.legal.aup.prohibited.political',
      'web.legal.aup.prohibited.rights',
      'web.legal.aup.prohibited.circumvention',
      'web.legal.aup.prohibited.restrictedStores',
      'web.legal.aup.prohibited.banEvasion',
      'web.legal.aup.prohibited.training',
    ],
  },
  {
    id: 'controls',
    titleKey: 'web.legal.aup.controls.title',
    bulletKeys: [
      'web.legal.aup.controls.duplicate',
      'web.legal.aup.controls.cadence',
      'web.legal.aup.controls.escalation',
      'web.legal.aup.controls.linkSafety',
      'web.legal.aup.controls.workspaceCaps',
    ],
  },
  {
    id: 'enforcement',
    titleKey: 'web.legal.aup.enforcement.title',
    bodyKeys: ['web.legal.aup.enforcement.body'],
  },
  {
    id: 'report',
    titleKey: 'web.legal.aup.report.title',
    bodyKeys: ['web.legal.aup.report.body'],
  },
];

export default function AcceptableUsePage(): ReactNode {
  return (
    <LegalPage
      titleKey="web.legal.aup.title"
      summaryKey="web.legal.aup.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={SECTIONS}
      contactKeys={['web.legal.contact.abuse']}
    />
  );
}
