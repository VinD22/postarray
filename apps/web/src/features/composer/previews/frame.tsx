'use client';

/**
 * The neutral chrome every platform preview sits in.
 *
 * The frame is ours: a paper surface, a hairline border, the product's type
 * scale. It is not a reproduction of a platform's own shell, and the header
 * says whose account and which platform in words so the frame never has to
 * carry that meaning through styling alone.
 *
 * The width is the only thing the device toggle changes. There is no width
 * tween: a preview that slides between two sizes while somebody is reading it
 * is motion for its own sake.
 */

import type { ReactNode } from 'react';
import { Avatar } from '@relay/design-system/primitives';
import { cn, panelSurface } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { ProviderIdentity } from '../components/provider-identity';
import type { PreviewDevice, PreviewModel } from './types';

export interface PreviewFrameProps {
  readonly model: PreviewModel;
  readonly device: PreviewDevice;
  readonly providerName: string;
  readonly children: ReactNode;
  /** Replaces the default header, for platforms whose post has no author row. */
  readonly header?: ReactNode;
}

/** The first character of the account name. The caller's locale decides case. */
function initial(displayName: string): string {
  return [...displayName.trim()].slice(0, 1).join('').toLocaleUpperCase();
}

export function PreviewFrame({
  model,
  device,
  providerName,
  children,
  header,
}: PreviewFrameProps): ReactNode {
  const t = useTranslations();
  const width =
    device === 'mobile' ? model.presentation.mobileWidth : model.presentation.desktopWidth;

  return (
    <div
      key={device}
      role="group"
      aria-label={t.full('composerWeb.preview.frame', {
        account: model.account.displayName,
        provider: providerName,
        device: t.full(
          device === 'mobile'
            ? 'composerWeb.preview.device.mobile'
            : 'composerWeb.preview.device.desktop',
        ),
      })}
      style={{ inlineSize: `${width}px`, maxInlineSize: '100%' }}
      className={cn(panelSurface, 'relay-anim-fade-in flex flex-col gap-3 p-4')}
    >
      {header ?? (
        <div className="flex items-start gap-2">
          <Avatar
            size="md"
            alt=""
            fallback={initial(model.account.displayName)}
            {...(model.account.avatarUrl === null ? {} : { src: model.account.avatarUrl })}
          />
          <div className="flex min-w-0 flex-col">
            <ProviderIdentity
              provider={model.provider}
              accountName={model.account.displayName}
              handle={model.account.handle}
            />
            <span className="text-label text-text-tertiary">{model.postedAtLabel}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
