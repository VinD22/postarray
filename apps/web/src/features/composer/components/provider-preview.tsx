'use client';

/**
 * The provider preview.
 *
 * It shows what this one account receives: the resolved body after the
 * signature, the exact URL that will publish, the media, and the ordered
 * follow up items with their own delays. It is honest about being a model of
 * the platform's rules rather than a rendering by the platform itself.
 */

import { type ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { resolveVariant } from '@relay/contracts';
import { formatDateTime } from '@relay/i18n';

import { useComposer } from '../composer-context.js';
import { sequenceTimeline } from '../state/selectors.js';
import { PROVIDER_LABEL, ProviderIdentity } from './provider-identity.js';
import type { TargetSummary } from '../types.js';

export interface ProviderPreviewProps {
  readonly summary: TargetSummary;
}

function itemInstant(
  timeline: readonly { id: string; instant: string | null }[],
  index: number,
): string | null {
  return timeline[index]?.instant ?? null;
}

export function ProviderPreview({ summary }: ProviderPreviewProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state } = useComposer();
  const resolved = resolveVariant(state.master, state.overrides[summary.connectionId] ?? {});
  const settings = state.settings[summary.connectionId];
  const providerName = PROVIDER_LABEL[summary.account.provider];

  const body = resolved.values.signature
    ? `${resolved.values.body}\n\n${resolved.values.signature.appliedText}`
    : resolved.values.body;

  const timeline = sequenceTimeline(
    state.master.schedule?.instant ?? null,
    resolved.values.threadItems,
  );
  const timeZone = state.master.schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;

  const supportsKind =
    summary.account.capabilities.contentKinds[resolved.values.contentKind] === 'supported';

  return (
    <section
      aria-label={t.full('composer.preview.forAccount', {
        account: summary.account.displayName,
        provider: providerName,
      })}
      className="flex flex-col gap-3"
    >
      <div className="border-border-default bg-surface-raised rounded-lg border p-3">
        <ProviderIdentity
          provider={summary.account.provider}
          accountName={summary.account.displayName}
          handle={summary.account.handle}
        />

        <p className="text-body-lg text-text-primary mt-2 whitespace-pre-wrap">
          {body.length > 0 ? body : t.full('composer.master.placeholder')}
        </p>

        {settings?.destination ? (
          <p className="text-body-sm text-text-tertiary mt-2">
            {settings.destination.displayLabel}
          </p>
        ) : null}

        {resolved.values.mediaIds.length > 0 ? (
          <p className="text-body-sm text-text-tertiary mt-2">
            {t.full('composer.media.count', { count: resolved.values.mediaIds.length })}
          </p>
        ) : null}

        {summary.publishedUrl ? (
          <p className="text-mono text-text-secondary mt-2 font-mono break-all">
            {summary.publishedUrl}
          </p>
        ) : null}
      </div>

      {resolved.values.threadItems.length > 0 ? (
        <ol className="flex flex-col gap-2">
          {resolved.values.threadItems.map((item, index) => (
            <li
              key={item.id}
              className="border-border-subtle bg-surface-sunken rounded-lg border p-3"
            >
              {/* Two facts, two elements. Never one concatenated sentence. */}
              <p className="text-label text-text-tertiary flex flex-wrap gap-x-3">
                <span>{t.full('composer.sequence.item', { position: index + 2 })}</span>
                <span>
                  {t.full('composer.sequence.delayMinutes', {
                    count: Math.round(item.delaySeconds / 60),
                  })}
                </span>
              </p>
              <p className="text-body-md text-text-primary mt-1 whitespace-pre-wrap">
                {item.body.length > 0 ? item.body : t.full('composer.master.placeholder')}
              </p>
              {itemInstant(timeline, index) === null ? null : (
                <p className="text-body-sm text-text-tertiary mt-1 tabular-nums">
                  {t.full('composerWeb.summary.scheduledFor', {
                    time: formatDateTime(t.locale, itemInstant(timeline, index) as string, {
                      timeZone,
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  })}
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : null}

      {supportsKind ? (
        <p className="text-body-sm text-text-tertiary">{t.full('composer.preview.approximate')}</p>
      ) : (
        <Notice tone="warning" title={t.full('composer.preview.unavailable')} />
      )}
    </section>
  );
}
