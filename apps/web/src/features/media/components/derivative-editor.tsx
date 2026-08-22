'use client';

/**
 * The non-generative picture editor.
 *
 * Five controls, all of which change pixels that are already in the file: crop,
 * rotate, resize, format and quality. There is no prompt field, no model
 * choice, no reference image and no generate action, here or anywhere else in
 * this product.
 *
 * Two accessibility decisions are load bearing rather than incidental. The crop
 * is set with number fields, so the operation has a keyboard path and is never
 * drag only. And the projected size is stated in words next to the fields, so
 * the result of a change is readable rather than only visible.
 *
 * Saving does not replace anything. It asks for a version; the original stays
 * exactly where it was and stays selectable.
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
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import {
  EMPTY_DERIVATIVE_PLAN,
  clampCrop,
  projectedSize,
  toDerivativeOperations,
  type DerivativePlan,
} from '../state/derivative-plan';
import type { DerivativeFormat, DerivativeOperation } from '../state/derivatives-api';

const KEEP_FORMAT = 'keep';
const FORMATS: readonly DerivativeFormat[] = ['image/jpeg', 'image/png', 'image/webp'];

export interface DerivativeEditorSource {
  readonly id: string;
  readonly name: string | null;
  readonly mimeType: string;
  readonly width: number | null;
  readonly height: number | null;
}

export interface DerivativeEditorProps {
  readonly source: DerivativeEditorSource;
  readonly onApply: (operations: readonly DerivativeOperation[]) => Promise<void>;
  readonly onCancel: () => void;
  readonly busy?: boolean;
  /** A refusal from the boundary, already resolved to a sentence. */
  readonly failure?: string | null;
}

interface PixelFieldProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
}

function PixelField({ label, value, min, max, onChange }: PixelFieldProps): ReactNode {
  return (
    <Field label={label}>
      {(control) => (
        <Input
          id={control.id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : min);
          }}
        />
      )}
    </Field>
  );
}

