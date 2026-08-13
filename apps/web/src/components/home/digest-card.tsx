'use client';

/**
 * The weekly digest, on Home.
 *
 * The digest pipeline is being built in parallel with this card, so what
 * ships today is exactly one state: the honest empty one. That is deliberate,
 * and it is why this file has no loading skeleton and no partial render. A
 * card that showed a spinner for a pipeline that does not exist yet would be
 * claiming a capability, which is the failure the launch-truth gate exists to
 * catch. When the pipeline lands, this card gains a populated branch and
 * keeps this state for a workspace that has not published a week yet.
 *
 * The empty state is written to be worth reading on its own: it says what the
 * digest is made of (your receipts and your own measurements), why it is not
 * here (there has to be a week of them), and plainly that the summary itself
 * is still being built. Nobody is left wondering whether something broke.
 */

import { type ReactNode } from 'react';

import { cn, panelSurface } from '@relay/design-system/utils';

import { EmptyScene } from '@/components/empty';
import { useTranslations } from '@/lib/i18n';

import { HomeSection } from './section';

export function DigestCard(): ReactNode {
  const t = useTranslations();

  return (
    <HomeSection id="home-digest" title={t('home.v2.digest.title')}>
      <div className={cn(panelSurface, 'flex flex-col items-center gap-4 px-4 py-6')}>
        <EmptyScene scene="digest" />

        <div className="flex max-w-[52ch] flex-col gap-1 text-center">
          <h3 className="font-display text-title-sm text-text-primary font-bold">
            {t('home.v2.digest.emptyTitle')}
          </h3>
          <p className="text-body-sm text-text-secondary">{t('home.v2.digest.emptyBody')}</p>
          <p className="text-body-sm text-text-tertiary">{t('home.v2.digest.notBuilt')}</p>
        </div>
      </div>
    </HomeSection>
  );
}
