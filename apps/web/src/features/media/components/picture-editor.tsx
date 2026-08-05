'use client';

/**
 * The picture editor.
 *
 * Crop, resize, rotate, flip, canvas, format conversion, compression and video
 * thumbnail. Every one of those changes pixels that are already in the file.
 * There is no prompt field, no model choice and no generate action, here or
 * anywhere else in Relay.
 *
 * The crop box is set with number fields rather than a drag handle, because no
 * operation in this product may be drag only. Saving writes a new version and
 * leaves the original addressable.
 */

import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';

import {
  estimateBytes,
  planChangesAnything,
  projectedDimensions,
  type AccountRule,
} from '../state/media-rules.js';
import { aspectPresetsFor } from '../state/media-rules.js';
import { CheckRow } from '../../composer/components/form-rows.js';
import {
  CanvasTab,
  currentPresetId,
  FREE_PRESET,
  NumberField,
  OutputTab,
  withCrop,
} from './picture-editor-fields.js';
import {
  IDENTITY_EDIT_PLAN,
  type MediaAsset,
  type MediaEditPlan,
  type OutputFormat,
} from '../types.js';

export interface PictureEditorProps {
  readonly asset: MediaAsset;
  readonly rules: readonly AccountRule[];
  readonly onSave: (plan: MediaEditPlan) => Promise<void>;
  readonly onCancel: () => void;
}