export function DerivativeEditor({
  source,
  onApply,
  onCancel,
  busy = false,
  failure = null,
}: DerivativeEditorProps): ReactNode {
  const t = useTranslations();
  const [plan, setPlan] = useState<DerivativePlan>(EMPTY_DERIVATIVE_PLAN);
  const [lockRatio, setLockRatio] = useState(true);

  const operations = useMemo(() => toDerivativeOperations(plan), [plan]);
  const projected = projectedSize(source, plan);
  const dirty = operations.length > 0;

  const patch = (next: Partial<DerivativePlan>): void =>
    setPlan((current) => ({ ...current, ...next }));

  const crop = plan.crop ?? {
    x: 0,
    y: 0,
    width: source.width ?? 1,
    height: source.height ?? 1,
  };
  const patchCrop = (next: Partial<typeof crop>): void =>
    patch({ crop: clampCrop(source, { ...crop, ...next }) });

  const ratio =
    source.width !== null && source.height !== null && source.width > 0
      ? source.height / source.width
      : 1;
  const resize = plan.resize ?? {
    width: projected?.width ?? source.width ?? 1,
    height: projected?.height ?? source.height ?? 1,
  };

  return (
    <section aria-labelledby="derivative-editor-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="derivative-editor-heading" className="text-title-md text-text-primary">
          {t.full('mediaLib.derivative.heading')}
        </h2>
        <p className="text-body-sm text-text-secondary">
          {t.full('mediaLib.derivative.description')}
        </p>
      </div>

      <Tabs defaultValue="crop">
        <TabsList>
          <TabsTrigger value="crop">{t.full('mediaLib.derivative.tab.crop')}</TabsTrigger>
          <TabsTrigger value="transform">{t.full('mediaLib.derivative.tab.transform')}</TabsTrigger>
          <TabsTrigger value="output">{t.full('mediaLib.derivative.tab.output')}</TabsTrigger>
        </TabsList>

        <TabsContent value="crop" className="flex flex-col gap-3 pt-3">
          <p className="text-body-sm text-text-tertiary">
            {t.full('mediaLib.derivative.cropHint')}
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <PixelField
              label={t.full('mediaLib.derivative.cropX')}
              value={crop.x}
              min={0}
              max={Math.max(0, (source.width ?? 1) - 1)}
              onChange={(value) => patchCrop({ x: value })}
            />
            <PixelField
              label={t.full('mediaLib.derivative.cropY')}
              value={crop.y}
              min={0}
              max={Math.max(0, (source.height ?? 1) - 1)}
              onChange={(value) => patchCrop({ y: value })}
            />
            <PixelField
              label={t.full('mediaLib.derivative.cropWidth')}
              value={crop.width}
              min={1}
              max={source.width ?? crop.width}
              onChange={(value) => patchCrop({ width: value })}
            />
            <PixelField
              label={t.full('mediaLib.derivative.cropHeight')}
              value={crop.height}
              min={1}
              max={source.height ?? crop.height}
              onChange={(value) => patchCrop({ height: value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="transform" className="flex flex-col gap-3 pt-3">
          <Field label={t.full('mediaLib.derivative.rotate')}>
            {(control) => (
              <Select
                value={String(plan.rotateDegrees)}
                onValueChange={(value) =>
                  patch({ rotateDegrees: Number(value) as DerivativePlan['rotateDegrees'] })
                }
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t.full('mediaLib.derivative.rotateNone')}</SelectItem>
                  {[90, 180, 270].map((degrees) => (
                    <SelectItem key={degrees} value={String(degrees)}>
                      {t.full('mediaLib.derivative.rotateDegrees', { degrees })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <PixelField
              label={t.full('mediaLib.derivative.resizeWidth')}
              value={resize.width}
              min={1}
              max={projected?.width ?? source.width ?? resize.width}
              onChange={(value) =>
                patch({
                  resize: {
                    width: value,
                    height: lockRatio ? Math.max(1, Math.round(value * ratio)) : resize.height,
                  },
                })
              }
            />
            <PixelField
              label={t.full('mediaLib.derivative.resizeHeight')}
              value={resize.height}
              min={1}
              max={projected?.height ?? source.height ?? resize.height}
              onChange={(value) =>
                patch({
                  resize: {
                    height: value,
                    width:
                      lockRatio && ratio > 0
                        ? Math.max(1, Math.round(value / ratio))
                        : resize.width,
                  },
                })
              }
            />
          </div>

          <label className="text-body-sm text-text-primary flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              className="size-6"
              checked={lockRatio}
              onChange={(event) => setLockRatio(event.target.checked)}
            />
            {t.full('mediaLib.derivative.lockRatio')}
          </label>
        </TabsContent>

        <TabsContent value="output" className="flex flex-col gap-3 pt-3">
          <Field label={t.full('mediaLib.derivative.format')}>
            {(control) => (
              <Select
                value={plan.format ?? KEEP_FORMAT}
                onValueChange={(value) =>
                  patch({ format: value === KEEP_FORMAT ? null : (value as DerivativeFormat) })
                }
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={KEEP_FORMAT}>
                    {t.full('mediaLib.derivative.formatSame')}
                  </SelectItem>
                  {FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          {plan.format === 'image/png' ? null : (
            <Field label={t.full('mediaLib.derivative.quality')}>
              {(control) => (
                <Slider
                  id={control.id}
                  min={1}
                  max={100}
                  step={1}
                  value={[plan.quality ?? 82]}
                  thumbLabels={[t.full('mediaLib.derivative.quality')]}
                  onValueChange={(value) => patch({ quality: value[0] ?? 82 })}
                />
              )}
            </Field>
          )}
          <p className="text-body-sm text-text-tertiary">
            {t.full('mediaLib.derivative.qualityHint')}
          </p>
        </TabsContent>
      </Tabs>

      <p className="text-body-sm text-text-secondary">
        {projected === null
          ? t.full('mediaLib.derivative.projectedUnavailable')
          : t.full('mediaLib.derivative.projected', {
              width: projected.width,
              height: projected.height,
            })}
      </p>

      <Notice tone="info" title={t.full('mediaLib.derivative.nonGenerative')} />
      <p className="text-body-sm text-text-secondary">
        {t.full('mediaLib.derivative.originalKept')}
      </p>

      {failure === null ? null : (
        <Notice
          tone="destructive"
          title={t.full('mediaLib.derivative.failedTitle')}
          description={failure}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={!dirty}
          loading={busy}
          loadingLabel={t.full('mediaLib.derivative.applying')}
          onClick={() => {
            void onApply(operations);
          }}
        >
          {t.full('mediaLib.derivative.apply')}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {t.full('mediaLib.derivative.discard')}
        </Button>
        {dirty ? null : (
          <span className="text-body-sm text-text-tertiary self-center">
            {t.full('mediaLib.derivative.noChanges')}
          </span>
        )}
      </div>
    </section>
  );
}
