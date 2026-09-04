'use client';

/**
 * The weekly digest, on Home. Built, and deliberately not rendered.
 *
 * Home no longer mounts this. It occupied a whole section of the first screen
 * a person sees in order to say that a feature does not exist yet, which is a
 * promise rather than information, and a promise on the first screen is worse
 * than a blank space where nothing was ever offered.
 *
 * The file stays because the state below is the right one to keep. It is
 * written to be worth reading on its own: it says what the digest is made of
 * (your receipts and your own measurements), why it is not here (there has to
 * be a week of them), and plainly that the summary itself is still being
 * built. When the pipeline lands, this card gains a populated branch and keeps
 * this one for a workspace that has not published a week yet.
 *
 * TODO(owner): mount this again once the digest is wired end to end. The
 * backend hardcodes `digest: null`, `digest.workflow.ts` is unexported,
 * `DigestActivities` is unimplemented and `INSIGHTS_PORT` is unprovided.
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
