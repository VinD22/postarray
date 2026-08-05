import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { RetentionTable } from '@/features/marketing/components/legal-tables';
import { TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.privacy.title',
  'web.legal.privacy.summary',
  ROUTES.privacy,
);

export default function PrivacyPage(): ReactNode {
  const t = marketingTranslator();

  const sections: readonly LegalSectionSpec[] = [
    {
      id: 'collect',
      titleKey: 'web.legal.privacy.collect.title',
      bulletKeys: [
        'web.legal.privacy.collect.account',
        'web.legal.privacy.collect.connections',
        'web.legal.privacy.collect.content',
        'web.legal.privacy.collect.schedules',
        'web.legal.privacy.collect.analytics',
        'web.legal.privacy.collect.billing',
        'web.legal.privacy.collect.technical',
        'web.legal.privacy.collect.agent',
      ],
    },
    {
      id: 'minimization',
      titleKey: 'web.legal.privacy.minimization.title',
      bulletKeys: [
        'web.legal.privacy.minimization.scopes',
        'web.legal.privacy.minimization.history',
        'web.legal.privacy.minimization.logs',
        'web.legal.privacy.minimization.training',
      ],
    },
    {
      id: 'subprocessors',
      titleKey: 'web.legal.privacy.subprocessors.title',
      bodyKeys: ['web.legal.privacy.subprocessors.body'],
      content: (
        <p>
          <TextLink href={ROUTES.subprocessors}>{t.t('web.legal.subprocessors.title')}</TextLink>
        </p>
      ),
    },
    {
      id: 'retention',
      titleKey: 'web.legal.privacy.retention.title',
      content: <RetentionTable />,
    },
    {
      id: 'rights',
      titleKey: 'web.legal.privacy.rights.title',
      bulletKeys: [
        'web.legal.privacy.rights.export',
        'web.legal.privacy.rights.revoke',
        'web.legal.privacy.rights.delete',
        'web.legal.privacy.rights.cancelJobs',
        'web.legal.privacy.rights.sessions',
        'web.legal.privacy.rights.consent',
      ],
    },
    {
      id: 'deletion',
      titleKey: 'web.legal.privacy.deletion.title',
      bodyKeys: ['web.legal.privacy.deletion.body'],
    },
    {
      id: 'transfers',
      titleKey: 'web.legal.privacy.transfers.title',
      bodyKeys: ['web.legal.privacy.transfers.body'],
    },
    {
      id: 'ai',
      titleKey: 'web.legal.ai.data.title',
      bodyKeys: [
        'web.legal.ai.data.sent',
        'web.legal.ai.data.training',
        'web.legal.ai.data.optOut',
      ],
      content: (
        <p>
          <TextLink href={ROUTES.aiUse}>{t.t('web.legal.ai.title')}</TextLink>
        </p>
      ),
    },
    {
      id: 'cookies',
      titleKey: 'web.legal.cookies.title',
      bodyKeys: ['web.legal.cookies.summary'],
      content: (
        <p>
          <TextLink href={ROUTES.cookies}>{t.t('web.legal.cookies.title')}</TextLink>
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      titleKey="web.legal.privacy.title"
      summaryKey="web.legal.privacy.summary"
      counselPending
      reviewed="2026-08-04"
      sections={sections}
      contactKeys={['web.legal.contact.privacy']}
    />
  );
}
