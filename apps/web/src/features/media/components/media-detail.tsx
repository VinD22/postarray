'use client';

/**
 * One asset: its facts, its provenance, its versions, its alt text and its
 * rights, plus the picture editor. A row of facts, not a wall of cards.
 */

import { useState, type ReactNode } from 'react';
import { Crop } from 'lucide-react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes, formatDateTime, formatDuration } from '@relay/i18n';

import { AltTextForm } from './alt-text-form';
import { DerivativeDialog } from './derivative-dialog';
import { RightsForm } from './rights-form';
import type { AccountRule } from '../state/media-rules';
import type { MediaAsset, RightsDeclaration } from '../types';

export interface MediaDetailProps {
  readonly asset: MediaAsset;
  readonly rules: readonly AccountRule[];
  readonly timeZone: string;
  readonly onSaveAltText: (input: {
    altText: string | null;
    waived: boolean;
    waivedReason: string | null;
  }) => Promise<void>;
  readonly onSaveRights: (
    declaration: Omit<RightsDeclaration, 'declaredByName' | 'declaredAt'>,
  ) => Promise<void>;
  readonly onSuggestAltText?: () => Promise<string>;
}

export function MediaDetail({
  asset,
  rules,
  timeZone,
  onSaveAltText,
  onSaveRights,
  onSuggestAltText,
}: MediaDetailProps): ReactNode {
  const t = useTranslations();
  // The library's entry point into the picture editor. The composer's media
  // strip opens the same dialog, so both surfaces get identical rules.
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'type',
            term: t.full('mediaLib.column.type'),
            definition: asset.mimeType,
          },
          ...(asset.width !== null && asset.height !== null
            ? [
                {
                  id: 'dimensions',
                  term: t.full('mediaLib.editor.widthLabel'),
                  definition: t.full('library.asset.dimensions', {
                    width: asset.width,
                    height: asset.height,
                  }),
                },
              ]
            : []),
          {
            id: 'size',
            term: t.full('mediaLib.column.size'),
            definition: t.full('library.asset.size', {
              size: formatBytes(t.locale, asset.bytes),
            }),
          },
          ...(asset.durationSeconds === null
            ? []
            : [
                {
                  id: 'duration',
                  term: t.full('common.duration'),
                  definition: t.full('library.asset.duration', {
                    duration: formatDuration(t.locale, asset.durationSeconds * 1000),
                  }),
                },
              ]),
          {
            id: 'checksum',
            term: t.full('library.asset.checksum'),
            definition: <span className="text-mono font-mono break-all">{asset.checksum}</span>,
          },
          {
            id: 'usage',
            term: t.full('mediaLib.column.added'),
            definition: formatDateTime(t.locale, asset.createdAt, {
              timeZone,
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            ...(asset.usedInPostCount === null
              ? {}
              : { hint: t.full('library.asset.usedInPosts', { count: asset.usedInPostCount }) }),
          },
          {
            id: 'retention',
            term: t.full('mediaLib.retention.expiresLabel'),
            definition: asset.storageAvailable
              ? formatDateTime(t.locale, asset.retentionExpiresAt, {
                  timeZone,
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : t.full('mediaLib.retention.deleted'),
          },
        ]}
      />

      <section aria-labelledby="provenance-heading" className="flex flex-col gap-2">
        <h3 id="provenance-heading" className="text-title-sm text-text-primary">
          {t.full('mediaLib.provenance.heading')}
        </h3>
        <DefinitionList
          layout="columns"
          items={[
            {
              id: 'origin',
              term: t.full('common.createdBy'),
              definition:
                asset.provenance.origin === 'import'
                  ? t.full('library.asset.origin.import', {
                      source: asset.provenance.sourceUrl ?? '',
                    })
                  : asset.provenance.origin === 'api'
                    ? t.full('library.asset.origin.api')
                    : t.full('library.asset.origin.upload', {
                        name: asset.provenance.addedByName ?? t.full('common.unavailable'),
                      }),
            },
            ...(asset.provenance.sourceUrl === null
              ? []
              : [
                  {
                    id: 'source',
                    term: t.full('mediaLib.provenance.sourceUrl'),
                    definition: <span className="break-all">{asset.provenance.sourceUrl}</span>,
                  },
                ]),
            ...(asset.provenance.fetchedAt === null
              ? []
              : [
                  {
                    id: 'fetched',
                    term: t.full('common.date'),
                    definition: formatDateTime(t.locale, asset.provenance.fetchedAt, {
                      timeZone,
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  },
                ]),
            ...(asset.provenance.declaredAuthor === null
              ? []
              : [
                  {
                    id: 'author',
                    term: t.full('mediaLib.provenance.declaredAuthor'),
                    definition: asset.provenance.declaredAuthor,
                  },
                ]),
            ...(asset.provenance.declaredLicense === null
              ? []
              : [
                  {
                    id: 'license',
                    term: t.full('mediaLib.provenance.declaredLicense'),
                    definition: asset.provenance.declaredLicense,
                  },
                ]),
            {
              id: 'credentials',
              term: t.full('mediaLib.provenance.contentCredentials'),
              definition:
                asset.provenance.contentCredentials ??
                t.full('mediaLib.provenance.contentCredentialsNone'),
            },
          ]}
        />
        {asset.provenance.origin === 'import' ? (
          <Notice tone="info" title={t.full('mediaLib.provenance.unverified')} />
        ) : null}
      </section>

      {asset.scanState === 'clean' && asset.storageAvailable ? null : (
        <Notice
          tone="warning"
          title={t.full(
            !asset.storageAvailable
              ? 'mediaLib.retention.deletedTitle'
              : asset.scanState === 'pending'
                ? 'mediaLib.processing.pendingTitle'
                : 'mediaLib.processing.blockedTitle',
          )}
          description={t.full(
            !asset.storageAvailable
              ? 'mediaLib.retention.deletedBody'
              : asset.scanState === 'pending'
                ? 'mediaLib.processing.pendingBody'
                : 'mediaLib.processing.blockedBody',
          )}
        />
      )}

      <Tabs defaultValue="alt">
        <TabsList>
          <TabsTrigger value="alt">{t.full('mediaLib.alt.heading')}</TabsTrigger>
          <TabsTrigger value="rights">{t.full('mediaLib.rights.heading')}</TabsTrigger>
          <TabsTrigger value="versions">{t.full('mediaLib.versions.heading')}</TabsTrigger>
        </TabsList>

        <TabsContent value="alt" className="pt-3">
          <AltTextForm
            asset={asset}
            rules={rules}
            onSave={onSaveAltText}
            {...(onSuggestAltText ? { onSuggest: onSuggestAltText } : {})}
          />
        </TabsContent>

        <TabsContent value="rights" className="pt-3">
          <RightsForm asset={asset} onSave={onSaveRights} />
        </TabsContent>

        <TabsContent value="versions" className="flex flex-col gap-2 pt-3">
          <ul className="flex flex-col">
            {asset.versions.map((version) => (
              <li
                key={version.version}
                className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-b-0"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-body-md text-text-primary">
                    {version.version === 1
                      ? t.full('mediaLib.versions.original')
                      : t.full('mediaLib.versions.item', {
                          version: version.version,
                          dimensions:
                            version.width !== null && version.height !== null
                              ? t.full('library.asset.dimensions', {
                                  width: version.width,
                                  height: version.height,
                                })
                              : version.mimeType,
                          size: formatBytes(t.locale, version.bytes),
                          date: formatDateTime(t.locale, version.createdAt, {
                            timeZone,
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }),
                        })}
                  </span>
                  {version.version === asset.currentVersion ? (
                    <span className="text-label text-text-tertiary">
                      {t.full('mediaLib.versions.current')}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-body-sm text-text-tertiary">
            {t.full('composer.media.originalPreserved')}
          </p>
        </TabsContent>
      </Tabs>

      {asset.kind === 'image' ? (
        <section aria-labelledby="media-editor-heading" className="flex flex-col gap-2">
          <h3 id="media-editor-heading" className="text-title-sm text-text-primary">
            {t.full('mediaLib.derivative.heading')}
          </h3>
          <p className="text-body-sm text-text-secondary">
            {t.full('mediaLib.derivative.originalKept')}
          </p>
          <div>
            <Button
              variant="secondary"
              iconStart={<Crop aria-hidden />}
              disabled={!asset.storageAvailable}
              onClick={() => setEditorOpen(true)}
            >
              {t.full('mediaLib.derivative.openEditor', {
                name: asset.name ?? t.full('common.unavailable'),
              })}
            </Button>
          </div>
          <DerivativeDialog
            open={editorOpen}
            onOpenChange={setEditorOpen}
            source={{
              id: asset.id,
              name: asset.name,
              mimeType: asset.mimeType,
              byteSize: asset.bytes,
              width: asset.width,
              height: asset.height,
            }}
          />
        </section>
      ) : (
        <Notice
          tone="info"
          title={t.full('mediaLib.derivative.unsupportedTitle')}
          description={t.full('mediaLib.derivative.unsupportedBody')}
        />
      )}
    </div>
  );
}