export function PictureEditor({ asset, rules, onSave, onCancel }: PictureEditorProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [plan, setPlan] = useState<MediaEditPlan>({
    ...IDENTITY_EDIT_PLAN,
    format: asset.mimeType as OutputFormat,
  });
  const [lockRatio, setLockRatio] = useState(true);
  const [saving, setSaving] = useState(false);

  const presets = useMemo(() => aspectPresetsFor(rules), [rules]);
  const projected = projectedDimensions(asset, plan);
  const estimated = estimateBytes(asset, plan);
  const dirty = planChangesAnything(plan, asset.mimeType);
  const nextVersion = asset.currentVersion + 1;

  const patch = (next: Partial<MediaEditPlan>): void =>
    setPlan((current) => ({ ...current, ...next }));

  const applyPreset = (presetId: string): void => {
    if (presetId === FREE_PRESET || asset.width === null || asset.height === null) {
      patch({ crop: null });
      return;
    }
    const preset = presets.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }
    // Largest centred rectangle of this ratio that fits inside the original.
    const wide = asset.width / asset.height > preset.ratio;
    const width = wide ? Math.round(asset.height * preset.ratio) : asset.width;
    const height = wide ? asset.height : Math.round(asset.width / preset.ratio);
    patch({
      crop: {
        x: Math.round((asset.width - width) / 2),
        y: Math.round((asset.height - height) / 2),
        width,
        height,
      },
    });
  };

  const save = (): void => {
    setSaving(true);
    onSave(plan)
      .then(() => {
        announce(t.full('mediaLib.editor.saved', { version: nextVersion }), 'polite');
      })
      .finally(() => setSaving(false));
  };

  return (
    <section aria-labelledby="picture-editor-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="picture-editor-heading" className="text-title-md text-text-primary">
          {t.full('mediaLib.editor.heading')}
        </h2>
        <p className="text-body-sm text-text-secondary">{t.full('mediaLib.editor.description')}</p>
      </div>

      <Tabs defaultValue="crop">
        <TabsList>
          <TabsTrigger value="crop">{t.full('mediaLib.editor.tab.crop')}</TabsTrigger>
          <TabsTrigger value="transform">{t.full('mediaLib.editor.tab.transform')}</TabsTrigger>
          <TabsTrigger value="canvas">{t.full('mediaLib.editor.tab.canvas')}</TabsTrigger>
          <TabsTrigger value="output">{t.full('mediaLib.editor.tab.output')}</TabsTrigger>
          {asset.kind === 'video' ? (
            <TabsTrigger value="thumbnail">{t.full('mediaLib.editor.tab.thumbnail')}</TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value="crop" className="flex flex-col gap-3 pt-3">
          <Field label={t.full('mediaLib.editor.presetLabel')}>
            {(control) => (
              <Select
                value={plan.crop === null ? FREE_PRESET : currentPresetId(plan, presets)}
                onValueChange={applyPreset}
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FREE_PRESET}>
                    {t.full('mediaLib.editor.presetFree')}
                  </SelectItem>
                  {presets.map((preset) => (
                    <SelectItem
                      key={preset.id}
                      value={preset.id}
                      description={preset.accountLabels.join(', ')}
                    >
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <p className="text-body-sm text-text-tertiary">
            {t.full('mediaLib.editor.cropKeyboardHint')}
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <NumberField
              label={t.full('mediaLib.editor.cropX')}
              value={plan.crop?.x ?? 0}
              max={asset.width ?? 0}
              onChange={(value) => patch({ crop: withCrop(plan, asset, { x: value }) })}
            />
            <NumberField
              label={t.full('mediaLib.editor.cropY')}
              value={plan.crop?.y ?? 0}
              max={asset.height ?? 0}
              onChange={(value) => patch({ crop: withCrop(plan, asset, { y: value }) })}
            />
            <NumberField
              label={t.full('mediaLib.editor.cropWidth')}
              value={plan.crop?.width ?? asset.width ?? 0}
              max={asset.width ?? 0}
              onChange={(value) => patch({ crop: withCrop(plan, asset, { width: value }) })}
            />
            <NumberField
              label={t.full('mediaLib.editor.cropHeight')}
              value={plan.crop?.height ?? asset.height ?? 0}
              max={asset.height ?? 0}
              onChange={(value) => patch({ crop: withCrop(plan, asset, { height: value }) })}
            />
          </div>
        </TabsContent>

        <TabsContent value="transform" className="flex flex-col gap-3 pt-3">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <NumberField
              label={t.full('mediaLib.editor.widthLabel')}
              value={plan.resize?.width ?? projected?.width ?? 0}
              max={20_000}
              onChange={(value) => {
                const ratio = asset.width && asset.height ? asset.height / asset.width : 1;
                patch({
                  resize: {
                    width: value,
                    height: lockRatio
                      ? Math.max(1, Math.round(value * ratio))
                      : (plan.resize?.height ?? projected?.height ?? value),
                  },
                });
              }}
            />
            <NumberField
              label={t.full('mediaLib.editor.heightLabel')}
              value={plan.resize?.height ?? projected?.height ?? 0}
              max={20_000}
              onChange={(value) => {
                const ratio = asset.width && asset.height ? asset.width / asset.height : 1;
                patch({
                  resize: {
                    height: value,
                    width: lockRatio
                      ? Math.max(1, Math.round(value * ratio))
                      : (plan.resize?.width ?? projected?.width ?? value),
                  },
                });
              }}
            />
          </div>

          <CheckRow
            checked={lockRatio}
            onCheckedChange={setLockRatio}
            label={t.full('mediaLib.editor.lockRatio')}
          />

          <Field label={t.full('mediaLib.editor.rotateLabel')}>
            {(control) => (
              <Select
                value={String(plan.rotateDegrees)}
                onValueChange={(value) =>
                  patch({ rotateDegrees: Number(value) as MediaEditPlan['rotateDegrees'] })
                }
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 90, 180, 270].map((degrees) => (
                    <SelectItem key={degrees} value={String(degrees)}>
                      {t.full('mediaLib.editor.rotateDegrees', { degrees })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <CheckRow
            checked={plan.flipHorizontal}
            onCheckedChange={(checked) => patch({ flipHorizontal: checked })}
            label={t.full('mediaLib.editor.flipHorizontal')}
          />
          <CheckRow
            checked={plan.flipVertical}
            onCheckedChange={(checked) => patch({ flipVertical: checked })}
            label={t.full('mediaLib.editor.flipVertical')}
          />
        </TabsContent>

        <TabsContent value="canvas">
          <CanvasTab plan={plan} patch={patch} />
        </TabsContent>

        <TabsContent value="output">
          <OutputTab plan={plan} patch={patch} />
        </TabsContent>

        {asset.kind === 'video' ? (
          <TabsContent value="thumbnail" className="flex flex-col gap-3 pt-3">
            <p className="text-body-sm text-text-secondary">
              {t.full('mediaLib.editor.thumbnailHelp')}
            </p>
            <Field label={t.full('composer.media.thumbnail')}>
              {(control) => (
                <Input
                  id={control.id}
                  value={plan.thumbnailMediaId ?? ''}
                  placeholder={asset.thumbnailMediaId ?? ''}
                  onChange={(event) =>
                    patch({
                      thumbnailMediaId: event.target.value.length === 0 ? null : event.target.value,
                    })
                  }
                />
              )}
            </Field>
          </TabsContent>
        ) : null}
      </Tabs>

      <dl className="border-border-subtle flex flex-col gap-1 border-t pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-label text-text-tertiary">{t.full('mediaLib.column.size')}</dt>
          <dd className="text-body-sm text-text-primary tabular-nums">
            {estimated === null
              ? t.full('mediaLib.editor.estimatedSizeUnknown')
              : t.full('mediaLib.editor.estimatedSize', {
                  size: formatBytes(t.locale, estimated),
                  original: formatBytes(t.locale, asset.bytes),
                })}
          </dd>
        </div>
        {projected ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-label text-text-tertiary">
              {t.full('mediaLib.editor.widthLabel')}
            </dt>
            <dd className="text-body-sm text-text-primary tabular-nums">
              {t.full('library.asset.dimensions', {
                width: projected.width,
                height: projected.height,
              })}
            </dd>
          </div>
        ) : null}
      </dl>

      <Notice tone="info" title={t.full('mediaLib.editor.noGeneration')} />
      <p className="text-body-sm text-text-secondary">{t.full('mediaLib.editor.revalidate')}</p>
      <p className="text-body-sm text-text-secondary">
        {t.full('composer.media.originalPreserved')}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={!dirty}
          loading={saving}
          loadingLabel={t.full('mediaLib.editor.saving', { version: nextVersion })}
          onClick={save}
        >
          {t.full('mediaLib.editor.save')}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {t.full('mediaLib.editor.discard')}
        </Button>
        {dirty ? null : (
          <span className="text-body-sm text-text-tertiary self-center">
            {t.full('mediaLib.editor.noChanges')}
          </span>
        )}
      </div>
    </section>
  );
}
