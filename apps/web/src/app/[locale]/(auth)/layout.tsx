import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { cn, panelPoster } from '@relay/design-system/utils';

import { AsideScene, type AsideSceneCard } from '@/components/auth/aside-scene';
import { getStaticIntl } from '@/lib/i18n/server';

/**
 * The signed-out frame.
 *
 * A form column and, from 1024px, a quiet editorial column that says what the
 * product does in three factual sentences. No logos, no testimonials, no
 * screenshots of invented dashboards: nothing on this page claims anything we
 * cannot show. The three sentences sit in slightly rotated, hard-shadowed
 * paper cards (the loud system's poster-note treatment; full sentences don't
 * fit `Sticker`, which is built for short badge text) over `AsideScene` —
 * three abstract "post preview" cards that trade places on a loop. Both are
 * plain markup and CSS, so this stays `force-static`.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The signed-out shell is the same for everyone: a form, and copy that reads the
 * same whoever is looking at it. Nothing here depends on the request, so it is
 * prerendered rather than rendered per visit.
 */
export const dynamic = 'force-static';

// A shallow, alternating rotation so the three sentences read as a loosely
// stacked deck of notes rather than a straight, static list — echoing the
// three "post preview" cards behind them without competing for attention.
const ASIDE_POINTS = [
  { key: 'auth.aside.point.receipts', rotate: '-rotate-2' },
  { key: 'auth.aside.point.approvals', rotate: 'rotate-1' },
  { key: 'auth.aside.point.surfaces', rotate: '-rotate-1' },
] as const;

const ASIDE_SCENE_PROVIDERS = ['x', 'linkedin', 'instagram'] as const;

export default async function AuthLayout({ children }: { readonly children: ReactNode }) {
  const intl = await getStaticIntl();

  const sceneCards: AsideSceneCard[] = ASIDE_SCENE_PROVIDERS.map((provider) => ({
    provider,
    name: intl.t.format(`web.provider.${provider}`),
  }));

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <main id="main" className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div
          className={cn('mx-auto flex w-full max-w-[28rem] flex-col gap-6 p-6 sm:p-8', panelPoster)}
        >
          <p className="text-title-md text-text-primary font-display font-bold">
            {intl.t.format('shell.appName')}
          </p>
          {children}
        </div>
      </main>

      <aside className="bg-accent text-accent-on hidden flex-col justify-center gap-10 px-12 py-10 lg:flex">
        <div className="max-w-[34ch]">
          <h2 className="text-title-lg font-display font-bold text-balance">
            {intl.t.format('auth.aside.title')}
          </h2>
          <ul className="flex flex-col gap-5 pt-6">
            {ASIDE_POINTS.map((point) => (
              <li key={point.key}>
                <p
                  className={cn(
                    'bg-surface-raised text-body-md text-text-primary p-4',
                    panelPoster,
                    point.rotate,
                  )}
                >
                  {intl.t.format(point.key)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <AsideScene cards={sceneCards} />
      </aside>
    </div>
  );
}
