import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Badge } from '@relay/design-system/primitives';

import { Meta, Section } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { CHANGELOG, CHANGELOG_KIND_LABEL_KEY } from '@/features/marketing/data/catalogs';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.changelog.title',
  'web.meta.changelog.description',
  ROUTES.changelog,
);

export default function ChangelogPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.changelog.title')} lede={t.t('web.changelog.lede')} />

      <Section id="entries">
        {CHANGELOG.length === 0 ? (
          <EmptyState
            title={t.t('web.changelog.empty')}
            description={t.t('web.changelog.emptyBody')}
            example={t.t('web.capabilities.buildState.body')}
            action={
              <TextLink href={ROUTES.status} className="text-body-md">
                {t.t('nav.public.status')}
              </TextLink>
            }
          />
        ) : (
          <ol className="border-border-default border-t">
            {CHANGELOG.map((entry) => (
              <li
                key={entry.id}
                className="border-border-subtle grid gap-x-12 gap-y-3 border-b py-8 lg:grid-cols-12"
              >
                <div className="space-y-2 lg:col-span-4">
                  <Meta>{formatDate(entry.date)}</Meta>
                  <div>
                    <Badge>{t.format(CHANGELOG_KIND_LABEL_KEY[entry.kind])}</Badge>
                  </div>
                </div>
                <div className="min-w-0 space-y-2 lg:col-span-7 lg:col-start-6">
                  <h2 className="text-title-sm text-text-primary">{entry.title}</h2>
                  <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
                    {entry.body}
                  </p>
                  {entry.href ? (
                    <p>
                      <TextLink href={entry.href} className="text-body-md">
                        {t.t('common.details')}
                      </TextLink>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
