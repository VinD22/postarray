import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalPage, type LegalSectionSpec } from '@/features/marketing/components/legal';
import { TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.legal.ai.title',
  'web.legal.ai.summary',
  ROUTES.aiUse,
);

export default function AiUsePage(): ReactNode {
  const t = marketingTranslator();

  const sections: readonly LegalSectionSpec[] = [
    {
      id: 'features',
      titleKey: 'web.legal.ai.features.title',
      bulletKeys: [
        'web.legal.ai.features.text',
        'web.legal.ai.features.translation',
        'web.legal.ai.features.feedback',
      ],
      content: (
        <p className="text-body-lg text-text-secondary max-w-[70ch] leading-[1.68]">
          {t.t('web.legal.ai.features.provider')}
        </p>
      ),
    },
    {
      id: 'data',
      titleKey: 'web.legal.ai.data.title',
      bodyKeys: [
        'web.legal.ai.data.sent',
        'web.legal.ai.data.training',
        'web.legal.ai.data.optOut',
      ],
    },
    {
      id: 'responsibility',
      titleKey: 'web.legal.ai.responsibility.title',
      bodyKeys: ['web.legal.ai.responsibility.body'],
    },
    {
      id: 'disclosure',
      titleKey: 'web.legal.ai.disclosure.title',
      bodyKeys: ['web.legal.ai.disclosure.body'],
    },
    {
      id: 'blocks',
      titleKey: 'web.legal.ai.blocks.title',
      bulletKeys: [
        'web.legal.ai.blocks.impersonation',
        'web.legal.ai.blocks.ncii',
        'web.legal.ai.blocks.fabrication',
        'web.legal.ai.blocks.unverified',
      ],
    },
    {
      id: 'no-media',
      titleKey: 'web.legal.ai.noMedia.title',
      bodyKeys: ['web.legal.ai.noMedia.body', 'web.legal.ai.noMedia.caveat'],
      content: (
        <p>
          <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      titleKey="web.legal.ai.title"
      summaryKey="web.legal.ai.summary"
      counselPending={false}
      reviewed="2026-08-04"
      sections={sections}
      contactKeys={['web.legal.contact.privacy']}
    />
  );
}
