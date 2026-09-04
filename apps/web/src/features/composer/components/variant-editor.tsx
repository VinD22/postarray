'use client';

/**
 * The centre pane when a target is open.
 *
 * Every edit here writes an override on that one field for that one account.
 * The banner above the editor states whether the target is still following the
 * master, and each overridden field carries its own reset, always confirmed.
 */

import { useState, type ReactNode } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes, formatDuration, formatRelativeTime } from '@relay/i18n';
import { resolveVariant, type OverridableVariantField } from '@relay/contracts';

import { useComposer } from '../composer-context';
import { BodyField } from './body-field';
import { MediaStrip } from './media-strip';
import { NativeSettings } from './native-settings';
import { fieldLabel, ResetToMasterDialog } from './reset-to-master-dialog';
import { SequencePanel } from './sequence-panel';
import { PROVIDER_LABEL } from './provider-identity';
import type { ResolvedEntity } from './entity-search-field';
import type { TargetSummary } from '../types';
import type { MediaAsset } from '../../media/types';

export interface VariantEditorProps {
  readonly summary: TargetSummary;
  readonly assets: readonly MediaAsset[];
  readonly onPickMedia: () => void;
  readonly onEditMedia: (mediaId: string) => void;
  readonly searchDestinations: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
  readonly searchMentions: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
}

export function VariantEditor({
  summary,
  assets,
  onPickMedia,
  onEditMedia,
  searchDestinations,
  searchMentions,
}: VariantEditorProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { state, dispatch } = useComposer();
  const [resetField, setResetField] = useState<OverridableVariantField | null | 'closed'>('closed');

  const resolved = resolveVariant(state.master, state.overrides[summary.connectionId] ?? {});
  const snapshot = summary.account.capabilities;
  const inherited = summary.overriddenFields.length === 0;
  const media = snapshot.media;

  const override = (field: OverridableVariantField, value: unknown): void => {
    const wasInherited = state.overrides[summary.connectionId]?.[field] === undefined;
    dispatch({
      type: 'variant/override',
      connectionId: summary.connectionId,
      field,
      // The reducer prunes anything equal to the master, so this is safe.
      value: value as never,
    });
    if (wasInherited) {
      announce(
        t.full('composerWeb.override.created', {
          account: summary.account.displayName,
          field: fieldLabel(t, field),
        }),
        'polite',
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {inherited ? (
        <Notice
          tone="info"
          title={t.full('composerWeb.override.inheritNotice', {
            account: summary.account.displayName,
          })}
        />
      ) : (
        <section
          aria-labelledby="override-heading"
          className="border-accent flex flex-col gap-2 border-s-2 ps-3"
        >
          <h3 id="override-heading" className="text-title-sm text-text-primary">
            {t.full('composerWeb.override.heading')}
          </h3>
          <p className="text-body-sm text-text-secondary">
            {t.full('composerWeb.override.fieldsChanged', {
              count: summary.overriddenFields.length,
            })}
          </p>
          <ul className="flex flex-wrap gap-2">
            {summary.overriddenFields.map((field) => (
              <li key={field}>
                <Button
                  variant="ghost"
                  size="sm"
                  iconStart={<RotateCcw aria-hidden />}
                  onClick={() => setResetField(field)}
                >
                  {t.full('composerWeb.override.resetField', { field: fieldLabel(t, field) })}
                </Button>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => setResetField(null)}
          >
            {t.full('composerWeb.override.resetAll')}
          </Button>
        </section>
      )}

      <BodyField
        label={t.full('composer.editor.label')}
        value={resolved.values.body}
        placeholder={t.full('composer.master.placeholder')}
        onChange={(value) => override('body', value)}
        counters={[
          {
            connectionId: summary.connectionId,
            accountLabel: summary.account.displayName,
            capabilities: snapshot,
          },
        ]}
      />

      <details className="border-border-subtle bg-surface-sunken group rounded-md border">
        <summary className="text-label text-text-secondary flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
          <span>
            {t.full('composerWeb.limits.heading', { account: summary.account.displayName })}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="text-text-tertiary size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
          />
        </summary>
        <ul className="border-border-subtle text-body-sm text-text-tertiary flex flex-col gap-1 border-t px-3 py-3">
          <li>{t.full('composerWeb.limits.text', { limit: snapshot.text.maxLength })}</li>
          {snapshot.text.linkCounting.mode === 'fixed' &&
          snapshot.text.linkCounting.charactersPerLink !== null ? (
            <li>
              {t.full('composerWeb.limits.linkCost', {
                count: snapshot.text.linkCounting.charactersPerLink,
              })}
            </li>
          ) : null}
          <li>{t.full('composerWeb.limits.images', { count: media.maxImages })}</li>
          <li>{t.full('composerWeb.limits.videos', { count: media.maxVideos })}</li>
          {media.maxDurationSeconds === null ? null : (
            <li>
              {t.full('composerWeb.limits.duration', {
                duration: formatDuration(t.locale, media.maxDurationSeconds * 1000),
              })}
            </li>
          )}
          <li>
            {t.full('composerWeb.limits.aspect', {
              min: media.aspectRatios.min.toFixed(2),
              max: media.aspectRatios.max.toFixed(2),
            })}
          </li>
          {media.maxBytesByKind.image == null ? null : (
            <li className="tabular-nums">
              {t.full('composerWeb.limits.fileSize', {
                size: formatBytes(t.locale, media.maxBytesByKind.image),
              })}
            </li>
          )}
          {media.requiresThumbnail ? (
            <li>{t.full('composerWeb.limits.thumbnailRequired')}</li>
          ) : null}
          <li>
            {t.full('composerWeb.limits.source', {
              version: snapshot.capabilityVersion,
              relativeTime: formatRelativeTime(t.locale, snapshot.observedAt),
            })}
          </li>
        </ul>
      </details>

      <MediaStrip
        assets={assets}
        mediaIds={resolved.values.mediaIds}
        inherited={resolved.inherited.includes('mediaIds')}
        limit={summary.mediaLimit}
        onPick={onPickMedia}
        onEdit={onEditMedia}
        onRemove={(mediaId) =>
          override(
            'mediaIds',
            resolved.values.mediaIds.filter((id) => id !== mediaId),
          )
        }
      />

      <NativeSettings
        summary={summary}
        searchDestinations={searchDestinations}
        searchMentions={searchMentions}
      />

      <SequencePanel scope={summary.connectionId} capabilities={snapshot} />

      <p className="text-body-sm text-text-tertiary">
        {t.full('composer.preview.forAccount', {
          account: summary.account.displayName,
          provider: PROVIDER_LABEL[summary.account.provider],
        })}
      </p>

      {resetField === 'closed' ? null : (
        <ResetToMasterDialog
          connectionId={summary.connectionId}
          field={resetField}
          onClose={() => setResetField('closed')}
        />
      )}
    </div>
  );
}
