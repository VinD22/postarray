import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { cn, panelSurface } from '@relay/design-system/utils';

import { AsideScene, type AsideSceneCard } from '@/components/auth/aside-scene';
import { ProductMark } from '@/components/brand/product-mark';
import { Link } from '@/components/link';
import { getStaticIntl } from '@/lib/i18n/server';

/**
 * The signed-out frame.
 *
 * A form column and, from 1024px, a quiet editorial column that says what the
 * product does in three factual sentences. No logos, no testimonials, no
 * screenshots of invented dashboards: nothing on this page claims anything we
 * cannot show. The three sentences sit in lightly rotated editorial cards over
 * `AsideScene`, where three abstract post previews trade places on a loop. Both
 * are plain markup and CSS, so this stays `force-static`.
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

export default async function AuthLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
}) {
  const { locale } = await params;
  const intl = await getStaticIntl(locale);

  const sceneCards: AsideSceneCard[] = ASIDE_SCENE_PROVIDERS.map((provider) => ({
    provider,
    name: intl.t.format(`web.provider.${provider}`),
  }));

  return (
    <div className="bg-surface-sunken grid min-h-dvh grid-cols-1 gap-2 p-2 lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)] lg:p-3">
      <main
        id="main"
        className="bg-surface-canvas flex flex-col justify-center rounded-lg px-4 py-10 md:px-8 lg:px-12"
      >
        <div
          className={cn(
            'relay-auth-panel shadow-raised mx-auto flex w-full max-w-[31rem] flex-col gap-7 p-6 md:p-9',
            panelSurface,
          )}
        >
          <Link
            href="/"
            className="text-title-sm text-text-primary flex min-h-11 items-center gap-3 self-start font-semibold"
          >
            <ProductMark />
            <span>{intl.t.format('shell.appName')}</span>
          </Link>
          {children}
        </div>
      </main>

      <aside className="relay-auth-scene bg-surface-inverted text-text-inverted relative hidden overflow-hidden rounded-lg lg:flex lg:flex-col lg:justify-between lg:gap-10 lg:px-12 lg:py-12">
        <div className="relative z-10 max-w-[34ch]">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance">
            {intl.t.format('auth.aside.title')}
          </h2>
          <ul className="flex flex-col gap-5 pt-6">
            {ASIDE_POINTS.map((point) => (
              <li key={point.key}>
                <p
                  className={cn(
                    'border-border-default bg-surface-raised text-body-md text-text-primary shadow-raised rounded-lg border p-4',
                    point.rotate,
                  )}
                >
                  {intl.t.format(point.key)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <AsideScene cards={sceneCards} />
        </div>
      </aside>
    </div>
  );
}
