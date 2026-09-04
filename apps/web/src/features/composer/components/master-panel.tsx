'use client';

/**
 * The left pane: the canonical draft.
 *
 * Brief, master text, media, source references, campaign and content language,
 * plus the sequence, links and signature that every inheriting target follows.
 * The one control that fans a change out to the targets is labelled "Global
 * edit" and never fires from a keystroke.
 */

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Button,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { contentLocaleLabel } from '../content-locale-options';
import { BodyField, type CounterTarget } from './body-field';
import { GlobalEditDialog } from './global-edit-dialog';
import { LinkControls } from './link-controls';
import { MediaStrip } from './media-strip';
import { SequencePanel } from './sequence-panel';
import { SignaturePanel } from './signature-panel';
import type { MediaAsset } from '../../media/types';

export interface MasterPanelProps {
  readonly assets: readonly MediaAsset[];
  readonly onPickMedia: () => void;
  readonly onEditMedia: (mediaId: string) => void;
  readonly contentLocales: readonly string[];
}

export function MasterPanel({
  assets,
  onPickMedia,
  onEditMedia,
  contentLocales,
}: MasterPanelProps): ReactNode {
  const t = useTranslations();
  const { state, dispatch, summaries } = useComposer();
  const [globalEditOpen, setGlobalEditOpen] = useState(false);

  const counters: CounterTarget[] = summaries.map((summary) => ({
    connectionId: summary.connectionId,
    accountLabel: summary.account.displayName,
    capabilities: summary.account.capabilities,
  }));

  const mediaLimit = Math.max(1, ...summaries.map((summary) => summary.mediaLimit));

  return (
    <div className="flex flex-col gap-6">
      <Field label={t.full('composer.brief.label')}>
        {(control) => (
          <Input
            id={control.id}
            value={state.master.title ?? ''}
            placeholder={t.full('composer.brief.placeholder')}
            onChange={(event) =>
              dispatch({
                type: 'master/patch',
                patch: { title: event.target.value.length === 0 ? null : event.target.value },
              })
            }
          />
        )}
      </Field>

      <BodyField
        label={t.full('composer.master.label')}
        description={t.full('composer.master.description')}
        value={state.master.body}
        placeholder={t.full('composer.master.placeholder')}
        counters={counters}
        onChange={(value) => dispatch({ type: 'master/patch', patch: { body: value } })}
        toolbar={
          <Button variant="secondary" size="sm" onClick={() => setGlobalEditOpen(true)}>
            {t.full('composerWeb.globalEdit.open')}
          </Button>
        }
      />

      <MediaStrip
        assets={assets}
        mediaIds={state.master.mediaIds}
        inherited={false}
        limit={mediaLimit}
        onPick={onPickMedia}
        onEdit={onEditMedia}
        onRemove={(mediaId) =>
          dispatch({
            type: 'master/patch',
            patch: { mediaIds: state.master.mediaIds.filter((id) => id !== mediaId) },
          })
        }
      />

      <LinkControls />

      <details className="border-border-default bg-surface-sunken group rounded-lg border">
        <summary className="text-body-md text-text-primary flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
          <span>{t.full('common.details')}</span>
          <ChevronDown
            aria-hidden="true"
            className="text-text-tertiary size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
          />
        </summary>

        <div className="border-border-subtle flex flex-col gap-6 border-t p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={t.full('composer.contentLocale.label')}
              description={t.full('composer.contentLocale.help')}
            >
              {(control) => (
                <Select
                  value={state.master.locale}
                  onValueChange={(value) =>
                    dispatch({ type: 'master/patch', patch: { locale: value } })
                  }
                >
                  <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentLocales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {contentLocaleLabel(locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <Field label={t.full('composer.campaign.label')}>
              {(control) => (
                <Input
                  id={control.id}
                  value={state.master.campaignId ?? ''}
                  placeholder={t.full('composer.campaign.none')}
                  onChange={(event) =>
                    dispatch({
                      type: 'master/patch',
                      patch: {
                        campaignId: event.target.value.length === 0 ? null : event.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>
          </div>

          <SequencePanel scope={null} capabilities={null} />
          <SignaturePanel />

          <section aria-labelledby="composer-sources-heading" className="flex flex-col gap-1.5">
            <h3 id="composer-sources-heading" className="text-title-sm text-text-primary">
              {t.full('composer.sources.label')}
            </h3>
            {state.master.links.length === 0 ? (
              <p className="text-body-sm text-text-tertiary">{t.full('composer.sources.empty')}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {state.master.links.map((link) => (
                  <li
                    key={link.originalUrl}
                    className="text-mono text-text-secondary font-mono break-all"
                  >
                    {link.originalUrl}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </details>

      <GlobalEditDialog open={globalEditOpen} onOpenChange={setGlobalEditOpen} />
    </div>
  );
}
