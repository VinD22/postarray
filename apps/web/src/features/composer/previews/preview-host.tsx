'use client';

/**
 * The preview panel.
 *
 * It owns three things and delegates everything else: which device width is
 * showing, the model built from the draft, and the decision not to draw a post
 * at all when the platform will not take one.
 *
 * The frame crossfades when the open target changes. Opacity only: the pane
 * around this component already slides, and a second directional motion on top
 * of it reads as two things moving at once.
 */

import { useMemo, useRef, type ReactNode } from 'react';
import { useTranslations } from '@relay/i18n/react';
import { formatDateTime } from '@relay/i18n';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { useComposer } from '../composer-context';
import { PROVIDER_LABEL } from '../components/provider-identity';
import type { TargetSummary } from '../types';
import { buildPreviewModel } from './build-preview-model';
import { DeviceToggle, usePreviewDevice } from './device-toggle';
import { PreviewUnsupported } from './parts/preview-unsupported';
import { getPreviewComponent } from './registry';
import { usePreviewMedia } from './use-preview-media';

export interface PreviewHostProps {
  readonly summary: TargetSummary;
}

export function PreviewHost({ summary }: PreviewHostProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state } = useComposer();
  const [device, setDevice] = usePreviewDevice();
  const motionOk = useMotionOk();

  const account = summary.account;
  const providerName = PROVIDER_LABEL[account.provider];
  const mediaIds = state.overrides[account.connectionId]?.mediaIds ?? state.master.mediaIds;
  const media = usePreviewMedia(mediaIds);

  const schedule = state.master.schedule;
  const timeZone = schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;
  const postedAtLabel =
    schedule === null || schedule === undefined
      ? t.full('composerWeb.preview.postedNow')
      : formatDateTime(t.locale, schedule.instant, {
          timeZone,
          dateStyle: 'medium',
          timeStyle: 'short',
        });

  const model = useMemo(
    () => buildPreviewModel({ state, account, media, postedAtLabel }),
    [state, account, media, postedAtLabel],
  );

  const scope = useRef<HTMLDivElement>(null);
  const previousConnectionId = useRef(summary.connectionId);
  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;
      if (previousConnectionId.current === summary.connectionId) return;
      previousConnectionId.current = summary.connectionId;
      gsap.from(scope.current, { opacity: 0, duration: DURATION_FAST, ease: EASE_STANDARD });
    },
    { scope, dependencies: [motionOk, summary.connectionId] },
  );

  const Preview = getPreviewComponent(account.provider);
  const supported = model.kindSupport === 'supported';

  return (
    <section ref={scope} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-title-sm text-text-primary">{t.full('composer.preview.title')}</h3>
        {supported ? <DeviceToggle device={device} onChange={setDevice} /> : null}
      </div>

      {supported ? (
        <>
          <Preview model={model} device={device} />
          {summary.publishedUrl === null ? null : (
            <p className="text-mono text-text-secondary font-mono break-all">
              {summary.publishedUrl}
            </p>
          )}
          <p className="text-body-sm text-text-tertiary">
            {t.full('composer.preview.approximate')}
          </p>
        </>
      ) : (
        <PreviewUnsupported
          support={model.kindSupport}
          contentKind={model.contentKind}
          providerName={providerName}
        />
      )}
    </section>
  );
}
