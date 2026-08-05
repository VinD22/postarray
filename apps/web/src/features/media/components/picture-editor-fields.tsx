'use client';

/**
 * The picture editor's smaller pieces: a clamped number field, the canvas and
 * output tab bodies, and the two pure helpers that keep the crop rectangle
 * inside the original image.
 *
 * Split out so `picture-editor.tsx` stays readable at one screen height.
 */

import { type ReactNode } from 'react';
import {
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { MediaAsset, MediaEditPlan, OutputFormat } from '../types';

export const FREE_PRESET = 'free';

export interface NumberFieldProps {
  readonly label: string;
  readonly value: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
}

export function NumberField({ label, value, max, onChange }: NumberFieldProps): ReactNode {
  return (
    <Field label={label}>
      {(control) => (
        <Input
          id={control.id}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), max) : 0);
          }}
        />
      )}
    </Field>
  );
}

export interface TabBodyProps {
  readonly plan: MediaEditPlan;
  readonly patch: (next: Partial<MediaEditPlan>) => void;
}

export function CanvasTab({ plan, patch }: TabBodyProps): ReactNode {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3 pt-3">
      <Field label={t.full('mediaLib.editor.canvasColor')}>
        {(control) => (
          <Input
            id={control.id}
            type="color"
            value={plan.canvas?.backgroundColor ?? '#ffffff'}
            className="h-9 w-24"
            onChange={(event) =>
              patch({
                canvas: {
                  backgroundColor: event.target.value,
                  fit: plan.canvas?.fit ?? 'contain',
                },
              })
            }
          />
        )}
      </Field>

      <Field label={t.full('mediaLib.editor.canvasFit')}>
        {(control) => (
          <Select
            value={plan.canvas?.fit ?? 'contain'}
            onValueChange={(value) =>
              patch({
                canvas: {
                  backgroundColor: plan.canvas?.backgroundColor ?? '#ffffff',
                  fit: value === 'cover' ? 'cover' : 'contain',
                },
              })
            }
          >
            <SelectTrigger id={control.id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contain">{t.full('mediaLib.editor.canvasFitContain')}</SelectItem>
              <SelectItem value="cover">{t.full('mediaLib.editor.canvasFitCover')}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>
    </div>
  );
}

export function OutputTab({ plan, patch }: TabBodyProps): ReactNode {
  const t = useTranslations();
  const lossless = plan.format === 'image/png';

  return (
    <div className="flex flex-col gap-3 pt-3">
      <Field label={t.full('mediaLib.editor.formatLabel')}>
        {(control) => (
          <Select
            value={plan.format}
            onValueChange={(value) => patch({ format: value as OutputFormat })}
          >
            <SelectTrigger id={control.id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image/jpeg">image/jpeg</SelectItem>
              <SelectItem value="image/png">image/png</SelectItem>
              <SelectItem value="image/webp">image/webp</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-label text-text-secondary">
          {t.full('mediaLib.editor.qualityLabel')}
        </span>
        {/* PNG is lossless, so the control is disabled rather than pretending. */}
        <Slider
          value={[plan.quality]}
          min={10}
          max={100}
          step={1}
          disabled={lossless}
          thumbLabels={[t.full('mediaLib.editor.qualityLabel')]}
          aria-label={t.full('mediaLib.editor.qualityLabel')}
          onValueChange={(values) => patch({ quality: values[0] ?? plan.quality })}
        />
        <span className="text-body-sm text-text-tertiary tabular-nums">
          {t.full('mediaLib.editor.qualityValue', { value: plan.quality })}
        </span>
      </div>
    </div>
  );
}

/** Merge a partial crop change onto the current rectangle, or onto the whole image. */
export function withCrop(
  plan: MediaEditPlan,
  asset: MediaAsset,
  patch: Partial<NonNullable<MediaEditPlan['crop']>>,
): MediaEditPlan['crop'] {
  const base = plan.crop ?? {
    x: 0,
    y: 0,
    width: asset.width ?? 0,
    height: asset.height ?? 0,
  };
  return { ...base, ...patch };
}

/** Which aspect preset the current crop matches, if any. */
export function currentPresetId(
  plan: MediaEditPlan,
  presets: readonly { id: string; ratio: number }[],
): string {
  if (plan.crop === null || plan.crop.height === 0) {
    return FREE_PRESET;
  }
  const ratio = plan.crop.width / plan.crop.height;
  const match = presets.find((preset) => Math.abs(preset.ratio - ratio) < 0.02);
  return match?.id ?? FREE_PRESET;
}
